// Native logical coordinates from the current Pen shader and editable SkTTd atlas.
// Static SVG and live motion share the source shader's geometry and one clock.
const SOURCES = [
    ['instagram', 80, 52], ['facebook', 144, 74], ['threads', 260, 62],
    ['x', 316, 110], ['linkedin', 40, 140], ['youtube', 110, 156],
    ['telegram', 198, 132], ['discord', 276, 174], ['patreon', 64, 232],
    ['onlyfans', 144, 226], ['soundcloud', 224, 246], ['spotify', 304, 214],
    ['openai', 36, 320], ['anthropic', 112, 310], ['googlegemini', 188, 334],
    ['steam', 270, 298], ['tiktok', 330, 350], ['signal', 64, 406],
    ['airbnb', 140, 388], ['bookingdotcom', 218, 424], ['ubisoft', 300, 402],
    ['ea', 112, 466], ['netflix', 252, 478],
]

export const LANDING_V2_SIGNAL_NODES = SOURCES.map(([name, x, y], index) => {
    const start = x + 18
    const endY = 260 + (index % 5 - 2) * 1.1
    return {
        name, x, y,
        index,
        period: 7 + (index * 1.37) % 6,
        phaseOffset: index * 1.91,
        // A cubic with x control points at 1/3 and 2/3 is the source smoothstep.
        route: `M ${start} ${y} C ${(start + (584 - start) / 3).toFixed(3)} ${y} ${(start + (584 - start) * 2 / 3).toFixed(3)} ${endY} 584 ${endY}`,
        pulseX: start + (index * 79) % (584 - start),
    }
})

function smoothstep(min, max, value) {
    const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)))
    return fraction * fraction * (3 - 2 * fraction)
}

export function signalPresence(node, time) {
    const phase = (time + node.phaseOffset) % node.period
    return 0.9 * smoothstep(0, 1.1, phase) * (1 - smoothstep(node.period * 0.65, node.period * 0.85, phase))
}

export function signalPulseX(node, time) {
    const start = node.x + 18
    return start + (time * 54 + node.index * 79) % (584 - start)
}

export function signalWavePulseX(index, time) {
    return 584 + (time * 66 + index * 93) % 760
}

export function signalWavePath(index, time) {
    return Array.from({ length: 117 }, (_, step) => {
        const x = 584 + step * 6
        const y = 260 + (index - 2) * 3.5 + Math.sin((x - 584) * 0.018 - time * 0.65 + index * 0.22) * 5.5 * smoothstep(584, 720, x)
        return `${step ? 'L' : 'M'}${x} ${y.toFixed(3)}`
    }).join(' ')
}

export function signalRing(index, time) {
    const phase = (time * 0.065 + index / 3) % 1
    return { radius: 30 + phase * 140, opacity: (1 - phase) * 0.34 }
}

export const LANDING_V2_SIGNAL_WAVES = Array.from({ length: 5 }, (_, index) => ({
    index,
    pulseX: signalWavePulseX(index, 0),
    path: signalWavePath(index, 0),
}))

export const LANDING_V2_SIGNAL_RINGS = Array.from({ length: 3 }, (_, index) => ({ index, ...signalRing(index, 0) }))
