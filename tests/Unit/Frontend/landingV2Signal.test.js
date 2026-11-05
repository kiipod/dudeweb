import assert from 'node:assert/strict'
import test from 'node:test'
import { LANDING_V2_SIGNAL_NODES, signalPresence, signalPulseX, signalRing, signalWavePath, signalWavePulseX } from '../../../resources/js/data/landingV2Signal.js'

test('23 independent source lifetimes include a slow fade, hold and a completely hidden interval', () => {
    assert.equal(LANDING_V2_SIGNAL_NODES.length, 23)
    assert.equal(new Set(LANDING_V2_SIGNAL_NODES.map(node => node.period)).size, 23)
    assert.equal(LANDING_V2_SIGNAL_NODES[0].period, 7)
    assert.ok(Math.abs(LANDING_V2_SIGNAL_NODES[1].period - 8.37) < 1e-12)
    assert.equal(LANDING_V2_SIGNAL_NODES[1].phaseOffset, 1.91)
    for (const node of LANDING_V2_SIGNAL_NODES) {
        assert.ok(node.period >= 7 && node.period < 13)
        const start = node.period * 10 - node.phaseOffset
        assert.ok(signalPresence(node, start) < 1e-20)
        assert.ok(Math.abs(signalPresence(node, start + 0.55) - 0.45) < 1e-10)
        assert.ok(Math.abs(signalPresence(node, start + 1.1) - 0.9) < 1e-10)
        assert.ok(Math.abs(signalPresence(node, start + node.period * 0.6) - 0.9) < 1e-10)
        assert.ok(signalPresence(node, start + node.period * 0.9) < 1e-20)
    }
})

test('incoming pulses travel right at 54 units per second and wrap within their own route', () => {
    const node = LANDING_V2_SIGNAL_NODES[0]
    assert.equal(signalPulseX(node, 0), 98)
    assert.equal(signalPulseX(node, 1), 152)
    assert.equal(signalPulseX(node, 9), 98)
    for (const node of LANDING_V2_SIGNAL_NODES) {
        for (const time of [0, 0.55, 1.1, 3, 7, 13, 120]) {
            assert.ok(signalPulseX(node, time) >= node.x + 18)
            assert.ok(signalPulseX(node, time) < 584)
        }
    }
    assert.equal(signalWavePulseX(0, 0), 584)
    assert.equal(signalWavePulseX(0, 1), 650)
    assert.equal(signalWavePulseX(4, 0), 956)
})

test('continuous waves retain fixed origins and source envelopes; fronts expand and fade', () => {
    for (let index = 0; index < 5; index++) {
        const base = 260 + (index - 2) * 3.5
        for (const time of [0, 1.1, 7, 13]) {
            const path = signalWavePath(index, time)
            assert.ok(path.startsWith(`M584 ${base.toFixed(3)}`))
            const points = [...path.matchAll(/[ML](\d+) (-?[\d.]+)/g)]
            assert.equal(points.length, 117)
            assert.equal(Number(points.at(-1)[1]), 1280)
            assert.ok(points.every(point => Math.abs(Number(point[2]) - base) <= 5.501))
        }
        assert.notEqual(signalWavePath(index, 0), signalWavePath(index, 1.1))
    }
    assert.deepEqual(signalRing(0, 0), { radius: 30, opacity: 0.34 })
    assert.ok(signalRing(0, 1).radius > signalRing(0, 0).radius)
    assert.ok(signalRing(0, 1).opacity < signalRing(0, 0).opacity)
    for (let index = 0; index < 3; index++) {
        for (const time of [0, 5, 15, 30]) {
            const ring = signalRing(index, time)
            assert.ok(ring.radius >= 30 && ring.radius < 170)
            assert.ok(ring.opacity > 0 && ring.opacity <= 0.34)
        }
    }
})
