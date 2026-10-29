import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createRenderer, reactive } from 'vue'

let sequence = 0
async function mountAction() {
    const requests = []
    let cancellations = 0
    const form = reactive({
        processing: false,
        errors: { form: 'old transport error', email: 'server field error' },
        submit(method, url, options) { requests.push({ method, url, options }) },
        clearErrors(key) { delete this.errors[key] },
        setError(key, value) { this.errors[key] = value },
        cancel() { cancellations++ },
    })
    globalThis.__actionFormTest = () => form
    const source = (await readFile(new URL('../../../resources/js/composables/useActionForm.js', import.meta.url), 'utf8'))
        .replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
        .replace("import { useForm } from '@inertiajs/vue3'", 'const useForm = globalThis.__actionFormTest')
    const { useActionForm } = await import(`data:text/javascript;base64,${Buffer.from(`${source}\n// ${++sequence}`).toString('base64')}`)
    delete globalThis.__actionFormTest
    const host = createRenderer({ createComment: () => ({}), insert() {}, remove() {}, parentNode: () => null, nextSibling: () => null })
    let action
    const app = host.createApp({ setup() { action = useActionForm({}); return () => null } })
    app.mount({})
    return { action, form, requests, cancellations: () => cancellations, cleanup: () => app.unmount() }
}

for (const failure of ['onNetworkError', 'onHttpException']) {
    test(`action ${failure} gives local guidance, ignores duplicate before onStart and allows retry`, async () => {
        const f = await mountAction()
        let finished = 0
        try {
            f.action.submit('post', '/login', { onFinish: () => { finished++ } })
            f.action.submit('post', '/login')
            assert.equal(f.requests.length, 1)
            assert.equal(f.form.errors.form, undefined)
            assert.equal(f.form.errors.email, 'server field error')
            assert.equal(f.requests[0].options[failure](), false)
            assert.ok(f.form.errors.form)
            f.requests[0].options.onFinish()
            assert.equal(finished, 1)
            f.action.submit('post', '/login')
            assert.equal(f.requests.length, 2)
            assert.equal(f.form.errors.form, undefined)
        } finally { f.cleanup() }
    })
}

test('action preserves domain callbacks and cancels pending work on navigation', async () => {
    const f = await mountAction()
    const success = () => 'persisted'
    f.action.submit('patch', '/account/profile', { onSuccess: success, preserveScroll: false })
    assert.equal(f.requests[0].options.onSuccess, success)
    assert.equal(f.requests[0].options.preserveScroll, false)
    f.cleanup()
    assert.equal(f.cancellations(), 1)
    f.requests[0].options.onNetworkError()
    assert.equal(f.form.errors.form, undefined, 'no stale error after unmount')
    f.action.submit('patch', '/account/profile')
    assert.equal(f.requests.length, 1)
})
