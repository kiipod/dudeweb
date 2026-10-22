<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import StatePanel from '@/components/ui/StatePanel.vue'
import ReferralTermsContent from '@/components/referral/ReferralTermsContent.vue'
defineProps({ termsAvailable: Boolean, friendDiscountPercent: { type: Number, default: null }, rewardMatrix: { type: Array, required: true }, contentVersion: { type: String, default: null } })
</script>

<template>
    <Head title="Условия программы" />
    <AccountLayout page-title="Условия программы" content-spacing="referralTerms">
        <div class="grid min-w-0 grid-cols-1 gap-referral-terms">
            <Link href="/account/referral" class="inline-flex min-h-10 items-center justify-self-start gap-compact rounded-control text-interface-body font-semibold text-accent-text hover:underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"><UiIcon name="arrowLeft" size="sm" />Назад к приглашениям</Link>
            <PageHeading title="Партнёрская программа" description="Условия для участия простые." />
            <ReferralTermsContent v-if="termsAvailable" :friend-discount-percent="friendDiscountPercent" :reward-matrix="rewardMatrix" />
            <StatePanel v-else state="serviceError" title="Условия программы сейчас недоступны." description="Попробуй открыть страницу позже или напиши в поддержку." />
        </div>
    </AccountLayout>
</template>
