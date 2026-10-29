<script setup>
import { daysLabel } from '@/utils/dashboardPresentation'
defineProps({ metrics: { type: Object, required: true } })
</script>

<template>
    <dl class="grid min-w-0 grid-cols-2 gap-referral-stat-gap">
        <div class="grid min-h-referral-stat-height min-w-0 content-center gap-control rounded-referral-stat border border-border bg-interface-input p-referral-stat">
            <dd class="order-first font-mono text-interface-body wrap-anywhere">{{ metrics.invitedCount }}</dd>
            <dt class="text-interface-body text-secondary wrap-anywhere">Приглашено друзей</dt>
        </div>
        <div class="grid min-h-referral-stat-height min-w-0 content-center gap-control rounded-referral-stat border border-border bg-interface-input p-referral-stat">
            <dd class="order-first font-mono text-interface-body wrap-anywhere">{{ daysLabel(metrics.bonusDays) }}</dd>
            <dt class="text-interface-body text-secondary wrap-anywhere">Получено бонусов</dt>
        </div>
    </dl>
</template>
