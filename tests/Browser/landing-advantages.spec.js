import { expect, test } from '@playwright/test'
import { accountFixture } from './helpers/accountDashboard.js'

async function home(page, request) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()) })
    await accountFixture(page, request, { errors: {}, plans: [{ deviceLimit: 5 }], pricingState: 'unavailable' }, {
        component: 'Public/Home', url: '/', title: 'Любимые сервисы снова рядом',
    })
    await page.locator('#advantages').scrollIntoViewIfNeeded()
    expect(errors).toEqual([])
    return errors
}

async function animationDuration(card) {
    return card.locator('.motion-float, .motion-breathe, .motion-orbit').first().evaluate(element => parseFloat(getComputedStyle(element).animationDuration))
}

for (const width of [360, 390, 768, 1440, 2560]) {
    for (const theme of ['light', 'dark']) {
        test(`${width} ${theme}: asymmetric composition, readable text and keyboard activation`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: 1000 })
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
            const errors = await home(page, request)
            const cards = page.locator('#advantages article')
            await expect(cards).toHaveCount(6)
            const grid = await page.locator('.advantage-grid').boundingBox()
            const platforms = await page.locator('#devices ul').boundingBox()
            expect(grid.x).toBeCloseTo(platforms.x, 1)
            expect(grid.width).toBeCloseTo(platforms.width, 1)
            const boxes = await cards.evaluateAll(elements => elements.map(element => {
                const { x, y, width, height, right, bottom } = element.getBoundingClientRect()
                return { x, y, width, height, right, bottom }
            }))
            expect(boxes[0].width).toBeGreaterThan(boxes[1].width * 1.8)
            expect(boxes[5].width).toBeGreaterThanOrEqual(width >= 768 ? boxes[0].width : boxes[1].width - 1)
            expect(boxes.filter(box => Math.abs(box.y - boxes[0].y) < 2)).toHaveLength(width >= 1200 ? 2 : 1)
            expect(boxes.every(box => box.x >= 0 && box.right <= width)).toBe(true)
            for (let index = 0; index < boxes.length; index++) {
                for (const other of boxes.slice(index + 1)) {
                    const box = boxes[index]
                    expect(box.right <= other.x + 1 || other.right <= box.x + 1 || box.bottom <= other.y + 1 || other.bottom <= box.y + 1).toBe(true)
                }
            }
            expect(await cards.evaluateAll(elements => elements.every(card => {
                const box = card.getBoundingClientRect()
                return [...card.querySelectorAll('h3, p')].every(text => {
                    const content = text.getBoundingClientRect()
                    return content.right <= box.right && content.bottom <= box.bottom && content.x >= box.x
                })
            }))).toBe(true)
            await expect(cards.nth(2).getByRole('heading')).toHaveText('Один доступ. До 5 устройств')
            const button = cards.first().getByRole('button')
            await button.focus()
            await button.press('Enter')
            await expect(cards.first()).toHaveAttribute('data-active', 'true')
            expect(await cards.first().locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
            await button.press('Space')
            await expect(cards.first()).toHaveAttribute('data-playing', 'true')
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            expect(errors).toEqual([])
            await page.evaluate(() => document.activeElement?.blur())
            await page.mouse.move(0, 0)
            await page.locator('#advantages').screenshot({ path: info.outputPath('advantages.png'), style: 'header { visibility: hidden !important; }' })
        })
    }
}

test('ambient motion accelerates on hover without shifting cards and settles on leave', async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await home(page, request)
    const card = page.locator('#advantages article').first()
    const neighbour = page.locator('#advantages article').nth(1)
    await expect(card).toHaveAttribute('data-motion-running', 'true')
    const before = await neighbour.boundingBox()
    const idle = await animationDuration(card)
    await card.hover()
    await expect(card).toHaveAttribute('data-active', 'true')
    expect(await animationDuration(card)).toBeLessThan(idle)
    expect(await neighbour.boundingBox()).toEqual(before)
    await page.mouse.move(0, 0)
    await expect(card).toHaveAttribute('data-active', 'false')
    expect(await animationDuration(card)).toBe(idle)
})

for (const width of [390, 768, 1024]) {
    for (const theme of ['light', 'dark']) {
        test(`touch ${width} ${theme}: every scene has ambient motion and responds to repeat taps`, async ({ browser, request }) => {
            const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: 'no-preference' })
            const page = await context.newPage()
            try {
                await home(page, request)
                for (const card of await page.locator('#advantages article').all()) {
                    const button = card.getByRole('button')
                    await button.scrollIntoViewIfNeeded()
                    await expect(card).toHaveAttribute('data-motion-running', 'true')
                    const idle = await animationDuration(card)
                    await expect.poll(() => card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).some(animation => animation.playState === 'running' && animation.currentTime > 50))).toBe(true)
                    await button.tap({ position: { x: 30, y: 55 } })
                    await expect(card).toHaveAttribute('data-active', 'true')
                    expect(await animationDuration(card)).toBeLessThan(idle)
                    await button.tap({ position: { x: 30, y: 55 } })
                    await expect(card).toHaveAttribute('data-playing', 'true')
                    await expect(card).toHaveAttribute('data-active', 'false')
                    expect(await animationDuration(card)).toBe(idle)
                }
            } finally { await context.close() }
        })
    }
}

test('motion pauses outside viewport and in a hidden document, and resumes without remounting', async ({ page, request }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await home(page, request)
    const card = page.locator('#advantages article').first()
    await expect(card).toHaveAttribute('data-motion-running', 'true')
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
        document.dispatchEvent(new Event('visibilitychange'))
    })
    await expect(card).toHaveAttribute('data-motion-running', 'false')
    expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).every(animation => animation.playState === 'paused'))).toBe(true)
    await page.evaluate(() => {
        delete document.visibilityState
        document.dispatchEvent(new Event('visibilitychange'))
    })
    await expect(card).toHaveAttribute('data-motion-running', 'true')
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(card).toHaveAttribute('data-motion-running', 'false')
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveAttribute('data-motion-running', 'true')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(card).toHaveAttribute('data-motion-running', 'false')
    expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
})

test('forced colors keeps the content and keyboard control static', async ({ page, request }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'no-preference' })
    await home(page, request)
    const card = page.locator('#advantages article').first()
    await expect(card).toHaveAttribute('data-motion-running', 'false')
    await card.getByRole('button').focus()
    await card.getByRole('button').press('Enter')
    expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
    await expect(card.getByRole('heading')).toBeVisible()
})
