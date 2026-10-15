<script setup>
import { shallowRef } from 'vue'
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

const isMenuOpen = shallowRef(false)
</script>

<template>
    <div class="flex min-h-screen flex-col bg-background text-foreground transition-colors">
        <a
            href="#main-content"
            class="fixed -top-16 left-compact z-50 rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground transition-[top] focus:top-compact focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
            К основному содержимому
        </a>

        <PublicHeader
            :login-href="LOGIN_HREF"
            :navigation-items="NAVIGATION_ITEMS"
            :register-href="REGISTER_HREF"
            @menu-state-change="isMenuOpen = $event"
        />

        <main id="main-content" :inert="isMenuOpen" class="flex-1" tabindex="-1">
            <slot />
        </main>

        <PublicFooter
            :inert="isMenuOpen"
            :login-href="LOGIN_HREF"
            :navigation-items="NAVIGATION_ITEMS"
            :register-href="REGISTER_HREF"
            :support-href="SUPPORT_HREF"
        />
    </div>
</template>
