export const SIGNAL_ORBIT_PATH = 'M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z'

const START = [154, 10]
const CURVES = [
    [[215, -2], [286, 34], [292, 92]],
    [[298, 142], [255, 160], [269, 211]],
    [[282, 258], [222, 302], [158, 288]],
    [[104, 276], [88, 244], [43, 224]],
    [[1, 205], [-6, 142], [23, 94]],
    [[50, 50], [92, 58], [120, 25]],
    [[131, 13], [142, 10], [154, 10]],
]

const REST_THRESHOLD = 0.0005
const EPSILON = 1e-9

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function cubicValue(start, first, second, end, time) {
    const inverse = 1 - time

    return inverse ** 3 * start
        + 3 * inverse ** 2 * time * first
        + 3 * inverse * time ** 2 * second
        + time ** 3 * end
}

function extrema(start, first, second, end) {
    const quadratic = -start + 3 * first - 3 * second + end
    const linear = 2 * (start - 2 * first + second)
    const constant = first - start

    if (Math.abs(quadratic) < EPSILON) {
        return Math.abs(linear) < EPSILON ? [] : [-constant / linear]
    }

    const discriminant = linear ** 2 - 4 * quadratic * constant

    if (discriminant < 0) {
        return []
    }

    const root = Math.sqrt(discriminant)

    return [(-linear + root) / (2 * quadratic), (-linear - root) / (2 * quadratic)]
}

function boundsOf(start, curves) {
    const axes = [[start[0]], [start[1]]]
    let previous = start

    for (const [first, second, end] of curves) {
        for (const axis of [0, 1]) {
            axes[axis].push(end[axis])

            for (const time of extrema(previous[axis], first[axis], second[axis], end[axis])) {
                if (time > 0 && time < 1) {
                    axes[axis].push(cubicValue(previous[axis], first[axis], second[axis], end[axis], time))
                }
            }
        }

        previous = end
    }

    return axes.map(values => ({ min: Math.min(...values), max: Math.max(...values) }))
}

const SOURCE_BOUNDS = boundsOf(START, CURVES)

const MAX_DISPLACEMENT = 48
const MAX_SQUASH = 0.2

/** Bend with pointer momentum and squash across its direction, inside the Pen envelope. */
export function deformSignalOrbit({ x = 0.5, y = 0.5, dx = 0, dy = 0 } = {}) {
    const impulseX = clamp(dx, -1, 1)
    const impulseY = clamp(dy, -1, 1)

    if (Math.abs(impulseX) < REST_THRESHOLD && Math.abs(impulseY) < REST_THRESHOLD) {
        return SIGNAL_ORBIT_PATH
    }

    const pointerX = clamp(x, 0, 1)
    const pointerY = clamp(y, 0, 1)
    const energy = Math.min(1, Math.hypot(impulseX, impulseY))
    const horizontal = Math.abs(impulseX) / (Math.abs(impulseX) + Math.abs(impulseY))
    const scales = [1 - MAX_SQUASH * energy * (1 - horizontal), 1 - MAX_SQUASH * energy * horizontal]
    const warp = point => {
        const u = (point[0] - SOURCE_BOUNDS[0].min) / (SOURCE_BOUNDS[0].max - SOURCE_BOUNDS[0].min)
        const v = (point[1] - SOURCE_BOUNDS[1].min) / (SOURCE_BOUNDS[1].max - SOURCE_BOUNDS[1].min)
        const distance = (u - pointerX) ** 2 + (v - pointerY) ** 2
        const influence = 0.3 + 0.7 * Math.exp(-distance / 0.4)

        return [
            point[0] + impulseX * MAX_DISPLACEMENT * Math.sin(Math.PI * clamp(u, 0, 1)) * influence,
            point[1] + impulseY * MAX_DISPLACEMENT * Math.sin(Math.PI * clamp(v, 0, 1)) * influence,
        ]
    }

    const start = warp(START)
    const curves = CURVES.map(curve => curve.map(warp))
    const bounds = boundsOf(start, curves)
    const normalize = point => point.map((value, axis) => {
        const source = SOURCE_BOUNDS[axis]
        const deformed = bounds[axis]
        const size = (source.max - source.min) * scales[axis]
        const inset = (source.max - source.min - size) / 2
        const normalized = source.min + inset + (value - deformed.min) * size / (deformed.max - deformed.min)

        return Number(normalized.toFixed(4))
    })
    const command = point => normalize(point).join(' ')

    return `M${command(start)}${curves.map(curve => `C${curve.map(command).join(' ')}`).join('')}z`
}
