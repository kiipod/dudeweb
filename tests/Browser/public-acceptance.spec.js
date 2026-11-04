import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { penFixture, penFrames } from './helpers/penVerification.js'

const { frames } = JSON.parse(await readFile(new URL('../../docs/audit/pen-public-detail-roles.json', import.meta.url), 'utf8'))
const { frames: shellFrames } = JSON.parse(await readFile(new URL('../../docs/audit/pen-shell-roles.json', import.meta.url), 'utf8'))
const selectors = {
    'advantages-heading': '#advantages-title',
    'advantages-description': '#advantages-title + p',
    'platforms-heading': '#platforms-title',
    'platforms-description': '#platforms-title + p',
    'theme-icon': 'header button[data-public-menu-control] svg',
    'feature-scene': '#advantages article:first-child [aria-hidden="true"]',
    'pricing-header': '#pricing [aria-live="polite"]',
    'period-selector': '#pricing fieldset > div',
    'selected-period': '#pricing label:has(input:checked)',
    'pricing-actions': '#pricing a[href="/register"]',
    'pricing-eyebrow': '#pricing .font-mono:first-child',
    'final-eyebrow': '.landing-final__panel .font-mono',
    'menu-arrow': '#public-mobile-menu > a svg',
}
const color = hex => `rgb(${hex.slice(1).match(/../g).map(value => parseInt(value, 16)).join(', ')})`

// Pen has no separate 360/light or 768/light page. Preserve the dark
// reference geometry and use colors from the direct mobile light roles.
const lightPalette = frames.find(frame => frame.id === 'sCLcA').roles
const inferredFrames = ['roQZ1', 'm3BuD'].map(id => {
    const source = frames.find(frame => frame.id === id)
    return {
        ...source, id: `${id}-light-inferred`, referenceId: id,
        name: `${source.name} · inferred light`,
        roles: source.roles.map(role => {
            const palette = lightPalette.find(light => light.kind === role.kind)
            return { ...role, fill: palette?.fill ?? role.fill, stroke: palette?.stroke ?? role.stroke, color: palette?.color ?? role.color }
        }),
    }
})

for (const source of [...frames, ...inferredFrames]) {
    test(`Public details ${source.id} ${source.name}`, async ({ page, request }, info) => {
        const reference = penFrames.find(frame => frame.id === (source.referenceId ?? source.id))
        const frame = source.referenceId ? { ...reference, theme: 'light' } : reference
        await page.setViewportSize({ width: frame.width, height: frame.viewportHeight })
        await page.emulateMedia({ colorScheme: frame.theme })
        await penFixture(page, request, frame)
        await info.attach('public-source', { body: JSON.stringify({ geometry: reference.id, palette: source.referenceId ? 'sCLcA' : reference.id, inferredTheme: Boolean(source.referenceId) }), contentType: 'application/json' })
        const gradient = shellFrames.find(item => item.id === (source.referenceId ? 'sCLcA' : source.id)).roles.find(role => role.kind === 'final-panel')
        const actualGradient = await page.locator('.landing-final__panel').evaluate(element => getComputedStyle(element).backgroundImage)
        // Pen angles run counterclockwise from up; CSS angles run clockwise.
        const cssDirection = actualGradient.match(/^linear-gradient\((to (?:top|right|bottom|left)|[\d.]+deg)/)?.[1]
        const cssAngle = { 'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270 }[cssDirection] ?? parseFloat(cssDirection)
        expect.soft(cssAngle, `gradient direction ${gradient.id}`).toBe((360 - gradient.fill.rotation) % 360)
        const stops = gradient.fill.colors.map(stop => actualGradient.indexOf(color(stop.color)))
        expect.soft(stops[0], `first gradient color ${gradient.id}`).toBeGreaterThanOrEqual(0)
        expect.soft(stops[1], `gradient color order ${gradient.id}`).toBeGreaterThan(stops[0])
        await info.attach('public-gradient', { body: JSON.stringify({ id: gradient.id, source: gradient.fill, actual: actualGradient }), contentType: 'application/json' })
        const measurements = [], indices = {}
        for (const role of source.roles) {
            const index = indices[role.kind] ?? 0
            indices[role.kind] = index + 1
            let target = page.locator(selectors[role.kind]).nth(index)
            if (['pricing-header', 'pricing-actions'].includes(role.kind)) target = target.locator('..')
            await expect(target).toBeVisible()
            const actual = await target.evaluate(element => {
                const css = getComputedStyle(element), box = element.getBoundingClientRect()
                return { width: box.width, height: box.height, textAlign: css.textAlign, color: css.color, fill: css.backgroundColor,
                    shadow: css.boxShadow, padding: parseFloat(css.paddingTop), gap: parseFloat(css.rowGap) }
            })
            measurements.push({ id: role.id, kind: role.kind, actual })
            await test.step(`${role.kind} vs ${role.id}`, async () => {
                if (role.textAlign) {
                    expect.soft(actual.textAlign, `textAlign ${role.id}`).toBe(role.textAlign)
                } else if (role.kind === 'feature-scene') {
                    expect.soft(actual.width, `width ${role.id}`).toBeCloseTo(role.bounds.width, 1)
                    expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.bounds.height, 1)
                    expect.soft(actual.color, `color ${role.id}`).toBe(color(role.color))
                    expect.soft(actual.fill, `fill ${role.id}`).toBe(color(role.fill))
                } else if (role.kind.endsWith('icon') || role.kind === 'menu-arrow') {
                    expect.soft(actual.width, `width ${role.id}`).toBeCloseTo(role.bounds.width, 1)
                    expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.bounds.height, 1)
                    expect.soft(actual.color, `color ${role.id}`).toBe(color(role.fill))
                } else if (role.kind.endsWith('eyebrow')) {
                    expect.soft(actual.color, `color ${role.id}`).toBe(color(role.fill))
                } else if (['pricing-header', 'pricing-actions'].includes(role.kind)) {
                    expect.soft(actual.gap, `gap ${role.id}`).toBe(role.gap ?? 0)
                } else {
                    expect.soft(actual.fill, `fill ${role.id}`).toBe(color(role.fill))
                    if (role.kind === 'period-selector') {
                        expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.bounds.height, 1)
                        expect.soft(actual.padding, `padding ${role.id}`).toBe(role.padding)
                        expect.soft(actual.gap, `gap ${role.id}`).toBe(role.gap)
                        expect.soft(actual.shadow, `ring ${role.id}`).toContain(`${color(role.stroke)} 0px 0px 0px ${role.strokeWidth}px inset`)
                    }
                    // The selected outline intentionally uses the stronger
                    // semantic accent; control-presentation checks its 3:1 contrast.
                }
            })
        }
        await info.attach('public-measurements', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' })
        if (frame.state === 'menu-open') {
            // The direct light Pen menu shows the first link in its hover state.
            if (frame.id === 'SnjXU') await page.locator('#public-mobile-menu > a').first().hover()
            await info.attach('public-menu', { body: await page.screenshot(), contentType: 'image/png' })
            await info.attach('public-menu-panel', { body: await page.locator('#public-mobile-menu').screenshot(), contentType: 'image/png' })
        } else {
            for (const [name, selector] of Object.entries({ header: 'header', advantages: '#advantages', platforms: '#devices', pricing: '#pricing', final: 'section:has(> .landing-final__panel)', footer: 'footer' })) {
                await info.attach(`public-${name}`, { body: await page.locator(selector).screenshot(), contentType: 'image/png' })
            }
        }
    })
}
