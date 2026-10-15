<script setup>
import { computed } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const STATE_CONFIG = {
    empty: {
        icon: 'info',
        iconClasses: 'bg-accent-soft text-accent',
        role: 'status',
    },
    loading: {
        icon: 'loader',
        iconClasses: 'bg-elevated text-secondary',
        role: 'status',
    },
    serviceError: {
        icon: 'alertTriangle',
        iconClasses: 'bg-error-soft text-error',
        role: 'alert',
    },
    success: {
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
    state: {
        type: String,
        default: 'empty',
        validator: value => ['empty', 'loading', 'serviceError', 'success'].includes(value),
    },
    title: {
        type: String,
        required: true,
    },
})

const config = computed(() => STATE_CONFIG[props.state] ?? STATE_CONFIG.empty)
</script>

<template>
    <section
        :aria-busy="state === 'loading'"
        :role="config.role"
        class="grid justify-items-start gap-content rounded-card border border-border bg-surface p-panel"
    >
        <span :class="['inline-flex rounded-menu-item p-compact', config.iconClasses]">
            <UiIcon :name="config.icon" />
        </span>

        <div class="grid gap-control">
            <h2 class="text-ui-title font-semibold text-foreground">{{ title }}</h2>
            <p class="max-w-reading text-ui-body text-secondary">{{ description }}</p>
        </div>

        <div v-if="$slots.actions" class="flex flex-wrap gap-compact">
            <slot name="actions" />
        </div>
    </section>
</template>
