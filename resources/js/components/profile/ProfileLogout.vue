<script setup>
import { useActionForm } from '@/composables/useActionForm'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
const { form, submit: submitAction } = useActionForm({})
function logout() {
    if (form.processing) return
    submitAction('delete', '/logout', {
        onNetworkError: () => { form.setError('form', 'Проверь соединение и попробуй выйти ещё раз.'); return false },
        onHttpException: () => { form.setError('form', 'Не удалось выйти. Попробуй ещё раз.'); return false },
    })
}
</script>

<template>
    <form class="grid min-w-0 gap-profile-section" :aria-busy="form.processing" @submit.prevent="logout">
        <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
        <BaseButton type="submit" variant="danger" :loading="form.processing" loading-label="Выходим…" full-width><UiIcon name="logOut" size="sm" /><span>Выйти из аккаунта</span></BaseButton>
    </form>
</template>
