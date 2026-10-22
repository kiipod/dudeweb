<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'

defineProps({
    kind: { type: String, required: true, validator: value => ['mail', 'password'].includes(value) },
})
</script>

<template>
    <div class="mx-auto flex size-auth-status-icon items-center justify-center rounded-auth-status bg-status-icon-background" aria-hidden="true">
        <UiIcon :name="kind === 'mail' ? 'mail-check' : 'shield-check'" size="status" :class="kind === 'mail' ? 'text-status-icon-accent' : 'text-status-icon-success'" />
    </div>
</template>
