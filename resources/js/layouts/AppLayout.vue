<script setup>
import { Link } from '@inertiajs/vue3'
import BrandLogo from '@/components/brand/BrandLogo.vue'

const currentYear = new Date().getFullYear()
</script>

<template>
    <div class="min-h-screen bg-background text-foreground transition-colors">
        <header class="border-b border-border bg-background/90 backdrop-blur">
            <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
                <Link href="/" aria-label="dudeweb — на главную">
                    <BrandLogo variant="horizontal" />
                </Link>

                <nav aria-label="Primary" class="hidden items-center gap-6 text-sm text-secondary md:flex">
                    <a class="transition-colors hover:text-foreground" href="#features">
                        Features
                    </a>
                    <a class="transition-colors hover:text-foreground" href="#cta">
                        Get started
                    </a>
                </nav>

                <div class="ml-auto flex items-center gap-2">
                    <a
                        href="#cta"
                        class="hidden rounded-control-sm px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:inline-flex"
                    >
                        Sign in
                    </a>
                    <a
                        href="#cta"
                        class="inline-flex rounded-control-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Get started
                    </a>
                </div>
            </div>
        </header>

        <slot />

        <footer class="border-t border-border">
            <div class="mx-auto max-w-6xl px-4 py-8">
                <p class="text-sm text-muted">
                    © {{ currentYear }} dudeweb. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
</template>
