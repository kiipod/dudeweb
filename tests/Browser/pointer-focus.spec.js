import { expect, test } from '@playwright/test'
import { accountFixture } from './helpers/accountDashboard.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'
import { inspectControls } from './helpers/paintedFocus.js'
import { penFixture, penFrames } from './helpers/penVerification.js'

async function expectNoRing(target) {
    const rings = await target.evaluate(element => {
        const rows = []
        for (let node = element; node && node !== document.body; node = node.parentElement) {
            if (node.classList.contains('sr-only')) continue
            const css = getComputedStyle(node)
            if (css.outlineStyle !== 'none' && parseFloat(css.outlineWidth) > 0 && css.outlineColor !== 'rgba(0, 0, 0, 0)') {
                rows.push({ tag: node.tagName, classes: node.className, outline: css.outline })
            }
        }
        return rows
    })
    expect(rings).toEqual([])
}

async function keyboardRing(page) {
    await page.keyboard.press('Tab')
    let result = await inspectControls(page, { focus: true })
    if (result.focus.body) {
        await page.keyboard.press('Tab')
        result = await inspectControls(page, { focus: true })
    }
    expect(result.focus.body).not.toBe(true)
    expect(result.focus.missing).toBe(false)
    expect(result.focus.unobscured).toBe(true)
    expect(result.focus.ratio).toBeGreaterThanOrEqual(3)
}

async function pointerControls(page, touch) {
    // Isolate presentation: prevent navigations, submit/logout mutations and
    // accordion changes after native pointerdown has already focused a target.
    await page.evaluate(() => document.addEventListener('click', event => {
        if (event.target.closest('button, a[href], summary')) {
            event.preventDefault()
            event.stopImmediatePropagation()
        }
    }, true))
    const targets = await page.locator('button:visible:not(:disabled), a[href]:visible:not([href="#account-content"]):not([href="#main-content"]), input:visible:not(:disabled):not(.sr-only), textarea:visible:not(:disabled), summary:visible').all()
    let checked = 0
    for (const target of targets) {
        if (await target.evaluate(node => Boolean(node.closest('[inert], [aria-hidden="true"]')))) continue
        if (touch) await target.tap()
        else await target.click()
        await expectNoRing(target)
        checked++
    }
    // Labels forward native activation to hidden radios, retaining selection.
    for (const label of await page.locator('label:has(input[type="radio"]:not(:disabled)):visible').all()) {
        if (touch) await label.tap()
        else await label.click()
        await expectNoRing(label)
        await expect(label.locator('input')).toBeChecked()
        checked++
    }
    expect(checked).toBeGreaterThan(0)
    await expect(page.locator('html')).toHaveAttribute('data-input-method', 'pointer')
    await keyboardRing(page)
    return checked
}

for (const theme of ['light', 'dark']) for (const width of [390, 1440]) {
    for (const [component, url, title, props] of verificationRoutes) {
        test(`pointer has no ring, Tab restores focus ${component} ${width} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: 1024 })
            await page.emulateMedia({ colorScheme: theme })
            await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
            await keyboardRing(page)
            await page.evaluate(() => document.activeElement.blur())
            const checked = await pointerControls(page, false)
            await info.attach('pointer-targets', { body: JSON.stringify({ checked }), contentType: 'application/json' })
        })
    }
}

test.describe('touch presentation', () => {
    test.use({ isMobile: true, hasTouch: true })
    for (const theme of ['light', 'dark']) for (const width of [390, 768]) {
        for (const component of ['Public/Home', 'Auth/Login', 'Account/Connection', 'Account/Subscription']) {
            test(`touch has no ring ${component} ${width} ${theme}`, async ({ page, request }) => {
                await page.setViewportSize({ width, height: 1024 })
                await page.emulateMedia({ colorScheme: theme })
                const [, url, title, props] = verificationRoutes.find(row => row[0] === component)
                await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
                await pointerControls(page, true)
            })
        }
    }
})

for (const state of ['menu-open', 'more-open', 'promo-open']) for (const width of [390, 768]) {
    test(`pointer overlay focus and keyboard recovery ${state} ${width}`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: 1024 })
        const frame = penFrames.find(frame => frame.state === state && frame.width === width)
        await penFixture(page, request, frame)
        await expect(page.getByRole('dialog')).toBeVisible()
        await expectNoRing(page.locator(':focus'))
        await keyboardRing(page)
    })
}
