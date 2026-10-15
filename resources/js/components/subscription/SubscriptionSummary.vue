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
            <dt class="text-ui-meta text-muted">{{ row.label }}</dt>
            <dd class="text-right text-ui-meta font-medium text-secondary">{{ row.value }}</dd>
        </div>
        <div class="flex items-center justify-between gap-content">
            <dt class="text-ui-meta text-muted">К оплате</dt>
            <dd class="text-right text-ui-action font-semibold text-foreground">{{ total }}</dd>
        </div>
    </dl>
</template>
