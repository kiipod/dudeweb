<script setup>
import { Link } from '@inertiajs/vue3'
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

defineProps({
    items: {
        type: Array,
        required: true,
        validator: items => items.every(item => (
            typeof item.key === 'string'
            && typeof item.label === 'string'
            && typeof item.href === 'string'
            && typeof item.icon === 'string'
        )),
    },
    logoutLoading: Boolean,
})

const emit = defineEmits(['close', 'logout', 'navigate'])
</script>

<template>
    <section class="grid w-full gap-tight rounded-t-sheet border-t border-border bg-elevated px-shell-gutter pt-compact pb-panel">
        <div aria-hidden="true" class="mx-auto h-1 w-10 rounded-full bg-muted/60" />

        <header class="flex min-h-11 items-center justify-between">
            <h2 class="text-ui-title font-semibold text-foreground">Ещё</h2>
            <BaseButton aria-label="Закрыть меню" size="icon" variant="secondary" @click="emit('close')">
                <UiIcon name="x" />
            </BaseButton>
        </header>

        <nav aria-label="Дополнительные разделы" class="grid gap-compact">
            <Link
                v-for="item in items"
                :key="item.key"
                :href="item.href"
                class="flex min-h-14 items-center gap-tight rounded-button bg-surface px-control-inline text-ui-body font-medium text-foreground transition-colors duration-200 hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                @click="emit('navigate', item.key)"
            >
                <UiIcon :name="item.icon" class="text-accent" />
                <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                <UiIcon name="chevronRight" size="sm" class="text-muted" />
            </Link>
        </nav>

        <button
            :aria-busy="logoutLoading"
            class="flex min-h-14 items-center gap-tight rounded-button border border-error/40 px-control-inline text-ui-body font-semibold text-error transition-colors duration-200 hover:bg-error-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-60"
            :disabled="logoutLoading"
            type="button"
            @click="emit('logout')"
        >
            <UiIcon :name="logoutLoading ? 'loader' : 'logOut'" />
            {{ logoutLoading ? 'Выходим' : 'Выйти' }}
        </button>
    </section>
</template>
