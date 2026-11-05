import { readFile } from 'node:fs/promises'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

async function loadComponent(relativePath) {
    const filename = new URL(`../../resources/js/${relativePath}`, import.meta.url)
    const { descriptor } = parse(await readFile(filename, 'utf8'))
    const id = `foundation-${relativePath}`
    let source
    if (descriptor.scriptSetup) {
        source = compileScript(descriptor, { id, inlineTemplate: true }).content
    } else {
        const result = compileTemplate({ id, filename: filename.pathname, source: descriptor.template.content, ssr: true, ssrCssVars: descriptor.cssVars })
        if (result.errors.length) throw new Error(result.errors.join('\n'))
        source = result.code.replace('export function ssrRender', 'function ssrRender') + '\nexport default { ssrRender }'
    }
    source = source.replace(/from (['"])(vue(?:\/server-renderer)?)\1/g, (_, quote, dependency) => `from ${JSON.stringify(import.meta.resolve(dependency))}`)
    return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default
}

export const LandingV2Layout = await loadComponent('layouts/LandingV2Layout.vue')
export const LandingV2Section = await loadComponent('components/landing-v2/LandingV2Section.vue')
export const sectionVariants = ['hero', 'platforms', 'connection', 'news', 'subscription', 'footer']

export function renderSections() {
    return renderToString(createSSRApp({
        render: () => h('div', {}, sectionVariants.map(variant => h(LandingV2Section, {
            variant,
            'data-foundation-section': variant,
        }, { default: () => h('p', variant) }))),
    }))
}
