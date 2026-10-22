import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { SERVICE_LOGOS } from '../../resources/js/utils/serviceCloudGeometry.js'
import { SIGNAL_ORBIT_PATH } from '../../resources/js/utils/signalOrbitGeometry.js'
import { penFixture, penFrames } from './helpers/penVerification.js'

const { frames: heroSources } = JSON.parse(await readFile(new URL('../../docs/audit/pen-hero-roles.json', import.meta.url), 'utf8'))

const references = [
    { width: 360, height: 800, cloud: [360, 560], content: 320, signal: [250, 250] },
    { width: 390, height: 844, cloud: [390, 560], content: 350, signal: [270, 270] },
    { width: 768, height: 1024, cloud: [768, 800], content: 600, signal: [465, 468] },
    { width: 1440, height: 1080, cloud: [580, 620], content: 580, signal: [861, 830] },
    { width: 2560, height: 1440, cloud: [900, 920], content: 820, signal: [1536, 1246] },
]

async function envelope(hero, art, content) {
    const [section, decor, text] = await Promise.all([hero.boundingBox(), art.boundingBox(), content.boundingBox()])
    for (const box of [decor, text]) {
        expect(box.x).toBeGreaterThanOrEqual(section.x - 1)
        expect(box.y).toBeGreaterThanOrEqual(section.y - 1)
        expect(box.x + box.width).toBeLessThanOrEqual(section.x + section.width + 1)
        expect(box.y + box.height).toBeLessThanOrEqual(section.y + section.height + 1)
    }
    return { section, decor, text, horizontalOverlap: Math.max(0, Math.min(decor.x + decor.width, text.x + text.width) - Math.max(decor.x, text.x)) }
}

for (const theme of ['light', 'dark']) for (const reference of references) {
    test(`Service Cloud static source ${reference.width} ${theme}`, async ({ page, request }, info) => {
        const resources = []
        page.on('pageerror', error => { throw error })
        page.on('request', request => { if (request.url().includes('/images/hero/services/')) resources.push(request.url()) })
        await page.setViewportSize({ width: reference.width, height: reference.height })
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
        await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
        const hero = page.locator('.service-hero'), cloud = page.locator('.service-logo-cloud'), content = page.locator('.service-hero__content')
        await expect(cloud).toHaveAttribute('data-state', 'ready')
        await expect(cloud).toHaveAttribute('data-running', 'false')
        await expect(cloud).toHaveAttribute('data-interactive', 'false')
        await expect(cloud).toHaveAttribute('aria-hidden', 'true')
        await expect(cloud).toHaveAttribute('focusable', 'false')
        await expect(cloud.locator('image')).toHaveCount(23)
        const hrefs = await cloud.locator('image').evaluateAll(images => images.map(image => image.getAttribute('href')))
        expect(hrefs).toEqual(SERVICE_LOGOS.map(name => `/images/hero/services/brands/${name}-${theme}.svg`))
        expect([...new Set(resources.map(url => new URL(url).pathname))].sort()).toEqual(SERVICE_LOGOS.flatMap(name => ['light', 'dark'].map(mode => `/images/hero/services/brands/${name}-${mode}.svg`)).sort())
        expect(resources.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true)
        const metrics = await envelope(hero, cloud, content)
        const source = heroSources.find(source => source.width === reference.width && source.theme === theme)
            ?? heroSources.find(source => source.width === reference.width)
        expect(metrics.section.height).toBeCloseTo(source.height, 0)
        expect(metrics.decor.width).toBeCloseTo(source.art.width, 0)
        expect(metrics.decor.height).toBeCloseTo(source.art.height, 0)
        expect(metrics.text.width).toBeCloseTo(source.content.width, 0)
        expect(metrics.text.height).toBeCloseTo(source.content.height, 0)
        // Accepted desktop correction centers text on the full viewport;
        // Pen's content y is offset by half the reference header height.
        const offset = reference.width >= 1200 ? (reference.height - source.height) / 2 : 0
        expect(metrics.text.y - metrics.section.y).toBeCloseTo(source.content.y - offset, 0)
        expect(await content.evaluate(node => parseFloat(getComputedStyle(node).rowGap))).toBe(source.content.gap)
        const fill = heroSources.find(source => source.theme === theme).fill
        await expect(hero).toHaveCSS('background-color', `rgb(${fill.slice(1).match(/../g).map(channel => parseInt(channel, 16)).join(', ')})`)
        if (reference.width >= 1200) expect(metrics.horizontalOverlap).toBe(0)
        const mask = await cloud.locator(':scope > g').getAttribute('mask')
        if (reference.width < 1200) expect(mask).toMatch(/^url\(#service-cloud-\d+-mask\)$/)
        else expect(mask).toBeNull()
        await info.attach('hero-envelope', { body: JSON.stringify({ theme, reference, sourceId: source.id, inferredTheme: source.theme !== theme, metrics, hrefs, resources }, null, 2), contentType: 'application/json' })
        await info.attach('hero-static', { body: await hero.screenshot(), contentType: 'image/png' })
        await info.attach('hero-content', { body: await content.screenshot(), contentType: 'image/png' })
    })

    for (const failure of ['one-resource', 'renderer']) {
        test(`Signal Orbit ${failure} envelope ${reference.width} ${theme}`, async ({ page, request }, info) => {
            page.on('pageerror', error => { throw error })
            await page.setViewportSize({ width: reference.width, height: reference.height })
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
            if (failure === 'one-resource') await page.route('**/images/hero/services/brands/openai-dark.svg', route => route.abort('failed'))
            else await page.addInitScript(() => {
                const append = SVGSVGElement.prototype.append
                SVGSVGElement.prototype.append = function (...nodes) {
                    if (this.classList.contains('service-logo-cloud')) {
                        SVGSVGElement.prototype.append = append
                        throw new Error('Intentional SVG renderer fault')
                    }
                    return append.apply(this, nodes)
                }
            })
            await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
            const hero = page.locator('.landing-hero'), signal = page.locator('.landing-hero__signal'), content = page.locator('.landing-hero__content')
            await expect(signal).toBeVisible()
            await expect(page.locator('.service-logo-cloud')).toHaveCount(0)
            await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
            await expect(hero.getByRole('link', { name: 'Попробовать бесплатно', exact: true })).toHaveAttribute('href', '/register')
            await expect(hero.getByRole('link', { name: 'Посмотреть тариф', exact: true })).toHaveAttribute('href', '#pricing')
            await expect(signal).toHaveCSS('pointer-events', 'none')
            expect(await signal.locator('path').evaluateAll(nodes => nodes.map(node => node.getAttribute('d')))).toEqual([SIGNAL_ORBIT_PATH, SIGNAL_ORBIT_PATH])
            const metrics = await envelope(hero, signal, content)
            expect(metrics.decor.width).toBeCloseTo(reference.signal[0], 0)
            expect(metrics.decor.height).toBeCloseTo(reference.signal[1], 0)
            expect(await content.evaluate(node => Number(getComputedStyle(node).zIndex))).toBeGreaterThan(0)
            await info.attach('hero-envelope', { body: JSON.stringify({ failure, theme, reference, metrics }, null, 2), contentType: 'application/json' })
            if (failure === 'one-resource') await info.attach('hero-static', { body: await hero.screenshot(), contentType: 'image/png' })
            await page.emulateMedia({ forcedColors: 'active' })
            await expect(signal).toBeHidden()
            await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
            await expect(hero.getByRole('link', { name: 'Попробовать бесплатно', exact: true })).toBeVisible()
        })
    }
}

for (const theme of ['light', 'dark']) for (const viewport of [{ width: 1200, height: 800 }, { width: 1920, height: 1080 }]) {
    test(`Signal Orbit intermediate envelope ${viewport.width} ${theme}`, async ({ page, request }, info) => {
        await page.setViewportSize(viewport)
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
        await page.route('**/images/hero/services/brands/openai-dark.svg', route => route.abort('failed'))
        await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
        const hero = page.locator('.landing-hero'), signal = page.locator('.landing-hero__signal')
        await expect(signal).toBeVisible()
        const metrics = await envelope(hero, signal, page.locator('.landing-hero__content'))
        expect(metrics.section.height + (await page.getByRole('banner').boundingBox()).height).toBeCloseTo(viewport.height, 0)
        await info.attach('hero-envelope', { body: JSON.stringify({ theme, viewport, metrics }, null, 2), contentType: 'application/json' })
    })
}
