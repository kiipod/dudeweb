<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'
import { computed, shallowRef } from 'vue'
const props = defineProps({ platform: { type: Object, required: true } })
const appName = shallowRef(props.platform.apps[0]?.name ?? '')
const app = computed(() => props.platform.apps.find(item => item.name === appName.value))
</script>

<template>
    <section aria-label="Шаги подключения" class="grid min-w-0 gap-connection-section">
        <p v-if="!platform.available" role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Инструкция для этого устройства пока недоступна. Напиши в поддержку — поможем подключиться.</p>
        <ol v-else class="grid min-w-0 gap-connection-section">
            <li v-for="(step, index) in app?.steps ?? []" :key="index">
                <details class="group min-w-0 rounded-button border border-border bg-surface p-connection-step">
                    <summary class="flex min-w-0 cursor-pointer list-none items-center gap-connection-step-gap rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                        <span aria-hidden="true" class="flex size-connection-number shrink-0 items-center justify-center rounded-control bg-accent-soft text-connection-number font-semibold text-accent-text">{{ index + 1 }}</span>
                        <span class="grid min-w-0 flex-1 gap-0.5">
                            <span class="text-interface-title font-display wrap-anywhere">{{ step.title }}</span>
                            <span class="text-interface-body wrap-anywhere text-secondary">{{ step.description }}</span>
                        </span>
                        <UiIcon name="chevronRight" class="text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none" />
                    </summary>
                    <div class="grid min-w-0 gap-content pt-content text-interface-body wrap-anywhere text-secondary">
                        <label v-if="index === 0" class="grid min-w-0 gap-interface-field-gap">
                            <span class="font-medium text-foreground">Приложение</span>
                            <select v-model="appName" name="connection-app" class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline text-interface-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><option v-for="item in platform.apps" :key="item.name" :value="item.name">{{ item.name }}</option></select>
                        </label>
                        <p v-for="(paragraph, paragraphIndex) in step.content" :key="paragraphIndex">{{ paragraph }}</p>
                        <ul v-if="step.links?.length" class="grid gap-compact">
                            <li v-for="link in step.links" :key="link.url + link.label"><a :href="link.url" :target="link.external ? '_blank' : undefined" rel="noopener noreferrer" class="inline-flex min-h-interface-control items-center rounded-control text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">{{ link.label }}</a></li>
                        </ul>
                    </div>
                </details>
            </li>
        </ol>
    </section>
</template>
