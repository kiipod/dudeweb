import { expect } from '@playwright/test'

export async function expectPageRefresh(page, width) {
    const refresh = page.getByRole('button', { name: 'Обновить данные', exact: true })
    await expect(refresh).toHaveCount(1)
    await expect(refresh).toBeVisible()
    await expect(refresh).toHaveCSS('border-top-width', '1px')
    const heading = page.getByRole('heading', { level: 1 })
    const row = heading.locator('..')
    await expect(row.getByRole('button', { name: 'Обновить данные', exact: true })).toHaveCount(1)
    const buttonBox = await refresh.boundingBox()
    const headingBox = await heading.boundingBox()
    const contentBox = await page.locator('#account-content > div').boundingBox()
    expect(buttonBox.width).toBeGreaterThanOrEqual(44)
    expect(buttonBox.height).toBeGreaterThanOrEqual(44)
    if (width < 768) expect(buttonBox.y).toBeCloseTo(headingBox.y, 0)
    else expect(buttonBox.y + buttonBox.height).toBeCloseTo(headingBox.y + headingBox.height, 0)
    expect(buttonBox.x).toBeGreaterThanOrEqual(headingBox.x + headingBox.width)
    expect(buttonBox.x + buttonBox.width).toBeCloseTo(contentBox.x + contentBox.width, 0)
    if (width < 768) {
        await expect(refresh.locator('span')).toBeHidden()
        expect(buttonBox.width).toBeCloseTo(buttonBox.height, 0)
    } else {
        await expect(refresh.locator('span')).toBeVisible()
    }
    await expect(refresh.locator('svg')).toBeVisible()
}
