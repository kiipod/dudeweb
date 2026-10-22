<script setup>
import { computed } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { daysLabel } from '@/utils/dashboardPresentation'
import { monthsLabel } from '@/utils/referralPresentation'
const props = defineProps({ friendDiscountPercent: { type: Number, required: true }, rewardMatrix: { type: Array, required: true } })
const steps = computed(() => [
    { title: 'Пригласи друга', description: 'Поделись своей реферальной ссылкой.' },
    { title: 'Друг оформляет подписку', description: `На первую покупку действует бонус ${props.friendDiscountPercent}%.` },
    { title: 'Друг оплачивает подписку', description: 'Бонус начисляется после каждой оплаты.' },
    { title: 'Ты получаешь бонус', description: 'Количество дней зависит от периода подписки.' },
])
</script>

<template>
    <section aria-labelledby="friend-benefit-title" class="flex min-w-0 items-center gap-referral-step-gap rounded-button border border-border bg-interface-input p-referral-step">
        <span class="inline-flex size-referral-number shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent-text"><UiIcon name="gift" /></span>
        <div class="grid min-w-0 gap-control"><h2 id="friend-benefit-title" class="text-interface-title font-display">Бонус для друга</h2><p class="text-interface-body text-secondary">{{ friendDiscountPercent }}% на первую покупку подписки</p></div>
    </section>
    <ol aria-label="Как работает программа" class="grid gap-referral-terms">
        <li v-for="(step, index) in steps" :key="step.title" class="flex min-w-0 items-center gap-referral-step-gap rounded-button border border-border bg-interface-input p-referral-step">
            <span aria-hidden="true" class="inline-flex size-referral-number shrink-0 items-center justify-center rounded-control bg-accent-soft font-sans text-account-step-number font-step-number text-accent-text">{{ index + 1 }}</span>
            <div class="grid min-w-0 gap-control"><h2 class="text-interface-title font-display">{{ step.title }}</h2><p class="text-interface-body text-secondary">{{ step.description }}</p></div>
        </li>
    </ol>
    <section aria-labelledby="reward-matrix-title" class="grid min-w-0 grid-cols-1 gap-referral-terms">
        <h2 id="reward-matrix-title" class="text-interface-title font-display">Твой бонус</h2>
        <div class="rounded-button border border-border bg-interface-input px-referral-table py-tight">
            <table class="w-full text-interface-body">
                <caption class="sr-only">Бонус за оплаченный другом период подписки</caption>
                <tbody><tr v-for="row in rewardMatrix" :key="row.months"><th scope="row" class="py-referral-table-row pr-tight text-left font-normal text-secondary">Друг оплатил {{ monthsLabel(row.months) }}</th><td class="py-referral-table-row text-right text-success wrap-anywhere">+{{ daysLabel(row.days) }}</td></tr></tbody>
            </table>
        </div>
    </section>
</template>
