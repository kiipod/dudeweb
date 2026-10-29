import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createRenderer, nextTick } from 'vue'

const moduleUrl = new URL('../../../resources/js/composables/useServiceCloud.js', import.meta.url)
const source = (await readFile(moduleUrl, 'utf8'))
    .replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
    .replace("import { createServiceCloudRenderer, loadServiceLogos } from '@/utils/serviceCloudRenderer'", 'const createServiceCloudRenderer = null, loadServiceLogos = null')
const { useServiceCloud } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)

async function mountCloud({ reduced = false, hidden = false, desktop = false, fine = true, failRenderer = false, failLogos = false, pendingLogos = false } = {}) {
    const frames = new Map()
    const callbacks = {}
    const disconnected = new Set()
    const renderers = []
    const queries = {
        reduced: Object.assign(new EventTarget(), { matches: reduced }),
        forced: Object.assign(new EventTarget(), { matches: false }),
        desktop: Object.assign(new EventTarget(), { matches: desktop }),
        fine: Object.assign(new EventTarget(), { matches: fine }),
    }
    let theme = 'light'
    let sequence = 0
    let unavailable = 0
    let resolveLogos
    const logosPromise = pendingLogos ? new Promise(resolve => { resolveLogos = resolve }) : null
    const document = Object.assign(new EventTarget(), {
        hidden,
        documentElement: { classList: { contains: () => theme === 'dark' } },
    })
    const window = Object.assign(new EventTarget(), {
        matchMedia: query => query.includes('reduced-motion') ? queries.reduced : query.includes('forced-colors') ? queries.forced : query.includes('pointer: fine') ? queries.fine : queries.desktop,
        requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence },
        cancelAnimationFrame: id => frames.delete(id),
    })
    const captures = new Set()
    const svg = Object.assign(new EventTarget(), {
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 580, height: 620 }),
        setPointerCapture: id => captures.add(id),
        hasPointerCapture: id => captures.has(id),
        releasePointerCapture: id => captures.delete(id),
    })
    const globals = ['window', 'document', 'ResizeObserver', 'IntersectionObserver', 'MutationObserver']
    const originals = Object.fromEntries(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))

    function observer(name) {
        return class {
            constructor(callback) { callbacks[name] = callback }
            observe() {}
            disconnect() { disconnected.add(name) }
        }
    }

    Object.assign(globalThis, {
        window,
        document,
        ResizeObserver: observer('resize'),
        IntersectionObserver: observer('intersection'),
        MutationObserver: observer('theme'),
    })
    const host = createRenderer({
        createComment: () => ({}),
        insert() {},
        remove() {},
        parentNode: () => null,
        nextSibling: () => null,
    })
    let motion
    const app = host.createApp({
        setup() {
            motion = useServiceCloud({ value: svg }, {
                onUnavailable: () => { unavailable++ },
                loadLogos: theme => failLogos ? Promise.reject(new Error('missing asset')) : logosPromise ?? Promise.resolve({ theme }),
                createRenderer: () => {
                    if (failRenderer) throw new Error('SVG renderer unavailable')
                    const renderer = {
                        draws: [], themes: [], sizes: [], destroyed: 0,
                        draw(value) { this.draws.push(value) },
                        setTheme(theme) { this.themes.push(theme) },
                        resize(width, height) { this.sizes.push([width, height]) },
                        destroy() { this.destroyed++ },
                    }
                    renderers.push(renderer)
                    return renderer
                },
            })
            return () => null
        },
    })
    app.mount({})

    async function flush() {
        await Promise.resolve()
        await Promise.resolve()
        await nextTick()
    }

    await flush()

    return {
        motion, frames, renderers, queries, callbacks, svg, captures, document, window, flush,
        get unavailable() { return unavailable },
        setTheme(value) { theme = value; callbacks.theme() },
        resolveLogos() { resolveLogos?.({ url: 'late asset' }) },
        advance(timestamp) {
            const pending = [...frames.values()]
            frames.clear()
            pending.forEach(callback => callback(timestamp))
        },
        cleanup() {
            app.unmount()
            assert.equal(frames.size, 0)
            assert.equal(captures.size, 0)
            assert.deepEqual([...disconnected].sort(), ['intersection', 'resize', 'theme'])
            renderers.forEach(renderer => assert.equal(renderer.destroyed, 1))
        },
        restoreGlobals() {
            for (const [key, descriptor] of Object.entries(originals)) {
                if (descriptor) Object.defineProperty(globalThis, key, descriptor)
                else delete globalThis[key]
            }
        },
    }
}

test('cloud advances time, changes responsive mode and replaces its vector resources on theme change', async () => {
    const f = await mountCloud()
    try {
        assert.equal(f.motion.state.value, 'ready')
        assert.equal(f.frames.size, 1)
        f.advance(100)
        f.advance(116)
        const renderer = f.renderers[0]
        assert.equal(renderer.draws.at(-1).time, 0.016)
        assert.equal(renderer.draws.at(-1).orbit, true)
        f.queries.desktop.matches = true
        f.queries.desktop.dispatchEvent(new Event('change'))
        assert.equal(renderer.draws.at(-1).orbit, false)
        f.setTheme('dark')
        assert.deepEqual(renderer.themes, ['light', 'dark'])
        assert.equal(f.frames.size, 1, 'theme and breakpoint changes keep one ambient RAF')
        f.cleanup()
    } finally { f.restoreGlobals() }
})

test('reduced motion paints a static scene and toggling the preference stops and resumes RAF', async () => {
    const f = await mountCloud({ reduced: true })
    try {
        assert.equal(f.frames.size, 0)
        assert.equal(f.renderers[0].draws.at(-1).staticMotion, true)
        f.queries.reduced.matches = false
        f.queries.reduced.dispatchEvent(new Event('change'))
        assert.equal(f.frames.size, 1)
        f.queries.reduced.matches = true
        f.advance(100)
        assert.equal(f.frames.size, 0, 'the last active frame observes reduced motion before its change event')
        assert.equal(f.renderers[0].draws.at(-1).staticMotion, true)
        f.queries.reduced.dispatchEvent(new Event('change'))
        assert.equal(f.frames.size, 0)
        assert.equal(f.renderers[0].draws.at(-1).staticMotion, true)
        f.cleanup()
    } finally { f.restoreGlobals() }
})

test('background, offscreen and forced colors each suspend animation without a time jump', async () => {
    const f = await mountCloud({ hidden: true })
    try {
        assert.equal(f.frames.size, 0)
        f.document.hidden = false
        f.document.dispatchEvent(new Event('visibilitychange'))
        assert.equal(f.frames.size, 1)
        f.advance(100)
        f.advance(116)
        f.callbacks.intersection([{ isIntersecting: false }])
        assert.equal(f.frames.size, 0)
        f.callbacks.intersection([{ isIntersecting: true }])
        f.advance(100000)
        assert.equal(f.renderers[0].draws.at(-1).time, 0.016)
        f.queries.forced.matches = true
        f.queries.forced.dispatchEvent(new Event('change'))
        assert.equal(f.frames.size, 0)
        f.cleanup()
    } finally { f.restoreGlobals() }
})

test('theme changes while offscreen refresh the static scene without restarting RAF', async () => {
    const f = await mountCloud()
    try {
        f.callbacks.intersection([{ isIntersecting: false }])
        f.setTheme('dark')
        assert.equal(f.frames.size, 0)
        assert.deepEqual(f.renderers[0].themes, ['light', 'dark'])
        f.callbacks.intersection([{ isIntersecting: true }])
        assert.equal(f.frames.size, 1)
        f.cleanup()
    } finally { f.restoreGlobals() }
})

test('SVG renderer and missing-logo failures request the backup once without leaving an animation loop', async () => {
    for (const options of [{ failRenderer: true }, { failLogos: true }]) {
        const f = await mountCloud(options)
        try {
            assert.equal(f.motion.state.value, 'unavailable')
            assert.equal(f.unavailable, 1)
            assert.equal(f.frames.size, 0)
            f.callbacks.resize()
            assert.equal(f.unavailable, 1)
            // Failed renderers are released before component unmount.
            f.renderers.splice(0).forEach(renderer => assert.equal(renderer.destroyed, 1))
            f.cleanup()
        } finally { f.restoreGlobals() }
    }
})

test('unmount during SVG loading releases resources and late completion cannot restart or request fallback', async () => {
    const f = await mountCloud({ pendingLogos: true })
    try {
        f.cleanup()
        f.resolveLogos()
        await f.flush()
        assert.equal(f.frames.size, 0)
        assert.equal(f.unavailable, 0)
        assert.equal(f.renderers[0].draws.length, 0)
    } finally { f.restoreGlobals() }
})

function mouse(x, y, timeStamp = 100, overrides = {}) {
    return {
        clientX: x, clientY: y, timeStamp,
        pointerId: 1, pointerType: 'mouse', button: 0,
        preventDefault() {}, ...overrides,
    }
}

test('desktop rotates before hover, supports mouse steering and returns smoothly to ambient motion', async () => {
    const f = await mountCloud({ desktop: true })
    try {
        const renderer = f.renderers[0]
        assert.equal(f.motion.interactive.value, true)
        assert.equal(f.frames.size, 1)
        assert.deepEqual(renderer.draws.at(-1).rotation, [0, 0])
        for (let i = 0; i < 30; i++) f.advance(100 + i * 16)
        assert.equal(renderer.draws.at(-1).rotation[0], 0)
        assert.ok(renderer.draws.at(-1).rotation[1] > 0, 'the sphere is already moving before any pointer event')
        f.motion.onPointerMove(mouse(290, 310))
        for (let i = 0; i < 150; i++) f.advance(600 + i * 16)
        assert.equal(f.frames.size, 0, 'the exact center does not spin the sphere')
        f.motion.onPointerMove(mouse(550, 40))
        for (let i = 0; i < 30; i++) f.advance(3100 + i * 16)
        const forward = renderer.draws.at(-1).rotation
        assert.ok(forward.every(angle => angle > 0))
        assert.equal(renderer.draws.at(-1).time, 0, 'sphere rotation is independent of the orbit clock')
        f.motion.onPointerMove(mouse(20, 580))
        for (let i = 0; i < 60; i++) f.advance(3600 + i * 16)
        assert.ok(renderer.draws.at(-1).rotation.every(angle => angle < 0))
        assert.equal(f.frames.size, 1, 'pointer updates share one RAF')
        f.motion.onPointerLeave()
        const beforeLeave = renderer.draws.at(-1).rotation
        f.advance(4600)
        const afterLeave = renderer.draws.at(-1).rotation
        assert.ok(afterLeave[1] < beforeLeave[1], 'leave keeps reverse inertia before blending into forward ambient motion')
        for (let i = 1; i < 240; i++) f.advance(4600 + i * 16)
        assert.equal(f.frames.size, 1)
        assert.equal(f.motion.running.value, true)
        const ambient = renderer.draws.at(-1).rotation
        f.advance(4600 + 240 * 16)
        const next = renderer.draws.at(-1).rotation
        assert.ok(Math.abs(next[0] - ambient[0]) < 0.0001)
        assert.ok(Math.abs(next[1] - ambient[1] - 0.105 * 0.016) < 0.0001)
        f.cleanup()
    } finally { f.restoreGlobals() }
})

test('hover speed grows with the distance of the mouse from the sphere center', async () => {
    const angles = []
    for (const x of [330, 570]) {
        const f = await mountCloud({ desktop: true })
        try {
            f.motion.onPointerMove(mouse(x, 310))
            for (let i = 0; i < 30; i++) f.advance(100 + i * 16)
            const [pitch, yaw] = f.renderers[0].draws.at(-1).rotation
            assert.equal(pitch, 0)
            angles.push(yaw)
            f.cleanup()
        } finally { f.restoreGlobals() }
    }
    assert.ok(angles[1] > angles[0] * 4)
})

test('mouse drag captures the pointer, rotates directly and releases into decaying inertia', async () => {
    const f = await mountCloud({ desktop: true })
    try {
        let prevented = false
        f.motion.onPointerDown(mouse(290, 310, 100, { preventDefault: () => { prevented = true } }))
        assert.equal(prevented, true)
        assert.equal(f.motion.dragging.value, true)
        assert.equal(f.captures.has(1), true)
        f.motion.onPointerMove(mouse(440, 420, 116))
        f.advance(120)
        const dragged = f.renderers[0].draws.at(-1).rotation
        assert.ok(dragged[0] < 0 && dragged[1] > 0)
        assert.equal(f.frames.size, 0, 'holding the pointer still does not run a loop')
        f.motion.onPointerUp(mouse(440, 420, 120, { pointerId: 2 }))
        assert.equal(f.motion.dragging.value, true)
        f.motion.onPointerUp(mouse(440, 420, 120))
        f.motion.onPointerCancel() // Normal lostpointercapture must preserve release inertia.
        assert.equal(f.motion.dragging.value, false)
        assert.equal(f.captures.size, 0)
        for (let i = 0; i < 240; i++) f.advance(130 + i * 16)
        const settled = f.renderers[0].draws.at(-1).rotation
        assert.ok(settled[0] < dragged[0] && settled[1] > dragged[1])
        assert.equal(f.frames.size, 1)
        f.advance(130 + 240 * 16)
        assert.ok(f.renderers[0].draws.at(-1).rotation[1] > settled[1], 'release settles into ambient motion rather than stopping')
        f.cleanup()
    } finally { f.restoreGlobals() }
})

test('orbits and ambient rotation ignore touch input while desktop coarse/reduced motion remain static', async () => {
    for (const options of [{}, { desktop: true, fine: false }, { desktop: true, reduced: true }, { desktop: true }]) {
        const f = await mountCloud(options)
        try {
            const touchOnly = options.desktop && options.fine !== false && !options.reduced
            const event = mouse(550, 40, 100, touchOnly ? { pointerType: 'touch' } : {})
            f.motion.onPointerMove(event)
            f.motion.onPointerDown(event)
            for (let i = 0; i < 10; i++) f.advance(100 + i * 16)
            const rotation = f.renderers[0].draws.at(-1).rotation
            if (touchOnly) {
                assert.equal(rotation[0], 0)
                assert.ok(rotation[1] > 0, 'touch cannot steer the fine-pointer ambient sphere')
            } else assert.deepEqual(rotation, [0, 0])
            assert.equal(f.captures.size, 0)
            assert.equal(f.motion.dragging.value, false)
            assert.equal(f.frames.size, !options.desktop || touchOnly ? 1 : 0)
            assert.equal(f.renderers[0].draws.at(-1).orbit, !options.desktop)
            f.cleanup()
        } finally { f.restoreGlobals() }
    }
})

test('desktop lifecycle changes release a drag and cannot resume stale pointer motion', async () => {
    for (const pause of ['reduced', 'forced', 'fine', 'hidden', 'offscreen', 'blur', 'theme', 'resize', 'unmount']) {
        const f = await mountCloud({ desktop: true })
        try {
            f.motion.onPointerDown(mouse(200, 300))
            f.motion.onPointerMove(mouse(500, 400, 116))
            if (pause === 'unmount') {
                f.cleanup()
                continue
            }
            if (['reduced', 'forced', 'fine'].includes(pause)) {
                f.queries[pause].matches = pause !== 'fine'
                f.queries[pause].dispatchEvent(new Event('change'))
            } else if (pause === 'hidden') {
                f.document.hidden = true
                f.document.dispatchEvent(new Event('visibilitychange'))
            } else if (pause === 'offscreen') f.callbacks.intersection([{ isIntersecting: false }])
            else if (pause === 'blur') f.window.dispatchEvent(new Event('blur'))
            else if (pause === 'theme') f.setTheme('dark')
            else f.callbacks.resize()
            assert.equal(f.captures.size, 0, pause)
            assert.equal(f.motion.dragging.value, false, pause)
            assert.equal(f.frames.size, ['blur', 'theme', 'resize'].includes(pause) ? 1 : 0, pause)
            f.queries.reduced.matches = false
            f.queries.forced.matches = false
            f.queries.fine.matches = true
            f.document.hidden = false
            f.callbacks.intersection([{ isIntersecting: true }])
            f.advance(100000)
            assert.equal(f.frames.size, 1, 'resuming visibility restores ambient rotation without a stale drag')
            for (let i = 1; i < 180; i++) f.advance(100000 + i * 16)
            const ambient = f.renderers.at(-1).draws.at(-1).rotation
            f.advance(100000 + 180 * 16)
            assert.ok(Math.abs(f.renderers.at(-1).draws.at(-1).rotation[0] - ambient[0]) < 0.0001)
            f.cleanup()
        } finally { f.restoreGlobals() }
    }
})
