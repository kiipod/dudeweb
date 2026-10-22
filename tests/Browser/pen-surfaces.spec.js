import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { penFixture, penFrames } from './helpers/penVerification.js'

const { frames } = JSON.parse(await readFile(new URL('../../docs/audit/pen-surface-roles.json', import.meta.url), 'utf8'))
const selectors = {
    'Subscription Status Card': 'section[aria-label="Твоя подписка"]',
    'Quick Connection': 'section[aria-labelledby="dashboard-connection-title"]',
    'Device Summary': 'section[aria-labelledby="dashboard-devices-title"]',
    'Current Subscription Overview': 'section[aria-label="Текущая подписка"]',
    'Payment Summary': 'main dl:has(dt:text-is("К оплате"))',
    'Referral Link Card': 'section[aria-labelledby="referral-link-title"]',
    'Stat · Приглашено друзей': 'main dl > div:nth-child(1)',
    'Stat · Получено бонусов': 'main dl > div:nth-child(2)',
    'Account Information': 'section[aria-labelledby="profile-account-title"]',
    'Ticket List Item': 'section[aria-labelledby="support-tickets-title"] ul > li > a',
    'Step 1': 'section[aria-labelledby="connection-instructions-title"] details',
    'Ты Message': 'ol[aria-label="Переписка с поддержкой"] > li:nth-child(1) article',
    'Поддержка Message': 'ol[aria-label="Переписка с поддержкой"] > li:nth-child(2) article',
    'Dashboard Connection Link': 'section[aria-labelledby="dashboard-connection-title"] div.flex:has(> button[aria-label="Скопировать ссылку"])',
    'Connection Subscription Link': 'main div.flex:has(> button[aria-label="Скопировать ссылку"])',
    'Referral Link Field': 'section[aria-labelledby="referral-link-title"] div.flex:has(> button[aria-label="Скопировать приглашение"])',
}
const rgb = hex => `rgb(${hex.slice(1).match(/../g).map(channel => parseInt(channel, 16)).join(', ')})`
const padding = value => {
    if (typeof value === 'number') return [value, value, value, value]
    if (value.length === 2) return [value[0], value[1], value[0], value[1]]
    return value
}

for (const source of frames) {
    test(`Pen surfaces ${source.id} ${source.name}`, async ({ page, request }, info) => {
        const frame = penFrames.find(frame => frame.id === source.id)
        expect(frame, 'Source frame must map to an existing route/state').toBeTruthy()
        page.on('pageerror', error => { throw error })
        await page.setViewportSize({ width: frame.width, height: frame.viewportHeight })
        await page.emulateMedia({ colorScheme: frame.theme })
        await penFixture(page, request, frame)
        const measurements = []
        for (const role of source.roles) {
            const target = page.locator(selectors[role.name]).first()
            await expect(target).toBeVisible()
            const actual = await target.evaluate(element => {
                const css = getComputedStyle(element)
                return {
                    width: element.getBoundingClientRect().width,
                    padding: [css.paddingTop, css.paddingRight, css.paddingBottom, css.paddingLeft].map(parseFloat),
                    radii: [css.borderTopLeftRadius, css.borderTopRightRadius, css.borderBottomRightRadius, css.borderBottomLeftRadius].map(parseFloat),
                    gap: parseFloat(css.rowGap), fill: css.backgroundColor,
                    stroke: css.borderTopColor, strokeWidth: parseFloat(css.borderTopWidth),
                }
            })
            measurements.push({ source: role.id, name: role.name, actual })
            await test.step(`${role.name} vs ${role.id}`, async () => {
                expect.soft(actual.fill, `fill ${role.id}`).toBe(rgb(role.fill))
                // Owner correction: subscription and referral previews are now
                // actual readonly fields and use the accessible field boundary.
                const connectionField = ['Dashboard Connection Link', 'Connection Subscription Link', 'Referral Link Field'].includes(role.name)
                const stroke = connectionField ? (frame.theme === 'light' ? '#92887D' : '#707892') : role.stroke
                expect.soft(actual.stroke, `stroke ${role.id}`).toBe(rgb(stroke))
                expect.soft(actual.strokeWidth, `strokeWidth ${role.id}`).toBe(role.strokeWidth)
                expect.soft(actual.radii, `radii ${role.id}`).toEqual(Array(4).fill(role.radius))
                expect.soft(actual.padding, `padding ${role.id}`).toEqual(padding(role.padding))
                // Pen's parent stroke overlays its content box. CSS borders
                // consume 1px per side in the two enclosing card surfaces.
                const borderInset = ['Dashboard Connection Link', 'Referral Link Field'].includes(role.name) ? 2 : 0
                expect.soft(Math.abs(actual.width - (role.width - borderInset)), `width ${role.id}`).toBeLessThanOrEqual(1)
                // Pen Step's gap belongs to its horizontal summary. The HTML
                // details owns the surface; summary owns its internal row gap.
                if (role.name !== 'Step 1' && role.gap !== undefined) expect.soft(actual.gap, `gap ${role.id}`).toBe(role.gap)
            })
        }
        await info.attach('surface-measurements', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' })
    })
}
