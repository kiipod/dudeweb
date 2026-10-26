import { expect, test } from '@playwright/test'
import { accountFixture } from './helpers/accountDashboard.js'
import { verificationRoutes } from './helpers/verificationRoutes.js'

test.use({ hasTouch: true })
test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[Vue warn]')) throw new Error(message.text()) })
})

async function openSurface(page, request, kind) {
    if (kind === 'public') await page.goto('/')
    else {
        const component = kind === 'more' ? 'Account/Dashboard' : 'Account/Subscription'
        const [, url, title, props] = verificationRoutes.find(row => row[0] === component)
        await accountFixture(page, request, { errors: {}, ...structuredClone(props) }, { component, url, title })
    }
    const trigger = page.getByRole('button', { name: kind === 'public' ? 'Открыть меню' : kind === 'more' ? 'Ещё' : 'У меня есть промокод', exact: true })
    await trigger.tap()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    return { trigger, dialog }
}

// Send trusted touch input through Chromium, including its native scroll path.
async function swipe(page, target, dx = 0, dy = 120, { cancel = false, multi = false, edge = false } = {}) {
    const box = await target.boundingBox()
    const start = { x: box.x + (edge ? 4 : box.width / 2), y: box.y + 20 }
    const client = await page.context().newCDPSession(page)
    const points = progress => [{ x: start.x + dx * progress, y: start.y + dy * progress, id: 1 },
        ...(multi ? [{ x: start.x + 30 + dx * progress, y: start.y + dy * progress, id: 2 }] : [])]
    try {
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(0) })
        for (let step = 1; step <= 8; step++) {
            await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(step / 8) })
            await page.evaluate(() => new Promise(requestAnimationFrame))
        }
        await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] })
    } finally {
        await client.detach()
    }
}

for (const theme of ['light', 'dark']) {
    for (const kind of ['public', 'more', 'promo']) {
        for (const width of [390, 768]) {
            test(`swipe down closes ${kind} ${width} ${theme}`, async ({ page, request }) => {
                await page.setViewportSize({ width, height: 900 })
                await page.emulateMedia({ colorScheme: theme })
                const { trigger, dialog } = await openSurface(page, request, kind)
                const url = page.url()
                await swipe(page, dialog)
                await expect(dialog).toHaveCount(0)
                await expect(trigger).toBeFocused()
                await expect(page).toHaveURL(url)
                expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('')
                await trigger.tap()
                await expect(dialog).toBeVisible()
                await swipe(page, dialog)
                await expect(dialog).toHaveCount(0)
            })
        }

        test(`other directions, short, cancelled and multi-touch keep ${kind} open ${theme}`, async ({ page, request }) => {
            await page.setViewportSize({ width: 390, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            const { dialog } = await openSurface(page, request, kind)
            for (const [dx, dy, options] of [[100, 10], [0, -100], [0, 24], [0, 120, { cancel: true }], [0, 120, { multi: true }]]) {
                await swipe(page, dialog, dx, dy, options)
                await expect(dialog).toBeVisible()
            }
            const box = await dialog.boundingBox()
            await page.mouse.move(box.x + 20, box.y + 20)
            await page.mouse.down()
            await page.mouse.move(box.x + 20, box.y + 140, { steps: 8 })
            await page.mouse.up()
            await expect(dialog).toBeVisible()
        })

        test(`native scrolling takes priority over dismissal in ${kind} ${theme}`, async ({ page, request }) => {
            await page.setViewportSize({ width: 390, height: 360 })
            await page.emulateMedia({ colorScheme: theme })
            const { dialog } = await openSurface(page, request, kind)
            const initial = await dialog.evaluate(element => {
                element.scrollTop = element.scrollHeight - element.clientHeight
                return element.scrollTop
            })
            expect(initial).toBeGreaterThan(0)
            await swipe(page, dialog, 0, 100, { edge: true })
            await expect(dialog).toBeVisible()
            await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBeLessThan(initial)
            await dialog.evaluate(element => { element.scrollTop = 0 })
            await swipe(page, dialog, 0, 100, { edge: true })
            await expect(dialog).toHaveCount(0)
        })
    }

    test(`promo input gestures preserve its value and focus ${theme}`, async ({ page, request }) => {
        await page.setViewportSize({ width: 390, height: 900 })
        await page.emulateMedia({ colorScheme: theme })
        const { dialog } = await openSurface(page, request, 'promo')
        const input = dialog.getByRole('textbox', { name: 'Промокод', exact: true })
        await input.fill('KEEP')
        await swipe(page, input)
        await expect(dialog).toBeVisible()
        await expect(input).toHaveValue('KEEP')
    })

    for (const kind of ['more', 'promo']) {
        test(`busy ${kind} ignores swipe until request finishes ${theme}`, async ({ page, request }) => {
            await page.setViewportSize({ width: 390, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            const { dialog } = await openSurface(page, request, kind)
            let release
            const pending = new Promise(resolve => { release = resolve })
            await page.route(kind === 'more' ? '**/logout' : '**/account/subscription/promo', async route => {
                await pending
                await route.abort('failed')
            })
            if (kind === 'promo') await dialog.getByRole('textbox', { name: 'Промокод', exact: true }).fill('TEST')
            await dialog.getByRole('button', { name: kind === 'more' ? 'Выйти' : 'Применить', exact: true }).tap()
            await expect(dialog).toHaveAttribute('aria-busy', 'true')
            await swipe(page, dialog)
            await expect(dialog).toBeVisible()
            release()
            await expect(dialog).toHaveAttribute('aria-busy', 'false')
            await swipe(page, dialog)
            await expect(dialog).toHaveCount(0)
        })
    }

    test(`desktop touch does not dismiss promo dialog ${theme}`, async ({ page, request }) => {
        await page.setViewportSize({ width: 1440, height: 900 })
        await page.emulateMedia({ colorScheme: theme })
        const { dialog } = await openSurface(page, request, 'promo')
        await swipe(page, dialog)
        await expect(dialog).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(dialog).toHaveCount(0)
    })
}
