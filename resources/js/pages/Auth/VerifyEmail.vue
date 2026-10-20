<script setup>
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import { useActionForm } from '@/composables/useActionForm'
import AuthShell from '@/components/shells/AuthShell.vue'
import AuthStatus from '@/components/auth/AuthStatus.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

const props = defineProps({
    email: { type: String, required: true },
    existingAccount: Boolean,
    status: { type: String, default: null },
    errors: { type: Object, default: () => ({}) },
})

const { form: resend, submit: submitResend } = useActionForm({})
const { form: logout, submit: submitLogout } = useActionForm({})
const busy = computed(() => resend.processing || logout.processing)
const description = computed(() => props.existingAccount
    ? 'Подтверди новый адрес, чтобы продолжить пользоваться личным кабинетом. Если письма нет, проверь папку «Спам» или отправь его ещё раз.'
    : 'Открой ссылку в письме, чтобы получить бесплатный доступ к dudeweb. Если письма нет, проверь папку «Спам» или отправь его ещё раз.')
function sendVerification() {
    if (!busy.value) submitResend('post', '/email/verification-notification')
}
function leave() {
    if (!busy.value) submitLogout('delete', '/logout')
}
</script>

<template>
    <Head title="Подтверждение email" />
    <AuthShell title="Подтверди email" :description="description" variant="status">
        <template #status><AuthStatus kind="mail" /></template>
        <p class="text-center text-interface-body text-foreground wrap-anywhere">{{ email }}</p>
        <InlineAlert v-if="resend.errors.form || logout.errors.form || errors.form" variant="error" :message="resend.errors.form || logout.errors.form || errors.form" />
        <InlineAlert v-else-if="status === 'verification-link-sent'" variant="success" message="Письмо отправлено. Проверь почту." />
        <form class="grid grid-cols-1 gap-auth-group" :aria-busy="resend.processing" @submit.prevent="sendVerification">
            <BaseButton type="submit" label="Отправить письмо ещё раз" loading-label="Отправляем…" :loading="resend.processing" :disabled="busy" full-width />
        </form>
        <BaseButton variant="secondary" label="Выйти" loading-label="Выходим…" :loading="logout.processing" :disabled="busy" full-width @click="leave" />
        <a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-focus">Написать в поддержку</a>
    </AuthShell>
</template>
