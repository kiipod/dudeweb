// Focused, dependency-free checks. These do not replace an accessibility engine
// or a physical assistive-technology walkthrough.
export function inspectAccessibility() {
    const visible = element => element.checkVisibility({ visibilityProperty: true, opacityProperty: true })
        && getComputedStyle(element).visibility !== 'hidden'
        && !element.closest('[inert], [aria-hidden="true"]')
    const identify = element => `${element.tagName.toLowerCase()}#${element.id} ${element.textContent.trim().slice(0, 90)}`
    const issues = []
    const ids = new Set()
    for (const element of document.querySelectorAll('[id]')) {
        if (ids.has(element.id)) issues.push(`Duplicate id: ${element.id}`)
        ids.add(element.id)
    }
    let lastHeading = 0
    for (const element of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
        if (!visible(element)) continue
        const level = Number(element.tagName[1])
        // A modal hides the page h1 from the accessibility tree; its labelled
        // heading can retain h2. Check skips between exposed headings.
        if (lastHeading && level > lastHeading + 1) issues.push(`Heading level ${lastHeading} → ${level}: ${identify(element)}`)
        lastHeading = level
    }
    for (const element of document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]')) {
        if (!visible(element)) continue
        for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
            // aria-controls may reference an unmounted, collapsed overlay.
            if (attribute === 'aria-controls' && element.getAttribute('aria-expanded') === 'false') continue
            for (const id of (element.getAttribute(attribute) || '').split(/\s+/).filter(Boolean)) {
                if (!document.getElementById(id)) issues.push(`Missing ${attribute} target ${id}: ${identify(element)}`)
            }
        }
    }
    for (const element of document.querySelectorAll('input:not([type="hidden"]),select,textarea')) {
        if (!visible(element)) continue
        if (!element.labels?.length && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            issues.push(`Unlabelled field: ${identify(element)}`)
        }
    }
    const targets = [...document.querySelectorAll('button, a[href], [role="button"]')].filter(visible)
    for (const element of targets) {
        const name = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.textContent.trim()
        if (!name) issues.push(`Unnamed control: ${identify(element)}`)
        const bounds = element.getBoundingClientRect()
        // Inline links in prose have a WCAG target-size exception.
        if (getComputedStyle(element).display === 'inline' && element.closest('p, li')) continue
        if (bounds.width >= 24 && bounds.height >= 24) continue
        const x = bounds.x + bounds.width / 2
        const y = bounds.y + bounds.height / 2
        // WCAG 2.5.8 permits a small target when its centered 24px circle
        // intersects neither another target nor another small target's circle.
        const crowded = targets.some(other => {
            if (other === element || other.contains(element) || element.contains(other)) return false
            const box = other.getBoundingClientRect()
            if (box.width < 24 || box.height < 24) {
                return Math.hypot(x - box.x - box.width / 2, y - box.y - box.height / 2) < 24
            }
            return Math.hypot(x - Math.max(box.left, Math.min(x, box.right)), y - Math.max(box.top, Math.min(y, box.bottom))) < 12
        })
        if (crowded) issues.push(`Crowded target below 24px (${bounds.width.toFixed(1)}×${bounds.height.toFixed(1)}): ${identify(element)}`)
    }
    return issues
}

export async function enlargeText(page) {
    await page.evaluate(() => {
        const elements = [...document.querySelectorAll('body *')]
            .filter(element => element.namespaceURI === 'http://www.w3.org/1999/xhtml')
        const styles = elements.map(element => {
            const css = getComputedStyle(element)
            return [element, parseFloat(css.fontSize), css.lineHeight]
        })
        for (const [element, size, line] of styles) {
            element.style.setProperty('font-size', `${size * 2}px`, 'important')
            if (line !== 'normal') element.style.setProperty('line-height', `${parseFloat(line) * 2}px`, 'important')
        }
    })
}

export function inspectTextContrast() {
    const { rgba, selector, background, minimumContrast, exception } = window.__contrastTools
    const result = { checked: 0, fieldsChecked: 0, measurements: [], fields: [], failures: [], fieldFailures: [], manual: [], manualDetails: [], fieldManual: [], exemptions: [], bounds: [] }
    const text = (element, colorValue, label, kind = 'text') => {
        const css = getComputedStyle(element)
        const path = selector(element)
        const exempt = exception(element)
        if (exempt) { result.exemptions.push({ label, selector: path, reason: exempt }); return }
        const behind = background(element)
        const color = rgba(colorValue)
        const required = parseFloat(css.fontSize) >= 24 || (parseFloat(css.fontSize) >= 56 / 3 && Number(css.fontWeight) >= 700) ? 3 : 4.5
        if (behind.manual || !color) {
            result.manual.push(label)
            result.manualDetails.push({ label, kind, color: colorValue, required, ...behind, reason: behind.reason || 'unsupported-foreground', root: behind.selector, selector: path })
            return
        }
        const ratio = minimumContrast(color, behind)
        result.checked++
        result.measurements.push({ label, kind, selector: path, ratio, required, method: behind.method })
        if (behind.method === 'all-srgb-backdrops') result.bounds.push({ label, kind, ratio, required, ...behind })
        if (ratio < required) result.failures.push({ label, kind, foreground: colorValue, background: behind, ratio, required })
    }
    for (const element of document.querySelectorAll('body *')) {
        if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml'
            || ![...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
            || !element.checkVisibility({ visibilityProperty: true, opacityProperty: true }) || element.closest('[aria-hidden="true"], [inert], .sr-only')) continue
        const css = getComputedStyle(element)
        if (css.visibility !== 'hidden') text(element, css.color, element.textContent.trim().slice(0, 70))
    }
    for (const element of document.querySelectorAll('input:not([type="hidden"]), textarea, select, button[role="combobox"]')) {
        if (element.closest('.sr-only, [aria-hidden="true"], [inert]') || !element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue
        if (exception(element)) {
            result.exemptions.push({ label: element.id || element.name, selector: selector(element), reason: exception(element), kind: 'field' })
            continue
        }
        if (element.matches('input:not([type="radio"]):not([type="checkbox"]), textarea')) {
            if (element.value) text(element, getComputedStyle(element).color, element.id || element.name, 'field-value')
            else if (element.placeholder) {
                const placeholder = getComputedStyle(element, '::placeholder')
                if (Number(placeholder.opacity) !== 1) {
                    result.manual.push(element.placeholder)
                    result.manualDetails.push({ label: element.placeholder, selector: selector(element), kind: 'placeholder', reason: 'placeholder-opacity' })
                } else text(element, placeholder.color, element.placeholder, 'placeholder')
            }
        }
        let boundary = element
        if (parseFloat(getComputedStyle(boundary).borderTopWidth) === 0) boundary = element.parentElement
        const css = getComputedStyle(boundary)
        const outside = background(boundary.parentElement)
        const border = parseFloat(css.borderTopWidth) ? rgba(css.borderTopColor) : null
        const fill = rgba(css.backgroundColor)
        if (outside.manual || !fill || (parseFloat(css.borderTopWidth) && !border)) {
            result.fieldManual.push({ field: element.id || element.name, selector: selector(element), ...outside })
            continue
        }
        // Border paint is composited over the field fill, then compared with
        // the exterior. A visible fill may itself identify the boundary.
        const paintedBorder = border && [0, 1, 2].map(i => border[i] * border[3] + fill[i] * fill[3] * (1 - border[3]))
        const borderAlpha = border && border[3] + fill[3] * (1 - border[3])
        const edge = borderAlpha ? [...paintedBorder.map(channel => channel / borderAlpha), borderAlpha] : null
        const ratio = Math.max(edge ? minimumContrast(edge, outside) : 1, minimumContrast(fill, outside))
        result.fieldsChecked++
        result.fields.push({ field: element.id || element.name, ratio, method: outside.method })
        if (ratio < 3) result.fieldFailures.push({ field: element.id, border: css.borderTopColor, outside, ratio })
    }
    return result
}

export function inspectTextClipping() {
    const issues = []
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT)
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent.trim()) continue
        const element = text.parentElement
        if (element.closest('.sr-only, [aria-hidden="true"], [inert]') || !element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue
        const range = document.createRange()
        range.selectNodeContents(text)
        for (let parent = element; parent; parent = parent.parentElement) {
            const css = getComputedStyle(parent)
            const bounds = parent.getBoundingClientRect()
            const clipX = ['hidden', 'clip'].includes(css.overflowX)
            const clipY = ['hidden', 'clip'].includes(css.overflowY)
            if (!clipX && !clipY) continue
            if ([...range.getClientRects()].some(rect => rect.width && rect.height && (
                clipX && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1)
                || clipY && (rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1)
            ))) {
                issues.push({ text: text.textContent.trim().slice(0, 70), clippingAncestor: parent.className })
                break
            }
        }
    }
    return issues
}
