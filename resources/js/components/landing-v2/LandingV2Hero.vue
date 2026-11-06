<script setup>
import LandingV2Action from '@/components/landing-v2/LandingV2Action.vue'
import LandingV2Benefits from '@/components/landing-v2/LandingV2Benefits.vue'
import LandingV2Section from '@/components/landing-v2/LandingV2Section.vue'
import { LANDING_V2_TRIAL } from '@/data/landingV2Navigation'
</script>

<template>
    <LandingV2Section aria-labelledby="landing-v2-title" data-v2-hero>
        <div class="v2-hero-intro grid gap-3">
            <div class="v2-hero-row grid min-w-0 gap-6">
                <div class="grid min-w-0 gap-v2-title-gap">
                    <p class="flex items-center gap-4 font-mono text-v2-eyebrow tracking-v2-greeting text-v2-greeting">
                        <span aria-hidden="true" class="h-px w-v2-greeting-rule shrink-0 bg-v2-rule" />
                        Hey, Dude!
                    </p>
                    <h1 id="landing-v2-title" class="text-v2-hero font-medium tracking-v2-hero">
                        <span class="block">Любимые сервисы{{ ' ' }}</span>
                        <span class="block text-v2-hero-accent">снова рядом.</span>
                    </h1>
                </div>
                <div class="v2-hero-support flex min-w-0 flex-col gap-5">
                    <p class="max-w-v2-hero-copy text-v2-body text-v2-hero-copy">
                        dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей.
                    </p>
                    <LandingV2Action :href="LANDING_V2_TRIAL" variant="heroTrial" data-v2-hero-cta>
                        Попробовать бесплатно
                    </LandingV2Action>
                </div>
            </div>
            <p class="v2-hero-trial text-v2-trial text-v2-hero-copy">3 дня бесплатно · До 5 устройств</p>
        </div>
        <LandingV2Benefits />
    </LandingV2Section>
</template>

<style scoped>
@media (width >= 90rem) {
    .v2-hero-row {
        grid-template-columns: minmax(0, 1fr) var(--spacing-v2-hero-support);
        column-gap: var(--spacing-v2-hero-columns);
    }

    .v2-hero-support {
        justify-content: space-between;
        row-gap: 0;
        padding-top: var(--spacing-v2-hero-support-top);
    }

    .v2-hero-trial {
        width: var(--spacing-v2-hero-support);
        justify-self: end;
    }
}
</style>
