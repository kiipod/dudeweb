<template>
    <div data-landing-v2 class="flex min-h-screen flex-col bg-v2-page font-sans text-v2-body font-normal text-v2-ink scheme-light">
        <slot name="header" />

        <main id="landing-v2-content" class="min-w-0 flex-1" tabindex="-1">
            <slot />
        </main>

        <slot name="footer" />
    </div>
</template>
