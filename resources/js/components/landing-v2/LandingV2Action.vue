<script setup>
import { Link } from '@inertiajs/vue3'

const VARIANTS = {
    login: 'h-v2-header-control rounded-v2-header-action border-v2-control-border bg-v2-surface px-v2-login-inline text-v2-header-control font-semibold text-v2-login-ink hover:bg-v2-surface-hover active:bg-v2-surface-hover',
    trial: 'h-v2-header-control rounded-v2-header-action border-v2-brand bg-v2-brand px-v2-trial-inline text-v2-header-control font-bold text-v2-ink hover:border-v2-brand-hover hover:bg-v2-brand-hover active:border-v2-brand-pressed active:bg-v2-brand-pressed',
    menuTrial: 'h-12 w-full rounded-v2-subscription-action border-v2-brand bg-v2-brand text-v2-menu-action font-medium text-v2-ink hover:border-v2-brand-hover hover:bg-v2-brand-hover active:border-v2-brand-pressed active:bg-v2-brand-pressed',
}

defineProps({
    href: { type: String, required: true },
    variant: {
        type: String,
        default: 'trial',
        validator: value => ['login', 'trial', 'menuTrial'].includes(value),
    },
})
</script>

<template>
    <Link
        :href="href"
        :class="VARIANTS[variant] ?? VARIANTS.trial"
        class="inline-flex shrink-0 items-center justify-center border whitespace-nowrap transition-colors duration-(--v2-duration-control) motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus"
    >
        <slot />
    </Link>
</template>
