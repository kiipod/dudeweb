export const ACCOUNT_NAVIGATION = [
    { key: 'dashboard', label: 'Главная', icon: 'house', href: '/account' },
    { key: 'subscription', label: 'Подписка', icon: 'creditCard', href: '/account/subscription', disabled: true },
    { key: 'connection', label: 'Подключение', icon: 'plug', href: '/account/connection', disabled: true },
    { key: 'referral', label: 'Пригласить друга', icon: 'userPlus', href: '/account/referral', disabled: true },
    { key: 'support', label: 'Поддержка', icon: 'messageCircle', href: 'https://t.me/hey_dude_web', external: true },
    { key: 'profile', label: 'Профиль', icon: 'user', href: '/account/profile', disabled: true },
]

export function activeAccountSection(url) {
    const path = url.split(/[?#]/)[0]
    return ACCOUNT_NAVIGATION.filter(item => !item.external)
        .findLast(item => path === item.href || path.startsWith(`${item.href}/`))?.key ?? 'dashboard'
}
