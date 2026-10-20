import { expect, test } from '@playwright/test'
import { accountFixture, dashboardProps, inertiaResponse, screenshot } from './helpers/accountDashboard.js'

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => {
        if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text())
    })
})

for (const theme of ['light', 'dark']) {
    test(`primary states and reduced motion ${theme}`, async ({ page, request }) => {
        await page.emulateMedia({ colorScheme: theme })
        await accountFixture(page, request, dashboardProps('service_error'))
        const button = page.getByRole('button', { name: 'Попробовать снова', exact: true })
        const style = () => button.evaluate(element => {
            const css = getComputedStyle(element)
            return { background: css.backgroundColor, border: css.borderTopColor, outline: css.outlineColor, width: css.outlineWidth, transition: css.transitionProperty }
        })
        expect((await style()).background).toBe(theme === 'dark' ? 'rgb(142, 155, 255)' : 'rgb(91, 97, 230)')
        expect((await style()).border).toBe(theme === 'dark' ? 'rgb(168, 177, 255)' : 'rgb(115, 121, 238)')
        await button.hover()
        expect((await style()).background).toBe(theme === 'dark' ? 'rgb(168, 177, 255)' : 'rgb(79, 85, 216)')
        expect((await style()).border).toBe(theme === 'dark' ? 'rgb(194, 199, 255)' : 'rgb(115, 121, 238)')
        await button.focus()
        await page.keyboard.press('Tab')
        await page.keyboard.press('Shift+Tab')
        expect((await style()).width).toBe('2px')
        expect((await style()).outline).toBe(theme === 'dark' ? 'rgb(245, 245, 246)' : 'rgb(91, 97, 230)')
        expect((await style()).transition).toBe('none')
    })
    for (const width of [390, 768]) {
        test(`public menu traps programmatic and keyboard focus, restores and resizes ${width} ${theme}`, async ({ page }, info) => {
            await page.setViewportSize({ width, height: 1024 })
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'no-preference' })
            await page.goto('/')
            const trigger = page.getByRole('button', { name: 'Открыть меню', exact: true })
            await trigger.focus()
            await page.keyboard.press('Enter')
            const dialog = page.getByRole('dialog', { name: 'Мобильная навигация', exact: true })
            await expect(dialog).toBeVisible()
            await expect(dialog).toHaveAccessibleDescription(/Разделы сайта/)
            await expect(dialog.getByRole('link', { name: 'Преимущества', exact: true })).toBeFocused()
            expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('hidden')
            await page.locator('main').evaluate(element => element.focus())
            await expect(dialog.getByRole('link', { name: 'Преимущества', exact: true })).toBeFocused()
            const last = dialog.getByRole('link', { name: 'Попробовать бесплатно', exact: true })
            await last.focus()
            await page.keyboard.press('Tab')
            await expect(page.getByRole('button', { name: /тема\. Включить/ })).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(last).toBeFocused()
            await expect.poll(() => dialog.locator('..').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
            await screenshot(page, info, `public-menu-${width}-${theme}`, { fullPage: false })
            await page.keyboard.press('Escape')
            await expect(trigger).toBeFocused()
            await expect(dialog).toHaveCount(0)
            await expect(page.locator('main')).not.toHaveAttribute('inert')
            expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('')
            await trigger.click()
            await page.setViewportSize({ width: 1440, height: 1024 })
            await expect(dialog).toHaveCount(0)
            expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('')
        })
    }
}

for (const failure of ['network', 'http']) {
    for (const flow of [
        { component: 'Auth/Login', url: '/login', title: 'С возвращением, Dude.', button: 'Войти' },
        { component: 'Auth/Register', url: '/register', title: 'Привет, Dude!', button: 'Создать аккаунт' },
        { component: 'Auth/ForgotPassword', url: '/forgot-password', title: 'Восстановим доступ', button: 'Отправить ссылку' },
        { component: 'Auth/ResetPassword', url: '/reset-password/test-token', post: '/reset-password', title: 'Новый пароль', button: 'Сохранить пароль' },
        { component: 'Auth/VerifyEmail', url: '/email/verify', post: '/email/verification-notification', title: 'Подтверди email', button: 'Отправить письмо ещё раз' },
    ]) {
        test(`${flow.component} delayed ${failure} dedupes programmatic submit and retries`, async ({ page, request }) => {
            const server = await accountFixture(page, request, { errors: {}, email: 'fixture@example.test', token: 'test-token', status: null }, flow)
            const fill = async () => {
                for (const field of await page.locator('input:not([readonly]):not([disabled])').all()) {
                    await field.fill(await field.getAttribute('type') === 'email' ? 'fixture@example.test' : 'test-password-123')
                }
            }
            let attempts = 0
            let release
            const blocked = new Promise(resolve => { release = resolve })
            await page.route(`**${flow.post || flow.url}`, async route => {
                if (route.request().method() !== 'POST') return route.fallback()
                attempts++
                if (attempts === 1) {
                    await blocked
                    if (failure === 'network') await route.abort('failed')
                    else await route.fulfill({ status: 503, body: 'Temporarily unavailable' })
                } else await inertiaResponse(route, server.page())
            })
            await fill()
            const submit = page.locator('form button[type="submit"]')
            await expect(submit).toHaveAccessibleName(flow.button)
            await submit.click()
            await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true')
            await expect(submit).toBeDisabled()
            await page.locator('form').evaluate(form => {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                form.querySelector('button[type="submit"]').dispatchEvent(new MouseEvent('click', { cancelable: true, bubbles: true }))
                form.querySelectorAll('button[aria-controls]').forEach(button => button.dispatchEvent(new MouseEvent('click', { cancelable: true, bubbles: true })))
            })
            expect(await page.locator('form input[autocomplete*="password"]').evaluateAll(inputs => inputs.every(input => input.type === 'password'))).toBe(true)
            expect(attempts).toBe(1)
            expect(await page.locator('form svg.animate-spin').evaluateAll(nodes => nodes.every(node => getComputedStyle(node).animationName === 'none'))).toBe(true)
            release()
            await expect(page.getByRole('alert')).toContainText(failure === 'network' ? 'Проверь соединение' : 'Не удалось выполнить действие')
            await expect(submit).toBeEnabled()
            await fill()
            await submit.click()
            await expect(page.locator('form')).toHaveAttribute('aria-busy', 'false')
            await expect(page.getByRole('alert')).toHaveCount(0)
            expect(attempts).toBe(2)
        })
    }
}

test('navigation cancels a delayed auth mutation and prevents a late response from replacing the destination', async ({ page, request }) => {
    const server = await accountFixture(page, request, { errors: {} }, { component: 'Auth/Login', url: '/login', title: 'С возвращением, Dude.' })
    let release
    const blocked = new Promise(resolve => { release = resolve })
    let pending = false
    await page.route('**/login', async route => {
        if (route.request().method() !== 'POST') return route.fallback()
        pending = true
        await blocked
        await inertiaResponse(route, server.page())
    })
    await page.getByLabel('Email', { exact: true }).fill('fixture@example.test')
    await page.getByLabel('Пароль', { exact: true }).fill('test-password-123')
    await page.getByRole('button', { name: 'Войти', exact: true }).click()
    await expect.poll(() => pending).toBe(true)
    await page.getByRole('link', { name: 'Забыли пароль?' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Восстановим доступ')
    release()
    // Wait until transport has completed; a cancelled visit must not re-render Login.
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Восстановим доступ')
})

for (const width of [390, 1440]) {
    test(`logout error retains context and permits retry ${width}`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: 900 })
        await accountFixture(page, request)
        if (width < 1200) await page.getByRole('button', { name: 'Ещё', exact: true }).click()
        const scope = width < 1200 ? page.getByRole('dialog') : page.getByRole('complementary')
        if (width < 1200) await expect(scope).toHaveAccessibleDescription(/Дополнительные разделы/)
        await page.route('**/logout', route => route.abort('failed'))
        await scope.getByRole('button', { name: 'Выйти', exact: true }).click()
        await expect(scope.getByRole('alert')).toContainText('Проверь соединение')
        await expect(scope.getByRole('button', { name: 'Выйти', exact: true })).toBeEnabled()
        if (width < 1200) {
            await page.keyboard.press('Escape')
            await expect(scope).toHaveCount(0)
        }
    })
}

async function cloudSnapshot(page) {
    return page.locator('.service-logo-cloud image').evaluateAll(images => images.map(image => ['x', 'y', 'width', 'height'].map(key => image.getAttribute(key))))
}
for (const width of [390, 768, 1440, 2560]) {
    test(`SVG Hero media, theme, offscreen and visibility lifecycle ${width}`, async ({ page }, info) => {
        await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1024 })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto('/')
        const cloud = page.locator('.service-logo-cloud')
        await expect(cloud).toHaveAttribute('data-state', 'ready')
        await expect(cloud).toHaveAttribute('data-running', 'false')
        await expect(cloud.locator('image')).toHaveCount(23)
        const staticScene = await cloudSnapshot(page)
        await screenshot(page, info, `hero-static-${width}`, { fullPage: false })
        await page.emulateMedia({ reducedMotion: 'no-preference' })
        await expect(cloud).toHaveAttribute('data-running', 'true')
        await expect.poll(async () => JSON.stringify(await cloudSnapshot(page))).not.toBe(JSON.stringify(staticScene))
        await cloud.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 20, clientY: 20 })
        await expect(cloud).toHaveAttribute('data-interactive', width >= 1200 ? 'true' : 'false')
        await page.evaluate(() => { document.documentElement.classList.toggle('dark') })
        const theme = await page.locator('html').evaluate(element => element.classList.contains('dark') ? 'dark' : 'light')
        await expect(cloud.locator('image').first()).toHaveAttribute('href', new RegExp(`-${theme}\\.svg$`))
        await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
        await expect(cloud).toHaveAttribute('data-running', 'false')
        const hiddenScene = await cloudSnapshot(page)
        await page.waitForTimeout(100)
        expect(await cloudSnapshot(page)).toEqual(hiddenScene)
        await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')) })
        await expect(cloud).toHaveAttribute('data-running', 'true')
        await page.locator('footer').scrollIntoViewIfNeeded()
        await expect(cloud).toHaveAttribute('data-running', 'false')
        await page.evaluate(() => scrollTo(0, 0))
        await expect(cloud).toHaveAttribute('data-running', 'true')
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await expect(cloud).toHaveAttribute('data-running', 'false')
        expect(await cloudSnapshot(page)).toEqual(staticScene)
        await page.emulateMedia({ forcedColors: 'active' })
        await expect(cloud).toBeHidden()
        await expect(cloud).toHaveAttribute('data-running', 'false')
    })
}

test('desktop native drag captures mouse and resumes ambient without resetting the scene', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 1024 })
    await page.goto('/')
    const cloud = page.locator('.service-logo-cloud')
    await expect(cloud).toHaveAttribute('data-interactive', 'true')
    const box = await cloud.boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await expect(cloud).toHaveAttribute('data-dragging', 'true')
    const heldScene = await cloudSnapshot(page)
    await page.mouse.move(box.x + box.width + 20, box.y + box.height / 2 - 40, { steps: 5 })
    expect(await cloudSnapshot(page)).not.toEqual(heldScene)
    await page.mouse.up()
    await expect(cloud).toHaveAttribute('data-dragging', 'false')
    await expect(cloud).toHaveAttribute('data-running', 'true')
    const released = await cloudSnapshot(page)
    await expect.poll(async () => JSON.stringify(await cloudSnapshot(page))).not.toBe(JSON.stringify(released))
})

for (const reduced of ['reduce', 'no-preference']) {
    test(`unavailable SVG resource uses functional Signal Orbit fallback ${reduced}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: reduced })
        await page.route('**/images/hero/services/brands/*.svg', route => route.abort('failed'))
        await page.goto('/')
        await expect(page.locator('.landing-hero__signal')).toBeVisible()
        await expect(page.locator('.service-logo-cloud')).toHaveCount(0)
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
        await expect(page.locator('.landing-hero').getByRole('link', { name: 'Попробовать бесплатно', exact: true })).toHaveAttribute('href', '/register')
        const paths = page.locator('.landing-hero__signal path')
        const initial = await paths.evaluateAll(nodes => nodes.map(node => node.getAttribute('d')))
        if (reduced === 'no-preference') {
            await page.mouse.move(900, 250)
            await page.mouse.move(1000, 300, { steps: 5 })
            await expect.poll(async () => JSON.stringify(await paths.evaluateAll(nodes => nodes.map(node => node.getAttribute('d'))))).not.toBe(JSON.stringify(initial))
        }
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await expect.poll(() => paths.evaluateAll(nodes => nodes.map(node => node.getAttribute('d')))).toEqual(initial)
    })
}

for (const kind of ['public', 'more']) {
    test(`rapid close and reopen during leave restores interactive ${kind} overlay`, async ({ page, request }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.emulateMedia({ reducedMotion: 'no-preference' })
        if (kind === 'public') await page.goto('/')
        else await accountFixture(page, request)
        const trigger = page.getByRole('button', { name: kind === 'public' ? 'Открыть меню' : 'Ещё', exact: true })
        await trigger.focus()
        await trigger.click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await page.evaluate(async kind => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
            await new Promise(resolve => setTimeout(resolve, 10))
            const trigger = document.querySelector(kind === 'public' ? '[aria-controls="public-mobile-menu"]' : '[aria-controls="account-more"]')
            trigger.click()
        }, kind)
        const dialog = page.getByRole('dialog')
        await expect(dialog).toBeVisible()
        await expect(dialog.locator('..')).toHaveJSProperty('inert', false)
        await expect(dialog.locator('..')).not.toHaveAttribute('aria-hidden')
        await expect(dialog.locator('a, button').first()).toBeFocused()
        expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('hidden')
        await page.keyboard.press('Escape')
        await expect(trigger).toBeFocused()
        await expect(dialog).toHaveCount(0)
    })
}

const pagination = { data: [], current_page: 1, last_page: 1, links: [] }
const formLimits = { submissionId: 'df31dc3e-1c73-4ef5-a37b-9d0b66053aaf', subjectMax: 160, bodyMax: 10000 }
const keyboardRoutes = [
    ['Public/Home', '/', 'Любимые сервисы снова рядом', { plans: [], pricingState: 'unavailable' }],
    ['Auth/Login', '/login', 'С возвращением, Dude.', {}],
    ['Auth/Register', '/register', 'Привет, Dude!', {}],
    ['Auth/ForgotPassword', '/forgot-password', 'Восстановим доступ', {}],
    ['Auth/ResetPassword', '/reset-password/test-token', 'Новый пароль', { email: 'fixture@example.test', token: 'test-token' }],
    ['Auth/VerifyEmail', '/email/verify', 'Подтверди email', { email: 'fixture@example.test' }],
    ['Account/Dashboard', '/account', 'Привет, Алексей 👋', dashboardProps()],
    ['Account/Subscription', '/account/subscription', 'Твоя подписка', { subscription: dashboardProps().subscription, serviceState: 'ready', catalogue: { plan: { name: 'Безлимитный', deviceLimit: 5 }, products: [1, 3].map(months => ({ id: months, months, amount: 21700 * months, originalAmount: 21700 * months, currency: 'RUB' })), discount: null }, payments: pagination }],
    ['Account/Connection', '/account/connection', 'Подключиться проще, чем кажется.', { subscriptionUrl: 'https://sub.example.test/fixture', serviceState: 'ready', devices: [], deviceCount: 0, deviceLimit: 5, platforms: ['windows', 'macos', 'linux', 'android', 'ios'].map(id => ({ id, label: id, available: false, apps: [] })) }],
    ['Account/Referral/Index', '/account/referral', 'Хорошим делятся.', { webInviteUrl: 'https://dudeweb.example.test/invite/fixture', telegramInviteUrl: 'https://t.me/fixture?start=ref_fixture', metrics: { invitedCount: 0, bonusDays: 0 } }],
    ['Account/Referral/Terms', '/account/referral/terms', 'Партнёрская программа', { termsAvailable: true, friendDiscountPercent: 30, rewardMatrix: [{ months: 1, days: 7 }] }],
    ['Account/Support/Index', '/account/support', 'Dude, мы на связи.', { serviceState: 'ready', tickets: pagination }],
    ['Account/Support/Create', '/account/support/create', 'Напиши нам', formLimits],
    ['Account/Support/Show', '/account/support/1', 'Вопрос', { ...formLimits, serviceState: 'ready', ticket: { subject: 'Вопрос', status: 'OPEN', statusLabel: 'Открыто', replyUrl: '/account/support/1/messages', updatedLabel: '20 октября', updatedAt: '2026-10-20T12:00:00Z' }, messages: pagination }],
    ['Account/Profile', '/account/profile', 'Мой профиль', { user: { firstName: null, lastName: null, email: 'fixture@example.test', registeredAt: '2026-10-20T10:00:00Z', registeredLabel: '20 октября 2026' }, telegramConnection: { connected: false, username: null }, securityCapabilities: { password: true, changeEmail: true }, themePreference: { storage: 'local', choices: ['light', 'dark'] } }],
    ['Account/Payments/Show', '/account/payments/42', 'Не получилось оплатить', { payment: { id: 42, status: 'canceled', amount: 21700, currency: 'RUB', months: 1, retryUrl: '/account/payments/42/retry' } }],
]
for (const width of [390, 1440]) {
    for (const [component, url, title, props] of keyboardRoutes) {
        test(`keyboard focus coverage ${component} ${width}`, async ({ page, request }) => {
            await page.setViewportSize({ width, height: 1024 })
            await accountFixture(page, request, { errors: {}, ...props }, { component, url, title })
            await page.keyboard.press('Tab')
            const controls = page.locator('a[href], button, input, select, textarea, summary, [tabindex]')
            let checked = 0
            for (const control of await controls.all()) {
                if (!await control.evaluate(element => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden')) continue
                await control.focus()
                await expect(control).toBeFocused()
                const coverage = await control.evaluate(element => {
                    const label = element.closest('label')
                    return [element, label].filter(Boolean).some(node => {
                        const style = getComputedStyle(node)
                        return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1
                    })
                })
                expect(coverage, `Missing keyboard outline: ${await control.evaluate(element => element.outerHTML.slice(0, 300))}`).toBe(true)
                await control.evaluate((element, index) => { element.dataset.focusAudit = String(index) }, checked)
                checked++
            }
            expect(checked).toBeGreaterThan(0)
            await page.locator('[data-focus-audit="0"]').focus()
            for (let i = 0; i < checked + 2; i++) {
                await page.evaluate(() => { document.activeElement.dataset.focusVisited = 'true' })
                await page.keyboard.press('Tab')
            }
            const missing = await page.locator('[data-focus-audit]').evaluateAll(elements => elements
                .filter(element => !(element.tagName === 'INPUT' && element.type === 'radio' && !element.checked))
                .filter(element => !element.dataset.focusVisited)
                .map(element => element.outerHTML.slice(0, 200)))
            expect(missing, 'Native Tab must reach every enabled control (radio groups use the checked member)').toEqual([])
        })
    }
}

for (const width of [390, 1440]) {
    test.describe(`touch without hover ${width}`, () => {
        test.use({ hasTouch: true, viewport: { width, height: 1024 } })
        test('touch controls work and Hero ignores synthetic mouse steering', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'no-preference' })
            await page.goto('/')
            expect(await page.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches)).toBe(true)
            const cloud = page.locator('.service-logo-cloud')
            await expect(cloud).toHaveAttribute('data-state', 'ready')
            await expect(cloud).toHaveAttribute('data-interactive', 'false')
            await expect(cloud).toHaveAttribute('data-running', width < 1200 ? 'true' : 'false')
            await cloud.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 20, clientY: 20 })
            await expect(cloud).toHaveAttribute('data-interactive', 'false')
            if (width < 1200) {
                await page.getByRole('button', { name: 'Открыть меню' }).tap()
                await expect(page.getByRole('dialog')).toBeVisible()
                await page.getByRole('button', { name: 'Закрыть меню' }).tap()
                await expect(page.getByRole('dialog')).toHaveCount(0)
            }
            const before = await page.locator('html').getAttribute('data-theme')
            await page.getByRole('button', { name: /тема\. Включить/ }).tap()
            await expect(page.locator('html')).not.toHaveAttribute('data-theme', before)
        })
    })
}
