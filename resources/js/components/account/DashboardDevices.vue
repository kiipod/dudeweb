<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'
defineProps({ summary: { type: Object, required: true } })
</script>

<template>
    <section aria-labelledby="dashboard-devices-title" class="flex min-h-account-device items-center gap-control-inline rounded-card border border-border bg-interface-input px-account-card desktop:px-panel">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent-text"><UiIcon name="monitor-smartphone" /></span>
        <div class="grid min-w-0 flex-1 gap-0.5">
            <h2 id="dashboard-devices-title" class="text-interface-title font-display">Устройства</h2>
            <p class="text-interface-body text-secondary">Подключено: {{ summary.count }}<template v-if="summary.limit !== null"> из {{ summary.limit }}</template></p>
        </div>
        <UiIcon name="chevronRight" size="md" class="shrink-0 text-muted" />
    </section>
</template>
