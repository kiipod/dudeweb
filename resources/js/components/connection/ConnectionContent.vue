<script setup>
import { computed, onMounted, shallowRef } from 'vue'
import { Link } from '@inertiajs/vue3'
import BaseButton from '@/components/ui/BaseButton.vue'
import CopyableLink from '@/components/ui/CopyableLink.vue'
import StatePanel from '@/components/ui/StatePanel.vue'
import PlatformSelector from '@/components/connection/PlatformSelector.vue'
import ConnectionSteps from '@/components/connection/ConnectionSteps.vue'
import ConnectionDevices from '@/components/connection/ConnectionDevices.vue'
import { maskedSubscriptionUrl } from '@/utils/dashboardPresentation'
import { detectConnectionPlatform } from '@/utils/connectionPlatform'
import { useConnection } from '@/composables/useConnection'

const props = defineProps({ subscriptionUrl: { type: String, default: null }, platforms: { type: Array, required: true }, devices: { type: Array, required: true }, deviceCount: { type: Number, default: null }, deviceLimit: { type: Number, default: null }, serviceState: { type: String, required: true }, deviceRemoved: Boolean })
const selectedId = shallowRef(props.platforms[0]?.id ?? 'windows')
const selected = computed(() => props.platforms.find(p => p.id === selectedId.value))
const { refreshing, refreshError, busy, remove, retry, revoke } = useConnection()

onMounted(() => {
    const detected = detectConnectionPlatform(navigator)
    if (props.platforms.some(platform => platform.id === detected)) selectedId.value = detected
})
</script>

<template>
    <div class="grid min-w-0 gap-connection-section">
        <PlatformSelector v-model="selectedId" :platforms="platforms" />
        <StatePanel v-if="refreshing" state="loading" title="Проверяем подключение…" description="Это займёт несколько секунд." />
        <template v-else-if="serviceState === 'ready' && !refreshError">
            <CopyableLink v-if="subscriptionUrl" :value="subscriptionUrl" :display-value="maskedSubscriptionUrl(subscriptionUrl)" />
            <p v-else role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Ссылка подключения сейчас недоступна. Обнови данные или напиши в поддержку.</p>
            <ConnectionSteps v-if="selected" :key="selected.id" :platform="selected" />
            <Link href="/account/support" class="inline-flex min-h-interface-control items-center justify-self-start rounded-control text-interface-body font-semibold text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Нужна помощь</Link>
            <ConnectionDevices :devices="devices" :count="deviceCount ?? 0" :limit="deviceLimit" :busy="busy" :pending-token="remove.device" :error="remove.errors.device" :removed="deviceRemoved" @remove="revoke" />
            <div class="justify-self-start"><BaseButton label="Обновить данные" :disabled="busy" size="sm" variant="ghost" @click="retry" /></div>
        </template>
        <StatePanel v-else state="serviceError" title="Не удалось загрузить подключение." description="Обнови данные. Если ошибка повторится, напиши в поддержку.">
            <template #actions><BaseButton label="Попробовать снова" :disabled="busy" @click="retry" /><Link href="/account/support" class="inline-flex min-h-interface-control items-center text-interface-body text-accent-text focus-visible:outline-2 focus-visible:outline-focus">Нужна помощь</Link></template>
        </StatePanel>
    </div>
</template>
