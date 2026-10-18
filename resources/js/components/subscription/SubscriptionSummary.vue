<script setup>
import { computed } from 'vue'

const props = defineProps({
    discount: {
        type: String,
        default: '—',
    },
    period: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        required: true,
    },
    total: {
        type: String,
        required: true,
    },
})

const rows = computed(() => [
    { label: 'Тариф', value: props.plan },
    { label: 'Период', value: props.period },
    { label: 'Скидка', value: props.discount },
])
</script>

<template>
    <dl class="grid gap-compact rounded-card border border-border bg-surface p-control-inline">
        <div v-for="row in rows" :key="row.label" class="flex items-center justify-between gap-content">
            <dt class="text-interface-body text-muted">{{ row.label }}</dt>
            <dd class="text-right text-interface-body font-medium text-secondary">{{ row.value }}</dd>
        </div>
        <div class="flex items-center justify-between gap-content">
            <dt class="text-interface-body text-muted">К оплате</dt>
            <dd class="text-right text-interface-body font-display text-foreground">{{ total }}</dd>
        </div>
    </dl>
</template>
