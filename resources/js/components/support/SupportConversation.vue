<script setup>
import { Link } from '@inertiajs/vue3'
import SupportPagination from '@/components/support/SupportPagination.vue'
import SupportReplyForm from '@/components/support/SupportReplyForm.vue'
defineProps({ ticket: { type: Object, required: true }, messages: { type: Object, required: true }, submissionId: { type: String, required: true }, bodyMax: { type: Number, required: true } })
const MESSAGE_CLASSES = { customer: 'ml-auto bg-support-customer', operator: 'mr-auto bg-support-operator' }
</script>

<template>
    <header class="grid min-w-0 grid-cols-1 gap-control">
        <h1 class="text-interface-title font-display wrap-anywhere">{{ ticket.subject }}</h1>
        <p class="text-interface-meta text-accent">{{ ticket.statusLabel }} · <time :datetime="ticket.updatedAt">{{ ticket.updatedLabel }}</time></p>
    </header>
    <ol aria-label="Переписка с поддержкой" class="grid min-w-0 grid-cols-1 gap-support-conversation">
        <li v-for="message in messages.data" :key="message.id" class="min-w-0">
            <article :class="MESSAGE_CLASSES[message.author]" class="grid w-support-bubble-width min-w-0 grid-cols-1 gap-support-message-gap rounded-card p-support-bubble">
                <h2 class="text-interface-body font-semibold">{{ message.authorLabel }}</h2>
                <p class="whitespace-pre-wrap text-interface-body wrap-anywhere">{{ message.body }}</p>
                <time :datetime="message.createdAt" class="text-interface-meta text-secondary">{{ message.timeLabel }}</time>
            </article>
        </li>
    </ol>
    <SupportPagination :pagination="messages" label="Страницы переписки" />
    <SupportReplyForm v-if="ticket.status === 'OPEN'" :key="ticket.replyUrl" :reply-url="ticket.replyUrl" :submission-id="submissionId" :body-max="bodyMax" />
    <div v-else role="status" class="grid justify-items-start gap-compact rounded-card border border-border bg-interface-input p-support-ticket"><p class="text-interface-body text-secondary">Обращение закрыто. Если нужна помощь, создай новое.</p><Link href="/account/support/create" class="min-h-interface-control text-interface-body text-accent focus-visible:outline-2 focus-visible:outline-focus">Новое обращение</Link></div>
</template>
