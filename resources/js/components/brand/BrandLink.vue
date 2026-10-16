<script setup>
import { Link } from '@inertiajs/vue3'
import BrandLogo from '@/components/brand/BrandLogo.vue'

defineProps({
    href: {
        type: String,
        default: '/',
    },
    variant: {
        type: String,
        default: 'horizontal',
        validator: value => ['horizontal', 'icon', 'stacked'].includes(value),
    },
    scale: {
        type: String,
        default: 'default',
        validator: value => ['default', 'footer', 'public'].includes(value),
    },
})
</script>

<template>
    <Link
        :href="href"
        aria-label="dudeweb — на главную"
        class="inline-flex rounded-control-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
        <BrandLogo :scale="scale" :variant="variant" />
    </Link>
</template>
