<script setup>
import { useTemplateRef } from 'vue'
import LandingV2BenefitCard from '@/components/landing-v2/LandingV2BenefitCard.vue'
import { useLandingV2Benefits } from '@/composables/useLandingV2Benefits'
import { LANDING_V2_BENEFITS } from '@/data/landingV2Benefits'

const track = useTemplateRef('track')
const stage = useTemplateRef('stage')
const { active, paused, running, layers, select, toggle, enter, leave, pause } = useLandingV2Benefits(track, stage, LANDING_V2_BENEFITS.length)

function navigate(event) {
    if (!event.target.matches('[data-v2-benefit-select]')) return
    const buttons = [...stage.value.querySelectorAll('[data-v2-benefit-select]')]
    const current = buttons.indexOf(event.target)
    const destinations = { ArrowRight: (current + 1) % buttons.length, ArrowLeft: (current - 1 + buttons.length) % buttons.length, Home: 0, End: buttons.length - 1 }
    if (!Object.hasOwn(destinations, event.key)) return
    event.preventDefault()
    select(destinations[event.key])
    buttons[destinations[event.key]].focus({ preventScroll: true })
}
</script>

<template>
    <div id="advantages" ref="track" class="v2-benefits relative min-w-0 outline-none" tabindex="-1" aria-label="Преимущества dudeweb" data-v2-benefits>
        <div ref="stage" class="v2-benefits-stage" @pointerenter="enter" @pointerleave="leave" @focusin="pause" @keydown="navigate">
            <div class="v2-benefits-field">
                <LandingV2BenefitCard
                    v-for="(benefit, index) in LANDING_V2_BENEFITS"
                    :key="benefit.label"
                    :benefit="benefit"
                    :index="index"
                    :active="active === index"
                    :running="running"
                    :style="layers[index]"
                    @select="select"
                />
            </div>
        </div>
        <button
            type="button"
            class="v2-benefits-toggle min-h-11 rounded-v2-panel px-3 text-sm text-v2-hero-copy underline decoration-transparent underline-offset-4 hover:decoration-current outline-none keyboard-focus:outline-2 keyboard-focus:outline-offset-2 keyboard-focus:outline-v2-focus"
            :aria-pressed="paused"
            @click="toggle"
        >
            {{ paused ? 'Запустить автопоказ' : 'Приостановить автопоказ' }}
        </button>
    </div>
</template>

<style scoped>
.v2-benefits {
    height: var(--spacing-v2-stack-track);
}

.v2-benefits-stage {
    position: sticky;
    top: var(--spacing-v2-stack-sticky);
    height: var(--spacing-v2-stack-canvas);
}

.v2-benefits-field {
    position: relative;
    height: 100%;
    overflow: clip;
}

.v2-benefits-field :deep(.v2-benefit) {
    position: absolute;
    inset: 0 var(--spacing-v2-stack-inset) auto;
    transform-origin: top center;
    transform: translateY(calc(var(--spacing-v2-stack-canvas) + var(--spacing-v2-stack-enter) - (var(--spacing-v2-stack-canvas) - var(--v2-order) * var(--spacing-v2-stack-step)) * var(--v2-arrival))) scale(calc(1 - var(--v2-age) * var(--v2-stack-shrink)));
}

.v2-benefits-toggle {
    display: none;
}

@media (width < 48rem) {
    @media (prefers-reduced-motion: reduce), (forced-colors: active), (height < 42.5rem) {
        .v2-benefits,
        .v2-benefits-stage,
        .v2-benefits-field {
            position: static;
            height: auto;
            overflow: visible;
        }

        .v2-benefits-field {
            display: grid;
            gap: 1rem;
        }

        .v2-benefits-field :deep(.v2-benefit) {
            position: relative;
            inset: auto;
            height: auto;
            min-height: var(--spacing-v2-benefit-card);
            transform: none;
        }

        .v2-benefits-field :deep(img) {
            flex: none;
            height: auto;
        }
    }
}

@media (width >= 48rem) {
    .v2-benefits {
        height: var(--spacing-v2-benefit-field);
    }

    .v2-benefits-stage {
        position: relative;
        top: auto;
        height: 100%;
    }

    .v2-benefits-field {
        display: flex;
        container-type: inline-size;
        border: 1px solid var(--color-v2-field-border);
        border-radius: var(--radius-v2-panel);
    }

    .v2-benefits-field :deep(.v2-benefit) {
        --v2-field-width: 100cqw;
        position: relative;
        inset: auto;
        transform: none;
    }

    .v2-benefits-toggle {
        position: absolute;
        right: 0;
        top: 100%;
        display: block;
    }
}

@media (prefers-reduced-motion: reduce), (forced-colors: active) {
    .v2-benefits-toggle {
        display: none;
    }
}
</style>
