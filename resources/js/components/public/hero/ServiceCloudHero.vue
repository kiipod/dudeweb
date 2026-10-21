<script setup>
import { Link } from '@inertiajs/vue3'
import ServiceLogoCloud from './ServiceLogoCloud.vue'

const emit = defineEmits(['unavailable'])

const PRIMARY_ACTION_CLASSES = 'inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide'
const SECONDARY_ACTION_CLASSES = 'inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide'
</script>

<template>
    <section class="service-hero relative min-h-hero-mobile overflow-hidden bg-background tablet:min-h-hero-tablet desktop:h-hero-wide desktop:min-h-0" aria-labelledby="hero-title">
        <div class="service-hero__layout">
            <ServiceLogoCloud class="service-hero__cloud" @unavailable="emit('unavailable')" />

            <div class="service-hero__content">
                <p class="service-hero__eyebrow font-mono font-bold text-hero-eyebrow">
                    HEY, DUDE!
                </p>

                <h1 id="hero-title" class="service-hero__heading font-display break-words text-foreground">
                    Любимые сервисы<br>
                    снова рядом
                </h1>

                <p class="service-hero__description text-hero-copy">
                    dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей.
                </p>

                <div class="service-hero__actions">
                    <Link href="/register" :class="PRIMARY_ACTION_CLASSES">
                        Попробовать бесплатно
                    </Link>
                    <a href="#pricing" :class="SECONDARY_ACTION_CLASSES">
                        Посмотреть тариф
                    </a>
                </div>

                <p class="service-hero__trial font-mono text-hero-meta">
                    3 дня бесплатно · До 5 устройств
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.service-hero__layout {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    min-height: inherit;
    align-items: center;
    justify-content: center;
    margin-inline: auto;
    padding: 2.125rem var(--spacing-shell-gutter);
}

.service-hero__cloud {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.service-hero__content {
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

.service-hero__eyebrow {
    font-size: var(--text-ui-body);
    line-height: 1.2857;
    letter-spacing: 0.125rem;
}

.service-hero__heading {
    width: 100%;
    font-size: var(--text-hero-heading-mobile);
    font-weight: var(--font-weight-display);
    line-height: var(--text-hero-heading-mobile--line-height);
    letter-spacing: -0.0875rem;
}

.service-hero__description {
    width: 100%;
    font-size: var(--text-ui-copy);
    line-height: 1.5;
}

.service-hero__actions {
    display: grid;
    width: 100%;
    gap: 0.625rem;
    padding-top: var(--spacing-tight);
}

.service-hero__trial {
    width: 100%;
    font-size: var(--text-service-hero-trial);
    line-height: var(--text-service-hero-trial--line-height);
    letter-spacing: 0.01875rem;
}

@media (max-width: 23.4374rem) {
    .service-hero__content {
        max-width: 20rem;
    }

    .service-hero__heading {
        font-size: var(--text-hero-heading-small);
        line-height: var(--text-hero-heading-small--line-height);
    }
}

@media (min-width: 48rem) {
    .service-hero__layout {
        padding: 4.5rem var(--spacing-section-md);
    }

    .service-hero__content {
        max-width: var(--container-service-hero-tablet);
        gap: 1.125rem;
    }

    .service-hero__eyebrow {
        font-size: var(--text-ui-copy);
        line-height: 1.3125;
    }

    .service-hero__heading {
        font-size: var(--text-hero-heading-tablet);
        line-height: var(--text-hero-heading-tablet--line-height);
        letter-spacing: -0.1625rem;
    }

    .service-hero__description {
        font-size: var(--text-hero-copy-tablet);
        line-height: var(--text-hero-copy-tablet--line-height);
    }

    .service-hero__actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--spacing-hero-action-gap);
        padding-top: 0;
    }
}

@media (min-width: 75rem) {
    .service-hero__layout {
        max-width: var(--container-hero-wide);
        padding: var(--spacing-hero-inset-wide) 0;
    }

    .service-hero__cloud {
        inset: auto;
        top: 50%;
        left: calc(var(--container-hero-content-wide) + var(--spacing-hero-column-gap-wide));
        width: var(--container-hero-signal-wide);
        height: min(var(--spacing-service-cloud-height-wide), var(--spacing-hero-wide));
        transform: translateY(-50%);
    }

    .service-hero__content {
        position: absolute;
        top: calc(50% - var(--spacing-hero-content-offset-wide));
        left: 0;
        max-width: var(--container-hero-content-wide);
        align-items: flex-start;
        gap: clamp(1.125rem, calc(0.535714vw + 0.642857rem), 1.5rem);
        text-align: left;
        transform: translateY(-50%);
    }

    .service-hero__eyebrow {
        font-size: clamp(1.125rem, calc(0.357143vw + 0.803571rem), 1.375rem);
        line-height: clamp(1.4375rem, calc(0.535714vw + 0.955357rem), 1.8125rem);
        letter-spacing: clamp(0.125rem, calc(0.035714vw + 0.092857rem), 0.15rem);
    }

    .service-hero__heading {
        font-size: var(--text-hero-heading-wide);
        line-height: var(--text-hero-heading-wide--line-height);
        letter-spacing: clamp(-0.25rem, calc(-0.125vw - 0.05rem), -0.1625rem);
    }

    .service-hero__description {
        font-size: var(--text-hero-copy-wide);
        line-height: var(--text-hero-copy-wide--line-height);
    }

    .service-hero__actions {
        max-width: var(--container-hero-actions-wide);
    }

    .service-hero__trial {
        text-align: left;
    }
}
</style>
