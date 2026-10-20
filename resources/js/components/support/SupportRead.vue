<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import StatePanel from '@/components/ui/StatePanel.vue'
import { useSupportRead } from '@/composables/useSupportRead'
defineProps({ serviceState: { type: String, default: 'ready' } })
const { loading, failed, reload } = useSupportRead()
</script>

<template>
    <StatePanel v-if="loading" state="loading" title="Загружаем обращения…" description="Это займёт несколько секунд." />
    <StatePanel v-else-if="failed || serviceState === 'error'" state="serviceError" title="Не удалось загрузить поддержку." description="Попробуй обновить данные.">
        <template #actions><BaseButton label="Попробовать снова" @click="reload" /></template>
    </StatePanel>
    <div v-show="!loading && !failed && serviceState !== 'error'" class="contents"><slot /><BaseButton label="Обновить данные" variant="ghost" size="sm" class="justify-self-start" @click="reload" /></div>
</template>
