<script setup>
import { computed } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const VARIANT_CLASSES = {
    error: 'border-error/40 bg-error-soft text-error',
    info: 'border-border bg-elevated text-secondary',
    success: 'border-success/40 bg-success-soft text-success',
    warning: 'border-warning/40 bg-warning-soft text-warning',
}

const VARIANT_ICONS = {
    error: 'circleX',
    info: 'info',
    success: 'circleCheck',
    warning: 'alertTriangle',
}

const props = defineProps({
    message: {
        type: String,
        default: '',
    },
    variant: {
        type: String,
        default: 'info',
        validator: value => ['error', 'info', 'success', 'warning'].includes(value),
    },
})

const alertClass = computed(() => [
    'flex items-start gap-tight rounded-button border p-control-inline text-interface-body',
    VARIANT_CLASSES[props.variant] ?? VARIANT_CLASSES.info,
])

const icon = computed(() => VARIANT_ICONS[props.variant] ?? VARIANT_ICONS.info)
const role = computed(() => props.variant === 'error' ? 'alert' : 'status')
</script>

<template>
    <div :class="alertClass" :role="role">
        <UiIcon :name="icon" size="sm" />
        <div class="min-w-0 flex-1">
            <p v-if="$slots.title" class="font-semibold text-foreground">
                <slot name="title" />
            </p>
            <slot v-if="$slots.default" />
            <p v-else>{{ message }}</p>
        </div>
    </div>
</template>
