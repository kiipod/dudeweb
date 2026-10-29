import assert from 'node:assert/strict'
import test from 'node:test'
import { createRenderer, shallowRef } from 'vue'
import { useCopyableLink } from '../../../resources/js/composables/useCopyableLink.js'

function fixture() {
    const descriptors = ['window', 'navigator'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
    const writes = []
    let resolve, reject
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { isSecureContext: true } })
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: value => {
        writes.push(value)
        return new Promise((yes, no) => { resolve = yes; reject = no })
    } } } })
    const value = shallowRef('https://sub.example.test/first')
    const host = createRenderer({ createComment: () => ({}), insert() {}, remove() {}, parentNode: () => null, nextSibling: () => null })
    let link
    const app = host.createApp({ setup() { link = useCopyableLink(value); return () => null } })
    app.mount({})
    return {
        value, link, writes, resolve: () => resolve(), reject: () => reject(new Error('denied')),
        unmount: () => app.unmount(),
        cleanup() {
            app.unmount()
            for (const [key, descriptor] of descriptors) {
                if (descriptor) Object.defineProperty(globalThis, key, descriptor)
                else delete globalThis[key]
            }
        },
    }
}
for (const outcome of ['resolve', 'reject']) {
    test(`clipboard ${outcome} for an obsolete link never claims success/error for its replacement`, async () => {
        const f = fixture()
        try {
            const pending = f.link.copy()
            assert.equal(await f.link.copy(), false)
            assert.equal(f.writes.length, 1)
            f.value.value = 'https://sub.example.test/second'
            f[outcome]()
            assert.equal(await pending, false)
            assert.equal(f.link.feedback.value, '')
            assert.equal(f.link.manual.value, false)
            assert.equal(f.link.busy.value, false)
            const fresh = f.link.copy()
            f.resolve()
            assert.equal(await fresh, true)
            assert.equal(f.writes.at(-1), f.value.value)
            assert.equal(f.link.status.value, 'copied')
            f.value.value = 'https://sub.example.test/third'
            assert.equal(f.link.feedback.value, '')
        } finally { f.cleanup() }
    })
}
test('clipboard completion after navigation cannot produce late feedback', async () => {
    const f = fixture()
    try {
        const pending = f.link.copy()
        f.unmount()
        f.resolve()
        assert.equal(await pending, false)
        assert.equal(f.link.feedback.value, '')
    } finally { f.cleanup() }
})
