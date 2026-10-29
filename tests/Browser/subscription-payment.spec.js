import { expect, test } from '@playwright/test'
import { accountFixture, dashboardProps, expectLayout, inertiaResponse, screenshot } from './helpers/accountDashboard.js'

const heightFor = width => width === 2560 ? 1440 : width === 1920 ? 1080 : width >= 768 ? 1024 : 900
const titleFor = { pending: 'Ожидаем подтверждение оплаты', succeeded: 'Готово, Dude!', canceled: 'Не получилось оплатить' }

function catalogue(discount = null) {
    return {
        plan: { id: 7, name: 'Безлимитный', deviceLimit: 5 },
        products: [
            { id: 31, months: 1, originalAmount: 21700, amount: discount ? 15190 : 21700, currency: 'RUB' },
            { id: 33, months: 3, originalAmount: 59400, amount: discount ? 41580 : 59400, currency: 'RUB' },
            { id: 36, months: 6, originalAmount: 111100, amount: discount ? 77770 : 111100, currency: 'RUB' },
            { id: 312, months: 12, originalAmount: 222200, amount: discount ? 155540 : 222200, currency: 'RUB' },
        ],
        discount,
    }
}
function props() {
    return { errors: {}, subscription: dashboardProps().subscription, serviceState: 'ready', catalogue: catalogue(), payments: { data: [], total: 0, last_page: 1, current_page: 1 } }
}
async function subscription(page, request, data = props()) {
    return accountFixture(page, request, data, { component: 'Account/Subscription', url: '/account/subscription', title: 'Твоя подписка' })
}
async function payment(page, request, status = 'pending') {
    return accountFixture(page, request, { errors: {}, payment: { id: 42, status, amount: 21700, currency: 'RUB', months: 1, retryUrl: status === 'canceled' ? '/account/payments/42/retry' : null } }, { component: 'Account/Payments/Show', url: '/account/payments/42', title: titleFor[status] })
}

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text()) })
})

for (const theme of ['light', 'dark']) {
    for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 2560]) {
        test(`subscription ${width} ${theme}`, async ({ page, request }, testInfo) => {
            await page.setViewportSize({ width, height: heightFor(width) })
            await page.emulateMedia({ colorScheme: theme })
            await subscription(page, request)
            await expectLayout(page)
            await expect(page.getByRole('radio', { name: '1 месяц', exact: true })).toBeChecked()
            await expect(page.getByText('Здесь пока нет платежей.')).toBeVisible()
            await expect(page.locator('dl').last()).toContainText('217')
            await screenshot(page, testInfo, `subscription-${width}-${theme}`)
        })
    }
    for (const width of [390, 768, 1440, 2560]) {
        test(`promo keyboard, geometry, error and resize ${width} ${theme}`, async ({ page, request }, testInfo) => {
            await page.setViewportSize({ width, height: heightFor(width) })
            await page.emulateMedia({ colorScheme: theme })
            await subscription(page, request)
            const trigger = page.getByRole('button', { name: 'У меня есть промокод' })
            await trigger.focus()
            await page.keyboard.press('Enter')
            const dialog = page.getByRole('dialog', { name: 'Промокод', exact: true })
            await expect(dialog).toBeVisible()
            const initialBox = await dialog.boundingBox()
            const referenceHeight = width < 768 ? 376 : width < 1200 ? 387 : width < 1920 ? 383 : 414
            expect(Math.abs(initialBox.height - referenceHeight)).toBeLessThanOrEqual(6)
            await expect(page.locator('#app')).toHaveJSProperty('inert', true)
            const input = dialog.getByRole('textbox', { name: 'Промокод', exact: true })
            await expect(input).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(page.getByRole('button', { name: 'Закрыть промокод' })).toBeFocused()
            await page.keyboard.press('Tab')
            await expect(input).toBeFocused()
            await input.fill('invalid')
            await page.route('**/account/subscription/promo', route => route.fulfill({ status: 422, json: { message: 'Промокод не найден.', errors: { promocode: ['Промокод не найден.'] } } }))
            await dialog.getByRole('button', { name: 'Применить', exact: true }).click()
            await expect(input).toHaveAttribute('aria-invalid', 'true')
            await expect(input).toHaveAttribute('aria-describedby', 'promo-code-error')
            const box = await dialog.boundingBox()
            expect(box.width).toBe(width < 768 ? width : width < 1200 ? 520 : 500)
            if (width < 1200) expect(box.y + box.height).toBeCloseTo(heightFor(width), 0)
            else expect(box.x + box.width / 2).toBeCloseTo((width + 280) / 2, 0)
            await screenshot(page, testInfo, `promo-${width}-${theme}`, { fullPage: false })
            await page.setViewportSize({ width: width < 1200 ? 1440 : 390, height: 1024 })
            await expect(input).toHaveValue('invalid')
            await expect(input).toHaveAttribute('aria-invalid', 'true')
            await expect(page.getByRole('dialog')).toHaveCount(1)
            await input.focus()
            await page.keyboard.press('Shift+Tab')
            await expect(page.getByRole('button', { name: 'Закрыть промокод' })).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(dialog.getByRole('button', { name: 'Применить', exact: true })).toBeFocused()
            await page.keyboard.press('Escape')
            await expect(dialog).toHaveCount(0)
            await expect(trigger).toBeFocused()
            await expect(page.locator('#app')).toHaveJSProperty('inert', false)
            await expectLayout(page)
        })
    }
    for (const status of ['pending', 'succeeded', 'canceled']) {
        for (const width of [320, 768, 1440, 2560]) {
            test(`payment ${status} ${width} ${theme}`, async ({ page, request }, testInfo) => {
                await page.setViewportSize({ width, height: heightFor(width) })
                await page.emulateMedia({ colorScheme: theme })
                await payment(page, request, status)
                await expectLayout(page)
                await screenshot(page, testInfo, `payment-${status}-${width}-${theme}`)
            })
        }
    }
}

test('native radio keys select one server product; unavailable periods stay disabled', async ({ page, request }) => {
    const data = props()
    data.catalogue.products = data.catalogue.products.filter(p => p.months !== 6)
    await subscription(page, request, data)
    const first = page.getByRole('radio', { name: '1 месяц', exact: true })
    await first.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: '3 месяца', exact: true })).toBeChecked()
    await expect(page.locator('dl').last()).toContainText('594')
    await expect(page.getByRole('radio', { name: '6 месяцев', exact: true })).toBeDisabled()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: '12 месяцев', exact: true })).toBeChecked()
    await expect(page.locator('input:checked')).toHaveCount(1)
})

test('promo submit stays single and modal stays busy during resize, then uses server amounts and removal', async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await subscription(page, request)
    let submits = 0
    let finish
    await page.route('**/account/subscription/promo', async route => {
        submits++
        if (submits === 1) {
            await new Promise(resolve => { finish = resolve })
            await route.fulfill({ json: catalogue({ code: 'VALID', automatic: false, type: 'percent', value: 30 }) })
        } else await route.fulfill({ json: catalogue() })
    })
    await page.getByRole('button', { name: 'У меня есть промокод' }).click()
    await page.getByRole('textbox', { name: 'Промокод', exact: true }).fill('VALID')
    await page.getByRole('button', { name: 'Применить', exact: true }).dblclick()
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-busy', 'true')
    await page.keyboard.press('Escape')
    await page.setViewportSize({ width: 1440, height: 1024 })
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(submits).toBe(1)
    finish()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText('Промокод VALID применён: 30%')).toBeVisible()
    await expect(page.locator('dl').last()).toContainText('151,9')
    await page.getByRole('button', { name: 'Убрать промокод' }).click()
    await expect(page.getByText('Промокод VALID применён: 30%')).toHaveCount(0)
    await expect(page.locator('dl').last()).toContainText('217')
})

test('provider failure allows a fresh keyed attempt; double submit and back-forward do not auto-pay', async ({ page, request }) => {
    await subscription(page, request)
    const keys = []
    await page.route('**/payments', async route => {
        keys.push(route.request().headers()['idempotency-key'])
        expect(route.request().postDataJSON().product_id).toBe(31)
        if (keys.length === 1) await route.fulfill({ status: 502, json: { message: 'Ошибка провайдера' } })
        else await route.fulfill({ status: 201, json: { payment_id: 43, confirmation_url: 'https://checkout.example.test/confirmed-by-server' } })
    })
    await page.route('https://checkout.example.test/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Provider fixture</h1>' }))
    await page.getByRole('button', { name: 'Перейти к оплате' }).dblclick()
    await expect(page.getByRole('alert')).toContainText('Не удалось перейти к оплате')
    expect(keys).toHaveLength(1)
    await page.getByRole('button', { name: 'Перейти к оплате' }).dblclick()
    await expect(page).toHaveURL('https://checkout.example.test/confirmed-by-server')
    expect(keys).toHaveLength(2)
    expect(keys[0]).toBeTruthy()
    expect(keys[1]).not.toBe(keys[0])
    await page.goBack()
    await expect(page.getByRole('heading', { name: 'Твоя подписка' })).toBeVisible()
    await page.goForward()
    expect(keys).toHaveLength(2)
})

for (const terminal of ['succeeded', 'canceled']) {
    test(`polling stops on ${terminal} and never infers success from elapsed time`, async ({ page, request }) => {
        await page.clock.install()
        const server = await payment(page, request)
        server.reload = async route => {
            server.props.payment.status = terminal
            await inertiaResponse(route, server.page())
        }
        await page.clock.runFor(2100)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(titleFor[terminal])
        expect(server.reloadCount).toBe(1)
        await page.clock.runFor(65000)
        expect(server.reloadCount).toBe(1)
    })
}

test('pending polling stops at 60 seconds, allows manual refresh, and cancels on unmount', async ({ page, request }) => {
    await page.clock.install()
    const server = await payment(page, request)
    await page.clock.runFor(61000)
    await expect(page.getByRole('button', { name: 'Проверить статус' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titleFor.pending)
    const count = server.reloadCount
    await page.clock.runFor(6000)
    expect(server.reloadCount).toBe(count)
    await page.getByRole('button', { name: 'Проверить статус' }).click()
    await expect.poll(() => server.reloadCount).toBe(count + 1)
    await page.route('**/account', route => inertiaResponse(route, { ...server.loginPage, url: '/account', component: 'Account/Dashboard', props: dashboardProps() }))
    await page.getByRole('link', { name: 'На главную', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Привет')
    await page.clock.runFor(6000)
    expect(server.reloadCount).toBe(count + 1)
})

test('automatic discount, history and missing products render without client pricing rules', async ({ page, request }) => {
    const data = props()
    data.catalogue = catalogue({ automatic: true, code: null, type: 'percent', value: 30 })
    data.payments.data = [{ id: 42, status: 'succeeded', planName: 'Мой тариф', months: 3, amount: 41580, currency: 'RUB', createdAt: '2026-10-20T10:00:00Z', url: '/account/payments/42' }]
    await subscription(page, request, data)
    await expect(page.getByText('Автоматическая скидка: 30%')).toBeVisible()
    await expect(page.getByRole('button', { name: 'У меня есть промокод' })).toBeDisabled()
    await expect(page.getByRole('link', { name: /Мой тариф/ })).toContainText('Оплачен')
    await expectLayout(page)
})

test('retry posts a new intent and follows only its returned confirmation URL', async ({ page, request }) => {
    await payment(page, request, 'canceled')
    let calls = 0
    await page.route('**/account/payments/42/retry', route => {
        calls++
        expect(route.request().headers()['idempotency-key']).toBeTruthy()
        return route.fulfill({ status: 201, json: { payment_id: 43, confirmation_url: 'https://checkout.example.test/fresh-attempt' } })
    })
    await page.route('https://checkout.example.test/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Fresh attempt</h1>' }))
    await page.getByRole('button', { name: 'Попробовать снова' }).dblclick()
    await expect(page).toHaveURL('https://checkout.example.test/fresh-attempt')
    expect(calls).toBe(1)
})

test('network error stops polling and manual refresh can observe real success', async ({ page, request }) => {
    await page.clock.install()
    const server = await payment(page, request)
    server.reload = route => route.abort('failed')
    await page.clock.runFor(2100)
    await expect(page.getByRole('button', { name: 'Проверить статус' })).toBeVisible()
    await expect(page.getByText('Не удалось обновить статус. Проверь соединение и повтори запрос.')).toBeVisible()
    await page.clock.runFor(10000)
    expect(server.reloadCount).toBe(1)
    server.reload = async route => {
        server.props.payment.status = 'succeeded'
        await inertiaResponse(route, server.page())
    }
    await page.getByRole('button', { name: 'Проверить статус' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titleFor.succeeded)
})

test('leaving a pending page cancels its scheduled poll before the first refresh', async ({ page, request }) => {
    await page.clock.install()
    const server = await payment(page, request)
    await page.route('**/account', route => inertiaResponse(route, { ...server.loginPage, component: 'Account/Dashboard', url: '/account', props: dashboardProps() }))
    await page.getByRole('link', { name: 'На главную', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Привет')
    await page.clock.runFor(10000)
    expect(server.reloadCount).toBe(0)
})

test('no available products cannot create a payment', async ({ page, request }) => {
    const data = props()
    data.catalogue = { plan: null, products: [], discount: null }
    await subscription(page, request, data)
    for (const radio of await page.getByRole('radio').all()) await expect(radio).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Перейти к оплате' })).toBeDisabled()
    await expect(page.getByText('Сейчас нет доступных периодов для оплаты. Попробуй позже.')).toBeVisible()
})

for (const theme of ['light', 'dark']) {
    test(`320 text-only 2x subscription and promo ${theme}`, async ({ page, request }, testInfo) => {
        await page.setViewportSize({ width: 320, height: 900 })
        await page.emulateMedia({ colorScheme: theme })
        await subscription(page, request)
        await page.evaluate(() => {
            const elements = [...document.querySelectorAll('#app *, body > div *')]
            const sizes = elements.map(element => getComputedStyle(element).fontSize)
            elements.forEach((element, i) => { element.style.fontSize = `${parseFloat(sizes[i]) * 2}px` })
        })
        await expectLayout(page)
        await page.getByRole('button', { name: 'У меня есть промокод' }).click()
        await page.getByRole('dialog').locator('*').evaluateAll(elements => {
            const sizes = elements.map(element => getComputedStyle(element).fontSize)
            elements.forEach((element, i) => { element.style.fontSize = `${parseFloat(sizes[i]) * 2}px` })
        })
        await expect(page.getByRole('textbox', { name: 'Промокод', exact: true })).toBeVisible()
        await expectLayout(page)
        await screenshot(page, testInfo, `subscription-text2x-${theme}`, { fullPage: false })
    })
}
