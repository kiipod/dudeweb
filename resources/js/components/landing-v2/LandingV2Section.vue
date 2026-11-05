<script setup>
const SECTION_CLASSES = {
    hero: 'pt-v2-hero-top pb-v2-hero-bottom',
    platforms: 'pt-v2-platforms-top pb-v2-platforms-bottom',
    connection: 'pt-v2-connection-top pb-v2-connection-bottom',
    news: 'pt-v2-news-top pb-v2-news-bottom',
    subscription: 'pt-v2-subscription-top pb-v2-subscription-bottom',
    footer: 'pt-v2-footer-top pb-v2-footer-bottom',
}

defineProps({
    variant: {
        type: String,
        default: 'hero',
        validator: value => ['hero', 'platforms', 'connection', 'news', 'subscription', 'footer'].includes(value),
    },
})
</script>

<template>
    <section :class="['px-v2-gutter', SECTION_CLASSES[variant] ?? SECTION_CLASSES.hero]">
        <div class="mx-auto grid w-full max-w-v2-content min-w-0 grid-cols-1 gap-v2-stack">
            <slot />
        </div>
    </section>
</template>
