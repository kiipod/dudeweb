<script setup>
import { computed } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const STATUS_CONFIG = {
    active: {
        classes: 'border-success/40 bg-success-soft text-success',
        icon: 'circleCheck',
        label: 'Активна',
    },
    expired: {
        classes: 'border-error/40 bg-error-soft text-error',
        icon: 'circleX',
        label: 'Истекла',
    },
    expiring: {
        classes: 'border-warning/40 bg-warning-soft text-warning',
        icon: 'clock',
        label: 'Скоро истечёт',
    },
    limited: {
        classes: 'border-warning/40 bg-warning-soft text-warning',
        icon: 'alertTriangle',
        label: 'Ограничена',
    },
    loading: {
        classes: 'border-border bg-elevated text-secondary',
        icon: 'loader',
        label: 'Обновляем статус',
    },
    serviceError: {
        classes: 'border-error/40 bg-error-soft text-error',
        icon: 'circleX',
        label: 'Сервис недоступен',
    },
    trial: {
        classes: 'border-accent/40 bg-accent-soft text-accent-text',
        icon: 'clock',
        label: 'Пробный период',
    },
}

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: 'active',
        validator: value => [
            'active',
            'expired',
            'expiring',
            'limited',
            'loading',
            'serviceError',
            'trial',
        ].includes(value),
    },
})

const config = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG.active)
const badgeClass = computed(() => [
    'inline-flex min-h-interface-badge items-center gap-interface-badge-gap rounded-full border px-interface-badge-inline text-interface-meta font-semibold',
    config.value.classes,
])
</script>

<template>
    <span :class="badgeClass" role="status">
        <UiIcon :name="config.icon" size="badge" />
        {{ label || config.label }}
    </span>
</template>
