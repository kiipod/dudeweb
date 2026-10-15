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
    <main class="flex min-h-screen bg-background px-shell-gutter py-panel text-foreground">
        <div class="mx-auto flex w-full max-w-form flex-col">
            <BrandLink />

            <section
                :role="config.role"
                class="my-auto grid justify-items-center gap-content py-section-sm text-center"
            >
                <span :class="['inline-flex rounded-menu-item p-tight', config.iconClasses]">
                    <UiIcon :name="config.icon" />
                </span>

                <div class="grid gap-control">
                    <h1 class="text-page-title font-semibold tracking-tight">{{ title }}</h1>
                    <p class="text-ui-body text-secondary">{{ description }}</p>
                </div>

                <div v-if="$slots.actions" class="grid w-full gap-compact">
                    <slot name="actions" />
                </div>
            </section>
        </div>
    </main>
</template>
