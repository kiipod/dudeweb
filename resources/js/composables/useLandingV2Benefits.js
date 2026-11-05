import { computed, onMounted, readonly, shallowRef, watch } from 'vue'
import { useDocumentVisibility, useElementBounding, useElementVisibility, useMediaQuery, useMutationObserver, usePreferredReducedMotion, useTimeoutFn, useWindowSize } from '@vueuse/core'

export function useLandingV2Benefits(track, stage, count) {
    const mounted = shallowRef(false)
    const active = shallowRef(0)
    const paused = shallowRef(false)
    const hovering = shallowRef(false)
    const inert = shallowRef(false)
    const delay = shallowRef(6450)
    const desktop = useMediaQuery('(min-width: 768px)')
    const reduced = usePreferredReducedMotion()
    const forcedColors = useMediaQuery('(forced-colors: active)')
    const tallViewport = useMediaQuery('(min-height: 680px)')
    const visibility = useDocumentVisibility()
    const inViewport = useElementVisibility(stage, { threshold: 0.05 })
    const main = computed(() => track.value?.closest('main'))
    useMutationObserver(main, () => { inert.value = Boolean(main.value?.inert) }, { attributes: true, attributeFilter: ['inert'] })

    const running = computed(() => mounted.value && desktop.value && !paused.value && !hovering.value
        && !inert.value && reduced.value !== 'reduce' && !forcedColors.value
        && visibility.value === 'visible' && inViewport.value)
    const timer = useTimeoutFn(() => {
        active.value = (active.value + 1) % count
        delay.value = 7000
        timer.start()
    }, delay, { immediate: false })

    watch(running, value => {
        timer.stop()
        delay.value = 6450
        if (value) timer.start()
    })
    onMounted(() => { mounted.value = true })

    // VueUse installs passive scroll/resize listeners and disposes them with the scope.
    // Reading is limited to these two bounds, with no animation frame loop.
    const stackEnabled = computed(() => !desktop.value && tallViewport.value && reduced.value !== 'reduce' && !forcedColors.value)
    const { top, height } = useElementBounding(() => stackEnabled.value ? track.value : null)
    const { height: stageHeight } = useElementBounding(() => stackEnabled.value ? stage.value : null, { windowScroll: false })
    const { height: viewportHeight } = useWindowSize({ initialHeight: 620 })
    const progress = computed(() => {
        if (!mounted.value || !height.value || !stageHeight.value) return 0
        return Math.max(0, Math.min(count - 1,
            (-top.value + 16) / Math.max(1, height.value - Math.max(stageHeight.value, viewportHeight.value)) * (count - 1)))
    })
    const layers = computed(() => {
        const whole = Math.floor(progress.value)
        const fraction = Math.max(0, Math.min(1, (progress.value - whole - 0.8) / 0.2))
        const visual = whole + fraction * fraction * (3 - 2 * fraction)
        return Array.from({ length: count }, (_, index) => ({
            '--v2-order': index,
            '--v2-arrival': Math.max(0, Math.min(1, visual - index + 1)),
            '--v2-age': Math.max(0, Math.min(count - 1, visual - index)),
        }))
    })

    function select(index) {
        paused.value = true
        active.value = index
    }

    function toggle() {
        paused.value = !paused.value
    }

    function enter(event) {
        if (event.pointerType === 'mouse') hovering.value = true
    }

    function leave() {
        hovering.value = false
    }

    function pause() {
        paused.value = true
    }

    return { active: readonly(active), paused: readonly(paused), running, layers, select, toggle, enter, leave, pause }
}
