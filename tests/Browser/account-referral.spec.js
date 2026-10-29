import { expect, test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { accountFixture, expectLayout, inertiaResponse, screenshot } from './helpers/accountDashboard.js'
import { chooseSelectOption, expectSelectPresentation } from './helpers/selectPresentation.js'

const web = 'https://dudeweb.example.test/invite/FixtureTokenForBrowserOnly000000000000001'
const telegram = 'https://t.me/dudeweb_test_bot?start=ref_FixtureTokenForBrowserOnly000000000000001'
const overview = (count = 0, days = 0) => ({ errors: {}, webInviteUrl: web, telegramInviteUrl: telegram, metrics: { invitedCount: count, bonusDays: days } })
const terms = (percent = 30) => ({ errors: {}, termsAvailable: true, friendDiscountPercent: percent, rewardMatrix: [1, 3, 6, 12].map((months, i) => ({ months, days: [7, 14, 21, 30][i] })), contentVersion: 'fixture-live-v1' })
const titles = { Index: 'Хорошим делятся.', Terms: 'Партнёрская программа' }
async function fixture(page, request, name = 'Index', props = name === 'Index' ? overview() : terms()) {
    const path = name === 'Terms' ? '/account/referral/terms' : '/account/referral'
    return accountFixture(page, request, props, { component: `Account/Referral/${name}`, url: path, title: titles[name] })
}

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text()) })
})

for (const theme of ['light', 'dark']) {
    for (const name of ['Index', 'Terms']) {
        for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 2560]) {
            test(`${name} ${width} ${theme}`, async ({ page, request }, info) => {
                await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1024 })
                await page.emulateMedia({ colorScheme: theme })
                await fixture(page, request, name)
                await expectLayout(page)
                if (name === 'Terms') {
                    await expect(page.getByRole('list', { name: 'Как работает программа' }).getByRole('listitem')).toHaveCount(4)
                    await expect(page.getByRole('table')).toBeVisible()
                    const tableMetricsPath = info.outputPath('table-metrics.json')
                    await writeFile(tableMetricsPath, JSON.stringify(await page.locator('table, th, td').evaluateAll(elements => elements.slice(0, 3).map(e => ({ tag: e.tagName, width: e.getBoundingClientRect().width, font: getComputedStyle(e).fontSize, cssWidth: getComputedStyle(e).width }))), null, 2))
                    await info.attach('table-metrics', { contentType: 'application/json', path: tableMetricsPath })
                } else {
                    await expect(page.getByText('Пока никто не присоединился по твоей ссылке.')).toBeVisible()
                    await expectSelectPresentation(page.getByRole('combobox', { name: 'Куда приглашаем' }))
                }
                if (width < 1200) {
                    await expect(page.getByRole('button', { name: 'Ещё', exact: true })).toHaveClass(/text-accent/)
                } else {
                    await expect(page.getByRole('navigation', { name: 'Разделы личного кабинета' }).getByRole('link', { name: 'Пригласить друга', exact: true })).toHaveAttribute('aria-current', 'page')
                }
                await screenshot(page, info, `referral-${name}-${width}-${theme}`)
            })
        }
        test(`${name} 320 text-only 2x ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width: 320, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request, name)
            await page.evaluate(() => {
                const elements = [...document.querySelectorAll('#app *')]
                const sizes = elements.map(e => parseFloat(getComputedStyle(e).fontSize))
                elements.forEach((e, i) => { e.style.fontSize = `${sizes[i] * 2}px` })
            })
            const metrics = await page.evaluate(() => [...document.querySelectorAll('#app *')].map(e => ({ tag: e.tagName, text: e.textContent.slice(0, 75), class: e.className, width: e.getBoundingClientRect().width, right: e.getBoundingClientRect().right, scroll: e.scrollWidth, client: e.clientWidth })).filter(e => e.right > innerWidth + 1 || e.scroll > e.client + 1))
            const metricsPath = info.outputPath('overflow.json')
            await writeFile(metricsPath, JSON.stringify(metrics, null, 2))
            await info.attach('overflow', { contentType: 'application/json', path: metricsPath })
            await expectLayout(page)
            await screenshot(page, info, `referral-${name}-text2x-${theme}`)
        })
    }
}

test('populated metrics and Telegram channel expose only server-provided invite', async ({ page, request }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copied = value } } }))
    await fixture(page, request, 'Index', overview(23, 21))
    await expect(page.getByText('Друзья уже присоединились по твоей ссылке.')).toBeVisible()
    await expect(page.getByText('21 день', { exact: true })).toBeVisible()
    await chooseSelectOption(page.getByRole('combobox', { name: 'Куда приглашаем' }), 'В Telegram')
    await page.getByRole('button', { name: 'Скопировать приглашение', exact: true }).click()
    expect(await page.evaluate(() => window.__copied)).toBe(telegram)
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('FixtureToken')
})

for (const mode of ['supported', 'cancelled', 'unsupported', 'failed']) {
    test(`share ${mode} has truthful feedback and fallback`, async ({ page, request }) => {
        await page.addInitScript(mode => {
            Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copied = value } } })
            Object.defineProperty(navigator, 'share', { configurable: true, value: mode === 'unsupported' ? undefined : async data => {
                if (mode === 'cancelled') throw new DOMException('Cancelled', 'AbortError')
                if (mode === 'failed') throw new Error('Unavailable')
                window.__shared = data
            } })
        }, mode)
        await fixture(page, request)
        await page.getByRole('button', { name: 'Поделиться', exact: true }).click()
        await expect(page.getByRole('status')).toContainText(mode === 'supported' ? 'Приглашение отправлено' : mode === 'cancelled' ? 'Отправка отменена' : 'Ссылка скопирована')
        if (mode === 'supported') expect(await page.evaluate(() => window.__shared.url)).toBe(web)
        else expect(await page.evaluate(() => window.__copied)).toBe(mode === 'cancelled' ? undefined : web)
    })
}

test('share fallback and clipboard denied allow manual selection', async ({ page, request }) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied') } } })
        document.execCommand = () => false
    })
    await fixture(page, request)
    await page.getByRole('button', { name: 'Поделиться', exact: true }).click()
    const manual = page.getByRole('textbox', { name: 'Приглашение для ручного копирования' })
    await expect(manual).toHaveValue(web)
    await manual.focus()
    expect(await manual.evaluate(e => e.selectionEnd - e.selectionStart)).toBe(web.length)
    await chooseSelectOption(page.getByRole('combobox', { name: 'Куда приглашаем' }), 'В Telegram')
    await expect(manual).toHaveCount(0)
})

test('missing invite and incomplete live terms show honest unavailable states', async ({ page, request }) => {
    await fixture(page, request, 'Index', { ...overview(), webInviteUrl: null, telegramInviteUrl: null })
    await expect(page.getByText('Ссылки приглашения пока недоступны.', { exact: false })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Поделиться', exact: true })).toHaveCount(0)
    await fixture(page, request, 'Terms', { errors: {}, termsAvailable: false, friendDiscountPercent: null, rewardMatrix: [], contentVersion: null })
    await expect(page.getByText('Условия программы сейчас недоступны.')).toBeVisible()
    await expect(page.getByRole('table')).toHaveCount(0)
    await expect(page.getByText('30%', { exact: false })).toHaveCount(0)
})

test('live terms render a changed server discount and reward without stale Pen values', async ({ page, request }) => {
    const props = terms(25)
    props.rewardMatrix[0].days = 11
    await fixture(page, request, 'Terms', props)
    await expect(page.getByText('25% на первую покупку подписки')).toBeVisible()
    await expect(page.getByText('+11 дней', { exact: true })).toBeVisible()
    await expect(page.getByText('30%', { exact: false })).toHaveCount(0)
})

for (const width of [390, 768, 1440]) {
    test(`Q to Q2 and back preserves navigation ${width}`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: 650 })
        const server = await fixture(page, request)
        await page.route('**/account/referral/terms', route => inertiaResponse(route, { ...server.page(), component: 'Account/Referral/Terms', url: '/account/referral/terms', props: terms() }))
        const link = page.getByRole('link', { name: 'Условия партнёрской программы', exact: true })
        await link.focus()
        await page.keyboard.press('Enter')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Terms)
        await page.getByRole('link', { name: 'Назад к приглашениям' }).click()
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Index)
        await page.goBack()
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Terms)
        await page.goBack()
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Index)
    })
}
