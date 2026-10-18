<script setup>
import { Link } from '@inertiajs/vue3'
import UiIcon from '@/components/ui/UiIcon.vue'

const props = defineProps({
    activeKey: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
        validator: items => items.every(item => (
            typeof item.key === 'string'
            && typeof item.label === 'string'
            && typeof item.icon === 'string'
            && (typeof item.href === 'string' || item.action === true)
        )),
    },
})

const emit = defineEmits(['navigate', 'select-action'])

const ITEM_CLASSES = {
    active: 'bg-accent-soft font-semibold text-accent',
    default: 'bg-transparent font-medium text-muted hover:bg-surface hover:text-foreground',
}

function itemClass(item) {
    return [
        'flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-control rounded-button px-control text-interface-bottom-nav transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        props.activeKey === item.key ? ITEM_CLASSES.active : ITEM_CLASSES.default,
    ]
}
</script>

<template>
    <nav aria-label="Навигация личного кабинета" class="flex min-h-20 gap-control border-t border-border bg-surface px-control-inline pt-compact pb-tight">
        <template v-for="item in items" :key="item.key">
            <Link
                v-if="item.href"
                :aria-current="activeKey === item.key ? 'page' : undefined"
                :class="itemClass(item)"
                :href="item.href"
                @click="emit('navigate', item.key)"
            >
                <UiIcon :name="item.icon" />
                <span class="truncate">{{ item.label }}</span>
            </Link>

            <button
                v-else
                :aria-pressed="activeKey === item.key"
                :class="itemClass(item)"
                type="button"
                @click="emit('select-action', item.key)"
            >
                <UiIcon :name="item.icon" />
                <span class="truncate">{{ item.label }}</span>
            </button>
        </template>
    </nav>
</template>
