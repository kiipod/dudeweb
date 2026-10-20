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
        <div v-for="row in rows" :key="row.label" class="flex flex-wrap items-center justify-between gap-compact">
            <dt class="text-interface-body text-muted">{{ row.label }}</dt>
            <dd class="min-w-0 text-right text-interface-body font-medium wrap-anywhere text-secondary">{{ row.value }}</dd>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-compact">
            <dt class="text-interface-body text-muted">К оплате</dt>
            <dd class="min-w-0 text-right text-interface-body font-display wrap-anywhere text-foreground">{{ total }}</dd>
        </div>
    </dl>
</template>
