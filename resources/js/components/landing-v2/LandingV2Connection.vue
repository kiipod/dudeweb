<script setup>
import LandingV2Section from '@/components/landing-v2/LandingV2Section.vue'
import LandingV2Signal from '@/components/landing-v2/LandingV2Signal.vue'
</script>

<template>
    <LandingV2Section variant="connection" aria-labelledby="v2-connection-title" data-v2-connection>
        <div class="v2-connection-composition relative grid min-w-0 gap-7">
            <div class="v2-connection-intro grid min-w-0 gap-5" data-v2-connection-intro>
                <div class="v2-connection-heading flex min-w-0 items-start gap-v2-connection-marker-gap">
                    <span aria-hidden="true" class="v2-connection-marker mt-v2-connection-marker-top h-v2-connection-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand" />
                    <h2 id="v2-connection-title" class="min-w-0 text-v2-connection-heading font-medium tracking-v2-connection">
                        Одно подключение.{{ ' ' }}<br>Больше свободы.
                    </h2>
                </div>
                <p class="v2-connection-copy text-v2-body text-v2-secondary" data-v2-connection-copy>
                    Любимые инструменты для творчества, развлечений и общения — в одном подключении.
                </p>
            </div>
            <LandingV2Signal />
        </div>
    </LandingV2Section>
</template>

<style scoped>
@media (width >= 90rem) {
    .v2-connection-intro {
        display: contents;
    }

    .v2-connection-heading {
        position: absolute;
        display: block;
        z-index: 1;
        top: calc(102 / 520 * 100%);
        left: calc(702 / 1280 * 100%);
        right: 0;
    }

    .v2-connection-heading h2 {
        margin-left: calc(18 / 578 * 100%);
    }

    .v2-connection-marker {
        position: absolute;
        top: 0;
        left: 0;
    }

    .v2-connection-copy {
        position: absolute;
        z-index: 1;
        top: calc(340 / 520 * 100%);
        left: calc(720 / 1280 * 100%);
        width: calc(500 / 1280 * 100%);
    }
}
</style>
