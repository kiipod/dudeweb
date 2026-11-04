<script setup>
import { shallowRef } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import LandingFeatureScene from './LandingFeatureScene.vue'

defineProps({ feature: { type: Object, required: true } })

const playing = shallowRef(false)
const playback = shallowRef(0)
const { start, stop } = useTimeoutFn(() => { playing.value = false }, 1400, { immediate: false })

function play() {
    stop()
    playback.value += 1
    playing.value = true
    start()
}
</script>

<template>
    <article class="advantage-card relative flex flex-col overflow-hidden rounded-sheet border border-landing-card-border bg-landing-card" :data-playing="playing" @pointerenter="event => { if (event.pointerType === 'mouse') play() }">
        <div class="pointer-events-none px-6 pt-6 tablet:px-8 tablet:pt-8">
            <LandingFeatureScene :key="playback" :kind="feature.icon" />
        </div>
        <div class="flex flex-1 flex-col gap-3 p-6 tablet:p-8">
            <h3 class="text-landing-feature-title font-medium wrap-anywhere">{{ feature.title }}</h3>
            <p class="text-landing-feature-copy wrap-anywhere text-footer-secondary">{{ feature.copy }}</p>
        </div>
        <button type="button" class="absolute inset-0 cursor-pointer rounded-sheet focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-focus" :aria-label="`Показать анимацию: ${feature.title}`" @click="play" />
    </article>
</template>

<style scoped>
.advantage-card {
    transition: transform var(--advantage-transition), border-color var(--advantage-transition), box-shadow var(--advantage-transition);
}
.advantage-card:has(:focus-visible),
.advantage-card[data-playing="true"] {
    border-color: var(--color-accent);
}
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .advantage-card:hover {
        z-index: 1;
        transform: scale(var(--advantage-hover-scale));
        border-color: var(--color-accent);
        box-shadow: var(--shadow-advantage-hover);
    }
}
@media (prefers-reduced-motion: reduce) {
    .advantage-card { transition: none; }
}
</style>
