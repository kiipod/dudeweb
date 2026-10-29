import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'
import { useHttp } from '@inertiajs/vue3'
import { useWebPayment } from '@/composables/useWebPayment'
import { periodLabel } from '@/utils/subscriptionPresentation'

export function useSubscriptionCheckout(initialCatalogue) {
    const catalogue = shallowRef(toValue(initialCatalogue))
    const productId = shallowRef(catalogue.value.products[0]?.id ?? '')
    const promoOpen = shallowRef(false)
    const promo = useHttp({ promocode: '' })
    const payment = useWebPayment()
    const busy = computed(() => promo.processing || payment.form.processing || payment.redirecting.value)
    const selected = computed(() => catalogue.value.products.find(product => product.id === productId.value))
    const options = computed(() => [1, 3, 6, 12].map(months => {
        const product = catalogue.value.products.find(item => item.months === months)
        return { value: product?.id ?? `unavailable-${months}`, label: periodLabel(months), disabled: !product }
    }))
    let alive = true

    watch(initialCatalogue, value => { catalogue.value = value; productId.value = value.products.find(p => p.id === productId.value)?.id ?? value.products[0]?.id ?? '' })
    watch(productId, payment.resetAttempt)

    async function applyPromo(remove = false) {
        if (busy.value) return
        promo.clearErrors()
        const input = promo.promocode
        if (remove) promo.promocode = null
        try {
            const result = await promo.post('/account/subscription/promo')
            if (!alive || !result) return
            catalogue.value = result
            promo.promocode = result.discount?.code ?? ''
            promoOpen.value = false
            payment.resetAttempt()
        } catch {
            if (alive) promo.setError('promocode', 'Не удалось проверить промокод. Попробуй ещё раз.')
        } finally {
            if (remove && !promo.wasSuccessful) promo.promocode = input
        }
    }

    async function pay() {
        if (busy.value || !selected.value) return
        payment.form.product_id = selected.value.id
        payment.form.promocode = catalogue.value.discount?.code ?? null
        await payment.pay()
        if (alive && payment.form.errors.promocode) {
            promo.promocode = catalogue.value.discount?.code ?? ''
            promo.setError('promocode', payment.form.errors.promocode)
            promoOpen.value = true
        }
    }

    onBeforeUnmount(() => { alive = false; promo.cancel() })
    return { catalogue, productId, promoOpen, promo, payment: payment.form, busy, selected, options, applyPromo, pay }
}
