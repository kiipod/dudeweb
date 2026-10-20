import { useForm } from '@inertiajs/vue3'

export function useProfileForm(data) {
    const form = useForm(data)
    function submit(method, url, options = {}) {
        if (form.processing) return
        form.submit(method, url, {
            preserveScroll: true,
            onNetworkError: () => { form.setError('form', 'Проверь соединение и попробуй ещё раз.'); return false },
            onHttpException: () => { form.setError('form', 'Не удалось сохранить изменения. Попробуй ещё раз.'); return false },
            ...options,
        })
    }
    return { form, submit }
}
