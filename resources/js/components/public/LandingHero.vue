<script setup>
import { Link } from '@inertiajs/vue3'

const PRIMARY_ACTION_CLASSES = 'inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-ui-action font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:text-ui-body desktop:min-h-hero-action-wide desktop:text-hero-action-wide'
const SECONDARY_ACTION_CLASSES = 'inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-ui-action font-semibold text-hero-secondary-foreground transition-colors duration-200 hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:text-ui-body desktop:min-h-hero-action-wide desktop:text-hero-action-wide'
</script>

<template>
    <section class="landing-hero" aria-labelledby="hero-title">
        <div class="landing-hero__layout">
            <svg
                aria-hidden="true"
                class="landing-hero__signal"
                viewBox="0 0 300 300"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="hero-signal-top" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stop-color="var(--ui-hero-blob-1)" />
                        <stop offset="1" stop-color="var(--ui-hero-blob-2)" />
                    </linearGradient>
                    <linearGradient id="hero-signal-bottom" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stop-color="var(--ui-hero-blob-3)" />
                        <stop offset="1" stop-color="var(--ui-hero-blob-4)" />
                    </linearGradient>
                    <linearGradient id="hero-signal-blend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="white" stop-opacity="0" />
                        <stop offset="1" stop-color="white" />
                    </linearGradient>
                    <mask id="hero-signal-bottom-mask" maskContentUnits="objectBoundingBox">
                        <rect width="1" height="1" fill="url(#hero-signal-blend)" />
                    </mask>
                </defs>
                <path
                    class="landing-hero__signal-path"
                    d="M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z"
                    fill="url(#hero-signal-top)"
                />
                <path
                    class="landing-hero__signal-path"
                    d="M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z"
                    fill="url(#hero-signal-bottom)"
                    mask="url(#hero-signal-bottom-mask)"
                />
            </svg>

            <div class="landing-hero__content">
                <p class="landing-hero__eyebrow font-mono font-bold text-hero-eyebrow">
                    HEY, DUDE!
                </p>

                <h1 id="hero-title" class="landing-hero__heading font-display text-foreground">
                    Любимые сервисы<br>
                    снова рядом
                </h1>

                <p class="landing-hero__description text-hero-copy">
                    dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей.
                </p>

                <div class="landing-hero__actions">
                    <Link href="/register" :class="PRIMARY_ACTION_CLASSES">
                        Попробовать бесплатно
                    </Link>
                    <a href="#pricing" :class="SECONDARY_ACTION_CLASSES">
                        Посмотреть тариф
                    </a>
                </div>

                <p class="landing-hero__trial font-mono text-hero-meta">
                    3 дня бесплатно · До 5 устройств
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.landing-hero {
    height: var(--spacing-hero-mobile);
    overflow: hidden;
    background: radial-gradient(
        ellipse 105% 115% at 72% 42%,
        var(--ui-hero-background-inner) 0%,
        var(--ui-hero-background-outer) 100%
    );
}

.landing-hero__layout {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-inline: auto;
    padding: 2.125rem 1.25rem;
}

.landing-hero__signal {
    position: absolute;
    top: 5.625rem;
    left: 50%;
    width: 16.875rem;
    height: 16.875rem;
    overflow: visible;
    pointer-events: none;
    opacity: var(--ui-hero-blob-opacity);
    filter: blur(1rem);
    transform: translateX(-50%);
}

.landing-hero__content {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    max-width: var(--container-hero-mobile);
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
    text-align: center;
}

.landing-hero__eyebrow {
    font-size: 0.875rem;
    line-height: 1.2857;
    letter-spacing: 0.125rem;
}

.landing-hero__heading {
    width: 100%;
    font-size: var(--text-hero-heading-mobile);
    font-weight: var(--font-weight-display);
    line-height: var(--text-hero-heading-mobile--line-height);
    letter-spacing: -0.0875rem;
}

.landing-hero__description {
    width: 100%;
    font-size: var(--text-ui-copy);
    line-height: 1.5;
}

.landing-hero__actions {
    display: grid;
    width: 100%;
    gap: 0.625rem;
    padding-top: 0.75rem;
}

.landing-hero__trial {
    width: 100%;
    font-size: var(--text-ui-label);
    line-height: 1.2727;
    letter-spacing: 0.01875rem;
}

@media (max-width: 23.4374rem) {
    .landing-hero__signal {
        width: 15.625rem;
        height: 15.625rem;
    }

    .landing-hero__content {
        max-width: 20rem;
    }

    .landing-hero__heading {
        font-size: var(--text-hero-heading-small);
        line-height: var(--text-hero-heading-small--line-height);
    }
}

@media (min-width: 48rem) {
    .landing-hero {
        height: var(--spacing-hero-tablet);
    }

    .landing-hero__layout {
        display: grid;
        max-width: var(--container-hero-tablet);
        grid-template-columns: var(--container-hero-content-tablet) 18.75rem;
        gap: 1.25rem;
        padding: 4.5rem 0;
    }

    .landing-hero__signal {
        position: relative;
        top: -1.125rem;
        left: -8.625rem;
        grid-column: 2;
        grid-row: 1;
        width: 29.0625rem;
        height: 29.25rem;
        filter: blur(1.25rem);
        transform: none;
    }

    .landing-hero__content {
        grid-column: 1;
        grid-row: 1;
        max-width: var(--container-hero-content-tablet);
        align-items: flex-start;
        gap: 1.125rem;
        text-align: left;
    }

    .landing-hero__eyebrow {
        font-size: var(--text-ui-copy);
        line-height: 1.3125;
    }

    .landing-hero__heading {
        font-size: var(--text-hero-heading-tablet);
        line-height: var(--text-hero-heading-tablet--line-height);
        letter-spacing: -0.1625rem;
    }

    .landing-hero__description {
        font-size: var(--text-hero-copy-tablet);
        line-height: var(--text-hero-copy-tablet--line-height);
    }

    .landing-hero__actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--spacing-hero-action-gap);
        padding-top: 0;
    }

    .landing-hero__trial {
        font-size: var(--text-ui-meta);
        line-height: 1.3333;
        text-align: left;
    }
}

@media (min-width: 75rem) {
    .landing-hero {
        height: var(--spacing-hero-wide);
    }

    .landing-hero__layout {
        height: 100%;
        max-width: var(--container-hero-wide);
        grid-template-columns: var(--container-hero-content-wide) var(--container-hero-signal-wide);
        gap: var(--spacing-hero-column-gap-wide);
        padding: var(--spacing-hero-inset-wide) 0;
    }

    .landing-hero__signal {
        --hero-signal-aspect: var(--aspect-hero-signal-wide);
        position: absolute;
        top: var(--spacing-hero-signal-top-wide);
        left: calc(var(--container-hero-content-wide) + var(--spacing-hero-column-gap-wide) - var(--spacing-hero-signal-overlap-wide));
        grid-column: auto;
        grid-row: auto;
        width: min(var(--container-hero-blob-width-wide), calc(var(--spacing-hero-signal-available-wide) * var(--hero-signal-aspect)));
        height: auto;
        aspect-ratio: var(--hero-signal-aspect);
        opacity: var(--ui-hero-blob-opacity-desktop);
        filter: blur(var(--spacing-hero-signal-blur-wide));
        transform: none;
    }

    .landing-hero__content {
        position: absolute;
        top: calc(50% - var(--spacing-hero-content-offset-wide));
        left: 0;
        grid-column: auto;
        grid-row: auto;
        max-width: var(--container-hero-content-wide);
        gap: clamp(1.125rem, calc(0.535714vw + 0.642857rem), 1.5rem);
        transform: translateY(-50%);
    }

    .landing-hero__eyebrow {
        font-size: clamp(1.125rem, calc(0.357143vw + 0.803571rem), 1.375rem);
        line-height: clamp(1.4375rem, calc(0.535714vw + 0.955357rem), 1.8125rem);
        letter-spacing: clamp(0.125rem, calc(0.035714vw + 0.092857rem), 0.15rem);
    }

    .landing-hero__heading {
        font-size: var(--text-hero-heading-wide);
        line-height: var(--text-hero-heading-wide--line-height);
        letter-spacing: clamp(-0.25rem, calc(-0.125vw - 0.05rem), -0.1625rem);
    }

    .landing-hero__description {
        font-size: var(--text-hero-copy-wide);
        line-height: var(--text-hero-copy-wide--line-height);
    }

    .landing-hero__actions {
        max-width: var(--container-hero-actions-wide);
    }

    .landing-hero__trial {
        font-size: var(--text-hero-meta-wide);
        line-height: clamp(1rem, calc(0.178571vw + 0.839286rem), 1.125rem);
    }
}

@media (min-width: 100rem) {
    .landing-hero__signal {
        opacity: var(--ui-hero-blob-opacity-wide);
    }
}

@supports (aspect-ratio: calc(1 / 1)) {
    @media (min-width: 75rem) {
        .landing-hero__signal {
            --hero-signal-aspect: calc(var(--container-hero-blob-width-wide) / var(--spacing-hero-blob-height-wide));
        }
    }
}

@media (forced-colors: active) {
    .landing-hero__signal {
        display: none;
    }
}

</style>
