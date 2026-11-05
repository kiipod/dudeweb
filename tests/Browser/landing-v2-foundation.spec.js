import { createHash } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { renderSections } from '../helpers/landingV2Foundation.js'

const sections = await renderSections()
// Pen reference values, independent of CSS interpolation and runtime token expressions.
const references = [
    { width: 360, content: 320, gutter: 20, type: [38, 16, 20, 24, 15, 30, 30, 24, 22, 48], padding: [[32, 56], [32, 48], [56, 64], [40, 56], [56, 56], [48, 24]] },
    { width: 390, content: 350, gutter: 20, type: [40, 16, 20, 24, 15, 30, 32, 26, 22, 48], padding: [[32, 56], [32, 48], [56, 64], [40, 56], [56, 56], [48, 24]] },
    { width: 430, content: 390, gutter: 20, type: [44, 16, 20, 24, 15, 30, 34, 26, 22, 48], padding: [[32, 56], [32, 48], [56, 64], [40, 56], [56, 56], [48, 24]] },
    { width: 768, content: 688, gutter: 40, type: [52, 18, 22, 24, 16, 36, 40, 36, 24, 56], padding: [[48, 72], [40, 56], [72, 80], [48, 72], [80, 80], [64, 40]] },
    { width: 1024, content: 928, gutter: 48, type: [60, 18, 22, 26, 17, 36, 44, 36, 24, 56], padding: [[48, 72], [40, 56], [72, 80], [48, 72], [80, 80], [64, 40]] },
    { width: 1440, content: 1280, gutter: 80, type: [72, 18, 23, 24, 17, 44, 44, 44, 24, 60], padding: [[60, 48], [40, 56], [72, 80], [48, 72], [80, 80], [64, 40]] },
    { width: 1920, content: 1600, gutter: 160, type: [92, 22, 25, 28, 19, 52, 52, 52, 28, 72], padding: [[72, 56], [40, 56], [72, 80], [48, 72], [80, 80], [64, 40]] },
    { width: 2560, content: 2000, gutter: 280, type: [108, 24, 26, 32, 21, 60, 64, 64, 32, 80], padding: [[84, 68], [48, 56], [104, 120], [64, 96], [120, 120], [80, 56]] },
]
const roles = ['hero', 'body', 'wordmark', 'benefit-title', 'benefit-copy', 'platform-heading', 'connection-heading', 'section-heading', 'story-title', 'final-heading']
const variants = ['hero', 'platforms', 'connection', 'news', 'subscription', 'footer']

for (const reference of references) {
    for (const theme of ['light', 'dark']) {
        test(`V2 foundation matches Pen at ${reference.width}px with ${theme} site preference`, async ({ page }) => {
            await page.setViewportSize({ width: reference.width, height: 1440 })
            await page.addInitScript(value => localStorage.setItem('dudeweb-theme', value), theme)
            await page.goto('/landing')
            const shell = page.locator('[data-landing-v2]')
            await expect(shell).toHaveCSS('background-color', 'rgb(255, 255, 255)')
            await expect(shell).toHaveCSS('color', 'rgb(32, 33, 38)')
            await expect(shell).toHaveCSS('color-scheme', 'light')
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            // Chromium may serialize interpolated values with subpixel rounding.
            expect(await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeCloseTo(reference.type[2], 2)
            await expect(page.locator('h1')).toHaveCSS('font-weight', '600')
            await expect(page.locator('img')).toBeVisible()
            expect(await page.locator('img').evaluate(image => image.complete && image.naturalWidth === 44)).toBe(true)
            await shell.locator('main').evaluate((main, html) => main.insertAdjacentHTML('beforeend', html), sections)

            for (const [index, variant] of variants.entries()) {
                const section = page.locator(`[data-foundation-section="${variant}"]`)
                const geometry = await section.evaluate(element => {
                    const style = getComputedStyle(element)
                    const container = element.firstElementChild
                    const bounds = container.getBoundingClientRect()
                    return { top: parseFloat(style.paddingTop), bottom: parseFloat(style.paddingBottom), gutter: parseFloat(style.paddingLeft), width: bounds.width, left: bounds.left, display: getComputedStyle(container).display }
                })
                expect(geometry.top).toBeCloseTo(reference.padding[index][0], 1)
                expect(geometry.bottom).toBeCloseTo(reference.padding[index][1], 1)
                expect(geometry.gutter).toBeCloseTo(reference.gutter, 1)
                expect(geometry.width).toBeCloseTo(reference.content, 1)
                expect(geometry.left).toBeCloseTo(reference.gutter, 1)
                expect(geometry.display).toBe('grid')
            }

            const type = await shell.evaluate((element, names) => names.map(name => {
                const probe = document.createElement('span')
                probe.textContent = 'Любимые сервисы'
                probe.style.fontSize = `var(--text-v2-${name})`
                probe.style.lineHeight = `var(--text-v2-${name}--line-height)`
                element.append(probe)
                const style = getComputedStyle(probe)
                const result = { size: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight), family: style.fontFamily }
                probe.remove()
                return result
            }), roles)
            for (const [index, value] of type.entries()) {
                expect(value.size, roles[index]).toBeCloseTo(reference.type[index], 2)
                expect(value.family).toContain('IBM Plex Sans Variable')
                if (roles[index] !== 'wordmark') {
                    const ratio = [1.04, 1.5, null, reference.width === 2560 ? 1.15 : 1.18, 1.5, 1.08, 1.08, 1.1, 1.25, 1.06][index]
                    expect(value.lineHeight, roles[index]).toBeCloseTo(reference.type[index] * ratio, 1)
                }
            }
            const fonts = await page.evaluate(async () => {
                const sans = await document.fonts.load('650 24px "IBM Plex Sans Variable"', 'Любимые сервисы')
                const mono = await document.fonts.load('500 18px "IBM Plex Mono"', 'Тарифы')
                return { sans: sans.length, mono: mono.length }
            })
            expect(fonts.sans).toBeGreaterThan(0)
            expect(fonts.mono).toBeGreaterThan(0)
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        })
    }
}

test('V2 originals are served with their real format, dimensions and recorded source bytes', async ({ page, request }) => {
    const manifestResponse = await request.get('/landing-v2/manifest.json')
    expect(manifestResponse.ok()).toBe(true)
    const manifest = await manifestResponse.json()
    expect(manifest.assets).toHaveLength(33)
    for (const asset of manifest.assets) {
        const response = await request.get(asset.url)
        expect(response.ok(), asset.url).toBe(true)
        expect(response.headers()['content-type'], asset.url).toContain(asset.mediaType)
        expect(createHash('sha256').update(await response.body()).digest('hex'), asset.url).toBe(asset.sha256)
    }
    await page.goto('/landing')
    const decoded = await page.evaluate(async assets => Promise.all(assets.map(async asset => {
        const image = new Image()
        image.src = asset.url
        await image.decode()
        return { url: asset.url, width: image.naturalWidth, height: image.naturalHeight }
    })), manifest.assets)
    expect(decoded).toEqual(manifest.assets.map(({ url, width, height }) => ({ url, width, height })))
})

test('V2 palette, radii and local shadows retain the Pen values under a dark site preference', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('dudeweb-theme', 'dark'))
    await page.goto('/landing')
    const expected = {
        page: '#ffffff', ink: '#202126', secondary: '#697386', border: '#e3e6ee', brand: '#8e9bff',
        'hero-accent': '#7480d5', 'brand-hover': '#a4aeff', 'brand-pressed': '#7d89ef', focus: '#4f55d8',
        surface: '#f8f9fc', 'surface-hover': '#eef1f8', 'control-border': '#e1e5ed', 'section-border': '#e8e9ed',
        'field-border': '#dee2ed', 'hero-copy': '#686b75', greeting: '#7b83a2', rule: '#bdc4d4', heading: '#242a34',
        'platform-ink': '#262b34', 'story-ink': '#303745', 'tag-surface': '#f1f3f8', 'tag-text': '#657086',
        date: '#6d778b', 'cover-border': '#e5e9f1', 'price-surface': '#fdfdff', divider: '#e7eaf1', 'brand-detail': '#e87968',
    }
    const actual = await page.locator('[data-landing-v2]').evaluate((shell, names) => {
        const style = getComputedStyle(shell)
        return {
            colors: Object.fromEntries(names.map(name => {
                const probe = document.createElement('span')
                probe.style.color = `var(--color-v2-${name})`
                shell.append(probe)
                const value = getComputedStyle(probe).color
                probe.remove()
                return [name, value]
            })),
            radii: ['panel', 'hero-action', 'subscription-action', 'header-action', 'cover', 'tag'].map(name => {
                const probe = document.createElement('span')
                probe.style.borderRadius = `var(--radius-v2-${name})`
                shell.append(probe)
                const value = parseFloat(getComputedStyle(probe).borderRadius)
                probe.remove()
                return value
            }),
            shadows: ['origin', 'interface', 'fingerprint'].map(name => style.getPropertyValue(`--shadow-v2-${name}`).trim()),
            actionWeight: style.getPropertyValue('--font-weight-v2-hero-action').trim(),
        }
    }, Object.keys(expected))
    const renderedColors = Object.fromEntries(Object.entries(expected).map(([name, hex]) => {
        const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16))
        return [name, `rgb(${channels.join(', ')})`]
    }))
    expect(actual.colors).toEqual(renderedColors)
    expect(actual.radii).toEqual([4, 12, 8, 13, 12, 3])
    expect(actual.shadows).toEqual(['0 4px 18px #4f5c8a0a', '0 4px 16px #2632530a', '0 5px 16px #29365212'])
    expect(actual.actionWeight).toBe('650')
})

test('V2 container remains fluid between references and constrained on wider screens', async ({ page }) => {
    await page.goto('/landing')
    for (const width of [320, 600, 767, 769, 1023, 1025, 1200, 1439, 1441, 1600, 1919, 1921, 2559, 2561, 3840]) {
        await page.setViewportSize({ width, height: 1440 })
        const bounds = await page.locator('#landing-v2-content section > div').boundingBox()
        expect(bounds.width).toBeLessThanOrEqual(2000)
        expect(bounds.x + bounds.width / 2).toBeCloseTo(width / 2, 1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
})
