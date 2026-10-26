import { nextTick, onBeforeUnmount, onMounted, toValue, watch } from 'vue'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useOverlay({ open, panel, busy, close, initialFocus = null, background = () => [document.getElementById('app')], additionalControls = () => [] }) {
    let restore = null

    function focusable() {
        return [...additionalControls(), ...(panel.value?.querySelectorAll(FOCUSABLE) ?? [])].filter(element => (
            !element.matches(':disabled')
            && element.tabIndex >= 0
            && !element.closest('[inert]')
            && element.getClientRects().length > 0
            && window.getComputedStyle(element).visibility !== 'hidden'
        ))
    }

    function focusFirst() {
        const controls = focusable()
        const preferred = toValue(initialFocus)
        const target = controls.includes(preferred) ? preferred : (controls.find(element => panel.value?.contains(element)) ?? panel.value)
        target?.focus()
    }

    function contains(element) {
        return panel.value?.contains(element) || additionalControls().includes(element)
    }

    function keydown(event) {
        if (!toValue(open)) return
        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            if (!toValue(busy)) close()
            return
        }
        if (event.key !== 'Tab') return
        const controls = focusable()
        const first = controls[0]
        const last = controls.at(-1)
        if (!first) {
            event.preventDefault()
            panel.value?.focus()
        } else if (!contains(document.activeElement)) {
            event.preventDefault()
            first.focus()
        } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    function focusin(event) {
        if (toValue(open) && panel.value && !contains(event.target)) focusFirst()
    }

    watch(() => toValue(open), async (isOpen, previous, onCleanup) => {
        if (!isOpen || typeof document === 'undefined') return
        const trigger = document.activeElement
        const targets = background().filter(Boolean).map(element => ({ element, wasInert: element.inert }))
        const overflow = document.body.style.overflow
        const paddingRight = document.body.style.paddingRight
        const scrollbar = window.innerWidth - document.documentElement.clientWidth
        let cancelled = false
        targets.forEach(({ element }) => { element.inert = true })
        if (scrollbar > 0) {
            const padding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0
            document.body.style.paddingRight = `${padding + scrollbar}px`
        }
        document.body.style.overflow = 'hidden'

        restore = () => {
            cancelled = true
            targets.forEach(({ element, wasInert }) => { element.inert = wasInert })
            document.body.style.overflow = overflow
            document.body.style.paddingRight = paddingRight
            if (trigger?.isConnected && !trigger.closest('[inert]') && trigger.getClientRects().length) trigger.focus()
            restore = null
        }
        onCleanup(() => restore?.())
        await nextTick()
        if (!cancelled) focusFirst()
    }, { flush: 'post', immediate: true })

    onMounted(() => {
        document.addEventListener('keydown', keydown, true)
        document.addEventListener('focusin', focusin)
    })
    onBeforeUnmount(() => {
        document.removeEventListener('keydown', keydown, true)
        document.removeEventListener('focusin', focusin)
        restore?.()
    })
}
