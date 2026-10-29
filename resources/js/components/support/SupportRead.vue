<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatePanel from '@/components/ui/StatePanel.vue'
import { useSupportRead } from '@/composables/useSupportRead'
const props = defineProps({ serviceState: { type: String, default: 'ready' } })
const { loading, failed, reload } = useSupportRead()
const visible = computed(() => !loading.value && !failed.value && props.serviceState !== 'error')
</script>

<template>
    <slot name="heading" :loading="loading" :reload="reload" />
    <StatePanel v-if="loading" state="loading" title="Загружаем обращения…" description="Это займёт несколько секунд." />
    <StatePanel v-else-if="failed || serviceState === 'error'" state="serviceError" title="Не удалось загрузить поддержку." description="Попробуй обновить данные.">
        <template #actions><BaseButton label="Попробовать снова" @click="reload" /></template>
    </StatePanel>
    <div v-show="visible" class="contents"><slot :visible="visible" /></div>
</template>
