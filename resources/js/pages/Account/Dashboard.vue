<script setup>
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { Head, router, useForm } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import StatePanel from '@/components/ui/StatePanel.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import DashboardSubscription from '@/components/account/DashboardSubscription.vue'
import DashboardConnection from '@/components/account/DashboardConnection.vue'
import DashboardDevices from '@/components/account/DashboardDevices.vue'

const props = defineProps({
    user: { type: Object, required: true },
    subscription: { type: Object, default: null },
    devicesSummary: { type: Object, default: null },
    serviceState: { type: String, required: true, validator: value => ['ready', 'service_error'].includes(value) },
    provisioningRequired: Boolean,
})
const refreshing = shallowRef(false)
const refreshError = shallowRef(false)
const provision = useForm({})
const heading = computed(() => props.user.displayName ? `Привет, ${props.user.displayName} 👋` : 'Привет 👋')
const busy = computed(() => refreshing.value || provision.processing)
let cancelRefresh

function retry() {
    if (busy.value) return
    refreshError.value = false
    if (props.provisioningRequired) {
        provision.post('/account/provisioning')
        return
    }
    refreshing.value = true
    router.reload({
        only: ['user', 'subscription', 'devicesSummary', 'serviceState', 'provisioningRequired'],
        onCancelToken: token => { cancelRefresh = token },
        onError: () => { refreshError.value = true },
        onFinish: () => { refreshing.value = false; cancelRefresh = null },
    })
}
onBeforeUnmount(() => cancelRefresh?.cancel())
</script>

<template>
    <Head title="Главная" />
    <AccountLayout page-title="Главная">
        <div class="grid min-w-0 grid-cols-1 gap-account-section">
            <PageHeading :title="heading" description="Всё важное о твоём доступе — здесь." />
            <StatePanel v-if="busy" state="loading" title="Проверяем данные подписки…" description="Это займёт несколько секунд." />
            <template v-else-if="serviceState === 'ready' && subscription && devicesSummary && !refreshError">
                <DashboardSubscription :subscription="subscription" />
                <DashboardConnection :url="subscription.url" />
                <DashboardDevices :summary="devicesSummary" />
                <div class="justify-self-start">
                    <BaseButton label="Обновить данные" size="sm" variant="ghost" @click="retry" />
                </div>
            </template>
            <StatePanel v-else state="serviceError" title="Не удалось загрузить данные." description="Попробуй обновить экран. Если проблема повторится, напиши в поддержку.">
                <template #actions>
                    <BaseButton label="Попробовать снова" :disabled="busy" @click="retry" />
                    <a href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center px-control text-interface-action font-semibold text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Написать в поддержку</a>
                </template>
            </StatePanel>
            <InlineAlert v-if="provision.errors.form" variant="error" :message="provision.errors.form" />
        </div>
    </AccountLayout>
</template>
