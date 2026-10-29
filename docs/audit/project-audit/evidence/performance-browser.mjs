// Local diagnostic only; no writes to application endpoints.
import { chromium } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
const manifest = JSON.parse(await readFile('public/build/manifest.json', 'utf8'))
const entry = manifest['resources/js/app.js']
const assets = []
for (const file of [entry.file, ...(entry.css || [])]) {
    const data = await readFile(`public/build/${file}`)
    assets.push({ file, bytes: data.length, gzipBytes: gzipSync(data).length })
}
const browser = await chromium.launch({ headless: true })
const output = { conditions: { baseURL: 'http://127.0.0.1', network: 'local, no throttling', cpu: 'no throttling', cache: 'fresh context per sample', ssr: 'current server configuration', samplesPerRouteAndViewport: 3 }, assets, dynamicImports: entry.dynamicImports || [], samples: [] }
try {
for (const width of [390, 1440]) for (const path of ['/', '/login']) for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, locale: 'ru-RU', reducedMotion: 'no-preference' })
    const page = await context.newPage()
    await page.addInitScript(() => {
        window.audit = { lcp: null, cls: 0, longTasks: [], interactions: [] }
        for (const [type, callback] of [
            ['largest-contentful-paint', e => { window.audit.lcp = e.startTime }],
            ['layout-shift', e => { if (!e.hadRecentInput) window.audit.cls += e.value }],
            ['longtask', e => window.audit.longTasks.push(e.duration)],
            ['event', e => { if (e.interactionId) window.audit.interactions.push(e.duration) }],
        ]) {
            if (PerformanceObserver.supportedEntryTypes.includes(type)) new PerformanceObserver(list => list.getEntries().forEach(callback)).observe({ type, buffered: true, ...(type === 'event' ? { durationThreshold: 16 } : {}) })
        }
    })
    await page.coverage.startJSCoverage()
    const response = await page.goto(`http://127.0.0.1${path}`)
    await page.locator('h1').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(600)
    if (path === '/login') await page.locator('input[type="email"]').fill('audit@example.test')
    const scroll = await page.evaluate(async () => {
        const frames = []; let last = performance.now()
        for (let i = 0; i < 45; i++) { await new Promise(requestAnimationFrame); const t = performance.now(); frames.push(t-last); last=t; window.scrollBy(0, 35) }
        return { frameIntervalsMs: frames, maxMs: Math.max(...frames) }
    })
    await page.waitForTimeout(100)
    const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0]
        return { ...window.audit, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null, ttfb: nav.responseStart-nav.startTime, domContentLoaded: nav.domContentLoadedEventEnd, jsHeapBytes: performance.memory?.usedJSHeapSize ?? null, fonts: performance.getEntriesByType('resource').filter(r=>/\.woff/.test(r.name)).map(r=>({file:r.name.split('/').pop(),transferSize:r.transferSize})), resources: performance.getEntriesByType('resource').map(r=>({file:r.name.split('/').pop(),type:r.initiatorType,transferSize:r.transferSize})), images:[...document.images].map(i=>({loading:i.loading,width:i.width,height:i.height,complete:i.complete})), ssr: Boolean(document.querySelector('[data-server-rendered="true"]')) }
    })
    const coverage = await page.coverage.stopJSCoverage()
    const jsCoverage = coverage.filter(c=>c.url.includes('/build/')).map(c=>({file:c.url.split('/').pop(),sourceBytes:Buffer.byteLength(c.source || ''),functions:c.functions.length,unexecutedFunctions:c.functions.filter(f=>f.ranges[0]?.count===0).length}))
    output.samples.push({path,width,run,status:response.status(),...metrics,scroll,jsCoverage})
    await context.close()
}
} finally { await browser.close() }
await writeFile('docs/audit/project-audit/evidence/performance-browser.json',JSON.stringify(output,null,2)+'\n')
console.log(JSON.stringify({assets,dynamicImports:output.dynamicImports,samples:output.samples.map(({path,width,run,status,lcp,cls,fcp,ttfb,interactions,jsCoverage})=>({path,width,run,status,lcp,cls,fcp,ttfb,interactions,jsCoverage}))},null,2))
