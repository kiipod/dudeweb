<script setup>
import { shallowRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useProfileForm } from '@/composables/useProfileForm'

defineProps({ passwordAvailable: Boolean })
const active = shallowRef(null)
const password = useProfileForm({ current_password: '', password: '', password_confirmation: '' })
const sessions = useProfileForm({ current_password: '' })
function changePassword() {
    password.submit('put', '/account/profile/password', {
        onFinish: () => { password.form.defaults({ current_password: '', password: '', password_confirmation: '' }); password.form.reset() },
    })
}
function endSessions() {
    sessions.submit('delete', '/account/profile/sessions', {
        onFinish: () => { sessions.form.defaults({ current_password: '' }); sessions.form.reset() },
    })
}
function toggle(name) {
    if (password.form.processing || sessions.form.processing) return
    active.value = active.value === name ? null : name
    password.form.reset(); password.form.clearErrors()
    sessions.form.reset(); sessions.form.clearErrors()
}
const rowClass = 'flex min-h-interface-control w-full min-w-0 items-center gap-tight rounded-button border border-border bg-interface-input px-interface-inline py-compact text-left text-interface-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60'
</script>

<template>
    <section aria-labelledby="profile-security-title" class="grid min-w-0 grid-cols-1 gap-profile-section">
        <h2 id="profile-security-title" class="text-interface-title font-display">Безопасность</h2>
        <p v-if="!passwordAvailable" class="text-interface-body text-secondary">Пароль для этого аккаунта не задан. Смена пароля и завершение других web-сеансов недоступны.</p>
        <template v-else>
            <button type="button" :class="rowClass" :aria-expanded="active === 'password'" aria-controls="profile-password-form" :disabled="sessions.form.processing" @click="toggle('password')"><UiIcon name="keyRound" size="sm" class="shrink-0 text-accent" /><span class="min-w-0 flex-1 wrap-anywhere">Изменить пароль</span><UiIcon name="chevronRight" size="sm" class="shrink-0 text-muted" /></button>
            <form v-if="active === 'password'" id="profile-password-form" class="grid min-w-0 grid-cols-1 gap-profile-section" :aria-busy="password.form.processing" @submit.prevent="changePassword">
                <InlineAlert v-if="password.form.errors.form" variant="error" :message="password.form.errors.form" />
                <BaseField id="profile-current-password" v-model="password.form.current_password" type="password" label="Текущий пароль" autocomplete="current-password" :disabled="password.form.processing" :error="password.form.errors.current_password" required />
                <BaseField id="profile-new-password" v-model="password.form.password" type="password" label="Новый пароль" autocomplete="new-password" :disabled="password.form.processing" :error="password.form.errors.password" required />
                <BaseField id="profile-password-confirmation" v-model="password.form.password_confirmation" type="password" label="Повтори новый пароль" autocomplete="new-password" :disabled="password.form.processing" :error="password.form.errors.password_confirmation" required />
                <p class="text-interface-body text-secondary">После смены пароля другие сеансы будут завершены. Этот сеанс останется открытым.</p>
                <BaseButton type="submit" label="Сохранить пароль" loading-label="Сохраняем…" :loading="password.form.processing" full-width />
                <p v-if="password.form.recentlySuccessful" role="status" class="text-interface-body text-success">Пароль изменён. Другие сеансы завершены.</p>
            </form>
            <button type="button" :class="rowClass" :aria-expanded="active === 'sessions'" aria-controls="profile-sessions-form" :disabled="password.form.processing" @click="toggle('sessions')"><UiIcon name="logOut" size="sm" class="shrink-0 text-error" /><span class="min-w-0 flex-1 wrap-anywhere">Завершить другие сеансы</span><UiIcon name="chevronRight" size="sm" class="shrink-0 text-muted" /></button>
            <form v-if="active === 'sessions'" id="profile-sessions-form" class="grid min-w-0 grid-cols-1 gap-profile-section" :aria-busy="sessions.form.processing" @submit.prevent="endSessions">
                <InlineAlert v-if="sessions.form.errors.form" variant="error" :message="sessions.form.errors.form" />
                <BaseField id="profile-sessions-password" v-model="sessions.form.current_password" label="Текущий пароль для завершения сеансов" type="password" autocomplete="current-password" :disabled="sessions.form.processing" :error="sessions.form.errors.current_password" required />
                <BaseButton type="submit" label="Подтвердить завершение сеансов" loading-label="Завершаем…" :loading="sessions.form.processing" full-width />
                <p v-if="sessions.form.recentlySuccessful" role="status" class="text-interface-body text-success">Другие сеансы завершены. Этот сеанс остаётся открытым.</p>
            </form>
        </template>
    </section>
</template>
