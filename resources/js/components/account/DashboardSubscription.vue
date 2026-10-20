<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { DASHBOARD_STATES, daysLabel } from '@/utils/dashboardPresentation'

const props = defineProps({ subscription: { type: Object, required: true } })
const state = computed(() => DASHBOARD_STATES[props.subscription.state])
</script>

<template>
    <section aria-label="Твоя подписка" class="grid min-w-0 grid-cols-1 gap-account-card-gap rounded-card border border-interface-input-border bg-surface p-account-card">
        <div class="flex flex-wrap items-center justify-between gap-compact">
            <p class="font-mono text-interface-meta text-secondary">ТВОЯ ПОДПИСКА</p>
            <StatusBadge :status="subscription.state" />
        </div>
        <div class="grid min-w-0 gap-control">
            <h2 class="text-interface-title font-display wrap-anywhere text-foreground">{{ subscription.planName }}</h2>
            <p :class="['text-interface-body', ['active', 'trial'].includes(subscription.state) ? 'text-success' : 'text-secondary']">{{ state.message }}</p>
        </div>
        <dl class="flex flex-wrap items-start justify-between gap-content text-interface-body">
            <div class="grid gap-0.5">
                <dt class="text-secondary">{{ subscription.state === 'expired' ? 'Действовала до' : 'Действует до' }}</dt>
                <dd class="font-semibold"><time :datetime="subscription.expiresAt">{{ subscription.expiresOn }}</time></dd>
            </div>
            <div class="grid gap-0.5 text-right">
                <dt class="text-secondary">Осталось</dt>
                <dd class="font-semibold">{{ daysLabel(subscription.remainingDays) }}</dd>
            </div>
        </dl>
        <Link v-if="subscription.state === 'limited'" href="/account/support" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{{ state.action }}</Link>
        <Link v-else href="/account/subscription" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{{ state.action }}</Link>
    </section>
</template>
