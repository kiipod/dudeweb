<script setup>
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import PageRefreshButton from '@/components/ui/PageRefreshButton.vue'
import StatePanel from '@/components/ui/StatePanel.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import DashboardSubscription from '@/components/account/DashboardSubscription.vue'
import DashboardConnection from '@/components/account/DashboardConnection.vue'
import DashboardDevices from '@/components/account/DashboardDevices.vue'
import { useDashboardRefresh } from '@/composables/useDashboardRefresh'

const props = defineProps({
    user: { type: Object, required: true },
    subscription: { type: Object, default: null },
    devicesSummary: { type: Object, default: null },
    serviceState: { type: String, required: true, validator: value => ['ready', 'service_error'].includes(value) },
    provisioningRequired: Boolean,
})
const { busy, refreshError, provision, retry } = useDashboardRefresh(() => props.provisioningRequired)
const heading = computed(() => props.user.displayName ? `Привет, ${props.user.displayName} 👋` : 'Привет 👋')
</script>

<template>
    <Head title="Главная" />
    <AccountLayout page-title="Главная">
        <div class="grid min-w-0 grid-cols-1 gap-account-section">
            <PageHeading :title="heading" description="Всё важное о твоём доступе — здесь.">
                <template #actions><PageRefreshButton :loading="busy" @click="retry" /></template>
            </PageHeading>
            <StatePanel v-if="busy" state="loading" title="Проверяем данные подписки…" description="Это займёт несколько секунд." />
            <template v-else-if="serviceState === 'ready' && subscription && devicesSummary && !refreshError">
                <DashboardSubscription :subscription="subscription" />
                <DashboardConnection :url="subscription.url" />
                <DashboardDevices :summary="devicesSummary" />
            </template>
            <StatePanel v-else state="serviceError" title="Не удалось загрузить данные." description="Попробуй обновить экран. Если проблема повторится, напиши в поддержку.">
                <template #actions>
                    <BaseButton label="Попробовать снова" :disabled="busy" @click="retry" />
                    <a href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center px-control text-interface-action font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">Написать в поддержку</a>
                </template>
            </StatePanel>
            <InlineAlert v-if="provision.errors.form" variant="error" :message="provision.errors.form" />
        </div>
    </AccountLayout>
</template>
