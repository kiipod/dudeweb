<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import SupportRead from '@/components/support/SupportRead.vue'
import SupportConversation from '@/components/support/SupportConversation.vue'
defineProps({ ticket: { type: Object, default: null }, messages: { type: Object, required: true }, serviceState: { type: String, default: 'ready' }, submissionId: { type: String, required: true }, bodyMax: { type: Number, required: true } })
</script>

<template>
    <Head title="Обращение в поддержку" />
    <AccountLayout page-title="Обращение" content-spacing="supportConversation">
        <div class="grid min-w-0 grid-cols-1 gap-support-conversation">
            <Link href="/account/support" class="inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Назад к обращениям</Link>
            <h1 v-if="!ticket" class="text-interface-title font-display">Поддержка</h1>
            <SupportRead :service-state="serviceState"><SupportConversation v-if="ticket" :ticket="ticket" :messages="messages" :submission-id="submissionId" :body-max="bodyMax" /></SupportRead>
        </div>
    </AccountLayout>
</template>
