<script setup>
import { Head } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import PageHeading from '@/components/ui/PageHeading.vue'
import ConnectionContent from '@/components/connection/ConnectionContent.vue'
defineProps({ subscriptionUrl: { type: String, default: null }, platforms: { type: Array, required: true }, devices: { type: Array, required: true }, deviceCount: { type: Number, default: null }, deviceLimit: { type: Number, default: null }, serviceState: { type: String, required: true }, deviceRemoved: Boolean })
</script>

<template>
    <Head title="Подключение" />
    <AccountLayout page-title="Подключение" content-spacing="connection">
        <div class="grid min-w-0 gap-connection-section">
            <PageHeading title="Подключиться проще, чем кажется." description="Выбери своё устройство — покажем, что делать дальше." />
            <ConnectionContent :subscription-url="subscriptionUrl" :platforms="platforms" :devices="devices" :device-count="deviceCount" :device-limit="deviceLimit" :service-state="serviceState" :device-removed="deviceRemoved" />
        </div>
    </AccountLayout>
</template>
