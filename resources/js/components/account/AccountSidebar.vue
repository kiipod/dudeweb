<script setup>
import { Link } from '@inertiajs/vue3'
import BrandLink from '@/components/brand/BrandLink.vue'
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
            && typeof item.href === 'string'
            && typeof item.icon === 'string'
        )),
    },
    logoutLoading: Boolean,
    profileHref: {
        type: String,
        default: '/account/profile',
    },
})

const emit = defineEmits(['logout', 'navigate'])

const ITEM_CLASSES = {
    active: 'bg-accent-soft font-semibold text-accent',
    default: 'bg-transparent font-medium text-secondary hover:bg-surface hover:text-foreground',
}

function itemClass(key) {
    return [
        'flex min-h-12 items-center gap-tight rounded-control px-control-inline text-ui-detail transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        props.activeKey === key ? ITEM_CLASSES.active : ITEM_CLASSES.default,
    ]
}
</script>

<template>
    <aside class="flex h-full w-65 flex-col justify-between border-r border-border bg-surface px-sidebar-gutter py-section-sm">
        <div class="grid gap-section-sm">
            <BrandLink />

            <nav aria-label="Разделы личного кабинета" class="grid gap-control">
                <Link
                    v-for="item in items"
                    :key="item.key"
                    :aria-current="activeKey === item.key ? 'page' : undefined"
                    :class="itemClass(item.key)"
                    :href="item.href"
                    @click="emit('navigate', item.key)"
                >
                    <UiIcon :name="item.icon" size="sm" />
                    {{ item.label }}
                </Link>
            </nav>
        </div>

        <div class="grid gap-control">
            <Link
                :aria-current="activeKey === 'profile' ? 'page' : undefined"
                :class="itemClass('profile')"
                :href="profileHref"
            >
                <UiIcon name="user" size="sm" />
                Профиль
            </Link>
            <button
                :aria-busy="logoutLoading"
                class="flex min-h-11.5 items-center gap-tight rounded-control px-control-inline text-ui-detail font-medium text-error transition-colors duration-200 hover:bg-error-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-60"
                :disabled="logoutLoading"
                type="button"
                @click="emit('logout')"
            >
                <UiIcon :name="logoutLoading ? 'loader' : 'logOut'" size="sm" />
                {{ logoutLoading ? 'Выходим' : 'Выйти' }}
            </button>
        </div>
    </aside>
</template>
