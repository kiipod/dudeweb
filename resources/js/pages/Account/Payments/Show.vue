<script setup>
import { computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import PaymentResultShell from '@/components/shells/PaymentResultShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { usePaymentStatus } from '@/composables/usePaymentStatus'
import { useWebPayment } from '@/composables/useWebPayment'

const props = defineProps({ payment: { type: Object, required: true } })
const { busy, stopped, error, refresh } = usePaymentStatus(() => props.payment)
const { form, redirecting, pay } = useWebPayment()
const state = computed(() => ({
    pending: { title: 'Ожидаем подтверждение оплаты', description: 'Обычно это занимает немного времени. Мы обновим статус, когда платёж подтвердится.' },
    succeeded: { title: 'Готово, Dude!', description: 'Оплата прошла успешно. Твоя подписка обновлена.' },
    canceled: { title: 'Не получилось оплатить', description: props.payment.retryUrl ? 'Платёж не завершён. Попробуй ещё раз или выбери другой способ оплаты.' : 'Платёж отменён. Свяжись с поддержкой, если нужна помощь.' },
})[props.payment.status])
const errors = computed(() => Object.values(form.errors).filter(Boolean))
</script>

<template>
    <Head :title="state.title" />
    <PaymentResultShell :status="payment.status" :title="state.title" :description="state.description">
        <template #actions>
            <p v-if="payment.status === 'pending' && stopped" role="status" class="text-interface-body text-secondary">{{ error ? 'Не удалось обновить статус. Проверь соединение и повтори запрос.' : 'Подтверждение ещё не пришло. Можно проверить статус вручную.' }}</p>
            <BaseButton v-if="payment.status === 'pending' && stopped" :loading="busy" full-width @click="refresh">Проверить статус</BaseButton>
            <ul v-if="errors.length" role="alert" class="grid gap-control text-interface-body text-error"><li v-for="message in errors" :key="message">{{ message }}</li></ul>
            <BaseButton v-if="payment.status === 'canceled' && payment.retryUrl" :loading="form.processing || redirecting" full-width @click="pay(payment.retryUrl)">Попробовать снова</BaseButton>
            <Link v-if="payment.status !== 'canceled'" href="/account" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">На главную</Link>
            <Link v-if="payment.status === 'succeeded'" href="/account/connection" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-status-secondary-border bg-status-secondary px-interface-inline text-interface-action font-bold hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">Подключить устройство</Link>
            <a v-if="payment.status === 'canceled'" href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-status-secondary-border bg-status-secondary px-interface-inline text-interface-action font-bold hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">Связаться с поддержкой</a>
            <Link v-if="payment.status === 'canceled'" href="/account/subscription" class="text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus">К подписке</Link>
        </template>
    </PaymentResultShell>
</template>
