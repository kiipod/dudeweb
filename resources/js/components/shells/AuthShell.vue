<script setup>
import BrandLink from '@/components/brand/BrandLink.vue'

defineProps({
    description: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <main class="flex min-h-screen bg-background px-shell-gutter py-panel text-foreground">
        <div class="mx-auto flex w-full max-w-form flex-col">
            <BrandLink />

            <section class="my-auto grid gap-panel py-section-sm">
                <header class="grid gap-control">
                    <h1 class="text-page-title font-semibold tracking-tight">{{ title }}</h1>
                    <p v-if="description" class="text-ui-body text-secondary">{{ description }}</p>
                </header>

                <slot />

                <footer v-if="$slots.footer" class="text-ui-meta text-secondary">
                    <slot name="footer" />
                </footer>
            </section>
        </div>
    </main>
</template>
