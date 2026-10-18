<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import AuthShell from '@/components/shells/AuthShell.vue'
import AuthStatus from '@/components/auth/AuthStatus.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

defineProps({ linkRequested: { type: Boolean, default: false } })
const form = useForm({ email: '' })
function submit() {
    form.post('/forgot-password')
}
</script>

<template>
    <Head title="Восстановление доступа" />
    <AuthShell :title="linkRequested ? 'Проверь почту' : 'Восстановим доступ'" :description="linkRequested ? 'Запрос принят. Если email связан с аккаунтом, проверь почту и папку «Спам». Если письма нет, попробуй позже или напиши в поддержку.' : 'Укажи email — отправим ссылку для смены пароля.'" :variant="linkRequested ? 'status' : 'recovery'">
        <template v-if="linkRequested" #status><AuthStatus kind="mail" /></template>
        <form v-if="!linkRequested" class="grid grid-cols-1 gap-auth-group" :aria-busy="form.processing" @submit.prevent="submit">
            <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
            <BaseField id="email" v-model="form.email" label="Email" name="email" type="email" autocomplete="email" placeholder="dude@example.com" variant="auth" icon="mail" :error="form.errors.email" :disabled="form.processing" required />
            <BaseButton type="submit" label="Отправить ссылку" loading-label="Отправляем…" :loading="form.processing" full-width />
        </form>
        <a v-if="linkRequested || form.errors.form" href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-semibold text-accent focus-visible:outline-2 focus-visible:outline-focus">Написать в поддержку</a>
        <Link href="/login" class="py-compact text-interface-body font-semibold text-accent focus-visible:outline-2 focus-visible:outline-focus">Вернуться ко входу</Link>
    </AuthShell>
</template>
