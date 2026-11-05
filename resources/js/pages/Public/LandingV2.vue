<script setup>
import { Head } from '@inertiajs/vue3'
import LandingV2Header from '@/components/landing-v2/LandingV2Header.vue'
import LandingV2Hero from '@/components/landing-v2/LandingV2Hero.vue'
import LandingV2Layout from '@/layouts/LandingV2Layout.vue'

defineOptions({
    layout: (h, page) => h(LandingV2Layout, null, {
        header: () => h(LandingV2Header),
        default: () => page,
    }),
})
</script>

<template>
    <Head title="Любимые сервисы снова рядом" />
    <LandingV2Hero />
</template>
