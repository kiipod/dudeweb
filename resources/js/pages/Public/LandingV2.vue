<script setup>
import { Head } from '@inertiajs/vue3'
import LandingV2Header from '@/components/landing-v2/LandingV2Header.vue'
import LandingV2Hero from '@/components/landing-v2/LandingV2Hero.vue'
import LandingV2Platforms from '@/components/landing-v2/LandingV2Platforms.vue'
import LandingV2Connection from '@/components/landing-v2/LandingV2Connection.vue'
import LandingV2News from '@/components/landing-v2/LandingV2News.vue'
import LandingV2Subscription from '@/components/landing-v2/LandingV2Subscription.vue'
import LandingV2Footer from '@/components/landing-v2/LandingV2Footer.vue'
import LandingV2Layout from '@/layouts/LandingV2Layout.vue'

defineOptions({
    layout: (h, page) => h(LandingV2Layout, null, {
        header: () => h(LandingV2Header),
        default: () => page,
        footer: () => h(LandingV2Footer),
    }),
})

defineProps({
    plans: { type: Array, required: true },
    pricingState: { type: String, required: true, validator: value => ['ready', 'empty', 'unavailable'].includes(value) },
})
</script>

<template>
    <Head title="Любимые сервисы снова рядом" />
    <LandingV2Hero />
    <LandingV2Platforms />
    <LandingV2Connection />
    <LandingV2News />
    <LandingV2Subscription :plans="plans" :state="pricingState" />
</template>
