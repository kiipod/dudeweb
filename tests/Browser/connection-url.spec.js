import { expect, test } from '@playwright/test'
import { accountFixture, dashboardProps, expectLayout } from './helpers/accountDashboard.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'
import { inspectPageContrast } from './helpers/pageContrast.js'
import { inspectControls } from './helpers/paintedFocus.js'
import { chooseSelectOption } from './helpers/selectPresentation.js'

const url = `https://sub.example.test/${'owned-connection-'.repeat(12)}?signature=fixture&client=desktop#connect`
const invites = {
    web: `https://dudeweb.example.test/invite/${'opaque-token-'.repeat(12)}?campaign=fixture#invite`,
    telegram: `https://t.me/dudeweb_fixture_bot?start=ref_${'opaque-token-'.repeat(12)}`,
}
const cases = [
    { component: 'Account/Dashboard', label: 'Ссылка подключения', value: url },
    { component: 'Account/Connection', label: 'Ссылка подключения', value: url },
    { component: 'Account/Referral/Index', channel: 'web', label: 'Ссылка приглашения', value: invites.web },
    { component: 'Account/Referral/Index', channel: 'telegram', label: 'Ссылка приглашения', value: invites.telegram },
]

async function fixture(page, request, component, channel) {
    const [, route, title, defaults] = verificationRoutes.find(row => row[0] === component)
    const props = structuredClone(defaults)
    if (component === 'Account/Dashboard') props.subscription = { ...dashboardProps().subscription, url }
    else if (component === 'Account/Connection') props.subscriptionUrl = url
    else Object.assign(props, { webInviteUrl: invites.web, telegramInviteUrl: invites.telegram })
    await accountFixture(page, request, props, { component, url: route, title })
    if (channel === 'telegram') await chooseSelectOption(page.getByRole('combobox', { name: 'Куда приглашаем' }), 'В Telegram')
}

for (const { component, channel = '', label, value } of cases) {
    for (const theme of ['light', 'dark']) for (const width of [320, 360, 390, 768, 1024, 1440, 2560]) {
        test(`full URL supports native manual copy ${component} ${channel} ${width} ${theme}`, async ({ page, request, context }, info) => {
            await context.grantPermissions(['clipboard-read', 'clipboard-write'])
            await page.setViewportSize({ width, height: 1440 })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request, component, channel)
            const field = page.getByRole('textbox', { name: label, exact: true })
            await expect(field).toBeVisible()
            await expect(field).toHaveValue(value)
            await expect(field).toHaveAttribute('readonly', '')
            expect(await field.evaluate(node => node.scrollLeft)).toBe(0)
            await page.keyboard.press('Tab')
            await field.focus()
            await page.keyboard.press('Control+a')
            expect(await field.evaluate(node => node.value.slice(node.selectionStart, node.selectionEnd))).toBe(value)
            const { focus } = await inspectControls(page, { focus: true })
            expect(focus.missing).toBe(false)
            expect(focus.unobscured).toBe(true)
            expect(focus.ratio).toBeGreaterThanOrEqual(3)
            await page.keyboard.press('Control+c')
            expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value)
            await field.press('x')
            await expect(field).toHaveValue(value)
            await field.click()
            expect(await field.evaluate(node => node.selectionEnd - node.selectionStart)).toBe(value.length)
            await expect(field.locator('..').locator('..').getByRole('status')).toHaveCount(0)
            const contrast = await inspectPageContrast(page)
            expect(contrast.failures).toEqual([])
            expect(contrast.fieldFailures).toEqual([])
            expect(contrast.fieldManual).toEqual([])
            await expectLayout(page)
            await info.attach('connection-url', { body: await field.locator('..').screenshot(), contentType: 'image/png' })
            await page.setViewportSize({ width: width < 1200 ? 1440 : 390, height: 844 })
            await expect(field).toBeVisible()
            await expect(field).toHaveValue(value)
            await expectLayout(page)
            await page.evaluate(() => navigator.clipboard.writeText('before-button'))
            await page.getByRole('button', { name: channel ? 'Скопировать приглашение' : 'Скопировать ссылку', exact: true }).click()
            await expect(field.locator('..').locator('..').getByRole('status')).toHaveText('Ссылка скопирована')
            expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value)
        })
    }
}

test.describe('touch selection', () => {
    test.use({ hasTouch: true, isMobile: true })
    for (const { component, channel = '', label, value } of cases) for (const width of [360, 390, 768]) {
        test(`tap selects the complete URL ${component} ${channel} ${width}`, async ({ page, request }) => {
            await page.setViewportSize({ width, height: 1024 })
            await fixture(page, request, component, channel)
            const field = page.getByRole('textbox', { name: label, exact: true })
            await expect(field).toHaveValue(value)
            await field.tap()
            await expect(field).toBeFocused()
            expect(await field.evaluate(node => node.value.slice(node.selectionStart, node.selectionEnd))).toBe(value)
            await expectLayout(page)
        })
    }
})
