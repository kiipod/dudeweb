import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { SERVICE_LOGOS, orbitOpacityAt, projectServiceLogos, serviceLogoUrl } from '../../../resources/js/utils/serviceCloudGeometry.js'
import { createServiceCloudRenderer, loadServiceLogos } from '../../../resources/js/utils/serviceCloudRenderer.js'

const scene = { width: 580, height: 620, time: 0, orbit: false, staticMotion: false, rotation: [0, 0] }

function svgRoot() {
    const document = { createElementNS: (namespace, tag) => {
        assert.equal(namespace, 'http://www.w3.org/2000/svg')
        return {
            tag, attributes: {}, children: [], ownerDocument: document,
            setAttribute(name, value) { this.attributes[name] = String(value) },
            removeAttribute(name) { delete this.attributes[name] },
            append(...children) { children.forEach(child => { child.parent = this; this.children.push(child) }) },
            remove() { this.parent.children = this.parent.children.filter(child => child !== this) },
        }
    } }
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg')
}

test('every service has two local vector assets matching their recorded hashes and Pen colors', async () => {
    const base = new URL('../../../public/images/hero/services/', import.meta.url)
    const manifest = JSON.parse(await readFile(new URL('manifest.json', base), 'utf8'))
    assert.equal(manifest.assets.length, 46)
    for (const name of SERVICE_LOGOS) {
        for (const theme of ['light', 'dark']) {
            const path = `brands/${name}-${theme}.svg`
            const entry = manifest.assets.find(asset => asset.path === path)
            assert.ok(entry, path)
            const bytes = await readFile(new URL(path, base))
            const svg = bytes.toString('utf8')
            assert.equal(bytes.length, entry.bytes, path)
            assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, path)
            assert.match(svg, /<svg\b[^>]*viewBox="0 0 24 24"/, path)
            assert.match(svg, /<path\b[^>]*d="[^"]+"/, path)
            assert.ok(svg.includes(`fill="${entry.color}"`), path)
            assert.doesNotMatch(svg, /<(?:image|script|foreignObject)\b|data:|\.png\b/i, path)
            assert.equal(serviceLogoUrl(name, theme), `/images/hero/services/${path}`)
        }
    }
})

test('projection keeps the original atlas footprint, Fibonacci placement, depth and static pose', () => {
    const logos = projectServiceLogos(scene)
    assert.equal(logos.length, 23)
    const first = logos[0]
    const vertical = 1 - 1 / 23
    const horizontal = Math.sqrt(1 - vertical * vertical)
    assert.equal(first.name, 'instagram')
    assert.ok(Math.abs(first.size - 580 * 0.17 * 88 / 128) < 1e-9)
    assert.ok(Math.abs(first.x + first.size / 2 - (290 + horizontal * 580 * 0.37)) < 1e-9)
    assert.ok(Math.abs(first.y + first.size / 2 - (310 + vertical * 580 * 0.37)) < 1e-9)
    assert.equal(first.opacity, 0.69)
    const rotated = projectServiceLogos({ ...scene, rotation: [0.4, 1.2] })
    assert.notDeepEqual(rotated, logos)
    assert.ok(rotated.every(logo => logo.opacity >= 0.38 && logo.opacity <= 1 && logo.size > 0))
    assert.deepEqual(projectServiceLogos({ ...scene, time: 45, rotation: [0.4, 1.2], staticMotion: true }), logos)
})

test('orbits retain the three Pen radii, reverse the middle ring and freeze time for reduced motion', () => {
    for (const width of [360, 390, 768]) {
        const orbit = { ...scene, width, height: 800, orbit: true }
        const initial = projectServiceLogos(orbit)
        const later = projectServiceLogos({ ...orbit, time: 0.1 })
        initial.forEach((logo, index) => {
            const dx = logo.x + logo.size / 2 - width / 2
            const dy = logo.y + logo.size / 2 - 400
            assert.ok(Math.abs(Math.hypot(dx, dy) - width * (0.34 + index % 3 * 0.18)) < 1e-9)
            const next = later[index]
            const cross = dx * (next.y + next.size / 2 - 400) - dy * (next.x + next.size / 2 - width / 2)
            assert.equal(Math.sign(cross), index % 3 === 1 ? -1 : 1)
        })
        assert.deepEqual(projectServiceLogos({ ...orbit, time: 45, staticMotion: true }), initial)
        assert.equal(orbitOpacityAt(width / 2, 400, width, 800), 0.20)
        assert.ok(Math.abs(orbitOpacityAt(width * 2, 400, width, 800) - 0.85) < 1e-9)
    }
})

test('SVG renderer uses vector URLs, preserves identity across frames and cleans up its own nodes', () => {
    const root = svgRoot()
    const renderer = createServiceCloudRenderer(root)
    const [defs, group] = root.children
    const images = [...group.children]
    renderer.setTheme('light')
    renderer.resize(580, 620)
    renderer.draw(scene)
    assert.equal(root.attributes.viewBox, '0 0 580 620')
    assert.equal(images.length, 23)
    assert.equal(images[0].attributes.href, serviceLogoUrl('instagram', 'light'))
    const initial = { ...images[0].attributes }
    renderer.draw({ ...scene, rotation: [1, 2] })
    assert.notEqual(images[0].attributes.x, initial.x)
    assert.deepEqual(group.children, images)
    renderer.draw({ ...scene, staticMotion: true, rotation: [1, 2] })
    assert.deepEqual(images[0].attributes, initial)
    renderer.setTheme('dark')
    images.forEach((image, index) => assert.equal(image.attributes.href, serviceLogoUrl(SERVICE_LOGOS[index], 'dark')))
    renderer.resize(390, 560)
    renderer.draw({ ...scene, orbit: true })
    assert.ok(group.attributes.mask)
    assert.equal(defs.children[1].attributes.width, '390')
    assert.equal(defs.children[0].children[0].attributes['stop-opacity'], '0.2')
    assert.ok(Math.abs(Number(defs.children[0].children.at(-1).attributes['stop-opacity']) - 0.85) < 1e-9)
    const other = svgRoot()
    const second = createServiceCloudRenderer(other)
    assert.notEqual(other.children[0].children[0].attributes.id, defs.children[0].attributes.id)
    renderer.destroy()
    renderer.destroy()
    renderer.draw(scene)
    assert.equal(root.children.length, 0)
    second.destroy()
})

test('preloading checks every SVG and rejects a missing service before starting the cloud', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'Image')
    const requests = []
    let fail = false
    globalThis.Image = class {
        set src(url) {
            requests.push(url)
            queueMicrotask(() => fail && url.includes('/signal-') ? this.onerror() : this.onload())
        }
    }
    try {
        assert.equal((await loadServiceLogos('light')).length, 23)
        assert.deepEqual(requests, SERVICE_LOGOS.map(name => serviceLogoUrl(name, 'light')))
        fail = true
        await assert.rejects(loadServiceLogos('dark'), /signal is unavailable/)
    } finally {
        if (original) Object.defineProperty(globalThis, 'Image', original)
        else delete globalThis.Image
    }
})
