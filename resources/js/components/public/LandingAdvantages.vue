<script setup>
import { computed } from 'vue'
import LandingAdvantageCard from './LandingAdvantageCard.vue'

const props = defineProps({ deviceLimit: { type: Number, default: null } })
const features = computed(() => [
    { icon: 'zap', title: 'Подключился — и погнали', copy: 'Никаких сложных настроек. Пара простых действий — и любимые сервисы снова под рукой.' },
    { icon: 'gauge', title: 'Скорость без компромиссов', copy: 'Смотри видео, созванивайся, работай и переключайся между задачами с комфортом.' },
    { icon: 'monitor-smartphone', title: props.deviceLimit ? `Один доступ. До ${props.deviceLimit} устройств` : 'Один доступ для твоих устройств', copy: 'Пользуйся сервисом на смартфоне, ноутбуке или планшете и делись подпиской с близкими.' },
    { icon: 'shield-check', title: 'Твоё соединение под защитой', copy: 'Защищённое подключение для работы, общения и повседневных задач.' },
    { icon: 'infinity', title: 'Больше свободы каждый день', copy: 'Любимые инструменты для творчества, развлечений и общения — в одном подключении.' },
    { icon: 'heart-handshake', title: 'Мы рядом', copy: 'Возникли вопросы? Поможем разобраться с подключением и использованием сервиса.' },
])
</script>

<template>
    <section id="advantages" class="scroll-mt-public-header bg-landing-section tablet:scroll-mt-public-header-tablet desktop:scroll-mt-public-header-wide" aria-labelledby="advantages-title">
        <div class="mx-auto flex w-full max-w-landing flex-col gap-landing-stack px-landing-gutter py-landing-section">
            <div class="mx-auto flex w-full max-w-landing-intro flex-col gap-landing-intro-gap text-left tablet:text-center">
                <h2 id="advantages-title" class="text-landing-heading font-normal tracking-landing-heading break-words">
                    Всё просто.<br>Всё работает.<br>Всё для тебя.
                </h2>
                <p class="text-landing-intro text-footer-secondary">
                    dudeweb создан, чтобы технологии не мешали заниматься тем, что тебе нравится.
                </p>
            </div>
            <div class="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
                <LandingAdvantageCard v-for="feature in features" :key="feature.icon" :feature="feature" />
            </div>
        </div>
    </section>
</template>
