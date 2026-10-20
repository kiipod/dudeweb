import { onBeforeUnmount, onMounted, readonly, shallowRef, toValue, watch } from 'vue'
import { router } from '@inertiajs/vue3'

export function usePaymentStatus(payment) {
    const busy = shallowRef(false)
    const stopped = shallowRef(false)
    const error = shallowRef(false)
    let next
    let deadline
    let cancel
    let disposed = false

    function stop() {
        clearTimeout(next)
        clearTimeout(deadline)
        stopped.value = true
    }

    function schedule() {
        if (!disposed && !stopped.value && toValue(payment).status === 'pending') next = setTimeout(refresh, 2000)
    }

    function failed() {
        error.value = true
        stop()
        return false
    }

    function refresh() {
        if (disposed || busy.value || toValue(payment).status !== 'pending') return
        busy.value = true
        error.value = false
        clearTimeout(next)
        router.reload({
            only: ['payment'],
            onCancelToken: token => { cancel = token },
            onError: failed,
            onHttpException: failed,
            onNetworkError: failed,
            onFinish: () => { busy.value = false; cancel = null; schedule() },
        })
    }

    watch(() => toValue(payment).status, value => { if (value !== 'pending') stop() })
    onMounted(() => {
        if (toValue(payment).status !== 'pending') return
        deadline = setTimeout(() => { stop(); cancel?.cancel() }, 60000)
        schedule()
    })
    onBeforeUnmount(() => { disposed = true; stop(); cancel?.cancel() })
    return { busy: readonly(busy), stopped: readonly(stopped), error: readonly(error), refresh }
}
