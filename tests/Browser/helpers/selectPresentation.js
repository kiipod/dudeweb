import { expect } from '@playwright/test'

export async function expectSelectPresentation(select) {
    await expect(select).toBeVisible()
    const metrics = await select.evaluate(element => {
        const field = element.getBoundingClientRect()
        const icon = element.querySelector('svg').getBoundingClientRect()
        const style = getComputedStyle(element)
        return {
            centerOffset: Math.abs(field.y + field.height / 2 - icon.y - icon.height / 2),
            inset: field.right - icon.right,
            paddingLeft: parseFloat(style.paddingLeft) + parseFloat(style.borderRightWidth),
            textGap: icon.left - element.querySelector('span').getBoundingClientRect().right,
        }
    })
    expect(metrics.centerOffset).toBeLessThan(1)
    expect(metrics.inset).toBeCloseTo(metrics.paddingLeft, 0)
    expect(metrics.textGap).toBeGreaterThanOrEqual(6)
}

export async function chooseSelectOption(select, label) {
    await select.click()
    await select.page().getByRole('listbox').getByRole('option', { name: label, exact: true }).click()
}
