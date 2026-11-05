import { computed, onMounted, shallowRef, watch } from 'vue'
import { useDocumentVisibility, useElementVisibility, useMediaQuery, useMutationObserver, usePreferredReducedMotion, useRafFn } from '@vueuse/core'
import { LANDING_V2_SIGNAL_NODES, signalPresence, signalPulseX, signalRing, signalWavePath, signalWavePulseX } from '@/data/landingV2Signal'

export function useLandingV2SignalMotion(target) {
    const mounted = shallowRef(false)
    const inert = shallowRef(false)
    const inViewport = useElementVisibility(target, { threshold: 0.01 })
    const visibility = useDocumentVisibility()
    const reduced = usePreferredReducedMotion()
    const forcedColors = useMediaQuery('(forced-colors: active)')
    const main = computed(() => target.value?.closest('main'))
    const staticMode = computed(() => reduced.value === 'reduce' || forcedColors.value)
    const running = computed(() => mounted.value && inViewport.value && visibility.value === 'visible' && !inert.value && !staticMode.value)
    const state = computed(() => !mounted.value || staticMode.value ? 'static' : running.value ? 'running' : 'paused')
    let elapsed = 0
    let elements

    useMutationObserver(main, () => { inert.value = Boolean(main.value?.inert) }, { attributes: true, attributeFilter: ['inert'] })

    function moveGradient(gradient, center, halfWidth) {
        gradient.setAttribute('x1', (center - halfWidth).toFixed(3))
        gradient.setAttribute('x2', (center + halfWidth).toFixed(3))
    }

    function render(time, isStatic = false) {
        // Cached refs only: no geometry/style reads or per-frame reactive state.
        elements.pairs.forEach((pair, index) => {
            const node = LANDING_V2_SIGNAL_NODES[index]
            pair.setAttribute('opacity', isStatic ? '0.82' : signalPresence(node, time).toFixed(5))
            moveGradient(elements.incoming[index], signalPulseX(node, time), 36)
        })
        elements.waves.forEach((wave, index) => {
            const path = signalWavePath(index, time)
            wave.forEach(element => element.setAttribute('d', path))
            moveGradient(elements.outgoing[index], signalWavePulseX(index, time), 56)
        })
        elements.rings.forEach((element, index) => {
            const ring = signalRing(index, time)
            element.setAttribute('r', ring.radius.toFixed(3))
            element.setAttribute('opacity', ring.opacity.toFixed(5))
        })
    }

    const { pause, resume } = useRafFn(({ delta }) => {
        elapsed += delta / 1000
        render(elapsed)
    }, { immediate: false, fpsLimit: 30 })

    watch([running, staticMode], ([enabled, isStatic]) => {
        pause()
        if (!elements) return
        if (isStatic) {
            elapsed = 0
            render(0, true)
        } else if (enabled) {
            render(elapsed)
            resume()
        }
    }, { flush: 'post' })

    onMounted(() => {
        const root = target.value
        elements = {
            pairs: [...root.querySelectorAll('[data-v2-signal-pair]')],
            incoming: [...root.querySelectorAll('[data-v2-signal-incoming]')],
            outgoing: [...root.querySelectorAll('[data-v2-signal-outgoing]')],
            waves: [...root.querySelectorAll('[data-v2-signal-wave]')].map(group => [...group.querySelectorAll('path')]),
            rings: [...root.querySelectorAll('[data-v2-signal-ring]')],
        }
        inert.value = Boolean(main.value?.inert)
        mounted.value = true
    })

    return { state }
}
