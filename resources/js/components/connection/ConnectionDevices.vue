<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
defineProps({ devices: { type: Array, required: true }, count: { type: Number, required: true }, limit: { type: Number, default: null }, busy: Boolean, pendingToken: { type: String, default: '' }, error: { type: String, default: '' }, removed: Boolean })
const emit = defineEmits(['remove'])
</script>

<template>
    <section aria-labelledby="connection-devices-title" class="grid min-w-0 gap-connection-section">
        <h2 id="connection-devices-title" class="text-interface-title font-display">Твои устройства</h2>
        <p class="text-interface-body text-secondary">Подключено: {{ count }}<template v-if="limit !== null"> из {{ limit }}</template></p>
        <p v-if="removed" role="status" class="text-interface-body text-success">Устройство отключено.</p>
        <p v-if="error" role="alert" class="text-interface-body text-error">{{ error }}</p>
        <p v-if="!devices.length" class="text-interface-body text-secondary">Подключённых устройств пока нет.</p>
        <ul v-else class="grid min-w-0 gap-compact">
            <li v-for="device in devices" :key="device.token" class="flex min-w-0 flex-wrap items-center justify-between gap-content rounded-button border border-border bg-surface p-connection-step">
                <span class="grid min-w-0 gap-control wrap-anywhere"><span class="text-interface-body font-medium">{{ device.name }}</span><span class="text-interface-body text-secondary">{{ [device.platform, device.osVersion].filter(Boolean).join(' · ') }}</span></span>
                <BaseButton :aria-label="`Отключить ${device.name}`" :disabled="busy" :loading="busy && pendingToken === device.token" loading-label="Отключаем" size="sm" variant="danger" @click="emit('remove', device.token)">Отключить</BaseButton>
            </li>
        </ul>
    </section>
</template>
