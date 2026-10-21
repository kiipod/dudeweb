<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import CopyableLink from '@/components/ui/CopyableLink.vue'
import { maskedSubscriptionUrl } from '@/utils/dashboardPresentation'

const props = defineProps({ url: { type: String, default: null } })
const masked = computed(() => maskedSubscriptionUrl(props.url))
</script>

<template>
    <section class="grid min-w-0 grid-cols-1 gap-account-connection-gap rounded-card border border-border bg-interface-input p-account-connection" aria-labelledby="dashboard-connection-title">
        <div class="flex flex-wrap items-center justify-between gap-compact">
            <h2 id="dashboard-connection-title" class="text-interface-title font-display">Подключение</h2>
            <Link href="/account/connection" class="inline-flex min-h-interface-control items-center rounded-control px-control text-interface-body font-semibold text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">Как подключиться</Link>
        </div>
        <template v-if="url">
            <p class="text-interface-body text-secondary">Скопируй ссылку для устройства</p>
            <CopyableLink :value="url" :display-value="masked" />
        </template>
        <p v-else class="py-tight text-interface-body text-secondary">Ссылка подключения сейчас недоступна. <a href="https://t.me/hey_dude_web" class="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">Написать в поддержку</a></p>
    </section>
</template>
