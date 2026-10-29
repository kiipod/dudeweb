import { readFileSync } from 'node:fs'
import { accountFixture } from './accountDashboard.js'
import { verificationRoutes } from './verificationRoutes.js'

export const penFrames = JSON.parse(readFileSync(new URL('../../../docs/audit/pen-verification-frames.json', import.meta.url))).frames

export async function penFixture(page, request, frame) {
    const [component, url, defaultTitle, defaultProps] = verificationRoutes.find(([component]) => component === frame.component)
    const props = structuredClone({ errors: {}, ...defaultProps })
    let title = defaultTitle
    if (component === 'Public/Home') {
        props.pricingState = 'ready'
        props.plans = [{
            id: 7, name: 'Безлимитный', deviceLimit: 5,
            advantages: ['5 устройств в подписке', 'Трафик без ограничений', 'Безопасность ваших данных в интернете', 'Скорость соединения до 1Гб', 'Отсутствие логов'],
            products: [1, 3, 6, 12].map((months, i) => ({ id: months, months, priceMinor: [21700, 59400, 111100, 222200][i], currency: 'RUB' })),
        }]
    }
    if (frame.state === 'link-sent') { props.linkRequested = true; title = 'Проверь почту' }
    if (frame.state === 'password-changed') { props.passwordChanged = true; title = 'Пароль изменён' }
    if (component === 'Account/Payments/Show') {
        props.payment.status = frame.state
        props.payment.retryUrl = frame.state === 'canceled' ? '/account/payments/42/retry' : null
        title = { pending: 'Ожидаем подтверждение оплаты', succeeded: 'Готово, Dude!', canceled: 'Не получилось оплатить' }[frame.state]
    }
    if (component === 'Account/Referral/Terms') {
        props.rewardMatrix = [1, 3, 6, 12].map((months, i) => ({ months, days: [7, 14, 21, 30][i] }))
    }
    if (component === 'Account/Referral/Index') props.metrics = { invitedCount: 3, bonusDays: 21 }
    if (component === 'Account/Connection') {
        props.deviceCount = 2
        props.devices = ['Мой ноутбук', 'Телефон'].map((name, i) => ({ token: `opaque-fixture-${i}`, name, platform: i ? 'Android' : 'Windows', osVersion: '11' }))
        props.platforms = ['windows', 'macos', 'linux', 'android', 'ios'].map((id, i) => ({
            id, label: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'][i], available: true,
            apps: [{ name: 'Тестовое приложение', featured: true, steps: [
                { title: 'Установи приложение', description: 'Скачай приложение для своего устройства.', content: [], links: [{ label: 'Скачать приложение', url: `https://downloads.example.test/${id}`, external: true }] },
                { title: 'Добавь ссылку подключения', description: 'Скопируй ссылку из кабинета и добавь её в приложение.', content: [], links: [] },
                { title: 'Активируй соединение', description: 'Открой приложение и включи подключение.', content: [], links: [] },
            ] }],
        }))
    }
    if (component.startsWith('Account/Support/')) {
        const metadata = { subject: 'Не получается подключиться', status: 'OPEN', statusLabel: 'Открыто', updatedAt: '2026-10-20T12:40:00Z', updatedLabel: '20 октября 2026, 12:40' }
        if (component.endsWith('/Index')) props.tickets.data = [{ ...metadata, preview: 'Проверили настройки — попробуй добавить ссылку ещё раз.', url: '/account/support/1' }]
        if (component.endsWith('/Show')) {
            props.ticket = { ...metadata, replyUrl: '/account/support/1/messages' }
            props.messages.data = ['Не получается добавить ссылку в приложение.', 'Скопируй ссылку заново и добавь её в приложение.'].map((body, i) => ({ id: i + 1, author: i ? 'operator' : 'customer', authorLabel: i ? 'Поддержка' : 'Ты', body, createdAt: '2026-10-20T12:35:00Z', timeLabel: '20 октября, 12:35' }))
            title = metadata.subject
        }
    }
    if (component === 'Account/Subscription') {
        props.catalogue.products = [1, 3, 6, 12].map((months, i) => ({ id: months, months, amount: [21700, 59400, 111100, 222200][i], originalAmount: [21700, 59400, 111100, 222200][i], currency: 'RUB' }))
    }
    await accountFixture(page, request, props, { component, url, title })
    if (frame.state === 'more-open') await page.getByRole('button', { name: 'Ещё', exact: true }).click()
    if (frame.state === 'promo-open') await page.getByRole('button', { name: 'У меня есть промокод', exact: true }).click()
    if (frame.state === 'menu-open') await page.getByRole('button', { name: 'Открыть меню', exact: true }).click()
}
