<script setup>
import { computed } from 'vue'
import BrandLink from '@/components/brand/BrandLink.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const STATUS_CONFIG = {
    canceled: {
        icon: 'circleX',
        iconClasses: 'bg-error-soft text-error',
        role: 'alert',
    },
    pending: {
        icon: 'clock',
        iconClasses: 'bg-warning-soft text-warning',
        role: 'status',
    },
    succeeded: {
        icon: 'circleCheck',
        iconClasses: 'bg-success-soft text-success',
        role: 'status',
    },
}

const props = defineProps({
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        validator: value => ['canceled', 'pending', 'succeeded'].includes(value),
    },
    title: {
        type: String,
        required: true,
    },
})

const config = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG.pending)
</script>

<template>
    <div class="flex min-h-dvh flex-col bg-background text-foreground">
        <header class="flex h-auth-header shrink-0 items-center px-shell-gutter">
            <BrandLink variant="wordmark" />
        </header>
        <main class="mx-auto flex w-full flex-1 flex-col px-shell-gutter pt-auth-status-top pb-auth-status-bottom tablet:max-w-auth-tablet tablet:px-0 desktop:max-w-auth-desktop">

            <section
                :role="config.role"
                class="my-auto grid min-w-0 grid-cols-1 justify-items-center gap-auth-group text-center"
            >
                <span :class="['inline-flex size-auth-status-icon items-center justify-center rounded-auth-status', config.iconClasses]">
                    <UiIcon :name="config.icon" size="status" />
                </span>

                <div class="grid min-w-0 grid-cols-1 gap-auth-group">
                    <h1 class="text-interface-heading font-display break-words">{{ title }}</h1>
                    <p class="text-interface-body text-secondary">{{ description }}</p>
                </div>

                <div v-if="$slots.actions" class="grid w-full gap-compact">
                    <slot name="actions" />
                </div>
            </section>
        </main>
    </div>
</template>
