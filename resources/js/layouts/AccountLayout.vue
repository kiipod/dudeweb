<script setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'
import AccountTopHeader from '@/components/account/AccountTopHeader.vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountBottomNavigation from '@/components/account/AccountBottomNavigation.vue'
import MoreNavigationSheet from '@/components/account/MoreNavigationSheet.vue'
import BaseOverlay from '@/components/ui/BaseOverlay.vue'
import { useTheme } from '@/composables/useTheme'
import { ACCOUNT_NAVIGATION, activeAccountSection } from '@/utils/accountNavigation'

defineProps({ pageTitle: { type: String, required: true } })
const page = usePage()
const activeKey = computed(() => activeAccountSection(page.url))
const bottomActiveKey = computed(() => ['dashboard', 'subscription', 'connection'].includes(activeKey.value) ? activeKey.value : 'more')
const sidebarItems = ACCOUNT_NAVIGATION.filter(item => item.key !== 'profile')
const moreItems = ACCOUNT_NAVIGATION.filter(item => ['referral', 'support', 'profile'].includes(item.key))
const bottomItems = [...ACCOUNT_NAVIGATION.slice(0, 3), { key: 'more', label: 'Ещё', icon: 'menu', action: true }]
const moreOpen = shallowRef(false)
const logout = useForm({})
const { activeTheme, setTheme } = useTheme()
let desktopQuery
let sizeObserver
const header = useTemplateRef('header')
const bottom = useTemplateRef('bottom')
const headerHeight = shallowRef(0)
const navHeight = shallowRef(0)

function closeMore() { if (!logout.processing) moreOpen.value = false }
function resize() { if (desktopQuery?.matches) closeMore() }
function leave() {
    if (!logout.processing) logout.delete('/logout', { onSuccess: () => { moreOpen.value = false } })
}
watch(() => page.url, closeMore)
onMounted(() => {
    desktopQuery = window.matchMedia('(min-width: 75rem)')
    desktopQuery.addEventListener('change', resize)
    sizeObserver = new ResizeObserver(() => {
        headerHeight.value = header.value?.$el.getBoundingClientRect().height ?? 0
        navHeight.value = bottom.value?.getBoundingClientRect().height ?? 0
    })
    sizeObserver.observe(header.value.$el)
    sizeObserver.observe(bottom.value)
})
onBeforeUnmount(() => {
    desktopQuery?.removeEventListener('change', resize)
    sizeObserver?.disconnect()
})
</script>

<template>
    <div id="account-shell" :style="navHeight ? { '--account-bottom-nav-height': `${navHeight}px` } : undefined" class="min-h-dvh bg-background text-foreground desktop:pl-account-sidebar">
        <a href="#account-content" class="fixed -top-16 left-compact z-50 rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground focus:top-compact focus-visible:outline-2 focus-visible:outline-focus">К основному содержимому</a>
        <div class="fixed inset-y-0 left-0 hidden desktop:block">
            <AccountSidebar :active-key="activeKey" :items="sidebarItems" :profile-href="null" :logout-loading="logout.processing" @logout="leave" />
        </div>
        <AccountTopHeader ref="header" :page-title="pageTitle" :profile-href="null" :theme="activeTheme" @change-theme="setTheme(activeTheme === 'dark' ? 'light' : 'dark')" />
        <main id="account-content" class="min-w-0 px-shell-gutter pt-account-content-top pb-account-main-bottom tablet:px-section-lg desktop:px-section-md desktop:pb-account-content-bottom" tabindex="-1">
            <div class="mx-auto w-full tablet:max-w-account-tablet desktop:max-w-account">
                <slot />
            </div>
        </main>
        <div ref="bottom" class="fixed inset-x-0 bottom-0 z-20 desktop:hidden">
            <AccountBottomNavigation :active-key="moreOpen ? 'more' : bottomActiveKey" :items="bottomItems" :more-open="moreOpen" @select-action="moreOpen = true" />
        </div>
        <BaseOverlay id="account-more" :open="moreOpen" :busy="logout.processing" :top-offset="headerHeight" labelled-by="account-more-title" @close="closeMore">
            <MoreNavigationSheet :items="moreItems" :logout-loading="logout.processing" @close="closeMore" @navigate="closeMore" @logout="leave" />
        </BaseOverlay>
    </div>
</template>
