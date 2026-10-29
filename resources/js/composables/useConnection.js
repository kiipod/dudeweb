import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { router, useForm } from '@inertiajs/vue3'

export function useConnection() {
    const refreshing = shallowRef(false)
    const refreshError = shallowRef(false)
    const remove = useForm({ device: '' })
    const busy = computed(() => refreshing.value || remove.processing)
    let cancelRefresh

    function failed() { refreshError.value = true; return false }
    function retry() {
        if (busy.value) return
        refreshError.value = false
        refreshing.value = true
        router.reload({
            only: ['subscriptionUrl', 'devices', 'deviceCount', 'deviceLimit', 'serviceState', 'deviceRemoved'],
            onCancelToken: token => { cancelRefresh = token },
            onError: failed,
            onHttpException: failed,
            onNetworkError: failed,
            onFinish: () => { refreshing.value = false; cancelRefresh = null },
        })
    }
    function revoke(token) {
        if (busy.value) return
        remove.device = token
        remove.clearErrors()
        remove.delete('/account/connection/devices', {
            preserveScroll: true,
            onHttpException: () => { remove.setError('device', 'Не удалось отключить устройство. Обнови список и попробуй снова.'); return false },
            onNetworkError: () => { remove.setError('device', 'Проверь соединение и попробуй отключить устройство ещё раз.'); return false },
        })
    }
    onBeforeUnmount(() => { cancelRefresh?.cancel(); remove.cancel() })
    return { refreshing, refreshError, busy, remove, retry, revoke }
}
