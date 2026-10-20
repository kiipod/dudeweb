import { computed, onBeforeUnmount, readonly, shallowRef, toValue } from 'vue'

export function useCopyableLink(value) {
    const status = shallowRef('idle')
    const manual = shallowRef(false)
    const busy = shallowRef(false)
    const feedback = computed(() => status.value === 'copied' ? 'Ссылка скопирована' : status.value === 'error' ? 'Не удалось скопировать ссылку. Выдели её и скопируй вручную.' : '')
    let resetTimer
    let alive = true

    async function copy() {
        if (busy.value || !toValue(value)) return false
        busy.value = true
        try {
            if (window.isSecureContext && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(toValue(value))
            } else {
                const previous = document.activeElement
                const field = document.createElement('textarea')
                field.value = toValue(value)
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
            if (!alive) return false
            manual.value = false
            status.value = 'copied'
            clearTimeout(resetTimer)
            resetTimer = setTimeout(() => { status.value = 'idle' }, 2500)
            return true
        } catch {
            if (alive) { status.value = 'error'; manual.value = true }
            return false
        } finally {
            if (alive) busy.value = false
        }
    }

    onBeforeUnmount(() => { alive = false; clearTimeout(resetTimer) })
    return { status: readonly(status), manual: readonly(manual), busy: readonly(busy), feedback, copy }
}
