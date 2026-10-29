import { computed, onBeforeUnmount, readonly, shallowRef, toValue, watch } from 'vue'

export function useCopyableLink(value) {
    const status = shallowRef('idle')
    const manual = shallowRef(false)
    const busy = shallowRef(false)
    const feedback = computed(() => status.value === 'copied' ? 'Ссылка скопирована' : status.value === 'error' ? 'Не удалось скопировать ссылку. Выдели её и скопируй вручную.' : '')
    let resetTimer
    let alive = true
    let revision = 0

    watch(() => toValue(value), () => {
        revision++
        status.value = 'idle'
        manual.value = false
        clearTimeout(resetTimer)
    }, { flush: 'sync' })

    async function copy() {
        if (busy.value || !toValue(value)) return false
        const attemptedValue = toValue(value)
        const attempt = revision
        busy.value = true
        try {
            if (window.isSecureContext && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(attemptedValue)
            } else {
                const previous = document.activeElement
                const field = document.createElement('textarea')
                field.value = attemptedValue
                field.className = 'fixed top-0 left-0 h-px w-px opacity-0'
                field.setAttribute('readonly', '')
                document.body.append(field)
                try {
                    field.select()
                    if (!document.execCommand('copy')) throw new Error('Clipboard unavailable')
                } finally {
                    field.remove()
                    previous?.focus({ preventScroll: true })
                }
            }
            if (!alive || revision !== attempt) return false
            manual.value = false
            status.value = 'copied'
            clearTimeout(resetTimer)
            resetTimer = setTimeout(() => { status.value = 'idle' }, 2500)
            return true
        } catch {
            if (alive && revision === attempt) { status.value = 'error'; manual.value = true }
            return false
        } finally {
            if (alive) busy.value = false
        }
    }

    onBeforeUnmount(() => { alive = false; clearTimeout(resetTimer) })
    return { status: readonly(status), manual: readonly(manual), busy: readonly(busy), feedback, copy }
}
