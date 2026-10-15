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
        <div class="grid max-w-reading gap-control">
            <h1 class="text-page-title font-semibold tracking-tight text-foreground">
                {{ title }}
            </h1>
            <p v-if="description" class="text-ui-body text-secondary">
                {{ description }}
            </p>
        </div>

        <div v-if="$slots.actions" class="flex items-center gap-compact">
            <slot name="actions" />
        </div>
    </div>
</template>
