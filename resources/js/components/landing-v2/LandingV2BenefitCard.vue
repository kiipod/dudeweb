<script setup>
import LandingV2BenefitIcon from '@/components/landing-v2/LandingV2BenefitIcon.vue'

defineProps({
    benefit: { type: Object, required: true },
    index: { type: Number, required: true },
    active: { type: Boolean, default: false },
    running: { type: Boolean, default: false },
})
defineEmits({ select: index => Number.isInteger(index) && index >= 0 && index < 6 })
</script>

<template>
    <article class="v2-benefit relative min-w-0 bg-v2-surface" :data-active="active" data-v2-benefit>
        <div :id="`v2-benefit-copy-${index}`" class="v2-benefit-full flex h-full min-w-0 flex-col gap-v2-face-gap pt-v2-face-top pr-v2-face-inline pb-v2-face-bottom pl-v2-face-inline">
            <div class="flex items-center gap-2 border-b border-v2-benefit-rule pb-v2-face-label-bottom">
                <span class="font-mono text-v2-panel-number text-v2-benefit-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="text-v2-panel-label font-medium">{{ benefit.label }}</span>
            </div>
            <div class="v2-benefit-copy grid content-start gap-v2-face-copy-gap">
                <h2 class="text-v2-benefit-title font-medium tracking-v2-benefit">{{ benefit.title }}</h2>
                <p class="text-v2-benefit-copy text-v2-benefit-copy-ink">{{ benefit.description }}</p>
            </div>
            <img
                :src="`/landing-v2/illustrations/${benefit.image}.png`"
                alt=""
                width="890"
                height="546"
                class="min-h-0 w-full flex-1 object-contain"
                draggable="false"
            >
        </div>
        <div class="v2-benefit-compact absolute inset-0 flex flex-col pt-v2-compact-top pr-v2-compact-inline pb-v2-compact-bottom pl-v2-compact-inline" aria-hidden="true">
            <div class="v2-compact-label flex items-center gap-2 border-b border-v2-benefit-rule pb-v2-compact-rule">
                <span class="font-mono text-v2-compact-number text-v2-benefit-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="text-v2-compact-label font-medium text-v2-compact-label-ink">{{ benefit.label }}</span>
            </div>
            <div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-v2-compact-gap">
                <LandingV2BenefitIcon :name="benefit.icon" />
                <span class="w-full text-center text-v2-compact font-medium text-v2-compact-ink">{{ benefit.title }}</span>
            </div>
        </div>
        <button
            type="button"
            :aria-label="benefit.title"
            :aria-expanded="active"
            :aria-controls="`v2-benefit-copy-${index}`"
            class="v2-benefit-select absolute inset-0 w-full cursor-pointer rounded-v2-panel outline-none keyboard-focus:outline-2 keyboard-focus:-outline-offset-2 keyboard-focus:outline-v2-focus"
            data-v2-benefit-select
            @click="$emit('select', index)"
        />
        <span v-if="active" :key="running" class="v2-benefit-progress absolute right-0 bottom-0 left-0 h-0.5 origin-left bg-v2-brand" :data-running="running" aria-hidden="true" />
    </article>
</template>

<style scoped>
.v2-benefit {
    height: var(--spacing-v2-benefit-card);
    border: 1px solid var(--color-v2-field-border);
    border-radius: var(--radius-button);
}

.v2-benefit-copy {
    min-height: var(--spacing-v2-face-copy);
}

.v2-benefit-compact,
.v2-benefit-select,
.v2-benefit-progress {
    display: none;
}

@media (width >= 48rem) {
    .v2-benefit {
        height: 100%;
        flex: 1 1 0;
        overflow: clip;
        border: 0;
        border-radius: 0;
        transition: flex-grow var(--v2-duration-benefit) ease-in-out;
    }

    .v2-benefit:not(:last-child)::after {
        position: absolute;
        inset: 0 0 0 auto;
        width: 1px;
        background: var(--color-v2-field-border);
        content: '';
        pointer-events: none;
    }

    .v2-benefit[data-active='true'] {
        flex-grow: var(--v2-benefit-ratio);
        box-shadow: inset 0 2px var(--color-v2-brand);
    }

    .v2-benefit-full {
        width: calc(var(--v2-field-width) * 4.75 / 9.75);
        max-width: none;
        position: absolute;
        left: 50%;
        translate: -50% 0;
        visibility: hidden;
        opacity: 0;
        transition: opacity var(--v2-duration-benefit) ease-in-out;
    }

    .v2-benefit[data-active='true'] .v2-benefit-full {
        visibility: visible;
        opacity: 1;
    }

    .v2-benefit-compact,
    .v2-benefit-select,
    .v2-benefit-progress {
        display: flex;
    }

    .v2-benefit[data-active='true'] .v2-benefit-compact {
        visibility: hidden;
    }

    .v2-compact-label {
        flex-direction: column;
        gap: 0.375rem;
    }

    .v2-benefit-progress[data-running='true'] {
        animation: v2-benefit-progress var(--v2-duration-benefit-step) linear both;
    }
}

@media (width >= 64rem) {
    .v2-compact-label {
        flex-direction: row;
        gap: 0.25rem;
    }
}

@media (width >= 90rem) {
    .v2-compact-label {
        gap: 0.625rem;
    }
}

@media (prefers-reduced-motion: reduce), (forced-colors: active) {
    .v2-benefit,
    .v2-benefit-full {
        transition: none;
    }

    .v2-benefit-progress[data-running] {
        animation: none;
    }
}

@keyframes v2-benefit-progress {
    from { scale: 0 1; }
    to { scale: 1 1; }
}
</style>
