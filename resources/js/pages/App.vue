<script setup>
import { Head } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })

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

    <main>
        <section class="relative py-24 sm:py-32" aria-labelledby="hero-title">
            <div class="mx-auto max-w-4xl px-4 text-center">
                <span class="mb-6 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
                    New release
                </span>
                <h1 id="hero-title" class="text-5xl font-bold tracking-tight sm:text-7xl">
                    Build faster with<br>
                    <span class="text-accent">Laravel & Vue</span>
                </h1>
                <p class="mx-auto mt-6 max-w-2xl text-lg text-secondary">
                    A modern stack combining Laravel, Inertia.js, Vue 3 and Tailwind CSS —
                    everything you need to ship focused web applications.
                </p>
                <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="#features"
                        class="rounded-button bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Get started
                    </a>
                    <a
                        href="#features"
                        class="rounded-button bg-elevated px-5 py-3 font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Learn more <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </section>

        <section id="features" class="py-16 sm:py-24" aria-labelledby="features-title">
            <div class="mx-auto max-w-6xl px-4">
                <div class="mb-12 text-center">
                    <h2 id="features-title" class="text-3xl font-bold">Everything you need</h2>
                    <p class="mt-4 text-lg text-secondary">
                        Built on proven technologies. Ready for production.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        <section id="cta" class="py-16" aria-labelledby="cta-title">
            <div class="mx-auto max-w-2xl px-4 text-center">
                <div class="rounded-dialog border border-border bg-elevated p-8">
                    <h2 id="cta-title" class="text-2xl font-bold">Ready to get started?</h2>
                    <p class="mt-3 text-secondary">
                        Start building your next project today.
                    </p>
                    <div class="mt-6 flex flex-wrap justify-center gap-3">
                        <a
                            href="#features"
                            class="rounded-button bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            Start for free
                        </a>
                        <a
                            href="#features"
                            class="rounded-button px-5 py-3 font-semibold text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            View stack
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
