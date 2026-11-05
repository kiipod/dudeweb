<script setup>
import { LANDING_V2_SIGNAL_NODES, LANDING_V2_SIGNAL_RINGS, LANDING_V2_SIGNAL_WAVES } from '@/data/landingV2Signal'
</script>

<template>
    <div class="v2-signal relative min-w-0 overflow-clip" aria-hidden="true" data-v2-signal data-state="static">
        <svg class="v2-signal-art absolute top-0 left-0 h-full max-w-none" viewBox="0 0 1280 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="v2-signal-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M24 0H0V24" class="v2-signal-grid" />
                </pattern>
                <linearGradient id="v2-signal-grid-x" x1="0" y1="0" x2="590" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0.5085" stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="v2-signal-grid-y" x1="0" y1="0" x2="0" y2="520" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0" />
                    <stop offset="0.1058" stop-color="white" />
                    <stop offset="0.8462" stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <mask id="v2-signal-grid-vertical"><rect width="590" height="520" fill="url(#v2-signal-grid-y)" /></mask>
                <mask id="v2-signal-grid-fade"><rect width="590" height="520" fill="url(#v2-signal-grid-x)" mask="url(#v2-signal-grid-vertical)" /></mask>
                <linearGradient id="v2-signal-ring-fade" x1="582" y1="0" x2="704" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0" />
                    <stop offset="0.0984" stop-color="white" />
                    <stop offset="0.6393" stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                </linearGradient>
                <mask id="v2-signal-rings"><rect x="582" width="122" height="520" fill="url(#v2-signal-ring-fade)" /></mask>
                <linearGradient v-for="node in LANDING_V2_SIGNAL_NODES" :id="`v2-signal-pulse-${node.name}`" :key="node.name" :x1="node.pulseX - 36" :x2="node.pulseX + 36" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                    <stop class="v2-signal-pulse-color" stop-opacity="0" />
                    <stop offset="0.5" class="v2-signal-pulse-color" stop-opacity="0.7" />
                    <stop offset="1" class="v2-signal-pulse-color" stop-opacity="0" />
                </linearGradient>
                <linearGradient v-for="wave in LANDING_V2_SIGNAL_WAVES" :id="`v2-signal-wave-pulse-${wave.index}`" :key="wave.index" :x1="wave.pulseX - 56" :x2="wave.pulseX + 56" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                    <stop class="v2-signal-pulse-color" stop-opacity="0" />
                    <stop offset="0.5" class="v2-signal-pulse-color" stop-opacity="0.7" />
                    <stop offset="1" class="v2-signal-pulse-color" stop-opacity="0" />
                </linearGradient>
            </defs>
            <rect width="590" height="520" fill="url(#v2-signal-grid)" mask="url(#v2-signal-grid-fade)" />
            <g v-for="node in LANDING_V2_SIGNAL_NODES" :key="node.name" class="v2-signal-pair" :data-v2-signal-pair="node.name">
                <path :d="node.route" class="v2-signal-route" data-v2-signal-route />
                <path :d="node.route" :stroke="`url(#v2-signal-pulse-${node.name})`" stroke-width="1.5" />
                <rect :x="node.x - 18" :y="node.y - 18" width="36" height="36" rx="5" class="v2-signal-node" />
                <image :href="`/landing-v2/brands/${node.name}.png`" :x="node.x - 10" :y="node.y - 10" width="20" height="20" />
            </g>
            <g v-for="wave in LANDING_V2_SIGNAL_WAVES" :key="wave.index" data-v2-signal-wave>
                <path :d="wave.path" class="v2-signal-wave" />
                <path :d="wave.path" :stroke="`url(#v2-signal-wave-pulse-${wave.index})`" stroke-width="1.64" />
            </g>
            <g mask="url(#v2-signal-rings)">
                <circle v-for="ring in LANDING_V2_SIGNAL_RINGS" :key="ring.radius" cx="584" cy="260" :r="ring.radius" :opacity="ring.opacity" class="v2-signal-ring" />
            </g>
        </svg>
        <div class="v2-signal-origin absolute flex items-center justify-center bg-v2-page shadow-v2-origin ring-1 ring-v2-signal-origin ring-inset" data-v2-signal-origin>
            <img src="/landing-v2/brand/mark.svg" alt="" width="44" height="36" class="v2-signal-mark">
        </div>
        <span class="v2-signal-caption absolute flex items-center justify-center bg-v2-page text-center text-v2-signal-caption font-medium text-v2-signal-caption-ink">dudeweb</span>
    </div>
</template>

<style scoped>
.v2-signal {
    aspect-ratio: var(--v2-signal-view-width) / 520;
}

.v2-signal-art {
    width: calc(100% * 1280 / var(--v2-signal-view-width));
}

.v2-signal-grid {
    stroke: var(--color-v2-signal-grid);
    stroke-width: 1.2;
    opacity: 0.52;
}

.v2-signal-pair {
    opacity: 0.82;
}

.v2-signal-route {
    stroke: var(--color-v2-signal-route);
    stroke-width: 1.5;
    stroke-opacity: 0.48;
}

.v2-signal-pulse-color {
    stop-color: var(--color-v2-brand);
}

.v2-signal-node {
    fill: var(--color-v2-page);
    stroke: var(--color-v2-signal-node);
    stroke-width: 1;
}

.v2-signal-wave {
    stroke: var(--color-v2-signal-wave);
    stroke-width: 1.64;
    stroke-opacity: 0.55;
}

.v2-signal-ring {
    stroke: var(--color-v2-brand);
    stroke-width: 1.5;
}

.v2-signal-origin {
    left: calc(552 / var(--v2-signal-view-width) * 100%);
    top: calc(232 / 520 * 100%);
    width: calc(64 / var(--v2-signal-view-width) * 100%);
    height: calc(56 / 520 * 100%);
    border-radius: var(--radius-v2-signal-origin);
}

.v2-signal-mark {
    width: calc(44 / 64 * 100%);
    height: auto;
}

.v2-signal-caption {
    left: calc(584 / var(--v2-signal-view-width) * 100%);
    top: calc(302 / 520 * 100%);
    min-width: var(--spacing-v2-signal-caption);
    min-height: var(--spacing-v2-signal-caption-height);
    translate: -50% 0;
}

@media (forced-colors: active) {
    .v2-signal-grid {
        display: none;
    }
}
</style>
