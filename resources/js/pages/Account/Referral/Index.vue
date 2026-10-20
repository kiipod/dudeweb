<script setup>
import { Head, Link } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import ReferralInviteCard from '@/components/referral/ReferralInviteCard.vue'
import ReferralMetrics from '@/components/referral/ReferralMetrics.vue'
defineProps({ webInviteUrl: { type: String, default: null }, telegramInviteUrl: { type: String, default: null }, metrics: { type: Object, required: true } })
</script>

<template>
    <Head title="Пригласить друга" />
    <AccountLayout page-title="Пригласить друга">
        <div class="grid min-w-0 grid-cols-1 gap-account-section">
            <PageHeading title="Хорошим делятся." description="Приглашай друзей в dudeweb по своей ссылке и получай бонусы по условиям программы." />
            <Link href="/account/referral/terms" class="flex min-h-interface-control min-w-0 items-center gap-compact rounded-button border border-border bg-interface-input px-interface-inline py-control text-interface-action text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><UiIcon name="gift" size="sm" /><span class="min-w-0 flex-1">Условия партнёрской программы</span><UiIcon name="chevronRight" size="sm" /></Link>
            <ReferralInviteCard :web-invite-url="webInviteUrl" :telegram-invite-url="telegramInviteUrl" />
            <ReferralMetrics :metrics="metrics" />
            <section class="grid min-w-0 grid-cols-1 justify-items-center gap-referral-empty-gap rounded-card border border-border bg-interface-input p-referral-empty text-center" aria-labelledby="referral-state-title">
                <UiIcon name="userPlus" />
                <h2 id="referral-state-title" class="max-w-full text-interface-title font-display wrap-anywhere">{{ metrics.invitedCount === 0 ? 'Пока никто не присоединился по твоей ссылке.' : 'Друзья уже присоединились по твоей ссылке.' }}</h2>
                <p class="text-interface-body text-secondary">{{ metrics.invitedCount === 0 ? 'Поделись приглашением с друзьями.' : 'Продолжай делиться приглашением. Начисленные бонусы появятся в статистике.' }}</p>
            </section>
        </div>
    </AccountLayout>
</template>
