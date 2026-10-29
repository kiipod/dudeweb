<script setup>
import { useId } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useCopyableLink } from '@/composables/useCopyableLink'

const props = defineProps({
    copyLabel: {
        type: String,
        default: 'Скопировать ссылку',
    },
    value: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        default: 'subscription',
        validator: value => ['subscription', 'referral'].includes(value),
    },
})

const ROW_CLASSES = {
    subscription: 'gap-interface-copy-gap rounded-button border-interface-field-border bg-interface-copy',
    referral: 'gap-compact rounded-control border-interface-field-border bg-interface-input',
}

const emit = defineEmits(['copy-error', 'copied'])

const manualId = useId()
const { status, manual, busy, feedback, copy } = useCopyableLink(() => props.value)

async function copyValue() {
    if (busy.value || !props.value) return
    const attemptedValue = props.value
    const copied = await copy()
    if (props.value === attemptedValue) emit(copied ? 'copied' : 'copy-error')
}
</script>

<template>
    <div class="grid min-w-0 grid-cols-1 gap-compact">
    <div :class="ROW_CLASSES[variant]" class="flex min-h-interface-copy-row min-w-0 items-center border pr-compact pl-interface-inline">
        <input
            :value="value"
            :aria-label="variant === 'referral' ? 'Ссылка приглашения' : 'Ссылка подключения'"
            readonly
            spellcheck="false"
            class="min-h-interface-control min-w-0 flex-1 bg-transparent font-mono text-interface-body text-secondary outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
            @focus="$event.target.select()"
            @click="$event.target.select()"
        >

        <BaseButton
            :aria-label="status === 'copied' ? 'Ссылка скопирована' : copyLabel"
            :disabled="!value || busy"
            :loading="busy"
            loading-label=""
            size="copy"
            @click="copyValue"
        >
            <UiIcon :name="status === 'copied' ? 'check' : 'copy'" size="copy" />
        </BaseButton>

    </div>
    <p v-if="feedback" role="status" class="text-interface-body" :class="status === 'error' ? 'text-error' : 'text-success'">{{ feedback }}</p>
    <div v-if="manual" class="grid min-w-0 gap-interface-field-gap">
        <label :for="manualId" class="text-interface-body text-secondary">Ссылка для ручного копирования</label>
        <input :id="manualId" :value="value" readonly class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline font-mono text-interface-body outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus" @focus="$event.target.select()" @click="$event.target.select()">
    </div>
    </div>
</template>
