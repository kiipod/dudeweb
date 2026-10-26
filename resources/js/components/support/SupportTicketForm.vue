<script setup>
import { useTemplateRef } from 'vue'
import { useActionForm } from '@/composables/useActionForm'
import { useInitialFormFocus } from '@/composables/useInitialFormFocus'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
const props = defineProps({ submissionId: { type: String, required: true }, subjectMax: { type: Number, required: true }, bodyMax: { type: Number, required: true } })
const { form, submit: submitAction } = useActionForm({ subject: '', body: '', submission_id: props.submissionId })
useInitialFormFocus(useTemplateRef('ticketForm'), { preventScroll: false })
function submit() {
    if (form.processing) return
    submitAction('post', '/account/support', {
        onNetworkError: () => { form.setError('form', 'Проверь соединение и попробуй отправить обращение ещё раз.'); return false },
        onHttpException: () => { form.setError('form', 'Не удалось создать обращение. Попробуй ещё раз.'); return false },
    })
}
</script>

<template>
    <form ref="ticketForm" class="grid min-w-0 grid-cols-1 gap-account-group" :aria-busy="form.processing" @submit.prevent="submit">
        <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
        <BaseField id="support-subject" v-model="form.subject" label="Тема обращения" placeholder="Кратко опиши вопрос" :maxlength="subjectMax" :disabled="form.processing" :error="form.errors.subject" required />
        <div class="grid min-w-0 grid-cols-1 gap-interface-field-gap">
            <label for="support-body" class="text-interface-body font-medium text-secondary">Сообщение</label>
            <textarea id="support-body" v-model="form.body" :maxlength="bodyMax" :disabled="form.processing" :aria-invalid="Boolean(form.errors.body)" :aria-describedby="form.errors.body ? 'support-body-error' : undefined" placeholder="Расскажи подробнее, что произошло…" required class="min-h-support-message min-w-0 w-full resize-y rounded-button border border-interface-field-border bg-interface-input p-interface-inline text-interface-body placeholder:text-muted outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:opacity-60" />
            <p v-if="form.errors.body" id="support-body-error" role="alert" class="text-interface-body text-error">{{ form.errors.body }}</p>
        </div>
        <BaseButton type="submit" label="Отправить обращение" loading-label="Отправляем…" :loading="form.processing" full-width />
    </form>
</template>
