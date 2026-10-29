import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { build } from 'vite'

const prefix = '/__signal-orbit-fixture/'
const output = resolve('storage/app/pen-step15/signal-orbit-build')

// Compile the real application with one caller-side prop. Never mutate a Vue
// instance's private props or substitute a child stub for the browser check.
export async function buildExplicitSignalOrbit() {
    let replacements = 0
    await build({
        configFile: resolve('vite.config.js'),
        base: prefix,
        logLevel: 'error',
        plugins: [{
            name: 'explicit-signal-orbit-fixture',
            enforce: 'pre',
            transform(source, id) {
                if (id !== resolve('resources/js/pages/Public/Home.vue')) return
                const invocation = '<LandingHero />'
                if (source.split(invocation).length !== 2) throw new Error('Expected exactly one default Home Hero invocation')
                replacements++
                return source.replace(invocation, '<LandingHero variant="signal-orbit" />')
            },
        }],
        build: { outDir: output, emptyOutDir: true, manifest: 'manifest.json' },
    })
    if (replacements !== 1) throw new Error(`Expected one explicit Hero caller, got ${replacements}`)
    return JSON.parse(await readFile(resolve(output, 'manifest.json'), 'utf8'))['resources/js/app.js']
}

export async function explicitSignalOrbit(page, request, entry) {
    const response = await request.get('/')
    if (!response.ok()) throw new Error(`Home document returned ${response.status()}`)
    let html = await response.text()
    const script = /<script\b[^>]*type="module"[^>]*src="[^"]*\/build\/[^\"]+"[^>]*><\/script>/g
    if ([...html.matchAll(script)].length !== 1) throw new Error('Expected one production application entry')
    html = html.replace(/<link\b[^>]*(?:rel="(?:modulepreload|stylesheet)")[^>]*href="[^"]*\/build\/[^\"]+"[^>]*\/?\s*>/g, '')
        .replace(script, `${entry.css.map(file => `<link rel="stylesheet" href="${prefix}${file}">`).join('')}<script type="module" src="${prefix}${entry.file}"></script>`)
    await page.route(`**${prefix}**`, async route => {
        const file = resolve(output, decodeURIComponent(new URL(route.request().url()).pathname.slice(prefix.length)))
        if (!file.startsWith(output + sep)) throw new Error('Fixture asset outside build directory')
        const contentType = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'font/woff2'
        await route.fulfill({ body: await readFile(file), contentType })
    })
    await page.route('**/', route => route.request().isNavigationRequest()
        ? route.fulfill({ body: html, contentType: 'text/html' }) : route.fallback())
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
}
