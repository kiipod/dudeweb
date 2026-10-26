<script setup>
import { Link } from '@inertiajs/vue3'
defineProps({ pagination: { type: Object, required: true }, label: { type: String, default: 'Страницы обращений' } })
</script>

<template>
    <nav v-if="pagination.last_page > 1" :aria-label="label" class="flex min-w-0 flex-wrap gap-compact">
        <template v-for="(link, index) in pagination.links" :key="index">
            <Link v-if="link.url" :href="link.url" :aria-current="link.active ? 'page' : undefined" class="inline-flex min-h-interface-header-control items-center rounded-control px-control-inline text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">{{ index === 0 ? 'Назад' : index === pagination.links.length - 1 ? 'Дальше' : link.label }}</Link>
            <span v-else aria-disabled="true" class="inline-flex min-h-interface-header-control items-center px-control-inline text-interface-body text-muted">{{ index === 0 ? 'Назад' : index === pagination.links.length - 1 ? 'Дальше' : link.label }}</span>
        </template>
    </nav>
</template>
