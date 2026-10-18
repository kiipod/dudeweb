<script setup>
import { computed } from 'vue'
import BrandLink from '@/components/brand/BrandLink.vue'

const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    variant: { type: String, default: 'login', validator: value => ['login', 'register', 'recovery', 'reset', 'status'].includes(value) },
})
const SPACING = {
    login: 'pt-auth-login-top pb-auth-login-bottom',
    register: 'pt-auth-register-top pb-auth-register-bottom',
    recovery: 'pt-auth-recovery-top pb-auth-login-bottom',
    reset: 'pt-auth-reset-top pb-auth-status-bottom',
    status: 'pt-auth-status-top pb-auth-status-bottom',
}
const spacing = computed(() => SPACING[props.variant])
</script>

<template>
    <div class="flex min-h-dvh flex-col bg-background text-foreground">
        <header class="flex shrink-0 items-center px-shell-gutter" :class="variant === 'register' ? 'h-auth-register-header' : 'h-auth-header'">
            <BrandLink variant="wordmark" />
        </header>
        <main class="mx-auto flex w-full flex-1 flex-col px-shell-gutter tablet:max-w-auth-tablet tablet:px-0 desktop:max-w-auth-desktop" :class="spacing">
            <section class="my-auto grid min-w-0 grid-cols-1" :class="variant === 'register' ? 'gap-auth-register-group' : variant === 'reset' ? 'gap-auth-reset-group' : 'gap-auth-group'" aria-labelledby="auth-title">
                <slot name="status" />
                <header class="grid min-w-0 grid-cols-1" :class="variant === 'status' ? 'gap-auth-group text-center' : variant === 'reset' ? 'gap-auth-reset-group' : 'gap-control'">
                    <h1 id="auth-title" class="text-interface-heading font-display break-words">{{ title }}</h1>
                    <p v-if="description" class="text-secondary" :class="['status', 'reset'].includes(variant) ? 'text-interface-body' : 'text-interface-intro'">{{ description }}</p>
                </header>
                <slot />
                <footer v-if="$slots.footer" class="text-interface-body text-secondary"><slot name="footer" /></footer>
            </section>
        </main>
    </div>
</template>
