import { computed, onBeforeUnmount, shallowRef, toValue } from 'vue'
import { useCopyableLink } from '@/composables/useCopyableLink'

export function useInviteShare(url) {
    const sharing = shallowRef(false)
    const status = shallowRef('')
    const attemptedUrl = shallowRef(null)
    const copy = useCopyableLink(url)
    const busy = computed(() => sharing.value || copy.busy.value)
    const feedback = computed(() => attemptedUrl.value === toValue(url) ? status.value || copy.feedback.value : '')
    const manual = computed(() => attemptedUrl.value === toValue(url) && copy.manual.value)
    let alive = true

    async function share() {
        if (busy.value || !toValue(url)) return
        sharing.value = true
        attemptedUrl.value = toValue(url)
        status.value = ''
        try {
            if (typeof navigator.share === 'function') {
                await navigator.share({ title: 'Приглашение в dudeweb', url: toValue(url) })
                if (alive) status.value = 'Приглашение отправлено'
            } else {
                await copy.copy()
            }
        } catch (error) {
            if (alive && error.name === 'AbortError') status.value = 'Отправка отменена'
            else if (alive && attemptedUrl.value === toValue(url)) await copy.copy()
        } finally {
            if (alive) sharing.value = false
        }
    }
    onBeforeUnmount(() => { alive = false })
    return { busy, feedback, manual, share }
}
