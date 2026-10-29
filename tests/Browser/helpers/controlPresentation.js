// Browser-side measurements. Native/AT/device acceptance remains separate.
export function inspectControlPresentation({ focus = false, icons = false, selection = false } = {}) {
    const { rgba, over, selector, background, minimumContrast } = window.__contrastTools
    const identify = element => `${element.tagName}#${element.id} ${element.getAttribute('aria-label') || element.textContent.trim() || element.name || ''}`.slice(0, 140)
    const result = { focus: null, icons: [], selections: [] }
    if (selection) {
        for (const input of document.querySelectorAll('input[type="radio"]:checked:not(:disabled)')) {
            const host = input.closest('label')
            if (!host || !host.checkVisibility() || host.closest('[inert]')) continue
            const css = getComputedStyle(host)
            const outside = background(host.parentElement)
            const fill = rgba(css.backgroundColor)
            const border = parseFloat(css.borderTopWidth) > 0 && css.borderTopStyle !== 'none' ? rgba(css.borderTopColor) : null
            // The selected tile is the state indicator for these custom radios.
            // Compare its fill/boundary with the adjacent group background.
            const inside = !outside.manual && fill ? { ...outside, low: over(fill, outside.low), high: over(fill, outside.high) } : outside
            const ratio = Math.max(fill ? minimumContrast(fill, outside) ?? 1 : 1, border ? minimumContrast(border, inside) ?? 1 : 1)
            result.selections.push({ element: input.name, manual: outside.manual, ratio })
        }
    }
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
            result.focus = { ...result.focus, host: identify(host), width: parseFloat(css.outlineWidth), color: css.outlineColor, manual: outside.manual || !color, reason: outside.reason, method: outside.method, ratio: minimumContrast(color, outside), unobscured, selector: selector(host), offset: parseFloat(css.outlineOffset), box: { x: box.x, y: box.y, width: box.width, height: box.height } }
        }
    }
    if (icons) {
        for (const control of document.querySelectorAll('button, a[href], summary')) {
            if (!control.checkVisibility({ visibilityProperty: true, opacityProperty: true }) || control.closest('[inert], [aria-hidden="true"], :disabled') || control.textContent.trim() || control.querySelector('[role="img"]')) continue
            for (const icon of control.querySelectorAll('svg')) {
                const css = getComputedStyle(icon)
                const stroke = rgba(css.stroke)
                if (!stroke) { result.icons.push({ element: identify(control), manual: true, reason: 'unsupported-stroke', stroke: css.stroke }); continue }
                const behind = background(icon)
                result.icons.push({ element: identify(control), stroke: css.stroke, manual: behind.manual, reason: behind.reason, method: behind.method, ratio: minimumContrast(stroke, behind) })
            }
        }
    }
    return result
}
