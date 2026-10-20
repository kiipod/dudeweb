import { onBeforeUnmount, shallowRef } from 'vue'
import { useHttp } from '@inertiajs/vue3'

export function useWebPayment() {
    const form = useHttp({ product_id: null, promocode: null })
    const redirecting = shallowRef(false)
    let key = null
    let alive = true

    function resetAttempt() {
        key = null
        form.clearErrors()
    }

    async function pay(url = '/payments') {
        if (form.processing || redirecting.value) return
        key ??= window.crypto.randomUUID?.() ?? Array.from(window.crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16)).join('-')
        form.clearErrors()
        try {
            await form.post(url, {
                headers: { 'Idempotency-Key': key },
                onSuccess: response => {
                    if (!alive) return
                    const target = new URL(response.confirmation_url)
                    if (target.protocol !== 'https:' || target.username || target.password) throw new Error('Invalid payment confirmation URL')
                    redirecting.value = true
                    window.location.assign(response.confirmation_url)
                },
                onHttpException: response => {
                    if (response.status === 502) key = null
                },
            })
        } catch {
            if (alive) form.setError('form', 'Не удалось перейти к оплате. Попробуй ещё раз.')
        }
    }

    onBeforeUnmount(() => { alive = false; form.cancel() })
    return { form, redirecting, pay, resetAttempt }
}
