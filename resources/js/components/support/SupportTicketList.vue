<script setup>
import { Link } from '@inertiajs/vue3'
import StatePanel from '@/components/ui/StatePanel.vue'
import SupportPagination from '@/components/support/SupportPagination.vue'
defineProps({ tickets: { type: Object, required: true } })
</script>

<template>
    <section class="grid min-w-0 grid-cols-1 gap-account-section" aria-labelledby="support-tickets-title">
        <h2 id="support-tickets-title" class="text-interface-heading font-display wrap-anywhere">Обращения</h2>
        <StatePanel v-if="!tickets.data.length" state="empty" title="Обращений пока нет." description="Если нужна помощь, создай обращение — ответим здесь." />
        <ul v-else class="grid min-w-0 grid-cols-1 gap-support-message-gap">
            <li v-for="ticket in tickets.data" :key="ticket.url" class="min-w-0">
                <Link :href="ticket.url" class="grid min-w-0 grid-cols-1 gap-support-message-gap rounded-card border border-border bg-interface-input p-support-ticket hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                    <div class="flex min-w-0 flex-wrap items-start justify-between gap-compact"><h3 class="min-w-0 flex-1 text-interface-title font-display wrap-anywhere">{{ ticket.subject }}</h3><span class="text-interface-meta" :class="ticket.status === 'OPEN' ? 'text-accent' : 'text-secondary'">{{ ticket.statusLabel }}</span></div>
                    <p class="line-clamp-2 text-interface-body text-secondary wrap-anywhere">{{ ticket.preview }}</p>
                    <time :datetime="ticket.updatedAt" class="text-interface-body text-muted">{{ ticket.updatedLabel }}</time>
                </Link>
            </li>
        </ul>
        <SupportPagination :pagination="tickets" />
    </section>
</template>
