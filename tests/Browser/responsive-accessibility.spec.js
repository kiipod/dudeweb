import { expect, test } from '@playwright/test'
import { accountFixture, expectLayout, screenshot } from './helpers/accountDashboard.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'
import { enlargeText, inspectAccessibility, inspectTextClipping, inspectTextContrast } from './helpers/accessibility.js'
import { penFixture, penFrames } from './helpers/penVerification.js'

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
})

for (const theme of ['light', 'dark']) {
    for (const [component, url, title, props] of verificationRoutes) {
        test(`semantics and targets ${component} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width: 390, height: 844 })
            await page.emulateMedia({ colorScheme: theme })
            await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
            await expectLayout(page)
            await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
            expect(await page.evaluate(inspectAccessibility)).toEqual([])
            await info.attach('accessibility-tree', { body: await page.locator('body').ariaSnapshot(), contentType: 'text/plain' })
            const contrast = await page.evaluate(inspectTextContrast)
            await info.attach('text-contrast', { body: JSON.stringify(contrast, null, 2), contentType: 'application/json' })
            expect(contrast.checked).toBeGreaterThan(0)
            expect(contrast.failures).toEqual([])
            expect(contrast.fieldFailures).toEqual([])
        })

        test(`intermediate widths and reflow ${component} ${theme}`, async ({ page, request }, info) => {
            await page.emulateMedia({ colorScheme: theme })
            await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
            // 640/320 are the CSS viewport equivalents of 1280px at 200/400%.
            // This verifies reflow; it is not a claim of native browser zoom.
            for (const width of [320, 360, 390, 414, 600, 640, 768, 1024, 1280, 1440, 2560]) {
                await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1024 })
                await expectLayout(page)
                const clipped = await page.locator('main').evaluate(root => [...root.querySelectorAll('input,textarea,button,[role="radiogroup"]')]
                    .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
                    .filter(element => element.getBoundingClientRect().right > innerWidth + 1 || element.getBoundingClientRect().left < -1)
                    .map(element => element.outerHTML.slice(0, 180)))
                expect(clipped, `Clipped controls at ${width}px`).toEqual([])
                if ([360, 390, 768, 1440, 2560].includes(width)) {
                    await screenshot(page, info, `${component.replaceAll('/', '-')}-${theme}-${width}`)
                }
            }
        })

        test(`text enlargement ${component} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width: 320, height: 800 })
            await page.emulateMedia({ colorScheme: theme })
            await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
            await enlargeText(page)
            await expectLayout(page)
            expect(await page.evaluate(inspectTextClipping)).toEqual([])
            await screenshot(page, info, `${component.replaceAll('/', '-')}-${theme}-text-200`)
        })

        test(`forced colors ${component} ${theme}`, async ({ page, request }) => {
            await page.setViewportSize({ width: 390, height: 844 })
            await page.emulateMedia({ colorScheme: theme, forcedColors: 'active' })
            await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
            await expectLayout(page)
            expect(await page.evaluate(inspectAccessibility)).toEqual([])
            const heading = page.getByRole('heading', { level: 1 })
            expect(await heading.evaluate(element => getComputedStyle(element).color)).not.toBe('rgba(0, 0, 0, 0)')
        })
    }
}

for (const theme of ['light', 'dark']) {
    for (const variant of ['services', 'signal-orbit']) {
        for (const viewport of [{ width: 1200, height: 800 }, { width: 1440, height: 1080 }, { width: 1920, height: 1080 }, { width: 2560, height: 1440 }]) {
            test(`desktop Hero geometry ${variant} ${viewport.width}x${viewport.height} ${theme}`, async ({ page, request }) => {
                await page.setViewportSize(viewport)
                await page.emulateMedia({ colorScheme: theme })
                if (variant === 'signal-orbit') await page.route('**/images/hero/services/brands/*.svg', route => route.abort('failed'))
                await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
                const prefix = variant === 'services' ? '.service-hero' : '.landing-hero'
                if (variant === 'services') await expect(page.locator('.service-logo-cloud')).toHaveAttribute('data-state', 'ready')
                else await expect(page.locator('.landing-hero__signal')).toBeVisible()
                const header = await page.getByRole('banner').boundingBox()
                const hero = await page.locator(prefix).boundingBox()
                const content = await page.locator(`${prefix}__content`).boundingBox()
                const art = await page.locator(variant === 'services' ? '.service-logo-cloud' : '.landing-hero__signal').boundingBox()
                expect(header.height + hero.height).toBeCloseTo(viewport.height, 0)
                expect(content.y).toBeGreaterThanOrEqual(hero.y)
                expect(content.y + content.height).toBeLessThanOrEqual(hero.y + hero.height)
                expect(content.y + content.height / 2).toBeCloseTo(viewport.height / 2, 0)
                expect(art.y).toBeGreaterThanOrEqual(hero.y)
                expect(art.y + art.height).toBeLessThanOrEqual(hero.y + hero.height + 1)
                if (variant === 'services') {
                    expect(art.x).toBeGreaterThanOrEqual(content.x + content.width)
                    expect(art.x + art.width).toBeLessThanOrEqual(viewport.width + 1)
                }
                await expectLayout(page)
            })
        }
    }
}

for (const theme of ['light', 'dark']) {
    for (const variant of ['services', 'signal-orbit']) {
        for (const width of [360, 390, 768, 1440, 2560]) {
            test(`public screenshot ${variant} ${width} ${theme}`, async ({ page, request }, info) => {
                const height = width === 2560 ? 1440 : width === 1440 ? 1080 : width === 768 ? 1024 : width === 360 ? 800 : 844
                await page.setViewportSize({ width, height })
                await page.emulateMedia({ colorScheme: theme })
                if (variant === 'signal-orbit') await page.route('**/images/hero/services/brands/*.svg', route => route.abort('failed'))
                await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
                const hero = page.locator(variant === 'services' ? '.service-hero' : '.landing-hero')
                if (variant === 'services') await expect(page.locator('.service-logo-cloud')).toHaveAttribute('data-state', 'ready')
                else await expect(page.locator('.landing-hero__signal')).toBeVisible()
                const box = await hero.boundingBox()
                expect(box.height).toBeCloseTo(width < 768 ? 560 : width < 1200 ? 800 : height - (width === 2560 ? 112 : 96), 0)
                expect(await page.evaluate(inspectTextClipping)).toEqual([])
                await expectLayout(page)
                await screenshot(page, info, `public-${variant}-${width}-${theme}`)
                const heroPath = info.outputPath(`hero-${variant}-${width}-${theme}.png`)
                await hero.screenshot({ path: heroPath })
                await info.attach('hero-section', { path: heroPath, contentType: 'image/png' })
            })
        }
        test(`Hero text enlargement ${variant} ${theme}`, async ({ page, request }) => {
            await page.setViewportSize({ width: 320, height: 800 })
            await page.emulateMedia({ colorScheme: theme })
            if (variant === 'signal-orbit') await page.route('**/images/hero/services/brands/*.svg', route => route.abort('failed'))
            await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
            if (variant === 'signal-orbit') await expect(page.locator('.landing-hero__signal')).toBeVisible()
            else await expect(page.locator('.service-logo-cloud')).toHaveAttribute('data-state', 'ready')
            await enlargeText(page)
            expect(await page.evaluate(inspectTextClipping)).toEqual([])
            await expectLayout(page)
        })
    }
}
