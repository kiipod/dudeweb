<script setup>
import LandingV2Section from '@/components/landing-v2/LandingV2Section.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

const PLATFORMS = [
    { label: 'Windows', icon: 'platform-windows' },
    { label: 'macOS', icon: 'platform-apple' },
    { label: 'Linux', icon: 'platform-linux' },
    { label: 'Android', icon: 'platform-android' },
    { label: 'iOS', icon: 'platform-apple' },
]
</script>

<template>
    <LandingV2Section id="devices" variant="platforms" aria-labelledby="v2-platforms-title" tabindex="-1" class="outline-none" data-v2-platforms>
        <div class="overflow-clip rounded-v2-panel ring-1 ring-v2-border ring-inset" data-v2-platform-table>
            <ul class="grid h-v2-platform-row grid-cols-5 divide-x divide-v2-border border-b border-v2-border" aria-label="Поддерживаемые платформы" data-v2-platform-row>
                <li v-for="platform in PLATFORMS" :key="platform.label" class="v2-platform-cell flex min-w-0 flex-col items-center justify-center gap-v2-platform-cell py-3 md:flex-row">
                    <UiIcon :name="platform.icon" class="v2-platform-icon text-v2-platform-glyph" />
                    <span class="v2-platform-label w-v2-platform-label text-center text-v2-platform-label font-semibold md:text-left">{{ platform.label }}</span>
                </li>
            </ul>
            <div class="v2-platform-information grid min-w-0 items-center">
                <div class="v2-platform-facts min-w-0">
                    <dl class="grid min-h-v2-platform-facts grid-cols-2 divide-x divide-v2-border border-b border-v2-border" data-v2-platform-facts>
                        <div class="flex min-w-0 flex-col items-center justify-center gap-2 p-v2-platform-fact-pad text-center">
                            <dt class="order-2 w-full text-v2-platform-explanation text-v2-secondary">устройств одновременно</dt>
                            <dd class="whitespace-nowrap text-v2-platform-limit font-medium tracking-v2-platform text-v2-platform-ink">До 5</dd>
                        </div>
                        <div class="flex min-w-0 flex-col items-center justify-center gap-2 p-v2-platform-fact-pad text-center">
                            <dt class="order-2 w-full text-v2-platform-explanation text-v2-secondary">для привычных платформ</dt>
                            <dd class="whitespace-nowrap text-v2-platform-access font-medium tracking-v2-platform text-v2-platform-ink">Один доступ</dd>
                        </div>
                    </dl>
                    <p class="min-h-v2-platform-setup px-v2-platform-setup-inline py-v2-platform-setup-block text-v2-platform-setup text-v2-secondary" data-v2-platform-setup>
                        Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках.
                    </p>
                </div>
                <div class="grid min-w-0 gap-5 p-v2-platform-story text-center" data-v2-platform-story>
                    <div class="flex min-w-0 items-center justify-center gap-4">
                        <span aria-hidden="true" class="h-v2-content-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand" />
                        <h2 id="v2-platforms-title" class="v2-platform-heading min-w-0 flex-1 text-v2-platform-heading font-medium tracking-v2-platform-heading v2-desktop:flex-none">
                            Где ты — там{{ ' ' }}<br class="v2-desktop:hidden">и dudeweb
                        </h2>
                    </div>
                    <p class="text-v2-platform-story text-v2-secondary">Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.</p>
                </div>
            </div>
        </div>
    </LandingV2Section>
</template>

<style scoped>
.v2-platform-icon {
    width: var(--spacing-v2-platform-glyph);
    height: var(--spacing-v2-platform-glyph);
}

.v2-platform-facts {
    border-bottom: 1px solid var(--color-v2-border);
}

@media (width >= 64rem) {
    .v2-platform-information {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .v2-platform-facts {
        border-right: 1px solid var(--color-v2-border);
        border-bottom: 0;
    }
}
</style>
