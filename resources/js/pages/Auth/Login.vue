<script setup>
import { useTemplateRef } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import { useActionForm } from '@/composables/useActionForm'
import { useInitialFormFocus } from '@/composables/useInitialFormFocus'
import AuthShell from '@/components/shells/AuthShell.vue'
import AuthStatus from '@/components/auth/AuthStatus.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

defineProps({ passwordChanged: { type: Boolean, default: false } })
const { form, submit: submitAction } = useActionForm({ email: '', password: '' })
useInitialFormFocus(useTemplateRef('authForm'))
function submit() {
    submitAction('post', '/login', { onFinish: () => form.reset('password') })
}
</script>

<template>
    <Head title="Вход" />
    <AuthShell :title="passwordChanged ? 'Пароль изменён' : 'С возвращением, Dude.'" :description="passwordChanged ? 'Теперь можно войти в аккаунт с новым паролем.' : 'Войди в аккаунт, чтобы управлять подпиской и подключениями.'" :variant="passwordChanged ? 'status' : 'login'">
        <template v-if="passwordChanged" #status><AuthStatus kind="password" /></template>
        <Link v-if="passwordChanged" href="/login" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus">Войти</Link>
        <form v-else ref="authForm" class="grid grid-cols-1 gap-auth-group" :aria-busy="form.processing" @submit.prevent="submit">
            <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
            <BaseField id="email" v-model="form.email" label="Email" name="email" type="email" autocomplete="email" placeholder="dude@example.com" variant="auth" icon="mail" :error="form.errors.email" :disabled="form.processing" required />
            <PasswordField id="password" v-model="form.password" :error="form.errors.password" :disabled="form.processing" />
            <BaseButton type="submit" label="Войти" loading-label="Входим…" :loading="form.processing" full-width />
            <nav class="flex flex-wrap justify-between gap-tight text-interface-body text-accent-text" aria-label="Доступ к аккаунту">
                <Link href="/forgot-password" class="py-compact font-bold no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus">Забыли пароль?</Link>
                <Link href="/register" class="py-compact font-bold no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus">Создать аккаунт</Link>
            </nav>
        </form>
    </AuthShell>
</template>
