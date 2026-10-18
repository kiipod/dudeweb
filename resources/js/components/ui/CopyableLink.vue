<script setup>
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const props = defineProps({
    copyLabel: {
        type: String,
        default: 'Скопировать ссылку',
    },
    value: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['copy-error', 'copied'])

const status = shallowRef('idle')
let resetTimer

const feedback = computed(() => {
    if (status.value === 'copied') {
        return 'Ссылка скопирована'
    }

    if (status.value === 'error') {
        return 'Не удалось скопировать ссылку'
    }

    return ''
})

async function copyValue() {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.value)
        } else {
            copyWithFallback(props.value)
        }

        setStatus('copied')
        emit('copied', props.value)
    } catch (error) {
        setStatus('error')
        emit('copy-error', error)
    }
}

function copyWithFallback(value) {
    const textarea = document.createElement('textarea')

    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()

    if (!document.execCommand('copy')) {
        textarea.remove()
        throw new Error('Clipboard copy is unavailable')
    }

    textarea.remove()
}

function setStatus(nextStatus) {
    status.value = nextStatus
    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => {
        status.value = 'idle'
    }, 2500)
}

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.clearTimeout(resetTimer)
    }
})
</script>

<template>
    <div class="flex min-h-interface-copy-row items-center gap-tight rounded-button border border-border bg-surface py-control pr-compact pl-interface-inline">
        <span class="min-w-0 flex-1 truncate font-mono text-interface-body text-secondary">
            {{ value }}
        </span>

        <BaseButton
            :aria-label="status === 'copied' ? 'Ссылка скопирована' : copyLabel"
            :disabled="!value"
            size="copy"
            @click="copyValue"
        >
            <UiIcon :name="status === 'copied' ? 'check' : 'copy'" size="sm" />
        </BaseButton>

        <span class="sr-only" aria-live="polite">{{ feedback }}</span>
    </div>
</template>
