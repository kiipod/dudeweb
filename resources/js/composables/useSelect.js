import { nextTick, onBeforeUnmount, onMounted, shallowRef, toValue, watch } from 'vue'

export function useSelect({ trigger, panel, options, disabled, value, update }) {
    const open = shallowRef(false)
    const active = shallowRef(-1)
    const position = shallowRef({})
    let search = ''
    let searchedAt = 0
    let anchor = null
    const enabled = () => toValue(options).map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0)

    function close() {
        open.value = false
        search = ''
    }

    function place() {
        const box = trigger.value.getBoundingClientRect()
        anchor = { top: box.top, left: box.left }
        const style = getComputedStyle(trigger.value)
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
        const inset = parseFloat(style.getPropertyValue('--spacing-compact')) * rem
        const maximum = parseFloat(style.getPropertyValue('--spacing-select-menu')) * rem
        const viewport = window.visualViewport
        const leftEdge = viewport?.offsetLeft ?? 0
        const topEdge = viewport?.offsetTop ?? 0
        const width = viewport?.width ?? window.innerWidth
        const height = viewport?.height ?? window.innerHeight
        const desired = Math.min(panel.value?.scrollHeight ?? maximum, maximum)
        const below = Math.max(0, topEdge + height - box.bottom - inset * 2)
        const above = Math.max(0, box.top - topEdge - inset * 2)
        const upwards = below < desired && above > below
        const available = Math.min(upwards ? above : below, maximum)
        const popupWidth = Math.max(0, Math.min(box.width, width - inset * 2))
        position.value = {
            '--ui-select-left': `${Math.max(leftEdge + inset, Math.min(box.left, leftEdge + width - popupWidth - inset))}px`,
            '--ui-select-top': `${upwards ? box.top - inset - Math.min(desired, available) : box.bottom + inset}px`,
            '--ui-select-width': `${popupWidth}px`,
            '--ui-select-available': `${available}px`,
            '--ui-select-font-size': style.fontSize,
            '--ui-select-line-height': style.lineHeight,
        }
    }

    async function show() {
        if (toValue(disabled) || !enabled().length) return
        active.value = toValue(options).findIndex(option => option.value === toValue(value) && !option.disabled)
        if (active.value < 0) active.value = enabled()[0]
        place()
        open.value = true
        await nextTick()
        if (open.value && trigger.value?.isConnected) { place(); reveal() }
    }

    function reveal() {
        nextTick(() => panel.value?.children[active.value]?.scrollIntoView({ block: 'nearest' }))
    }

    function choose(index = active.value, restoreFocus = true) {
        const option = toValue(options)[index]
        if (toValue(disabled) || !option || option.disabled) return
        update(option.value)
        close()
        if (restoreFocus) nextTick(() => trigger.value?.focus({ preventScroll: true }))
    }

    function toggle() {
        if (open.value) close()
        else show()
    }

    function move(delta) {
        const indexes = enabled()
        const index = Math.max(0, indexes.indexOf(active.value))
        active.value = indexes[Math.max(0, Math.min(indexes.length - 1, index + delta))]
        reveal()
    }

    function keydown(event) {
        if (toValue(disabled) || event.ctrlKey || event.metaKey) return
        if (event.key === 'Escape') {
            if (open.value) { event.preventDefault(); event.stopPropagation(); close() }
            return
        }
        if (event.key === 'Tab') {
            if (open.value) choose(active.value, false)
            return
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (open.value) choose()
            else show()
            return
        }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
            event.preventDefault()
            const wasOpen = open.value
            if (!wasOpen) show()
            if (event.altKey && event.key === 'ArrowUp' && wasOpen) choose()
            else if (event.key === 'Home' || (!wasOpen && event.key === 'ArrowUp')) active.value = enabled()[0]
            else if (event.key === 'End') active.value = enabled().at(-1)
            else if (wasOpen && !event.altKey) move(event.key.startsWith('Page') ? (event.key === 'PageDown' ? 10 : -10) : event.key === 'ArrowDown' ? 1 : -1)
            reveal()
            return
        }
        if (event.key.length === 1 && !event.altKey) {
            event.preventDefault()
            if (!open.value) show()
            const character = event.key.toLocaleLowerCase('ru')
            search = Date.now() - searchedAt > 700 ? character : search + character
            searchedAt = Date.now()
            const repeated = [...search].every(letter => letter === character)
            const query = repeated ? character : search
            const indexes = enabled()
            const start = repeated ? indexes.indexOf(active.value) + 1 : 0
            const ordered = [...indexes.slice(start), ...indexes.slice(0, start)]
            const match = ordered.find(index => toValue(options)[index].label.toLocaleLowerCase('ru').startsWith(query))
            if (match !== undefined) { active.value = match; reveal() }
        }
    }

    function outside(event) {
        if (open.value && !trigger.value?.contains(event.target) && !panel.value?.contains(event.target)) close()
    }
    function focus(event) {
        if (open.value && !trigger.value?.contains(event.target) && !panel.value?.contains(event.target)) choose(active.value, false)
    }
    function scroll(event) {
        if (!open.value || panel.value?.contains(event.target)) return
        const box = trigger.value?.getBoundingClientRect()
        if (!box || box.top !== anchor?.top || box.left !== anchor?.left) close()
    }
    watch(() => [toValue(disabled), toValue(options)], close, { deep: true })
    onMounted(() => {
        document.addEventListener('pointerdown', outside, true)
        document.addEventListener('focusin', focus)
        window.addEventListener('resize', close)
        window.addEventListener('scroll', scroll, true)
        window.visualViewport?.addEventListener('resize', close)
    })
    onBeforeUnmount(() => {
        close()
        document.removeEventListener('pointerdown', outside, true)
        document.removeEventListener('focusin', focus)
        window.removeEventListener('resize', close)
        window.removeEventListener('scroll', scroll, true)
        window.visualViewport?.removeEventListener('resize', close)
    })
    return { open, active, position, toggle, keydown, choose }
}
