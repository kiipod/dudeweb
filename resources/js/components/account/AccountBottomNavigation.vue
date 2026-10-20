<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'
import AccountNavLink from '@/components/account/AccountNavLink.vue'

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
    moreOpen: Boolean,
})

const emit = defineEmits(['navigate', 'select-action'])

const ITEM_CLASSES = {
    active: 'bg-accent-soft font-semibold text-accent',
    default: 'bg-transparent font-medium text-muted hover:bg-surface hover:text-foreground',
}

function itemClass(item) {
    return [
        'flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-control rounded-button py-control text-interface-bottom-nav transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        props.activeKey === item.key ? ITEM_CLASSES.active : ITEM_CLASSES.default,
    ]
}
</script>

<template>
    <nav aria-label="Навигация личного кабинета" class="flex min-h-account-bottom-nav items-start gap-control border-t border-border bg-surface px-control-inline pt-compact pb-account-nav-bottom">
        <template v-for="item in items" :key="item.key">
            <AccountNavLink
                v-if="item.href"
                :item="item"
                :active="activeKey === item.key"
                variant="bottom"
                @navigate="emit('navigate', $event)"
            />

            <button
                v-else
                :aria-expanded="moreOpen"
                aria-controls="account-more"
                aria-haspopup="dialog"
                :class="itemClass(item)"
                type="button"
                @click="emit('select-action', item.key)"
            >
                <UiIcon :name="item.icon" size="sm" />
                <span class="wrap-anywhere">{{ item.label }}</span>
            </button>
        </template>
    </nav>
</template>
