<script setup>
import { shallowRef } from 'vue'
import ServiceCloudHero from './hero/ServiceCloudHero.vue'
import SignalOrbitHero from './hero/SignalOrbitHero.vue'

defineProps({
    variant: {
        type: String,
        default: 'services',
        validator: value => ['services', 'signal-orbit'].includes(value),
    },
})

const cloudUnavailable = shallowRef(false)
</script>

<template>
    <SignalOrbitHero v-if="variant === 'signal-orbit' || cloudUnavailable" />
    <ServiceCloudHero v-else @unavailable="cloudUnavailable = true" />
</template>
