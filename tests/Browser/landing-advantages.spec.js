import { expect, test } from '@playwright/test'
import { accountFixture } from './helpers/accountDashboard.js'

async function home(page, request) {
    await accountFixture(page, request, { errors: {}, plans: [], pricingState: 'unavailable' }, {
        component: 'Public/Home', url: '/', title: 'Любимые сервисы снова рядом',
    })
    await page.locator('#advantages').scrollIntoViewIfNeeded()
}

for (const width of [360, 390, 768, 1440, 2560]) {
    for (const theme of ['light', 'dark']) {
        test(`${width} ${theme}: responsive cards and keyboard playback`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: 1000 })
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'no-preference' })
            await home(page, request)
            const cards = page.locator('#advantages article')
            await expect(cards).toHaveCount(6)
            const boxes = await cards.evaluateAll(elements => elements.map(element => {
                const box = element.getBoundingClientRect()
                return { x: box.x, y: box.y, right: box.right }
            }))
            expect(boxes.filter(box => Math.abs(box.y - boxes[0].y) < 2)).toHaveLength(width < 768 ? 1 : width < 1200 ? 2 : 3)
            expect(boxes.every(box => box.x >= 0 && box.right <= width)).toBe(true)
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            const button = cards.first().getByRole('button')
            await button.focus()
            await button.press('Enter')
            await expect(cards.first()).toHaveAttribute('data-playing', 'true')
            expect(await cards.first().locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0)
            await expect(cards.first()).toHaveAttribute('data-playing', 'false')
            await page.locator('#advantages').screenshot({ path: info.outputPath('advantages.png') })
        })
    }
}

test('hover enlarges the card without shifting neighbours; reduced motion stays static', async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await home(page, request)
    const card = page.locator('#advantages article').first()
    const neighbour = page.locator('#advantages article').nth(1)
    const before = await neighbour.boundingBox()
    await card.hover()
    await expect.poll(() => card.evaluate(element => getComputedStyle(element).transform)).not.toBe('none')
    expect(await neighbour.boundingBox()).toEqual(before)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await card.getByRole('button').click()
    expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
    expect(await card.evaluate(element => getComputedStyle(element).transform)).toBe('none')
})

for (const width of [360, 390, 768, 1024]) {
    for (const theme of ['light', 'dark']) {
        test(`touch ${width} ${theme}: every illustration moves and restarts on tap`, async ({ browser, request }) => {
            const context = await browser.newContext({
                hasTouch: true, isMobile: true, viewport: { width, height: 1000 },
                colorScheme: theme, reducedMotion: 'no-preference',
            })
            const page = await context.newPage()
            try {
                await home(page, request)
                expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
                const cards = page.locator('#advantages article')
                await expect(cards).toHaveCount(6)
                for (const card of await cards.all()) {
                    const button = card.getByRole('button')
                    await button.scrollIntoViewIfNeeded()
                    await expect(card).toHaveAttribute('data-playing', 'false')
                    expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
                    // Tap the illustration, then the text area while playback is active.
                    for (const position of [{ x: 40, y: 60 }, { x: 40, y: 210 }]) {
                        await button.tap({ position })
                        await expect(card).toHaveAttribute('data-playing', 'true')
                        await expect.poll(() => card.locator('svg').evaluate(element => {
                            return element.getAnimations({ subtree: true }).some(animation => {
                                const target = animation.effect.target
                                const css = getComputedStyle(target)
                                const frames = animation.effect.getKeyframes()
                                return animation.playState === 'running' && animation.currentTime > 100
                                    && (css.transform !== 'none'
                                        || frames.some(frame => frame.strokeDashoffset !== undefined) && parseFloat(css.strokeDashoffset) !== 0
                                        || parseFloat(css.opacity) < 1)
                            })
                        })).toBe(true)
                    }
                    await expect(card).toHaveAttribute('data-playing', 'false')
                    expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
                }
                await page.emulateMedia({ reducedMotion: 'reduce' })
                const card = cards.first()
                await card.getByRole('button').tap()
                await expect(card).toHaveAttribute('data-playing', 'true')
                expect(await card.locator('svg').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
            } finally {
                await context.close()
            }
        })
    }
}
