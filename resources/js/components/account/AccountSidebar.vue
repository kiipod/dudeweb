<script setup>
import { Link } from '@inertiajs/vue3'
import BrandLink from '@/components/brand/BrandLink.vue'
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
    default: 'bg-transparent font-semibold text-secondary hover:bg-surface hover:text-foreground',
}

function itemClass(key) {
    return [
        'flex min-h-account-sidebar-item items-center gap-tight rounded-control px-control-inline text-interface-navigation transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        props.activeKey === key ? ITEM_CLASSES.active : ITEM_CLASSES.default,
    ]
}
</script>

<template>
    <aside class="flex h-full w-account-sidebar flex-col justify-between gap-section-sm overflow-y-auto border-r border-border bg-account-sidebar px-sidebar-gutter py-account-sidebar-top">
        <div class="grid shrink-0 gap-section-sm">
            <BrandLink scale="account" />

            <nav aria-label="Разделы личного кабинета" class="grid gap-control">
                <AccountNavLink
                    v-for="item in items"
                    :key="item.key"
                    :item="item"
                    :active="activeKey === item.key"
                    @navigate="emit('navigate', $event)"
                />
            </nav>
        </div>

        <div class="grid shrink-0 gap-control">
            <Link
                v-if="profileHref"
                :aria-current="activeKey === 'profile' ? 'page' : undefined"
                :class="itemClass('profile')"
                :href="profileHref"
            >
                <UiIcon name="user" size="sm" />
                Профиль
            </Link>
            <button v-else :class="[itemClass('profile'), 'cursor-not-allowed opacity-60']" type="button" disabled>
                <UiIcon name="user" size="sm" />
                Профиль
            </button>
            <button
                :aria-busy="logoutLoading"
                class="flex min-h-account-sidebar-item items-center gap-tight rounded-control px-control-inline text-interface-navigation font-semibold text-error transition-colors duration-200 hover:bg-error-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-60"
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
