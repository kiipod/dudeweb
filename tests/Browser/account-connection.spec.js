import { expect, test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { accountFixture, expectLayout, inertiaResponse, screenshot } from './helpers/accountDashboard.js'

const url = 'https://sub.example.test/owned-connection?signature=fixture'
const title = 'Подключиться проще, чем кажется.'
const heightFor = width => width === 2560 ? 1440 : width === 1920 ? 1080 : 1040
const windowsBrowser = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32', userAgentData: { platform: 'Windows' }, maxTouchPoints: 0 }

function connectionProps(count = 2) {
    return {
        errors: {}, subscriptionUrl: url, serviceState: 'ready', deviceCount: count, deviceLimit: 5, deviceRemoved: false,
        devices: Array.from({ length: count }, (_, i) => ({ token: `opaque-token-${i}`, name: i === 0 ? 'Мой ноутбук' : 'Телефон', platform: i === 0 ? 'Windows' : 'Android', osVersion: '11' })),
        platforms: ['windows', 'macos', 'linux', 'android', 'ios'].map((id, i) => ({
            id, label: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'][i], available: true,
            apps: ['Первое приложение', 'Другое приложение'].map(name => ({ name, featured: name.startsWith('Первое'), steps: [
                { title: 'Установи приложение', description: 'Скачай подходящее приложение для устройства.', content: [`Установка ${id}: ${name}`], links: [{ label: `Скачать ${name}`, url: `https://downloads.example.test/${id}/${encodeURIComponent(name)}`, external: true }] },
                { title: 'Добавь ссылку подключения', description: 'Скопируй ссылку и добавь её в приложение.', content: [`Добавление подписки ${id}`], links: [{ label: 'Добавить подписку', url: `incy://add/${url}`, external: false }] },
                { title: 'Активируй соединение', description: 'Открой приложение и включи подключение.', content: [`Подключение ${id}`], links: [] },
            ] })),
        })),
    }
}
async function fixture(page, request, props = connectionProps(), browser = windowsBrowser) {
    await page.addInitScript(identity => {
        for (const [key, value] of Object.entries(identity)) {
            Object.defineProperty(navigator, key, { configurable: true, value })
        }
    }, { userAgentData: null, maxTouchPoints: 0, ...browser })
    return accountFixture(page, request, props, { component: 'Account/Connection', url: '/account/connection', title })
}

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text()) })
})

for (const [name, browser, label, id] of [
    ['Windows', windowsBrowser, 'Windows', 'windows'],
    ['macOS', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', platform: 'MacIntel' }, 'macOS', 'macos'],
    ['Linux', { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', platform: 'Linux x86_64', userAgentData: { platform: 'Linux' } }, 'Linux', 'linux'],
    ['Android', { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)', platform: 'Linux armv8l', maxTouchPoints: 5 }, 'Android', 'android'],
    ['iPhone', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone', maxTouchPoints: 5 }, 'iOS', 'ios'],
    ['iPad desktop mode', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', platform: 'MacIntel', maxTouchPoints: 5 }, 'iOS', 'ios'],
    ['unknown OS', { userAgent: 'Unknown browser', platform: 'FreeBSD' }, 'Windows', 'windows'],
]) {
    test(`detected ${name} selects its platform again after page reload`, async ({ page, request }) => {
        await fixture(page, request, connectionProps(), browser)
        await expect(page.getByRole('radio', { name: label, exact: true })).toBeChecked()
        await expect(page.locator('input:checked')).toHaveCount(1)
        await page.locator('summary').first().click()
        await expect(page.getByText(`Установка ${id}: Первое приложение`)).toBeVisible()

        const manual = label === 'Linux' ? 'Android' : 'Linux'
        await page.getByRole('radio', { name: manual, exact: true }).locator('..').click()
        await expect(page.getByRole('radio', { name: manual, exact: true })).toBeChecked()
        await page.reload()
        await expect(page.getByRole('radio', { name: label, exact: true })).toBeChecked()
        await expect(page.locator('input:checked')).toHaveCount(1)
    })
}

test('detected unavailable platform remains selected with honest instructions state', async ({ page, request }) => {
    const data = connectionProps()
    data.platforms[3].available = false
    data.platforms[3].apps = []
    await fixture(page, request, data, { userAgentData: { platform: 'Android' } })
    await expect(page.getByRole('radio', { name: 'Android', exact: true })).toBeChecked()
    await expect(page.getByText('Инструкция для этого устройства пока недоступна.', { exact: false })).toBeVisible()
})

test('OS outside the supplied catalogue keeps its first platform', async ({ page, request }) => {
    const data = connectionProps()
    data.platforms = data.platforms.filter(platform => platform.id !== 'ios')
    await fixture(page, request, data, { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone' })
    await expect(page.getByRole('radio', { name: 'Windows', exact: true })).toBeChecked()
    await expect(page.locator('input:checked')).toHaveCount(1)
})

for (const theme of ['light', 'dark']) {
    for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 2560]) {
        test(`connection ${width} ${theme}`, async ({ page, request }, testInfo) => {
            await page.setViewportSize({ width, height: heightFor(width) })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request)
            await expectLayout(page)
            await expect(page.getByRole('radio', { name: 'Windows', exact: true })).toBeChecked()
            await expect(page.getByText('Подключено: 2 из 5')).toBeVisible()
            expect(await page.getByRole('radio').first().locator('..').evaluate(e => e.getBoundingClientRect().height)).toBeCloseTo(width < 768 ? 86 : width <= 1920 ? 100 : 120, 0)
            await screenshot(page, testInfo, `connection-${width}-${theme}`)
            await screenshot(page, testInfo, `connection-viewport-${width}-${theme}`, { fullPage: false })
        })
    }
    test(`320 text-only 2x controls and expanded steps ${theme}`, async ({ page, request }, testInfo) => {
        await page.setViewportSize({ width: 320, height: 900 })
        await page.emulateMedia({ colorScheme: theme })
        await fixture(page, request)
        await page.locator('summary').first().click()
        await page.evaluate(() => {
            const elements = [...document.querySelectorAll('#app *')]
            const sizes = elements.map(e => getComputedStyle(e).fontSize)
            elements.forEach((e, i) => { e.style.fontSize = `${parseFloat(sizes[i]) * 2}px` })
        })
        const metricsPath = testInfo.outputPath('overflow.json')
        await writeFile(metricsPath, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('#app *')].map(e => ({ tag: e.tagName, class: e.className, right: e.getBoundingClientRect().right, width: e.getBoundingClientRect().width })).filter(e => e.right > innerWidth + 1)), null, 2))
        await testInfo.attach('overflow-elements', { contentType: 'application/json', path: metricsPath })
        await expectLayout(page)
        await expect(page.getByRole('combobox', { name: 'Приложение' })).toBeVisible()
        await screenshot(page, testInfo, `connection-text2x-${theme}`)
    })
}

test('native platform keyboard and app selection use provided instructions and links', async ({ page, request }) => {
    await fixture(page, request)
    const windows = page.getByRole('radio', { name: 'Windows', exact: true })
    await windows.focus()
    for (const label of ['macOS', 'Linux', 'Android', 'iOS', 'Windows']) {
        await page.keyboard.press('ArrowRight')
        await expect(page.getByRole('radio', { name: label, exact: true })).toBeChecked()
        await expect(page.locator('input:checked')).toHaveCount(1)
    }
    const firstStep = page.locator('summary').first()
    await firstStep.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText('Установка windows: Первое приложение')).toBeVisible()
    await page.getByRole('combobox', { name: 'Приложение' }).selectOption('Другое приложение')
    await expect(page.getByRole('link', { name: 'Скачать Другое приложение' })).toHaveAttribute('href', /windows/)
    await page.getByRole('radio', { name: 'Android', exact: true }).locator('..').click()
    await page.locator('summary').first().click()
    await expect(page.getByText('Установка android: Первое приложение')).toBeVisible()
    await expectLayout(page)
})

test('clipboard success copies only the owned URL without persisting it', async ({ page, request }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copiedValue = value } } }))
    await fixture(page, request)
    await page.getByRole('button', { name: 'Скопировать ссылку', exact: true }).click()
    await expect(page.getByRole('status')).toHaveText('Ссылка скопирована')
    expect(await page.evaluate(() => window.__copiedValue)).toBe(url)
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('owned-connection')
    await expect(page.getByRole('textbox', { name: 'Ссылка для ручного копирования' })).toHaveCount(0)
})

for (const mode of ['permission denied', 'unsupported']) {
    test(`clipboard ${mode} exposes selectable manual fallback`, async ({ page, request }) => {
        await page.addInitScript(mode => {
            Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'unsupported' ? undefined : { writeText: async () => { throw new Error('denied') } } })
            document.execCommand = () => false
        }, mode)
        await fixture(page, request)
        await page.getByRole('button', { name: 'Скопировать ссылку', exact: true }).click()
        const manual = page.getByRole('textbox', { name: 'Ссылка для ручного копирования' })
        await expect(manual).toBeVisible()
        await expect(manual).toHaveValue(url)
        await manual.focus()
        expect(await manual.evaluate(e => e.selectionEnd - e.selectionStart)).toBe(url.length)
        await expect(page.getByRole('status')).toContainText('скопируй вручную')
        await expectLayout(page)
    })
}

test('legacy clipboard fallback cleans temporary DOM and restores focus', async ({ page, request }) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
        document.execCommand = () => true
    })
    await fixture(page, request)
    const copy = page.getByRole('button', { name: 'Скопировать ссылку', exact: true })
    await copy.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toHaveText('Ссылка скопирована')
    await expect(page.locator('textarea')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Ссылка скопирована', exact: true })).toBeFocused()
})

test('missing URL and platform are honest; all five selectors remain usable', async ({ page, request }) => {
    const data = connectionProps(0)
    data.subscriptionUrl = null
    data.platforms[0].available = false
    data.platforms[0].apps = []
    await fixture(page, request, data)
    await expect(page.getByText('Ссылка подключения сейчас недоступна.', { exact: false })).toBeVisible()
    await expect(page.getByText('Инструкция для этого устройства пока недоступна.', { exact: false })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Скопировать ссылку' })).toHaveCount(0)
    await expect(page.getByText('Подключённых устройств пока нет.')).toBeVisible()
    await page.getByRole('radio', { name: 'Linux', exact: true }).locator('..').click()
    await expect(page.locator('summary')).toHaveCount(3)
})

for (const kind of ['network', 'http']) {
    test(`failed refresh ${kind} hides stale URL and retry reads fresh data`, async ({ page, request }) => {
        const server = await fixture(page, request)
        server.reload = route => kind === 'network' ? route.abort('failed') : route.fulfill({ status: 503, body: 'Unavailable' })
        await page.getByRole('button', { name: 'Обновить данные' }).click()
        await expect(page.getByText('Не удалось загрузить подключение.')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Скопировать ссылку' })).toHaveCount(0)
        server.reload = null
        await page.getByRole('button', { name: 'Попробовать снова' }).click()
        await expect(page.getByRole('button', { name: 'Скопировать ссылку' })).toBeVisible()
    })
}

test('device delete is single during processing and refreshes the server list', async ({ page, request }) => {
    const server = await fixture(page, request)
    let submits = 0
    let finish
    await page.route('**/account/connection/devices', async route => {
        submits++
        expect(route.request().method()).toBe('DELETE')
        expect(route.request().postDataJSON()).toEqual({ device: 'opaque-token-0' })
        await new Promise(resolve => { finish = resolve })
        server.props.devices = []
        server.props.deviceCount = 0
        server.props.deviceRemoved = true
        await inertiaResponse(route, server.page())
    })
    await page.getByRole('button', { name: 'Отключить Мой ноутбук', exact: true }).dblclick()
    await expect(page.getByRole('button', { name: 'Отключить Телефон', exact: true })).toBeDisabled()
    expect(submits).toBe(1)
    finish()
    await expect(page.getByText('Устройство отключено.', { exact: true })).toBeVisible()
    await expect(page.getByText('Подключённых устройств пока нет.')).toBeVisible()
})

test('failed device mutation keeps the list and exposes retry guidance', async ({ page, request }) => {
    await fixture(page, request)
    await page.route('**/account/connection/devices', route => route.abort('failed'))
    await page.getByRole('button', { name: 'Отключить Мой ноутбук', exact: true }).click()
    await expect(page.getByRole('alert')).toContainText('Проверь соединение')
    await expect(page.getByText('Подключено: 2 из 5')).toBeVisible()
})
