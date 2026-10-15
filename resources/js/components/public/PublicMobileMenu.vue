<script setup>
import { Link } from '@inertiajs/vue3'
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
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
let previousBodyOverflow = ''

function getFocusableElements() {
    const headerControls = document.querySelectorAll('[data-public-menu-control]:not([disabled])')
    const panelControls = panel.value?.querySelectorAll('a[href], button:not([disabled])') ?? []

    return [...headerControls, ...panelControls].filter(element => !element.hasAttribute('inert'))
}

function lockBodyScroll() {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
    document.body.style.overflow = previousBodyOverflow
}

function requestClose() {
    emit('close')
}

function handleNavigation() {
    emit('navigate')
}

function handleDocumentKeydown(event) {
    if (!props.open) {
        return
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
    }

    if (event.key !== 'Tab') {
        return
    }

    const focusableElements = getFocusableElements()

    if (focusableElements.length === 0) {
        event.preventDefault()
        return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements.at(-1)

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
    }
}

watch(() => props.open, async (isOpen) => {
    if (typeof document === 'undefined') {
        return
    }

    if (!isOpen) {
        unlockBodyScroll()
        return
    }

    lockBodyScroll()
    await nextTick()
    panel.value?.querySelector('a[href]')?.focus()
})

onMounted(() => document.addEventListener('keydown', handleDocumentKeydown))

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleDocumentKeydown)
    unlockBodyScroll()
})
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-x-0 top-public-header bottom-0 z-30 bg-background/80 px-tight pt-tight backdrop-blur-sm tablet:flex tablet:items-start tablet:justify-end tablet:px-section-sm desktop:hidden"
            @click.self="requestClose"
        >
            <nav
                id="public-mobile-menu"
                ref="panel"
                aria-label="Мобильная навигация"
                aria-modal="true"
                class="mx-auto flex max-h-[calc(100dvh-var(--spacing-public-header)-var(--spacing-panel))] w-full max-w-none flex-col gap-control overflow-y-auto rounded-panel border border-border bg-surface p-tight tablet:mx-0 tablet:max-w-public-menu"
                role="dialog"
            >
                <a
                    v-for="item in items"
                    :key="item.href"
                    :href="item.href"
                    class="flex min-h-12.5 items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-ui-copy font-medium text-foreground transition-colors hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    @click="handleNavigation"
                >
                    <span>{{ item.label }}</span>
                    <UiIcon class="text-accent" name="arrowUpRight" size="sm" />
                </a>

                <Link
                    :href="loginHref"
                    class="flex min-h-12.5 items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-ui-copy font-medium text-foreground transition-colors hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    @click="handleNavigation"
                >
                    <span>Войти</span>
                    <UiIcon class="text-accent" name="arrowUpRight" size="sm" />
                </Link>

                <Link
                    :href="registerHref"
                    class="inline-flex min-h-13 items-center justify-center rounded-control border border-accent-hover bg-accent px-panel text-ui-action font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    @click="handleNavigation"
                >
                    Попробовать бесплатно
                </Link>

                <p class="text-center font-mono text-ui-xs text-muted">
                    3 дня бесплатно · До 5 устройств
                </p>
            </nav>
        </div>
    </Teleport>
</template>
