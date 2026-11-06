<script setup>
import { LANDING_V2_NAVIGATION } from '@/data/landingV2Navigation'

const VARIANTS = {
    desktop: 'text-v2-nav text-v2-ink',
    menu: 'text-v2-menu tracking-v2-menu text-v2-menu-ink',
}

const props = defineProps({
    activeHash: { type: String, default: '' },
    variant: {
        type: String,
        default: 'desktop',
        validator: value => ['desktop', 'menu'].includes(value),
    },
})
const emit = defineEmits(['navigate'])

function navigate(event, href) {
    if (props.variant !== 'menu' || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    emit('navigate', href)
}
</script>

<template>
    <a
        v-for="item in LANDING_V2_NAVIGATION"
        :key="item.href"
        :href="item.href"
        :aria-current="activeHash === item.href ? 'location' : null"
        :data-v2-menu-link="variant === 'menu' ? '' : null"
        :class="VARIANTS[variant] ?? VARIANTS.desktop"
        class="font-normal underline-offset-4 transition-colors duration-(--v2-duration-control) motion-reduce:transition-none hover:text-v2-focus hover:underline active:text-v2-focus aria-[current=location]:text-v2-focus aria-[current=location]:underline outline-none keyboard-focus:underline keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus"
        @click="navigate($event, item.href)"
    >
        {{ item.label }}
    </a>
</template>
