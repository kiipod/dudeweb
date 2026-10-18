<script setup>
import { computed } from 'vue'

const CONTAINER_CLASSES = {
    horizontal: 'inline-flex items-center gap-logo-gap',
    icon: 'inline-flex',
    stacked: 'inline-flex flex-col items-center gap-tight',
    wordmark: 'inline-flex',
}

const SCALE_CONTAINER_CLASSES = {
    account: 'gap-account-logo-gap',
    default: '',
    footer: 'gap-logo-footer-gap',
    public: 'gap-logo-public-gap-tablet desktop:gap-logo-public-gap-wide',
}

const MARK_FRAME_CLASSES = {
    default: 'inline-flex shrink-0',
    footer: 'inline-flex h-logo-footer-frame w-logo-footer shrink-0 items-center justify-center',
    public: {
        horizontal: 'inline-flex h-logo-public-frame-tablet w-logo-public-tablet shrink-0 items-center justify-center desktop:h-logo-public-frame-wide desktop:w-logo-public-wide',
        icon: 'inline-flex h-logo-public-frame-mobile w-logo-public-mobile shrink-0 items-center justify-center',
        stacked: 'inline-flex shrink-0',
    },
}

const MARK_CLASSES = {
    account: {
        horizontal: 'h-auto w-account-logo',
        icon: 'h-auto w-account-logo',
    },
    default: {
        horizontal: 'h-auto w-logo-horizontal',
        icon: 'h-auto w-logo-icon',
        stacked: 'h-auto w-logo-stacked',
    },
    footer: {
        horizontal: 'h-auto w-logo-footer-mark',
        icon: 'h-auto w-logo-footer-mark',
        stacked: 'h-auto w-logo-stacked',
    },
    public: {
        horizontal: 'h-auto w-logo-public-mark-tablet desktop:w-logo-public-mark-wide',
        icon: 'h-auto w-logo-public-mark-mobile',
        stacked: 'h-auto w-logo-stacked',
    },
}

const WORDMARK_CLASSES = {
    account: {
        horizontal: 'font-sans text-interface-brand font-bold text-foreground',
    },
    default: {
        horizontal: 'font-brand text-brand-lockup font-bold tracking-public-brand text-foreground',
        stacked: 'font-brand text-brand-stacked font-bold tracking-public-brand text-foreground',
        wordmark: 'font-sans text-interface-brand font-bold text-foreground',
    },
    footer: {
        horizontal: 'font-brand text-brand-footer font-bold tracking-public-brand text-foreground tablet:text-brand-footer-tablet desktop:text-brand-footer-wide',
        stacked: 'font-brand text-brand-stacked font-bold tracking-public-brand text-foreground',
    },
    public: {
        horizontal: 'font-brand text-brand-public-tablet font-bold tracking-public-brand text-foreground desktop:text-brand-public-wide',
        stacked: 'font-brand text-brand-stacked font-bold tracking-public-brand text-foreground',
    },
}

const props = defineProps({
    variant: {
        type: String,
        default: 'horizontal',
        validator: value => ['horizontal', 'icon', 'stacked', 'wordmark'].includes(value),
    },
    scale: {
        type: String,
        default: 'default',
        validator: value => ['default', 'footer', 'public', 'account'].includes(value),
    },
})

const containerClass = computed(() => [
    CONTAINER_CLASSES[props.variant] ?? CONTAINER_CLASSES.horizontal,
    SCALE_CONTAINER_CLASSES[props.scale] ?? SCALE_CONTAINER_CLASSES.default,
])
const markClass = computed(() => MARK_CLASSES[props.scale]?.[props.variant] ?? MARK_CLASSES.default[props.variant] ?? MARK_CLASSES.default.horizontal)
const markFrameClass = computed(() => {
    if (props.variant === 'stacked') {
        return MARK_FRAME_CLASSES.default
    }

    if (props.scale === 'public') {
        return MARK_FRAME_CLASSES.public[props.variant] ?? MARK_FRAME_CLASSES.public.horizontal
    }

    return MARK_FRAME_CLASSES[props.scale] ?? MARK_FRAME_CLASSES.default
})
const wordmarkClass = computed(() => WORDMARK_CLASSES[props.scale]?.[props.variant] ?? WORDMARK_CLASSES.default[props.variant] ?? WORDMARK_CLASSES.default.horizontal)
</script>

<template>
    <span :class="containerClass" aria-label="dudeweb" role="img">
        <span v-if="variant !== 'wordmark'" :class="markFrameClass">
            <svg
                :class="markClass"
                aria-hidden="true"
                viewBox="0 0 213.435 147.7913"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    class="fill-logo-primary"
                    d="M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z"
                />
                <path
                    class="fill-logo-highlight"
                    d="M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z"
                    transform="translate(144.72 16.74)"
                />
            </svg>
        </span>

        <span v-if="variant !== 'icon'" :class="wordmarkClass">dudeweb</span>
    </span>
</template>
