<script setup>
import { useTemplateRef } from 'vue'
import { useServiceCloud } from '@/composables/useServiceCloud'

const emit = defineEmits(['unavailable'])
const cloud = useTemplateRef('cloud')
const {
    state, running, interactive, dragging,
    onPointerMove, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel,
} = useServiceCloud(cloud, { onUnavailable: () => emit('unavailable') })
</script>

<template>
    <svg
        ref="cloud"
        :data-state="state"
        :data-running="running"
        :data-interactive="interactive"
        :data-dragging="dragging"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        class="service-logo-cloud block"
        :class="interactive ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'"
        @pointermove.passive="onPointerMove"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointerleave="onPointerLeave"
        @pointercancel="onPointerCancel"
        @lostpointercapture="onPointerCancel"
    />
</template>

<style scoped>
@media (forced-colors: active) {
    .service-logo-cloud {
        display: none;
    }
}
</style>
