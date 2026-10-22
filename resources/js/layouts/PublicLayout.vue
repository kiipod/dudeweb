<script setup>
import PublicFooter from '@/components/public/PublicFooter.vue'
import PublicHeader from '@/components/public/PublicHeader.vue'

const NAVIGATION_ITEMS = [
    { label: 'Преимущества', href: '#advantages' },
    { label: 'Устройства', href: '#devices' },
    { label: 'Тариф', href: '#pricing' },
]

const LOGIN_HREF = '/login'
const REGISTER_HREF = '/register'
const SUPPORT_HREF = 'https://t.me/hey_dude_web'

</script>

<template>
    <div class="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 motion-reduce:transition-none">
        <a
            href="#main-content"
            data-public-menu-background
            class="fixed top-0 -translate-y-full left-compact z-50 rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground transition-transform duration-200 motion-reduce:transition-none focus:top-compact focus:translate-y-0 outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
        >
            К основному содержимому
        </a>

        <PublicHeader
            :login-href="LOGIN_HREF"
            :navigation-items="NAVIGATION_ITEMS"
            :register-href="REGISTER_HREF"
        />

        <main id="main-content" data-public-menu-background class="flex-1" tabindex="-1">
            <slot />
        </main>

        <PublicFooter
            data-public-menu-background
            :login-href="LOGIN_HREF"
            :navigation-items="NAVIGATION_ITEMS"
            :register-href="REGISTER_HREF"
            :support-href="SUPPORT_HREF"
        />
    </div>
</template>
