<script setup>
import { Head, Link } from '@inertiajs/vue3'
import { useActionForm } from '@/composables/useActionForm'
import AuthShell from '@/components/shells/AuthShell.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

const props = defineProps({ token: { type: String, required: true }, email: { type: String, default: '' } })
const { form, submit: submitAction } = useActionForm({ token: props.token, email: props.email, password: '', password_confirmation: '' })
function submit() {
    submitAction('post', '/reset-password', { onFinish: () => form.reset('password', 'password_confirmation') })
}
</script>

<template>
    <Head title="Новый пароль" />
    <AuthShell title="Новый пароль" description="Придумай новый пароль — не менее 8 символов." variant="reset">
        <form class="grid grid-cols-1 gap-auth-reset-group" :aria-busy="form.processing" @submit.prevent="submit">
            <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
            <BaseField v-if="!props.email" id="email" v-model="form.email" label="Email" name="email" type="email" autocomplete="email" variant="auth" icon="mail" :error="form.errors.email" :disabled="form.processing" required />
            <InlineAlert v-else-if="form.errors.email" variant="error" :message="form.errors.email" />
            <InlineAlert v-if="form.errors.token" variant="error" :message="form.errors.token" />
            <PasswordField id="password" v-model="form.password" label="Новый пароль" autocomplete="new-password" spacing="reset" :error="form.errors.password" :disabled="form.processing" />
            <PasswordField id="password_confirmation" v-model="form.password_confirmation" label="Повторите пароль" autocomplete="new-password" spacing="reset" :error="form.errors.password_confirmation" :disabled="form.processing" />
            <BaseButton type="submit" label="Сохранить пароль" loading-label="Сохраняем…" :loading="form.processing" full-width />
            <Link v-if="form.errors.email || form.errors.token" href="/forgot-password" class="py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus">Запросить новую ссылку</Link>
        </form>
    </AuthShell>
</template>
