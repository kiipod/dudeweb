import { expect, test } from '@playwright/test'

test('login renders, supports keyboard navigation and produces a screenshot', async ({ page }, testInfo) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))

    const response = await page.goto('/login')
    expect(response.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('С возвращением, Dude.')

    const email = page.getByRole('textbox', { name: 'Email', exact: true })
    const password = page.getByLabel('Пароль', { exact: true })
    await expect(email).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(password).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(email).toBeFocused()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Показать пароль', exact: true })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(password).toHaveAttribute('type', 'text')
    await page.keyboard.press('Enter')
    await expect(password).toHaveAttribute('type', 'password')

    await page.evaluate(() => document.fonts.ready)
    await testInfo.attach('login', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
    })
    expect(errors).toEqual([])
})
