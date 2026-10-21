<script setup>
import { computed, inject } from 'vue'
import PeriodSelector from '@/components/subscription/PeriodSelector.vue'
import SubscriptionSummary from '@/components/subscription/SubscriptionSummary.vue'
import PromoCodeSheet from '@/components/subscription/PromoCodeSheet.vue'
import BaseOverlay from '@/components/ui/BaseOverlay.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useSubscriptionCheckout } from '@/composables/useSubscriptionCheckout'
import { discountLabel, money, periodLabel } from '@/utils/subscriptionPresentation'
import { accountChromeKey } from '@/utils/accountChrome'

const props = defineProps({ catalogue: { type: Object, required: true } })
const { headerHeight } = inject(accountChromeKey)
const { catalogue, productId, promoOpen, promo, payment, busy, selected, options, applyPromo, pay } = useSubscriptionCheckout(() => props.catalogue)
const summary = computed(() => ({
    plan: catalogue.value.plan?.name ?? 'Подписка',
    period: selected.value ? periodLabel(selected.value.months) : 'Недоступен',
    discount: discountLabel(catalogue.value.discount),
    total: selected.value ? money(selected.value.amount, selected.value.currency) : 'Недоступно',
}))
const paymentErrors = computed(() => Object.values(payment.errors).filter(Boolean))
</script>

<template>
    <div class="grid min-w-0 gap-subscription-section">
        <section class="grid gap-subscription-period" aria-labelledby="period-heading">
            <div class="flex flex-wrap items-center justify-between gap-compact">
                <h2 id="period-heading" class="text-interface-title font-display">Выбери период</h2>
                <p v-if="catalogue.plan" class="font-mono text-interface-body text-accent-text">{{ catalogue.plan.name }}</p>
            </div>
            <PeriodSelector v-model="productId" :disabled="busy" :options="options" />
        </section>
        <SubscriptionSummary v-bind="summary" />
        <div v-if="catalogue.discount" role="status" class="grid gap-compact rounded-button border border-success/40 bg-success-soft p-control-inline text-interface-body text-success">
            <p>{{ catalogue.discount.automatic ? 'Автоматическая скидка' : `Промокод ${catalogue.discount.code} применён` }}: {{ summary.discount }}</p>
            <BaseButton v-if="!catalogue.discount.automatic" :disabled="busy" variant="ghost" @click="applyPromo(true)">Убрать промокод</BaseButton>
        </div>
        <button type="button" :disabled="busy || !selected || catalogue.discount?.automatic" class="inline-flex min-h-interface-control w-full items-center gap-subscription-section rounded-button border border-border bg-elevated px-interface-inline py-tight text-left text-interface-body font-medium text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60" @click="promoOpen = true">
            <UiIcon name="ticket" size="sm" /> {{ catalogue.discount?.code ? 'Изменить промокод' : 'У меня есть промокод' }}
        </button>
        <p v-if="promo.errors.promocode && !promoOpen" role="alert" class="text-interface-body text-error">{{ promo.errors.promocode }}</p>
        <ul v-if="paymentErrors.length" role="alert" class="grid gap-control text-interface-body text-error"><li v-for="error in paymentErrors" :key="error">{{ error }}</li></ul>
        <BaseButton :disabled="!selected || busy" :loading="payment.processing" full-width loading-label="Переходим к оплате" @click="pay">Перейти к оплате</BaseButton>
        <BaseOverlay id="subscription-promo" :open="promoOpen" :busy="promo.processing" :top-offset="headerHeight" labelled-by="promo-title" described-by="promo-description" variant="promo" @close="promoOpen = false">
            <PromoCodeSheet v-model="promo.promocode" :error="promo.errors.promocode" :processing="promo.processing" @apply="applyPromo()" @close="promoOpen = false" />
        </BaseOverlay>
    </div>
</template>
