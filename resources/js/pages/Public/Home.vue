<script setup>
import { Head } from '@inertiajs/vue3'
import LandingHero from '@/components/public/LandingHero.vue'
import LandingAdvantages from '@/components/public/LandingAdvantages.vue'
import LandingPlatforms from '@/components/public/LandingPlatforms.vue'
import LandingPricing from '@/components/public/LandingPricing.vue'
import LandingFinalCta from '@/components/public/LandingFinalCta.vue'
import LandingSectionDivider from '@/components/public/LandingSectionDivider.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'

defineOptions({ layout: PublicLayout })
defineProps({
    plans: { type: Array, required: true },
    pricingState: { type: String, required: true },
})
</script>

<template>
    <Head title="Любимые сервисы снова рядом" />
    <div>
        <LandingHero />
        <LandingSectionDivider profile="rise" />
        <LandingAdvantages :device-limit="plans[0]?.deviceLimit ?? null" />
        <LandingSectionDivider profile="fall" />
        <LandingPlatforms />
        <LandingSectionDivider profile="ridge" />
        <LandingPricing :plans="plans" :state="pricingState" />
        <LandingSectionDivider profile="shallow" />
        <LandingFinalCta />
    </div>
</template>
