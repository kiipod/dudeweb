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
    <footer class="border-t border-border bg-public-footer">
        <div class="mx-auto max-w-shell px-shell-gutter pt-section-md pb-panel tablet:px-section-sm desktop:flex desktop:justify-between desktop:px-shell-wide desktop:pt-10 desktop:pb-panel wide:pt-13 wide:pb-section-sm">
            <div class="desktop:w-footer-brand-wide">
                <BrandLink scale="footer" variant="horizontal" />
                <p class="mt-tight max-w-footer-copy text-ui-body text-secondary desktop:max-w-footer-brand desktop:text-ui-detail wide:max-w-none wide:text-ui-action">
                    Простая подписка, быстрая настройка и поддержка без долгого ожидания.
                </p>
            </div>

            <div class="mt-panel flex min-w-0 flex-col gap-7 desktop:mt-0 desktop:grid desktop:w-footer-links-wide desktop:grid-cols-[140fr_130fr_246fr] desktop:gap-footer-links-gap-wide wide:grid-cols-[8.75rem_8.125rem_15.375rem]">
                <nav aria-label="Навигация в подвале" class="flex flex-col gap-tight">
                    <p class="font-mono text-ui-xs tracking-label text-muted">НАВИГАЦИЯ</p>
                    <a
                        v-for="item in navigationItems"
                        :key="item.href"
                        :href="item.href"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta wide:text-ui-body"
                    >
                        {{ item.label }}
                    </a>
                </nav>

                <nav aria-label="Аккаунт" class="flex flex-col gap-tight">
                    <p class="font-mono text-ui-xs tracking-label text-muted">АККАУНТ</p>
                    <Link
                        :href="loginHref"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta wide:text-ui-body"
                    >
                        Войти
                    </Link>
                    <Link
                        :href="registerHref"
                        class="w-fit rounded-control-sm text-ui-body text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-ui-meta wide:text-ui-body"
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

            <p class="mt-panel border-t border-border pt-content font-mono text-ui-xs text-muted desktop:mt-0 desktop:w-footer-meta-wide desktop:border-0 desktop:pt-0 wide:text-ui-meta">
                © {{ currentYear }} dudeweb
            </p>
        </div>
    </footer>
</template>
