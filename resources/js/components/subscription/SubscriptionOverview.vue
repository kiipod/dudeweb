<script setup>
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { daysLabel } from '@/utils/dashboardPresentation'
defineProps({ subscription: { type: Object, required: true } })
</script>

<template>
    <section aria-label="Текущая подписка" class="grid min-w-0 gap-subscription-overview rounded-subscription-overview border border-account-card-border bg-surface p-control-inline">
        <div class="flex flex-wrap items-center justify-between gap-compact">
            <h2 class="text-interface-title font-display wrap-anywhere">{{ subscription.planName }}</h2>
            <StatusBadge :status="subscription.state" />
        </div>
        <dl class="flex flex-wrap justify-between gap-content text-interface-body">
            <div class="grid gap-0.5">
                <dt class="text-secondary">{{ subscription.state === 'expired' ? 'Действовала до' : 'Действует до' }}</dt>
                <dd><time :datetime="subscription.expiresAt">{{ subscription.expiresOn }}</time></dd>
            </div>
            <div class="grid gap-0.5 text-right">
                <dt class="text-secondary">Осталось</dt>
                <dd>{{ daysLabel(subscription.remainingDays) }}</dd>
            </div>
        </dl>
    </section>
</template>
