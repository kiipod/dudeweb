<script setup>
import { Link } from '@inertiajs/vue3'
import UiIcon from '@/components/ui/UiIcon.vue'
import { money, periodLabel, PAYMENT_LABELS } from '@/utils/subscriptionPresentation'
defineProps({ payments: { type: Object, required: true } })
const date = value => value ? new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(value)) : 'Дата не указана'
</script>

<template>
    <section aria-labelledby="payment-history-title" class="grid min-w-0 gap-interface-field-gap">
        <h2 id="payment-history-title" class="text-interface-title font-display">История платежей</h2>
        <p v-if="!payments.data.length" class="flex min-h-interface-control items-center gap-subscription-section rounded-button border border-border bg-surface px-control-inline py-compact text-interface-body text-secondary">
            <UiIcon name="creditCard" size="sm" /> Здесь пока нет платежей.
        </p>
        <ul v-else class="grid min-w-0 gap-compact">
            <li v-for="payment in payments.data" :key="payment.id">
                <Link :href="payment.url" class="flex flex-wrap items-center justify-between gap-content rounded-button border border-border bg-surface p-control-inline text-interface-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                    <span class="grid min-w-0 gap-control wrap-anywhere">
                        <span>{{ payment.planName ?? 'Подписка' }} · {{ periodLabel(payment.months) }}</span>
                        <time :datetime="payment.createdAt" class="text-secondary">{{ date(payment.createdAt) }}</time>
                    </span>
                    <span class="grid gap-control text-right"><span>{{ money(payment.amount, payment.currency) }}</span><span class="text-secondary">{{ PAYMENT_LABELS[payment.status] }}</span></span>
                </Link>
            </li>
        </ul>
        <nav v-if="payments.last_page > 1" aria-label="Страницы истории платежей" class="flex flex-wrap gap-content text-interface-body">
            <Link v-if="payments.prev_page_url" :href="payments.prev_page_url" class="rounded-control text-accent-text focus-visible:outline-2 focus-visible:outline-focus">Назад</Link>
            <span>{{ payments.current_page }} / {{ payments.last_page }}</span>
            <Link v-if="payments.next_page_url" :href="payments.next_page_url" class="rounded-control text-accent-text focus-visible:outline-2 focus-visible:outline-focus">Дальше</Link>
        </nav>
    </section>
</template>
