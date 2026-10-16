<script setup>
import { Link } from '@inertiajs/vue3'
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import BrandLink from '@/components/brand/BrandLink.vue'
import PublicMobileMenu from '@/components/public/PublicMobileMenu.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useTheme } from '@/composables/useTheme'

defineProps({
    loginHref: {
        type: String,
        required: true,
    },
    navigationItems: {
        type: Array,
        required: true,
    },
    registerHref: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['menu-state-change'])

const THEME_ACTIONS = {
    dark: {
        icon: 'moon',
        label: 'Тёмная тема. Включить светлую',
        next: 'light',
    },
    light: {
        icon: 'sun',
        label: 'Светлая тема. Включить тёмную',
        next: 'dark',
    },
}

const isMenuOpen = shallowRef(false)
const menuTrigger = useTemplateRef('menuTrigger')
const { setTheme, theme } = useTheme()

const themeAction = computed(() => THEME_ACTIONS[theme.value] ?? THEME_ACTIONS.light)

function cycleTheme() {
    setTheme(themeAction.value.next)
}

function openMenu() {
    isMenuOpen.value = true
}

async function closeMenu() {
    if (!isMenuOpen.value) {
        return
    }

    isMenuOpen.value = false
    await nextTick()
    menuTrigger.value?.focus()
}

function toggleMenu() {
    if (isMenuOpen.value) {
        closeMenu()
    } else {
        openMenu()
    }
}

watch(isMenuOpen, value => emit('menu-state-change', value))
</script>

<template>
    <header class="sticky top-0 z-40 h-public-header border-b border-border bg-background/95 backdrop-blur-md tablet:h-public-header-tablet desktop:h-public-header-wide">
        <div class="mx-auto flex h-full max-w-shell items-center px-shell-gutter tablet:px-section-sm desktop:grid desktop:grid-cols-[auto_minmax(0,1fr)_auto] desktop:px-shell-wide">
            <div class="tablet:hidden">
                <BrandLink scale="public" variant="icon" />
            </div>

            <div class="hidden tablet:block desktop:justify-self-start">
                <BrandLink scale="public" variant="horizontal" />
            </div>

            <nav aria-label="Основная навигация" class="hidden items-center gap-10 desktop:flex desktop:gap-public-nav-wide desktop:justify-self-center">
                <a
                    v-for="item in navigationItems"
                    :key="item.href"
                    :href="item.href"
                    class="rounded-control-sm text-public-nav-desktop font-semibold text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-public-nav-wide"
                >
                    {{ item.label }}
                </a>
            </nav>

            <div class="ml-auto flex items-center gap-compact tablet:gap-2.5 desktop:ml-0 desktop:gap-public-controls-wide desktop:justify-self-end">
                <button
                    :aria-label="themeAction.label"
                    class="inline-flex size-11 items-center justify-center rounded-control-sm border border-border bg-elevated text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:size-14 tablet:rounded-card desktop:size-public-control-wide"
                    data-public-menu-control
                    type="button"
                    @click="cycleTheme"
                >
                    <UiIcon :name="themeAction.icon" size="sm" />
                </button>

                <Link
                    :href="loginHref"
                    class="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-elevated px-control-inline text-ui-body font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:rounded-card tablet:px-5 tablet:text-public-control-tablet desktop:min-h-public-control-height-wide desktop:px-public-login-inline-wide desktop:text-public-control-wide"
                    data-public-menu-control
                    @click="closeMenu"
                >
                    Войти
                </Link>

                <button
                    ref="menuTrigger"
                    :aria-expanded="isMenuOpen"
                    :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
                    aria-controls="public-mobile-menu"
                    class="inline-flex size-11 items-center justify-center rounded-control border border-accent-hover bg-accent text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:size-14 tablet:rounded-card desktop:hidden"
                    data-public-menu-control
                    type="button"
                    @click="toggleMenu"
                >
                    <UiIcon :name="isMenuOpen ? 'x' : 'menu'" />
                </button>

                <Link
                    :href="registerHref"
                    class="hidden min-h-public-control-height-wide items-center justify-center rounded-card border border-accent-hover bg-accent px-public-cta-inline-wide text-public-control-wide font-bold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:inline-flex"
                >
                    Попробовать бесплатно
                </Link>
            </div>
        </div>

        <PublicMobileMenu
            :items="navigationItems"
            :login-href="loginHref"
            :open="isMenuOpen"
            :register-href="registerHref"
            @close="closeMenu"
            @navigate="closeMenu"
        />
    </header>
</template>
