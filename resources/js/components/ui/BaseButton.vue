<script setup>
import { computed } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const BASE_CLASSES = 'inline-flex items-center justify-center border font-sans transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60'

const VARIANT_CLASSES = {
    accountLogout: 'border-account-logout-border bg-transparent text-error hover:bg-error-soft',
    overlayClose: 'border-transparent bg-account-overlay-close text-foreground hover:bg-surface',
    accountChrome: 'border-account-chrome-border bg-account-chrome text-secondary hover:bg-surface hover:text-foreground',
    accent: 'border-border bg-elevated text-accent-text hover:bg-surface',
    danger: 'border-error/40 bg-transparent text-error hover:bg-error-soft',
    ghost: 'border-transparent bg-transparent text-secondary hover:bg-surface hover:text-foreground',
    primary: 'border-accent-border bg-accent text-accent-foreground hover:border-accent-border-hover hover:bg-accent-hover',
    secondary: 'border-border bg-elevated text-foreground hover:bg-surface',
}

const SIZE_CLASSES = {
    overlayClose: 'h-account-overlay-close-height w-account-overlay-close-width shrink-0 p-0',
    icon: 'size-interface-header-control shrink-0 p-0',
    copy: 'size-interface-copy shrink-0 rounded-interface-copy p-0',
    md: 'min-h-interface-control px-interface-inline py-tight text-interface-action font-bold',
    sm: 'min-h-10 px-content py-compact text-ui-detail font-semibold',
}

const props = defineProps({
    disabled: Boolean,
    fullWidth: Boolean,
    href: {
        type: String,
        default: null,
    },
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
        validator: value => ['overlayClose', 'icon', 'copy', 'md', 'sm'].includes(value),
    },
    type: {
        type: String,
        default: 'button',
        validator: value => ['button', 'reset', 'submit'].includes(value),
    },
    variant: {
        type: String,
        default: 'primary',
        validator: value => ['accountLogout', 'overlayClose', 'accountChrome', 'accent', 'danger', 'ghost', 'primary', 'secondary'].includes(value),
    },
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => [
    BASE_CLASSES,
    props.variant === 'accountLogout' ? 'gap-tight' : 'gap-compact',
    ['accountChrome', 'overlayClose'].includes(props.variant) ? 'rounded-control' : props.size === 'copy' ? '' : 'rounded-button',
    VARIANT_CLASSES[props.variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
    props.fullWidth ? 'w-full' : '',
    props.href && (props.disabled || props.loading) ? 'pointer-events-none cursor-not-allowed opacity-60' : '',
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
    <component
        :is="href ? 'a' : 'button'"
        :aria-busy="loading"
        :aria-disabled="href && (disabled || loading) ? true : undefined"
        :class="buttonClass"
        :disabled="href ? undefined : disabled || loading"
        :href="disabled || loading ? undefined : href"
        :tabindex="href && (disabled || loading) ? -1 : undefined"
        :type="href ? undefined : type"
        @click="handleClick"
    >
        <UiIcon v-if="loading" name="loader" size="sm" />
        <span v-if="loading">{{ loadingLabel }}</span>
        <slot v-else-if="$slots.default" />
        <span v-else>{{ label }}</span>
    </component>
</template>
