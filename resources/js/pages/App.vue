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
                <span class="mb-6 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    New release
                </span>
                <h1 id="hero-title" class="text-5xl font-bold tracking-tight sm:text-7xl">
                    Build faster with<br>
                    <span class="text-indigo-600 dark:text-indigo-400">Laravel & Vue</span>
                </h1>
                <p class="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
                    A modern stack combining Laravel, Inertia.js, Vue 3 and Tailwind CSS —
                    everything you need to ship focused web applications.
                </p>
                <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="#features"
                        class="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Get started
                    </a>
                    <a
                        href="#features"
                        class="rounded-lg bg-zinc-100 px-5 py-3 font-semibold text-zinc-800 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
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
                    <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
                        Built on proven technologies. Ready for production.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <article
                        v-for="feature in features"
                        :key="feature.title"
                        class="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div class="flex items-start gap-4">
                            <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-mono text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                {{ feature.marker }}
                            </span>
                            <div>
                                <h3 class="font-semibold">{{ feature.title }}</h3>
                                <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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
                <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 id="cta-title" class="text-2xl font-bold">Ready to get started?</h2>
                    <p class="mt-3 text-zinc-600 dark:text-zinc-300">
                        Start building your next project today.
                    </p>
                    <div class="mt-6 flex flex-wrap justify-center gap-3">
                        <a
                            href="#features"
                            class="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            Start for free
                        </a>
                        <a
                            href="#features"
                            class="rounded-lg px-5 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                            View stack
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
