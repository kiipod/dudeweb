<script setup>
defineProps({ item: { type: Object, required: true } })
</script>

<template>
    <article :aria-labelledby="`v2-news-${item.id}-title`" class="v2-news-card grid min-w-0 content-start gap-v2-news-card" :data-v2-news-card="item.id">
        <img :src="item.cover" alt="" width="1024" height="1024" class="v2-news-cover block w-full rounded-v2-news-cover border border-v2-cover-border object-cover" data-v2-news-cover>
        <div class="grid min-w-0 gap-v2-news-card" data-v2-news-copy>
            <div class="flex flex-wrap items-center gap-3 text-v2-news-meta" data-v2-news-metadata>
                <span class="rounded-v2-tag bg-v2-tag-surface px-v2-news-tag-inline py-v2-news-tag-block font-medium text-v2-tag-text" data-v2-news-category>{{ item.category }}</span>
                <time :datetime="item.date" class="whitespace-nowrap text-v2-date">{{ item.dateLabel }}</time>
            </div>
            <h3 :id="`v2-news-${item.id}-title`" class="text-v2-story-title font-medium tracking-v2-story whitespace-pre-line text-v2-story-ink">{{ item.title }}</h3>
        </div>
    </article>
</template>

<style scoped>
.v2-news-cover {
    height: auto;
    aspect-ratio: 50 / 49;
}

@media (48rem <= width < 64rem) {
    .v2-news-card {
        grid-template-columns: var(--spacing-v2-news-tablet-cover) minmax(0, 1fr);
        align-items: center;
        column-gap: var(--spacing-v2-news-grid);
    }

    .v2-news-cover {
        aspect-ratio: 1;
    }
}

@media (width >= 64rem) {
    .v2-news-cover {
        height: var(--spacing-v2-news-cover);
        aspect-ratio: auto;
    }
}
</style>
