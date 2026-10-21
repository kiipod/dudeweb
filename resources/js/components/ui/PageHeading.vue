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
})
</script>

<template>
    <div class="flex flex-wrap items-start justify-between gap-content">
        <div class="grid min-w-0 max-w-full grid-cols-1 gap-control">
            <h1 class="text-interface-heading font-display tracking-interface-heading break-words text-foreground">
                {{ title }}
            </h1>
            <p v-if="description" class="text-interface-intro text-secondary">
                {{ description }}
            </p>
        </div>

        <div v-if="$slots.actions" class="flex items-center gap-compact">
            <slot name="actions" />
        </div>
    </div>
</template>
