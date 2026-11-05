import { expect, test } from '@playwright/test'
import { trackLandingV2Resources } from '../helpers/landingV2Resources.js'

const widths = [360, 390, 430, 768, 1024, 1440, 1920, 2560]

function trackErrors(page) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
        if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
    })
    return errors
}

async function motionClock(page, width = 1440) {
    await page.setViewportSize({ width, height: 1440 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.clock.install({ time: new Date('2026-11-06T12:00:00Z') })
    await page.clock.pauseAt(new Date('2026-11-06T12:00:01Z'))
    await page.goto('/landing')
    await page.evaluate(() => document.fonts.ready)
    const signal = page.locator('[data-v2-signal]')
    await signal.scrollIntoViewIfNeeded()
    await expect(signal).toHaveAttribute('data-state', 'running')
    return signal
}

async function signature(signal) {
    return signal.evaluate(element => [...element.querySelectorAll('[data-v2-signal-pair], [data-v2-signal-incoming], [data-v2-signal-wave] path, [data-v2-signal-outgoing], [data-v2-signal-ring]')].map(element => [element.getAttribute('opacity'), element.getAttribute('x1'), element.getAttribute('d'), element.getAttribute('r')]))
}

for (const width of widths) {
    for (const theme of ['light', 'dark']) {
        test(`Connection follows source motion at ${width}px with ${theme} preference`, async ({ page }, testInfo) => {
            const errors = trackErrors(page)
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            const signal = await motionClock(page, width)
            const before = await signature(signal)
            const bounds = await signal.boundingBox()
            const copy = await page.locator('[data-v2-connection] h2').boundingBox()
            await page.evaluate(() => {
                const original = Element.prototype.getBoundingClientRect
                window.__signalLayoutReads = 0
                Element.prototype.getBoundingClientRect = function (...args) {
                    if (this.matches('[data-v2-signal]') || this.closest('[data-v2-signal]')) window.__signalLayoutReads++
                    return original.apply(this, args)
                }
            })
            await page.clock.runFor(2000)
            expect(await page.evaluate(() => window.__signalLayoutReads)).toBe(0)
            const after = await signature(signal)
            expect(after).not.toEqual(before)
            const first = signal.locator('[data-v2-signal-pair]').first()
            expect(Number(await first.getAttribute('opacity'))).toBeCloseTo(0.9, 3)
            expect(await signal.locator('[data-v2-signal-pair]').evaluateAll(elements => elements.every(pair => pair.querySelector('image')?.parentElement === pair && pair.querySelector('[data-v2-signal-route]')?.parentElement === pair))).toBe(true)
            expect(await signal.locator('[data-v2-signal-pair]').evaluateAll(elements => new Set(elements.map(element => element.getAttribute('opacity'))).size)).toBeGreaterThan(1)
            expect(await signal.boundingBox()).toEqual(bounds)
            expect(await page.locator('[data-v2-connection] h2').boundingBox()).toEqual(copy)
            await expect(signal.locator('[data-v2-signal-pair]')).toHaveCount(23)
            await expect(signal.locator('[data-v2-signal-wave]')).toHaveCount(5)
            await expect(signal.locator('[data-v2-signal-ring]')).toHaveCount(3)
            await expect(signal.locator('a, button, [tabindex]')).toHaveCount(0)
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            expect(errors).toEqual([])
            if (theme === 'light' && [390, 768, 1440, 2560].includes(width)) {
                await page.locator('[data-v2-connection]').screenshot({ path: testInfo.outputPath(`connection-live-${width}.png`) })
            }
        })
    }
}

test('signal fades logo and line together with 1.1 second entry and a hidden interval', async ({ page }) => {
    const signal = await motionClock(page)
    const pair = signal.locator('[data-v2-signal-pair]').first()
    await expect(pair).toHaveAttribute('opacity', '0.00000')
    await page.clock.runFor(550)
    const half = Number(await pair.getAttribute('opacity'))
    expect(half).toBeGreaterThan(0.35)
    expect(half).toBeLessThan(0.5)
    await page.clock.runFor(650)
    expect(Number(await pair.getAttribute('opacity'))).toBeCloseTo(0.9, 3)
    await page.clock.runFor(4900)
    expect(Number(await pair.getAttribute('opacity'))).toBe(0)
    await page.clock.runFor(900)
    expect(Number(await pair.getAttribute('opacity'))).toBe(0)
    await page.clock.runFor(650)
    expect(Number(await pair.getAttribute('opacity'))).toBeGreaterThan(0)
})

test('signal pauses offscreen, in hidden documents and inert main without catching up', async ({ page }) => {
    const signal = await motionClock(page)
    await page.clock.runFor(2000)
    for (const gate of ['hidden', 'inert', 'offscreen']) {
        await page.evaluate(gate => {
            if (gate === 'hidden') {
                Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
                document.dispatchEvent(new Event('visibilitychange'))
            } else if (gate === 'inert') document.querySelector('main').inert = true
            else scrollTo(0, document.body.scrollHeight)
        }, gate)
        await expect(signal).toHaveAttribute('data-state', 'paused')
        const paused = await signature(signal)
        await page.clock.runFor(2000)
        expect(await signature(signal)).toEqual(paused)
        await page.evaluate(gate => {
            if (gate === 'hidden') {
                Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
                document.dispatchEvent(new Event('visibilitychange'))
            } else if (gate === 'inert') document.querySelector('main').inert = false
        }, gate)
        if (gate === 'offscreen') await signal.scrollIntoViewIfNeeded()
        await expect(signal).toHaveAttribute('data-state', 'running')
        const pulse = Number(await signal.locator('[data-v2-signal-incoming]').first().getAttribute('x1'))
        await page.clock.runFor(250)
        const moved = Number(await signal.locator('[data-v2-signal-incoming]').first().getAttribute('x1')) - pulse
        expect(moved).toBeGreaterThan(5)
        expect(moved).toBeLessThan(16)
    }
})

test('motion preference changes restore all 23 pairs and freeze waves at source phase zero', async ({ page }) => {
    const signal = await motionClock(page)
    await page.clock.runFor(1500)
    const moving = await signature(signal)
    for (const media of [{ reducedMotion: 'reduce' }, { reducedMotion: 'no-preference', forcedColors: 'active' }]) {
        await page.emulateMedia(media)
        await expect(signal).toHaveAttribute('data-state', 'static')
        const frame = await signature(signal)
        expect(frame).not.toEqual(moving)
        expect(await signal.locator('[data-v2-signal-pair]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '0.82'))).toBe(true)
        await page.clock.runFor(1500)
        expect(await signature(signal)).toEqual(frame)
    }
    await page.emulateMedia({ forcedColors: 'none' })
    await expect(signal).toHaveAttribute('data-state', 'running')
    await page.clock.runFor(1500)
    expect(await signature(signal)).not.toEqual(moving)
})

test('all real mobile menu anchors focus their section, including repeated Pricing navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/landing')
    for (const [label, id] of [['Преимущества', 'advantages'], ['Устройства', 'devices'], ['Тарифы', 'pricing'], ['Тарифы', 'pricing']]) {
        await page.getByRole('button', { name: 'Открыть меню' }).click()
        const dialog = page.getByRole('dialog')
        await dialog.getByRole('link', { name: label, exact: true }).focus()
        await page.keyboard.press('Enter')
        await expect(page.locator(`#${id}`)).toBeFocused()
        await expect(page).toHaveURL(new RegExp(`#${id}$`))
        await expect(dialog).toHaveCount(0)
        expect(await page.locator('body').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden')
        expect(await page.locator('main').evaluate(element => element.inert)).toBe(false)
    }
})

test('existing subscription CTA and Back restore scroll and leave no menu lock', async ({ page }) => {
    const errors = trackErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/landing#pricing')
    await page.evaluate(() => document.fonts.ready)
    const action = page.locator('[data-v2-period-selector] a[href="/register"]')
    await action.scrollIntoViewIfNeeded()
    const position = await page.evaluate(() => scrollY)
    await action.click()
    await expect(page).toHaveURL(/\/register$/)
    await page.goBack()
    await expect(page).toHaveURL(/\/landing#pricing$/)
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(position, 0)
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden')
    expect(await page.locator('main').evaluate(element => element.inert)).toBe(false)
    expect(errors).toEqual([])
})

test('CTA hover pressed and focus preserve bounds; footer links expose underline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/landing')
    await page.evaluate(() => document.fonts.ready)
    const action = page.locator('[data-v2-hero-cta]')
    const bounds = await action.boundingBox()
    await action.hover()
    await expect(action).toHaveCSS('background-color', 'rgb(164, 174, 255)')
    await page.mouse.down()
    await expect(action).toHaveCSS('background-color', 'rgb(125, 137, 239)')
    await page.mouse.move(0, 0)
    await page.mouse.up()
    expect(await action.boundingBox()).toEqual(bounds)
    await page.keyboard.press('Tab')
    await action.focus()
    await expect(action).toHaveCSS('outline-width', '2px')
    await expect(action).toHaveCSS('outline-offset', '3px')
    const link = page.locator('[data-v2-footer] a[href="#pricing"]')
    await link.hover()
    await expect(link).toHaveCSS('color', 'rgb(79, 85, 216)')
    await expect(link).toHaveCSS('text-decoration-line', 'underline')
    await page.keyboard.press('Tab')
    await link.focus()
    await expect(link).toHaveCSS('outline-width', '2px')
    await expect(link).toHaveCSS('text-decoration-line', 'underline')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(action).toHaveCSS('transition-property', 'none')
})

test('Inertia unmount disconnects V2 observers, cancels RAF and does not accumulate global listeners', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(trackLandingV2Resources)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/landing')
    await page.evaluate(() => document.fonts.ready)
    const identity = await page.evaluate(() => window.__v2ResourceTracker.identity)
    let baseline
    for (let cycle = 0; cycle < 3; cycle++) {
        const signal = page.locator('[data-v2-signal]')
        await signal.scrollIntoViewIfNeeded()
        await expect(signal).toHaveAttribute('data-state', 'running')
        expect((await page.evaluate(() => window.__v2ResourceTracker.stats())).v2Observers).toBeGreaterThan(0)
        // Navigate while Connection remains onscreen and its frame callback is active.
        await page.locator('header a[href="/login"]').evaluate(element => element.click())
        await expect(page).toHaveURL(/\/login$/)
        await expect(page.locator('[data-landing-v2]')).toHaveCount(0)
        await expect.poll(() => page.evaluate(() => window.__v2ResourceTracker.stats().frames)).toBe(0)
        const state = await page.evaluate(() => window.__v2ResourceTracker.stats())
        expect(state.v2Observers).toBe(0)
        if (baseline) expect(state.listeners).toEqual(baseline)
        else baseline = state.listeners
        expect(await page.evaluate(() => window.__v2ResourceTracker.identity)).toBe(identity)
        if (cycle < 2) {
            await page.goBack()
            await expect(page.locator('[data-v2-signal]')).toHaveCount(1)
        }
    }
    expect(errors).toEqual([])
})

test('touch can scroll the live diagram and use menu and subscription without hover', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    const errors = trackErrors(page)
    await page.goto('/landing')
    const signal = page.locator('[data-v2-signal]')
    await signal.scrollIntoViewIfNeeded()
    await expect(signal).toHaveAttribute('data-state', 'running')
    await signal.tap()
    await expect(page).toHaveURL(/\/landing$/)
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden')
    await page.getByRole('button', { name: 'Открыть меню' }).tap()
    await page.getByRole('dialog').getByRole('link', { name: 'Тарифы', exact: true }).tap()
    await expect(page.locator('#pricing')).toBeFocused()
    await expect(signal).toHaveAttribute('data-state', 'paused')
    await expect(page.locator('[data-v2-period-selector] fieldset')).toBeVisible()
    expect(errors).toEqual([])
    await context.close()
})
