import { inspectControlPresentation } from './controlPresentation.js'
import { settleContrast } from './pageContrast.js'

export async function inspectControls(page, options) {
    await settleContrast(page)
    const result = await page.evaluate(inspectControlPresentation, options)
    const focus = result.focus
    if (!focus?.manual || focus.reason !== 'background-image') return result
    const host = page.locator(focus.selector)
    const style = await host.getAttribute('style')
    try {
        // Keep the outline's geometry and all backgrounds, remove only paint.
        await host.evaluate(element => element.style.setProperty('outline-color', 'transparent', 'important'))
        const bytes = await page.screenshot({ scale: 'css', animations: 'disabled' })
        const measurement = await page.evaluate(async ({ data, focus }) => {
            const image = new Image()
            image.src = `data:image/png;base64,${data}`
            await image.decode()
            const canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            const context = canvas.getContext('2d', { willReadFrequently: true })
            context.drawImage(image, 0, 0)
            const pixels = context.getImageData(0, 0, image.width, image.height).data
            const { rgba, contrast } = window.__contrastTools
            const color = rgba(focus.color)
            const box = focus.box
            const delta = focus.offset + focus.width / 2
            // Straight middle portions avoid corner anti-aliasing. Sample the
            // adjacent background on the ring's actual painted center line.
            const points = []
            for (let x = Math.ceil(box.x + box.width * .25); x < box.x + box.width * .75; x++) {
                points.push([x, Math.floor(box.y - delta)], [x, Math.floor(box.y + box.height + delta)])
            }
            for (let y = Math.ceil(box.y + box.height * .25); y < box.y + box.height * .75; y++) {
                points.push([Math.floor(box.x - delta), y], [Math.floor(box.x + box.width + delta), y])
            }
            const ratios = points.filter(([x, y]) => x >= 0 && y >= 0 && x < image.width && y < image.height).map(([x, y]) => {
                const index = (y * image.width + x) * 4
                return contrast(color, [...pixels.slice(index, index + 3)])
            })
            return { samples: ratios.length, ratio: Math.min(...ratios) }
        }, { data: bytes.toString('base64'), focus })
        if (measurement.samples && Number.isFinite(measurement.ratio)) result.focus = { ...focus, ...measurement, manual: false, method: 'painted-ring-background' }
    } finally {
        if (style === null) await host.evaluate(element => element.removeAttribute('style'))
        else await host.evaluate((element, style) => element.setAttribute('style', style), style)
    }
    return result
}
