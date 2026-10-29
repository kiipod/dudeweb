import { inspectTextContrast } from './accessibility.js'
import { inspectRenderedTextContrast } from './renderedContrast.js'

// Close computed exclusions against the same DOM instances, never by matching
// a label from another route or by merely citing a separate passing project.
export async function inspectPageContrast(page) {
    await settleContrast(page)
    const result = await page.evaluate(inspectTextContrast)
    result.painted = []
    const resolved = new Set()
    const roots = [...new Set(result.manualDetails.filter(row => row.reason === 'background-image').map(row => row.root))]
    const scroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }))
    try {
        for (const root of roots) {
            const rows = await inspectRenderedTextContrast(page, page.locator(root))
            for (const pending of result.manualDetails.filter(row => row.root === root)) {
                const row = rows.find(row => row.selector === pending.selector)
                if (!row || row.opacity !== 1 || !row.samples || !Number.isFinite(row.minimum)) continue
                result.painted.push(row)
                resolved.add(row.selector)
                if (row.minimum < row.required) result.failures.push({ label: row.label, ratio: row.minimum, required: row.required, method: row.backgroundMethod })
            }
        }
    } finally {
        if (roots.length) await page.evaluate(({ x, y }) => scrollTo({ left: x, top: y, behavior: 'instant' }), scroll)
    }
    result.manualDetails = result.manualDetails.filter(row => !resolved.has(row.selector))
    result.manual = result.manualDetails.map(row => row.label)
    return result
}

// Inspect settled states; temporary enter/leave opacity is not a resting UI
// color. Static opacity groups remain unsupported and fail the coverage check.
export async function settleContrast(page) {
    await page.evaluate(async () => {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        const finite = document.getAnimations().filter(animation => Number.isFinite(animation.effect.getComputedTiming().endTime))
        await Promise.all(finite.map(animation => animation.finished.catch(() => {})))
    })
}
