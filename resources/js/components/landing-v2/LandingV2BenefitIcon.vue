<script setup>
import { computed } from 'vue'
import { LANDING_ICONS } from '@/utils/landingIconPaths'

// Missing shared glyphs use the original Lucide SVG geometry, without a new dependency.
const ICONS = {
    'plug-zap': [
        { tag: 'path', attrs: { d: 'M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z' } },
        { tag: 'path', attrs: { d: 'm2 22 3-3M7.5 13.5 10 11M10.5 16.5 13 14M18 3l-4 4h6l-4 4' } },
    ],
    'layout-grid': [
        { tag: 'rect', attrs: { width: 7, height: 7, x: 3, y: 3, rx: 1 } },
        { tag: 'rect', attrs: { width: 7, height: 7, x: 14, y: 3, rx: 1 } },
        { tag: 'rect', attrs: { width: 7, height: 7, x: 14, y: 14, rx: 1 } },
        { tag: 'rect', attrs: { width: 7, height: 7, x: 3, y: 14, rx: 1 } },
    ],
    headphones: [
        { tag: 'path', attrs: { d: 'M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3' } },
    ],
}
const props = defineProps({ name: { type: String, required: true } })
const elements = computed(() => ICONS[props.name] ?? LANDING_ICONS[props.name])
</script>

<template>
    <svg aria-hidden="true" class="size-v2-compact-icon shrink-0 text-v2-compact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <component :is="element.tag" v-for="(element, index) in elements" :key="index" v-bind="element.attrs" />
    </svg>
</template>
