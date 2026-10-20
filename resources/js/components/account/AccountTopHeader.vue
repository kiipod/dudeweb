<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const props = defineProps({
    pageTitle: {
        type: String,
        required: true,
    },
    profileHref: {
        type: String,
        default: '/account/profile',
    },
    theme: {
        type: String,
        default: 'light',
        validator: value => ['dark', 'light'].includes(value),
    },
})

const emit = defineEmits(['change-theme'])

const themeIcon = computed(() => ({
    dark: 'moon',
    light: 'sun',
})[props.theme])

const themeLabel = computed(() => ({
    dark: 'Тёмная тема. Включить светлую',
    light: 'Светлая тема. Включить тёмную',
})[props.theme])
</script>

<template>
    <header class="sticky top-0 z-30 flex min-h-account-header flex-wrap items-center justify-between gap-compact border-b border-border bg-background/95 px-shell-gutter desktop:px-section-md">
        <div class="flex min-w-0 flex-wrap items-center gap-tight">
            <BrandLogo variant="wordmark" class="desktop:hidden" />
            <span aria-hidden="true" class="h-5 w-px bg-border desktop:hidden" />
            <span class="min-w-0 text-interface-title font-display wrap-anywhere text-secondary desktop:text-foreground">{{ pageTitle }}</span>
        </div>

        <div class="flex shrink-0 items-center gap-compact">
            <BaseButton :aria-label="themeLabel" size="icon" variant="secondary" @click="emit('change-theme')">
                <UiIcon :name="themeIcon" size="sm" />
            </BaseButton>

            <Link
                v-if="profileHref"
                :href="profileHref"
                aria-label="Открыть профиль"
                class="inline-flex size-interface-header-control items-center justify-center rounded-control border border-border bg-elevated text-foreground transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <UiIcon name="user" />
            </Link>
            <BaseButton v-else aria-label="Профиль" size="icon" variant="secondary" disabled>
                <UiIcon name="user" />
            </BaseButton>
        </div>
    </header>
</template>
