<script setup>
import { Link } from '@inertiajs/vue3'
import LandingV2Wordmark from '@/components/landing-v2/LandingV2Wordmark.vue'
import { LANDING_V2_LOGIN, LANDING_V2_NAVIGATION, LANDING_V2_SUPPORT, LANDING_V2_TRIAL } from '@/data/landingV2Navigation'

const LINK_CLASSES = 'w-fit text-v2-footer-link text-v2-secondary underline-offset-4 transition-colors duration-(--v2-duration-control) motion-reduce:transition-none hover:text-v2-focus hover:underline outline-none keyboard-focus:underline keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus'
const groups = [
    { label: 'Навигация', items: LANDING_V2_NAVIGATION },
    { label: 'Аккаунт', items: [{ label: 'Войти', href: LANDING_V2_LOGIN, inertia: true }, { label: 'Регистрация', href: LANDING_V2_TRIAL, inertia: true }] },
    { label: 'Информация', items: [{ label: 'Поддержка', href: LANDING_V2_SUPPORT, external: true }, { label: 'Пользовательское соглашение' }, { label: 'Политика конфиденциальности' }] },
]
</script>

<template>
    <footer data-v2-footer data-v2-menu-background class="border-t border-v2-section-border px-v2-gutter pt-v2-footer-top pb-v2-footer-bottom">
        <div class="mx-auto flex w-full max-w-v2-content min-w-0 flex-col gap-v2-footer-stack">
            <div class="flex min-w-0 items-center">
                <Link href="/landing" aria-label="dudeweb — главная" class="inline-flex w-fit items-center gap-3 outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus">
                    <img src="/landing-v2/brand/mark.svg" alt="" width="44" height="36" class="h-v2-mark-height w-v2-mark-width shrink-0">
                    <span class="text-v2-footer-brand font-medium tracking-v2-footer-brand text-v2-login-ink">dudeweb</span>
                </Link>
            </div>
            <div data-v2-footer-links class="grid min-w-0 grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3 md:gap-v2-footer-links">
                <nav v-for="group in groups" :key="group.label" :aria-label="`${group.label} в подвале`" data-v2-footer-group class="flex min-w-0 flex-col gap-3.5 last:col-span-2 md:last:col-span-1">
                    <p class="text-v2-footer-label font-medium text-v2-focus">{{ group.label }}</p>
                    <template v-for="item in group.items" :key="item.label">
                        <span v-if="!item.href" class="text-v2-footer-link text-v2-secondary">{{ item.label }}</span>
                        <Link v-else-if="item.inertia" :href="item.href" :class="LINK_CLASSES">{{ item.label }}</Link>
                        <a v-else :href="item.href" :class="LINK_CLASSES" :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noopener noreferrer' : undefined">
                            {{ item.label }}<span v-if="item.external" class="sr-only"> (откроется в новой вкладке)</span>
                        </a>
                    </template>
                </nav>
            </div>
            <LandingV2Wordmark />
            <div data-v2-footer-legal class="flex min-w-0 flex-col gap-3 border-t border-v2-divider pt-v2-footer-legal md:flex-row md:items-center md:gap-v2-footer-legal-gap">
                <p class="min-w-0 text-v2-footer-copy text-v2-secondary md:w-v2-footer-description">Простая подписка, быстрая настройка и поддержка без долгого ожидания.</p>
                <p class="text-right text-v2-footer-meta whitespace-nowrap text-v2-secondary md:flex-1">© 20— dudeweb</p>
            </div>
        </div>
    </footer>
</template>
