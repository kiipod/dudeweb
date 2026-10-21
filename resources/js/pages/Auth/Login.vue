<script setup>
import { Head, Link } from '@inertiajs/vue3'
import { useActionForm } from '@/composables/useActionForm'
import AuthShell from '@/components/shells/AuthShell.vue'
import AuthStatus from '@/components/auth/AuthStatus.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

defineProps({ passwordChanged: { type: Boolean, default: false } })
const { form, submit: submitAction } = useActionForm({ email: '', password: '' })
function submit() {
    submitAction('post', '/login', { onFinish: () => form.reset('password') })
}
</script>

<template>
    <Head title="Вход" />
    <AuthShell :title="passwordChanged ? 'Пароль изменён' : 'С возвращением, Dude.'" :description="passwordChanged ? 'Теперь можно войти в аккаунт с новым паролем.' : 'Войди в аккаунт, чтобы управлять подпиской и подключениями.'" :variant="passwordChanged ? 'status' : 'login'">
        <template v-if="passwordChanged" #status><AuthStatus kind="password" /></template>
        <Link v-if="passwordChanged" href="/login" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus">Войти</Link>
        <form v-else class="grid grid-cols-1 gap-auth-group" :aria-busy="form.processing" @submit.prevent="submit">
            <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
            <BaseField id="email" v-model="form.email" label="Email" name="email" type="email" autocomplete="email" placeholder="dude@example.com" variant="auth" icon="mail" :error="form.errors.email" :disabled="form.processing" required />
            <PasswordField id="password" v-model="form.password" :error="form.errors.password" :disabled="form.processing" />
            <BaseButton type="submit" label="Войти" loading-label="Входим…" :loading="form.processing" full-width />
            <nav class="flex flex-wrap justify-between gap-tight text-interface-body font-normal text-accent-text" aria-label="Доступ к аккаунту">
                <Link href="/forgot-password" class="py-compact hover:underline focus-visible:outline-2 focus-visible:outline-focus">Забыли пароль?</Link>
                <Link href="/register" class="py-compact hover:underline focus-visible:outline-2 focus-visible:outline-focus">Создать аккаунт</Link>
            </nav>
        </form>
    </AuthShell>
</template>
