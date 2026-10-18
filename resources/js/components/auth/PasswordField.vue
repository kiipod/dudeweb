<script setup>
import { shallowRef } from 'vue'
import BaseField from '@/components/ui/BaseField.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const model = defineModel({ type: String, default: '' })
defineProps({
    id: { type: String, required: true },
    label: { type: String, default: 'Пароль' },
    autocomplete: { type: String, default: 'current-password' },
    placeholder: { type: String, default: 'Введите пароль' },
    error: { type: String, default: '' },
    spacing: { type: String, default: 'field', validator: value => ['field', 'reset'].includes(value) },
    disabled: Boolean,
})
const visible = shallowRef(false)
</script>

<template>
    <BaseField :id="id" v-model="model" :name="id" :label="label" :autocomplete="autocomplete" :placeholder="placeholder" :error="error" :disabled="disabled" :type="visible ? 'text' : 'password'" :spacing="spacing" variant="auth" icon="lock" required>
        <template #suffix>
            <button type="button" :aria-label="visible ? 'Скрыть пароль' : 'Показать пароль'" :aria-controls="id" :aria-pressed="visible" :disabled="disabled" class="inline-flex size-11 items-center justify-center rounded-control-sm focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-60" @click="visible = !visible">
                <UiIcon :name="visible ? 'eyeOff' : 'eye'" />
            </button>
        </template>
    </BaseField>
</template>
