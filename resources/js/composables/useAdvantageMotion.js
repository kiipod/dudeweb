import { computed, readonly, shallowRef } from 'vue'
import { useDocumentVisibility, useElementVisibility, useMediaQuery, usePreferredReducedMotion, useTimeoutFn } from '@vueuse/core'

export function useAdvantageMotion(target) {
    const inViewport = useElementVisibility(target, { threshold: 0.05 })
    const visibility = useDocumentVisibility()
    const preference = usePreferredReducedMotion()
    const forcedColors = useMediaQuery('(forced-colors: active)')
    const hovering = shallowRef(false)
    const playing = shallowRef(false)
    const { start } = useTimeoutFn(() => { playing.value = false }, 1800, { immediate: false })
    const running = computed(() => inViewport.value && visibility.value === 'visible'
        && preference.value === 'no-preference' && !forcedColors.value)
    const active = computed(() => hovering.value || playing.value)

    function play() {
        playing.value = true
        start()
    }

    function enter(event) {
        if (event.pointerType === 'mouse') hovering.value = true
    }

    function leave() {
        hovering.value = false
    }

    return { running, active, playing: readonly(playing), play, enter, leave }
}
