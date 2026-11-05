import { expect, test } from '@playwright/test'

for (const width of [390, 1440, 2560]) {
    for (const theme of ['light', 'dark']) {
        test(`landing V2 route stays separate from home at ${width}px in ${theme}`, async ({ page }) => {
            const errors = []
            page.on('pageerror', error => errors.push(error.message))
            page.on('console', message => {
                if (message.type() === 'warning' && /hydration/i.test(message.text())) errors.push(message.text())
            })
            await page.setViewportSize({ width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)

            const home = await page.goto('/')
            expect(home.status()).toBe(200)
            await expect(page.locator('main h1')).toContainText('Любимые сервисы')
            await expect(page.locator('header')).toBeVisible()
            await expect(page.locator('footer')).toBeVisible()
            await expect(page.locator('[data-landing-v2]')).toHaveCount(0)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            const headerBackground = await page.locator('header').evaluate(element => getComputedStyle(element).backgroundColor)

            const landing = await page.goto('/landing')
            expect(landing.status()).toBe(200)
            await expect(page).toHaveURL(/\/landing$/)
            await expect(page.locator('main')).toHaveCount(1)
            await expect(page.locator('[data-landing-v2] main h1')).toHaveText('dudeweb')
            await expect(page.locator('header, footer')).toHaveCount(0)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            expect(await page.evaluate(() => localStorage.getItem('dudeweb-theme'))).toBe(theme)

            await page.goBack()
            await expect(page).toHaveURL(/\/$/)
            await expect(page.locator('main h1')).toContainText('Любимые сервисы')
            await expect(page.locator('[data-landing-v2]')).toHaveCount(0)
            await expect(page.locator('footer')).toBeVisible()
            expect(await page.locator('header').evaluate(element => getComputedStyle(element).backgroundColor)).toBe(headerBackground)
            expect(errors).toEqual([])
        })
    }
}
