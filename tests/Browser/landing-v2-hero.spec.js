import { expect, test } from '@playwright/test'

const titles = ['Подключился — и погнали', 'Скорость без компромиссов', 'Один доступ. До 5 устройств', 'Твоё соединение под защитой', 'Больше свободы каждый день', 'Мы рядом']
const descriptions = [
    'Никаких сложных настроек. Пара простых действий — и любимые сервисы снова под рукой.',
    'Смотри видео, созванивайся, работай и переключайся между задачами с комфортом.',
    'Пользуйся сервисом на смартфоне, ноутбуке или планшете и делись подпиской с близкими.',
    'Защищённое подключение для работы, общения и повседневных задач.',
    'Любимые инструменты для творчества, развлечений и общения — в одном подключении.',
    'Возникли вопросы? Поможем разобраться с подключением и использованием сервиса.',
]
const references = [
    { width: 360, hero: 38, field: null, cta: [320, 48, 15, 8], benefit: [24, 15] },
    { width: 390, hero: 40, field: null, cta: [350, 48, 15, 8], benefit: [24, 15] },
    { width: 430, hero: 44, field: null, cta: [390, 48, 15, 8], benefit: [24, 15] },
    { width: 768, hero: 52, field: 520, cta: [340, 50, 17, 10], benefit: [24, 16] },
    { width: 1024, hero: 60, field: 540, cta: [340, 50, 17, 10], benefit: [26, 17] },
    { width: 1440, hero: 72, field: 438, cta: [420, 52, 17, 10], benefit: [24, 17] },
    { width: 1920, hero: 92, field: 531, cta: [520, 56, 17, 10], benefit: [28, 19] },
    { width: 2560, hero: 108, field: 797, cta: [640, 64, 18, 12], benefit: [32, 21] },
]

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
        test(`Hero content and geometry at ${reference.width}px with ${theme} preference`, async ({ page }, testInfo) => {
            const errors = trackErrors(page)
            await page.setViewportSize({ width: reference.width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            await page.goto('/landing')
            await page.evaluate(() => document.fonts.ready)
            await expect(page.locator('h1')).toHaveCount(1)
            await expect(page.locator('h1')).toHaveText('Любимые сервисы снова рядом.')
            expect(await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeCloseTo(reference.hero, 2)
            await expect(page.getByText('Hey, Dude!', { exact: true })).toBeVisible()
            await expect(page.getByText('3 дня бесплатно · До 5 устройств', { exact: true })).toBeVisible()
            const action = page.locator('[data-v2-hero-cta]')
            await expect(action).toHaveAttribute('href', '/register')
            const actionStyle = await action.evaluate(element => {
                const style = getComputedStyle(element)
                return [element.getBoundingClientRect().width, element.getBoundingClientRect().height, parseFloat(style.fontSize), parseFloat(style.borderRadius)]
            })
            actionStyle.forEach((value, index) => expect(value).toBeCloseTo(reference.cta[index], 1))
            await expect(action).toHaveCSS('font-weight', '650')
            const cards = page.locator('[data-v2-benefit]')
            await expect(cards).toHaveCount(6)
            await expect(cards.locator('h2')).toHaveText(titles)
            await expect(cards.locator('.v2-benefit-copy p')).toHaveText(descriptions)
            const images = await cards.locator('img').evaluateAll(async images => Promise.all(images.map(async image => {
                await image.decode()
                return [image.naturalWidth, image.naturalHeight]
            })))
            expect(images).toEqual(Array.from({ length: 6 }, () => [890, 546]))
            const first = cards.first()
            expect(await first.locator('h2').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeCloseTo(reference.benefit[0], 2)
            expect(await first.locator('p').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeCloseTo(reference.benefit[1], 2)
            if (reference.field) {
                expect((await page.locator('[data-v2-benefits]').boundingBox()).height).toBeCloseTo(reference.field, 1)
                const sourceY = { 768: 493, 1024: 517, 1440: 414, 1920: 493, 2560: 575 }[reference.width]
                expect(Math.abs((await page.locator('[data-v2-benefits]').boundingBox()).y - sourceY)).toBeLessThan(2)
                const sizes = await cards.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width))
                expect(Math.abs(sizes[0] / sizes[1] - 4.75)).toBeLessThan(0.01)
                await expect(cards.nth(1).locator('img')).toBeHidden()
                await expect(cards.nth(1).locator('.v2-benefit-compact')).toBeVisible()
            } else {
                for (let index = 0; index < 6; index++) {
                    await expect(cards.nth(index).locator('h2')).toBeVisible()
                    await expect(cards.nth(index)).toHaveCSS('transform', 'none')
                }
                expect((await cards.nth(5).boundingBox()).y).toBeGreaterThan((await cards.first().boundingBox()).y + 2500)
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            expect(errors).toEqual([])
            if (theme === 'light' && [390, 768, 1440, 2560].includes(reference.width)) {
                await page.screenshot({ path: testInfo.outputPath(`hero-${reference.width}.png`), fullPage: true })
            }
        })
    }
}

test('manual keyboard and touch selection exposes every desktop/tablet benefit without motion', async ({ browser }) => {
    for (const width of [768, 1440, 2560]) {
        const context = await browser.newContext({ viewport: { width, height: 1440 }, hasTouch: true, reducedMotion: 'reduce' })
        const page = await context.newPage()
        await page.goto('/landing')
        const buttons = page.locator('[data-v2-benefit-select]')
        await buttons.first().focus()
        await page.keyboard.press('End')
        await expect(buttons.nth(5)).toBeFocused()
        await expect(buttons.nth(5)).toHaveAttribute('aria-expanded', 'true')
        await expect(page.getByRole('heading', { name: titles[5] })).toBeVisible()
        await page.keyboard.press('ArrowRight')
        await expect(buttons.first()).toBeFocused()
        await page.keyboard.press('ArrowLeft')
        await expect(buttons.nth(5)).toBeFocused()
        await page.keyboard.press('Home')
        await expect(buttons.first()).toBeFocused()
        for (let index = 0; index < 6; index++) {
            await buttons.nth(index).tap()
            await expect(buttons.nth(index)).toHaveAttribute('aria-expanded', 'true')
            await expect(page.getByRole('heading', { name: titles[index] })).toBeVisible()
        }
        await context.close()
    }
})

test('autoplay follows six states and pauses for pointer, manual choice, offscreen, inert and visibility', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.clock.install({ time: new Date('2026-11-06T10:00:00Z') })
    await page.clock.pauseAt(new Date('2026-11-06T10:00:01Z'))
    await page.goto('/landing')
    const cards = page.locator('[data-v2-benefit]')
    await expect(page.locator('.v2-benefits-toggle')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /(?:Запустить|Приостановить|Остановить) автопоказ/ })).toHaveCount(0)
    await expect(cards.first().locator('[data-running="true"]')).toHaveCount(1)
    await expect(cards.first().locator('.v2-benefit-progress')).toHaveCSS('animation-duration', '5s')
    await page.clock.runFor(4999)
    await expect(cards.first()).toHaveAttribute('data-active', 'true')
    await page.clock.runFor(1)
    await expect(cards.nth(1)).toHaveAttribute('data-active', 'true')
    for (const index of [2, 3, 4, 5, 0]) {
        await page.clock.runFor(5000)
        await expect(cards.nth(index)).toHaveAttribute('data-active', 'true')
    }
    await cards.first().hover()
    await page.clock.runFor(10000)
    await expect(cards.first()).toHaveAttribute('data-active', 'true')
    await page.mouse.move(0, 0)
    await page.clock.runFor(5000)
    await expect(cards.nth(1)).toHaveAttribute('data-active', 'true')
    await page.locator('main').evaluate(element => { element.inert = true })
    await page.clock.runFor(10000)
    await expect(cards.nth(1)).toHaveAttribute('data-active', 'true')
    await page.locator('main').evaluate(element => { element.inert = false })
    await page.clock.runFor(5000)
    await expect(cards.nth(2)).toHaveAttribute('data-active', 'true')
    // Controlled document-hidden event; this is not a physical tab switch.
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
        document.dispatchEvent(new Event('visibilitychange'))
    })
    await page.clock.runFor(10000)
    await expect(cards.nth(2)).toHaveAttribute('data-active', 'true')
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' })
        document.dispatchEvent(new Event('visibilitychange'))
        const spacer = document.createElement('div')
        spacer.style.height = '2000px'
        document.querySelector('main').append(spacer)
        scrollTo(0, document.body.scrollHeight)
    })
    await expect(cards.locator('[data-running="true"]')).toHaveCount(0)
    await page.clock.runFor(10000)
    await expect(cards.nth(2)).toHaveAttribute('data-active', 'true')
    await cards.nth(2).scrollIntoViewIfNeeded()
    await expect(cards.locator('[data-running="true"]')).toHaveCount(1)
    await page.clock.runFor(5000)
    await expect(cards.nth(3)).toHaveAttribute('data-active', 'true')
    await page.locator('[data-v2-benefit-select]').nth(4).click()
    await page.mouse.move(0, 0)
    await page.clock.runFor(10000)
    await expect(cards.nth(4)).toHaveAttribute('data-active', 'true')
    await expect(cards.locator('[data-running="true"]')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /(?:Запустить|Приостановить|Остановить) автопоказ/ })).toHaveCount(0)
})

test('mobile stack binds to native scroll and reaches all source keyframes reversibly', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    const errors = trackErrors(page)
    await page.goto('/landing')
    await page.evaluate(() => document.fonts.ready)
    const track = page.locator('[data-v2-benefits]')
    const start = await track.evaluate(element => element.getBoundingClientRect().top + scrollY - 16)
    const step = await track.evaluate(element => (element.getBoundingClientRect().height - Math.max(620, innerHeight)) / 5)
    const cards = page.locator('[data-v2-benefit]')
    expect((await page.locator('.v2-benefits-stage').boundingBox()).height).toBe(620)
    for (const progress of [0, 1, 3, 5, 3, 0]) {
        await page.evaluate(y => scrollTo(0, y), start + progress * step + 1)
        await expect.poll(() => cards.nth(progress).evaluate(element => parseFloat(element.style.getPropertyValue('--v2-arrival')))).toBe(1)
        await expect.poll(() => cards.first().evaluate(element => parseFloat(element.style.getPropertyValue('--v2-age')))).toBe(progress)
        const first = await cards.first().boundingBox()
        const current = await cards.nth(progress).boundingBox()
        expect(current.y).toBeCloseTo(48 + progress * 14, 1)
        expect(current.height).toBeCloseTo(500, 1)
        expect(first.height).toBeCloseTo(500 * (1 - progress * 0.035), 1)
        await expect(cards.nth(progress).locator('h2')).toBeVisible()
    }
    await page.screenshot({ path: testInfo.outputPath('mobile-stack-start.png') })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(cards.first()).toHaveCSS('transform', 'none')
    await expect(page.locator('.v2-benefits-stage')).toHaveCSS('position', 'static')
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
    await context.close()
})

test('Hero CTA opens existing guest registration and the actual advantages anchor works', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/landing')
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Преимущества', exact: true }).click()
    await expect(page).toHaveURL(/\/landing#advantages$/)
    await expect(page.locator('#advantages')).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
    await page.locator('[data-v2-hero-cta]').click()
    await expect(page).toHaveURL(/\/register$/)
    await expect(page.getByRole('heading', { name: 'Привет, Dude!' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Создать аккаунт', exact: true })).toBeVisible()
})

test('delayed illustration loading preserves Hero geometry', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    let release
    const gate = new Promise(resolve => { release = resolve })
    await page.route('**/landing-v2/illustrations/*.png', async route => {
        await gate
        await route.continue()
    })
    await page.goto('/landing', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    const geometry = () => page.locator('[data-v2-hero]').evaluate(element => ({
        height: element.getBoundingClientRect().height,
        field: element.querySelector('[data-v2-benefits]').getBoundingClientRect().height,
        cards: [...element.querySelectorAll('[data-v2-benefit]')].map(card => {
            const box = card.getBoundingClientRect()
            return [box.x, box.y, box.width, box.height]
        }),
    }))
    const before = await geometry()
    release()
    await page.locator('[data-v2-benefit] img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
    expect(await geometry()).toEqual(before)
})

test('desktop transition finishes at the source ratio while copy width and field bounds stay fixed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/landing')
    const cards = page.locator('[data-v2-benefit]')
    const field = page.locator('.v2-benefits-field')
    const before = await field.boundingBox()
    const copyWidth = (await cards.first().locator('.v2-benefit-full').boundingBox()).width
    await expect(cards.first()).toHaveCSS('transition-duration', '0.55s')
    await page.locator('[data-v2-benefit-select]').nth(4).click()
    await expect.poll(() => cards.evaluateAll(elements => elements[4].getBoundingClientRect().width / elements[0].getBoundingClientRect().width)).toBeGreaterThan(4.74)
    expect(await field.boundingBox()).toEqual(before)
    expect((await cards.nth(4).locator('.v2-benefit-full').boundingBox()).width).toBeCloseTo(copyWidth, 2)
    await expect(page.getByRole('heading', { name: titles[4] })).toBeVisible()
})

test('short screens, forced colors and intermediate widths keep content readable without overflow', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' })
    await page.goto('/landing')
    for (const width of [320, 600, 767, 769, 1200, 1439, 1600, 2561, 3840]) {
        await page.setViewportSize({ width, height: 600 })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        if (width < 768) {
            await expect(page.locator('[data-v2-benefit]').last().locator('h2')).toBeVisible()
            await expect(page.locator('.v2-benefits-stage')).toHaveCSS('position', 'static')
        } else {
            const button = page.locator('[data-v2-benefit-select]').last()
            await button.focus()
            await page.keyboard.press('Enter')
            await expect(button).toHaveCSS('outline-width', '2px')
            await expect(page.getByRole('heading', { name: 'Мы рядом', exact: true })).toBeVisible()
        }
    }
})
