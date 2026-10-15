<script setup>
import { Link } from '@inertiajs/vue3'
import { computed, useTemplateRef } from 'vue'
import { HERO_STATES, useScrollDrivenHero } from '@/composables/useScrollDrivenHero'

const PRIMARY_ACTION_CLASSES = 'inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-ui-action font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
const SECONDARY_ACTION_CLASSES = 'inline-flex min-h-12 items-center justify-center rounded-button border border-border bg-elevated px-panel text-ui-action font-semibold text-foreground transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
const MOTION_HEADING = 'Hey Dude — любимые сервисы снова рядом'
const STATIC_HEADING = 'Hey, dude! Любимые сервисы снова рядом'

const props = defineProps({
    enablePinning: {
        type: Boolean,
        default: true,
    },
})

const sectionRef = useTemplateRef('section')
const {
    activeState,
    activeStateIndex,
    isScrollDriven,
    reducedMotion,
    showConversion,
} = useScrollDrivenHero(sectionRef, { enabled: () => props.enablePinning })

const activeWordState = computed(() => HERO_STATES[Math.min(activeStateIndex.value, 4)])
const semanticHeading = computed(() => isScrollDriven.value ? MOTION_HEADING : STATIC_HEADING)
</script>

<template>
    <section
        ref="section"
        :class="{ 'landing-hero--scroll-driven': isScrollDriven }"
        :data-hero-state="activeState.id"
        :data-reduced-motion="reducedMotion"
        aria-labelledby="hero-title"
        class="landing-hero relative"
    >
        <div :class="{ 'landing-hero__stage--pinned': isScrollDriven }" class="landing-hero__stage">
            <div class="landing-hero__content mx-auto flex w-full max-w-page flex-col items-center px-shell-gutter tablet:px-section-sm desktop:px-shell-desktop">
                <h1 id="hero-title" class="sr-only">{{ semanticHeading }}</h1>

                <div class="landing-hero__word-stage relative flex w-full flex-1 items-center justify-center" aria-hidden="true">
                    <svg
                        class="landing-hero__blob size-hero-blob-mobile overflow-visible tablet:size-hero-blob-tablet desktop:size-hero-blob-desktop"
                        viewBox="0 0 300 300"
                    >
                        <defs>
                            <linearGradient id="hero-blob-gradient" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0" stop-color="var(--ui-hero-blob-1)" />
                                <stop offset="0.34" stop-color="var(--ui-hero-blob-2)" />
                                <stop offset="0.68" stop-color="var(--ui-hero-blob-3)" />
                                <stop offset="1" stop-color="var(--ui-hero-blob-4)" />
                            </linearGradient>
                            <filter id="hero-blob-blur" height="140%" width="140%" x="-20%" y="-20%">
                                <feGaussianBlur stdDeviation="14" />
                            </filter>
                        </defs>
                        <path
                            d="M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z"
                            fill="url(#hero-blob-gradient)"
                            filter="url(#hero-blob-blur)"
                            opacity="0.46"
                            transform="rotate(-3 150 150)"
                        />
                    </svg>

                    <p
                        v-if="!isScrollDriven"
                        class="landing-hero__static-heading absolute inset-x-0 text-center font-display tracking-display text-foreground"
                    >
                        Hey, dude!<br>
                        <span class="whitespace-nowrap">любимые сервисы</span><br class="tablet:hidden">
                        <span class="hidden tablet:inline">&nbsp;</span><span class="whitespace-nowrap">снова рядом</span>
                    </p>

                    <Transition v-else name="hero-word" mode="out-in">
                        <p
                            :key="activeWordState.id"
                            class="landing-hero__motion-word absolute inset-x-0 text-center text-hero-word-mobile font-display tracking-display text-foreground tablet:text-hero-word-tablet desktop:text-hero-word-desktop"
                        >
                            {{ activeWordState.word }}
                        </p>
                    </Transition>
                </div>

                <Transition name="hero-conversion">
                    <div
                        v-if="showConversion"
                        class="landing-hero__conversion w-full max-w-hero-mobile text-center tablet:max-w-hero-tablet desktop:max-w-reading"
                    >
                        <p class="landing-hero__description text-ui-copy text-secondary desktop:text-lg desktop:leading-normal">
                            dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей.
                        </p>

                        <div class="landing-hero__actions mt-hero-conversion-gap grid gap-hero-action-gap desktop:grid-cols-2">
                            <Link href="/register" :class="PRIMARY_ACTION_CLASSES">
                                Попробовать бесплатно
                            </Link>
                            <a href="#pricing" :class="SECONDARY_ACTION_CLASSES">
                                Посмотреть тариф
                            </a>
                        </div>

                        <p class="landing-hero__trial mt-hero-conversion-gap font-mono text-ui-label text-muted">
                            3 дня бесплатно · До 5 устройств
                        </p>
                    </div>
                </Transition>
            </div>
        </div>
    </section>
</template>

<style scoped>
.landing-hero--scroll-driven {
    height: 700svh;
}

.landing-hero__stage {
    min-height: calc(100svh - var(--spacing-public-header));
    background:
        radial-gradient(ellipse 82% 72% at 50% 36%, var(--ui-hero-glow) 0%, var(--ui-background) 72%);
}

.landing-hero__stage--pinned {
    position: sticky;
    top: var(--spacing-public-header);
    height: calc(100svh - var(--spacing-public-header));
    min-height: 0;
    overflow: hidden;
}

.landing-hero__content {
    min-height: calc(100svh - var(--spacing-public-header));
    gap: var(--spacing-content);
    padding-top: var(--spacing-section-md);
    padding-bottom: var(--spacing-section-sm);
}

.landing-hero__stage--pinned .landing-hero__content {
    height: 100%;
    min-height: 0;
    justify-content: space-between;
    gap: 0;
    padding-top: var(--spacing-hero-mobile-top);
    padding-bottom: var(--spacing-hero-mobile-bottom);
}

.landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__content {
    justify-content: center;
    gap: 1.375rem;
    padding-top: var(--spacing-section-md);
    padding-bottom: var(--spacing-section-md);
}

.landing-hero__word-stage {
    min-height: 20rem;
}

.landing-hero__stage--pinned .landing-hero__word-stage {
    flex: none;
    height: var(--spacing-hero-word-stage-mobile);
    min-height: 0;
}

.landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__word-stage {
    flex: none;
    height: 20rem;
}

.landing-hero__blob {
    max-width: min(100%, 40svh);
    max-height: min(100%, 40svh);
}

.landing-hero__static-heading {
    font-size: clamp(2.4375rem, 2rem + 1.9vw, var(--text-display-mobile));
    line-height: 1.02;
}

.landing-hero__motion-word {
    top: var(--spacing-hero-word-top-mobile);
}

.hero-word-enter-active,
.hero-word-leave-active,
.hero-conversion-enter-active,
.hero-conversion-leave-active {
    transition-duration: 275ms;
    transition-property: opacity, transform;
}

.hero-word-enter-from,
.hero-conversion-enter-from {
    opacity: 0;
    transform: translateY(12px);
}

.hero-word-leave-to,
.hero-conversion-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

@media (min-width: 48rem) {
    .landing-hero__content {
        gap: var(--spacing-panel);
        padding-top: var(--spacing-section-lg);
        padding-bottom: var(--spacing-section-lg);
    }

    .landing-hero__static-heading {
        font-size: var(--text-display-tablet);
    }

    .landing-hero__motion-word {
        top: var(--spacing-hero-word-top-tablet);
    }

    .landing-hero__stage--pinned .landing-hero__content {
        padding-top: var(--spacing-hero-tablet-inset);
        padding-bottom: var(--spacing-hero-tablet-inset);
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__content {
        gap: 1.875rem;
        padding-top: var(--spacing-section-lg);
        padding-bottom: var(--spacing-section-lg);
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__word-stage {
        height: 21.875rem;
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__conversion {
        max-width: var(--container-hero-static-tablet);
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__description {
        font-size: var(--text-hero-static-copy);
        line-height: var(--text-hero-static-copy--line-height);
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 75rem) {
    .landing-hero__stage {
        min-height: calc(100svh - var(--spacing-public-header-desktop));
    }

    .landing-hero__stage--pinned {
        top: var(--spacing-public-header-desktop);
        height: calc(100svh - var(--spacing-public-header-desktop));
        min-height: 0;
    }

    .landing-hero__content {
        min-height: calc(100svh - var(--spacing-public-header-desktop));
        padding-top: 6rem;
    }

    .landing-hero__stage--pinned .landing-hero__content {
        min-height: 0;
        padding-top: var(--spacing-hero-desktop-inset);
        padding-bottom: var(--spacing-hero-desktop-inset);
    }

    .landing-hero__stage--pinned .landing-hero__word-stage {
        height: var(--spacing-hero-word-stage-desktop);
    }

    .landing-hero__word-stage {
        min-height: 26.25rem;
    }

    .landing-hero__static-heading {
        font-size: var(--text-display-desktop);
    }

    .landing-hero__motion-word {
        top: var(--spacing-hero-word-top-desktop);
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__content {
        padding-top: 4.5rem;
        padding-bottom: 4.5rem;
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__word-stage {
        height: 24.375rem;
        min-height: 24.375rem;
    }

    .landing-hero__stage:not(.landing-hero__stage--pinned) .landing-hero__conversion {
        max-width: var(--container-hero-static-desktop);
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero-word-enter-active,
    .hero-word-leave-active,
    .hero-conversion-enter-active,
    .hero-conversion-leave-active {
        transition: none;
    }
}

@media (forced-colors: active) {
    .landing-hero__blob {
        display: none;
    }
}
</style>
