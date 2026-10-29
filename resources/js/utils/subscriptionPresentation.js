export function periodLabel(months) {
    return `${months} ${months === 1 ? 'месяц' : months === 3 ? 'месяца' : 'месяцев'}`
}

export function money(amount, currency = 'RUB') {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: amount % 100 ? 2 : 0 }).format(amount / 100)
}

export function discountLabel(discount) {
    if (!discount) return '—'
    return discount.type === 'percent' ? `${discount.value}%` : money(discount.value)
}

export const PAYMENT_LABELS = { pending: 'Обрабатывается', succeeded: 'Оплачен', canceled: 'Отменён' }
