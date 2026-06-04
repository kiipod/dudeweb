<script>
import { Head } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'

export default {
    components: { Head },
    layout: AppLayout,
    data() {
        return {
            features: [
                { title: 'Laravel Backend', description: 'Powerful routing, Eloquent ORM, queues, events.', icon: 'i-lucide-server' },
                { title: 'Inertia.js', description: 'Server-side routing without building a full API.', icon: 'i-lucide-zap' },
                { title: 'Vue 3', description: 'Reactive UI with Composition API and all modern Vue 3 features.', icon: 'i-lucide-layers' },
                { title: 'Nuxt UI', description: '125+ accessible, production-ready components with dark mode.', icon: 'i-lucide-sparkles' },
                { title: 'Tailwind CSS v4', description: 'Utility-first CSS framework with zero configuration.', icon: 'i-lucide-paintbrush' },
                { title: 'Vite', description: 'Lightning fast HMR and optimized production builds.', icon: 'i-lucide-rocket' },
            ],
        }
    },
}
</script>

<template>
    <Head title="Home" />

    <UMain>
        <!-- Hero -->
        <div class="relative py-24 sm:py-32">
            <div class="mx-auto max-w-4xl px-4 text-center">
                <UBadge label="New release" variant="subtle" class="mb-6" />
                <h1 class="text-5xl font-bold tracking-tight text-highlighted sm:text-7xl">
                    Build faster with<br>
                    <span class="text-primary">Laravel & Nuxt UI</span>
                </h1>
                <p class="mt-6 text-lg text-muted max-w-2xl mx-auto">
                    A modern stack combining Laravel, Inertia.js, Vue 3 and Nuxt UI —
                    everything you need to ship beautiful apps.
                </p>
                <div class="mt-10 flex items-center justify-center gap-4">
                    <UButton size="xl" label="Get started" to="#" />
                    <UButton size="xl" label="Learn more" color="neutral" variant="subtle" trailing-icon="i-lucide-arrow-right" to="#" />
                </div>
            </div>
        </div>

        <!-- Features -->
        <div class="py-16 sm:py-24">
            <div class="mx-auto max-w-6xl px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-highlighted">Everything you need</h2>
                    <p class="mt-4 text-lg text-muted">Built on proven technologies. Ready for production.</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <UCard v-for="feature in features" :key="feature.title">
                        <div class="flex items-start gap-4">
                            <UIcon :name="feature.icon" class="text-primary size-6 mt-0.5 shrink-0" />
                            <div>
                                <p class="font-semibold text-highlighted">{{ feature.title }}</p>
                                <p class="mt-1 text-sm text-muted">{{ feature.description }}</p>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div class="py-16">
            <div class="mx-auto max-w-2xl px-4 text-center">
                <UCard class="p-8">
                    <h2 class="text-2xl font-bold text-highlighted">Ready to get started?</h2>
                    <p class="mt-3 text-muted">Start building your next project today.</p>
                    <div class="mt-6 flex justify-center gap-3">
                        <UButton size="lg" label="Start for free" to="#" />
                        <UButton size="lg" label="View docs" color="neutral" variant="ghost" to="#" />
                    </div>
                </UCard>
            </div>
        </div>
    </UMain>
</template>
