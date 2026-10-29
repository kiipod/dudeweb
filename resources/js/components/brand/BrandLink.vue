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
        validator: value => ['horizontal', 'icon', 'stacked', 'wordmark'].includes(value),
    },
    scale: {
        type: String,
        default: 'default',
        validator: value => ['default', 'footer', 'public', 'account'].includes(value),
    },
})
</script>

<template>
    <Link
        :href="href"
        aria-label="dudeweb — на главную"
        class="inline-flex rounded-control-sm outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
    >
        <BrandLogo :scale="scale" :variant="variant" />
    </Link>
</template>
