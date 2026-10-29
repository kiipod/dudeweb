import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { penFixture, penFrames } from './helpers/penVerification.js'

const { frames } = JSON.parse(await readFile(new URL('../../docs/audit/pen-shell-roles.json', import.meta.url), 'utf8'))
const padding = value => typeof value === 'number' ? Array(4).fill(value) : value.length === 2 ? [value[0], value[1], value[0], value[1]] : value
const color = hex => {
    const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16))
    return channels.length === 4 ? `rgba(${channels.slice(0, 3).join(', ')}, ${Number((channels[3] / 255).toFixed(3))})` : `rgb(${channels.join(', ')})`
}
const selectors = {
    'auth-header': 'header', 'auth-content': 'main',
    'status-icon': 'main > section > :is([aria-hidden="true"], span)',
    'public-theme': 'header button[data-public-menu-control]',
    'public-login': 'header a[data-public-menu-control]',
    'advantages-layout': '#advantages > div', 'feature': '#advantages article',
    'feature-tile': '#advantages article > span', 'platforms-layout': '#devices > div',
    'platform': '#devices li', 'pricing-layout': '#pricing > div',
    'final-panel': '.landing-final__panel', 'footer-layout': 'footer > div',
    'footer-links': 'footer > div > div:nth-child(2)', 'public-menu': '#public-mobile-menu',
    'public-menu-item': '#public-mobile-menu > a', 'public-menu-cta': '#public-mobile-menu > a:last-of-type',
}
const ringKinds = ['feature', 'feature-tile', 'platform', 'final-panel']
const layoutKinds = ['advantages-layout', 'platforms-layout', 'pricing-layout', 'footer-layout']

for (const source of frames) {
    test(`Pen shell ${source.id} ${source.name}`, async ({ page, request }, info) => {
        const frame = penFrames.find(frame => frame.id === source.id)
        expect(frame).toBeTruthy()
        page.on('pageerror', error => { throw error })
        await page.setViewportSize({ width: frame.width, height: frame.viewportHeight })
        await page.emulateMedia({ colorScheme: frame.theme })
        await penFixture(page, request, frame)
        const indices = {}, measurements = []
        for (const role of source.roles) {
            const index = indices[role.kind] ?? 0
            indices[role.kind] = index + 1
            const target = role.kind === 'status-secondary'
                ? page.getByRole('link', { name: role.name.split('Action · ')[1], exact: true })
                : page.locator(selectors[role.kind]).nth(index)
            await expect(target).toBeVisible()
            // The first light item is shown highlighted in the Pen reference;
            // reproduce it as a pointer state, not a permanently selected link.
            if (role.kind === 'public-menu-item' && role.fill === '#EEF0FF') await target.hover()
            const actual = await target.evaluate(element => {
                const css = getComputedStyle(element), box = element.getBoundingClientRect()
                const icon = element.querySelector('svg'), glyph = icon && getComputedStyle(icon)
                return {
                    width: box.width, height: box.height, minimum: parseFloat(css.minHeight),
                    padding: [css.paddingTop, css.paddingRight, css.paddingBottom, css.paddingLeft].map(parseFloat),
                    radii: [css.borderTopLeftRadius, css.borderTopRightRadius, css.borderBottomRightRadius, css.borderBottomLeftRadius].map(parseFloat),
                    gap: parseFloat(css.rowGap), fill: css.backgroundColor, stroke: css.borderTopColor,
                    strokeWidth: parseFloat(css.borderTopWidth), shadow: css.boxShadow,
                    glyph: glyph && { width: icon.getBoundingClientRect().width, height: icon.getBoundingClientRect().height, color: glyph.color },
                }
            })
            measurements.push({ id: role.id, kind: role.kind, actual })
            await test.step(`${role.kind} vs ${role.id}`, async () => {
                if (role.kind === 'auth-content') actual.gap = await page.locator('main > section').evaluate(element => parseFloat(getComputedStyle(element).rowGap))
                if (role.padding !== undefined) for (const [index, value] of padding(role.padding).entries()) expect.soft(actual.padding[index], `padding ${role.id}`).toBeCloseTo(value, 1)
                if (role.gap !== undefined && role.kind !== 'footer-layout') expect.soft(actual.gap, `gap ${role.id}`).toBeCloseTo(role.gap, 1)
                if (role.radius !== undefined) for (const radius of actual.radii) expect.soft(radius, `radius ${role.id}`).toBeCloseTo(role.radius, 1)
                if (['auth-header', 'public-theme', 'public-login', 'status-icon'].includes(role.kind)) expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.height, 1)
                if (['feature', 'platform', 'public-menu-item', 'public-menu-cta', 'status-secondary'].includes(role.kind)) {
                    expect.soft(actual.minimum, `minHeight ${role.id}`).toBeCloseTo(role.height, 1)
                    expect.soft(actual.height, `rendered height ${role.id}`).toBeGreaterThanOrEqual(role.height - .05)
                }
                // Border boxes in the menu consume 1px on either side, while
                // Pen strokes overlay the parent layout.
                const inset = ['public-menu-item', 'public-menu-cta'].includes(role.kind) ? 2 : 0
                // Hug buttons grow with rendered text metrics; source padding
                // and height remain exact, without fixing a font-derived width.
                if (role.widthMode !== 'hug') expect.soft(Math.abs(actual.width - (role.width - inset)), `width ${role.id}`).toBeLessThanOrEqual(1)
                if (typeof role.fill === 'string') {
                    let fill = actual.fill
                    if (layoutKinds.includes(role.kind)) fill = await target.evaluate(element => {
                        for (let node = element; node; node = node.parentElement) {
                            const fill = getComputedStyle(node).backgroundColor
                            if (fill !== 'rgba(0, 0, 0, 0)') return fill
                        }
                        return 'rgba(0, 0, 0, 0)'
                    })
                    // Use the browser's own alpha serialization for the raw
                    // source hex (Chromium serializes #1a as 0.1).
                    const expectedFill = await page.evaluate(hex => {
                        const style = document.createElement('i').style
                        style.backgroundColor = hex
                        return style.backgroundColor
                    }, role.fill)
                    expect.soft(fill, `fill ${role.id}`).toBe(expectedFill)
                }
                if (role.stroke) {
                    if (ringKinds.includes(role.kind)) expect.soft(actual.shadow, `inset ring ${role.id}`).toContain(`${color(role.stroke)} 0px 0px 0px ${role.strokeWidth}px inset`)
                    else if (!layoutKinds.includes(role.kind)) {
                        expect.soft(actual.stroke, `stroke ${role.id}`).toBe(color(role.stroke))
                        if (role.strokeWidth !== undefined) expect.soft(actual.strokeWidth, `stroke width ${role.id}`).toBe(role.strokeWidth)
                    }
                }
                if (role.effect?.type === 'shadow') {
                    const effect = role.effect
                    const shadowColor = await page.evaluate(hex => {
                        const style = document.createElement('i').style
                        style.color = hex
                        return style.color
                    }, effect.color)
                    expect.soft(actual.shadow, `shadow color ${role.id}`).toContain(shadowColor)
                    expect.soft(actual.shadow, `shadow geometry ${role.id}`).toContain(`${effect.offset.x}px ${effect.offset.y}px ${effect.blur}px 0px`)
                }
                if (role.labelColor) await expect(target.locator('span').first()).toHaveCSS('color', color(role.labelColor))
                if (role.icon && role.kind === 'status-icon') {
                    expect.soft(actual.glyph.width).toBe(role.icon.width)
                    expect.soft(actual.glyph.height).toBe(role.icon.height)
                    // Existing semantic light mappings preserve contrast for
                    // yellow/red status glyphs on their tinted backgrounds.
                    const foreground = frame.theme === 'light' && role.icon.fill === '#E3B45B' ? '#805B10'
                        : frame.theme === 'light' && role.icon.fill === '#F08A9B' ? '#A33E50' : role.icon.fill
                    expect.soft(actual.glyph.color, `glyph ${role.id}`).toBe(color(foreground))
                    if (role.icon.icon === 'mail-check') await expect(target.locator('svg path[d="m16 19 2 2 4-4"]')).toHaveCount(1)
                    if (role.icon.icon === 'clock-3') await expect(target.locator('svg polyline[points="12 6 12 12 16.5 12"]')).toHaveCount(1)
                }
            })
        }
        if (frame.component === 'Account/Payments/Show' && frame.state !== 'pending') {
            expect.soft(await page.locator('main > section > div:last-child').evaluate(element => parseFloat(getComputedStyle(element).rowGap))).toBe(16)
        }
        await info.attach('shell-measurements', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' })
        if (['qV2vd', 'NDzQS', 'tYWHi', 'z75E8g', 'SnjXU', 'w0LF3'].includes(source.id)) {
            await info.attach('shell-detail', { body: await page.screenshot(), contentType: 'image/png' })
        }
    })
}
