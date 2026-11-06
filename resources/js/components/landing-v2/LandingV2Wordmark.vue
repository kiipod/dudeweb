<script setup>
import { useId, useTemplateRef } from 'vue'
import { LANDING_V2_WORDMARK, useLandingV2Wordmark } from '@/composables/useLandingV2Wordmark'

const target = useTemplateRef('wordmark')
const { glow } = useLandingV2Wordmark(target)
const id = useId().replaceAll(':', '')
const shapeId = `v2-wordmark-${id}`
const maskId = `${shapeId}-mask`
const gradientId = `${shapeId}-gradient`
const echoes = [
    { factor: 0.7, opacity: 0.26, color: 'var(--color-v2-wordmark-echo-one)', width: 'var(--v2-wordmark-echo-one)' },
    { factor: 1.35, opacity: 0.18, color: 'var(--color-v2-wordmark-echo-two)', width: 'var(--v2-wordmark-echo-two)' },
    { factor: 2, opacity: 0.1, color: 'var(--color-v2-wordmark-echo-three)', width: 'var(--v2-wordmark-echo-three)' },
]
</script>

<template>
    <div data-v2-wordmark class="px-0.5 py-1.5">
        <svg ref="wordmark" :viewBox="`0 0 ${LANDING_V2_WORDMARK.width} ${LANDING_V2_WORDMARK.height}`" role="img" aria-label="dudeweb" class="v2-wordmark block h-auto w-full overflow-visible text-v2-brand">
            <defs>
                <text :id="shapeId" x="0" :y="LANDING_V2_WORDMARK.height / 2" dominant-baseline="central" vector-effect="non-scaling-stroke" class="v2-wordmark-text">dudeweb</text>
                <radialGradient :id="gradientId" gradientUnits="userSpaceOnUse" :cx="glow?.x ?? 0" :cy="glow?.y ?? 0" :r="glow?.radius ?? 1">
                    <stop offset="0" stop-color="white" />
                    <stop offset="0.25" stop-color="white" stop-opacity="0.63" />
                    <stop offset="0.5" stop-color="white" stop-opacity="0.33" />
                    <stop offset="0.75" stop-color="white" stop-opacity="0.11" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                </radialGradient>
                <mask :id="maskId" maskUnits="userSpaceOnUse" x="0" y="0" :width="LANDING_V2_WORDMARK.width" :height="LANDING_V2_WORDMARK.height">
                    <rect :width="LANDING_V2_WORDMARK.width" :height="LANDING_V2_WORDMARK.height" :fill="`url(#${gradientId})`" />
                </mask>
            </defs>
            <use :href="`#${shapeId}`" fill="none" stroke="currentColor" class="v2-wordmark-base" />
            <g v-if="glow" data-v2-wordmark-glow :mask="`url(#${maskId})`" :opacity="glow.opacity" fill="none" class="pointer-events-none">
                <use :href="`#${shapeId}`" stroke="currentColor" :stroke-width="'var(--v2-wordmark-halo)'" opacity="0.045" />
                <use v-for="echo in echoes" :key="echo.factor" :href="`#${shapeId}`" :transform="`translate(${glow.dx * echo.factor} ${glow.dy * echo.factor})`" :stroke="echo.color" :stroke-width="echo.width" :opacity="echo.opacity" />
            </g>
        </svg>
    </div>
</template>

<style scoped>
.v2-wordmark-text {
    font-family: var(--font-sans);
    font-size: var(--text-v2-footer-outline);
    font-weight: 600;
    letter-spacing: var(--tracking-v2-footer-outline);
}

.v2-wordmark use {
    vector-effect: non-scaling-stroke;
}

.v2-wordmark-base {
    stroke-width: var(--v2-wordmark-stroke);
}

@media (forced-colors: active) {
    .v2-wordmark-base {
        stroke: CanvasText;
    }
}
</style>
