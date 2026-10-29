// Test-only browser utilities, installed before fixture navigation. Unknown
// paint/effects remain explicit; a missing measurement must never count as pass.
export function installContrastTools() {
    const colors = new Map()
    const rgba = value => {
        if (colors.has(value)) return colors.get(value)
        let serialized = value
        if (!/^rgba?\(/.test(value) && !/^color\(srgb /.test(value)) {
            // Let the browser convert modern CSS colors without an 8-bit canvas
            // round trip (notably Tailwind's color-mix() -> oklab() alpha fills).
            const probe = document.createElement('span')
            probe.style.setProperty('color', `color(from ${value} srgb r g b / alpha)`, 'important')
            probe.style.setProperty('display', 'none', 'important')
            document.documentElement.append(probe)
            serialized = probe.style.color ? getComputedStyle(probe).color : ''
            probe.remove()
        }
        const srgb = serialized.match(/^color\(srgb ([^)]+)\)$/)
        const rgb = serialized.match(/^rgba?\(([^)]+)\)$/)
        const parts = (srgb?.[1] || rgb?.[1] || '').replaceAll(',', ' ').replace('/', ' ').trim().split(/\s+/).map(Number)
        const result = parts.length >= 3 && parts.every(Number.isFinite)
            ? [...parts.slice(0, 3).map(channel => channel * (srgb ? 255 : 1)), parts[3] ?? 1] : null
        // Out-of-sRGB paint needs separate color-management evidence.
        const supported = result && result.slice(0, 3).every(channel => channel >= -.001 && channel <= 255.001)
            && result[3] >= 0 && result[3] <= 1 ? result.map((channel, i) => i < 3 ? Math.max(0, Math.min(255, channel)) : channel) : null
        colors.set(value, supported)
        return supported
    }
    const over = (front, back) => front.slice(0, 3).map((channel, i) => channel * front[3] + back[i] * (1 - front[3]))
    const luminance = color => color.slice(0, 3).map(channel => {
        const value = channel / 255
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
    }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0)
    const ratio = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
    const contrast = (front, back) => ratio(luminance(over(front, back)), luminance(back))
    const selector = element => {
        const path = []
        for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
            path.unshift(`${node.tagName.toLowerCase()}:nth-child(${[...node.parentElement.children].indexOf(node) + 1})`)
        }
        return `html > ${path.join(' > ')}`
    }
    const background = element => {
        const ancestors = []
        for (let node = element; node; node = node.parentElement) ancestors.push(node)
        // Opacity applies after the whole group is painted. Do not approximate
        // it by multiplying text alpha over an already composited background.
        for (const node of ancestors) {
            const css = getComputedStyle(node)
            if (Number(css.opacity) !== 1) return { manual: true, reason: 'opacity-group', selector: selector(node) }
            if (css.filter !== 'none' || css.mixBlendMode !== 'normal') return { manual: true, reason: 'filter-or-blend', selector: selector(node) }
        }
        let low = [0, 0, 0], high = [255, 255, 255]
        let unresolved = { manual: true, reason: 'no-surface' }
        for (const node of ancestors.toReversed()) {
            const css = getComputedStyle(node)
            const fill = rgba(css.backgroundColor)
            if (!fill) { unresolved = { manual: true, reason: 'unsupported-color', selector: selector(node), value: css.backgroundColor }; continue }
            // A sticky/fixed surface may cover unrelated scrolled content.
            // Its parent background is not evidence about that backdrop.
            if (['sticky', 'fixed'].includes(css.position) && fill[3] > 0) {
                low = [0, 0, 0]; high = [255, 255, 255]
                unresolved = null
            }
            if (fill[3] === 1) unresolved = null
            low = over(fill, low)
            high = over(fill, high)
            if (css.backgroundImage !== 'none') unresolved = { manual: true, reason: 'background-image', selector: selector(node) }
        }
        if (unresolved) return unresolved
        const bounded = low.some((channel, i) => channel !== high[i])
        return { manual: false, low, high, method: bounded ? 'all-srgb-backdrops' : 'opaque-surface' }
    }
    const minimumContrast = (foreground, behind) => {
        if (!foreground || behind.manual) return null
        const a = [luminance(over(foreground, behind.low)), luminance(over(foreground, behind.high))]
        const b = [luminance(behind.low), luminance(behind.high)]
        // Independent luminance intervals give a conservative lower bound.
        // For opaque foregrounds this is the exact interval minimum.
        return a[0] > b[1] ? ratio(a[0], b[1]) : b[0] > a[1] ? ratio(b[0], a[1]) : 1
    }
    const exception = element => {
        if (element.closest('[role="img"][aria-label="dudeweb"]')) return 'logotype'
        const label = element.closest('label')
        if (element.closest(':disabled') || label?.control?.matches(':disabled')) return 'inactive-native-control'
        return null
    }
    window.__contrastTools = { rgba, over, luminance, contrast, selector, background, minimumContrast, exception }
}
