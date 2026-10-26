<script setup>
defineProps({
    description: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        default: 'default',
        validator: value => ['default', 'compact'].includes(value),
    },
})
const TITLE_CLASSES = {
    default: 'text-interface-heading tracking-interface-heading',
    compact: 'text-interface-title',
}
</script>

<template>
    <div class="grid min-w-0 grid-cols-1 gap-control">
        <div class="flex min-w-0 items-start justify-between gap-content tablet:items-end">
            <h1 :class="TITLE_CLASSES[variant]" class="min-w-0 flex-1 font-display break-words text-foreground">
                {{ title }}
            </h1>
            <div v-if="$slots.actions" class="flex shrink-0 items-center gap-compact">
                <slot name="actions" />
            </div>
        </div>
        <slot name="description">
            <p v-if="description" class="text-interface-intro text-secondary">{{ description }}</p>
        </slot>
    </div>
</template>
