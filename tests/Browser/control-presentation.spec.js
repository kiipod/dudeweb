import { expect, test } from '@playwright/test'
import { accountFixture, inertiaResponse, screenshot } from './helpers/accountDashboard.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'
import { penFixture, penFrames } from './helpers/penVerification.js'
import { inspectControlPresentation } from './helpers/controlPresentation.js'
import { inspectTextContrast } from './helpers/accessibility.js'

async function fixture(page, request, component, theme, width) {
    const [, url, title, props] = verificationRoutes.find(row => row[0] === component)
    const frame = penFrames.find(frame => frame.component === component && frame.theme === theme && frame.width === width && ['default', 'canceled'].includes(frame.state))
    if (frame) await penFixture(page, request, frame)
    else await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
}

async function assertFocus(page) {
    const { focus } = await page.evaluate(inspectControlPresentation, { focus: true })
    if (focus.body) return focus
    expect(focus.missing, `Missing painted focus: ${focus.element}`).toBe(false)
    expect(focus.visibleFocus, focus.element).toBe(true)
    expect(focus.unobscured, `Obscured focus: ${focus.element}`).toBe(true)
    expect(focus.width).toBeGreaterThanOrEqual(2)
    if (!focus.manual) expect(focus.ratio, `Focus contrast: ${focus.element}`).toBeGreaterThanOrEqual(3)
    return focus
}

async function assertIcons(page) {
    const { icons } = await page.evaluate(inspectControlPresentation, { icons: true })
    expect(icons.filter(icon => !icon.manual && icon.ratio < 3)).toEqual([])
    return icons
}

for (const theme of ['light', 'dark']) for (const width of [390, 1440]) {
    for (const [component] of verificationRoutes) {
        test(`focus and control contrast ${component} ${width} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request, component, theme, width)
            const focusRows = []
            let repeated = false
            for (let step = 0; step < 90; step++) {
                await page.keyboard.press('Tab')
                const seen = await page.evaluate(() => {
                    if (document.activeElement === document.body) return false
                    window.__controlFocusSeen ??= new WeakSet()
                    if (window.__controlFocusSeen.has(document.activeElement)) return true
                    window.__controlFocusSeen.add(document.activeElement)
                    return false
                })
                if (seen) { repeated = true; break }
                const row = await assertFocus(page)
                if (!row.body) focusRows.push(row)
            }
            expect(repeated, 'Complete keyboard cycle').toBe(true)
            expect(focusRows.length).toBeGreaterThan(0)
            await info.attach('keyboard-focus', { body: JSON.stringify(focusRows, null, 2), contentType: 'application/json' })
            // End keyboard-only skip-link focus before evaluating pointer states.
            await page.evaluate(() => document.activeElement.blur())
            const states = [{ state: 'default', icons: await assertIcons(page) }]
            for (const control of await page.locator('button:visible:not(:disabled), a[href]:visible:not([href="#main-content"]):not([href="#account-content"])').all()) {
                if (await control.evaluate(element => Boolean(element.closest('[inert], [aria-hidden="true"]')))) continue
                await control.hover()
                const contrast = await page.evaluate(inspectTextContrast)
                expect(contrast.failures).toEqual([])
                states.push({ state: 'hover', label: await control.getAttribute('aria-label') || await control.innerText(), icons: await assertIcons(page) })
            }
            await info.attach('icon-states', { body: JSON.stringify(states, null, 2), contentType: 'application/json' })
        })
    }
}

for (const theme of ['light', 'dark']) for (const width of [390, 768]) {
    for (const overlay of ['public-menu', 'more', 'promo']) {
        test(`overlay focus and icons ${overlay} ${width} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request, overlay === 'public-menu' ? 'Public/Home' : 'Account/Subscription', theme, width)
            const trigger = page.getByRole('button', { name: { 'public-menu': 'Открыть меню', more: 'Ещё', promo: 'У меня есть промокод' }[overlay], exact: true })
            await trigger.focus()
            await page.keyboard.press('Enter')
            await expect(page.getByRole('dialog')).toBeVisible()
            const rows = []
            for (let step = 0; step < 12; step++) { rows.push(await assertFocus(page)); await page.keyboard.press(step % 2 ? 'Shift+Tab' : 'Tab') }
            await assertIcons(page)
            await info.attach('overlay-focus', { body: JSON.stringify(rows, null, 2), contentType: 'application/json' })
        })
    }
}

for (const theme of ['light', 'dark']) for (const width of [390, 1440]) {
    for (const [component, group] of [
        ['Public/Home', 'landing-period'], ['Account/Subscription', 'subscription-period'],
        ['Account/Connection', 'connection-platform'], ['Account/Profile', 'profile-theme'],
    ]) {
        test(`radio selection ${group} ${width} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request, component, theme, width)
            const inputs = page.locator(`input[name="${group}"]`)
            const count = await inputs.count()
            expect(count).toBeGreaterThan(1)
            const before = await inputs.evaluateAll(nodes => nodes.findIndex(node => node.checked))
            const next = (before + 1) % count
            await inputs.nth(before).press('ArrowRight')
            await expect(inputs.nth(next)).toBeChecked()
            await expect(inputs.nth(next)).toBeFocused()
            await assertFocus(page)
            const selected = await inputs.nth(next).locator('..').evaluate(element => {
                const css = getComputedStyle(element)
                return { background: css.backgroundColor, color: css.color, weight: css.fontWeight, border: css.borderTopColor }
            })
            const other = await inputs.nth(before).locator('..').evaluate(element => {
                const css = getComputedStyle(element)
                return { background: css.backgroundColor, color: css.color, weight: css.fontWeight, border: css.borderTopColor }
            })
            expect(selected).not.toEqual(other)
            expect((await page.evaluate(inspectTextContrast)).failures).toEqual([])
            if (group === 'profile-theme') {
                await expect(page.locator('html')).toHaveAttribute('data-theme', await inputs.nth(next).inputValue())
            }
            await screenshot(page, info, `selected-${group}-${width}-${theme}`, { fullPage: false })
        })
    }
    test(`auth error, loading and disabled appearance ${width} ${theme}`, async ({ page, request }, info) => {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme: theme })
        const server = await accountFixture(page, request, { errors: {} }, { component: 'Auth/Login', url: '/login', title: 'С возвращением, Dude.' })
        let release
        let attempts = 0
        const held = new Promise(resolve => { release = resolve })
        await page.route('**/login', async route => {
            if (route.request().method() !== 'POST') return route.fallback()
            attempts++
            if (attempts === 1) server.props.errors = { email: 'Проверь адрес почты.' }
            else { await held; server.props.errors = {} }
            await inertiaResponse(route, server.page())
        })
        const fill = async () => {
            await page.getByLabel('Email', { exact: true }).fill('fixture@example.test')
            await page.getByLabel('Пароль', { exact: true }).fill('fixture-password-123')
        }
        const submit = page.locator('form button[type="submit"]')
        await fill()
        await submit.click()
        await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true')
        expect((await page.evaluate(inspectTextContrast)).failures).toEqual([])
        await screenshot(page, info, `auth-error-${width}-${theme}`, { fullPage: false })
        await fill()
        const before = await submit.boundingBox()
        await submit.click()
        try {
            await expect(submit).toBeDisabled()
            await expect(submit).toHaveAccessibleName('Входим…')
            await expect(submit).toHaveAttribute('aria-busy', 'true')
            await expect(page.getByLabel('Email', { exact: true })).toBeDisabled()
            await expect(page.getByRole('button', { name: 'Показать пароль' })).toBeDisabled()
            expect((await submit.boundingBox()).height).toBe(before.height)
            await expect(submit).toHaveCSS('opacity', '0.6')
            await screenshot(page, info, `auth-loading-${width}-${theme}`, { fullPage: false })
        } finally { release() }
        await expect(submit).toBeEnabled()
    })
}
