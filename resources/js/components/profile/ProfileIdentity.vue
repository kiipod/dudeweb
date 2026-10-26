<script setup>
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import ProfileTelegram from '@/components/profile/ProfileTelegram.vue'
import { useProfileForm } from '@/composables/useProfileForm'
import { useInitialFormFocus } from '@/composables/useInitialFormFocus'

const props = defineProps({
    user: { type: Object, required: true },
    telegramConnection: { type: Object, required: true },
    canChangeEmail: Boolean,
    passwordAvailable: Boolean,
    locked: Boolean,
})
const editing = shallowRef(false)
useInitialFormFocus(useTemplateRef('identityForm'), { preventScroll: false })
const { form, submit } = useProfileForm({
    username: props.user.username ?? '',
    email: props.user.email,
    current_password: '',
})
const emailChanged = computed(() => form.email.trim().toLowerCase() !== props.user.email)
watch(() => props.user, user => {
    form.defaults({ username: user.username ?? '', email: user.email, current_password: '' })
})
function save() {
    submit('patch', '/account/profile', {
        onSuccess: page => {
            if (page.props.user) {
                const user = page.props.user
                form.defaults({ username: user.username ?? '', email: user.email, current_password: '' })
            }
            form.reset()
            editing.value = false
        },
        onFinish: () => { form.reset('current_password') },
    })
}
function cancel() { form.reset(); form.clearErrors(); editing.value = false }
</script>

<template>
    <section aria-labelledby="profile-account-title" class="grid min-w-0 grid-cols-1 gap-profile-section rounded-profile-card border border-profile-border bg-profile-surface p-profile-card">
        <div class="flex flex-wrap items-center justify-between gap-compact">
            <h2 id="profile-account-title" class="text-interface-title font-display">Аккаунт</h2>
            <BaseButton v-if="!editing" label="Изменить данные" size="sm" variant="accent" :disabled="locked" @click="editing = true" />
        </div>
        <dl v-if="!editing" class="grid min-w-0 grid-cols-1 gap-profile-section text-interface-body">
            <div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Username</dt><dd class="min-w-0 wrap-anywhere">{{ user.username || 'Не задан' }}</dd></div>
            <div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Email</dt><dd class="min-w-0 wrap-anywhere">{{ user.email }}</dd></div>
            <div class="flex flex-wrap justify-between gap-compact"><dt class="text-secondary">Дата регистрации</dt><dd><time v-if="user.registeredAt" :datetime="user.registeredAt">{{ user.registeredLabel }}</time><span v-else>Не указана</span></dd></div>
        </dl>
        <form v-else ref="identityForm" class="grid min-w-0 grid-cols-1 gap-profile-section" :aria-busy="form.processing" @submit.prevent="save">
            <InlineAlert v-if="form.errors.form" variant="error" :message="form.errors.form" />
            <BaseField id="profile-username" v-model="form.username" label="Username" autocomplete="nickname" :maxlength="32" hint="От 3 до 32 символов: латинские буквы, цифры и знак подчёркивания." :error="form.errors.username" :disabled="locked || form.processing" />
            <BaseField id="profile-email" v-model="form.email" label="Email" type="email" autocomplete="email" :maxlength="255" :error="form.errors.email" :readonly="!canChangeEmail" :disabled="locked || form.processing" required />
            <p v-if="!canChangeEmail" class="text-interface-body text-secondary">{{ passwordAvailable ? 'Чтобы изменить email, сначала заверши настройку подключения в личном кабинете.' : 'Пароль для этого аккаунта не задан. Смена email недоступна.' }}</p>
            <template v-if="emailChanged">
                <p class="text-interface-body text-secondary">Подтверди новый адрес по ссылке из письма. Остальные сеансы будут завершены.</p>
                <BaseField id="profile-email-password" v-model="form.current_password" label="Текущий пароль для смены email" type="password" autocomplete="current-password" :error="form.errors.current_password" :disabled="locked || form.processing" required />
            </template>
            <div class="flex flex-wrap gap-compact"><BaseButton type="submit" label="Сохранить данные" loading-label="Сохраняем…" :loading="form.processing" :disabled="locked" /><BaseButton label="Отмена" variant="ghost" :disabled="locked || form.processing" @click="cancel" /></div>
        </form>
        <p v-if="form.recentlySuccessful" role="status" class="text-interface-body text-success">Данные сохранены</p>
        <ProfileTelegram :connection="telegramConnection" />
    </section>
</template>
