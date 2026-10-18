<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const model = defineModel({
    type: String,
    default: '',
})

defineProps({
    error: {
        type: String,
        default: '',
    },
    note: {
        type: String,
        default: 'Промокоды не суммируются с автоматически применённой скидкой.',
    },
    processing: Boolean,
})

const emit = defineEmits(['apply', 'close'])
</script>

<template>
    <section class="grid w-full gap-control-inline rounded-t-sheet border-t border-border bg-elevated px-shell-gutter pt-compact pb-panel">
        <div aria-hidden="true" class="mx-auto h-1 w-10 rounded-full bg-muted/60" />

        <header class="flex min-h-11.5 items-center justify-between gap-content">
            <div class="grid gap-control">
                <h2 class="text-interface-title font-display text-foreground">Промокод</h2>
                <p class="text-interface-body text-secondary">Введи код перед оплатой</p>
            </div>
            <BaseButton
                aria-label="Закрыть промокод"
                :disabled="processing"
                size="icon"
                variant="secondary"
                @click="emit('close')"
            >
                <UiIcon name="x" />
            </BaseButton>
        </header>

        <form class="grid gap-control-inline" @submit.prevent="emit('apply', model)">
            <BaseField
                id="promo-code"
                v-model="model"
                autocomplete="off"
                :disabled="processing"
                :error="error"
                label="Промокод"
                name="promocode"
                placeholder="Введите промокод"
                spacing="sheet"
            />

            <BaseButton full-width :loading="processing" loading-label="Проверяем" type="submit">
                Применить
            </BaseButton>
        </form>

        <p class="flex gap-compact text-interface-body text-muted">
            <UiIcon name="info" size="sm" />
            <span>{{ note }}</span>
        </p>
    </section>
</template>
