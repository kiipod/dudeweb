<script setup>
import { useTheme } from '@/composables/useTheme'
const { activeTheme, setTheme } = useTheme()
const choices = [{ value: 'light', label: 'Светлая' }, { value: 'dark', label: 'Тёмная' }]
</script>

<template>
    <fieldset class="grid min-w-0 grid-cols-1 gap-profile-section">
        <legend class="mb-profile-section text-interface-title font-display">Тема оформления</legend>
        <div class="grid min-h-interface-control min-w-0 grid-cols-2 gap-profile-theme-inset rounded-button border border-border bg-interface-input p-profile-theme-inset">
            <label v-for="choice in choices" :key="choice.value" class="relative flex min-w-0 cursor-pointer items-center justify-center rounded-control px-control py-tight text-interface-meta has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus" :class="activeTheme === choice.value ? 'bg-accent-soft font-semibold text-accent-text' : 'font-medium text-secondary hover:bg-accent-soft'">
                <input type="radio" name="profile-theme" :value="choice.value" :checked="activeTheme === choice.value" class="sr-only" @change="setTheme(choice.value)">
                {{ choice.label }}
            </label>
        </div>
    </fieldset>
</template>
