import { expect, test } from '@playwright/test'

const titles = ['Новая локация — Нидерланды', 'Техническое обслуживание серверов', 'Сервис снова работает']
const categories = ['Локации', 'Обслуживание', 'Статус']
const dates = ['4 ноября 2026', '2 ноября 2026', '3 ноября 2026']
const isoDates = ['2026-11-04', '2026-11-02', '2026-11-03']
const covers = ['netherlands', 'maintenance', 'service-restored']
const references = [
    { width: 360, content: 320, heading: 24, title: 22, meta: 12, cover: [320, 313.6], gap: 32, all: [44, 12], header: 84 },
    { width: 390, content: 350, heading: 26, title: 22, meta: 12, cover: [350, 343], gap: 32, all: [44, 12], header: 84 },
    { width: 430, content: 390, heading: 26, title: 22, meta: 12, cover: [390, 382.2], gap: 32, all: [44, 12], header: 84 },
    { width: 768, content: 688, heading: 36, title: 24, meta: 12, cover: [216, 216], gap: 24, all: [46, 14], header: 94 },
    { width: 1024, content: 928, heading: 36, title: 24, meta: 12, cover: [293.333, 280], gap: 24, all: [46, 14], header: 94 },
    { width: 1440, content: 1280, heading: 44, title: 24, meta: 12, cover: [410.667, 390], gap: 24, all: [46, 14], header: 96 },
    { width: 1920, content: 1600, heading: 52, title: 28, meta: 14, cover: [517.333, 496], gap: 24, all: [46, 14], header: 105 },
    { width: 2560, content: 2000, heading: 64, title: 32, meta: 16, cover: [629.333, 600], gap: 32, all: [58, 19], header: 134 },
]

async function fontSize(locator) {
    return locator.evaluate(element => parseFloat(getComputedStyle(element).fontSize))
}

function trackErrors(page) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
        if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
    })
    return errors
}

for (const reference of references) {
    for (const theme of ['light', 'dark']) {
        test(`static news matches Pen at ${reference.width}px with ${theme} preference`, async ({ page }, testInfo) => {
            const errors = trackErrors(page)
            await page.setViewportSize({ width: reference.width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            await page.goto('/landing')
            await page.evaluate(() => document.fonts.ready)
            const news = page.locator('[data-v2-news]')
            const grid = page.locator('[data-v2-news-grid]')
            const cards = page.locator('[data-v2-news-card]')
            await expect(news.getByRole('heading', { level: 2 })).toHaveText('Новости сервиса')
            await expect(cards).toHaveCount(3)
            await expect(cards.locator('h3')).toHaveText(titles)
            await expect(cards.locator('[data-v2-news-category]')).toHaveText(categories)
            await expect(cards.locator('time')).toHaveText(dates)
            expect(await cards.locator('time').evaluateAll(elements => elements.map(element => element.dateTime))).toEqual(isoDates)
            const bounds = await grid.boundingBox()
            expect(bounds.width).toBeCloseTo(reference.content, 1)
            expect(bounds.x).toBeCloseTo((reference.width - reference.content) / 2, 1)
            expect(await fontSize(news.locator('h2'))).toBeCloseTo(reference.heading, 2)
            expect(await fontSize(cards.first().locator('h3'))).toBeCloseTo(reference.title, 2)
            expect(await fontSize(cards.first().locator('time'))).toBeCloseTo(reference.meta, 2)
            const header = page.locator('[data-v2-news-heading]')
            expect(Math.abs((await header.boundingBox()).height - reference.header)).toBeLessThan(1)
            const all = page.locator('[data-v2-news-all]')
            await expect(all).toHaveText('Все новости')
            expect((await all.boundingBox()).height).toBeCloseTo(reference.all[0], 1)
            expect(await fontSize(all)).toBeCloseTo(reference.all[1], 2)
            await expect(all).toHaveCSS('background-color', 'rgb(142, 155, 255)')
            expect(await header.evaluate(element => getComputedStyle(element).borderTopWidth)).toBe('0px')
            expect(await grid.evaluate(element => getComputedStyle(element).borderWidth)).toBe('0px')
            const list = page.locator('[data-v2-news-list]')
            expect(await list.evaluate(element => parseFloat(getComputedStyle(element).gap))).toBeCloseTo(reference.gap, 1)

            const boxes = []
            for (const [index, card] of (await cards.all()).entries()) {
                const image = card.locator('img')
                await expect(image).toHaveAttribute('src', `/landing-v2/images/${covers[index]}.jpg`)
                expect(await image.evaluate(async element => {
                    await element.decode()
                    return [element.naturalWidth, element.naturalHeight]
                })).toEqual([1024, 1024])
                await expect(image).toHaveCSS('object-fit', 'cover')
                const imageBounds = await image.boundingBox()
                expect(imageBounds.width).toBeCloseTo(reference.cover[0], 1)
                expect(imageBounds.height).toBeCloseTo(reference.cover[1], 1)
                await expect(image).toHaveCSS('border-radius', reference.width === 2560 ? '12px' : '8px')
                const titleBounds = await card.locator('h3').boundingBox()
                const copyBounds = await card.locator('[data-v2-news-copy]').boundingBox()
                if (reference.width === 768) {
                    expect(copyBounds.x - imageBounds.x - imageBounds.width).toBeCloseTo(24, 1)
                    expect(copyBounds.y + copyBounds.height / 2).toBeCloseTo(imageBounds.y + imageBounds.height / 2, 1)
                } else expect(titleBounds.y).toBeGreaterThan(imageBounds.y + imageBounds.height)
                boxes.push(await card.boundingBox())
            }
            if (reference.width < 1024) {
                expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height)
                expect(boxes[1].x).toBeCloseTo(boxes[0].x, 1)
            } else {
                expect(boxes[1].y).toBeCloseTo(boxes[0].y, 1)
                expect(boxes[1].x - boxes[0].x - boxes[0].width).toBeCloseTo(reference.gap, 1)
            }
            await expect(news.locator('a, button, [role="button"], [role="link"], [tabindex]')).toHaveCount(0)
            await expect(news.locator('p')).toHaveCount(0)
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            expect(errors).toEqual([])
            if (theme === 'light' && [390, 768, 1024, 1440, 2560].includes(reference.width)) {
                await news.screenshot({ path: testInfo.outputPath(`news-${reference.width}.png`) })
            }
        })
    }
}

test('news stays noninteractive with pointer and keyboard and makes no news requests', async ({ page }) => {
    const requests = []
    page.on('request', request => {
        if (['fetch', 'xhr'].includes(request.resourceType())) requests.push(request.url())
    })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/landing')
    const news = page.locator('[data-v2-news]')
    const all = news.locator('[data-v2-news-all]')
    await all.scrollIntoViewIfNeeded()
    await all.click()
    await news.locator('h3').first().click()
    await expect(page).toHaveURL(/\/landing$/)
    expect(await news.locator('[data-v2-news-all], article').evaluateAll(elements => elements.every(element => getComputedStyle(element).cursor !== 'pointer' && getComputedStyle(element).animationName === 'none'))).toBe(true)
    await page.locator('[data-v2-hero-cta]').focus()
    for (let step = 0; step < 12; step++) {
        await page.keyboard.press('Tab')
        expect(await news.evaluate(element => element.contains(document.activeElement))).toBe(false)
    }
    expect(requests).toEqual([])
})

test('news remains readable at intermediate widths, reduced motion and forced colors', async ({ page }) => {
    await page.goto('/landing')
    for (const width of [320, 600, 767, 769, 1023, 1025, 1200, 1439, 1600, 2561, 3840]) {
        await page.setViewportSize({ width, height: 720 })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        const boxes = await page.locator('[data-v2-news-card]').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width))
        expect(boxes.every(width => width > 0)).toBe(true)
    }
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
    await expect(page.locator('[data-v2-news] h2')).toBeVisible()
    await expect(page.locator('[data-v2-news-card] h3')).toHaveText(titles)
    await expect(page.locator('[data-v2-news] a, [data-v2-news] button')).toHaveCount(0)
})
