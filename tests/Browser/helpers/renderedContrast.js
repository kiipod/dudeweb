// Sample the painted background beneath text, including SVG and gradients.
// This is a finite scene/pixel sample, not a proof for every animation frame.
export async function inspectRenderedTextContrast(page, root) {
    await root.evaluate(element => element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' }))
    const rows = await root.evaluate(element => {
        const origin = element.getBoundingClientRect()
        const elements = [element, ...element.querySelectorAll('*')].filter(node =>
            node.namespaceURI === 'http://www.w3.org/1999/xhtml'
            && node.checkVisibility({ visibilityProperty: true, opacityProperty: true })
            && !node.closest('[aria-hidden="true"], [inert], :disabled, .sr-only')
            && [...node.childNodes].some(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim()))
        const rows = elements.map(node => {
            const css = getComputedStyle(node)
            const rects = [...node.childNodes].filter(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim()).flatMap(child => {
                const range = document.createRange()
                range.selectNodeContents(child)
                return [...range.getClientRects()].filter(rect => rect.width && rect.height).map(rect => ({
                    x: rect.x - origin.x, y: rect.y - origin.y, width: rect.width, height: rect.height,
                }))
            })
            let opacity = 1
            for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) opacity *= Number(getComputedStyle(ancestor).opacity)
            return {
                label: node.textContent.trim(), selector: window.__contrastTools.selector(node), color: css.color, opacity,
                size: parseFloat(css.fontSize), weight: Number(css.fontWeight), rects,
                outline: { width: parseFloat(css.webkitTextStrokeWidth), color: css.webkitTextStrokeColor, paintOrder: css.paintOrder },
            }
        })
        // Preserve geometry, background colors, SVG and pseudo elements.
        window.__contrastRestore = elements.map(node => [node, node.getAttribute('style')])
        elements.forEach(node => node.style.setProperty('-webkit-text-fill-color', 'transparent', 'important'))
        return rows
    })
    try {
        const bytes = await root.screenshot({ scale: 'css', animations: 'disabled' })
        return await page.evaluate(async ({ data, rows }) => {
            const image = new Image()
            image.src = `data:image/png;base64,${data}`
            await image.decode()
            const canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            const context = canvas.getContext('2d', { willReadFrequently: true })
            context.drawImage(image, 0, 0)
            const pixels = context.getImageData(0, 0, image.width, image.height).data
            const luminance = color => color.slice(0, 3).map(value => {
                value /= 255
                return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
            }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0)
            return rows.map(row => {
                const color = window.__contrastTools.rgba(row.color)
                if (!color) throw new Error(`Unsupported text color: ${row.color}`)
                // Ancestor opacity groups are reported, not approximated as a
                // single foreground alpha. Callers must check opacity === 1.
                const alpha = color[3] ?? 1
                const outlineColor = window.__contrastTools.rgba(row.outline.color)
                const outlined = row.outline.width >= 2 && row.outline.paintOrder.startsWith('stroke') && outlineColor && (outlineColor[3] ?? 1) === 1
                let minimum = Infinity
                let samples = 0
                for (const rect of row.rects) {
                    // Scan the interior of each line box on a 2 CSS px grid.
                    for (let y = Math.ceil(rect.y + rect.height * .15); y < rect.y + rect.height * .85; y += 2) {
                        for (let x = Math.ceil(rect.x); x < rect.x + rect.width; x += 2) {
                            if (x < 0 || y < 0 || x >= image.width || y >= image.height) continue
                            const index = (y * image.width + x) * 4
                            // A solid, >=1px outer halo (2px centered stroke,
                            // fill painted last) is the adjacent background
                            // under G18; use its CSS color, not anti-aliasing.
                            const background = outlined ? outlineColor : [...pixels.slice(index, index + 3)]
                            const foreground = color.slice(0, 3).map((value, i) => value * alpha + background[i] * (1 - alpha))
                            const a = luminance(foreground), b = luminance(background)
                            minimum = Math.min(minimum, (Math.max(a, b) + .05) / (Math.min(a, b) + .05))
                            samples++
                        }
                    }
                }
                return { ...row, backgroundMethod: outlined ? 'solid-text-outline' : 'painted-pixels', minimum, samples, required: row.size >= 24 || (row.size >= 56 / 3 && row.weight >= 700) ? 3 : 4.5 }
            })
        }, { data: bytes.toString('base64'), rows })
    } finally {
        await page.evaluate(() => {
            for (const [node, style] of window.__contrastRestore) {
                if (style === null) node.removeAttribute('style')
                else node.setAttribute('style', style)
            }
            delete window.__contrastRestore
        })
    }
}
