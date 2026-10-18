<script setup>
import { computed } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const BASE_CLASSES = 'inline-flex items-center justify-center gap-compact rounded-button border font-sans transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60'

const VARIANT_CLASSES = {
    danger: 'border-error/40 bg-transparent text-error hover:bg-error-soft',
    ghost: 'border-transparent bg-transparent text-secondary hover:bg-surface hover:text-foreground',
    primary: 'border-accent-hover bg-accent text-accent-foreground hover:bg-accent-hover',
    secondary: 'border-border bg-elevated text-foreground hover:bg-surface',
}

const SIZE_CLASSES = {
    icon: 'size-interface-header-control shrink-0 p-0',
    copy: 'size-interface-copy shrink-0 rounded-interface-copy p-0',
    md: 'min-h-interface-control px-interface-inline py-tight text-interface-action font-bold',
    sm: 'min-h-10 px-content py-compact text-ui-detail font-semibold',
}

const props = defineProps({
    disabled: Boolean,
    fullWidth: Boolean,
    label: {
        type: String,
        default: '',
    },
    loading: Boolean,
    loadingLabel: {
        type: String,
        default: 'Загрузка',
    },
    size: {
        type: String,
        default: 'md',
        validator: value => ['icon', 'copy', 'md', 'sm'].includes(value),
    },
    type: {
        type: String,
        default: 'button',
        validator: value => ['button', 'reset', 'submit'].includes(value),
    },
    variant: {
        type: String,
        default: 'primary',
        validator: value => ['danger', 'ghost', 'primary', 'secondary'].includes(value),
    },
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => [
    BASE_CLASSES,
    VARIANT_CLASSES[props.variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
    props.fullWidth ? 'w-full' : '',
])

function handleClick(event) {
    if (props.disabled || props.loading) {
        event.preventDefault()
        return
    }

    emit('click', event)
}
</script>

<template>
    <button
        :aria-busy="loading"
        :class="buttonClass"
        :disabled="disabled || loading"
        :type="type"
        @click="handleClick"
    >
        <UiIcon v-if="loading" name="loader" size="sm" />
        <span v-if="loading">{{ loadingLabel }}</span>
        <slot v-else-if="$slots.default" />
        <span v-else>{{ label }}</span>
    </button>
</template>
