<script setup>
import { Head, Link } from '@inertiajs/vue3'
import { useActionForm } from '@/composables/useActionForm'
import AuthShell from '@/components/shells/AuthShell.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

const { form, submit: submitAction } = useActionForm({ email: '', password: '', password_confirmation: '' })
function submit() {
    submitAction('post', '/register', { onFinish: () => form.reset('password', 'password_confirmation') })
}
</script>

<template>
    <Head title="Регистрация" />
    <AuthShell title="Привет, Dude!" description="Создай аккаунт и подтверди email, чтобы получить бесплатный доступ." variant="register">
        <form class="grid grid-cols-1 gap-auth-register-group" :aria-busy="form.processing" @submit.prevent="submit">
            <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
            <BaseField id="email" v-model="form.email" label="Email" name="email" type="email" autocomplete="email" placeholder="dude@example.com" variant="auth" icon="mail" :error="form.errors.email" :disabled="form.processing" required />
            <PasswordField id="password" v-model="form.password" autocomplete="new-password" placeholder="Не менее 8 символов" :error="form.errors.password" :disabled="form.processing" />
            <PasswordField id="password_confirmation" v-model="form.password_confirmation" label="Повторите пароль" autocomplete="new-password" placeholder="Введите пароль ещё раз" :error="form.errors.password_confirmation" :disabled="form.processing" />
            <BaseButton type="submit" label="Создать аккаунт" loading-label="Создаём аккаунт…" :loading="form.processing" full-width />
            <Link href="/login" class="py-compact text-interface-body font-normal text-accent hover:underline focus-visible:outline-2 focus-visible:outline-focus">Уже есть аккаунт? Войти</Link>
        </form>
    </AuthShell>
</template>
