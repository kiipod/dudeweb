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
const LINK_CLASSES = 'w-fit rounded-control-sm text-footer-link text-footer-secondary transition-colors duration-200 motion-reduce:transition-none hover:text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:text-footer-link-tablet desktop:text-footer-link-wide'
const LABEL_CLASSES = 'font-mono text-footer-label font-medium tracking-footer-label text-foreground desktop:text-footer-label-wide'
</script>

<template>
    <footer class="border-t border-border bg-public-footer">
        <div class="mx-auto max-w-shell px-shell-gutter pt-section-md pb-panel tablet:px-section-sm desktop:flex desktop:justify-between desktop:px-shell-wide desktop:pt-footer-top-wide desktop:pb-footer-bottom-wide">
            <div class="desktop:w-footer-brand-wide">
                <BrandLink scale="footer" variant="horizontal" />
                <p class="mt-3.5 text-footer-copy text-footer-secondary desktop:mt-footer-brand-gap-wide desktop:text-footer-copy-wide">
                    Простая подписка, быстрая настройка и поддержка без долгого ожидания.
                </p>
            </div>

            <div class="mt-panel flex min-w-0 flex-col gap-7 tablet:gap-5 desktop:mt-0 desktop:grid desktop:w-footer-links-wide desktop:grid-cols-[140fr_130fr_246fr] desktop:gap-footer-links-gap-wide wide:grid-cols-[8.75rem_8.125rem_18.75rem]">
                <nav aria-label="Навигация в подвале" class="flex flex-col gap-tight">
                    <p :class="LABEL_CLASSES">НАВИГАЦИЯ</p>
                    <a
                        v-for="item in navigationItems"
                        :key="item.href"
                        :href="item.href"
                        :class="LINK_CLASSES"
                    >
                        {{ item.label }}
                    </a>
                </nav>

                <nav aria-label="Аккаунт" class="flex flex-col gap-tight">
                    <p :class="LABEL_CLASSES">АККАУНТ</p>
                    <Link
                        :href="loginHref"
                        :class="LINK_CLASSES"
                    >
                        Войти
                    </Link>
                    <Link
                        :href="registerHref"
                        :class="LINK_CLASSES"
                    >
                        Регистрация
                    </Link>
                </nav>

                <nav aria-label="Информация" class="flex flex-col gap-tight">
                    <p :class="LABEL_CLASSES">ИНФОРМАЦИЯ</p>
                    <a
                        :href="supportHref"
                        :class="LINK_CLASSES"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Поддержка
                        <span class="sr-only">(откроется в новой вкладке)</span>
                    </a>
                </nav>
            </div>

            <p class="mt-panel border-t border-border pt-5 font-mono text-footer-meta text-footer-muted desktop:mt-0 desktop:w-footer-meta-wide desktop:border-0 desktop:pt-0 desktop:text-footer-meta-wide">
                © {{ currentYear }} dudeweb
            </p>
        </div>
    </footer>
</template>
