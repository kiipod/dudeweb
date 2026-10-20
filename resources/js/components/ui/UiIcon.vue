<script setup>
import { computed } from 'vue'
import { LANDING_ICONS } from '@/utils/landingIconPaths'

const ICONS = {
    keyRound: [
        { tag: 'circle', attrs: { cx: '15.5', cy: '8.5', r: '5.5' } },
        { tag: 'path', attrs: { d: 'm11.6 12.4-8.6 8.6H6v-3h3v-3l2.6-2.6M16 8h.01' } },
    ],
    send: [{ tag: 'path', attrs: { d: 'm22 2-7 20-4-9-9-4L22 2ZM22 2 11 13' } }],
    arrowLeft: [{ tag: 'path', attrs: { d: 'm12 19-7-7 7-7M5 12h14' } }],
    gift: [
        { tag: 'path', attrs: { d: 'M12 8v13M3 8h18v4H3zM5 12v9h14v-9M12 8H7.5A2.5 2.5 0 1 1 10 5.5L12 8Zm0 0h4.5A2.5 2.5 0 1 0 14 5.5L12 8Z' } },
    ],
    share: [
        { tag: 'circle', attrs: { cx: 18, cy: 5, r: 3 } },
        { tag: 'circle', attrs: { cx: 6, cy: 12, r: 3 } },
        { tag: 'circle', attrs: { cx: 18, cy: 19, r: 3 } },
        { tag: 'path', attrs: { d: 'm8.6 10.5 6.8-4m-6.8 7 6.8 4' } },
    ],
    ...LANDING_ICONS,
    mail: [
        { tag: 'rect', attrs: { x: '2', y: '4', width: '20', height: '16', rx: '2' } },
        { tag: 'path', attrs: { d: 'm22 6-10 7L2 6' } },
    ],
    lock: [
        { tag: 'rect', attrs: { x: '3', y: '11', width: '18', height: '11', rx: '2' } },
        { tag: 'path', attrs: { d: 'M7 11V7a5 5 0 0 1 10 0v4' } },
    ],
    eye: [
        { tag: 'path', attrs: { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z' } },
        { tag: 'circle', attrs: { cx: '12', cy: '12', r: '3' } },
    ],
    eyeOff: [
        { tag: 'path', attrs: { d: 'm3 3 18 18M10.58 10.58a2 2 0 0 0 2.84 2.84M9.88 5.09A11 11 0 0 1 12 5c7 0 10 7 10 7a16 16 0 0 1-3.17 4.18M6.61 6.61A17 17 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.39-1.39' } },
    ],
    arrowUpRight: [
        { tag: 'path', attrs: { d: 'M7 17 17 7' } },
        { tag: 'path', attrs: { d: 'M7 7h10v10' } },
    ],
    alertTriangle: [
        { tag: 'path', attrs: { d: 'M21.73 18 13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' } },
        { tag: 'path', attrs: { d: 'M12 9v4' } },
        { tag: 'path', attrs: { d: 'M12 17h.01' } },
    ],
    check: [
        { tag: 'path', attrs: { d: 'm20 6-11 11-5-5' } },
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
    ticket: [
        { tag: 'path', attrs: { d: 'M4 5h16a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 1 2-2Z' } },
        { tag: 'path', attrs: { d: 'M13 5v2m0 4v2m0 4v2' } },
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
    feature: 'size-landing-feature-icon',
    platform: 'size-platform-icon',
    connection: 'size-connection-platform-icon',
    lg: 'size-6',
    status: 'size-auth-status-glyph',
    md: 'size-5',
    sm: 'size-4',
}

const props = defineProps({
    name: {
        type: String,
        required: true,
        validator: value => [
            'mail',
            'lock',
            'eye',
            'eyeOff',
            'arrowUpRight',
            'arrowLeft',
            'gift',
            'share',
            'send',
            'keyRound',
            'alertTriangle',
            'check',
            'chevronRight',
            'circleCheck',
            'circleX',
            'clock',
            'copy',
            'creditCard',
            'ticket',
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
        ].includes(value) || Object.hasOwn(LANDING_ICONS, value),
    },
    size: {
        type: String,
        default: 'md',
        validator: value => ['feature', 'platform', 'connection', 'status', 'lg', 'md', 'sm'].includes(value),
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
        :viewBox="name.startsWith('platform-') ? '0 0 256 256' : '0 0 24 24'"
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
