<script setup>
import { useTemplateRef } from 'vue'
import LandingV2Action from '@/components/landing-v2/LandingV2Action.vue'
import LandingV2HeaderBar from '@/components/landing-v2/LandingV2HeaderBar.vue'
import LandingV2NavLinks from '@/components/landing-v2/LandingV2NavLinks.vue'
import { useOverlay } from '@/composables/useOverlay'
import { LANDING_V2_TRIAL } from '@/data/landingV2Navigation'

const props = defineProps({
    activeHash: { type: String, default: '' },
    open: Boolean,
})
const emit = defineEmits(['close', 'navigate'])
const panel = useTemplateRef('panel')

useOverlay({
    open: () => props.open,
    panel,
    close: () => emit('close'),
    initialFocus: () => panel.value?.querySelector('[data-v2-menu-link]'),
    background: () => [...document.querySelectorAll('[data-v2-menu-background]')],
})
</script>

<template>
    <Transition
        name="v2-menu"
        @before-enter="element => { element.inert = false; element.removeAttribute('aria-hidden') }"
        @before-leave="element => { element.inert = true; element.setAttribute('aria-hidden', 'true') }"
    >
        <div
            v-if="open"
            id="landing-v2-menu"
            ref="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-v2-menu-title"
            tabindex="-1"
            class="fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto overscroll-contain bg-v2-page v2-desktop:hidden"
        >
            <h2 id="landing-v2-menu-title" class="sr-only">Навигация по сайту</h2>
            <LandingV2HeaderBar :active-hash="activeHash" menu-open @toggle-menu="$emit('close')" @navigate="$emit('close')" />
            <div class="flex flex-1 flex-col px-v2-gutter pt-v2-menu-top pb-v2-menu-bottom">
                <div class="mx-auto flex w-full max-w-v2-content flex-1 flex-col justify-between gap-v2-menu-top">
                    <nav aria-label="Разделы лендинга" class="flex flex-col gap-6">
                        <LandingV2NavLinks :active-hash="activeHash" variant="menu" @navigate="href => $emit('navigate', href)" />
                    </nav>
                    <LandingV2Action :href="LANDING_V2_TRIAL" variant="menuTrial" @click="$emit('close')">
                        Попробовать бесплатно
                    </LandingV2Action>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.v2-menu-enter-active {
    transition: opacity var(--v2-duration-menu-enter);
}

.v2-menu-leave-active {
    transition: opacity var(--v2-duration-menu-leave);
}

.v2-menu-enter-from,
.v2-menu-leave-to {
    opacity: 0;
}

.v2-menu-enter-active :deep([data-v2-menu-link]) {
    transition: opacity calc(var(--v2-duration-menu-enter) - var(--v2-duration-menu-stagger) * 2), transform calc(var(--v2-duration-menu-enter) - var(--v2-duration-menu-stagger) * 2);
}

.v2-menu-enter-active :deep([data-v2-menu-link]:nth-child(2)) {
    transition-delay: var(--v2-duration-menu-stagger);
}

.v2-menu-enter-active :deep([data-v2-menu-link]:nth-child(3)) {
    transition-delay: calc(var(--v2-duration-menu-stagger) * 2);
}

.v2-menu-enter-from :deep([data-v2-menu-link]) {
    transform: translateY(var(--spacing-v2-menu-offset));
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .v2-menu-enter-active,
    .v2-menu-leave-active,
    .v2-menu-enter-active :deep([data-v2-menu-link]:nth-child(n)) {
        transition: none;
        transition-delay: 0s;
    }

    .v2-menu-enter-from :deep([data-v2-menu-link]) {
        transform: none;
        opacity: 1;
    }
}
</style>
