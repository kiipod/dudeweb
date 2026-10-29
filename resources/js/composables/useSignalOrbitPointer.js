import { onBeforeUnmount, onMounted, readonly, shallowRef } from 'vue'
import { deformSignalOrbit, SIGNAL_ORBIT_PATH } from '@/utils/signalOrbitGeometry'

const INTERACTION_QUERY = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (forced-colors: none)'
const IMPULSE_DISTANCE = 55
const DECAY_TIME = 200
const RESPONSE_TIME = 60
const SETTLE_THRESHOLD = 0.001
const SAMPLE_TIMEOUT = 160

export function useSignalOrbitPointer(heroRef, signalRef) {
    const signalPath = shallowRef(SIGNAL_ORBIT_PATH)
    let interactionQuery = null
    let animationFrame = null
    let previousFrameTime = null
    let themeObserver = null
    let previousPointer = null
    let pointer = { x: 0.5, y: 0.5 }
    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }

    function stopMotion() {
        if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame)
        }

        animationFrame = null
        previousFrameTime = null
        previousPointer = null
        target = { x: 0, y: 0 }
        current = { x: 0, y: 0 }
        signalPath.value = SIGNAL_ORBIT_PATH
    }

    function advance(timestamp) {
        animationFrame = null
        const elapsed = previousFrameTime === null ? 1000 / 60 : Math.min(timestamp - previousFrameTime, 64)
        previousFrameTime = timestamp
        const response = 1 - Math.exp(-elapsed / RESPONSE_TIME)
        const decay = Math.exp(-elapsed / DECAY_TIME)

        current.x += (target.x - current.x) * response
        current.y += (target.y - current.y) * response
        target.x *= decay
        target.y *= decay

        if (Math.max(Math.abs(current.x), Math.abs(current.y), Math.abs(target.x), Math.abs(target.y)) < SETTLE_THRESHOLD) {
            stopMotion()
            return
        }

        signalPath.value = deformSignalOrbit({ ...pointer, dx: current.x, dy: current.y })
        animationFrame = window.requestAnimationFrame(advance)
    }

    function queueMotion() {
        if (animationFrame === null) {
            previousFrameTime = null
            animationFrame = window.requestAnimationFrame(advance)
        }
    }

    function resetPointer() {
        previousPointer = null
        target = { x: 0, y: 0 }
    }

    function onPointerMove(event) {
        if (!interactionQuery?.matches || document.hidden || event.pointerType !== 'mouse' || event.buttons !== 0) {
            stopMotion()
            return
        }

        if (event.target instanceof Element && event.target.closest('a, button, input, select, textarea, [role="button"]')) {
            resetPointer()
            return
        }

        const hero = heroRef.value
        const signal = signalRef.value

        if (!hero || !signal) {
            return
        }

        const bounds = signal.getBoundingClientRect()
        const sample = { x: event.clientX, y: event.clientY, time: event.timeStamp }
        const previous = previousPointer
        previousPointer = sample

        if (!previous || sample.time - previous.time > SAMPLE_TIMEOUT || bounds.width === 0 || bounds.height === 0) {
            return
        }

        pointer = {
            x: Math.min(1, Math.max(0, (sample.x - bounds.left) / bounds.width)),
            y: Math.min(1, Math.max(0, (sample.y - bounds.top) / bounds.height)),
        }
        target.x = Math.min(1, Math.max(-1, target.x + (sample.x - previous.x) / IMPULSE_DISTANCE))
        target.y = Math.min(1, Math.max(-1, target.y + (sample.y - previous.y) / IMPULSE_DISTANCE))

        if (target.x !== 0 || target.y !== 0) {
            queueMotion()
        }
    }

    onMounted(() => {
        interactionQuery = window.matchMedia(INTERACTION_QUERY)
        interactionQuery.addEventListener('change', stopMotion)
        window.addEventListener('blur', stopMotion)
        window.addEventListener('resize', stopMotion, { passive: true })
        window.addEventListener('scroll', stopMotion, { passive: true })
        document.addEventListener('visibilitychange', stopMotion)
        themeObserver = new MutationObserver(stopMotion)
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    })

    onBeforeUnmount(() => {
        stopMotion()
        interactionQuery?.removeEventListener('change', stopMotion)
        window.removeEventListener('blur', stopMotion)
        window.removeEventListener('resize', stopMotion)
        window.removeEventListener('scroll', stopMotion)
        document.removeEventListener('visibilitychange', stopMotion)
        themeObserver?.disconnect()
    })

    return {
        signalPath: readonly(signalPath),
        onPointerMove,
        resetPointer,
    }
}
