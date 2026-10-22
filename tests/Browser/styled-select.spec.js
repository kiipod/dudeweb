import { expect, test } from '@playwright/test'
import { accountFixture, expectLayout } from './helpers/accountDashboard.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'
import { expectSelectPresentation } from './helpers/selectPresentation.js'
import { inspectPageContrast } from './helpers/pageContrast.js'

const components = ['Account/Connection', 'Account/Referral/Index']
async function fixture(page, request, component, { count = 3, telegram = true } = {}) {
    const [, url, title, defaults] = verificationRoutes.find(row => row[0] === component)
    const props = structuredClone(defaults)
    if (component === 'Account/Connection') {
        props.platforms = [{ id: 'windows', label: 'Windows', available: true, apps: Array.from({ length: count }, (_, index) => ({
            name: ['Первое приложение', 'Другое приложение', 'Третье приложение'][index] ?? `Приложение ${index + 1}`,
            steps: Array.from({ length: 3 }, (_, step) => ({ title: `Шаг ${step + 1}`, description: 'Описание шага подключения.', content: [`Инструкция ${index + 1}`], links: [] })),
        })) }]
    } else if (!telegram) props.telegramInviteUrl = null
    await accountFixture(page, request, props, { component, url, title })
    if (component === 'Account/Connection') await page.locator('summary').first().click()
    return page.getByRole('combobox', { name: component === 'Account/Connection' ? 'Приложение' : 'Куда приглашаем', exact: true })
}
test.beforeEach(({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text()) })
})

for (const component of components) for (const width of [320, 390, 768, 1440, 2560]) for (const theme of ['light', 'dark']) {
    test(`styled options ${component} ${width} ${theme}`, async ({ page, request }, info) => {
        await page.setViewportSize({ width, height: width === 2560 ? 1440 : 900 })
        await page.emulateMedia({ colorScheme: theme })
        const select = await fixture(page, request, component)
        await expectSelectPresentation(select)
        await select.click()
        const list = page.getByRole('listbox')
        await expect(list).toBeVisible()
        await expect(select).toBeFocused()
        await expect(select).toHaveAttribute('aria-expanded', 'true')
        const metrics = await list.evaluate(element => {
            const box = element.getBoundingClientRect(), style = getComputedStyle(element)
            return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, fill: style.backgroundColor, border: style.borderColor, radius: style.borderRadius, layer: Number(style.zIndex) }
        })
        const trigger = await select.evaluate(element => ({ width: element.getBoundingClientRect().width, fill: getComputedStyle(element).backgroundColor, border: getComputedStyle(element).borderColor, radius: getComputedStyle(element).borderRadius, outline: getComputedStyle(element).outlineStyle }))
        expect(metrics.width).toBeCloseTo(trigger.width, 0)
        expect(metrics.fill).toBe(trigger.fill)
        expect(metrics.border).toBe(trigger.border)
        expect(metrics.radius).toBe(trigger.radius)
        expect(metrics.left).toBeGreaterThanOrEqual(0)
        expect(metrics.right).toBeLessThanOrEqual(width)
        expect(metrics.top).toBeGreaterThanOrEqual(0)
        expect(metrics.bottom).toBeLessThanOrEqual(width === 2560 ? 1440 : 900)
        expect(metrics.layer).toBeGreaterThanOrEqual(50)
        expect(trigger.outline).toBe('none')
        const selected = list.getByRole('option', { selected: true })
        await expect(selected.locator('svg')).toBeVisible()
        await expectLayout(page)
        const contrast = await inspectPageContrast(page)
        expect(contrast.failures).toEqual([])
        expect(contrast.fieldFailures).toEqual([])
        expect(contrast.fieldManual).toEqual([])
        await info.attach('styled-options', { body: await page.screenshot(), contentType: 'image/png' })
        const choice = list.getByRole('option').nth(1)
        const label = await choice.innerText()
        await choice.click()
        await expect(list).toHaveCount(0)
        await expect(select).toHaveText(label)
        await expect(select).toBeFocused()
        if (component.includes('Referral')) await expect(page.getByRole('textbox', { name: 'Ссылка приглашения', exact: true })).toHaveValue(/https:\/\/t\.me\//)
        else await expect(page.locator('input[name="connection-app"]')).toHaveValue('Другое приложение')
    })
}

for (const component of components) {
    test(`keyboard selection, cancel, typeahead and Tab ${component}`, async ({ page, request }) => {
        const select = await fixture(page, request, component)
        const original = await select.innerText()
        await select.focus()
        await select.press('Enter')
        await select.press('ArrowDown')
        await expect(select).toHaveText(original)
        await expect(select).toHaveAttribute('aria-activedescendant', /-1$/)
        await select.press('Escape')
        await expect(select).toHaveAttribute('aria-expanded', 'false')
        await expect(select).toHaveText(original)
        await select.press('Space')
        await select.press('End')
        await select.press('Home')
        await select.press('ArrowDown')
        await select.press('Enter')
        await expect(select).toHaveText(component.includes('Referral') ? 'В Telegram' : 'Другое приложение')
        await expect(select).toHaveCSS('outline-width', '2px')
        await select.dispatchEvent('keydown', { key: component.includes('Referral') ? 'н' : 'т' })
        await expect(page.getByRole('listbox')).toBeVisible()
        await select.press('Tab')
        await expect(page.getByRole('listbox')).toHaveCount(0)
        await expect(select).not.toBeFocused()
        await expect(select).toHaveText(component.includes('Referral') ? 'На сайт' : 'Третье приложение')
    })
    test(`outside click, resize and scrolling dismiss ${component}`, async ({ page, request }) => {
        await page.setViewportSize({ width: 390, height: 700 })
        const select = await fixture(page, request, component)
        await select.click()
        await page.getByRole('heading', { level: 1 }).click()
        await expect(page.getByRole('listbox')).toHaveCount(0)
        await select.click()
        await page.setViewportSize({ width: 768, height: 700 })
        await expect(page.getByRole('listbox')).toHaveCount(0)
        await select.click()
        await page.evaluate(() => window.scrollBy(0, 200))
        await expect(page.getByRole('listbox')).toHaveCount(0)
    })
    test(`320 doubled text and forced colors ${component}`, async ({ page, request }) => {
        await page.setViewportSize({ width: 320, height: 900 })
        const select = await fixture(page, request, component)
        await page.evaluate(() => {
            const nodes = [...document.querySelectorAll('#app *')]
            const sizes = nodes.map(element => parseFloat(getComputedStyle(element).fontSize))
            nodes.forEach((element, index) => { element.style.fontSize = `${sizes[index] * 2}px` })
        })
        await select.click()
        await expect(page.getByRole('listbox')).toBeVisible()
        await expect(page.getByRole('option').first()).toHaveCSS('font-size', await select.evaluate(element => getComputedStyle(element).fontSize))
        await expectLayout(page)
        await page.keyboard.press('Escape')
        await page.emulateMedia({ forcedColors: 'active' })
        await select.press('Enter')
        await expect(page.getByRole('listbox')).toBeVisible()
        const highlight = await page.evaluate(() => {
            const element = document.createElement('span')
            element.style.backgroundColor = 'Highlight'
            document.body.append(element)
            const color = getComputedStyle(element).backgroundColor
            element.remove()
            return color
        })
        await expect(page.getByRole('option').first()).toHaveCSS('background-color', highlight)
    })
}
test('disabled choices are skipped and cannot change the channel', async ({ page, request }) => {
    const select = await fixture(page, request, 'Account/Referral/Index', { telegram: false })
    await select.click()
    const unavailable = page.getByRole('option', { name: 'В Telegram' })
    await expect(unavailable).toHaveAttribute('aria-disabled', 'true')
    await unavailable.dispatchEvent('click')
    await expect(select).toHaveText('На сайт')
    await select.press('End')
    await select.press('Enter')
    await expect(select).toHaveText('На сайт')
})
test('long list scrolls active option into view and opens within viewport', async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 700 })
    const select = await fixture(page, request, 'Account/Connection', { count: 30 })
    await select.click()
    const list = page.getByRole('listbox')
    await expect(list).toBeVisible()
    await select.press('End')
    await expect.poll(() => list.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
    await expect(page.getByRole('option').last()).toBeInViewport()
    await select.press('Enter')
    await expect(select).toHaveText('Приложение 30')
})
test.describe('touch options', () => {
    test.use({ hasTouch: true, isMobile: true })
    for (const component of components) for (const width of [390, 768]) {
        test(`tap options ${component} ${width}`, async ({ page, request }) => {
            await page.setViewportSize({ width, height: 1024 })
            const select = await fixture(page, request, component)
            await select.tap()
            await page.getByRole('option').nth(1).tap()
            await expect(select).toHaveText(component.includes('Referral') ? 'В Telegram' : 'Другое приложение')
            await expect(select).toHaveCSS('outline-style', 'none')
        })
    }
})
