// Local read-only metadata probe. Never emits bodies or cookie values.
import { request } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1'
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(baseURL).hostname)) throw new Error('Local target required')
const api = await request.newContext({ baseURL, maxRedirects: 0 })
const result = []
try {
    for (const path of ['/login', '/admin', '/log-viewer', '/.env', '/.git/config', '/composer.json', '/storage/logs/laravel.log', '/%2e%2e/.env']) {
        const response = await api.get(path)
        const headers = response.headers()
        result.push({ path, status: response.status(), headers: Object.fromEntries([
            'x-frame-options', 'content-security-policy', 'x-content-type-options',
            'strict-transport-security', 'referrer-policy', 'access-control-allow-origin',
        ].map(name => [name, headers[name] ?? null])) })
    }
    result.push({ cookies: (await api.storageState()).cookies.map(cookie => ({
        name: cookie.name, httpOnly: cookie.httpOnly, secure: cookie.secure, sameSite: cookie.sameSite,
    })) })
    await writeFile(new URL('./security-http-probe.json', import.meta.url), JSON.stringify(result, null, 2) + '\n')
    console.log(JSON.stringify(result, null, 2))
} finally { await api.dispose() }
