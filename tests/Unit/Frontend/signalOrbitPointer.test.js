import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createRenderer } from 'vue'
import { SIGNAL_ORBIT_PATH } from '../../../resources/js/utils/signalOrbitGeometry.js'

// Resolve the project's Vite alias for Node while exercising the real Vue composable.
const moduleUrl = new URL('../../../resources/js/composables/useSignalOrbitPointer.js', import.meta.url)
const geometryUrl = new URL('../../../resources/js/utils/signalOrbitGeometry.js', import.meta.url)
const source = (await readFile(moduleUrl, 'utf8'))
    .replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
    .replace("from '@/utils/signalOrbitGeometry'", `from '${geometryUrl.href}'`)
const { useSignalOrbitPointer } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)

function mountMotion() {
    const frames = new Map()
    let sequence = 0
    let time = 0
    let observerDisconnected = false
    const query = Object.assign(new EventTarget(), { matches: true })
    const document = Object.assign(new EventTarget(), { hidden: false, documentElement: {} })
    const window = Object.assign(new EventTarget(), {
        matchMedia: () => query,
        requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence },
        cancelAnimationFrame: id => frames.delete(id),
    })
    const originals = Object.fromEntries(['window', 'document', 'Element', 'MutationObserver'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
    Object.assign(globalThis, {
        window,
        document,
        Element: class {},
        MutationObserver: class {
            observe() {}
            disconnect() { observerDisconnected = true }
        },
    })
    const renderer = createRenderer({
        createComment: () => ({}),
        insert() {},
        remove() {},
        parentNode: () => null,
        nextSibling: () => null,
    })
    const hero = { getBoundingClientRect: () => ({ left: 0, top: 112, right: 2560, bottom: 1440 }) }
    const signal = { getBoundingClientRect: () => ({ left: 960, top: 150, width: 1536, height: 1246 }) }
    let motion
    const app = renderer.createApp({ setup() { motion = useSignalOrbitPointer({ value: hero }, { value: signal }); return () => null } })
    app.mount({})

    function advance(count = 1) {
        for (let frame = 0; frame < count && frames.size; frame++) {
            time += 16
            const pending = [...frames.values()]
            frames.clear()
            pending.forEach(callback => callback(time))
        }
    }

    function settle() {
        advance(300)
        assert.equal(frames.size, 0, 'the RAF loop must stop when motion settles')
    }

    function move(x, y, pointerType = 'mouse') {
        time += 8
        motion.onPointerMove({ clientX: x, clientY: y, timeStamp: time, pointerType, buttons: 0, target: null })
    }

    function cleanup() {
        app.unmount()
        assert.equal(frames.size, 0)
        assert.equal(observerDisconnected, true)

        for (const [key, descriptor] of Object.entries(originals)) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor)
            else delete globalThis[key]
        }
    }

    return { motion, move, advance, settle, cleanup, frames, query, window, document }
}

test('movement anywhere in Hero deforms the figure and settles without a pointer leave', () => {
    const fixture = mountMotion()

    try {
        fixture.move(30, 700)
        assert.equal(fixture.frames.size, 0)
        fixture.move(120, 700)
        fixture.advance(6)
        assert.notEqual(fixture.motion.signalPath.value, SIGNAL_ORBIT_PATH)
        assert.equal((fixture.motion.signalPath.value.match(/M/g) ?? []).length, 1)
        fixture.settle()
        assert.equal(fixture.motion.signalPath.value, SIGNAL_ORBIT_PATH)
        fixture.move(120, 700)
        fixture.move(30, 700)
        fixture.advance(6)
        assert.notEqual(fixture.motion.signalPath.value, SIGNAL_ORBIT_PATH)
        fixture.motion.resetPointer()
        fixture.settle()
        assert.equal(fixture.motion.signalPath.value, SIGNAL_ORBIT_PATH)
    } finally {
        fixture.cleanup()
    }
})

test('touch, reduced motion, background visibility and blur preserve or restore the Pen path', () => {
    const fixture = mountMotion()

    try {
        fixture.move(1750, 700, 'touch')
        fixture.move(1800, 700, 'touch')
        assert.equal(fixture.frames.size, 0)
        fixture.query.matches = false
        fixture.move(1750, 700)
        fixture.move(1800, 700)
        assert.equal(fixture.frames.size, 0)
        fixture.query.matches = true
        fixture.document.hidden = true
        fixture.move(1750, 700)
        fixture.move(1800, 700)
        assert.equal(fixture.frames.size, 0)
        fixture.document.hidden = false
        fixture.move(1750, 700)
        fixture.move(1800, 700)
        fixture.advance(6)
        assert.notEqual(fixture.motion.signalPath.value, SIGNAL_ORBIT_PATH)
        fixture.window.dispatchEvent(new Event('blur'))
        assert.equal(fixture.motion.signalPath.value, SIGNAL_ORBIT_PATH)
    } finally {
        fixture.cleanup()
    }
})

test('unmount cancels an active response and disconnects its lifecycle', () => {
    const fixture = mountMotion()

    try {
        fixture.move(1750, 700)
        fixture.move(1850, 750)
        fixture.advance(3)
        assert.ok(fixture.frames.size > 0)
    } finally {
        fixture.cleanup()
    }
})
