<script setup>
import { shallowRef, useTemplateRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useProfileForm } from '@/composables/useProfileForm'
import { useInitialFormFocus } from '@/composables/useInitialFormFocus'

const props = defineProps({ passwordAvailable: Boolean, disabled: Boolean })
const active = shallowRef(null)
const password = useProfileForm({ current_password: '', password: '', password_confirmation: '' })
const sessions = useProfileForm({})
useInitialFormFocus(useTemplateRef('passwordForm'), { preventScroll: false })
function changePassword() {
    password.submit('put', '/account/profile/password', {
        onFinish: () => { password.form.defaults({ current_password: '', password: '', password_confirmation: '' }); password.form.reset() },
    })
}
function endSessions() {
    if (props.disabled || password.form.processing || sessions.form.processing) return
    active.value = null
    password.form.reset(); password.form.clearErrors()
    sessions.submit('delete', '/account/profile/sessions')
}
function toggle(name) {
    if (password.form.processing || sessions.form.processing) return
    active.value = active.value === name ? null : name
    password.form.reset(); password.form.clearErrors()
    sessions.form.reset(); sessions.form.clearErrors()
}
const rowClass = 'flex min-h-interface-control w-full min-w-0 cursor-pointer items-center gap-tight rounded-button border border-border bg-interface-input px-interface-inline py-compact text-left text-interface-body font-medium outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60'
</script>

<template>
    <section aria-labelledby="profile-security-title" class="grid min-w-0 grid-cols-1 gap-account-group">
        <h2 id="profile-security-title" class="text-interface-title font-display">Безопасность</h2>
        <p v-if="!passwordAvailable" class="text-interface-body text-secondary">Пароль для этого аккаунта не задан. Смена пароля недоступна.</p>
        <template v-else>
            <button type="button" :class="rowClass" :aria-expanded="active === 'password'" aria-controls="profile-password-form" :disabled="disabled || sessions.form.processing" @click="toggle('password')"><UiIcon name="keyRound" size="profileAction" class="shrink-0 text-accent-text" /><span class="min-w-0 flex-1 wrap-anywhere">Изменить пароль</span><UiIcon name="chevronRight" size="profileAction" class="shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none" :class="{ 'rotate-90': active === 'password' }" /></button>
            <form v-if="active === 'password'" id="profile-password-form" ref="passwordForm" class="grid min-w-0 grid-cols-1 gap-profile-section" :aria-busy="password.form.processing" @submit.prevent="changePassword">
                <InlineAlert v-if="password.form.errors.form" variant="error" :message="password.form.errors.form" />
                <BaseField id="profile-current-password" v-model="password.form.current_password" type="password" label="Текущий пароль" autocomplete="current-password" :disabled="disabled || password.form.processing" :error="password.form.errors.current_password" required />
                <BaseField id="profile-new-password" v-model="password.form.password" type="password" label="Новый пароль" autocomplete="new-password" :disabled="disabled || password.form.processing" :error="password.form.errors.password" required />
                <BaseField id="profile-password-confirmation" v-model="password.form.password_confirmation" type="password" label="Повтори новый пароль" autocomplete="new-password" :disabled="disabled || password.form.processing" :error="password.form.errors.password_confirmation" required />
                <p class="text-interface-body text-secondary">После смены пароля другие сеансы будут завершены. Этот сеанс останется открытым.</p>
                <BaseButton type="submit" label="Сохранить пароль" loading-label="Сохраняем…" :loading="password.form.processing" :disabled="disabled" full-width />
                <p v-if="password.form.recentlySuccessful" role="status" class="text-interface-body text-success">Пароль изменён. Другие сеансы завершены.</p>
            </form>
        </template>
        <button type="button" :class="rowClass" :aria-busy="sessions.form.processing" :disabled="disabled || password.form.processing || sessions.form.processing" @click="endSessions"><UiIcon :name="sessions.form.processing ? 'loader' : 'logOut'" size="profileAction" class="shrink-0 text-error" /><span class="min-w-0 flex-1 wrap-anywhere">Завершить другие сеансы</span></button>
        <InlineAlert v-if="sessions.form.errors.form" variant="error" :message="sessions.form.errors.form" />
        <p v-if="sessions.form.recentlySuccessful" role="status" class="text-interface-body text-success">Другие сеансы завершены. Этот сеанс остаётся открытым.</p>
    </section>
</template>
