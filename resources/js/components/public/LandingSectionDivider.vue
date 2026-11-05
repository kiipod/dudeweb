<script setup>
import { computed } from 'vue'

const PROFILES = {
    rise: {
        colors: 'bg-background text-landing-section',
        edge: 'M0 88L1440 12V100H0Z',
        accent: 'M0 58L980 36L1440 12L0 88Z',
    },
    fall: {
        colors: 'bg-landing-section text-background',
        edge: 'M0 8L1440 82V100H0Z',
        accent: 'M0 8L1440 48V82Z',
    },
    ridge: {
        colors: 'bg-background text-landing-section',
        edge: 'M0 80L520 24L1440 58V100H0Z',
        accent: 'M0 48L520 24L0 80Z',
    },
    shallow: {
        colors: 'bg-landing-section text-background',
        edge: 'M0 24L1440 72V100H0Z',
        accent: 'M0 24L960 40L1440 72Z',
    },
}

const props = defineProps({
    profile: { type: String, required: true, validator: value => ['rise', 'fall', 'ridge', 'shallow'].includes(value) },
})
const shape = computed(() => PROFILES[props.profile] ?? PROFILES.rise)
</script>

<template>
    <div class="pointer-events-none relative -my-px h-landing-divider w-full overflow-hidden select-none" :class="shape.colors" :data-section-divider="profile" aria-hidden="true">
        <svg class="block h-full w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" focusable="false">
            <path :d="shape.edge" fill="currentColor" />
            <path :d="shape.accent" class="fill-accent/15" />
        </svg>
    </div>
</template>
