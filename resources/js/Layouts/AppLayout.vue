<script setup>
import { Link } from '@inertiajs/vue3'

const currentYear = new Date().getFullYear()
</script>

<template>
    <div class="min-h-screen bg-white text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
        <header class="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
            <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
                <Link href="/" class="text-xl font-bold tracking-tight">
                    dudeweb
                </Link>

                <nav aria-label="Primary" class="hidden items-center gap-6 text-sm text-zinc-600 md:flex dark:text-zinc-300">
                    <a class="transition-colors hover:text-zinc-950 dark:hover:text-white" href="#features">
                        Features
                    </a>
                    <a class="transition-colors hover:text-zinc-950 dark:hover:text-white" href="#cta">
                        Get started
                    </a>
                </nav>

                <div class="ml-auto flex items-center gap-2">
                    <a
                        href="#cta"
                        class="hidden rounded-lg px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:inline-flex dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        Sign in
                    </a>
                    <a
                        href="#cta"
                        class="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Get started
                    </a>
                </div>
            </div>
        </header>

        <slot />

        <footer class="border-t border-zinc-200 dark:border-zinc-800">
            <div class="mx-auto max-w-6xl px-4 py-8">
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                    © {{ currentYear }} dudeweb. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
</template>
