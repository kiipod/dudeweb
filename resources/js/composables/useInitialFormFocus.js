import { nextTick, toValue, watch } from 'vue'

const EDITABLE = 'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), textarea'

export function useInitialFormFocus(formRef, { enabled = true, preventScroll = true } = {}) {
    watch([formRef, () => toValue(enabled)], async ([form, active], previous, onCleanup) => {
        if (!form || !active) return
        let cancelled = false
        onCleanup(() => { cancelled = true })
        await nextTick()
        if (cancelled) return
        const input = [...form.querySelectorAll(EDITABLE)].find(element => (
            !element.matches(':disabled, [readonly]')
            && !element.closest('[inert]')
            && element.getClientRects().length > 0
            && window.getComputedStyle(element).visibility === 'visible'
        ))
        input?.focus({ preventScroll })
    }, { flush: 'post' })
}
