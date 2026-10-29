export const DASHBOARD_STATES = {
    trial: { message: 'Твои дни с dudeweb начались.', action: 'Выбрать подписку' },
    active: { message: 'Всё работает. Наслаждайся!', action: 'Продлить подписку' },
    expiring: { message: 'Подписка скоро закончится.', action: 'Продлить подписку' },
    expired: { message: 'Подписка закончилась.', action: 'Возобновить доступ' },
    limited: { message: 'Доступ временно ограничен.', action: 'Связаться с поддержкой' },
}

export function daysLabel(days) {
    const mod10 = days % 10
    const mod100 = days % 100
    const word = mod10 === 1 && mod100 !== 11 ? 'день'
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'дня' : 'дней'
    return `${days} ${word}`
}

export function maskedSubscriptionUrl(url) {
    try { return `${new URL(url).host}/…` } catch { return '' }
}
