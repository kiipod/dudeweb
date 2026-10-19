<script setup>
import { computed } from 'vue'
import { Head, useForm } from '@inertiajs/vue3'
import AuthShell from '@/components/shells/AuthShell.vue'
import AuthStatus from '@/components/auth/AuthStatus.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

defineProps({
    email: { type: String, required: true },
    status: { type: String, default: null },
    errors: { type: Object, default: () => ({}) },
})

const resend = useForm({})
const logout = useForm({})
const busy = computed(() => resend.processing || logout.processing)
</script>

<template>
    <Head title="Подтверждение email" />
    <AuthShell title="Подтверди email" description="Открой ссылку в письме, чтобы получить бесплатный доступ к dudeweb. Если письма нет, проверь папку «Спам» или отправь его ещё раз." variant="status">
        <template #status><AuthStatus kind="mail" /></template>
        <p class="text-center text-interface-body text-foreground wrap-anywhere">{{ email }}</p>
        <InlineAlert v-if="errors.form" variant="error" :message="errors.form" />
        <InlineAlert v-else-if="status === 'verification-link-sent'" variant="success" message="Письмо отправлено. Проверь почту." />
        <form class="grid grid-cols-1 gap-auth-group" :aria-busy="resend.processing" @submit.prevent="resend.post('/email/verification-notification', { preserveScroll: true })">
            <BaseButton type="submit" label="Отправить письмо ещё раз" loading-label="Отправляем…" :loading="resend.processing" :disabled="busy" full-width />
        </form>
        <BaseButton variant="secondary" label="Выйти" loading-label="Выходим…" :loading="logout.processing" :disabled="busy" full-width @click="logout.delete('/logout')" />
        <a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-semibold text-accent focus-visible:outline-2 focus-visible:outline-focus">Написать в поддержку</a>
    </AuthShell>
</template>
