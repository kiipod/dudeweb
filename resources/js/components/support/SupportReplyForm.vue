<script setup>
import { useForm } from '@inertiajs/vue3'
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
const props = defineProps({ replyUrl: { type: String, required: true }, submissionId: { type: String, required: true }, bodyMax: { type: Number, required: true } })
const form = useForm({ body: '', submission_id: props.submissionId })
function submit() {
    if (form.processing) return
    form.post(props.replyUrl, {
        preserveScroll: true,
        onSuccess: () => { form.reset('body'); form.submission_id = crypto.randomUUID() },
        onNetworkError: () => { form.setError('form', 'Проверь соединение и попробуй отправить ответ ещё раз.'); return false },
        onHttpException: () => { form.setError('form', 'Не удалось отправить ответ. Попробуй ещё раз.'); return false },
    })
}
</script>

<template>
    <form id="support-reply" class="grid min-w-0 grid-cols-1 gap-compact" :aria-busy="form.processing" @submit.prevent="submit">
        <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
        <label for="support-reply-body" class="sr-only">Ответить в обращении</label>
        <div class="flex min-h-interface-copy-row min-w-0 items-center gap-compact rounded-button border border-border bg-interface-input py-control pr-compact pl-interface-inline">
            <textarea id="support-reply-body" v-model="form.body" rows="1" :maxlength="bodyMax" :disabled="form.processing" :aria-invalid="Boolean(form.errors.body)" :aria-describedby="form.errors.body ? 'support-reply-error' : undefined" placeholder="Ответить…" required class="min-h-12 min-w-0 flex-1 resize-y rounded-control bg-transparent py-control text-interface-body placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" />
            <BaseButton type="submit" size="copy" :loading="form.processing" loading-label="" aria-label="Отправить ответ"><UiIcon name="send" size="sm" /></BaseButton>
        </div>
        <p v-if="form.errors.body" id="support-reply-error" role="alert" class="text-interface-body text-error">{{ form.errors.body }}</p>
        <p v-if="form.recentlySuccessful" role="status" class="text-interface-body text-success">Сообщение отправлено</p>
    </form>
</template>
