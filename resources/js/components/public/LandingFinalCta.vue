<script setup>
import { Link } from '@inertiajs/vue3'
import LandingFinalMark from './LandingFinalMark.vue'
</script>

<template>
    <section class="mx-auto w-full max-w-landing px-landing-gutter py-final-section" aria-labelledby="final-title">
        <div class="landing-final__panel relative min-h-final-panel overflow-hidden rounded-final-panel ring-1 ring-landing-final-border ring-inset bg-linear-to-r from-landing-final-start to-landing-final-end px-final-padding-x py-final-padding-y">
            <div class="relative z-1 flex min-w-0 flex-col items-start gap-final-copy-gap">
                <p class="font-mono text-landing-eyebrow font-bold tracking-final-eyebrow text-accent">ПОПРОБУЙ DUDEWEB</p>
                <h2 id="final-title" class="max-w-full text-final-heading font-bold tracking-final-heading break-words">Ну что, погнали?</h2>
                <p class="text-final-copy text-footer-secondary">Твои любимые сервисы уже ждут. Подключайся и начинай прямо сейчас.</p>
                <Link href="/register" class="inline-flex min-h-final-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-tight py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:max-w-final-action-width">
                    Получить 3 дня бесплатно
                </Link>
                <p class="text-final-note text-footer-muted">Начни с пробного доступа, а подписку оформишь позже.</p>
            </div>
            <div class="landing-final__visual pointer-events-none absolute top-2.5 right-2 h-final-visual-height w-final-visual-width opacity-35 tablet:static tablet:w-full tablet:max-w-final-visual-width tablet:opacity-100" aria-hidden="true"><LandingFinalMark /></div>
        </div>
    </section>
</template>

<style scoped>
@media (width >= 48rem) {
    .landing-final__panel {
        display: grid;
        grid-template-columns: minmax(0, var(--spacing-final-copy)) minmax(0, 1fr);
        align-items: center;
        gap: var(--spacing-final-column-gap);
    }
}
</style>
