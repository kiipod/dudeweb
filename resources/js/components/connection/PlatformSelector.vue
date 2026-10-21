<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'

const model = defineModel({ type: String, default: 'windows' })
defineProps({ platforms: { type: Array, required: true } })
const icons = { windows: 'platform-windows', macos: 'platform-apple', linux: 'platform-linux', android: 'platform-android', ios: 'platform-apple' }
</script>

<template>
    <fieldset class="grid min-w-0 gap-connection-section">
        <legend class="mb-connection-section text-interface-body font-medium text-secondary">Устройство</legend>
        <div class="grid grid-cols-6 gap-compact tablet:grid-cols-5 tablet:gap-connection-section">
            <label v-for="(platform, index) in platforms" :key="platform.id" class="relative flex min-h-connection-platform min-w-0 cursor-pointer flex-col items-center justify-center gap-compact rounded-button border px-compact py-content text-center text-connection-platform font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus" :class="[index < 3 ? 'col-span-2' : 'col-span-3', 'tablet:col-span-1', model === platform.id ? 'border-accent bg-accent-soft text-accent-text' : 'border-border bg-surface text-secondary hover:border-accent']">
                <input v-model="model" :value="platform.id" type="radio" name="connection-platform" class="sr-only">
                <UiIcon :name="icons[platform.id]" size="connection" />
                <span class="min-w-0 wrap-anywhere">{{ platform.label }}</span>
            </label>
        </div>
    </fieldset>
</template>
