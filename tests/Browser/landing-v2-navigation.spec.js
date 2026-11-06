import { expect, test } from '@playwright/test'

const references = [
    { width: 360, height: 72, gutter: 20, wordmark: 20, control: 44, font: 14, radius: 10, login: 14 },
    { width: 390, height: 76, gutter: 20, wordmark: 20, control: 44, font: 14, radius: 10, login: 14 },
    { width: 430, height: 76, gutter: 20, wordmark: 20, control: 44, font: 14, radius: 10, login: 14 },
    { width: 768, height: 80, gutter: 40, wordmark: 22, control: 44, font: 14, radius: 12, login: 18, trial: 18 },
    { width: 1024, height: 88, gutter: 48, wordmark: 22, control: 44, font: 14, radius: 12, login: 18, trial: 18 },
    { width: 1440, height: 88, gutter: 80, wordmark: 23, control: 48, font: 16, radius: 12, login: 18, trial: 24, navFont: 16, navGap: 30, navX: 470.5 },
    { width: 1920, height: 96, gutter: 160, wordmark: 25, control: 54, font: 18, radius: 12, login: 18, trial: 24, navFont: 18, navGap: 40, navX: 673.5 },
    { width: 2560, height: 112, gutter: 280, wordmark: 26, control: 58, font: 19, radius: 13, login: 24, trial: 30, navFont: 20, navGap: 48, navX: 952 },
]
const labels = ['Преимущества', 'Устройства', 'Тарифы']

function trackErrors(page) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
        if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
    })
    return errors
}

async function addAnchorTargets(page) {
    // These sections belong to steps 05/06/08; never add placeholders to production.
    await page.locator('main').evaluate(main => {
        main.replaceChildren()
        for (const id of ['advantages', 'devices', 'pricing']) {
            const section = document.createElement('section')
            section.id = id
            section.tabIndex = -1
            section.textContent = id
            section.style.minHeight = '150vh'
            main.append(section)
        }
    })
}

for (const reference of references) {
    for (const theme of ['light', 'dark']) {
        test(`header matches Pen at ${reference.width}px with ${theme} preference`, async ({ page }, testInfo) => {
            const errors = trackErrors(page)
            await page.setViewportSize({ width: reference.width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            await page.goto('/landing')
            await page.evaluate(() => document.fonts.ready)
            const header = page.locator('[data-landing-v2] header')
            await expect(header).toHaveCSS('position', 'static')
            await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)')
            expect((await header.boundingBox()).height).toBeCloseTo(reference.height, 1)
            const brand = header.getByRole('link', { name: 'dudeweb — главная' })
            expect((await brand.boundingBox()).x).toBeCloseTo(reference.gutter, 1)
            await expect(brand.locator('span')).toHaveCSS('font-weight', '600')
            expect(await brand.locator('span').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeCloseTo(reference.wordmark, 2)
            await expect(brand.locator('img')).toHaveCSS('width', '44px')
            await expect(brand.locator('img')).toHaveCSS('height', '36px')
            const login = header.getByRole('link', { name: 'Войти', exact: true })
            const style = await login.evaluate(element => {
                const style = getComputedStyle(element)
                return { height: element.getBoundingClientRect().height, font: parseFloat(style.fontSize), padding: parseFloat(style.paddingLeft), radius: parseFloat(style.borderRadius) }
            })
            expect(style.height).toBeCloseTo(reference.control, 1)
            expect(style.font).toBeCloseTo(reference.font, 2)
            expect(style.padding).toBeCloseTo(reference.login, 2)
            expect(style.radius).toBe(reference.radius)
            await expect(login).toHaveAttribute('href', '/login')
            const trial = header.getByRole('link', { name: 'Попробовать бесплатно' })
            if (reference.width < 768) await expect(trial).toBeHidden()
            else {
                await expect(trial).toBeVisible()
                await expect(trial).toHaveAttribute('href', '/register')
                expect(await trial.evaluate(element => parseFloat(getComputedStyle(element).paddingLeft))).toBeCloseTo(reference.trial, 2)
                expect((await trial.boundingBox()).height).toBeCloseTo(reference.control, 1)
            }
            const navigation = header.getByRole('navigation', { name: 'Основная навигация' })
            const trigger = header.getByRole('button', { name: 'Открыть меню' })
            if (reference.width < 1440) {
                await expect(navigation).toBeHidden()
                await expect(trigger).toBeVisible()
                await expect(trigger).toHaveAttribute('aria-expanded', 'false')
                await expect(trigger).toHaveCSS('width', '44px')
                await expect(trigger).toHaveCSS('height', '44px')
                await expect(trigger.locator('svg')).toHaveCSS('width', '22px')
            } else {
                await expect(trigger).toBeHidden()
                await expect(navigation.getByRole('link')).toHaveText(labels)
                expect(await navigation.evaluate(element => parseFloat(getComputedStyle(element).gap))).toBeCloseTo(reference.navGap, 1)
                expect(await navigation.getByRole('link').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeCloseTo(reference.navFont, 2)
                // Pen rounds native text widths; browser font metrics shift x by up to 3.44px.
                expect(Math.abs((await navigation.boundingBox()).x - reference.navX)).toBeLessThan(4)
                expect(await navigation.evaluate(element => {
                    const [brand, nav, controls] = [...element.parentElement.children].map(child => child.getBoundingClientRect())
                    return Math.abs((nav.left - brand.right) - (controls.left - nav.right))
                })).toBeLessThan(0.1)
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            expect(errors).toEqual([])
            if (theme === 'light' && [390, 768, 1440, 2560].includes(reference.width)) {
                await header.screenshot({ path: testInfo.outputPath(`header-${reference.width}.png`) })
            }
        })
    }
}

for (const width of [360, 390, 430, 768, 1024]) {
    test(`menu traps keyboard, restores focus and scroll at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 720 })
        await page.goto('/landing')
        await addAnchorTargets(page)
        const trigger = page.getByRole('button', { name: 'Открыть меню' })
        await trigger.focus()
        await page.keyboard.press('Enter')
        const dialog = page.getByRole('dialog', { name: 'Навигация по сайту' })
        await expect(dialog).toBeVisible()
        await expect(dialog.getByRole('link', { name: labels[0], exact: true })).toBeFocused()
        await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
        expect(await page.locator('main').evaluate(element => element.inert)).toBe(true)
        const last = dialog.getByRole('link', { name: 'Попробовать бесплатно' }).last()
        await last.focus()
        await page.keyboard.press('Tab')
        await expect(dialog.getByRole('link', { name: 'dudeweb — главная' })).toBeFocused()
        await page.keyboard.press('Shift+Tab')
        await expect(last).toBeFocused()
        await page.keyboard.press('Escape')
        await expect(dialog).toHaveCount(0)
        await expect(trigger).toBeFocused()
        await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
        expect(await page.locator('main').evaluate(element => element.inert)).toBe(false)
    })
}

test('menu reproduces the 390×720 open state and closes on touch', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 720 }, hasTouch: true, isMobile: true })
    const page = await context.newPage()
    await page.goto('/landing')
    await page.getByRole('button', { name: 'Открыть меню' }).tap()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    const links = dialog.locator('[data-v2-menu-link]')
    await expect(links).toHaveText(labels)
    await expect(links.first()).toHaveCSS('font-size', '30px')
    await expect(links.first()).toHaveCSS('line-height', '45px')
    expect((await links.first().boundingBox()).y).toBeCloseTo(128, 1)
    const trial = dialog.getByRole('link', { name: 'Попробовать бесплатно' }).last()
    expect(await trial.boundingBox()).toMatchObject({ x: 20, y: 648, width: 350, height: 48 })
    await dialog.screenshot({ path: testInfo.outputPath('menu-390.png') })
    await dialog.getByRole('button', { name: 'Закрыть меню' }).tap()
    await expect(dialog).toHaveCount(0)
    await context.close()
})

test('mobile anchors close the trap before scrolling and support same-hash navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 720 })
    await page.goto('/landing')
    await addAnchorTargets(page)
    for (const id of ['pricing', 'devices', 'devices']) {
        await page.evaluate(() => scrollTo(0, 0))
        await page.getByRole('button', { name: 'Открыть меню' }).click()
        await page.locator(`#landing-v2-menu [data-v2-menu-link][href="#${id}"]`).click()
        await expect(page.getByRole('dialog')).toHaveCount(0)
        await expect(page).toHaveURL(new RegExp(`#${id}$`))
        await expect(page.locator(`#${id}`)).toBeFocused()
        expect(await page.locator(`#${id}`).evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
        await page.getByRole('button', { name: 'Открыть меню' }).focus()
        await page.keyboard.press('Enter')
        await expect(page.locator(`#landing-v2-menu [data-v2-menu-link][href="#${id}"]`)).toHaveAttribute('aria-current', 'location')
        await page.keyboard.press('Escape')
    }
})

test('desktop anchors, browser history and keyboard focus retain native link semantics', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/landing')
    await addAnchorTargets(page)
    const nav = page.getByRole('navigation', { name: 'Основная навигация' })
    await nav.locator('a[href="#devices"]').click()
    await expect(nav.locator('a[href="#devices"]')).toHaveAttribute('aria-current', 'location')
    await nav.locator('a[href="#pricing"]').focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#pricing$/)
    await page.goBack()
    await expect(page).toHaveURL(/#devices$/)
    await expect(nav.locator('a[href="#devices"]')).toHaveAttribute('aria-current', 'location')
    await page.evaluate(() => scrollTo(0, 0))
    await page.locator('header > div a').first().focus()
    await page.keyboard.press('Tab')
    const first = nav.getByRole('link').first()
    await expect(first).toBeFocused()
    await expect(first).toHaveCSS('outline-width', '2px')
    await expect(first).toHaveCSS('outline-offset', '3px')
    await expect(first).toHaveCSS('outline-color', 'rgb(79, 85, 216)')
    await expect(first).toHaveCSS('text-decoration-line', 'underline')
})

test('header actions retain hover, pressed and focus styles without changing geometry', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/landing')
    const trial = page.locator('header a[href="/register"]')
    const before = await trial.boundingBox()
    await trial.hover()
    await expect(trial).toHaveCSS('background-color', 'rgb(164, 174, 255)')
    await page.mouse.down()
    await expect(trial).toHaveCSS('background-color', 'rgb(125, 137, 239)')
    await page.mouse.move(0, 500)
    await page.mouse.up()
    expect(await trial.boundingBox()).toEqual(before)
    const login = page.locator('header a[href="/login"]')
    await login.hover()
    await expect(login).toHaveCSS('background-color', 'rgb(238, 241, 248)')
    await login.focus()
    await page.keyboard.press('Tab')
    await expect(trial).toBeFocused()
    await expect(trial).toHaveCSS('outline-width', '2px')
    await expect(trial).toHaveCSS('outline-offset', '3px')
})

test('menu navigation releases background state when entering existing auth pages', async ({ page }) => {
    const errors = trackErrors(page)
    await page.setViewportSize({ width: 390, height: 720 })
    for (const destination of ['login', 'register']) {
        await page.goto('/landing')
        await page.getByRole('button', { name: 'Открыть меню' }).click()
        await page.locator(`#landing-v2-menu a[href="/${destination}"]`).last().click()
        await expect(page).toHaveURL(new RegExp(`/${destination}$`))
        await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
        await expect(page.locator('[inert]')).toHaveCount(0)
        await page.goBack()
        await expect(page.locator('[data-landing-v2] header')).toBeVisible()
    }
    await page.locator('header a[href="/landing"]').click()
    await expect(page).toHaveURL(/\/landing$/)
    expect(errors).toEqual([])
})

test('menu closes on desktop resize, releases focus and survives rapid reopen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 390, height: 720 })
    await page.goto('/landing')
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    await page.keyboard.press('Escape')
    await page.locator('header button').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog')).not.toHaveAttribute('aria-hidden')
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
    await expect(page.locator('header a[href="/landing"]')).toBeFocused()
    await page.setViewportSize({ width: 390, height: 720 })
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    await expect(page.getByRole('dialog').locator('[data-v2-menu-link]').first()).toBeFocused()
    await page.keyboard.press('Escape')
})

test('menu transitions match Pen and reduced motion removes transforms and delays', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 720 })
    await page.goto('/landing')
    for (const reducedMotion of ['no-preference', 'reduce']) {
        await page.emulateMedia({ reducedMotion })
        await page.getByRole('button', { name: 'Открыть меню' }).click()
        const dialog = page.getByRole('dialog')
        await expect(dialog).toBeVisible()
        const styles = await dialog.evaluate(element => {
            element.classList.add('v2-menu-enter-active', 'v2-menu-enter-from')
            const link = element.querySelectorAll('[data-v2-menu-link]')[2]
            const result = { duration: getComputedStyle(element).transitionDuration, delay: getComputedStyle(link).transitionDelay, transform: getComputedStyle(link).transform }
            element.classList.remove('v2-menu-enter-active', 'v2-menu-enter-from')
            return result
        })
        expect(styles.duration).toBe(reducedMotion === 'reduce' ? '0s' : '0.28s')
        expect(styles.delay).toBe(reducedMotion === 'reduce' ? '0s' : '0.035s')
        if (reducedMotion === 'reduce') expect(styles.transform).toBe('none')
        await page.keyboard.press('Escape')
        await expect(dialog).toHaveCount(0)
    }
})

test('short and narrow viewports retain access to every menu control', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 280 })
    await page.goto('/landing')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', { name: 'Открыть меню' }).click()
    const dialog = page.getByRole('dialog')
    const trial = dialog.getByRole('link', { name: 'Попробовать бесплатно' }).last()
    await trial.focus()
    await expect(trial).toBeInViewport()
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeInViewport()
})

test('forced colors retain visible keyboard focus and menu controls', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' })
    await page.setViewportSize({ width: 390, height: 720 })
    await page.goto('/landing')
    await page.locator('header a[href="/login"]').focus()
    await page.keyboard.press('Tab')
    const trigger = page.getByRole('button', { name: 'Открыть меню' })
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveCSS('outline-style', 'solid')
    await expect(trigger).toHaveCSS('outline-width', '2px')
    await page.keyboard.press('Enter')
    const first = page.locator('[data-v2-menu-link]').first()
    await expect(first).toBeFocused()
    await expect(first).toHaveCSS('outline-width', '2px')
    await expect(first).toHaveCSS('text-decoration-line', 'underline')
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
})
