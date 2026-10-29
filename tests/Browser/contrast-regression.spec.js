import { expect, test } from '@playwright/test'
import { installContrastTools } from './helpers/contrastTools.js'
import { inspectPageContrast } from './helpers/pageContrast.js'
import { inspectControls } from './helpers/paintedFocus.js'

async function fixture(page, html) {
    await page.setContent(`<style>
        body { margin: 32px; background: white; color: black; font: 16px sans-serif }
        button { padding: 20px; margin: 20px; background: transparent; border: 0 }
        button:focus-visible { outline: 2px solid black; outline-offset: 2px }
    </style>${html}`)
    await page.evaluate(installContrastTools)
}

test('modern CSS colors and alpha header bound include every backdrop', async ({ page }) => {
    await fixture(page, '<header style="position:sticky;top:0;background:color-mix(in oklab, #fbf9f4 95%, transparent);color:#5d5952">Header</header>')
    const result = await inspectPageContrast(page)
    expect(result.manualDetails).toEqual([])
    expect(result.bounds).toHaveLength(1)
    const proof = await page.evaluate(() => {
        const { rgba, background, contrast, minimumContrast } = window.__contrastTools
        const header = document.querySelector('header')
        const fill = rgba(getComputedStyle(header).backgroundColor)
        const front = rgba(getComputedStyle(header).color)
        const bounds = background(header)
        const minimum = minimumContrast(front, bounds)
        return {
            fill, minimum,
            samples: Array.from({ length: 256 }, (_, channel) => contrast(front, fill.slice(0, 3).map(value => value * fill[3] + channel * (1 - fill[3])))),
        }
    })
    expect(proof.fill[3]).toBe(.95)
    expect(proof.fill.slice(0, 3).map(Math.round)).toEqual([251, 249, 244])
    expect(Math.min(...proof.samples)).toBeCloseTo(proof.minimum, 6)
    expect(proof.minimum).toBeGreaterThan(4.5)
    await page.locator('header').evaluate(element => element.style.color = '#bbb')
    expect((await inspectPageContrast(page)).failures).toHaveLength(1)
})

test('ordinary alpha fills composite over their actual parent surface', async ({ page }) => {
    await fixture(page, '<div style="background:#f8f5ee"><span style="background:rgb(86 214 174 / .1);color:#22755d">Active</span></div>')
    const result = await inspectPageContrast(page)
    expect(result.failures).toEqual([])
    expect(result.bounds).toEqual([])
    expect(result.checked).toBe(1)
})

test('logotypes and native inactive labels are explicit exceptions; enabled opacity is unresolved', async ({ page }) => {
    await fixture(page, '<span role="img" aria-label="dudeweb" style="color:#eee">dudeweb</span><label style="opacity:.5"><input type="radio" disabled>Inactive</label><p class="font-brand" style="color:#eee">Ordinary text</p><p style="opacity:.5">Enabled opacity</p>')
    const result = await inspectPageContrast(page)
    expect(result.exemptions.map(row => row.reason)).toEqual(expect.arrayContaining(['logotype', 'inactive-native-control']))
    expect(result.failures.map(row => row.label)).toContain('Ordinary text')
    expect(result.manualDetails.map(row => [row.label, row.reason])).toEqual([['Enabled opacity', 'opacity-group']])
})

test('painted gradient text detects failure and restores styles and scroll', async ({ page }) => {
    await fixture(page, '<div style="height:1200px"></div><section style="background:linear-gradient(in oklab, #fff, #eee);padding:32px"><p style="color:#bbb">Gradient text</p><button style="background:#111;color:white">Opaque child</button></section>')
    const before = await page.locator('p').getAttribute('style')
    const result = await inspectPageContrast(page)
    expect(result.manualDetails).toEqual([])
    expect(result.painted).toHaveLength(1)
    expect(result.failures.map(row => row.label)).toEqual(['Gradient text'])
    expect(await page.locator('p').getAttribute('style')).toBe(before)
    expect(await page.evaluate(() => scrollY)).toBe(0)
    await page.locator('p').evaluate(element => element.style.color = 'black')
    expect((await inspectPageContrast(page)).failures).toEqual([])
})

test('placeholder, field value and field boundary cannot silently escape contrast checks', async ({ page }) => {
    await fixture(page, '<style>input { background:white; color:#aaa; border:1px solid #ddd } input::placeholder { color:#aaa; opacity:1 }</style><input id="placeholder" placeholder="Email"><input id="value" value="Fixture">')
    const result = await inspectPageContrast(page)
    expect(result.fieldManual).toEqual([])
    expect(result.fieldsChecked).toBe(2)
    expect(result.failures.map(row => row.kind)).toEqual(['placeholder', 'field-value'])
    expect(result.fieldFailures).toHaveLength(2)
    await page.locator('body').evaluate(element => element.style.filter = 'contrast(.5)')
    expect((await inspectPageContrast(page)).fieldManual).toHaveLength(2)
})

test('painted focus on a gradient detects a low-contrast ring', async ({ page }) => {
    await fixture(page, '<section style="padding:20px;background:linear-gradient(in oklab, white, #eee)"><button>Focus target</button></section>')
    await page.keyboard.press('Tab')
    const first = (await inspectControls(page, { focus: true })).focus
    expect(first.manual).toBe(false)
    expect(first.method).toBe('painted-ring-background')
    expect(first.ratio).toBeGreaterThan(3)
    await page.locator('button').evaluate(element => element.style.outlineColor = '#ddd')
    const second = (await inspectControls(page, { focus: true })).focus
    expect(second.manual).toBe(false)
    expect(second.ratio).toBeLessThan(3)
})

test('icon-only controls on alpha headers report low contrast and unsupported paint', async ({ page }) => {
    await fixture(page, '<header style="position:sticky;top:0;background:rgb(255 255 255 / .95)"><button aria-label="Menu"><svg width="24" height="24" stroke="#ddd" fill="none"><path d="M2 2h20"/></svg></button></header>')
    const first = (await inspectControls(page, { icons: true })).icons
    expect(first).toHaveLength(1)
    expect(first[0].manual).toBe(false)
    expect(first[0].ratio).toBeLessThan(3)
    await page.locator('svg').evaluate(element => element.style.stroke = 'black')
    expect((await inspectControls(page, { icons: true })).icons[0].ratio).toBeGreaterThan(3)
    await page.locator('svg').evaluate(element => element.style.stroke = 'none')
    expect((await inspectControls(page, { icons: true })).icons[0].manual).toBe(true)
})
