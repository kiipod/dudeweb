<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'

defineProps({ disabled: Boolean, loading: Boolean })
const emit = defineEmits(['click'])
</script>

<template>
    <button
        type="button"
        aria-label="Обновить данные"
        :aria-busy="loading"
        :disabled="disabled || loading"
        :title="loading ? 'Обновляем данные…' : 'Обновить данные'"
        class="inline-flex h-interface-header-control w-interface-header-control shrink-0 cursor-pointer items-center justify-center gap-compact rounded-control border border-accent-border bg-accent-soft font-sans text-interface-body font-semibold text-accent-text transition-colors duration-200 hover:border-accent-border-hover hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none tablet:w-auto tablet:px-content"
        @click="emit('click', $event)"
    >
        <UiIcon :name="loading ? 'loader' : 'refreshCw'" />
        <span class="hidden tablet:inline">{{ loading ? 'Обновляем данные…' : 'Обновить данные' }}</span>
    </button>
</template>
