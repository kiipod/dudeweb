export const SERVICE_LOGOS = [
    'instagram', 'facebook', 'threads', 'x', 'linkedin', 'youtube', 'telegram',
    'discord', 'patreon', 'onlyfans', 'soundcloud', 'spotify', 'openai',
    'anthropic', 'googlegemini', 'steam', 'tiktok', 'signal', 'airbnb',
    'bookingdotcom', 'ubisoft', 'ea', 'netflix',
]

// Pen's 128px atlas cells contain an 88px logo. Keep that visible footprint.
const LOGO_FOOTPRINT = 88 / 128
const FIBONACCI_ANGLE = 2.399963

export function serviceLogoUrl(name, theme) {
    return `/images/hero/services/brands/${name}-${theme}.svg`
}

export function orbitOpacityAt(x, y, width, height) {
    const distance = Math.hypot((x - width / 2) / (width * 0.72), (y - height / 2) / (height * 0.90))
    const progress = Math.max(0, Math.min(1, (distance - 0.34) / (0.70 - 0.34)))
    return 0.20 + 0.65 * progress * progress * (3 - 2 * progress)
}

export function projectServiceLogos({ width, height, time, orbit, staticMotion, rotation }) {
    const minimum = Math.min(width, height)
    const t = staticMotion ? 0 : time
    const [pitch, yaw] = staticMotion ? [0, 0] : rotation
    const sinPitch = Math.sin(pitch), cosPitch = Math.cos(pitch)
    const sinYaw = Math.sin(yaw), cosYaw = Math.cos(yaw)

    return SERVICE_LOGOS.map((name, index) => {
        const angle = index * FIBONACCI_ANGLE
        let x, y, size, opacity

        if (orbit) {
            const ring = index % 3
            const direction = ring === 1 ? -1 : 1
            const phase = angle + t * (0.08 + ring * 0.015) * direction
            const radius = minimum * (0.34 + ring * 0.18)
            x = width / 2 + Math.cos(phase) * radius
            y = height / 2 + Math.sin(phase) * radius
            size = Math.max(44, Math.min(72, width * 0.12))
            opacity = 1 // A mask reproduces the per-pixel Pen vignette.
        } else {
            const vertical = 1 - 2 * (index + 0.5) / SERVICE_LOGOS.length
            const radius = Math.sqrt(1 - vertical * vertical)
            const horizontal = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const xx = horizontal * cosYaw + z * sinYaw
            const zYaw = -horizontal * sinYaw + z * cosYaw
            const yy = vertical * cosPitch - zYaw * sinPitch
            const zz = vertical * sinPitch + zYaw * cosPitch
            const depth = 1 + zz * 0.24
            x = width / 2 + xx * minimum * 0.37 * depth
            y = height / 2 + yy * minimum * 0.37 * depth
            size = minimum * 0.17 * depth
            opacity = 0.38 + 0.62 * (zz + 1) / 2
        }

        size *= LOGO_FOOTPRINT
        return { name, x: x - size / 2, y: y - size / 2, size, opacity }
    })
}
