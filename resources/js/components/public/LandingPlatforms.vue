<script setup>
import UiIcon from '@/components/ui/UiIcon.vue'

const PLATFORMS = [
    { id: 'windows', label: 'Windows', icon: 'platform-windows', color: 'text-platform-windows' },
    { id: 'macos', label: 'macOS', icon: 'platform-apple', color: 'text-platform-macos' },
    { id: 'linux', label: 'Linux', icon: 'platform-linux', color: 'text-platform-linux' },
    { id: 'android', label: 'Android', icon: 'platform-android', color: 'text-platform-android' },
    { id: 'ios', label: 'iOS', icon: 'platform-apple', color: 'text-platform-ios' },
]
</script>

<template>
    <section id="devices" class="scroll-mt-public-header tablet:scroll-mt-public-header-tablet desktop:scroll-mt-public-header-wide" aria-labelledby="platforms-title">
        <div class="mx-auto flex min-h-platform-height w-full max-w-landing flex-col gap-platform-stack px-landing-gutter py-platform-section">
            <div class="mx-auto flex w-full max-w-landing-intro flex-col gap-landing-intro-gap text-left tablet:text-center">
                <h2 id="platforms-title" class="text-platform-heading font-normal tracking-platform-heading">Где ты — там<br>и dudeweb</h2>
                <p class="text-platform-copy text-footer-secondary">Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.</p>
            </div>
            <ul class="grid grid-cols-2 gap-platform-grid-gap desktop:grid-cols-5">
                <li
                    v-for="platform in PLATFORMS"
                    :key="platform.id"
                    class="flex min-h-platform-card items-center justify-center gap-platform-card-gap rounded-platform-card bg-landing-platform px-tight text-platform-label font-semibold ring-1 ring-landing-platform-border ring-inset last:col-span-2 desktop:last:col-span-1"
                >
                    <UiIcon :name="platform.icon" :class="platform.color" size="platform" />
                    <span class="min-w-0 break-words">{{ platform.label }}</span>
                </li>
            </ul>
            <p class="text-center text-platform-note text-footer-muted">Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках.</p>
        </div>
    </section>
</template>
