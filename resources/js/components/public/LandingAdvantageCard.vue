<script setup>
import { useTemplateRef } from 'vue'
import { useAdvantageMotion } from '@/composables/useAdvantageMotion'
import LandingFeatureScene from './LandingFeatureScene.vue'

defineProps({ feature: { type: Object, required: true } })

const target = useTemplateRef('card')
const { running, active, playing, play, enter, leave } = useAdvantageMotion(target)

const SIZES = {
    zap: 'col-span-2 min-h-advantage-lead desktop:col-span-4',
    gauge: 'min-h-advantage-compact desktop:col-span-2',
    'monitor-smartphone': 'min-h-advantage-compact desktop:col-span-2',
    'shield-check': 'col-span-2 min-h-advantage-protection tablet:col-span-1 desktop:col-span-2',
    infinity: 'min-h-advantage-compact desktop:col-span-2',
    'heart-handshake': 'min-h-advantage-compact tablet:col-span-2 tablet:min-h-advantage-banner desktop:col-span-6',
}
</script>

<template>
    <article ref="card" class="advantage-card relative isolate flex min-w-0 flex-col overflow-hidden rounded-sheet border border-landing-card-border bg-landing-card" :class="SIZES[feature.icon]" :data-feature="feature.icon" :data-active="active" :data-playing="playing" :data-motion-running="running" @pointerenter="enter" @pointerleave="leave" @pointercancel="leave">
        <LandingFeatureScene :kind="feature.icon" />
        <div class="advantage-card__copy relative z-1 mt-auto flex flex-col gap-3 p-4 tablet:p-6 desktop:p-8">
            <h3 class="text-ui-title font-medium wrap-anywhere tablet:text-landing-feature-title">{{ feature.title }}</h3>
            <p class="text-ui-body wrap-anywhere text-footer-secondary tablet:text-landing-feature-copy">{{ feature.copy }}</p>
        </div>
        <button type="button" class="absolute inset-0 z-2 cursor-pointer rounded-sheet focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-focus" :aria-label="`Оживить иллюстрацию: ${feature.title}`" @click="play" />
    </article>
</template>

<style scoped>
.advantage-card {
    transition: border-color var(--advantage-transition), box-shadow var(--advantage-transition);
}
.advantage-card:has(:focus-visible),
.advantage-card[data-active="true"] {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-advantage-hover);
}
.advantage-card[data-feature="zap"] .advantage-card__copy {
    max-width: var(--container-advantage-lead-copy);
}
@media (width >= 48rem) {
    .advantage-card[data-feature="heart-handshake"] { flex-direction: row-reverse; align-items: center; }
    .advantage-card[data-feature="heart-handshake"] .advantage-card__copy { width: 50%; margin-top: 0; }
}
@media (prefers-reduced-motion: reduce) {
    .advantage-card { transition: none; }
}
</style>
