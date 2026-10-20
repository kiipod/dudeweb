import { expect } from '@playwright/test'

export function dashboardProps(state = 'active', count = 2) {
    return {
        errors: {},
        user: { displayName: 'Алексей' },
        subscription: state === 'service_error' ? null : {
            state,
            planName: state === 'trial' ? 'Пробный доступ' : 'Безлимитный',
            expiresAt: ({ trial: '2026-11-05T12:00:00Z', expiring: '2026-11-04T12:00:00Z', expired: '2026-11-01T12:00:00Z' })[state] ?? '2026-11-20T12:00:00Z',
            expiresOn: ({ trial: '5 ноября 2026', expiring: '4 ноября 2026', expired: '1 ноября 2026' })[state] ?? '20 ноября 2026',
            remainingDays: state === 'expired' ? 0 : state === 'trial' ? 3 : state === 'expiring' ? 2 : 18,
            url: 'https://sub.example.test/owned-test-link?signature=fixture',
        },
        devicesSummary: state === 'service_error' ? null : { count, limit: 5 },
        serviceState: state === 'service_error' ? 'service_error' : 'ready',
        provisioningRequired: false,
    }
}

// Reuse the real Blade/Vite document and current app bundle; only Inertia data
// and account transport are replaced inside this browser context.
export async function accountFixture(page, request, props = dashboardProps()) {
    const response = await request.get('/login')
    expect(response.status()).toBe(200)
    const html = await response.text()
    const pattern = /(<script\b[^>]*\bdata-page="app"[^>]*>)([\s\S]*?)(<\/script>)/
    const match = html.match(pattern)
    if (!match) throw new Error('Expected the Inertia 3 JSON page script in the real login document')
    const loginPage = JSON.parse(match[2])
    const server = {
        props,
        reloadCount: 0,
        reload: null,
        page: () => ({ ...loginPage, component: 'Account/Dashboard', url: '/account', props: server.props, encryptHistory: false, clearHistory: false }),
        loginPage,
    }
    await page.route('**/account', async route => {
        if (route.request().isNavigationRequest()) {
            const json = JSON.stringify(server.page()).replace(/</g, '\\u003c')
            await route.fulfill({ status: 200, contentType: 'text/html', body: html.replace(pattern, (_, start, body, end) => start + json + end) })
        } else {
            server.reloadCount++
            if (server.reload) await server.reload(route)
            else await inertiaResponse(route, server.page())
        }
    })
    await page.goto('/account')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Привет, Алексей 👋')
    await page.evaluate(() => document.fonts.ready)
    return server
}

export async function inertiaResponse(route, page) {
    await route.fulfill({ status: 200, headers: { 'X-Inertia': 'true', 'Content-Type': 'application/json' }, body: JSON.stringify(page) })
}

export async function screenshot(page, testInfo, name, { fullPage = true } = {}) {
    const path = testInfo.outputPath(`${name}.png`)
    await page.screenshot({ path, fullPage })
    await testInfo.attach(name, { path, contentType: 'image/png' })
}

export async function expectLayout(page) {
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
}
