<script setup>
import { Head } from '@inertiajs/vue3'
import LandingHero from '@/components/public/LandingHero.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'

defineOptions({ layout: PublicLayout })

const features = [
    { marker: '01', title: 'Laravel Backend', description: 'Powerful routing, Eloquent ORM, queues, events.' },
    { marker: '02', title: 'Inertia.js', description: 'Server-side routing without building a full API.' },
    { marker: '03', title: 'Vue 3', description: 'Reactive UI with Composition API and all modern Vue 3 features.' },
    { marker: '04', title: 'Tailwind CSS v4', description: 'Utility-first CSS framework with CSS-first configuration.' },
    { marker: '05', title: 'Vite', description: 'Lightning-fast HMR and optimized production builds.' },
    { marker: '06', title: 'SSR ready', description: 'A server-rendering entrypoint for fast initial responses.' },
]
</script>

<template>
    <Head title="Home" />

    <div>
        <LandingHero />

        <section id="advantages" class="scroll-mt-public-header-desktop py-16 sm:py-24" aria-labelledby="features-title">
            <span id="devices" class="block scroll-mt-public-header-desktop" aria-hidden="true" />
            <div class="mx-auto max-w-page px-shell-gutter tablet:px-section-sm desktop:px-shell-desktop">
                <div class="mb-12 text-center">
                    <h2 id="features-title" class="text-3xl font-bold">Everything you need</h2>
                    <p class="mt-4 text-lg text-secondary">
                        Built on proven technologies. Ready for production.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-6">
                    <article
                        v-for="feature in features"
                        :key="feature.title"
                        class="rounded-panel border border-border bg-surface p-6"
                    >
                        <div class="flex items-start gap-4">
                            <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-control-sm bg-accent-soft font-mono text-sm font-semibold text-accent">
                                {{ feature.marker }}
                            </span>
                            <div>
                                <h3 class="font-semibold">{{ feature.title }}</h3>
                                <p class="mt-1 text-sm leading-6 text-secondary">
                                    {{ feature.description }}
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section id="pricing" class="scroll-mt-public-header-desktop py-16" aria-labelledby="cta-title">
            <div class="mx-auto max-w-2xl px-shell-gutter text-center tablet:px-section-sm">
                <div class="rounded-dialog border border-border bg-elevated p-8">
                    <h2 id="cta-title" class="text-2xl font-bold">Ready to get started?</h2>
                    <p class="mt-3 text-secondary">
                        Start building your next project today.
                    </p>
                    <div class="mt-6 flex flex-wrap justify-center gap-3">
                        <a
                            href="#devices"
                            class="rounded-button bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Start for free
                        </a>
                        <a
                            href="#devices"
                            class="rounded-button px-5 py-3 font-semibold text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            View stack
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
