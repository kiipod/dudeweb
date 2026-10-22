<script setup>
import { computed, shallowRef, useId } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CopyableLink from '@/components/ui/CopyableLink.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useInviteShare } from '@/composables/useInviteShare'

const props = defineProps({ webInviteUrl: { type: String, default: null }, telegramInviteUrl: { type: String, default: null } })
const channel = shallowRef('web')
const selectedUrl = computed(() => channel.value === 'telegram' ? props.telegramInviteUrl : props.webInviteUrl)
const channels = computed(() => [
    { value: 'web', label: 'На сайт', disabled: !props.webInviteUrl },
    { value: 'telegram', label: 'В Telegram', disabled: !props.telegramInviteUrl },
])
const { busy, feedback, manual, share } = useInviteShare(selectedUrl)
const id = useId()
</script>

<template>
    <section aria-labelledby="referral-link-title" class="grid min-w-0 grid-cols-1 gap-account-connection-gap rounded-panel border border-account-card-border bg-surface p-account-connection">
        <h2 id="referral-link-title" class="text-interface-title font-display">Твоя ссылка для друзей</h2>
        <template v-if="webInviteUrl || telegramInviteUrl">
            <label :id="`${id}-label`" :for="id" class="text-interface-body text-secondary">Куда приглашаем</label>
            <BaseSelect :id="id" v-model="channel" :aria-labelledby="`${id}-label`" :disabled="busy" :options="channels" />
            <CopyableLink v-if="selectedUrl" :key="selectedUrl" :value="selectedUrl" variant="referral" copy-label="Скопировать приглашение" />
            <BaseButton label="Поделиться" variant="accent" :disabled="!selectedUrl" :loading="busy" loading-label="Подготавливаем…" full-width @click="share"><UiIcon name="share" size="referralShare" /><span>Поделиться</span></BaseButton>
            <p v-if="feedback" role="status" class="text-interface-body text-secondary">{{ feedback }}</p>
            <div v-if="manual" class="grid min-w-0 gap-interface-field-gap">
                <label :for="`${id}-manual`" class="text-interface-body text-secondary">Приглашение для ручного копирования</label>
                <input :id="`${id}-manual`" :value="selectedUrl" readonly class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline font-mono text-interface-body outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus" @focus="$event.target.select()" @click="$event.target.select()">
            </div>
            <p v-if="!telegramInviteUrl" class="text-interface-body text-secondary">Приглашение в Telegram сейчас недоступно. Можно пригласить друга на сайт.</p>
        </template>
        <p v-else role="status" class="text-interface-body text-secondary">Ссылки приглашения пока недоступны. Дождись подключения аккаунта и обнови страницу.</p>
    </section>
</template>
