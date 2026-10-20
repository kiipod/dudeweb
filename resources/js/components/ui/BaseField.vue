<script setup>
import { computed, useSlots } from 'vue'
import UiIcon from './UiIcon.vue'

const model = defineModel({
    type: [String, Number],
    default: '',
})

const props = defineProps({
    variant: { type: String, default: 'default', validator: value => ['default', 'auth'].includes(value) },
    icon: { type: String, default: '' },
    spacing: { type: String, default: 'field', validator: value => ['field', 'reset', 'sheet'].includes(value) },
    autocomplete: {
        type: String,
        default: undefined,
    },
    disabled: Boolean,
    error: {
        type: String,
        default: '',
    },
    hint: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        required: true,
    },
    inputmode: {
        type: String,
        default: undefined,
    },
    label: {
        type: String,
        required: true,
    },
    maxlength: {
        type: [Number, String],
        default: undefined,
    },
    name: {
        type: String,
        default: undefined,
    },
    placeholder: {
        type: String,
        default: '',
    },
    readonly: Boolean,
    required: Boolean,
    type: {
        type: String,
        default: 'text',
    },
})

const slots = useSlots()

const describedBy = computed(() => {
    if (props.error) {
        return `${props.id}-error`
    }

    return props.hint ? `${props.id}-hint` : undefined
})

const inputClass = computed(() => [
    'min-h-interface-control w-full rounded-button border px-interface-inline text-interface-body text-foreground outline-none transition-colors duration-200 motion-reduce:transition-none placeholder:text-muted focus:border-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60',
    'bg-interface-input',
    props.error ? 'border-error' : props.variant === 'auth' ? 'border-interface-input-border' : 'border-interface-field-border',
    props.icon ? 'pl-interface-icon-text' : '',
    slots.suffix ? 'pr-12' : '',
])
</script>

<template>
    <div class="grid min-w-0 grid-cols-1" :class="spacing === 'reset' ? 'gap-auth-reset-group' : spacing === 'sheet' ? 'gap-control-inline' : 'gap-interface-field-gap'">
        <label :for="id" class="text-interface-body font-medium" :class="variant === 'auth' ? 'text-secondary' : 'text-foreground'">
            {{ label }}
        </label>

        <div class="relative">
            <span v-if="icon" class="pointer-events-none absolute inset-y-0 left-interface-inline flex items-center text-muted"><UiIcon :name="icon" /></span>
            <input
                :id="id"
                v-model="model"
                :aria-describedby="describedBy"
                :aria-invalid="Boolean(error)"
                :autocomplete="autocomplete"
                :class="inputClass"
                :disabled="disabled"
                :inputmode="inputmode"
                :maxlength="maxlength"
                :name="name"
                :placeholder="placeholder"
                :readonly="readonly"
                :required="required"
                :type="type"
            >

            <span
                v-if="$slots.suffix"
                class="absolute inset-y-0 flex items-center text-muted"
                :class="variant === 'auth' ? 'right-1' : 'right-control-inline'"
            >
                <slot name="suffix" />
            </span>
        </div>

        <p v-if="error" :id="`${id}-error`" class="text-interface-body text-error" aria-live="polite">
            {{ error }}
        </p>
        <p v-else-if="hint" :id="`${id}-hint`" class="text-interface-body text-muted">
            {{ hint }}
        </p>
    </div>
</template>
