<script setup>
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

const links = [
    { label: 'Docs', to: '#' },
    { label: 'Pricing', to: '#' },
    { label: 'Blog', to: '#' },
]
</script>

<template>
    <UApp>
        <UHeader>
            <template #left>
                <ULink to="/" class="font-bold text-xl text-highlighted">
                    dudeweb
                </ULink>
            </template>

            <UNavigationMenu :items="links" />

            <template #right>
                <UColorModeButton />
                <UButton
                    label="Sign in"
                    color="neutral"
                    variant="ghost"
                    to="#"
                />
                <UButton
                    label="Get started"
                    to="#"
                />
            </template>
        </UHeader>

        <slot />

        <UFooter>
            <template #left>
                <p class="text-sm text-muted">
                    © {{ new Date().getFullYear() }} dudeweb. All rights reserved.
                </p>
            </template>
        </UFooter>
    </UApp>
</template>
