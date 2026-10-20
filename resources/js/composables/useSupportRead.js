import { onBeforeUnmount, shallowRef } from 'vue'
import { router } from '@inertiajs/vue3'

export function useSupportRead() {
    const loading = shallowRef(false)
    const failed = shallowRef(false)
    let cancel
    function failure() { failed.value = true; return false }
    function reload() {
        if (loading.value) return
        loading.value = true
        failed.value = false
        router.reload({
            only: ['tickets', 'ticket', 'messages', 'serviceState', 'submissionId'],
            onCancelToken: token => { cancel = token },
            onError: failure, onHttpException: failure, onNetworkError: failure,
            onFinish: () => { loading.value = false; cancel = null },
        })
    }
    onBeforeUnmount(() => cancel?.cancel())
    return { loading, failed, reload }
}
