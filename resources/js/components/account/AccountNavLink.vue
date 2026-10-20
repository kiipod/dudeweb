<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import UiIcon from '@/components/ui/UiIcon.vue'

const props = defineProps({
    item: { type: Object, required: true },
    active: Boolean,
    variant: { type: String, default: 'sidebar', validator: value => ['sidebar', 'bottom', 'sheet'].includes(value) },
})
const emit = defineEmits(['navigate'])
const tag = computed(() => props.item.disabled ? 'button' : props.item.external ? 'a' : Link)
const VARIANTS = {
    sidebar: 'min-h-account-sidebar-item justify-start gap-tight px-control-inline text-interface-navigation font-semibold',
    bottom: 'min-h-14 flex-1 flex-col justify-center gap-control py-control text-interface-bottom-nav font-medium',
    sheet: 'min-h-account-sheet-row justify-start gap-tight bg-surface px-control-inline text-interface-body font-medium',
}
const classes = computed(() => [
    'flex min-w-0 items-center rounded-control text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTS[props.variant],
    props.active ? 'bg-accent-soft font-semibold text-accent' : 'text-secondary',
    !props.item.disabled && !props.active ? 'hover:bg-surface hover:text-foreground' : '',
])
</script>

<template>
    <component
        :is="tag"
        :href="item.disabled ? undefined : item.href"
        :type="item.disabled ? 'button' : undefined"
        :disabled="item.disabled || undefined"
        :aria-disabled="item.disabled || undefined"
        :aria-current="active ? 'page' : undefined"
        :class="classes"
        @click="emit('navigate', item.key)"
    >
        <UiIcon :name="item.icon" :size="variant === 'sheet' ? 'md' : 'sm'" />
        <span class="min-w-0 wrap-anywhere">{{ item.label }}</span>
        <UiIcon v-if="variant === 'sheet'" name="chevronRight" size="sm" class="ml-auto shrink-0 text-muted" />
    </component>
</template>
