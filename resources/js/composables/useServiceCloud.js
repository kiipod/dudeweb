import { onBeforeUnmount, onMounted, readonly, shallowRef } from 'vue'
import { createServiceCloudRenderer, loadServiceLogos } from '@/utils/serviceCloudRenderer'

const HOVER_SPEED = 1.2
const IDLE_SPEED = 0.105
const DRAG_SPEED_LIMIT = 2.4
const RESPONSE_SECONDS = 0.16
const INERTIA_SECONDS = 0.4
const REST_SPEED = 0.001

export function useServiceCloud(svgRef, {
    onUnavailable,
    createRenderer = createServiceCloudRenderer,
    loadLogos = loadServiceLogos,
} = {}) {
    const state = shallowRef('loading')
    const running = shallowRef(false)
    const interactive = shallowRef(false)
    const dragging = shallowRef(false)
    const rotation = [0, 0]
    const velocity = [0, 0]
    const targetVelocity = [0, 0]
    let pointer = null
    let hovering = false
    let dirty = false
    let renderer = null
    let frame = null
    let previousTime = null
    let elapsed = 0
    let disposed = false
    let inViewport = true
    let hasSize = false
    let logos = null
    let renderedTheme = null
    let reducedMotion = null
    let forcedColors = null
    let desktop = null
    let finePointer = null
    let resizeObserver = null
    let intersectionObserver = null
    let themeObserver = null

    function stop() {
        if (frame !== null) window.cancelAnimationFrame(frame)
        frame = null
        previousTime = null
        running.value = false
    }

    function canAnimate() {
        return renderer && logos && hasSize && inViewport && !document.hidden
            && !reducedMotion.matches && !forcedColors.matches && !disposed
            && (!desktop.matches || finePointer.matches)
    }

    function needsFrame() {
        if (!desktop.matches) return true
        if (dragging.value) return dirty
        if (!hovering) return true
        return velocity.some(value => Math.abs(value) > REST_SPEED)
            || targetVelocity.some(value => value !== 0)
    }

    function queue() {
        if (frame !== null || !canAnimate() || !needsFrame()) return
        running.value = true
        frame = window.requestAnimationFrame(advance)
    }

    function resetInput() {
        const captured = pointer?.id
        pointer = null
        dragging.value = false
        hovering = false
        dirty = false
        velocity.fill(0)
        targetVelocity.fill(0)
        if (captured !== undefined && svgRef.value?.hasPointerCapture(captured)) {
            svgRef.value.releasePointerCapture(captured)
        }
    }

    function updateHover(event) {
        const bounds = svgRef.value.getBoundingClientRect()
        const clamp = value => Math.max(-1, Math.min(1, value))
        const x = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1)
        const y = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1)
        hovering = true
        targetVelocity[0] = -y * HOVER_SPEED
        targetVelocity[1] = x * HOVER_SPEED
    }

    function onPointerMove(event) {
        if (!interactive.value || event.pointerType !== 'mouse') return
        if (!dragging.value) {
            updateHover(event)
        } else if (event.pointerId === pointer.id) {
            const bounds = svgRef.value.getBoundingClientRect()
            const scale = Math.PI / Math.min(bounds.width, bounds.height)
            const delta = Math.max(1 / 120, (event.timeStamp - pointer.time) / 1000)
            const movement = [-(event.clientY - pointer.y) * scale, (event.clientX - pointer.x) * scale]
            movement.forEach((angle, axis) => {
                rotation[axis] = (rotation[axis] + angle) % (Math.PI * 2)
                velocity[axis] = Math.max(-DRAG_SPEED_LIMIT, Math.min(DRAG_SPEED_LIMIT, angle / delta))
            })
            pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp }
            dirty = true
        }
        queue()
    }

    function onPointerDown(event) {
        if (!interactive.value || event.pointerType !== 'mouse' || event.button !== 0) return
        event.preventDefault()
        stop()
        velocity.fill(0)
        targetVelocity.fill(0)
        dragging.value = true
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp }
        svgRef.value.setPointerCapture(event.pointerId)
    }

    function onPointerUp(event) {
        if (!pointer || event.pointerId !== pointer.id) return
        const captured = pointer.id
        pointer = null
        dragging.value = false
        hovering = false
        targetVelocity.fill(0)
        if (svgRef.value.hasPointerCapture(captured)) svgRef.value.releasePointerCapture(captured)
        queue()
    }

    function onPointerLeave() {
        if (dragging.value) return
        hovering = false
        targetVelocity.fill(0)
        queue()
    }

    function onPointerCancel() {
        // A normal release also emits lostpointercapture; keep its inertia.
        if (!dragging.value) return
        resetInput()
        stop()
        queue()
    }

    function draw() {
        if (!renderer || !logos || disposed || forcedColors.matches) return
        const bounds = svgRef.value.getBoundingClientRect()
        hasSize = bounds.width > 0 && bounds.height > 0
        if (!hasSize) return
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        if (renderedTheme !== theme) {
            renderer.setTheme(theme)
            renderedTheme = theme
        }
        renderer.resize(bounds.width, bounds.height)
        renderer.draw({
            time: elapsed,
            orbit: !desktop.matches,
            staticMotion: reducedMotion.matches || (desktop.matches && !finePointer.matches),
            rotation: [...rotation],
        })
        dirty = false
    }

    function advance(timestamp) {
        frame = null
        if (!canAnimate()) {
            // Media state can change before its change event is delivered.
            // Paint the static scene before cancelling the last active frame.
            draw()
            resetInput()
            interactive.value = false
            stop()
            return
        }
        const delta = previousTime === null ? 0 : Math.max(0, Math.min(timestamp - previousTime, 64)) / 1000
        if (!desktop.matches) elapsed += delta
        else if (!dragging.value) {
            for (let axis = 0; axis < 2; axis++) {
                const target = hovering ? targetVelocity[axis] : axis === 1 ? IDLE_SPEED : 0
                const response = hovering ? RESPONSE_SECONDS : INERTIA_SECONDS
                velocity[axis] += (target - velocity[axis]) * (1 - Math.exp(-delta / response))
                if (Math.abs(velocity[axis] - target) < REST_SPEED) velocity[axis] = target
                rotation[axis] = (rotation[axis] + velocity[axis] * delta) % (Math.PI * 2)
            }
        }
        previousTime = timestamp
        draw()
        if (needsFrame()) frame = window.requestAnimationFrame(advance)
        else stop()
    }

    function refresh() {
        stop()
        resetInput()
        draw()
        interactive.value = Boolean(canAnimate() && desktop.matches && finePointer.matches)
        queue()
    }

    function fail() {
        if (disposed || state.value === 'unavailable') return
        stop()
        resetInput()
        interactive.value = false
        renderer?.destroy()
        renderer = null
        state.value = 'unavailable'
        onUnavailable?.()
    }

    onMounted(async () => {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
        forcedColors = window.matchMedia('(forced-colors: active)')
        desktop = window.matchMedia('(min-width: 75rem)')
        finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
        reducedMotion.addEventListener('change', refresh)
        forcedColors.addEventListener('change', refresh)
        desktop.addEventListener('change', refresh)
        finePointer.addEventListener('change', refresh)
        document.addEventListener('visibilitychange', refresh)
        window.addEventListener('resize', refresh, { passive: true })
        window.addEventListener('blur', refresh)
        window.addEventListener('scroll', refresh, { passive: true })

        resizeObserver = new ResizeObserver(refresh)
        resizeObserver.observe(svgRef.value)
        intersectionObserver = new IntersectionObserver(entries => {
            inViewport = entries[0]?.isIntersecting ?? false
            refresh()
        })
        intersectionObserver.observe(svgRef.value)
        themeObserver = new MutationObserver(refresh)
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        try {
            renderer = createRenderer(svgRef.value)
            const [light, dark] = await Promise.all([loadLogos('light'), loadLogos('dark')])
            if (disposed) return
            logos = { light, dark }
            state.value = 'ready'
            refresh()
        } catch {
            fail()
        }
    })

    onBeforeUnmount(() => {
        disposed = true
        stop()
        resetInput()
        reducedMotion?.removeEventListener('change', refresh)
        forcedColors?.removeEventListener('change', refresh)
        desktop?.removeEventListener('change', refresh)
        finePointer?.removeEventListener('change', refresh)
        document.removeEventListener('visibilitychange', refresh)
        window.removeEventListener('resize', refresh)
        window.removeEventListener('blur', refresh)
        window.removeEventListener('scroll', refresh)
        resizeObserver?.disconnect()
        intersectionObserver?.disconnect()
        themeObserver?.disconnect()
        renderer?.destroy()
        renderer = null
        logos = null
    })

    return {
        state: readonly(state), running: readonly(running),
        interactive: readonly(interactive), dragging: readonly(dragging),
        onPointerMove, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel,
    }
}
