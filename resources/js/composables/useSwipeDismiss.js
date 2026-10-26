import { toValue, watch } from 'vue'

const DISTANCE = 64
const DIRECTION_RATIO = 1.25
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

export function useSwipeDismiss({ panel, open, busy = false, close }) {
    let gesture = null

    function reset() { gesture = null }
    function available() {
        return toValue(open) && !toValue(busy) && window.matchMedia('(width < 75rem)').matches
    }
    function scrolled(target) {
        for (let element = target; element; element = element.parentElement) {
            if (element.scrollTop > 0 && element.scrollHeight > element.clientHeight) return true
            if (element === panel.value) break
        }
        return false
    }
    function start(event) {
        reset()
        const target = event.target
        if (!available() || event.touches.length !== 1 || target.closest(EDITABLE) || scrolled(target)) return
        const touch = event.touches[0]
        gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY }
    }
    function move(event) {
        if (!gesture) return
        if (!available() || event.touches.length !== 1) return reset()
        const touch = [...event.touches].find(touch => touch.identifier === gesture.id)
        if (!touch) return reset()
        const dx = Math.abs(touch.clientX - gesture.x)
        const dy = touch.clientY - gesture.y
        if (dy < -8 || (dx > 8 && dx > Math.abs(dy))) return reset()
        if (dy > 0 && dy > dx * DIRECTION_RATIO && event.cancelable) event.preventDefault()
    }
    function end(event) {
        const previous = gesture
        reset()
        if (!previous || !available() || event.touches.length) return
        const touch = [...event.changedTouches].find(touch => touch.identifier === previous.id)
        if (!touch) return
        const dx = Math.abs(touch.clientX - previous.x)
        const dy = touch.clientY - previous.y
        if (dy < DISTANCE || dy <= dx * DIRECTION_RATIO) return
        if (event.cancelable) event.preventDefault()
        close()
    }

    watch([() => toValue(open), () => toValue(busy)], reset)
    watch(panel, (element, previous, onCleanup) => {
        reset()
        if (!element) return
        element.addEventListener('touchstart', start, { passive: true })
        element.addEventListener('touchmove', move, { passive: false })
        element.addEventListener('touchend', end, { passive: false })
        element.addEventListener('touchcancel', reset, { passive: true })
        onCleanup(() => {
            element.removeEventListener('touchstart', start)
            element.removeEventListener('touchmove', move)
            element.removeEventListener('touchend', end)
            element.removeEventListener('touchcancel', reset)
            reset()
        })
    }, { flush: 'post' })
}
