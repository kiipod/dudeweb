import { expect, test } from '@playwright/test'

const references = [
    { width: 360, content: 320, heading: 48, point: 16, copy: 14, tabs: 52, action: 48, footerGap: 32, link: 14, word: 75.474 },
    { width: 390, content: 350, heading: 48, point: 16, copy: 14, tabs: 52, action: 48, footerGap: 32, link: 14, word: 82.639 },
    { width: 430, content: 390, heading: 48, point: 16, copy: 14, tabs: 52, action: 48, footerGap: 32, link: 14, word: 92.192 },
    { width: 768, content: 688, heading: 56, point: 18, copy: 16, tabs: 60, action: 54, footerGap: 40, link: 15, word: 163.367 },
    { width: 1024, content: 928, heading: 56, point: 18, copy: 16, tabs: 60, action: 54, footerGap: 40, link: 15, word: 220.689 },
    { width: 1440, content: 1280, heading: 60, point: 17, copy: 15, tabs: 60, action: 54, footerGap: 40, link: 15, word: 304.760 },
    { width: 1920, content: 1600, heading: 72, point: 19, copy: 18, tabs: 60, action: 54, footerGap: 40, link: 16, word: 381.189 },
    { width: 2560, content: 2000, heading: 80, point: 21, copy: 21, tabs: 72, action: 58, footerGap: 56, link: 18, word: 476.725 },
]
const products = [
    { id: 101, months: 1, priceMinor: 20_123, currency: 'RUB' },
    { id: 102, months: 3, priceMinor: 50_099, currency: 'RUB' },
    { id: 103, months: 6, priceMinor: 100_000, currency: 'RUB' },
    { id: 104, months: 12, priceMinor: 190_099, currency: 'RUB' },
]
const formatMoney = minor => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(minor / 100)

// Exercise real Inertia navigation with controlled public props, without changing the database.
async function openPricing(page, { state = 'ready', periods = products, deviceLimit = 5 } = {}) {
    await page.goto('/landing')
    await page.route('**/landing', async route => {
        if (route.request().headers()['x-inertia'] !== 'true') return route.continue()
        const response = await route.fetch()
        const data = await response.json()
        data.props.plans = state === 'ready' ? [{ id: 101, name: 'Безлимитный', deviceLimit, advantages: [], products: periods }] : []
        data.props.pricingState = state
        await route.fulfill({ response, json: data })
    })
    await page.locator('[data-v2-footer] a[href="/landing"]').click()
    await expect(page.locator('[data-v2-total]')).toHaveText(state === 'ready' ? formatMoney(periods[0].priceMinor) : '— ₽')
    await page.evaluate(() => document.fonts.ready)
}

async function fontSize(locator) {
    return locator.evaluate(element => parseFloat(getComputedStyle(element).fontSize))
}

for (const reference of references) {
    for (const theme of ['light', 'dark']) {
        test(`footer and CTA match Pen at ${reference.width}px with ${theme} preference`, async ({ page }, testInfo) => {
            const errors = []
            page.on('pageerror', error => errors.push(error.message))
            page.on('console', message => {
                if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
            })
            await page.setViewportSize({ width: reference.width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            await openPricing(page)
            const subscription = page.locator('[data-v2-subscription]')
            const grid = page.locator('[data-v2-subscription-grid]')
            const footer = page.locator('[data-v2-footer]')
            const groups = footer.locator('[data-v2-footer-group]')
            await expect(subscription.locator('h2')).toHaveText('Ну что,погнали?')
            await expect(subscription.locator('h3')).toHaveText(['Безлимитный трафик', 'До 5 устройств', 'Все популярные платформы', 'Защищённое подключение'])
            await expect(subscription.getByRole('radio')).toHaveCount(4)
            expect((await grid.boundingBox()).width).toBeCloseTo(reference.content, 1)
            expect((await footer.locator('[data-v2-footer-links]').boundingBox()).width).toBeCloseTo(reference.content, 1)
            expect(await fontSize(subscription.locator('h2'))).toBeCloseTo(reference.heading, 2)
            expect(await fontSize(subscription.locator('h3').first())).toBeCloseTo(reference.point, 2)
            expect(await fontSize(subscription.locator('li p').first())).toBeCloseTo(reference.copy, 2)
            expect((await subscription.locator('fieldset > div').boundingBox()).height).toBeCloseTo(reference.tabs, 1)
            const panel = await page.locator('[data-v2-price-panel]').evaluate(element => ({ gap: parseFloat(getComputedStyle(element).gap), padding: parseFloat(getComputedStyle(element).paddingTop) }))
            expect(panel.gap).toBe(reference.width === 2560 ? 32 : 24)
            expect(panel.padding).toBe(reference.width === 2560 ? 40 : reference.width >= 768 ? 32 : 24)
            expect((await subscription.getByRole('link', { name: 'Выбрать подписку' }).boundingBox()).height).toBeCloseTo(reference.action, 1)
            const intro = await page.locator('[data-v2-subscription-intro]').boundingBox()
            const selector = await page.locator('[data-v2-period-selector]').boundingBox()
            if (reference.width < 1440) expect(selector.y).toBeGreaterThan(intro.y + intro.height)
            else {
                expect(intro.width).toBeCloseTo(selector.width, 1)
                expect(intro.y).toBeCloseTo(selector.y, 1)
            }
            await expect(groups).toHaveCount(3)
            expect(await fontSize(groups.first().locator('a').first())).toBeCloseTo(reference.link, 2)
            expect(await footer.locator(':scope > div').evaluate(element => parseFloat(getComputedStyle(element).gap))).toBeCloseTo(reference.footerGap, 1)
            const boxes = await groups.evaluateAll(elements => elements.map(element => ({ x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y })))
            expect(boxes[0].y).toBeCloseTo(boxes[1].y, 1)
            if (reference.width < 768) {
                expect(boxes[2].y).toBeGreaterThan(boxes[0].y)
                expect(boxes[2].x).toBeCloseTo(boxes[0].x, 1)
            } else expect(boxes[2].y).toBeCloseTo(boxes[0].y, 1)
            const descriptionWidth = { 768: 420, 1024: 500, 1440: 880, 1920: 1100, 2560: 1400 }[reference.width] ?? reference.content
            expect((await footer.locator('[data-v2-footer-legal] p').first().boundingBox()).width).toBeCloseTo(descriptionWidth, 1)
            const svg = footer.locator('[data-v2-wordmark] svg')
            const word = await svg.evaluate(element => {
                const text = element.querySelector('text')
                const scale = element.getBoundingClientRect().width / element.viewBox.baseVal.width
                const bounds = text.getBBox()
                const context = document.createElement('canvas').getContext('2d')
                context.font = `600 ${getComputedStyle(text).fontSize} ${getComputedStyle(text).fontFamily}`
                const metrics = context.measureText('dudeweb')
                const baseline = bounds.y + metrics.fontBoundingBoxAscent
                return {
                    font: parseFloat(getComputedStyle(text).fontSize) * scale,
                    textWidth: bounds.width * scale,
                    svgWidth: element.getBoundingClientRect().width,
                    inkTop: baseline - metrics.actualBoundingBoxAscent,
                    inkBottom: baseline + metrics.actualBoundingBoxDescent,
                    height: element.viewBox.baseVal.height,
                }
            })
            expect(word.font).toBeCloseTo(reference.word, 2)
            // Native font hinting affects glyph bounds by up to 3px at compact sizes.
            expect(Math.abs(word.textWidth - word.svgWidth)).toBeLessThan(3)
            expect(word.inkTop).toBeGreaterThan(0)
            expect(word.inkBottom).toBeLessThan(word.height)
            await expect(footer.getByText('© 20— dudeweb', { exact: true })).toBeVisible()
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            expect(await page.locator('[data-landing-v2]').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)')
            expect(errors).toEqual([])
            if (theme === 'light' && [390, 768, 1440, 2560].includes(reference.width)) {
                await subscription.screenshot({ path: testInfo.outputPath(`subscription-${reference.width}.png`) })
                await footer.screenshot({ path: testInfo.outputPath(`footer-${reference.width}.png`) })
            }
        })
    }
}

test('period selection shows exact public totals and keeps the existing registration CTA', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await openPricing(page, { deviceLimit: 7 })
    await expect(page.locator('[data-v2-subscription] h3').nth(1)).toHaveText('До 7 устройств')
    const selector = page.locator('[data-v2-period-selector]')
    const height = (await selector.boundingBox()).height
    const requests = []
    page.on('request', request => {
        if (['fetch', 'xhr'].includes(request.resourceType())) requests.push(request.url())
    })
    for (const product of products) {
        await selector.locator(`input[value="${product.months}"]`).locator('..').click()
        await expect(page.locator('[data-v2-total]')).toHaveText(formatMoney(product.priceMinor))
        await expect(page.locator('[data-v2-monthly-price]').last()).toHaveText(formatMoney(product.priceMinor / product.months))
        expect((await selector.boundingBox()).height).toBeCloseTo(height, 1)
    }
    await expect(selector.getByRole('link', { name: 'Выбрать подписку' })).toHaveAttribute('href', '/register')
    expect(requests).toEqual([])
    await selector.getByRole('link', { name: 'Выбрать подписку' }).click()
    await expect(page).toHaveURL(/\/register$/)
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible()
})

test('native period radios support keyboard focus, arrows and missing periods', async ({ page }) => {
    await openPricing(page, { periods: [products[1], products[3]] })
    const radios = page.locator('[data-v2-period-selector] input')
    await expect(radios.nth(0)).toBeDisabled()
    await expect(radios.nth(2)).toBeDisabled()
    await expect(radios.nth(1)).toBeChecked()
    await page.locator('[data-v2-period-selector] fieldset').scrollIntoViewIfNeeded()
    await radios.nth(1).focus()
    await page.keyboard.press('ArrowRight')
    await expect(radios.nth(3)).toBeFocused()
    await expect(radios.nth(3)).toBeChecked()
    await expect(page.locator('[data-v2-period-summary]')).toHaveText('12 месяцев')
    expect(await radios.nth(3).locator('..').evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid')
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-v2-period-selector] a')).toBeFocused()
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
    expect(await radios.nth(3).locator('..').evaluate(element => parseFloat(getComputedStyle(element).outlineWidth))).toBe(2)
    expect(await page.locator('.v2-period-underline').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s')
})

for (const state of ['empty', 'unavailable']) {
    test(`${state} catalogue keeps truthful amounts and existing support`, async ({ page }) => {
        await openPricing(page, { state })
        const selector = page.locator('[data-v2-period-selector]')
        await expect(selector.getByRole('status')).toContainText(state === 'empty' ? 'Тариф временно недоступен' : 'Не удалось загрузить тариф')
        await expect(selector.locator('input:disabled')).toHaveCount(4)
        await expect(selector.getByRole('link', { name: 'Выбрать подписку' })).toHaveCount(0)
        await expect(selector.getByRole('link', { name: 'Написать в поддержку' })).toHaveAttribute('href', 'https://t.me/hey_dude_web')
        await expect(page.locator('[data-v2-monthly-price]')).toHaveText('— ₽')
    })
}

test('footer has real links and agreed plain legal captions', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/landing')
    const footer = page.locator('[data-v2-footer]')
    expect(await footer.locator('a').evaluateAll(elements => elements.map(element => element.getAttribute('href')))).toEqual(['/landing', '#advantages', '#devices', '#pricing', '/login', '/register', 'https://t.me/hey_dude_web'])
    for (const caption of ['Пользовательское соглашение', 'Политика конфиденциальности']) {
        const text = footer.getByText(caption, { exact: true })
        expect(await text.evaluate(element => element.tagName)).toBe('SPAN')
        await expect(text).not.toHaveAttribute('tabindex')
    }
    const support = footer.getByRole('link', { name: 'Поддержка' })
    await expect(support).toHaveAttribute('target', '_blank')
    await expect(support).toHaveAttribute('rel', 'noopener noreferrer')
    for (const anchor of ['#advantages', '#devices', '#pricing']) {
        await footer.locator(`a[href="${anchor}"]`).click()
        await expect(page).toHaveURL(new RegExp(`${anchor}$`))
        await expect(page.locator(anchor)).toBeInViewport()
    }
    await footer.locator('a[href="/login"]').focus()
    await page.keyboard.press('Tab')
    await expect(footer.locator('a[href="/register"]')).toBeFocused()
    const trigger = page.getByRole('button', { name: 'Открыть меню' })
    await trigger.click()
    expect(await footer.evaluate(element => element.inert)).toBe(true)
    await page.keyboard.press('Escape')
    expect(await footer.evaluate(element => element.inert)).toBe(false)
})

test('desktop wordmark has local pointer echoes without moving the base letters', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/landing')
    await page.evaluate(() => document.fonts.ready)
    const wordmark = page.locator('[data-v2-wordmark] svg')
    const base = wordmark.locator('.v2-wordmark-base')
    await wordmark.scrollIntoViewIfNeeded()
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
    const bounds = await wordmark.boundingBox()
    await page.mouse.move(bounds.x + bounds.width * 0.3, bounds.y + bounds.height * 0.5)
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(1)
    await expect(wordmark.locator('[data-v2-wordmark-glow] use')).toHaveCount(4)
    const radius = await wordmark.locator('radialGradient').getAttribute('r')
    expect(Number(radius) * bounds.width / 1996).toBeCloseTo(260, 1)
    expect(await base.evaluate(element => getComputedStyle(element).fill)).toBe('none')
    await expect(base).not.toHaveAttribute('transform')
    await wordmark.screenshot({ path: testInfo.outputPath('wordmark-pointer.png') })
    const firstTransform = await wordmark.locator('[data-v2-wordmark-glow] use').nth(1).getAttribute('transform')
    await page.mouse.move(bounds.x + bounds.width * 0.7, bounds.y + bounds.height * 0.4)
    expect(await wordmark.locator('[data-v2-wordmark-glow] use').nth(1).getAttribute('transform')).not.toBe(firstTransform)
    await page.mouse.move(0, 0)
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
    await expect(wordmark).not.toHaveAttribute('tabindex')
    await wordmark.dispatchEvent('pointermove', { pointerType: 'touch', clientX: bounds.x + 100, clientY: bounds.y + 100 })
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
})

test('reduced motion, forced colors, compact width and hidden document reset echoes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/landing')
    await page.evaluate(() => document.fonts.ready)
    const wordmark = page.locator('[data-v2-wordmark] svg')
    async function hover() {
        await wordmark.scrollIntoViewIfNeeded()
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        const box = await wordmark.boundingBox()
        await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5)
    }
    await hover()
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(1)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
    await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' })
    await hover()
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
    await page.emulateMedia({ forcedColors: 'none' })
    await page.setViewportSize({ width: 1024, height: 1000 })
    await hover()
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
    await page.setViewportSize({ width: 1440, height: 1000 })
    await hover()
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(1)
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
        document.dispatchEvent(new Event('visibilitychange'))
    })
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
})

test('touch period selection and intermediate widths keep all content in view', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    await openPricing(page)
    const year = page.locator('[data-v2-period-selector] input[value="12"]')
    await year.locator('..').tap()
    await expect(year).toBeChecked()
    const wordmark = page.locator('[data-v2-wordmark] svg')
    await wordmark.tap()
    await expect(wordmark.locator('[data-v2-wordmark-glow]')).toHaveCount(0)
    await context.close()
    const desktop = await browser.newPage()
    await desktop.goto('/landing')
    for (const width of [320, 600, 767, 769, 1025, 1200, 1439, 1600, 2561, 3840]) {
        await desktop.setViewportSize({ width, height: 720 })
        expect(await desktop.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        const groups = desktop.locator('[data-v2-footer-group]')
        expect(await groups.evaluateAll(elements => elements.every(element => element.getBoundingClientRect().width > 0))).toBe(true)
    }
    await desktop.close()
})
