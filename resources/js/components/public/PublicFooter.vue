<script setup>
import { Link } from '@inertiajs/vue3'
import BrandLink from '@/components/brand/BrandLink.vue'

defineProps({
    loginHref: {
        type: String,
        required: true,
    },
    navigationItems: {
        type: Array,
        required: true,
    },
    registerHref: {
        type: String,
        required: true,
    },
    supportHref: {
        type: String,
        required: true,
    },
})

const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="border-t border-border bg-surface">
        <div class="mx-auto max-w-shell px-shell-gutter py-section-md tablet:px-section-sm desktop:grid desktop:grid-cols-[var(--container-footer-brand)_1fr_var(--container-footer-meta)] desktop:gap-section-lg desktop:px-shell-desktop desktop:py-section-sm">
            <div>
                <BrandLink variant="horizontal" />
                <p class="mt-tight max-w-footer-copy text-ui-body text-secondary desktop:max-w-footer-brand desktop:text-ui-detail">
                    Простая подписка, быстрая настройка и поддержка без долгого ожидания.
                </p>
            </div>

            <div class="mt-panel flex flex-col gap-panel desktop:mt-0 desktop:grid desktop:grid-cols-3 desktop:gap-section-sm">
                <nav aria-label="Навигация в подвале" class="flex flex-col gap-tight">
                    <p class="font-mono text-ui-xs tracking-label text-muted">НАВИГАЦИЯ</p>
                    <a
                        v-for="item in navigationItems"
                        :key="item.href"
                        :href="item.href"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta"
                    >
                        {{ item.label }}
                    </a>
                </nav>

                <nav aria-label="Аккаунт" class="flex flex-col gap-tight">
                    <p class="font-mono text-ui-xs tracking-label text-muted">АККАУНТ</p>
                    <Link
                        :href="loginHref"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta"
                    >
                        Войти
                    </Link>
                    <Link
                        :href="registerHref"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta"
                    >
                        Регистрация
                    </Link>
                </nav>

                <nav aria-label="Информация" class="flex flex-col gap-tight">
                    <p class="font-mono text-ui-xs tracking-label text-muted">ИНФОРМАЦИЯ</p>
                    <a
                        :href="supportHref"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Поддержка
                        <span class="sr-only">(откроется в новой вкладке)</span>
                    </a>
                </nav>
            </div>

            <p class="mt-panel border-t border-border pt-content font-mono text-ui-xs text-muted desktop:mt-0 desktop:border-0 desktop:pt-0">
                © {{ currentYear }} dudeweb
            </p>
        </div>
    </footer>
</template>
