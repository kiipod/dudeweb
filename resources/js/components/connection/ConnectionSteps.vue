<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { connectionDownloadNote } from '@/utils/connectionDownload'
import { computed, shallowRef, useId } from 'vue'
const props = defineProps({ platform: { type: Object, required: true } })
const appName = shallowRef(props.platform.apps[0]?.name ?? '')
const app = computed(() => props.platform.apps.find(item => item.name === appName.value))
const appOptions = computed(() => props.platform.apps.map(item => ({ value: item.name, label: item.name })))
const selectId = useId()
</script>

<template>
    <section aria-labelledby="connection-instructions-title" class="grid min-w-0 gap-connection-section">
        <h2 id="connection-instructions-title" class="text-interface-body font-semibold">Инструкция для подключения</h2>
        <p v-if="!platform.available" role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Инструкция для этого устройства пока недоступна. Напиши в поддержку — поможем подключиться.</p>
        <ol v-else class="grid min-w-0 gap-connection-section">
            <li v-for="(step, index) in app?.steps ?? []" :key="index">
                <details class="group min-w-0 rounded-button border border-border bg-interface-input p-connection-step">
                    <summary class="flex min-w-0 cursor-pointer list-none items-center gap-connection-step-gap rounded-control outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus [&::-webkit-details-marker]:hidden">
                        <span aria-hidden="true" class="flex size-connection-number shrink-0 items-center justify-center rounded-control bg-accent-soft text-account-step-number font-step-number text-accent-text">{{ index + 1 }}</span>
                        <span class="grid min-w-0 flex-1 gap-0.5">
                            <span class="text-interface-title font-display wrap-anywhere">{{ step.title }}</span>
                            <span class="text-interface-body wrap-anywhere text-secondary">{{ step.description }}</span>
                        </span>
                        <UiIcon name="chevronRight" class="text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none" />
                    </summary>
                    <div class="grid min-w-0 gap-content pt-content text-interface-body wrap-anywhere text-secondary">
                        <div v-if="index === 0" class="grid min-w-0 gap-interface-field-gap">
                            <label :id="`${selectId}-label`" :for="selectId" class="font-medium text-foreground">Приложение</label>
                            <BaseSelect :id="selectId" v-model="appName" :aria-labelledby="`${selectId}-label`" name="connection-app" :options="appOptions" />
                        </div>
                        <p v-for="(paragraph, paragraphIndex) in step.content" :key="paragraphIndex">{{ paragraph }}</p>
                        <ul v-if="step.links?.length" class="flex flex-wrap gap-compact">
                            <li v-for="link in step.links" :key="link.url + link.label" class="min-w-0 w-full md:w-auto">
                                <BaseButton
                                    :href="link.url"
                                    :target="link.external ? '_blank' : undefined"
                                    rel="noopener noreferrer"
                                    class="min-w-0 max-w-full text-center wrap-anywhere"
                                    full-width
                                >
                                    <span class="grid min-w-0 gap-0.5">
                                        <span>{{ index === 0 ? 'Скачать' : link.label }}</span>
                                        <span v-if="index === 0 && step.links.length > 1" class="text-interface-meta font-normal">{{ connectionDownloadNote(link, platform.id) }}</span>
                                    </span>
                                </BaseButton>
                            </li>
                        </ul>
                    </div>
                </details>
            </li>
        </ol>
    </section>
</template>
