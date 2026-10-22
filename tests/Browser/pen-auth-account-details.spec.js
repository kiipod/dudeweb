import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { penFixture } from './helpers/penVerification.js'

const { frames } = JSON.parse(await readFile(new URL('../../docs/audit/pen-auth-account-detail-roles.json', import.meta.url), 'utf8'))
const { icons: artwork } = JSON.parse(await readFile(new URL('../../docs/audit/pen-auth-account-icon-artwork.json', import.meta.url), 'utf8'))

// Accepted semantic contrast mappings are separate from raw source values.
function foreground(role, frame) {
    const { theme } = frame
    // The accepted overlay contract highlights its More trigger while open.
    if (frame.state === 'more-open' && role.name === 'Главная Icon') return theme === 'light' ? '#71695F' : '#8B8B98'
    if (frame.state === 'more-open' && role.name === 'Ещё Icon') return theme === 'light' ? '#4F55D8' : '#8E9BFF'
    if (role.kind === 'copy-icon') return theme === 'light' ? '#FFFFFF' : '#11131D'
    if (theme !== 'light') return role.fill
    return ({ '#8E9BFF': '#4F55D8', '#7A7268': '#71695F', '#56D6AE': '#22755D', '#F08A9B': '#A33E50' })[role.fill] ?? role.fill
}

for (const frame of frames) {
    test(`Auth/account details ${frame.id} ${frame.name}`, async ({ page, request }, info) => {
        await page.setViewportSize({ width: frame.width, height: frame.viewportHeight })
        await page.emulateMedia({ colorScheme: frame.theme })
        await penFixture(page, request, frame)
        await page.mouse.move(0, 0)
        const measurements = []
        const cssColor = hex => page.evaluate(hex => {
            const style = document.createElement('i').style
            style.color = hex
            return style.color
        }, hex)
        for (const role of frame.roles) {
            const target = page.locator(role.selector).first()
            await expect(target, `${role.name} ${role.id}`).toBeVisible()
            const actual = await target.evaluate(element => {
                const css = getComputedStyle(element), box = element.getBoundingClientRect()
                return { width: box.width, height: box.height, fill: css.backgroundColor, color: css.color,
                    border: css.borderTopColor, borderWidth: parseFloat(css.borderTopWidth), radius: parseFloat(css.borderTopLeftRadius),
                    gap: parseFloat(css.rowGap), minimum: parseFloat(css.minHeight), font: css.fontFamily,
                    fontSize: parseFloat(css.fontSize), weight: Number(css.fontWeight), line: parseFloat(css.lineHeight) }
            })
            measurements.push({ id: role.id, name: role.name, actual })
            await test.step(`${role.name} vs ${role.id}`, async () => {
                if (['icon', 'copy-icon'].includes(role.kind)) {
                    expect.soft(actual.width, `width ${role.id}`).toBeCloseTo(role.bounds.width, 1)
                    expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.bounds.height, 1)
                    expect.soft(actual.color, `foreground ${role.id}`).toBe(await cssColor(foreground(role, frame)))
                    if (artwork[role.icon]) {
                        const shapes = await target.evaluate(svg => [...svg.children].map(shape => ({
                            tag: shape.localName, attrs: Object.fromEntries([...shape.attributes].map(attribute => [attribute.name, attribute.value])),
                        })))
                        expect.soft(shapes, `Lucide ${role.icon} artwork ${role.id}`).toEqual(artwork[role.icon])
                    }
                    if (role.icon === 'monitor-smartphone') await expect(target.locator('rect[width="6"][height="10"]')).toHaveCount(1)
                } else if (role.kind === 'header-control') {
                    expect.soft(actual.width, `width ${role.id}`).toBeCloseTo(role.bounds.width, 1)
                    expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.bounds.height, 1)
                    expect.soft(actual.radius, `radius ${role.id}`).toBe(role.radius)
                    expect.soft(actual.fill, `fill ${role.id}`).toBe(await cssColor(role.fill))
                    expect.soft(actual.border, `border ${role.id}`).toBe(await cssColor(role.stroke))
                } else if (role.kind === 'nav-row') {
                    expect.soft(actual.gap, `gap ${role.id}`).toBe(role.gap)
                } else if (role.kind === 'input') {
                    expect.soft(actual.height, `height ${role.id}`).toBeCloseTo(role.bounds.height, 1)
                    expect.soft(actual.radius, `radius ${role.id}`).toBe(role.radius)
                    expect.soft(actual.fill, `fill ${role.id}`).toBe(await cssColor(role.fill))
                    // D-15-07 deliberately strengthens input boundaries.
                    expect.soft(actual.border, `accessible field border ${role.id}`).toBe(await cssColor(frame.theme === 'light' ? '#92887D' : '#707892'))
                } else if (role.kind === 'overlay') {
                    expect.soft(actual.fill, `fill ${role.id}`).toBe(await cssColor(role.fill))
                    expect.soft(actual.border, `border ${role.id}`).toBe(await cssColor(role.stroke))
                    expect.soft(actual.gap, `gap ${role.id}`).toBe(role.gap)
                } else if (['detail-surface', 'close-control'].includes(role.kind)) {
                    expect.soft(actual.height, `minimum height ${role.id}`).toBeGreaterThanOrEqual(role.bounds.height)
                    expect.soft(actual.radius, `radius ${role.id}`).toBe(role.radius)
                    if (role.fill) expect.soft(actual.fill, `fill ${role.id}`).toBe(await cssColor(role.fill))
                    if (role.stroke) expect.soft(actual.border, `border ${role.id}`).toBe(await cssColor(role.stroke))
                    if (role.gap !== undefined) expect.soft(actual.gap, `gap ${role.id}`).toBe(role.gap)
                    if (role.kind === 'close-control') expect.soft(actual.width, `width ${role.id}`).toBe(role.bounds.width)
                } else if (role.kind === 'handle') {
                    expect.soft(actual.width, `width ${role.id}`).toBe(role.bounds.width)
                    expect.soft(actual.height, `height ${role.id}`).toBe(role.bounds.height)
                    expect.soft(actual.fill, `fill ${role.id}`).toBe(await cssColor(role.fill))
                    expect.soft(Math.min(actual.radius, actual.height / 2), `painted radius ${role.id}`).toBe(role.radius)
                } else if (role.kind === 'typography') {
                    expect.soft(actual.font, `font ${role.id}`).toContain(role.font)
                    expect.soft(actual.fontSize, `font size ${role.id}`).toBe(role.size)
                    expect.soft(actual.weight, `weight ${role.id}`).toBe(Number(role.weight))
                    expect.soft(actual.line, `line height ${role.id}`).toBeCloseTo(role.size * role.line, 1)
                }
            })
        }
        await info.attach('detail-measurements', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' })
        await info.attach(`detail-viewport-${frame.id}`, { body: await page.screenshot(), contentType: 'image/png' })
        const content = frame.state === 'more-open' ? page.locator('#account-more')
            : frame.state === 'promo-open' ? page.getByRole('dialog')
                : page.locator(frame.component.startsWith('Auth/') || frame.component === 'Account/Payments/Show' ? 'main > section' : 'main > div')
        await info.attach(`detail-content-${frame.id}`, { body: await content.screenshot(), contentType: 'image/png' })
    })
}
