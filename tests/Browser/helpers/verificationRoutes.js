import { dashboardProps } from './accountDashboard.js'

const pagination = { data: [], current_page: 1, last_page: 1, links: [] }
const formLimits = { submissionId: 'df31dc3e-1c73-4ef5-a37b-9d0b66053aaf', subjectMax: 160, bodyMax: 10000 }
export const verificationRoutes = [
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
    ['Account/Profile', '/account/profile', 'Мой профиль', { user: { username: null, email: 'fixture@example.test', registeredAt: '2026-10-20T10:00:00Z', registeredLabel: '20 октября 2026' }, telegramConnection: { connected: false, username: null, available: true, link: null }, securityCapabilities: { password: true, changeEmail: true }, themePreference: { storage: 'local', choices: ['light', 'dark'] } }],
    ['Account/Payments/Show', '/account/payments/42', 'Не получилось оплатить', { payment: { id: 42, status: 'canceled', amount: 21700, currency: 'RUB', months: 1, retryUrl: '/account/payments/42/retry' } }],
]
