import { useActionForm } from '@/composables/useActionForm'

export function useProfileForm(data) {
    return useActionForm(data, { failureMessage: 'Не удалось сохранить изменения. Попробуй ещё раз.' })
}
