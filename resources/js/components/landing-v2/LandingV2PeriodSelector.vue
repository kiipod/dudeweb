<script setup>
import { computed, ref } from 'vue'
import LandingV2Action from '@/components/landing-v2/LandingV2Action.vue'
import { LANDING_V2_SUPPORT, LANDING_V2_TRIAL } from '@/data/landingV2Navigation'

const props = defineProps({
    plans: { type: Array, required: true },
    state: { type: String, required: true, validator: value => ['ready', 'empty', 'unavailable'].includes(value) },
})

const periods = [
    { months: 1, label: '1 месяц' },
    { months: 3, label: '3 месяца' },
    { months: 6, label: '6 месяцев' },
    { months: 12, label: '12 месяцев' },
]
const selectedMonths = ref(null)
const plan = computed(() => props.plans[0] ?? null)
const products = computed(() => props.state === 'ready' ? plan.value?.products ?? [] : [])
const selected = computed(() => products.value.find(product => product.months === selectedMonths.value) ?? products.value[0] ?? null)
const options = computed(() => periods.map(period => ({ ...period, available: products.value.some(product => product.months === period.months) })))
const selectedLabel = computed(() => periods.find(period => period.months === selected.value?.months)?.label ?? '—')
const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const monthlyPrice = computed(() => selected.value ? money.format(selected.value.priceMinor / 100 / selected.value.months) : '— ₽')
const total = computed(() => selected.value ? money.format(selected.value.priceMinor / 100) : '— ₽')
</script>

<template>
    <div data-v2-period-selector class="flex min-w-0 flex-col gap-v2-subscription-condition v2-desktop:pt-v2-subscription-selector-top">
        <div class="border border-v2-control-border">
            <fieldset class="min-w-0 border-b border-v2-control-border">
                <legend class="sr-only">Период подписки</legend>
                <div class="grid h-v2-subscription-tabs grid-cols-4">
                    <label v-for="option in options" :key="option.months" class="v2-period-option relative flex min-w-0 items-center justify-center font-mono text-v2-subscription-tab text-v2-subscription-muted" :class="option.available ? 'cursor-pointer hover:text-v2-ink' : 'cursor-default'">
                        <input
                            :checked="selected?.months === option.months"
                            :disabled="!option.available"
                            :value="option.months"
                            type="radio"
                            name="v2-subscription-period"
                            class="peer sr-only"
                            @change="selectedMonths = option.months"
                        >
                        <span class="peer-checked:font-medium peer-checked:text-v2-subscription-selected">{{ option.label }}</span>
                        <span v-if="!option.available" class="sr-only"> — недоступен</span>
                        <span class="v2-period-underline pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-v2-brand transition-transform duration-(--v2-duration-period) peer-checked:scale-x-100 motion-reduce:transition-none" aria-hidden="true" />
                    </label>
                </div>
            </fieldset>
            <div data-v2-price-panel class="flex min-w-0 flex-col gap-v2-subscription-panel bg-v2-price-surface p-v2-subscription-panel-inset">
                <p class="text-v2-subscription-plan font-medium text-v2-subscription-plan-ink">{{ plan?.name ?? 'Безлимитный' }}</p>
                <div data-v2-price-row class="flex min-w-0 items-end gap-2.5" aria-live="polite" aria-atomic="true">
                    <span class="v2-price-stack grid min-w-0 text-v2-subscription-price font-medium tracking-v2-subscription-price text-v2-subscription-price-ink">
                        <Transition name="v2-price">
                            <span :key="monthlyPrice" data-v2-monthly-price class="col-start-1 row-start-1 whitespace-nowrap">{{ monthlyPrice }}</span>
                        </Transition>
                    </span>
                    <span class="shrink-0 text-v2-subscription-unit text-v2-subscription-muted">/ мес.</span>
                </div>
                <dl class="grid gap-4" aria-live="polite" aria-atomic="true">
                    <div class="flex min-w-0 items-center justify-between gap-2">
                        <dt class="text-v2-subscription-label text-v2-subscription-muted">Период</dt>
                        <dd data-v2-period-summary class="text-v2-subscription-value font-medium text-v2-subscription-value-ink">{{ selectedLabel }}</dd>
                    </div>
                    <div class="flex min-w-0 items-center justify-between gap-2">
                        <dt class="text-v2-subscription-label text-v2-subscription-muted">Итого к оплате</dt>
                        <dd data-v2-total class="text-v2-subscription-value font-medium whitespace-nowrap text-v2-subscription-value-ink">{{ total }}</dd>
                    </div>
                </dl>
                <div class="h-px bg-v2-divider" aria-hidden="true" />
                <LandingV2Action v-if="selected" :href="LANDING_V2_TRIAL" variant="subscription">Выбрать подписку</LandingV2Action>
                <div v-else role="status" class="flex flex-col items-start gap-3 text-v2-subscription-point-copy text-v2-subscription-muted">
                    <p>{{ state === 'unavailable' ? 'Не удалось загрузить тариф' : 'Тариф временно недоступен' }}</p>
                    <p>Попробуй зайти позже или напиши нам — поможем разобраться.</p>
                    <a :href="LANDING_V2_SUPPORT" class="inline-flex min-h-11 items-center text-v2-focus underline underline-offset-4 outline-none keyboard-focus:outline-2 keyboard-focus:outline-offset-2 keyboard-focus:outline-v2-focus">Написать в поддержку</a>
                </div>
            </div>
        </div>
        <p class="text-v2-subscription-condition text-v2-subscription-muted">3 дня бесплатно для новых пользователей</p>
    </div>
</template>

<style scoped>
.v2-period-option:has(input:focus-visible) {
    outline: 2px solid var(--color-v2-focus);
    outline-offset: calc(-1 * var(--spacing-v2-focus-offset));
}

.v2-price-enter-active,
.v2-price-leave-active {
    transition: opacity var(--v2-duration-amount);
}

.v2-price-enter-from,
.v2-price-leave-to {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce), (forced-colors: active) {
    .v2-period-underline,
    .v2-price-enter-active,
    .v2-price-leave-active {
        transition: none;
    }
}

@media (forced-colors: active) {
    .v2-period-option:has(input:checked) {
        outline: 2px solid Highlight;
        outline-offset: -2px;
    }
}
</style>
