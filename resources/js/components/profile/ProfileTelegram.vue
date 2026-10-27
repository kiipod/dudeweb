<script setup>
import { computed, shallowRef } from 'vue'
import { router } from '@inertiajs/vue3'
import { useEventListener } from '@vueuse/core'
import BaseButton from '@/components/ui/BaseButton.vue'
import InlineAlert from '@/components/ui/InlineAlert.vue'
import { useActionForm } from '@/composables/useActionForm'

const props = defineProps({ connection: { type: Object, required: true } })
const { form, submit } = useActionForm({ link_id: null })
const refreshing = shallowRef(false)
const link = computed(() => props.connection.link)
const pending = computed(() => ['pending', 'awaiting_telegram'].includes(link.value?.state))
const applying = computed(() => ['applying', 'remote_applied', 'local_applied'].includes(link.value?.state))
const ready = computed(() => link.value?.state === 'ready')
const busy = computed(() => form.processing || refreshing.value)
const error = computed(() => form.errors.telegram || form.errors.form)

function start() { submit('post', '/account/profile/telegram') }
function confirm() {
    form.link_id = link.value.id
    submit('post', '/account/profile/telegram/confirm')
}
function cancel() {
    form.link_id = link.value.id
    submit('delete', '/account/profile/telegram')
}
function refresh() {
    if (busy.value || (!pending.value && !ready.value && !applying.value)) return
    refreshing.value = true
    router.reload({ only: ['telegramConnection', 'securityCapabilities'], onFinish: () => { refreshing.value = false } })
}
useEventListener('focus', refresh)
</script>

<template>
    <section aria-labelledby="profile-telegram-title" class="grid min-w-0 gap-control border-t border-border pt-profile-section text-interface-body" :aria-busy="busy">
        <div class="flex min-w-0 flex-wrap items-center justify-between gap-compact">
            <div class="grid min-w-0 gap-control">
                <h3 id="profile-telegram-title" class="font-semibold">Telegram</h3>
                <p class="text-secondary">{{ connection.connected ? 'Подключён' : 'Не подключён' }}<span v-if="connection.connected && connection.username" class="wrap-anywhere"> · @{{ connection.username }}</span></p>
            </div>
            <BaseButton v-if="!connection.connected && !pending && !ready && !applying" label="Привязать" size="sm" variant="accent" :disabled="!connection.available" :loading="form.processing" loading-label="Открываем…" @click="start" />
        </div>
        <InlineAlert v-if="error" variant="error" :message="error" />
        <p v-if="link?.state === 'complete'" role="status" class="text-success">Telegram привязан. Аккаунт и подписка доступны в боте.</p>
        <template v-else-if="pending">
            <p class="text-secondary">Подтверди привязку в личном чате с ботом, затем вернись сюда. Ссылка действует 10 минут.</p>
            <div class="flex flex-wrap gap-compact">
                <BaseButton label="Проверить привязку" size="sm" variant="accent" :loading="refreshing" :disabled="form.processing" @click="refresh" />
                <BaseButton label="Отменить привязку" size="sm" variant="ghost" :disabled="busy" @click="cancel" />
            </div>
        </template>
        <template v-else-if="ready">
            <p class="text-secondary wrap-anywhere">Telegram{{ link.username ? ` @${link.username}` : '' }} подтверждён. При объединении сохраним ссылку более раннего аккаунта и сложим оставшееся оплаченное время. Пробные периоды не складываются.</p>
            <p v-if="!link.canConfirm" class="text-secondary">Заверши привязку в браузере, где она началась, или отмени её и запроси новую ссылку.</p>
            <div class="flex flex-wrap gap-compact">
                <BaseButton label="Завершить привязку" size="sm" :disabled="!link.canConfirm || refreshing" :loading="form.processing" loading-label="Объединяем…" @click="confirm" />
                <BaseButton label="Отменить привязку" size="sm" variant="ghost" :disabled="busy" @click="cancel" />
            </div>
        </template>
        <template v-else-if="applying">
            <p role="status" class="text-secondary">Завершаем объединение аккаунтов. Изменения профиля и подписки станут доступны после завершения.</p>
            <p v-if="link.failed && !error" class="text-error">Не удалось завершить привязку. Повтори сохранённый этап.</p>
            <BaseButton label="Повторить завершение привязки" size="sm" :loading="form.processing" :disabled="refreshing" loading-label="Объединяем…" @click="confirm" />
        </template>
        <p v-else-if="link?.state === 'expired'" role="status" class="text-secondary">Ссылка привязки устарела. Нажми «Привязать», чтобы получить новую.</p>
        <p v-else-if="link?.state === 'cancelled'" role="status" class="text-secondary">Привязка отменена.</p>
        <p v-else-if="!connection.connected && !connection.available" class="text-secondary">Привязка Telegram временно недоступна.</p>
    </section>
</template>
