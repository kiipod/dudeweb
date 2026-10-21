// Browser-side measurements. Native/AT/device acceptance remains separate.
export function inspectControlPresentation({ focus = false, icons = false } = {}) {
    const rgba = value => {
        const match = value.match(/^rgba?\(([^)]+)\)$/)
        if (!match) return null
        const channels = match[1].split(',').map(Number)
        return [...channels.slice(0, 3), channels[3] ?? 1]
    }
    const over = (front, back) => front.slice(0, 3).map((value, index) => value * front[3] + back[index] * (1 - front[3]))
    const luminance = color => color.slice(0, 3).map(value => {
        value /= 255
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
    }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
    const contrast = (front, back) => {
        const a = luminance(over(front, back)), b = luminance(back)
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
    }
    const background = element => {
        const ancestors = []
        for (let node = element; node; node = node.parentElement) ancestors.unshift(getComputedStyle(node))
        let color = [255, 255, 255]
        let manual = false
        for (const css of ancestors) {
            if (css.backgroundImage !== 'none' || Number(css.opacity) !== 1) manual = true
            const fill = rgba(css.backgroundColor)
            if (fill) color = over(fill, color)
            else manual = true
        }
        return { color, manual }
    }
    const identify = element => `${element.tagName}#${element.id} ${element.getAttribute('aria-label') || element.textContent.trim() || element.name || ''}`.slice(0, 140)
    const result = { focus: null, icons: [] }
    if (focus) {
        const active = document.activeElement
        if (!active || active === document.body) return { ...result, focus: { body: true } }
        let host = active
        while (host && host !== document.body) {
            const css = getComputedStyle(host)
            // A native outline on a clipped sr-only input is not the painted
            // indicator. Its enclosing label owns focus-within/has-focus-visible.
            if (!host.classList.contains('sr-only') && parseFloat(css.outlineWidth) > 0 && css.outlineStyle !== 'none') break
            host = host.parentElement
        }
        result.focus = { element: identify(active), visibleFocus: active.matches(':focus-visible'), missing: !host || host === document.body }
        if (!result.focus.missing) {
            const css = getComputedStyle(host), box = host.getBoundingClientRect()
            const outside = background(host.parentElement)
            const color = rgba(css.outlineColor)
            const points = [.15, .5, .85].flatMap(x => [.15, .5, .85].map(y => [box.x + box.width * x, box.y + box.height * y]))
            const unobscured = points.some(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight && host.contains(document.elementFromPoint(x, y)))
            result.focus = { ...result.focus, host: identify(host), width: parseFloat(css.outlineWidth), color: css.outlineColor, manual: outside.manual, ratio: color && !outside.manual ? contrast(color, outside.color) : null, unobscured }
        }
    }
    if (icons) {
        for (const control of document.querySelectorAll('button, a[href], summary')) {
            if (!control.checkVisibility({ visibilityProperty: true, opacityProperty: true }) || control.closest('[inert], [aria-hidden="true"], :disabled') || control.textContent.trim() || control.querySelector('[role="img"]')) continue
            for (const icon of control.querySelectorAll('svg')) {
                const css = getComputedStyle(icon)
                const stroke = rgba(css.stroke)
                if (!stroke) continue
                const behind = background(icon)
                result.icons.push({ element: identify(control), stroke: css.stroke, manual: behind.manual, ratio: behind.manual ? null : contrast(stroke, behind.color) })
            }
        }
    }
    return result
}
