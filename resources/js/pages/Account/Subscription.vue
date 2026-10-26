<script setup>
import { Head } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import SubscriptionOverview from '@/components/subscription/SubscriptionOverview.vue'
import SubscriptionCheckout from '@/components/subscription/SubscriptionCheckout.vue'
import PaymentHistory from '@/components/subscription/PaymentHistory.vue'

defineProps({
    subscription: { type: Object, default: null },
    serviceState: { type: String, required: true },
    catalogue: { type: Object, required: true },
    payments: { type: Object, required: true },
})
</script>

<template>
    <Head title="Подписка" />
    <AccountLayout page-title="Подписка" content-spacing="subscription">
        <div class="grid min-w-0 gap-account-section">
            <PageHeading title="Твоя подписка" description="Управляй периодом и продлевай доступ." />
            <SubscriptionOverview v-if="subscription" :subscription="subscription" />
            <p v-else role="alert" class="rounded-card border border-border bg-surface p-control-inline text-interface-body text-secondary">Не удалось загрузить текущую подписку. Обнови страницу, чтобы проверить срок доступа.</p>
            <p v-if="!catalogue.products.length" role="status" class="text-interface-body text-secondary">Сейчас нет доступных периодов для оплаты. Попробуй позже.</p>
            <SubscriptionCheckout :catalogue="catalogue" />
            <PaymentHistory :payments="payments" />
        </div>
    </AccountLayout>
</template>
