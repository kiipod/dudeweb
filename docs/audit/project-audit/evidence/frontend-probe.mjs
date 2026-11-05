// Read-only diagnostic: real UI bundle, synthetic account props/transport.
// Run: ./vendor/bin/sail node docs/audit/project-audit/evidence/frontend-probe.mjs
import { chromium, request, expect } from '@playwright/test'
import { accountFixture } from '../../../../tests/Browser/helpers/accountDashboard.js'
import { writeFile, readdir, readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1'
const browser = await chromium.launch({ headless: true })
const api = await request.newContext({ baseURL })
const results = { baseURL, scenarios: [] }
try {
    const routes = JSON.parse(execFileSync('php', ['artisan', 'route:list', '--json'], { encoding: 'utf8' }))
    const paths = new Set()
    async function inspect(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = `${directory}/${entry.name}`
            if (entry.isDirectory()) await inspect(path)
            else if (/\.(js|vue)$/.test(entry.name)) {
                const source = await readFile(path, 'utf8')
                for (const match of source.matchAll(/(?:\bhref=["']|\bhref:\s*["'])(\/[^"'{}]*)["']/g)) paths.add(match[1])
            }
        }
    }
    await inspect('resources/js')
    const missingRoutes = [...paths].filter(path => !routes.some(route => route.method.includes('GET') && `/${route.uri}` === path))
    results.scenarios.push({ name: 'static-internal-links', paths: [...paths].sort(), missing: missingRoutes })
    for (const failure of ['http', 'network', 'unauthorized', 'forbidden']) {
        const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } })
        const page = await context.newPage()
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        const server = await accountFixture(page, api, {
            errors: {},
            user: { username: 'audit_user', email: 'audit@example.test' },
            telegramConnection: { connected: false, available: true, link: { id: 13, state: 'awaiting_telegram' } },
            securityCapabilities: { password: true, changeEmail: true },
            themePreference: { storage: 'local', choices: ['light', 'dark'] },
        }, { component: 'Account/Profile', url: '/account/profile', title: 'Мой профиль' })
        let handled
        const response = new Promise(resolve => { handled = resolve })
        server.reload = async route => {
            if (failure === 'network') await route.abort('failed')
            else await route.fulfill({ status: { http: 503, unauthorized: 401, forbidden: 403 }[failure], body: 'Audit fixture: unavailable' })
            handled()
        }
        await page.getByRole('button', { name: 'Проверить привязку', exact: true }).click()
        await response
        await expect(page.getByRole('button', { name: 'Проверить привязку', exact: true })).toBeEnabled()
        results.scenarios.push({ name: `telegram-refresh-${failure}`, inlineAlerts: await page.getByRole('alert').allTextContents(), dialogs: await page.getByRole('dialog').count(), errors })
        await context.close()
    }
    // Exercise native history and route errors without account mutations.
    const context = await browser.newContext({ baseURL })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/login')
    await page.getByRole('link', { name: 'Создать аккаунт', exact: true }).click()
    await expect(page).toHaveURL(/\/register$/)
    await page.goBack()
    await expect(page).toHaveURL(/\/login$/)
    await page.goForward()
    await expect(page).toHaveURL(/\/register$/)
    const guest = await api.get('/account', { maxRedirects: 0 })
    const missing = await api.get('/audit-nonexistent-page', { maxRedirects: 0 })
    results.scenarios.push({ name: 'navigation', history: 'passed', guestStatus: guest.status(), guestLocation: guest.headers().location, missingStatus: missing.status(), errors })
    await context.close()
    await writeFile(new URL('./frontend-probe.json', import.meta.url), JSON.stringify(results, null, 2) + '\n')
    console.log(JSON.stringify(results, null, 2))
} finally {
    await api.dispose()
    await browser.close()
}
