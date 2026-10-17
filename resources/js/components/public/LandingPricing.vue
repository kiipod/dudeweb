<script setup>
import { computed, shallowRef } from 'vue'
import { Link } from '@inertiajs/vue3'
import UiIcon from '@/components/ui/UiIcon.vue'

const props = defineProps({
    plans: { type: Array, required: true },
    state: { type: String, required: true, validator: value => ['ready', 'empty', 'unavailable'].includes(value) },
})
const selectedId = shallowRef(null)
const plan = computed(() => props.plans[0] ?? null)
const selectedProduct = computed(() => plan.value?.products.find(product => product.id === selectedId.value) ?? plan.value?.products[0] ?? null)
const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const periodPrice = computed(() => selectedProduct.value ? money.format(selectedProduct.value.priceMinor / 100) : '')
</script>

<template>
    <section id="pricing" class="scroll-mt-public-header bg-landing-section tablet:scroll-mt-public-header-tablet desktop:scroll-mt-public-header-wide" aria-labelledby="pricing-title">
        <div class="landing-pricing mx-auto grid min-h-pricing-height w-full max-w-landing gap-pricing-grid-gap px-pricing-gutter pt-pricing-top pb-pricing-bottom desktop:items-center">
            <div class="flex min-w-0 flex-col items-start gap-pricing-story-gap">
                <p class="font-mono text-landing-eyebrow font-bold tracking-pricing-eyebrow text-accent">ОДИН ТАРИФ. ВСЁ ПРОСТО.</p>
                <span class="h-pricing-rule-height w-pricing-rule rounded-pricing-rule bg-accent" aria-hidden="true" />
                <h2 id="pricing-title" class="max-w-full text-pricing-heading font-bold tracking-pricing-heading break-words">{{ plan?.name ?? 'Безлимитный' }}.</h2>
                <p class="text-pricing-copy text-footer-secondary">Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами.</p>
            </div>
            <div class="h-px bg-landing-platform-border desktop:h-full desktop:w-px" aria-hidden="true" />
            <div class="flex min-w-0 flex-col gap-pricing-stack">
                <template v-if="state === 'ready' && selectedProduct">
                    <div class="flex flex-col items-start gap-tight tablet:flex-row tablet:flex-wrap tablet:items-end tablet:justify-between">
                        <p class="text-pricing-prompt">Выбери период</p>
                        <p class="max-w-full font-mono text-pricing-price font-semibold tracking-pricing-price break-words" aria-live="polite" aria-atomic="true">{{ periodPrice }} / {{ selectedProduct.months }} мес.</p>
                    </div>
                    <fieldset class="min-w-0">
                        <legend class="sr-only">Период подписки</legend>
                        <div class="grid min-h-pricing-selector grid-cols-4 gap-1 rounded-button bg-background p-pricing-selector-inset ring-1 ring-border ring-inset">
                            <label v-for="product in plan.products" :key="product.id" class="relative flex min-h-0 cursor-pointer items-center justify-center rounded-control-sm py-compact text-center font-mono text-pricing-period wrap-anywhere transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus" :class="selectedProduct.id === product.id ? 'border border-accent bg-landing-tile font-bold text-foreground' : 'border border-transparent font-medium text-footer-muted hover:text-foreground'">
                                <input :checked="selectedProduct.id === product.id" :value="product.id" type="radio" name="landing-period" class="sr-only" @change="selectedId = product.id">
                                {{ product.months }} мес.
                            </label>
                        </div>
                    </fieldset>
                    <p class="text-pricing-benefits-label text-footer-muted">В тариф входит</p>
                    <ul class="grid gap-x-pricing-benefits-column gap-y-pricing-benefits-row tablet:grid-cols-2">
                        <li v-for="advantage in plan.advantages" :key="advantage" class="flex items-start gap-tight text-pricing-benefit">
                            <span class="inline-flex size-pricing-check shrink-0 items-center justify-center rounded-control-sm border border-landing-tile-border bg-landing-tile text-accent"><UiIcon name="check" size="md" /></span>
                            <span class="self-center">{{ advantage }}</span>
                        </li>
                    </ul>
                    <div class="flex w-full flex-col items-center gap-2.5 tablet:max-w-pricing-action-width">
                        <Link href="/register" class="inline-flex min-h-pricing-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-content py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Выбрать подписку</Link>
                        <p class="text-center text-pricing-trial text-footer-muted">3 дня бесплатно для новых пользователей</p>
                    </div>
                </template>
                <div v-else role="status" class="flex flex-col items-start gap-content">
                    <p class="text-ui-title">{{ state === 'unavailable' ? 'Не удалось загрузить тариф' : 'Тариф временно недоступен' }}</p>
                    <p class="text-ui-copy text-footer-secondary">Попробуй зайти позже или напиши нам — поможем разобраться.</p>
                    <a href="https://t.me/hey_dude_web" class="inline-flex min-h-12 items-center rounded-button border border-accent px-panel text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Написать в поддержку</a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@media (width >= 75rem) {
    .landing-pricing {
        grid-template-columns: minmax(0, var(--spacing-pricing-story)) 1px minmax(0, 1fr);
    }
}
</style>
