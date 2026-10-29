import { expect, test } from '@playwright/test'
import { accountFixture, dashboardProps, expectLayout, inertiaResponse, screenshot } from './helpers/accountDashboard.js'
import { expectPageRefresh } from './helpers/pageRefresh.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'

const widths = [320, 360, 390, 768, 1024, 1440, 1920, 2560]
const heightFor = width => width === 2560 ? 1440 : width === 1920 ? 1080 : width >= 768 ? 1024 : 844
const labels = { trial: 'Пробный период', active: 'Активна', expiring: 'Скоро истечёт', expired: 'Истекла', limited: 'Ограничена' }

for (const component of ['Account/Dashboard', 'Account/Connection', 'Account/Support/Index', 'Account/Support/Show']) {
    for (const width of [320, 1440]) {
        for (const theme of ['light', 'dark']) {
            test(`page heading refresh keyboard ${component} ${width} ${theme}`, async ({ page, request }) => {
                await page.setViewportSize({ width, height: heightFor(width) })
                await page.emulateMedia({ colorScheme: theme })
                const [, url, title, props] = verificationRoutes.find(row => row[0] === component)
                const server = await accountFixture(page, request, { errors: {}, ...structuredClone(props) }, { component, url, title })
                const refresh = page.getByRole('button', { name: 'Обновить данные', exact: true })
                await expectPageRefresh(page, width)
                let release
                const pending = new Promise(resolve => { release = resolve })
                server.reload = async route => { await pending; await inertiaResponse(route, server.page()) }
                await page.keyboard.press('Tab')
                await refresh.focus()
                await expect(refresh).toBeFocused()
                await expect(refresh).toHaveCSS('outline-width', '2px')
                await page.keyboard.press('Enter')
                await expect(refresh).toBeDisabled()
                await expect(refresh).toHaveAttribute('aria-busy', 'true')
                await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
                await page.keyboard.press('Enter')
                expect(server.reloadCount).toBe(1)
                await expectPageRefresh(page, width)
                await expectLayout(page)
                release()
                await expect(refresh).toBeEnabled()
                await expect(refresh).toHaveAttribute('aria-busy', 'false')
                expect(server.reloadCount).toBe(1)
            })
        }
    }
}

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
})

for (const theme of ['light', 'dark']) {
    for (const width of widths) {
        test(`dashboard screenshot ${width} ${theme}`, async ({ page, request }, testInfo) => {
            await page.setViewportSize({ width, height: heightFor(width) })
            await page.emulateMedia({ colorScheme: theme })
            await accountFixture(page, request)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await expectLayout(page)
            await expectPageRefresh(page, width)
            const content = await page.locator('#account-content > div').boundingBox()
            const expectedWidth = width < 768 ? width - 40 : width < 1200 ? 640 : ({ 1440: 900, 1920: 1040, 2560: 1120 })[width]
            expect(content.width).toBeCloseTo(expectedWidth, 0)
            if (width >= 1200) {
                await expect(page.getByRole('navigation', { name: 'Разделы личного кабинета' }).getByRole('link', { name: 'Главная', exact: true })).toHaveAttribute('aria-current', 'page')
                expect((await page.getByRole('complementary').boundingBox()).width).toBe(280)
            } else {
                await expect(page.getByRole('button', { name: 'Ещё', exact: true })).toBeVisible()
                if (width === 390) {
                    const label = page.getByRole('navigation', { name: 'Навигация личного кабинета' }).getByRole('link', { name: 'Подключение', exact: true }).locator('span')
                    const size = await label.evaluate(element => ({ height: element.getBoundingClientRect().height, line: parseFloat(getComputedStyle(element).lineHeight) }))
                    expect(size.height).toBeLessThanOrEqual(size.line + 1)
                }
            }
            await screenshot(page, testInfo, `dashboard-${width}-${theme}`)
            await screenshot(page, testInfo, `viewport-${width}-${theme}`, { fullPage: false })
        })
    }
    for (const width of [390, 768]) {
        test(`More keyboard, focus and screenshot ${width} ${theme}`, async ({ page, request }, testInfo) => {
            await page.setViewportSize({ width, height: heightFor(width) })
            await page.emulateMedia({ colorScheme: theme })
            await accountFixture(page, request)
            const trigger = page.getByRole('button', { name: 'Ещё', exact: true })
            // Reach More through the browser's real tab order, starting at body.
            for (let i = 0; i < 12; i++) {
                await page.keyboard.press('Tab')
                if (await trigger.evaluate(element => element === document.activeElement)) break
            }
            await expect(trigger).toBeFocused()
            await page.keyboard.press('Enter')
            const dialog = page.getByRole('dialog', { name: 'Ещё', exact: true })
            await expect(dialog).toBeVisible()
            const close = dialog.getByRole('button', { name: 'Закрыть меню' })
            const referral = dialog.getByRole('link', { name: 'Пригласить друга', exact: true })
            const support = dialog.getByRole('link', { name: 'Поддержка' })
            const profile = dialog.getByRole('link', { name: 'Профиль', exact: true })
            const logout = dialog.getByRole('button', { name: 'Выйти', exact: true })
            await expect(close).toBeFocused()
            await expect(page.locator('#app')).toHaveAttribute('inert', '')
            expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('hidden')
            await page.keyboard.press('Tab')
            await expect(referral).toBeFocused()
            await page.keyboard.press('Tab')
            await expect(support).toBeFocused()
            await page.keyboard.press('Tab')
            await expect(profile).toBeFocused()
            await page.keyboard.press('Tab')
            await expect(logout).toBeFocused()
            await page.keyboard.press('Tab')
            await expect(close).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(logout).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(profile).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(support).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(referral).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(close).toBeFocused()
            const rect = await dialog.boundingBox()
            expect(rect.width).toBe(width < 768 ? width : 520)
            expect(rect.height).toBeCloseTo(372, 0)
            expect(rect.x).toBe((width - rect.width) / 2)
            expect(rect.y + rect.height).toBe(heightFor(width))
            const header = await page.locator('#account-shell > header').boundingBox()
            expect((await dialog.locator('..').boundingBox()).y).toBe(header.height)
            const focusStyle = await close.evaluate(element => ({ visible: element.matches(':focus-visible'), outline: getComputedStyle(element).outlineStyle }))
            expect(focusStyle.visible).toBe(true)
            expect(focusStyle.outline).not.toBe('none')
            await screenshot(page, testInfo, `more-${width}-${theme}`, { fullPage: false })
            await page.keyboard.press('Escape')
            await expect(dialog).toHaveCount(0)
            await expect(trigger).toBeFocused()
            await expect(page.locator('#app')).not.toHaveAttribute('inert')
            expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('')
            await page.keyboard.press('Enter')
            await expect(close).toBeFocused()
            await page.keyboard.press('Enter')
            await expect(dialog).toHaveCount(0)
            await expect(trigger).toBeFocused()
        })
    }
}

for (const theme of ['light', 'dark']) {
    for (const width of [320, 768, 1440, 2560]) {
        for (const state of [...Object.keys(labels), 'service_error']) {
            test(`state ${state} ${width} ${theme}`, async ({ page, request }, testInfo) => {
                await page.setViewportSize({ width, height: heightFor(width) })
                await page.emulateMedia({ colorScheme: theme })
                await accountFixture(page, request, dashboardProps(state, state === 'trial' ? 0 : state === 'limited' ? 5 : 2))
                await expectLayout(page)
                if (state === 'service_error') {
                    await expect(page.getByRole('alert')).toContainText('Не удалось загрузить данные.')
                    await expect(page.getByLabel('Твоя подписка')).toHaveCount(0)
                    await expect(page.getByText('sub.example.test/…', { exact: true })).toHaveCount(0)
                    await expect(page.getByRole('textbox', { name: 'Ссылка подключения', exact: true })).toHaveCount(0)
                } else {
                    await expect(page.getByText(labels[state], { exact: true })).toBeVisible()
                    await expect(page.getByRole('textbox', { name: 'Ссылка подключения', exact: true })).toHaveValue(dashboardProps(state).subscription.url)
                    await expect(page.getByText(/Подключено:/)).toContainText(state === 'trial' ? '0 из 5' : state === 'limited' ? '5 из 5' : '2 из 5')
                }
                await screenshot(page, testInfo, `state-${state}-${width}-${theme}`)
            })
        }
    }
    test(`long labels and doubled text 320 ${theme}`, async ({ page, request }, testInfo) => {
        await page.setViewportSize({ width: 320, height: 844 })
        await page.emulateMedia({ colorScheme: theme })
        const props = dashboardProps()
        props.subscription.planName = 'ОченьДлинноеНазваниеПодпискиБезПробелов'.repeat(3)
        props.subscription.expiresOn = '20 ноября 2026 года, пятница, до конца расчётного периода'
        await accountFixture(page, request, props)
        // Text-only enlargement preserves each element's computed size; avoid
        // compounding inherited percentages through the component tree.
        await page.evaluate(() => {
            const sizes = [...document.querySelectorAll('#app *')].map(element => [element, getComputedStyle(element).fontSize])
            for (const [element, size] of sizes) {
                element.style.fontSize = `${parseFloat(size) * 2}px`
            }
        })
        await expectLayout(page)
        const skip = await page.getByRole('link', { name: 'К основному содержимому' }).boundingBox()
        expect(skip.y + skip.height).toBeLessThanOrEqual(0)
        const clippedText = await page.locator('h1:visible, h2:visible, p:visible, dt:visible, dd:visible').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => ({ tag: element.tagName, text: element.textContent.trim(), width: element.clientWidth, scroll: element.scrollWidth })))
        expect(clippedText).toEqual([])
        expect(await page.locator('button:visible').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1).length)).toBe(0)
        await screenshot(page, testInfo, `text-2x-320-${theme}`)
        const trigger = page.getByRole('button', { name: 'Ещё', exact: true })
        await trigger.click()
        const dialog = page.getByRole('dialog', { name: 'Ещё', exact: true })
        await dialog.evaluate(element => {
            const sizes = [element, ...element.querySelectorAll('*')].map(control => [control, getComputedStyle(control).fontSize])
            for (const [control, size] of sizes) control.style.fontSize = `${parseFloat(size) * 2}px`
        })
        await expect(dialog.getByRole('button', { name: 'Закрыть меню' })).toBeFocused()
        const header = await page.locator('#account-shell > header').boundingBox()
        expect((await dialog.locator('..').boundingBox()).y).toBe(header.height)
        await screenshot(page, testInfo, `more-text-2x-320-${theme}`)
        await page.keyboard.press('Escape')
        await expect(trigger).toBeFocused()
    })
}

for (const failure of ['network', 'http']) {
    test(`retry after ${failure} failure hides stale data and recovers`, async ({ page, request }) => {
        const server = await accountFixture(page, request)
        server.reload = route => failure === 'network' ? route.abort('failed') : route.fulfill({ status: 503, contentType: 'text/html', body: 'Unavailable' })
        await page.getByRole('button', { name: 'Обновить данные' }).click()
        await expect(page.getByRole('alert')).toContainText('Не удалось загрузить данные.')
        await expect(page.getByLabel('Твоя подписка')).toHaveCount(0)
        expect(server.reloadCount).toBe(1)
        server.props = dashboardProps('expired', 5)
        server.reload = null
        await page.getByRole('button', { name: 'Попробовать снова' }).click()
        await expect(page.getByText('Истекла', { exact: true })).toBeVisible()
        await expect(page.getByText(/Подключено:/)).toContainText('5 из 5')
        expect(server.reloadCount).toBe(2)
    })
}

test('loading hides previous data and double retry sends one request', async ({ page, request }, testInfo) => {
    const server = await accountFixture(page, request)
    let release
    const pending = new Promise(resolve => { release = resolve })
    server.reload = async route => { await pending; await inertiaResponse(route, server.page()) }
    await page.getByRole('button', { name: 'Обновить данные' }).scrollIntoViewIfNeeded()
    const rect = await page.getByRole('button', { name: 'Обновить данные' }).boundingBox()
    await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2, { clickCount: 2 })
    await expect(page.getByRole('status')).toContainText('Проверяем данные подписки…')
    await expect(page.getByRole('button', { name: 'Обновить данные', exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Обновить данные', exact: true })).toHaveAttribute('aria-busy', 'true')
    await expect(page.getByLabel('Твоя подписка')).toHaveCount(0)
    expect(server.reloadCount).toBe(1)
    await screenshot(page, testInfo, 'loading')
    release()
    await expect(page.getByText('Активна', { exact: true })).toBeVisible()
    expect(server.reloadCount).toBe(1)
})

test('More closes on support intent, backdrop and desktop resize; theme survives navigation', async ({ page, request }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    const server = await accountFixture(page, request)
    const trigger = page.getByRole('button', { name: 'Ещё', exact: true })
    const dialog = page.getByRole('dialog', { name: 'Ещё', exact: true })
    await trigger.click()
    const support = dialog.getByRole('link', { name: 'Поддержка' })
    await expect(support).toHaveAttribute('href', '/account/support')
    await support.evaluate(element => element.addEventListener('click', event => event.preventDefault(), { capture: true }))
    await support.click()
    await expect(dialog).toHaveCount(0)
    await trigger.click()
    await page.mouse.click(2, 100)
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await trigger.click()
    await page.setViewportSize({ width: 1440, height: 1024 })
    await expect(dialog).toHaveCount(0)
    await expect(page.locator('#app')).not.toHaveAttribute('inert')
    await page.getByRole('button', { name: /Включить тёмную/ }).click()
    server.props = { ...server.props, user: { displayName: 'Мария' } }
    await page.getByRole('navigation', { name: 'Разделы личного кабинета' }).getByRole('link', { name: 'Главная', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Привет, Мария 👋')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('button', { name: /Включить светлую/ })).toBeVisible()
})

test('logout busy blocks close and duplicate intent, then clears the overlay', async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const server = await accountFixture(page, request)
    let release
    let requests = 0
    const pending = new Promise(resolve => { release = resolve })
    await page.route('**/logout', async route => {
        requests++
        expect(route.request().method()).toBe('DELETE')
        await pending
        await inertiaResponse(route, { ...server.loginPage, url: '/login', clearHistory: true })
    })
    await page.getByRole('button', { name: 'Ещё', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Ещё', exact: true })
    await dialog.getByRole('button', { name: 'Выйти', exact: true }).click()
    await expect(dialog).toHaveAttribute('aria-busy', 'true')
    await expect(dialog.getByRole('button', { name: 'Закрыть меню' })).toBeDisabled()
    await expect(dialog.getByRole('button', { name: 'Выходим' })).toBeDisabled()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeVisible()
    expect(requests).toBe(1)
    release()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('С возвращением, Dude.')
    await expect(dialog).toHaveCount(0)
    await expect(page.locator('#app')).not.toHaveAttribute('inert')
    expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('')
})

test('desktop skip link works with keyboard and sidebar remains scrollable', async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 400 })
    await accountFixture(page, request)
    const skip = page.getByRole('link', { name: 'К основному содержимому' })
    await page.keyboard.press('Tab')
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('main')).toBeFocused()
    expect(await page.getByRole('complementary').evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true)
    await page.getByRole('complementary').getByRole('button', { name: 'Выйти', exact: true }).focus()
    const rect = await page.getByRole('complementary').getByRole('button', { name: 'Выйти', exact: true }).boundingBox()
    expect(rect.y).toBeGreaterThanOrEqual(0)
    expect(rect.y + rect.height).toBeLessThanOrEqual(400)
})
