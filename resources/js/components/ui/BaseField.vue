<script setup>
import { computed, useSlots } from 'vue'

const model = defineModel({
    type: [String, Number],
    default: '',
})

const props = defineProps({
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
    'min-h-12.5 w-full rounded-button border bg-surface px-control-inline text-ui-body text-foreground outline-none transition-colors duration-200 placeholder:text-muted focus:border-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60',
    props.error ? 'border-error' : 'border-border',
    slots.suffix ? 'pr-12' : '',
])
</script>

<template>
    <div class="grid gap-control">
        <label :for="id" class="text-ui-meta font-medium text-foreground">
            {{ label }}
        </label>

        <div class="relative">
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
                class="absolute inset-y-0 right-control-inline flex items-center text-muted"
            >
                <slot name="suffix" />
            </span>
        </div>

        <p v-if="error" :id="`${id}-error`" class="text-ui-meta text-error" aria-live="polite">
            {{ error }}
        </p>
        <p v-else-if="hint" :id="`${id}-hint`" class="text-ui-meta text-muted">
            {{ hint }}
        </p>
    </div>
</template>
