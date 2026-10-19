<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import AccountNavLink from '@/components/account/AccountNavLink.vue'

defineProps({
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
})

const emit = defineEmits(['close', 'logout', 'navigate'])
</script>

<template>
    <section class="grid w-full gap-account-sheet-content-gap rounded-t-sheet border-t border-border bg-elevated px-shell-gutter pt-account-sheet-top pb-account-sheet-bottom">
        <div aria-hidden="true" class="flex h-account-sheet-handle items-center justify-center">
            <span class="h-1 w-10 rounded-full bg-muted/60" />
        </div>

        <header class="flex min-h-account-sheet-header items-center justify-between">
            <h2 id="account-more-title" class="text-interface-title font-display text-foreground">Ещё</h2>
            <BaseButton aria-label="Закрыть меню" size="icon" variant="secondary" :disabled="logoutLoading" @click="emit('close')">
                <UiIcon name="x" />
            </BaseButton>
        </header>

        <nav aria-label="Дополнительные разделы" class="grid gap-account-sheet-menu-gap">
            <AccountNavLink
                v-for="item in items"
                :key="item.key"
                :item="item"
                variant="sheet"
                @navigate="emit('navigate', $event)"
            />
        </nav>

        <button
            :aria-busy="logoutLoading"
            class="flex min-h-account-sheet-row items-center gap-tight rounded-button border border-error/40 px-control-inline text-interface-body font-semibold text-error transition-colors duration-200 hover:bg-error-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-60"
            :disabled="logoutLoading"
            type="button"
            @click="emit('logout')"
        >
            <UiIcon :name="logoutLoading ? 'loader' : 'logOut'" />
            {{ logoutLoading ? 'Выходим' : 'Выйти' }}
        </button>
    </section>
</template>
