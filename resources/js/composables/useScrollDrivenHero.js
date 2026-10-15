import { computed, nextTick, onBeforeUnmount, onMounted, readonly, shallowRef, toValue } from 'vue'

export const HERO_STATES = Object.freeze([
    Object.freeze({ id: 'hey-dude', word: 'Hey Dude' }),
    Object.freeze({ id: 'favorites', word: 'любимые' }),
    Object.freeze({ id: 'services', word: 'сервисы' }),
    Object.freeze({ id: 'again', word: 'снова' }),
    Object.freeze({ id: 'nearby', word: 'рядом' }),
    Object.freeze({ id: 'conversion', word: 'рядом', conversion: true }),
    Object.freeze({ id: 'release', word: 'рядом', conversion: true, release: true }),
])

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function useScrollDrivenHero(sectionRef, options = {}) {
    const { enabled = true } = options
    const progress = shallowRef(0)
    const reducedMotion = shallowRef(true)
    const stickySupported = shallowRef(false)
    let animationFrame = null
    let anchorAnimationFrame = null
    let isMounted = false
    let reducedMotionQuery = null

    const isScrollDriven = computed(() => Boolean(toValue(enabled)) && stickySupported.value && !reducedMotion.value)
    const activeStateIndex = computed(() => Math.min(HERO_STATES.length - 1, Math.max(0, Math.floor(progress.value))))
    const activeState = computed(() => HERO_STATES[activeStateIndex.value])
    const showConversion = computed(() => !isScrollDriven.value || Boolean(activeState.value.conversion))

    function measureProgress() {
        animationFrame = null

        if (!isScrollDriven.value) {
            progress.value = 0
            return
        }

        const section = sectionRef.value

        if (!section) {
            return
        }

        const sectionTop = window.scrollY + section.getBoundingClientRect().top
        const viewportProgress = (window.scrollY - sectionTop) / Math.max(window.innerHeight, 1)

        progress.value = Math.min(HERO_STATES.length - 1, Math.max(0, viewportProgress))
    }

    function queueMeasurement() {
        if (animationFrame !== null) {
            return
        }

        animationFrame = window.requestAnimationFrame(measureProgress)
    }

    function handleReducedMotionChange(event) {
        reducedMotion.value = event.matches
        queueMeasurement()
    }

    function restoreInitialAnchor() {
        const anchorId = window.location.hash.slice(1)

        if (!anchorId) {
            return
        }

        nextTick(() => {
            if (!isMounted) {
                return
            }

            anchorAnimationFrame = window.requestAnimationFrame(() => {
                anchorAnimationFrame = null
                document.getElementById(anchorId)?.scrollIntoView()
                queueMeasurement()
            })
        })
    }

    onMounted(() => {
        isMounted = true
        reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
        reducedMotion.value = reducedMotionQuery.matches
        stickySupported.value = window.CSS?.supports?.('position', 'sticky') ?? false

        window.addEventListener('scroll', queueMeasurement, { passive: true })
        window.addEventListener('resize', queueMeasurement, { passive: true })
        window.addEventListener('orientationchange', queueMeasurement, { passive: true })
        window.addEventListener('pageshow', queueMeasurement)
        window.addEventListener('hashchange', queueMeasurement)
        reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

        queueMeasurement()
        restoreInitialAnchor()
    })

    onBeforeUnmount(() => {
        isMounted = false
        window.removeEventListener('scroll', queueMeasurement)
        window.removeEventListener('resize', queueMeasurement)
        window.removeEventListener('orientationchange', queueMeasurement)
        window.removeEventListener('pageshow', queueMeasurement)
        window.removeEventListener('hashchange', queueMeasurement)
        reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)

        if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame)
        }

        if (anchorAnimationFrame !== null) {
            window.cancelAnimationFrame(anchorAnimationFrame)
        }
    })

    return {
        activeState,
        activeStateIndex,
        isScrollDriven,
        progress: readonly(progress),
        reducedMotion: readonly(reducedMotion),
        showConversion,
    }
}
