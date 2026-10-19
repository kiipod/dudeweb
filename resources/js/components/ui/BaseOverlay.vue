<script setup>
import { useTemplateRef } from 'vue'
import { useOverlay } from '@/composables/useOverlay'

const props = defineProps({
    open: Boolean,
    busy: Boolean,
    labelledBy: { type: String, required: true },
    id: { type: String, required: true },
    topOffset: { type: Number, default: 0 },
})
const emit = defineEmits(['close'])
const panel = useTemplateRef('panel')
const close = () => { if (!props.busy) emit('close') }

useOverlay({ open: () => props.open, panel, busy: () => props.busy, close })
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200 motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
            leave-to-class="opacity-0"
        >
            <div v-if="open" :style="topOffset ? { '--account-overlay-top': `${topOffset}px` } : undefined" class="fixed inset-x-0 top-account-overlay-offset bottom-0 z-50 flex items-end justify-center bg-account-backdrop" @click.self="close">
                <div
                    :id="id"
                    ref="panel"
                    :aria-labelledby="labelledBy"
                    :aria-busy="busy"
                    aria-modal="true"
                    class="max-h-account-overlay-available w-full overflow-y-auto rounded-t-sheet bg-elevated outline-none tablet:max-w-account-sheet"
                    role="dialog"
                    tabindex="-1"
                >
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
