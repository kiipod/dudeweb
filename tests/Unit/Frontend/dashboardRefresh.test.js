import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createRenderer, reactive, shallowRef } from 'vue'

let moduleSequence = 0

async function mountRefresh() {
    const visits = []
    const provisionVisits = []
    const provision = reactive({
        processing: false,
        post(url) {
            provisionVisits.push(url)
            this.processing = true
        },
    })
    const bridgeKey = '__dashboardRefreshTest'
    globalThis[bridgeKey] = { router: { reload: options => visits.push(options) }, useForm: () => provision }
    const source = (await readFile(new URL('../../../resources/js/composables/useDashboardRefresh.js', import.meta.url), 'utf8'))
        .replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
        .replace("import { router, useForm } from '@inertiajs/vue3'", `const { router, useForm } = globalThis.${bridgeKey}`)
    const { useDashboardRefresh } = await import(`data:text/javascript;base64,${Buffer.from(`${source}\n// fixture ${++moduleSequence}`).toString('base64')}`)
    delete globalThis[bridgeKey]
    const host = createRenderer({
        createComment: () => ({}),
        insert() {},
        remove() {},
        parentNode: () => null,
        nextSibling: () => null,
    })
    const provisioningRequired = shallowRef(false)
    let refresh
    const app = host.createApp({
        setup() {
            refresh = useDashboardRefresh(provisioningRequired)
            return () => null
        },
    })
    app.mount({})
    return { refresh, visits, provision, provisionVisits, provisioningRequired, cleanup: () => app.unmount() }
}

for (const failure of ['onNetworkError', 'onHttpException', 'onError']) {
    test(`dashboard ${failure} leaves an explicit error after loading and allows a fresh retry`, async () => {
        const f = await mountRefresh()
        try {
            f.refresh.retry()
            assert.equal(f.refresh.busy.value, true)
            f.refresh.retry()
            assert.equal(f.visits.length, 1, 'duplicate refresh is ignored')
            assert.equal(f.visits[0][failure](), false, 'failure is handled by the account page')
            f.visits[0].onFinish()
            assert.equal(f.refresh.busy.value, false)
            assert.equal(f.refresh.refreshError.value, true, 'old active props must stay hidden')
            f.refresh.retry()
            assert.equal(f.visits.length, 2)
            assert.equal(f.refresh.refreshError.value, false)
            f.visits[1].onFinish()
            assert.equal(f.refresh.busy.value, false)
            assert.equal(f.refresh.refreshError.value, false)
        } finally { f.cleanup() }
    })
}

test('dashboard switches from provisioning to fresh read when server mapping becomes available', async () => {
    const f = await mountRefresh()
    try {
        f.provisioningRequired.value = true
        f.refresh.retry()
        f.refresh.retry()
        assert.deepEqual(f.provisionVisits, ['/account/provisioning'])
        assert.equal(f.visits.length, 0)
        assert.equal(f.refresh.busy.value, true)
        f.provision.processing = false
        f.provisioningRequired.value = false
        f.refresh.retry()
        assert.equal(f.visits.length, 1)
        assert.deepEqual(f.visits[0].only, ['user', 'subscription', 'devicesSummary', 'serviceState', 'provisioningRequired'])
        f.visits[0].onFinish()
    } finally { f.cleanup() }
})

test('leaving the dashboard cancels the current read and completed reads are not cancelled', async () => {
    for (const finished of [false, true]) {
        const f = await mountRefresh()
        let cancelled = 0
        f.refresh.retry()
        f.visits[0].onCancelToken({ cancel: () => { cancelled++ } })
        if (finished) f.visits[0].onFinish()
        f.cleanup()
        assert.equal(cancelled, finished ? 0 : 1)
    }
})
