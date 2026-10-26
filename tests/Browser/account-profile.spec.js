import { expect, test } from '@playwright/test'
import { accountFixture, expectLayout, inertiaResponse, screenshot } from './helpers/accountDashboard.js'

const props = () => ({
    errors: {},
    user: { firstName: null, lastName: null, email: 'owner@example.test', registeredAt: '2026-10-20T10:00:00Z', registeredLabel: '20 октября 2026' },
    telegramConnection: { connected: false, username: null },
    securityCapabilities: { password: true, changeEmail: true },
    themePreference: { storage: 'local', choices: ['light', 'dark'] },
})
async function fixture(page, request, data = props()) {
    return accountFixture(page, request, data, { component: 'Account/Profile', url: '/account/profile', title: 'Мой профиль', encryptHistory: true })
}
async function identity(page) { await page.getByRole('button', { name: 'Изменить данные', exact: true }).click() }
async function password(page) { await page.getByRole('button', { name: 'Изменить пароль', exact: true }).click() }
async function fillPassword(page) {
    await page.getByLabel('Текущий пароль', { exact: true }).fill('password123')
    await page.getByLabel('Новый пароль', { exact: true }).fill('newPassword123')
    await page.getByLabel('Повтори новый пароль', { exact: true }).fill('newPassword123')
}

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text()) })
})

for (const theme of ['light', 'dark']) {
    for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 2560]) {
        test(`profile ${width} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1024 })
            await page.emulateMedia({ colorScheme: theme })
            await fixture(page, request)
            await expectLayout(page)
            await expect(page.getByRole('radio', { name: theme === 'light' ? 'Светлая' : 'Тёмная', exact: true })).toBeChecked()
            await expect(page.getByRole('radio')).toHaveCount(2)
            await expect(page.getByRole('link', { name: 'Открыть профиль', exact: true })).toHaveAttribute('href', '/account/profile')
            for (const name of ['Изменить пароль', 'Завершить другие сеансы', 'Выйти из аккаунта']) {
                const action = page.getByRole('button', { name, exact: true })
                await expect(action).toHaveCSS('border-top-width', '1px')
                const box = await action.boundingBox()
                const content = await page.locator('main h1').boundingBox()
                expect(box.width).toBeCloseTo(content.width, 0)
                expect(box.height).toBeGreaterThanOrEqual(56)
                await action.hover()
                await expect(action).toHaveCSS('cursor', 'pointer')
                await expect(action).toHaveCSS('text-decoration-line', 'none')
            }
            await page.mouse.move(0, 0)
            if (width < 1200) await expect(page.getByRole('button', { name: 'Ещё', exact: true })).toHaveClass(/text-accent/)
            else await expect(page.getByRole('link', { name: 'Профиль', exact: true })).toHaveAttribute('aria-current', 'page')
            await screenshot(page, info, `profile-${width}-${theme}`)
        })
    }
    for (const section of ['read', 'identity', 'password', 'sessions']) {
        test(`${section} long values and text 2x 320 ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width: 320, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            const data = props()
            data.user.firstName = 'Длинноеслово'.repeat(12)
            data.user.lastName = '<script>private()</script>'
            data.user.email = `${'long'.repeat(45)}@example.test`
            data.telegramConnection = { connected: true, username: 'ДлинноеИмя'.repeat(10) }
            await fixture(page, request, data)
            if (section === 'identity') await identity(page)
            if (section === 'password') await password(page)
            if (section === 'sessions') await page.getByRole('button', { name: 'Завершить другие сеансы', exact: true }).click()
            await page.evaluate(() => {
                const elements = [...document.querySelectorAll('#app *')]
                const sizes = elements.map(e => parseFloat(getComputedStyle(e).fontSize))
                elements.forEach((e, i) => { e.style.fontSize = `${sizes[i] * 2}px` })
            })
            await expectLayout(page)
            expect(await page.evaluate(() => Boolean(window.private))).toBe(false)
            await screenshot(page, info, `profile-${section}-text2x-${theme}`)
        })
    }
}

for (const theme of ['light', 'dark']) {
    test(`profile disclosure buttons follow keyboard and expanded state ${theme}`, async ({ page, request }, info) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.emulateMedia({ colorScheme: theme })
        await fixture(page, request)
        const passwordAction = page.getByRole('button', { name: 'Изменить пароль', exact: true })
        const sessionsAction = page.getByRole('button', { name: 'Завершить другие сеансы', exact: true })
        const passwordArrow = passwordAction.locator('svg').last()
        const sessionsArrow = sessionsAction.locator('svg').last()
        await expect(passwordAction).toHaveAttribute('aria-expanded', 'false')
        await expect(passwordArrow).toHaveCSS('rotate', 'none')
        await passwordAction.focus()
        await page.keyboard.press('Enter')
        await expect(passwordAction).toBeFocused()
        await expect(passwordAction).toHaveCSS('outline-width', '2px')
        await expect(passwordAction).toHaveAttribute('aria-expanded', 'true')
        await expect(passwordArrow).toHaveCSS('rotate', '90deg')
        await expect(page.locator('#profile-password-form')).toBeVisible()
        await screenshot(page, info, `password-expanded-${theme}`)
        await page.keyboard.press('Space')
        await expect(passwordArrow).toHaveCSS('rotate', 'none')
        await expect(page.locator('#profile-password-form')).toHaveCount(0)
        await page.keyboard.press('Enter')
        await page.getByLabel('Текущий пароль', { exact: true }).fill('secret-draft')
        await sessionsAction.focus()
        await page.keyboard.press('Enter')
        await expect(sessionsAction).toHaveAttribute('aria-expanded', 'true')
        await expect(sessionsArrow).toHaveCSS('rotate', '90deg')
        await expect(passwordAction).toHaveAttribute('aria-expanded', 'false')
        await expect(passwordArrow).toHaveCSS('rotate', 'none')
        await expect(page.locator('#profile-password-form')).toHaveCount(0)
        await expect(page.locator('#profile-sessions-form')).toBeVisible()
        await page.keyboard.press('Space')
        await expect(sessionsArrow).toHaveCSS('rotate', 'none')
        await expect(page.locator('#profile-sessions-form')).toHaveCount(0)
        await passwordAction.click()
        await expect(page.getByLabel('Текущий пароль', { exact: true })).toHaveValue('')
        await expectLayout(page)
    })
}

test('identity submit blocks duplicate intent and renders only persisted server data', async ({ page, request }) => {
    const server = await fixture(page, request)
    let release
    const pending = new Promise(resolve => { release = resolve })
    let posts = 0
    server.reload = async route => {
        posts++
        expect(route.request().method()).toBe('PATCH')
        const data = route.request().postDataJSON()
        expect(data.first_name).toBe('Иван')
        await pending
        server.props = { ...server.props, user: { ...server.props.user, firstName: 'Иван', lastName: 'Сохранённая фамилия' } }
        await inertiaResponse(route, server.page())
    }
    await identity(page)
    await page.getByRole('textbox', { name: 'Имя', exact: true }).fill('Иван')
    await page.getByRole('textbox', { name: 'Фамилия', exact: true }).fill('Отправленная фамилия')
    await page.getByRole('button', { name: 'Сохранить данные' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Сохраняем…' })).toBeDisabled()
    await page.keyboard.press('Enter')
    expect(posts).toBe(1)
    await expect(page.getByText('Сохранённая фамилия', { exact: true })).toHaveCount(0)
    release()
    await expect(page.getByText('Сохранённая фамилия', { exact: true })).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Данные сохранены')
    await identity(page)
    await expect(page.getByRole('textbox', { name: 'Фамилия', exact: true })).toHaveValue('Сохранённая фамилия')
})

for (const failure of ['validation', 'http', 'network']) {
    test(`identity ${failure} retains safe draft and supports retry`, async ({ page, request }) => {
        const server = await fixture(page, request)
        server.reload = async route => {
            if (failure === 'network') await route.abort('failed')
            else if (failure === 'http') await route.fulfill({ status: 503, body: 'Unavailable' })
            else await inertiaResponse(route, { ...server.page(), props: { ...server.props, errors: { first_name: 'Проверь имя' } } })
        }
        await identity(page)
        await page.getByRole('textbox', { name: 'Имя', exact: true }).fill('Сохранить черновик')
        await page.getByRole('button', { name: 'Сохранить данные' }).click()
        await expect(page.getByText(failure === 'validation' ? 'Проверь имя' : failure === 'http' ? 'Не удалось сохранить изменения. Попробуй ещё раз.' : 'Проверь соединение и попробуй ещё раз.')).toBeVisible()
        await expect(page.getByRole('textbox', { name: 'Имя', exact: true })).toHaveValue('Сохранить черновик')
        await expect(page.getByRole('button', { name: 'Сохранить данные' })).toBeEnabled()
    })
}

test('email change asks for current password and transitions to real verification page', async ({ page, request }) => {
    const server = await fixture(page, request)
    server.reload = async route => {
        const data = route.request().postDataJSON()
        expect(data.current_password).toBe('password123')
        await inertiaResponse(route, { ...server.page(), component: 'Auth/VerifyEmail', url: '/email/verify', clearHistory: true, props: { errors: {}, email: 'new@example.test', existingAccount: true, status: 'verification-link-sent' } })
    }
    await identity(page)
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('new@example.test')
    await expect(page.getByText('Подтверди новый адрес по ссылке из письма. Остальные сеансы будут завершены.')).toBeVisible()
    await page.getByLabel('Текущий пароль для смены email', { exact: true }).fill('password123')
    await page.getByRole('button', { name: 'Сохранить данные' }).click()
    await expect(page).toHaveURL(/\/email\/verify$/)
    await expect(page.getByText('new@example.test', { exact: true })).toBeVisible()
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('password123')
})

for (const failure of ['validation', 'http', 'network']) {
    test(`password ${failure} clears secrets and never shows success`, async ({ page, request }) => {
        const server = await fixture(page, request)
        await page.route('**/account/profile/password', async route => {
            if (failure === 'network') await route.abort('failed')
            else if (failure === 'http') await route.fulfill({ status: 500, body: 'Unavailable' })
            else await inertiaResponse(route, { ...server.page(), props: { ...server.props, errors: { current_password: 'Текущий пароль не совпадает.' } } })
        })
        await password(page)
        await fillPassword(page)
        await page.getByRole('button', { name: 'Сохранить пароль' }).click()
        await expect(page.getByText(failure === 'validation' ? 'Текущий пароль не совпадает.' : failure === 'http' ? 'Не удалось сохранить изменения. Попробуй ещё раз.' : 'Проверь соединение и попробуй ещё раз.')).toBeVisible()
        await expect(page.getByLabel('Текущий пароль', { exact: true })).toHaveValue('')
        await expect(page.getByLabel('Новый пароль', { exact: true })).toHaveValue('')
        await expect(page.getByText('Пароль изменён. Другие сеансы завершены.')).toHaveCount(0)
    })
}

test('password success disables competing actions until persisted and clears secrets', async ({ page, request }) => {
    const server = await fixture(page, request)
    let release
    const pending = new Promise(resolve => { release = resolve })
    let posts = 0
    await page.route('**/account/profile/password', async route => {
        posts++
        expect(route.request().method()).toBe('PUT')
        await pending
        await inertiaResponse(route, server.page())
    })
    await password(page)
    await fillPassword(page)
    await page.getByRole('button', { name: 'Сохранить пароль' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Сохраняем…' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Завершить другие сеансы', exact: true })).toBeDisabled()
    await page.keyboard.press('Enter')
    expect(posts).toBe(1)
    release()
    await expect(page.getByRole('status')).toContainText('Пароль изменён. Другие сеансы завершены.')
    await expect(page.getByLabel('Новый пароль', { exact: true })).toHaveValue('')
})

test('other sessions operation confirms password and reports persisted success', async ({ page, request }) => {
    const server = await fixture(page, request)
    await page.route('**/account/profile/sessions', async route => {
        expect(route.request().method()).toBe('DELETE')
        expect(route.request().postDataJSON().current_password).toBe('password123')
        await inertiaResponse(route, server.page())
    })
    await page.getByRole('button', { name: 'Завершить другие сеансы', exact: true }).click()
    const field = page.getByLabel('Текущий пароль для завершения сеансов', { exact: true })
    await field.fill('password123')
    await field.focus()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Подтвердить завершение сеансов' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toContainText('Другие сеансы завершены. Этот сеанс остаётся открытым.')
    await expect(field).toHaveValue('')
})

test('capabilities disable email until provisioning and hide passwordless actions', async ({ page, request }) => {
    const data = props()
    data.securityCapabilities = { password: false, changeEmail: false }
    data.telegramConnection = { connected: true, username: 'real_user' }
    await fixture(page, request, data)
    await expect(page.getByRole('button', { name: 'Изменить пароль', exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Завершить другие сеансы', exact: true })).toHaveCount(0)
    await expect(page.getByText('Подключён · @real_user')).toBeVisible()
    await expect(page.getByRole('button', { name: /Привязать|Отключить Telegram/ })).toHaveCount(0)
    await identity(page)
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveAttribute('readonly', '')
})

for (const initial of ['empty', 'legacy', 'stored']) {
    test(`theme ${initial} fallback, keyboard, OS changes and hard reload`, async ({ page, request }) => {
        await page.emulateMedia({ colorScheme: 'dark' })
        if (initial !== 'empty') await page.addInitScript(value => { if (!sessionStorage.getItem('theme-fixture-set')) { localStorage.setItem('dudeweb-theme', value); sessionStorage.setItem('theme-fixture-set', 'true') } }, initial === 'legacy' ? 'system' : 'light')
        await fixture(page, request)
        await expect(page.locator('html')).toHaveAttribute('data-theme', initial === 'stored' ? 'light' : 'dark')
        await page.emulateMedia({ colorScheme: 'light' })
        await expect(page.locator('html')).toHaveAttribute('data-theme', initial === 'stored' ? 'light' : 'dark')
        const light = page.getByRole('radio', { name: 'Светлая', exact: true })
        await light.focus()
        await page.keyboard.press('Space')
        await expect(light).toBeChecked()
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
        await page.reload()
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
        expect(await page.evaluate(() => localStorage.getItem('dudeweb-theme'))).toBe('light')
        await page.getByRole('button', { name: /Включить тёмную/ }).click()
        await expect(page.getByRole('radio', { name: 'Тёмная', exact: true })).toBeChecked()
        await light.focus()
        await page.keyboard.press('ArrowRight')
        await expect(page.getByRole('radio', { name: 'Тёмная', exact: true })).toBeChecked()
    })
}

for (const width of [390, 768, 1440]) {
    test(`profile entry through header and More/sidebar ${width}`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: 900 })
        await fixture(page, request)
        if (width < 1200) {
            await page.getByRole('button', { name: 'Ещё', exact: true }).click()
            await page.getByRole('dialog', { name: 'Ещё', exact: true }).getByRole('link', { name: 'Профиль', exact: true }).click()
            await expect(page.getByRole('dialog')).toHaveCount(0)
        } else await expect(page.getByRole('link', { name: 'Профиль', exact: true })).toHaveAttribute('aria-current', 'page')
        await page.getByRole('link', { name: 'Открыть профиль', exact: true }).focus()
        await page.keyboard.press('Enter')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Мой профиль')
    })
}

for (const result of ['success', 'http', 'network']) {
    test(`logout ${result} uses DELETE and handles busy or failure`, async ({ page, request }) => {
        const server = await fixture(page, request)
        let release
        const pending = new Promise(resolve => { release = resolve })
        let posts = 0
        await page.route('**/logout', async route => {
            posts++
            expect(route.request().method()).toBe('DELETE')
            await pending
            if (result === 'network') await route.abort('failed')
            else if (result === 'http') await route.fulfill({ status: 419, body: 'Expired' })
            else await inertiaResponse(route, { ...server.loginPage, url: '/login', clearHistory: true })
        })
        await page.getByRole('button', { name: 'Выйти из аккаунта', exact: true }).focus()
        await page.keyboard.press('Enter')
        await expect(page.getByRole('button', { name: 'Выходим…', exact: true })).toBeDisabled()
        await page.keyboard.press('Enter')
        expect(posts).toBe(1)
        release()
        if (result === 'success') {
            await expect(page).toHaveURL(/\/login$/)
            await expect(page.getByText('owner@example.test', { exact: true })).toHaveCount(0)
            server.page = () => ({ ...server.loginPage, url: '/login', clearHistory: true })
            const authCheck = page.waitForRequest(request => request.method() === 'GET' && new URL(request.url()).pathname === '/account/profile')
            await page.goBack()
            await authCheck
            await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Мой профиль')
            await expect(page.getByText('owner@example.test', { exact: true })).toHaveCount(0)
        } else {
            await expect(page.getByRole('alert')).toContainText(result === 'http' ? 'Не удалось выйти.' : 'Проверь соединение')
            await expect(page.getByRole('button', { name: 'Выйти из аккаунта', exact: true })).toBeEnabled()
        }
    })
}

test('theme bootstrap applies stored choice before the app bundle loads', async ({ page, request }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.addInitScript(() => localStorage.setItem('dudeweb-theme', 'dark'))
    let release
    const pending = new Promise(resolve => { release = resolve })
    await page.route('**/build/assets/*.js', async route => { await pending; await route.continue() })
    const ready = fixture(page, request)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('html')).toHaveClass(/dark/)
    release()
    await ready
    await expect(page.getByRole('radio', { name: 'Тёмная', exact: true })).toBeChecked()
})

test('unavailable storage keeps a usable current-page theme choice', async ({ page, request }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get: () => { throw new DOMException('Unavailable', 'SecurityError') } })
    })
    await fixture(page, request)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.getByRole('radio', { name: 'Светлая', exact: true }).focus()
    await page.keyboard.press('Space')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
