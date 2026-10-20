export const ACCOUNT_NAVIGATION = [
    { key: 'dashboard', label: 'Главная', icon: 'house', href: '/account' },
    { key: 'subscription', label: 'Подписка', icon: 'creditCard', href: '/account/subscription' },
    { key: 'connection', label: 'Подключение', icon: 'plug', href: '/account/connection' },
    { key: 'referral', label: 'Пригласить друга', icon: 'userPlus', href: '/account/referral' },
    { key: 'support', label: 'Поддержка', icon: 'messageCircle', href: '/account/support' },
    { key: 'profile', label: 'Профиль', icon: 'user', href: '/account/profile', disabled: true },
]

export function activeAccountSection(url) {
    const path = url.split(/[?#]/)[0]
    return ACCOUNT_NAVIGATION.filter(item => !item.external)
        .findLast(item => path === item.href || path.startsWith(`${item.href}/`))?.key ?? 'dashboard'
}
