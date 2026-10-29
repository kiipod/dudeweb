// Container health: artifacts + renderer. With an explicit base URL, also check
// real public Laravel HTML; never log response bodies or Inertia props.
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'

try {
    const root = resolve(import.meta.dirname, '..')
    await access(resolve(root, 'bootstrap/ssr/ssr.js'))
    await access(resolve(root, 'public/build/manifest.json'))
    const hot = await access(resolve(root, 'public/hot')).then(() => true, () => false)
    if (hot) throw new Error('public/hot exists: production must use built assets')

    const port = Number(process.env.INERTIA_SSR_PORT || 13714)
    const health = await fetch(`http://127.0.0.1:${port}/health`, {
        signal: AbortSignal.timeout(3000),
    })
    if (!health.ok || (await health.json()).status !== 'OK') {
        throw new Error('SSR renderer health check failed')
    }

    if (process.argv[2]) {
        const base = new URL(process.argv[2])
        if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) {
            throw new Error('Base URL must be HTTP(S) without credentials')
        }
        for (const path of ['/', '/login', '/register', '/forgot-password']) {
            const response = await fetch(new URL(path, base), {
                headers: { Accept: 'text/html' },
                redirect: 'error',
                signal: AbortSignal.timeout(10000),
            })
            const html = await response.text()
            if (response.status !== 200 || !html.includes('data-server-rendered="true"') || !/<h1\b/.test(html)) {
                throw new Error(`SSR HTML check failed for ${path} (HTTP ${response.status})`)
            }
            console.log(`SSR HTML OK: ${path}`)
        }
    }
    console.log('SSR renderer and build artifacts OK')
} catch (error) {
    // Fetch errors may include URLs; only controlled diagnostics above are printed.
    console.error(error instanceof TypeError ? 'SSR connection or response check failed' : error.message)
    process.exitCode = 1
}
