import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { SIGNAL_ORBIT_PATH } from '../../resources/js/utils/signalOrbitGeometry.js'
import { buildExplicitSignalOrbit, explicitSignalOrbit } from './helpers/explicitSignalOrbit.js'
import { inspectPageContrast } from './helpers/pageContrast.js'
import { installContrastTools } from './helpers/contrastTools.js'

let entry
const logoSource = JSON.parse(await readFile(new URL('../../docs/audit/pen-selected-logo-roles.json', import.meta.url), 'utf8'))
test.beforeAll(async () => { entry = await buildExplicitSignalOrbit() })

const paths = page => page.locator('.landing-hero__signal path').evaluateAll(nodes => nodes.map(node => node.getAttribute('d')))
const bounds = page => page.locator('.landing-hero__signal').boundingBox()

for (const theme of ['light', 'dark']) for (const width of [360, 390, 768, 1440, 2560]) {
    test(`explicit Signal Orbit pointer and static gates ${width} ${theme}`, async ({ page, request }, info) => {
        const errors = [], resources = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('request', request => { if (request.url().includes('/images/hero/services/')) resources.push(request.url()) })
        await page.setViewportSize({ width, height: width >= 1200 ? 1440 : 1024 })
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'no-preference' })
        await page.addInitScript(installContrastTools)
        await explicitSignalOrbit(page, request, entry)
        const hero = page.locator('.landing-hero')
        await expect(hero).toBeVisible()
        await expect(page.locator('.service-logo-cloud')).toHaveCount(0)
        expect(resources).toEqual([])
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
        const brand = page.getByRole('banner').getByRole('img', { name: 'dudeweb', exact: true }).filter({ visible: true })
        await expect(brand).toHaveCount(1)
        expect(await brand.locator('path').evaluateAll(nodes => nodes.map(node => node.getAttribute('d'))))
            .toEqual([logoSource.icon.geometry, logoSource.accent.geometry])
        if (width >= 768) {
            await expect(brand.locator('span').last()).toHaveText(logoSource.horizontal.content)
            await expect(brand.locator('span').last()).toHaveCSS('font-weight', logoSource.horizontal.fontWeight)
            expect(await brand.locator('span').last().evaluate(node => getComputedStyle(node).fontFamily)).toContain(logoSource.horizontal.fontFamily)
        } else await expect(brand).toHaveText('')
        expect(await paths(page)).toEqual([SIGNAL_ORBIT_PATH, SIGNAL_ORBIT_PATH])
        const original = await bounds(page)
        const contour = await page.locator('.landing-hero__signal path').first().evaluate(node => {
            const { x, y, width, height } = node.getBBox()
            return { x, y, width, height }
        })
        const section = await hero.boundingBox()
        await page.mouse.move(section.x + section.width * .7, section.y + section.height * .45)
        await page.mouse.move(section.x + section.width * .85, section.y + section.height * .55, { steps: 8 })
        await expect.poll(() => paths(page)).not.toEqual([SIGNAL_ORBIT_PATH, SIGNAL_ORBIT_PATH])
        const deformed = await paths(page)
        expect(deformed[0]).toBe(deformed[1])
        expect(await bounds(page)).toEqual(original)
        const deformation = await page.locator('.landing-hero__signal path').first().evaluate(node => {
            const { x, y, width, height } = node.getBBox()
            return { x, y, width, height }
        })
        expect(deformation.x).toBeGreaterThanOrEqual(contour.x - .01)
        expect(deformation.y).toBeGreaterThanOrEqual(contour.y - .01)
        expect(deformation.x + deformation.width).toBeLessThanOrEqual(contour.x + contour.width + .01)
        expect(deformation.y + deformation.height).toBeLessThanOrEqual(contour.y + contour.height + .01)
        await info.attach('pointer-response', { body: JSON.stringify({ original, deformed }), contentType: 'application/json' })
        await expect.poll(() => paths(page)).toEqual([SIGNAL_ORBIT_PATH, SIGNAL_ORBIT_PATH])
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.mouse.move(width * .5, section.y + 140)
        await page.mouse.move(width * .8, section.y + 240, { steps: 8 })
        expect(await paths(page)).toEqual([SIGNAL_ORBIT_PATH, SIGNAL_ORBIT_PATH])
        expect(await bounds(page)).toEqual(original)
        const contrast = await inspectPageContrast(page)
        expect(contrast.failures).toEqual([])
        expect(contrast.manualDetails).toEqual([])
        await info.attach('explicit-contrast', { body: JSON.stringify(contrast), contentType: 'application/json' })
        await info.attach('explicit-static', { body: await hero.screenshot(), contentType: 'image/png' })
        // Actual CTA receives pointer input even where decorative bounds overlap.
        const action = hero.getByRole('link', { name: 'Попробовать бесплатно', exact: true })
        await action.click({ trial: true })
        await expect(action).toHaveAttribute('href', '/register')
        if (width < 1200) {
            await page.getByRole('button', { name: 'Открыть меню', exact: true }).click()
            await expect(page.getByRole('dialog')).toBeVisible()
            await page.keyboard.press('Escape')
            await expect(page.getByRole('dialog')).toHaveCount(0)
        }
        await page.emulateMedia({ forcedColors: 'active' })
        await expect(page.locator('.landing-hero__signal')).toBeHidden()
        await expect(action).toBeVisible()
        expect(errors).toEqual([])
    })
}

test.describe('coarse pointer', () => {
    test.use({ hasTouch: true, isMobile: true })
    for (const width of [390, 1440]) test(`explicit Signal Orbit remains static on touch ${width}`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: 1080 })
        await page.emulateMedia({ reducedMotion: 'no-preference' })
        await explicitSignalOrbit(page, request, entry)
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
        const hero = page.locator('.landing-hero')
        await hero.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 50, clientY: 150, buttons: 0 })
        await hero.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 300, clientY: 300, buttons: 0 })
        await page.touchscreen.tap(width * .8, 200)
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        expect(await paths(page)).toEqual([SIGNAL_ORBIT_PATH, SIGNAL_ORBIT_PATH])
    })
})
