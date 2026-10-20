<script setup>
const model = defineModel({
    type: [String, Number],
    default: '',
})

const props = defineProps({
    disabled: Boolean,
    legend: {
        type: String,
        default: 'Период подписки',
    },
    loading: Boolean,
    name: {
        type: String,
        default: 'subscription-period',
    },
    options: {
        type: Array,
        required: true,
        validator: options => options.every(option => (
            Object.hasOwn(option, 'value') && typeof option.label === 'string'
        )),
    },
})

const OPTION_CLASSES = {
    default: 'border-border bg-elevated text-secondary hover:border-accent hover:text-foreground',
    disabled: 'cursor-not-allowed opacity-50',
    selected: 'border-accent-hover bg-accent text-accent-foreground',
}

function optionClass(option) {
    if (props.disabled || props.loading || option.disabled) {
        return [OPTION_CLASSES.default, OPTION_CLASSES.disabled]
    }

    return model.value === option.value ? OPTION_CLASSES.selected : OPTION_CLASSES.default
}
</script>

<template>
    <fieldset :aria-busy="loading" :disabled="disabled || loading">
        <legend class="sr-only">{{ legend }}</legend>

        <div class="grid grid-cols-2 gap-x-compact gap-y-interface-field-gap">
            <label
                v-for="option in options"
                :key="option.value"
                :class="[
                    'relative flex min-h-interface-control min-w-0 cursor-pointer items-center justify-center rounded-menu-item border px-tight py-compact text-center text-interface-body font-semibold wrap-anywhere transition-colors duration-200 motion-reduce:transition-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
                    optionClass(option),
                ]"
            >
                <input
                    v-model="model"
                    :disabled="disabled || loading || option.disabled"
                    :name="name"
                    :value="option.value"
                    class="sr-only"
                    type="radio"
                >
                {{ option.label }}
            </label>
        </div>
    </fieldset>
</template>
