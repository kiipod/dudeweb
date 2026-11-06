<script setup>
import { computed } from 'vue'
import LandingV2Section from '@/components/landing-v2/LandingV2Section.vue'
import LandingV2PeriodSelector from '@/components/landing-v2/LandingV2PeriodSelector.vue'

const props = defineProps({
    plans: { type: Array, required: true },
    state: { type: String, required: true, validator: value => ['ready', 'empty', 'unavailable'].includes(value) },
})

const points = computed(() => [
    { title: 'Безлимитный трафик', body: 'Любимые сервисы для работы, развлечений и общения.' },
    { title: `До ${props.plans[0]?.deviceLimit > 0 ? props.plans[0].deviceLimit : 5} устройств`, body: 'Смартфон, ноутбук и планшет — в одном доступе.' },
    { title: 'Все популярные платформы', body: 'Windows, macOS, Linux, Android и iOS.' },
    { title: 'Защищённое подключение', body: 'Для работы, общения и повседневных задач.' },
])
</script>

<template>
    <LandingV2Section id="pricing" variant="subscription" data-v2-subscription aria-labelledby="v2-subscription-title" tabindex="-1" class="border-t border-v2-section-border outline-none">
        <div data-v2-subscription-grid class="grid min-w-0 gap-10 v2-desktop:grid-cols-2 v2-desktop:gap-v2-split-gap">
            <div data-v2-subscription-intro class="flex min-w-0 flex-col gap-v2-subscription-story">
                <p class="flex items-center gap-4 font-mono text-v2-subscription-eyebrow tracking-v2-subscription-eyebrow text-v2-subscription-eyebrow-ink">
                    <span class="h-px w-v2-subscription-rule shrink-0 bg-v2-rule" aria-hidden="true" />ПОДПИСКА DUDEWEB
                </p>
                <h2 id="v2-subscription-title" class="text-v2-final-heading font-medium tracking-v2-final">
                    Ну что,<br><span class="text-v2-hero-accent">погнали?</span>
                </h2>
                <p class="text-v2-subscription-copy text-v2-subscription-copy-ink">Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами.</p>
                <ul class="grid grid-cols-2 gap-x-v2-subscription-points-inline gap-y-v2-subscription-points-block pt-3">
                    <li v-for="point in points" :key="point.body" class="flex min-w-0 flex-col gap-2">
                        <h3 class="text-v2-subscription-point font-medium text-v2-subscription-point-ink">{{ point.title }}</h3>
                        <p class="text-v2-subscription-point-copy text-v2-subscription-muted">{{ point.body }}</p>
                    </li>
                </ul>
            </div>
            <LandingV2PeriodSelector :plans="plans" :state="state" />
        </div>
    </LandingV2Section>
</template>
