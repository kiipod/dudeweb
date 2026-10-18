<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import AuthShell from '@/components/shells/AuthShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'

defineProps({ email: { type: String, default: null }, provisioningState: { type: String, default: null } })
const retry = useForm({})
const logout = useForm({})
</script>

<template>
    <Head title="Аккаунт" />
    <AuthShell title="Твой аккаунт" :description="email ?? ''">
        <template v-if="provisioningState === 'service_error' || provisioningState === 'pending'">
            <InlineAlert variant="error" message="Аккаунт сохранён. Не удалось подготовить подключение — попробуй ещё раз." />
            <InlineAlert v-if="retry.errors.form" variant="error" :message="retry.errors.form" />
            <BaseButton label="Попробовать ещё раз" :loading="retry.processing" @click="retry.post('/account/provisioning')" />
        </template>
        <InlineAlert v-else-if="provisioningState === 'ready'" variant="success" message="Аккаунт создан. Ты вошёл в dudeweb." />
        <a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-semibold text-accent focus-visible:outline-2 focus-visible:outline-focus">Написать в поддержку</a>
        <Link href="/" class="py-compact text-interface-body font-semibold text-accent focus-visible:outline-2 focus-visible:outline-focus">На главную</Link>
        <BaseButton variant="secondary" label="Выйти" :loading="logout.processing" @click="logout.delete('/logout')" />
    </AuthShell>
</template>
