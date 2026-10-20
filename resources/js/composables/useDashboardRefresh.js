import { computed, onBeforeUnmount, readonly, shallowRef, toValue } from 'vue'
import { router, useForm } from '@inertiajs/vue3'

export function useDashboardRefresh(provisioningRequired) {
    const refreshing = shallowRef(false)
    const refreshError = shallowRef(false)
    const provision = useForm({})
    const busy = computed(() => refreshing.value || provision.processing)
    let cancelRefresh

    function failedRefresh() {
        refreshError.value = true
        return false
    }

    function retry() {
        if (busy.value) return
        refreshError.value = false
        if (toValue(provisioningRequired)) {
            provision.post('/account/provisioning')
            return
        }
        refreshing.value = true
        router.reload({
            only: ['user', 'subscription', 'devicesSummary', 'serviceState', 'provisioningRequired'],
            onCancelToken: token => { cancelRefresh = token },
            onError: failedRefresh,
            onHttpException: failedRefresh,
            onNetworkError: failedRefresh,
            onFinish: () => {
                refreshing.value = false
                cancelRefresh = null
            },
        })
    }

    onBeforeUnmount(() => cancelRefresh?.cancel())

    return { busy, refreshError: readonly(refreshError), provision, retry }
}
