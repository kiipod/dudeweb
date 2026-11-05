<script setup>
import { Link } from '@inertiajs/vue3'
import LandingV2Action from '@/components/landing-v2/LandingV2Action.vue'
import LandingV2NavLinks from '@/components/landing-v2/LandingV2NavLinks.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { LANDING_V2_LOGIN, LANDING_V2_TRIAL } from '@/data/landingV2Navigation'

defineProps({
    activeHash: { type: String, default: '' },
    menuOpen: Boolean,
})
defineEmits(['toggle-menu', 'navigate'])
</script>

<template>
    <div class="relative h-v2-header shrink-0 px-v2-gutter after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-v2-section-border">
        <div class="mx-auto flex h-full max-w-v2-content items-center justify-between">
            <Link
                href="/landing"
                aria-label="dudeweb — главная"
                class="flex shrink-0 items-center gap-v2-brand-gap outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus"
                @click="$emit('navigate')"
            >
                <img src="/landing-v2/brand/mark.svg" alt="" width="44" height="36" class="h-v2-mark-height w-v2-mark-width shrink-0">
                <span class="text-v2-wordmark font-semibold tracking-v2-brand">dudeweb</span>
            </Link>

            <nav aria-label="Основная навигация" class="hidden items-center gap-v2-nav v2-desktop:flex">
                <LandingV2NavLinks :active-hash="activeHash" />
            </nav>

            <div class="flex items-center gap-v2-header-controls">
                <LandingV2Action :href="LANDING_V2_LOGIN" variant="login" @click="$emit('navigate')">Войти</LandingV2Action>
                <button
                    type="button"
                    :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
                    :aria-expanded="menuOpen"
                    aria-controls="landing-v2-menu"
                    class="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-menu-item border border-v2-control-border bg-v2-surface text-v2-ink transition-colors duration-(--v2-duration-control) motion-reduce:transition-none hover:bg-v2-surface-hover active:bg-v2-surface-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus v2-desktop:hidden"
                    @click="$emit('toggle-menu')"
                >
                    <span class="size-v2-menu-icon [&_svg]:size-full"><UiIcon :name="menuOpen ? 'x' : 'menu'" /></span>
                </button>
                <div class="hidden tablet:block">
                    <LandingV2Action :href="LANDING_V2_TRIAL" @click="$emit('navigate')">
                        Попробовать бесплатно
                    </LandingV2Action>
                </div>
            </div>
        </div>
    </div>
</template>
