import assert from 'node:assert/strict'
import test from 'node:test'
import { deformSignalOrbit, SIGNAL_ORBIT_PATH } from '../../../resources/js/utils/signalOrbitGeometry.js'

// Sample the rendered cubic curves independently of the runtime extrema solver.
function sampledBounds(path) {
    const values = path.match(/-?\d+(?:\.\d+)?/g).map(Number)
    let previous = values.slice(0, 2)
    const relative = path.includes('c')
    const min = [...previous]
    const max = [...previous]

    for (let offset = 2; offset < values.length; offset += 6) {
        const points = [0, 2, 4].map(index => [
            values[offset + index] + (relative ? previous[0] : 0),
            values[offset + index + 1] + (relative ? previous[1] : 0),
        ])

        for (let step = 0; step <= 1024; step++) {
            const time = step / 1024
            const inverse = 1 - time

            for (const axis of [0, 1]) {
                const coordinate = inverse ** 3 * previous[axis]
                    + 3 * inverse ** 2 * time * points[0][axis]
                    + 3 * inverse * time ** 2 * points[1][axis]
                    + time ** 3 * points[2][axis]

                min[axis] = Math.min(min[axis], coordinate)
                max[axis] = Math.max(max[axis], coordinate)
            }
        }

        previous = points[2]
    }

    return { min, max, start: values.slice(0, 2), end: previous }
}

test('rest and settled impulses restore the exact accepted Pen path', () => {
    assert.equal(deformSignalOrbit(), SIGNAL_ORBIT_PATH)
    assert.equal(deformSignalOrbit({ x: 0, y: 1, dx: 0, dy: 0 }), SIGNAL_ORBIT_PATH)
    assert.equal(deformSignalOrbit({ dx: 0.0001, dy: -0.0001 }), SIGNAL_ORBIT_PATH)
})

test('the contour responds differently to direction and pointer proximity', () => {
    const paths = [
        deformSignalOrbit({ x: 0.7, y: 0.3, dx: 1, dy: 0 }),
        deformSignalOrbit({ x: 0.7, y: 0.3, dx: -1, dy: 0 }),
        deformSignalOrbit({ x: 0.7, y: 0.3, dx: 0, dy: 1 }),
        deformSignalOrbit({ x: 0, y: 1, dx: 1, dy: 0 }),
    ]

    assert.equal(new Set(paths).size, 4)
    assert.ok(paths.every(path => path !== SIGNAL_ORBIT_PATH))
})

test('strong motion visibly changes size across its direction by twenty percent', () => {
    const source = sampledBounds(SIGNAL_ORBIT_PATH)
    const horizontal = sampledBounds(deformSignalOrbit({ dx: 1 }))
    const vertical = sampledBounds(deformSignalOrbit({ dy: 1 }))
    const size = (bounds, axis) => bounds.max[axis] - bounds.min[axis]

    assert.ok(Math.abs(size(horizontal, 1) / size(source, 1) - 0.8) < 0.001)
    assert.ok(Math.abs(size(vertical, 0) / size(source, 0) - 0.8) < 0.001)
    assert.ok(Math.abs(size(horizontal, 0) / size(source, 0) - 1) < 0.001)
    assert.ok(Math.abs(size(vertical, 1) / size(source, 1) - 1) < 0.001)
})

test('gentle motion produces a smaller size change than fast motion', () => {
    const gentle = sampledBounds(deformSignalOrbit({ dx: 0.1 }))
    const strong = sampledBounds(deformSignalOrbit({ dx: 1 }))

    assert.ok(gentle.max[1] - gentle.min[1] > strong.max[1] - strong.min[1] + 40)
})

test('all motion stays inside the accepted Pen envelope with a single closed contour', () => {
    const source = sampledBounds(SIGNAL_ORBIT_PATH)

    for (const x of [0, 0.5, 1]) {
        for (const y of [0, 0.5, 1]) {
            for (const [dx, dy] of [[-1, -1], [-1, 1], [1, -1], [1, 1], [1, 0], [0, -1]]) {
                const path = deformSignalOrbit({ x, y, dx, dy })
                const result = sampledBounds(path)

                assert.doesNotMatch(path, /NaN|Infinity/)
                assert.deepEqual(result.start, result.end)
                assert.equal((path.match(/M/g) ?? []).length, 1)

                for (const axis of [0, 1]) {
                    assert.ok(result.min[axis] >= source.min[axis] - 0.002)
                    assert.ok(result.max[axis] <= source.max[axis] + 0.002)
                }
            }
        }
    }
})

test('extreme pointer input saturates without enlarging the Pen envelope', () => {
    assert.equal(
        deformSignalOrbit({ x: 2, y: -1, dx: 1000, dy: -1000 }),
        deformSignalOrbit({ x: 1, y: 0, dx: 1, dy: -1 }),
    )
})
