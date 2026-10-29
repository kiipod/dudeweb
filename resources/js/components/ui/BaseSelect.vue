<script setup>
import { computed, useId, useTemplateRef } from 'vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { useSelect } from '@/composables/useSelect'

defineOptions({ inheritAttrs: false })
const props = defineProps({
    disabled: Boolean,
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    options: { type: Array, required: true },
})
const model = defineModel({ type: [String, Number], required: true })
const generatedId = useId()
const triggerId = computed(() => props.id ?? generatedId)
const listId = computed(() => `${triggerId.value}-options`)
const trigger = useTemplateRef('trigger')
const panel = useTemplateRef('panel')
const selected = computed(() => props.options.find(option => option.value === model.value))
const { open, active, position, toggle, keydown, choose } = useSelect({
    trigger, panel, options: () => props.options, disabled: () => props.disabled,
    value: () => model.value, update: value => { model.value = value },
})
</script>

<template>
    <span class="relative block min-w-0">
        <input v-if="name" type="hidden" :name="name" :value="model" :disabled="disabled">
        <button
            :id="triggerId"
            ref="trigger"
            v-bind="$attrs"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            :aria-controls="listId"
            :aria-expanded="open"
            :aria-activedescendant="open && active >= 0 ? `${listId}-${active}` : undefined"
            :disabled="disabled"
            class="flex min-h-interface-control min-w-0 w-full cursor-pointer items-center justify-between gap-compact rounded-button border border-interface-field-border bg-interface-input px-interface-inline py-compact text-left text-interface-body text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60"
            @click="toggle"
            @keydown="keydown"
        >
            <span class="min-w-0 flex-1 wrap-anywhere">{{ selected?.label }}</span>
            <UiIcon name="chevronRight" class="text-secondary" :class="open ? '-rotate-90' : 'rotate-90'" />
        </button>
        <Teleport v-if="open" to="body">
            <ul
                :id="listId"
                ref="panel"
                role="listbox"
                :aria-labelledby="$attrs['aria-labelledby'] ?? triggerId"
                :style="position"
                class="fixed top-select-top left-select-left z-select max-h-select-available w-select-width overflow-y-auto overscroll-contain rounded-button border border-interface-field-border bg-interface-input p-control font-sans text-select-option text-foreground shadow-lg"
                @pointerdown.prevent
            >
                <li
                    v-for="(option, index) in options"
                    :id="`${listId}-${index}`"
                    :key="option.value"
                    role="option"
                    :aria-selected="option.value === model"
                    :aria-disabled="option.disabled || undefined"
                    class="flex min-h-interface-control items-center gap-compact rounded-control px-interface-inline py-compact wrap-anywhere"
                    :class="option.disabled ? 'cursor-not-allowed text-muted forced-colors:text-select-disabled' : [
                        'cursor-pointer',
                        active === index ? 'bg-accent-soft text-accent-text forced-colors:bg-select-active forced-colors:text-select-active-foreground' : 'hover:bg-surface',
                        option.value === model ? 'font-semibold' : '',
                    ]"
                    @pointermove="!option.disabled && (active = index)"
                    @click="choose(index)"
                >
                    <span class="min-w-0 flex-1">{{ option.label }}</span>
                    <UiIcon v-if="option.value === model" name="check" />
                </li>
            </ul>
        </Teleport>
    </span>
</template>
