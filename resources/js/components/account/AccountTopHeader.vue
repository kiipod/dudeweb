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
        default: 'system',
        validator: value => ['dark', 'light', 'system'].includes(value),
    },
})

const emit = defineEmits(['change-theme'])

const themeIcon = computed(() => ({
    dark: 'moon',
    light: 'sun',
    system: 'monitor',
})[props.theme])

const themeLabel = computed(() => ({
    dark: 'Тёмная тема. Изменить тему',
    light: 'Светлая тема. Изменить тему',
    system: 'Системная тема. Изменить тему',
})[props.theme])
</script>

<template>
    <header class="flex min-h-17 items-center justify-between border-b border-border bg-background/95 px-shell-gutter">
        <div class="flex min-w-0 items-center gap-tight">
            <BrandLogo variant="horizontal" />
            <span aria-hidden="true" class="h-5 w-px bg-border" />
            <span class="truncate text-ui-body font-medium text-secondary">{{ pageTitle }}</span>
        </div>

        <div class="flex items-center gap-compact">
            <BaseButton :aria-label="themeLabel" size="icon" variant="secondary" @click="emit('change-theme')">
                <UiIcon :name="themeIcon" size="sm" />
            </BaseButton>

            <Link
                :href="profileHref"
                aria-label="Открыть профиль"
                class="inline-flex size-11 items-center justify-center rounded-control border border-border bg-elevated text-foreground transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                <UiIcon name="user" />
            </Link>
        </div>
    </header>
</template>
