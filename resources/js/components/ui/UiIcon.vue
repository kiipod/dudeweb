<script setup>
import { computed } from 'vue'

const ICONS = {
    alertTriangle: [
        { tag: 'path', attrs: { d: 'M21.73 18 13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' } },
        { tag: 'path', attrs: { d: 'M12 9v4' } },
        { tag: 'path', attrs: { d: 'M12 17h.01' } },
    ],
    check: [
        { tag: 'path', attrs: { d: 'm9 12 2 2 4-4' } },
    ],
    chevronRight: [
        { tag: 'path', attrs: { d: 'm9 18 6-6-6-6' } },
    ],
    circleCheck: [
        { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
        { tag: 'path', attrs: { d: 'm9 12 2 2 4-4' } },
    ],
    circleX: [
        { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
        { tag: 'path', attrs: { d: 'm15 9-6 6' } },
        { tag: 'path', attrs: { d: 'm9 9 6 6' } },
    ],
    clock: [
        { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
        { tag: 'polyline', attrs: { points: '12 6 12 12 16 14' } },
    ],
    copy: [
        { tag: 'rect', attrs: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' } },
        { tag: 'path', attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' } },
    ],
    creditCard: [
        { tag: 'rect', attrs: { width: '20', height: '14', x: '2', y: '5', rx: '2' } },
        { tag: 'line', attrs: { x1: '2', x2: '22', y1: '10', y2: '10' } },
    ],
    house: [
        { tag: 'path', attrs: { d: 'm3 10 9-7 9 7v9a2 2 0 0 1-2 2h-5v-7h-4v7H5a2 2 0 0 1-2-2Z' } },
    ],
    info: [
        { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
        { tag: 'path', attrs: { d: 'M12 16v-4' } },
        { tag: 'path', attrs: { d: 'M12 8h.01' } },
    ],
    loader: [
        { tag: 'path', attrs: { d: 'M21 12a9 9 0 1 1-6.22-8.56' } },
    ],
    logOut: [
        { tag: 'path', attrs: { d: 'M10 17l5-5-5-5' } },
        { tag: 'path', attrs: { d: 'M15 12H3' } },
        { tag: 'path', attrs: { d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' } },
    ],
    menu: [
        { tag: 'line', attrs: { x1: '4', x2: '20', y1: '6', y2: '6' } },
        { tag: 'line', attrs: { x1: '4', x2: '20', y1: '12', y2: '12' } },
        { tag: 'line', attrs: { x1: '4', x2: '20', y1: '18', y2: '18' } },
    ],
    messageCircle: [
        { tag: 'path', attrs: { d: 'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z' } },
    ],
    monitor: [
        { tag: 'rect', attrs: { width: '20', height: '14', x: '2', y: '3', rx: '2' } },
        { tag: 'line', attrs: { x1: '8', x2: '16', y1: '21', y2: '21' } },
        { tag: 'line', attrs: { x1: '12', x2: '12', y1: '17', y2: '21' } },
    ],
    moon: [
        { tag: 'path', attrs: { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' } },
    ],
    plug: [
        { tag: 'path', attrs: { d: 'M12 22v-5' } },
        { tag: 'path', attrs: { d: 'M9 8V2' } },
        { tag: 'path', attrs: { d: 'M15 8V2' } },
        { tag: 'path', attrs: { d: 'M6 8h12v3a6 6 0 0 1-12 0Z' } },
    ],
    sun: [
        { tag: 'circle', attrs: { cx: '12', cy: '12', r: '4' } },
        { tag: 'path', attrs: { d: 'M12 2v2' } },
        { tag: 'path', attrs: { d: 'M12 20v2' } },
        { tag: 'path', attrs: { d: 'm4.93 4.93 1.42 1.42' } },
        { tag: 'path', attrs: { d: 'm17.66 17.66 1.41 1.41' } },
        { tag: 'path', attrs: { d: 'M2 12h2' } },
        { tag: 'path', attrs: { d: 'M20 12h2' } },
        { tag: 'path', attrs: { d: 'm6.34 17.66-1.41 1.41' } },
        { tag: 'path', attrs: { d: 'm19.07 4.93-1.41 1.41' } },
    ],
    user: [
        { tag: 'path', attrs: { d: 'M19 21a7 7 0 0 0-14 0' } },
        { tag: 'circle', attrs: { cx: '12', cy: '7', r: '4' } },
    ],
    userPlus: [
        { tag: 'path', attrs: { d: 'M16 21a6 6 0 0 0-12 0' } },
        { tag: 'circle', attrs: { cx: '10', cy: '7', r: '4' } },
        { tag: 'line', attrs: { x1: '19', x2: '19', y1: '8', y2: '14' } },
        { tag: 'line', attrs: { x1: '22', x2: '16', y1: '11', y2: '11' } },
    ],
    x: [
        { tag: 'path', attrs: { d: 'M18 6 6 18' } },
        { tag: 'path', attrs: { d: 'm6 6 12 12' } },
    ],
}

const SIZE_CLASSES = {
    lg: 'size-6',
    md: 'size-5',
    sm: 'size-4',
}

const props = defineProps({
    name: {
        type: String,
        required: true,
        validator: value => [
            'alertTriangle',
            'check',
            'chevronRight',
            'circleCheck',
            'circleX',
            'clock',
            'copy',
            'creditCard',
            'house',
            'info',
            'loader',
            'logOut',
            'menu',
            'messageCircle',
            'monitor',
            'moon',
            'plug',
            'sun',
            'user',
            'userPlus',
            'x',
        ].includes(value),
    },
    size: {
        type: String,
        default: 'md',
        validator: value => ['lg', 'md', 'sm'].includes(value),
    },
})

const elements = computed(() => ICONS[props.name] ?? ICONS.info)
const iconClass = computed(() => [
    'shrink-0',
    SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
    props.name === 'loader' ? 'animate-spin' : '',
])
</script>

<template>
    <svg
        :class="iconClass"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <component
            :is="element.tag"
            v-for="(element, index) in elements"
            :key="index"
            v-bind="element.attrs"
        />
    </svg>
</template>
