<script setup>
import { Link } from '@inertiajs/vue3'
import { useTemplateRef } from 'vue'
import { useOverlay } from '@/composables/useOverlay'
import UiIcon from '@/components/ui/UiIcon.vue'

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    loginHref: {
        type: String,
        required: true,
    },
    open: Boolean,
    registerHref: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['close', 'navigate'])

const panel = useTemplateRef('panel')
useOverlay({
    open: () => props.open,
    panel,
    close: () => emit('close'),
    background: () => [...document.querySelectorAll('[data-public-menu-background]')],
    additionalControls: () => [...document.querySelectorAll('[data-public-menu-control]')],
})

function requestClose() { emit('close') }
function handleNavigation() { emit('navigate') }
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200 motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
            leave-to-class="opacity-0"
            @before-enter="element => { element.inert = false; element.removeAttribute('aria-hidden') }"
            @before-leave="element => { element.inert = true; element.setAttribute('aria-hidden', 'true') }"
        >
            <div
                v-if="open"
                class="fixed inset-x-0 top-public-header bottom-0 z-30 bg-background/80 px-tight pt-tight backdrop-blur-sm tablet:top-public-header-tablet tablet:flex tablet:items-start tablet:justify-end tablet:px-section-sm desktop:hidden"
                @click.self="requestClose"
            >
                <nav
                    id="public-mobile-menu"
                    ref="panel"
                    aria-labelledby="public-menu-title"
                    aria-describedby="public-menu-description"
                    tabindex="-1"
                    aria-modal="true"
                    class="mx-auto flex max-h-[calc(100dvh-var(--spacing-public-header)-var(--spacing-panel))] w-full max-w-none flex-col gap-control overflow-y-auto rounded-panel border border-border bg-surface p-tight tablet:mx-0 tablet:max-h-[calc(100dvh-var(--spacing-public-header-tablet)-var(--spacing-panel))] tablet:max-w-public-menu"
                    role="dialog"
                >
                    <h2 id="public-menu-title" class="sr-only">Мобильная навигация</h2>
                    <p id="public-menu-description" class="sr-only">Разделы сайта, вход и создание аккаунта. Escape закрывает меню.</p>
                    <a
                        v-for="item in items"
                        :key="item.href"
                        :href="item.href"
                        class="flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-public-menu font-normal text-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-public-menu-item-tablet"
                        @click="handleNavigation"
                    >
                        <span>{{ item.label }}</span>
                        <UiIcon class="text-accent" name="arrowUpRight" size="sm" />
                    </a>

                    <Link
                        :href="loginHref"
                        class="flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-public-menu font-normal text-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-public-menu-item-tablet"
                        @click="handleNavigation"
                    >
                        <span>Войти</span>
                        <UiIcon class="text-accent" name="arrowUpRight" size="sm" />
                    </Link>

                    <Link
                        :href="registerHref"
                        class="inline-flex min-h-13 items-center justify-center rounded-control border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        @click="handleNavigation"
                    >
                        Попробовать бесплатно
                    </Link>

                    <p class="text-center font-mono text-public-menu-note text-muted">
                        3 дня бесплатно · До 5 устройств
                    </p>
                </nav>
            </div>
        </Transition>
    </Teleport>
</template>
