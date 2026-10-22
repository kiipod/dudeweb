<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import SupportRead from '@/components/support/SupportRead.vue'
import SupportTicketList from '@/components/support/SupportTicketList.vue'
defineProps({ tickets: { type: Object, required: true }, serviceState: { type: String, default: 'ready' } })
</script>

<template>
    <Head title="Поддержка" />
    <AccountLayout page-title="Поддержка">
        <div class="grid min-w-0 grid-cols-1 gap-account-section">
            <PageHeading title="Dude, мы на связи." description="Расскажи, что случилось, — поможем разобраться." />
            <Link href="/account/support/create" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">Написать в поддержку</Link>
            <SupportRead :service-state="serviceState"><SupportTicketList :tickets="tickets" /></SupportRead>
        </div>
    </AccountLayout>
</template>
