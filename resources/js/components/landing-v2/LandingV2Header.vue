<script setup>
import { useEventListener, useMediaQuery } from '@vueuse/core'
import { nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import LandingV2HeaderBar from '@/components/landing-v2/LandingV2HeaderBar.vue'
import LandingV2MobileMenu from '@/components/landing-v2/LandingV2MobileMenu.vue'

const open = shallowRef(false)
const activeHash = shallowRef('')
const header = useTemplateRef('header')
const desktop = useMediaQuery('(min-width: 90rem)')

function closeMenu() { open.value = false }
function syncHash() { activeHash.value = window.location.hash }

async function navigate(href) {
    closeMenu()
    await nextTick()
    window.location.hash = href
    // Same-hash navigation must also move back to the target.
    const target = document.getElementById(href.slice(1))
    target?.focus({ preventScroll: true })
    target?.scrollIntoView()
    syncHash()
}

onMounted(syncHash)
useEventListener('hashchange', syncHash)
watch(desktop, async matches => {
    if (!matches || !open.value) return
    closeMenu()
    await nextTick()
    header.value?.querySelector('a')?.focus({ preventScroll: true })
})
</script>

<template>
    <header ref="header" data-v2-menu-background class="shrink-0 bg-v2-page">
        <LandingV2HeaderBar :active-hash="activeHash" @toggle-menu="open = true" />
    </header>
    <LandingV2MobileMenu :active-hash="activeHash" :open="open" @close="closeMenu" @navigate="navigate" />
</template>
