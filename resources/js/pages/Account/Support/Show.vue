<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import PageRefreshButton from '@/components/ui/PageRefreshButton.vue'
import SupportRead from '@/components/support/SupportRead.vue'
import SupportConversation from '@/components/support/SupportConversation.vue'
defineProps({ ticket: { type: Object, default: null }, messages: { type: Object, required: true }, serviceState: { type: String, default: 'ready' }, submissionId: { type: String, required: true }, bodyMax: { type: Number, required: true } })
</script>

<template>
    <Head title="Обращение в поддержку" />
    <AccountLayout page-title="Обращение" content-spacing="supportConversation">
        <div class="grid min-w-0 grid-cols-1 gap-account-section">
            <Link href="/account/support" class="inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">Назад к обращениям</Link>
            <SupportRead :service-state="serviceState">
                <template #heading="{ loading, reload }">
                    <PageHeading :title="ticket?.subject ?? 'Поддержка'" variant="compact">
                        <template #actions><PageRefreshButton :loading="loading" @click="reload" /></template>
                        <template v-if="ticket" #description>
                            <p class="text-interface-meta text-accent-text">{{ ticket.statusLabel }} · <time :datetime="ticket.updatedAt">{{ ticket.updatedLabel }}</time></p>
                        </template>
                    </PageHeading>
                </template>
                <template #default="{ visible }">
                    <SupportConversation v-if="ticket" :visible="visible" :ticket="ticket" :messages="messages" :submission-id="submissionId" :body-max="bodyMax" />
                </template>
            </SupportRead>
        </div>
    </AccountLayout>
</template>
