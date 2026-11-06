import { computed, shallowRef, watch } from 'vue'
import { useDocumentVisibility, useEventListener, useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'

// Coordinates are SVG units; the source shader's radius and offsets are CSS pixels.
export const LANDING_V2_WORDMARK = { width: 1996, height: 476.7254159117114, radius: 260, offsetX: 14, offsetY: 11 }

export function useLandingV2Wordmark(target) {
    const pointer = shallowRef(null)
    const fineDesktop = useMediaQuery('(width > 64rem) and (hover: hover) and (pointer: fine)')
    const reducedMotion = usePreferredReducedMotion()
    const forcedColors = useMediaQuery('(forced-colors: active)')
    const visibility = useDocumentVisibility()
    const allowed = computed(() => fineDesktop.value && reducedMotion.value !== 'reduce' && !forcedColors.value && visibility.value === 'visible')
    const glow = computed(() => allowed.value ? pointer.value : null)

    function reset() {
        pointer.value = null
    }

    function move(event) {
        if (!allowed.value || event.pointerType !== 'mouse') return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return
        const x = event.clientX - bounds.left
        const y = event.clientY - bounds.top
        const boundary = Math.max(0, Math.min(x, bounds.width - x, y, bounds.height - y))
        const fade = Math.min(1, boundary / 36)
        const scale = LANDING_V2_WORDMARK.width / bounds.width
        pointer.value = {
            x: x * scale,
            y: y * scale,
            radius: LANDING_V2_WORDMARK.radius * scale,
            dx: (x / bounds.width - 0.5) * 2 * LANDING_V2_WORDMARK.offsetX * scale,
            dy: (y / bounds.height - 0.5) * 2 * LANDING_V2_WORDMARK.offsetY * scale,
            opacity: fade * fade * (3 - 2 * fade),
        }
    }

    useEventListener(target, 'pointermove', move, { passive: true })
    useEventListener(target, ['pointerleave', 'pointercancel'], reset, { passive: true })
    useEventListener('scroll', reset, { passive: true })
    useEventListener('resize', reset, { passive: true })
    watch(allowed, reset)

    return { glow }
}
