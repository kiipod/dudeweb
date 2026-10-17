<script setup>
import { useId } from 'vue'

const gradientId = useId()
const MARK = 'M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z'
const ACCENT = 'M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z'
</script>

<template>
    <div class="landing-final-mark" aria-hidden="true">
        <svg class="landing-final-mark__light" focusable="false" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient :id="gradientId">
                    <stop offset="0" stop-color="var(--color-landing-glow-inner)" />
                    <stop offset="0.56" stop-color="var(--color-landing-glow-outer)" />
                    <stop offset="1" stop-color="transparent" />
                </radialGradient>
            </defs>
            <ellipse class="landing-final-mark__glow" :fill="`url(#${gradientId})`" cx="50%" cy="50%" rx="42%" ry="45%" />
        </svg>
        <svg class="landing-final-mark__shape landing-final-mark__far" viewBox="0 0 213.435 147.7913"><path :d="MARK" /></svg>
        <svg class="landing-final-mark__shape landing-final-mark__mid" viewBox="0 0 213.435 147.7913"><path :d="MARK" /></svg>
        <svg class="landing-final-mark__shape landing-final-mark__front" viewBox="0 0 213.435 147.7913"><path :d="MARK" /></svg>
        <svg class="landing-final-mark__accent" viewBox="0 0 19.30498 19.27125"><path :d="ACCENT" /></svg>
    </div>
</template>

<style scoped>
.landing-final-mark {
    position: relative;
    width: 100%;
    height: 100%;
}
.landing-final-mark__light {
    position: absolute;
    width: 100%;
    height: 100%;
}
.landing-final-mark__shape {
    position: absolute;
    left: var(--spacing-final-mark-x);
    top: var(--spacing-final-mark-y);
    width: var(--spacing-final-mark-width);
    height: var(--spacing-final-mark-height);
}
.landing-final-mark__far {
    left: calc(var(--spacing-final-mark-x) + var(--spacing-final-echo-x) * 2);
    top: calc(var(--spacing-final-mark-y) - var(--spacing-final-echo-y) * 2);
}
.landing-final-mark__mid {
    left: calc(var(--spacing-final-mark-x) + var(--spacing-final-echo-x));
    top: calc(var(--spacing-final-mark-y) - var(--spacing-final-echo-y));
}
.landing-final-mark__accent {
    position: absolute;
    left: var(--spacing-final-accent-x);
    top: var(--spacing-final-accent-y);
    width: var(--spacing-final-accent-width);
    height: var(--spacing-final-accent-height);
}
.landing-final-mark__glow { filter: blur(var(--blur-landing-glow)); }
.landing-final-mark__far { fill: var(--color-landing-mark-far); opacity: 0.12; }
.landing-final-mark__mid { fill: var(--color-landing-mark-mid); opacity: 0.24; }
.landing-final-mark__front { fill: var(--color-landing-mark-front); }
.landing-final-mark__accent { fill: var(--color-landing-final-accent); }
@media (forced-colors: active) { .landing-final-mark { display: none; } }
</style>
