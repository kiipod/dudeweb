<script setup>
import { Head } from '@inertiajs/vue3'
import AccountLayout from '@/layouts/AccountLayout.vue'
import ProfileIdentity from '@/components/profile/ProfileIdentity.vue'
import ProfileSecurity from '@/components/profile/ProfileSecurity.vue'
import ProfileTheme from '@/components/profile/ProfileTheme.vue'
import ProfileLogout from '@/components/profile/ProfileLogout.vue'
defineProps({
    user: { type: Object, required: true },
    telegramConnection: { type: Object, required: true },
    securityCapabilities: { type: Object, required: true },
    themePreference: { type: Object, required: true },
})
</script>

<template>
    <Head title="Мой профиль" />
    <AccountLayout page-title="Профиль" content-spacing="profile">
        <div class="grid min-w-0 grid-cols-1 gap-profile-section">
            <h1 class="text-interface-heading font-display tracking-interface-heading wrap-anywhere">Мой профиль</h1>
            <ProfileIdentity :user="user" :telegram-connection="telegramConnection" :can-change-email="securityCapabilities.changeEmail" :password-available="securityCapabilities.password" />
            <ProfileSecurity :password-available="securityCapabilities.password" />
            <ProfileTheme />
            <ProfileLogout />
        </div>
    </AccountLayout>
</template>
