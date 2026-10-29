import { onBeforeUnmount } from 'vue'
import { useForm } from '@inertiajs/vue3'

export function useActionForm(data, { failureMessage = 'Не удалось выполнить действие. Попробуй ещё раз.' } = {}) {
    const form = useForm(data)
    let pending = false
    let alive = true

    function failure(message) {
        if (alive) form.setError('form', message)
        return false
    }

    function submit(method, url, options = {}) {
        if (!alive || pending || form.processing) return
        pending = true
        form.clearErrors('form')
        form.submit(method, url, {
            preserveScroll: true,
            onNetworkError: () => failure('Проверь соединение и попробуй ещё раз.'),
            onHttpException: () => failure(failureMessage),
            ...options,
            onFinish: visit => {
                pending = false
                options.onFinish?.(visit)
            },
        })
    }

    onBeforeUnmount(() => { alive = false; form.cancel() })
    return { form, submit }
}
