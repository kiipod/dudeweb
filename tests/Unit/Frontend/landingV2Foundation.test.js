import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { LandingV2Layout, LandingV2Section } from '../../helpers/landingV2Foundation.js'

test('V2 layout renders its content and optional shell slots on the server without browser state', async () => {
    const html = await renderToString(createSSRApp({
        render: () => h(LandingV2Layout, {}, {
            header: () => h('header', 'header fixture'),
            default: () => h(LandingV2Section, {}, { default: () => h('h1', 'dudeweb') }),
            footer: () => h('footer', 'footer fixture'),
        }),
    }))
    assert.equal(typeof window, 'undefined')
    assert.equal((html.match(/<main\b/g) ?? []).length, 1)
    assert.match(html, /data-landing-v2/)
    assert.match(html, /bg-v2-page/)
    assert.match(html, /<header>header fixture<\/header>[\s\S]*<main[\s\S]*<h1>dudeweb<\/h1>[\s\S]*<\/main>[\s\S]*<footer>footer fixture<\/footer>/)
})

test('V2 layout does not create empty header or footer wrappers when slots are absent', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(LandingV2Layout, {}, { default: () => 'content' }) }))
    assert.doesNotMatch(html, /<header|<footer/)
    assert.match(html, /id="landing-v2-content"/)
    assert.match(html, /content/)
})
