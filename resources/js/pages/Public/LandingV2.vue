<script setup>
import { Head } from '@inertiajs/vue3'
import LandingV2Header from '@/components/landing-v2/LandingV2Header.vue'
import LandingV2Section from '@/components/landing-v2/LandingV2Section.vue'
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
    <LandingV2Section>
        <div class="flex items-center gap-v2-brand-gap">
            <img
                src="/landing-v2/brand/mark.svg"
                alt=""
                width="44"
                height="36"
                class="h-v2-mark-height w-v2-mark-width shrink-0"
            >
            <h1 class="text-v2-wordmark font-semibold tracking-v2-brand">dudeweb</h1>
        </div>
    </LandingV2Section>
</template>
