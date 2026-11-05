import { expect, test } from '@playwright/test'

const platforms = ['Windows', 'macOS', 'Linux', 'Android', 'iOS']
const brands = ['instagram', 'facebook', 'threads', 'x', 'linkedin', 'youtube', 'telegram', 'discord', 'patreon', 'onlyfans', 'soundcloud', 'spotify', 'openai', 'anthropic', 'googlegemini', 'steam', 'tiktok', 'signal', 'airbnb', 'bookingdotcom', 'ubisoft', 'ea', 'netflix']
// Source values from the live eight-frame Pen inspection, not runtime CSS tokens.
const references = [
    { width: 360, content: 320, table: 543, row: 88, glyph: 22, label: 12, facts: 120, limit: 32, access: 24, heading: 30, copy: 15, view: 720, diagram: 231.111, connection: 30 },
    { width: 390, content: 350, table: 520, row: 88, glyph: 22, label: 12, facts: 120, limit: 32, access: 24, heading: 30, copy: 15, view: 720, diagram: 252.778, connection: 32 },
    { width: 430, content: 390, table: 520, row: 88, glyph: 22, label: 12, facts: 120, limit: 32, access: 24, heading: 30, copy: 15, view: 720, diagram: 281.667, connection: 34 },
    { width: 768, content: 688, table: 530, row: 96, glyph: 24, label: 15, facts: 128, limit: 38, access: 28, heading: 36, copy: 16, view: 1000, diagram: 357.76, connection: 40 },
    { width: 1024, content: 928, table: 320, row: 96, glyph: 24, label: 15, facts: 128, limit: 38, access: 28, heading: 36, copy: 16, view: 1280, diagram: 377, connection: 44 },
    { width: 1440, content: 1280, table: 364, row: 112, glyph: 24, label: 18, facts: 144, limit: 42, access: 32, heading: 44, copy: 17, view: 1280, diagram: 520, connection: 44 },
    { width: 1920, content: 1600, table: 370, row: 112, glyph: 24, label: 20, facts: 144, limit: 48, access: 38, heading: 52, copy: 19, view: 1280, diagram: 650, connection: 52 },
    { width: 2560, content: 2000, table: 436, row: 140, glyph: 32, label: 22, facts: 168, limit: 52, access: 44, heading: 60, copy: 21, view: 1280, diagram: 812.5, connection: 64 },
]

function trackErrors(page) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
        if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
    })
    return errors
}

async function fontSize(locator) {
    return locator.evaluate(element => parseFloat(getComputedStyle(element).fontSize))
}

for (const reference of references) {
    for (const theme of ['light', 'dark']) {
        test(`content matches source at ${reference.width}px with ${theme} preference`, async ({ page }, testInfo) => {
            const errors = trackErrors(page)
            await page.setViewportSize({ width: reference.width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            await page.goto('/landing')
            await page.evaluate(() => document.fonts.ready)
            expect(await page.locator('main > section').evaluateAll(elements => elements.map(element => element.getAttribute('aria-labelledby')))).toEqual(['landing-v2-title', 'v2-platforms-title', 'v2-connection-title', 'v2-news-title'])
            const section = page.locator('[data-v2-platforms]')
            const table = page.locator('[data-v2-platform-table]')
            const bounds = await table.boundingBox()
            expect(bounds.width).toBeCloseTo(reference.content, 1)
            expect(bounds.x).toBeCloseTo((reference.width - reference.content) / 2, 1)
            expect(Math.abs(bounds.height - reference.table)).toBeLessThan(6)
            const row = page.locator('[data-v2-platform-row]')
            expect((await row.boundingBox()).height).toBeCloseTo(reference.row, 1)
            await expect(row.locator('li > span')).toHaveText(platforms)
            const columns = await row.locator('li').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width))
            columns.forEach(width => expect(width).toBeCloseTo(reference.content / 5, 1))
            expect(await fontSize(row.locator('span').first())).toBeCloseTo(reference.label, 2)
            expect((await row.locator('svg').first().boundingBox()).width).toBeCloseTo(reference.glyph, 1)
            expect((await page.locator('[data-v2-platform-facts]').boundingBox()).height).toBeCloseTo(reference.facts, 1)
            await expect(section.locator('dd')).toHaveText(['До 5', 'Один доступ'])
            await expect(section.locator('dt')).toHaveText(['устройств одновременно', 'для привычных платформ'])
            expect(await fontSize(section.locator('dd').first())).toBeCloseTo(reference.limit, 2)
            expect(await fontSize(section.locator('dd').last())).toBeCloseTo(reference.access, 2)
            await expect(section.locator('h2')).toHaveText('Где ты — там и dudeweb')
            expect(await fontSize(section.locator('h2'))).toBeCloseTo(reference.heading, 2)
            expect(await fontSize(page.locator('[data-v2-platform-story] > p'))).toBeCloseTo(reference.copy, 2)
            await expect(page.locator('[data-v2-platform-setup]')).toHaveText('Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках.')
            await expect(page.locator('[data-v2-platform-story] > p')).toHaveText('Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.')
            await expect(section.locator('a, button')).toHaveCount(0)

            const connection = page.locator('[data-v2-connection]')
            await expect(connection.locator('h2')).toHaveText('Одно подключение. Больше свободы.')
            expect(await fontSize(connection.locator('h2'))).toBeCloseTo(reference.connection, 2)
            await expect(page.locator('[data-v2-connection-copy]')).toHaveText('Любимые инструменты для творчества, развлечений и общения — в одном подключении.')
            await expect(connection.locator('a, button')).toHaveCount(0)
            const diagram = page.locator('[data-v2-signal]')
            const diagramBounds = await diagram.boundingBox()
            expect(diagramBounds.width).toBeCloseTo(reference.content, 1)
            expect(diagramBounds.height).toBeCloseTo(reference.diagram, 1)
            await expect(diagram).toHaveAttribute('aria-hidden', 'true')
            const origin = await page.locator('[data-v2-signal-origin]').boundingBox()
            expect(origin.x - diagramBounds.x).toBeCloseTo(reference.content * 552 / reference.view, 1)
            expect(origin.y - diagramBounds.y).toBeCloseTo(reference.diagram * 232 / 520, 1)
            expect(origin.width).toBeCloseTo(reference.content * 64 / reference.view, 1)
            expect(origin.height).toBeCloseTo(reference.diagram * 56 / 520, 1)
            expect((await page.locator('[data-v2-signal-origin] img').boundingBox()).width).toBeCloseTo(reference.content * 44 / reference.view, 1)
            const heading = await connection.locator('h2').boundingBox()
            if (reference.width < 1440) expect(heading.y + heading.height).toBeLessThan(diagramBounds.y)
            else {
                expect(heading.x - diagramBounds.x).toBeCloseTo(reference.content * 720 / 1280, 1)
                expect(heading.y - diagramBounds.y).toBeCloseTo(reference.diagram * 102 / 520, 1)
            }
            for (const pair of await diagram.locator('[data-v2-signal-pair]').all()) {
                const box = await pair.locator('rect').boundingBox()
                expect(box.x).toBeGreaterThanOrEqual(diagramBounds.x)
                expect(box.x + box.width).toBeLessThanOrEqual(diagramBounds.x + diagramBounds.width)
                expect(box.y).toBeGreaterThanOrEqual(diagramBounds.y)
                expect(box.y + box.height).toBeLessThanOrEqual(diagramBounds.y + diagramBounds.height)
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            expect(errors).toEqual([])
            if (theme === 'light' && [390, 768, 1024, 1440, 2560].includes(reference.width)) {
                await section.screenshot({ path: testInfo.outputPath(`platforms-${reference.width}.png`) })
                await connection.screenshot({ path: testInfo.outputPath(`connection-${reference.width}.png`) })
            }
        })
    }
}

test('all 23 original logos have their own continuous source route, with five outgoing waves', async ({ page, request }) => {
    await page.goto('/landing')
    const pairs = page.locator('[data-v2-signal-pair]')
    expect(await pairs.evaluateAll(elements => elements.map(element => element.dataset.v2SignalPair))).toEqual(brands)
    const routes = await pairs.evaluateAll(elements => elements.map(element => {
        const route = element.querySelector('[data-v2-signal-route]')
        const rect = element.querySelector('rect')
        const start = route.getPointAtLength(0)
        const end = route.getPointAtLength(route.getTotalLength())
        return { start: [start.x, start.y], right: rect.x.baseVal.value + rect.width.baseVal.value, centerY: rect.y.baseVal.value + rect.height.baseVal.value / 2, end: [end.x, end.y] }
    }))
    for (const route of routes) {
        expect(route.start[0]).toBeCloseTo(route.right, 2)
        expect(route.start[1]).toBeCloseTo(route.centerY, 2)
        expect(route.end[0]).toBeCloseTo(584, 2)
        expect(Math.abs(route.end[1] - 260)).toBeLessThanOrEqual(2.201)
    }
    for (const brand of brands) {
        const response = await request.get(`/landing-v2/brands/${brand}.png`)
        expect(response.ok(), brand).toBe(true)
        await expect(pairs.locator(`[href="/landing-v2/brands/${brand}.png"]`)).toHaveCount(1)
    }
    await expect(page.locator('[data-v2-signal-wave]')).toHaveCount(5)
    const sourceNodes = await pairs.locator('rect').evaluateAll(elements => [elements[0], elements[12], elements[22]].map(element => [element.x.baseVal.value, element.y.baseVal.value]))
    expect(sourceNodes).toEqual([[62, 34], [18, 302], [234, 460]])
    const definitions = await page.locator('[data-v2-signal] [id]').evaluateAll(elements => elements.map(element => element.id))
    expect(new Set(definitions).size).toBe(definitions.length)
})

test('actual Devices navigation closes the mobile menu and preserves focus and scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/landing')
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Устройства', exact: true }).click()
    await expect(page).toHaveURL(/\/landing#devices$/)
    await expect(page.locator('#devices')).toBeFocused()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
    expect(await page.locator('#devices').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.locator('header a[href="#advantages"]').click()
    await page.locator('header a[href="#devices"]').click()
    await expect(page).toHaveURL(/\/landing#devices$/)
    await expect(page.locator('header a[href="#devices"]')).toHaveAttribute('aria-current', 'location')
})

test('source static state is complete under every motion preference and at intermediate widths', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/landing')
    for (const preference of ['no-preference', 'reduce']) {
        await page.emulateMedia({ reducedMotion: preference })
        for (const width of [320, 600, 767, 769, 1023, 1200, 1439, 1600, 2561, 3840]) {
            await page.setViewportSize({ width, height: 720 })
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            await expect(page.locator('[data-v2-signal]')).toHaveAttribute('data-state', 'static')
            await expect(page.locator('[data-v2-signal-pair]')).toHaveCount(23)
            for (const pair of await page.locator('[data-v2-signal-pair]').all()) {
                await expect(pair).toHaveCSS('opacity', '0.82')
                await expect(pair).toHaveCSS('animation-name', 'none')
            }
        }
    }
    await page.emulateMedia({ forcedColors: 'active' })
    await expect(page.locator('[data-v2-platforms] h2')).toBeVisible()
    await expect(page.locator('[data-v2-connection] h2')).toBeVisible()
    expect(errors).toEqual([])
})
