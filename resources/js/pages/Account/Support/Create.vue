<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import SupportTicketForm from '@/components/support/SupportTicketForm.vue'
defineProps({ submissionId: { type: String, required: true }, subjectMax: { type: Number, required: true }, bodyMax: { type: Number, required: true } })
</script>

<template>
    <Head title="Новое обращение" />
    <AccountLayout page-title="Новое обращение">
        <div class="grid min-w-0 grid-cols-1 gap-account-section">
            <PageHeading title="Напиши нам" description="Опиши ситуацию — ответим в этом обращении." />
            <SupportTicketForm :submission-id="submissionId" :subject-max="subjectMax" :body-max="bodyMax" />
            <Link href="/account/support" class="inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body text-accent-text hover:underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">Назад к обращениям</Link>
        </div>
    </AccountLayout>
</template>
