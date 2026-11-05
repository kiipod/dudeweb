<script setup>
import LandingV2NewsCard from '@/components/landing-v2/LandingV2NewsCard.vue'
import LandingV2Section from '@/components/landing-v2/LandingV2Section.vue'
import { LANDING_V2_NEWS } from '@/data/landingV2News'
</script>

<template>
    <LandingV2Section variant="news" aria-labelledby="v2-news-title" data-v2-news>
        <div data-v2-news-grid>
            <div class="flex flex-wrap items-center justify-between gap-2 px-v2-news-heading-inline py-v2-news-heading-block shadow-v2-news-rule md:gap-4" data-v2-news-heading>
                <div class="flex shrink-0 items-center gap-v2-news-marker">
                    <span class="h-v2-content-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand" aria-hidden="true" />
                    <h2 id="v2-news-title" class="text-v2-section-heading font-medium tracking-v2-section text-v2-heading">Новости сервиса</h2>
                </div>
                <span class="inline-flex h-v2-news-all-height shrink-0 items-center justify-center gap-v2-news-all rounded-v2-panel bg-v2-brand px-v2-news-all-inline text-v2-news-all font-medium text-v2-ink" data-v2-news-all>
                    Все новости
                    <svg class="size-v2-news-arrow shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                </span>
            </div>
            <div class="grid min-w-0 items-start gap-v2-news-grid px-v2-news-list-inline pt-v2-news-list-top pb-v2-news-list-bottom v2-tablet-wide:grid-cols-3" data-v2-news-list>
                <LandingV2NewsCard v-for="item in LANDING_V2_NEWS" :key="item.id" :item="item" />
            </div>
        </div>
    </LandingV2Section>
</template>
