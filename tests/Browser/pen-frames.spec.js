import { expect, test } from '@playwright/test'
import { screenshot } from './helpers/accountDashboard.js'
import { penFixture, penFrames } from './helpers/penVerification.js'
import { inspectAccessibility, inspectTextContrast } from './helpers/accessibility.js'

for (const frame of penFrames.filter(frame => frame.route)) {
    test(`Pen ${frame.id} ${frame.name}`, async ({ page, request }, info) => {
        page.on('pageerror', error => { throw error })
        await page.setViewportSize({ width: frame.width, height: frame.viewportHeight })
        await page.emulateMedia({ colorScheme: frame.theme })
        await penFixture(page, request, frame)
        if (frame.typography?.heading) {
            const actual = await page.locator('main h1').evaluate(element => {
                const css = getComputedStyle(element)
                return { fontSize: parseFloat(css.fontSize), lineHeight: parseFloat(css.lineHeight), letterSpacing: parseFloat(css.letterSpacing) || 0 }
            })
            for (const [property, expected] of Object.entries(frame.typography.heading)) {
                if (property === 'sourceNode') continue
                expect(Math.abs(actual[property] - expected), `${property} vs live Pen ${frame.typography.heading.sourceNode}`).toBeLessThanOrEqual(.51)
            }
        }
        if (frame.typography?.brand) {
            const actual = await page.locator('[role="img"][aria-label="dudeweb"]').filter({ visible: true }).first().locator('span').last().evaluate(element => {
                const css = getComputedStyle(element)
                return { fontSize: parseFloat(css.fontSize), letterSpacing: parseFloat(css.letterSpacing) || 0 }
            })
            expect(Math.abs(actual.fontSize - frame.typography.brand.fontSize)).toBeLessThanOrEqual(.51)
            expect(Math.abs(actual.letterSpacing - frame.typography.brand.letterSpacing)).toBeLessThanOrEqual(.01)
        }
        for (const control of frame.typography?.controls ?? []) {
            const weight = await page.locator(control.selector).first().evaluate(element => Number(getComputedStyle(element).fontWeight))
            expect(weight, `weight vs live Pen ${control.sourceNode}`).toBe(control.fontWeight)
        }
        if (frame.component === 'Account/Referral/Terms') {
            await expect(page.getByRole('list', { name: 'Как работает программа' }).locator(':scope > li')).toHaveCount(4)
            await expect(page.getByRole('table', { name: 'Бонус за оплаченный другом период подписки' }).locator('tr')).toHaveCount(4)
            await expect(page.locator('table th[scope="row"]')).toHaveCount(4)
            const rewardColors = await page.locator('table td').evaluateAll(cells => cells.map(cell => getComputedStyle(cell).color))
            expect(rewardColors).toEqual(Array(4).fill(frame.theme === 'dark' ? 'rgb(86, 214, 174)' : 'rgb(34, 117, 93)'))
            const tableTypography = await page.locator('table td').first().evaluate(cell => getComputedStyle(cell).fontFamily)
            expect(tableTypography).toContain('IBM Plex Sans')
            const separators = await page.locator('table tr').evaluateAll(rows => rows.map(row => parseFloat(getComputedStyle(row).borderBottomWidth)))
            expect(separators).toEqual([0, 0, 0, 0])
            await expect(page.getByRole('link', { name: 'Назад к приглашениям' })).toHaveAttribute('href', '/account/referral')
        }
        if (frame.component === 'Account/Referral/Index') {
            await expect(page.getByRole('link', { name: 'Условия партнёрской программы' })).toHaveAttribute('href', '/account/referral/terms')
            await expect(page.getByRole('link', { name: 'Условия партнёрской программы' })).toHaveCSS('color', frame.theme === 'dark' ? 'rgb(245, 245, 246)' : 'rgb(36, 33, 29)')
        }
        if (frame.component === 'Account/Support/Show') {
            const authors = page.getByRole('list', { name: 'Переписка с поддержкой' }).locator('article h2')
            await expect(authors.nth(0)).toHaveCSS('color', frame.theme === 'dark' ? 'rgb(142, 155, 255)' : 'rgb(79, 85, 216)')
            await expect(authors.nth(1)).toHaveCSS('color', frame.theme === 'dark' ? 'rgb(86, 214, 174)' : 'rgb(34, 117, 93)')
        }
        if (frame.component === 'Account/Subscription') {
            const hint = page.locator('#period-heading').locator('..').locator('p')
            await expect(hint).toHaveCSS('color', frame.theme === 'dark' ? 'rgb(142, 155, 255)' : 'rgb(79, 85, 216)')
            expect(await hint.evaluate(element => getComputedStyle(element).fontFamily)).toContain('IBM Plex Mono')
        }
        if (frame.state === 'succeeded') {
            await expect(page.getByRole('link', { name: 'Подключить устройство', exact: true })).toHaveAttribute('href', '/account/connection')
        }
        if (frame.state === 'pending' || frame.state === 'canceled') {
            await expect(page.getByRole('link', { name: 'Подключить устройство', exact: true })).toHaveCount(0)
        }
        if (frame.state === 'link-sent') {
            const back = page.getByRole('link', { name: 'Вернуться ко входу', exact: true })
            await expect(back).toHaveAttribute('href', '/login')
            expect((await back.boundingBox()).height).toBeGreaterThanOrEqual(56)
            await expect(page.getByRole('link', { name: 'Написать в поддержку', exact: true })).toBeVisible()
        }
        if (frame.component === 'Account/Connection') {
            const platformWeights = await page.locator('label:has(input[name="connection-platform"])').evaluateAll(labels => labels.map(label => Number(getComputedStyle(label).fontWeight)))
            expect(platformWeights).toEqual([600, 600, 600, 600, 600])
            const step = page.locator('details').first()
            await step.locator('summary').click()
            expect((await page.evaluate(inspectTextContrast)).fieldFailures).toEqual([])
            await step.locator('summary').click()
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        expect(await page.evaluate(inspectAccessibility)).toEqual([])
        const contrast = await page.evaluate(inspectTextContrast)
        await info.attach('text-contrast', { body: JSON.stringify(contrast, null, 2), contentType: 'application/json' })
        expect(contrast.failures).toEqual([])
        expect(contrast.fieldFailures).toEqual([])
        await screenshot(page, info, `pen-${frame.id}`, { fullPage: frame.route === '/' && frame.state === 'default' })
        const metrics = await page.locator('h1, h2, main, body > header, #account-shell > header, [role="dialog"]').evaluateAll(elements => elements.map(element => {
            const box = element.getBoundingClientRect()
            const css = getComputedStyle(element)
            return { tag: element.tagName, text: element.textContent.trim().slice(0, 90), x: box.x, y: box.y, width: box.width, height: box.height, fontSize: css.fontSize, lineHeight: css.lineHeight, color: css.color, background: css.backgroundColor }
        }))
        await info.attach('layout-metrics', { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' })
    })
}
