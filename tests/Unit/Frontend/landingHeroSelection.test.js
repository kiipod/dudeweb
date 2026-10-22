import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

const { descriptor } = parse(await readFile(new URL('../../../resources/js/components/public/LandingHero.vue', import.meta.url), 'utf8'))
const vue = JSON.stringify(import.meta.resolve('vue'))
const source = `import { h as testH } from ${vue};\n` + compileScript(descriptor, { id: 'hero-selection', inlineTemplate: true }).content
    .replace(/from (['"])vue\1/g, `from ${vue}`)
    .replace("import ServiceCloudHero from './hero/ServiceCloudHero.vue'", "const ServiceCloudHero = { render: () => testH('section', { 'data-hero': 'services' }) }")
    .replace("import SignalOrbitHero from './hero/SignalOrbitHero.vue'", "const SignalOrbitHero = { render: () => testH('section', { 'data-hero': 'signal-orbit' }) }")
const LandingHero = (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default

test('default Hero selects Service Cloud', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(LandingHero) }))
    assert.match(html, /data-hero="services"/)
    assert.doesNotMatch(html, /data-hero="signal-orbit"/)
})

test('explicit signal-orbit variant bypasses Service Cloud', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(LandingHero, { variant: 'signal-orbit' }) }))
    assert.match(html, /data-hero="signal-orbit"/)
    assert.doesNotMatch(html, /data-hero="services"/)
})
