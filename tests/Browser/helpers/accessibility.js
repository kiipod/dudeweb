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
    const failures = []
    const fieldFailures = []
    const manual = []
    let checked = 0
    const rgba = color => {
        const match = color.match(/^rgba?\(([^)]+)\)$/)
        if (!match) return null
        const channels = match[1].split(',').map(Number)
        return [...channels.slice(0, 3), channels[3] ?? 1]
    }
    const over = (front, back) => front.slice(0, 3).map((channel, i) => channel * front[3] + back[i] * (1 - front[3]))
    const luminance = color => color.slice(0, 3).map(channel => {
        const value = channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    }).reduce((total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i], 0)
    for (const element of document.querySelectorAll('body *')) {
        if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml'
            || ![...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
            || !element.checkVisibility({ visibilityProperty: true, opacityProperty: true }) || element.closest('[aria-hidden="true"], [inert], :disabled, .sr-only, .font-brand')) continue
        const css = getComputedStyle(element)
        if (css.visibility === 'hidden') continue
        const label = element.textContent.trim().slice(0, 70)
        const ancestors = []
        for (let node = element; node; node = node.parentElement) ancestors.unshift(getComputedStyle(node))
        if (ancestors.some(style => style.backgroundImage !== 'none' || Number(style.opacity) !== 1)) {
            manual.push(label)
            continue
        }
        let background = [255, 255, 255]
        let supported = true
        for (const style of ancestors) {
            const color = rgba(style.backgroundColor)
            if (!color) { supported = false; break }
            background = over(color, background)
        }
        const color = rgba(css.color)
        if (!supported || !color) { manual.push(label); continue }
        const foreground = over(color, background)
        const a = luminance(foreground)
        const b = luminance(background)
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        const size = parseFloat(css.fontSize)
        const required = size >= 24 || (size >= 56 / 3 && Number(css.fontWeight) >= 700) ? 3 : 4.5
        checked++
        if (ratio < required) failures.push({ label, foreground: css.color, background, ratio, required })
    }
    for (const element of document.querySelectorAll('input:not([type="hidden"]), textarea, select')) {
        if (element.closest('.sr-only, [aria-hidden="true"], [inert], :disabled') || !element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue
        let boundary = element
        if (parseFloat(getComputedStyle(boundary).borderTopWidth) === 0) boundary = element.parentElement
        const css = getComputedStyle(boundary)
        const ancestors = []
        for (let node = boundary.parentElement; node; node = node.parentElement) ancestors.unshift(getComputedStyle(node))
        if (ancestors.some(style => style.backgroundImage !== 'none' || Number(style.opacity) !== 1)) continue
        let outside = [255, 255, 255]
        for (const style of ancestors) {
            const color = rgba(style.backgroundColor)
            if (color) outside = over(color, outside)
        }
        const border = parseFloat(css.borderTopWidth) ? rgba(css.borderTopColor) : null
        const fill = rgba(css.backgroundColor)
        const contrast = color => {
            const a = luminance(over(color, outside))
            const b = luminance(outside)
            return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        }
        const ratio = Math.max(border ? contrast(border) : 1, fill ? contrast(fill) : 1)
        if (ratio < 3) fieldFailures.push({ field: element.id, border: css.borderTopColor, outside, ratio })
    }
    return { checked, failures, fieldFailures, manual }
}

export function inspectTextClipping() {
    const issues = []
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT)
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent.trim()) continue
        const element = text.parentElement
        if (element.closest('.sr-only, [aria-hidden="true"], [inert]') || !element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue
        // CopyableLink deliberately shows only a masked URL preview; the actual
        // value remains available through copy and its manual-copy fallback.
        if (element.matches('span.truncate') && text.textContent.trim().endsWith('/…')) continue
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
