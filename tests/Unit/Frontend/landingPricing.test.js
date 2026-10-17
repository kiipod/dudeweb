import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createRenderer, h, nextTick } from 'vue'

// Exercise the real SFC template and reactivity; navigation and icons have no pricing behavior.
const filename = new URL('../../../resources/js/components/public/LandingPricing.vue', import.meta.url)
const { descriptor } = parse(await readFile(filename, 'utf8'))
const compiled = compileScript(descriptor, { id: 'landing-pricing-test', inlineTemplate: true }).content
    .replace("import { Link } from '@inertiajs/vue3'", "const Link = (props, { slots }) => testH('a', props, slots.default?.())")
    .replace("import UiIcon from '@/components/ui/UiIcon.vue'", 'const UiIcon = () => null')
    .replace(/from (['"])vue\1/g, `from ${JSON.stringify(import.meta.resolve('vue'))}`)
const moduleSource = `import { h as testH } from ${JSON.stringify(import.meta.resolve('vue'))};\n${compiled}`
const { default: LandingPricing } = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`)

function mountPricing(t, props) {
    const node = (type, text = '') => ({ type, text, props: {}, children: [], parent: null })
    const remove = child => {
        if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
        child.parent = null
    }
    const renderer = createRenderer({
        createElement: type => node(type),
        createText: text => node('#text', text),
        createComment: text => node('#comment', text),
        insert(child, parent, anchor = null) {
            remove(child)
            const index = anchor ? parent.children.indexOf(anchor) : parent.children.length
            parent.children.splice(index, 0, child)
            child.parent = parent
        },
        remove,
        setText: (element, text) => { element.text = text },
        setElementText: (element, text) => { element.text = text; element.children = [] },
        parentNode: element => element.parent,
        nextSibling: element => element.parent?.children[element.parent.children.indexOf(element) + 1] ?? null,
        patchProp: (element, key, previous, value) => { element.props[key] = value },
    })
    const root = node('root')
    const update = nextProps => renderer.render(h(LandingPricing, nextProps), root)
    update(props)
    t.after(() => renderer.render(null, root))
    return { root, update }
}

function elements(root) {
    return [root, ...root.children.flatMap(elements)]
}

function text(root) {
    return (root.type === '#comment' ? '' : root.text) + root.children.map(text).join('')
}

function displayedPrice(root) {
    const prices = elements(root).filter(element => element.props['aria-live'] === 'polite')
    assert.equal(prices.length, 1, 'only the price above the period selector is announced')
    return text(prices[0]).replace(/\s+/g, ' ').trim()
}

function plan() {
    return {
        id: 1,
        name: 'Безлимитный',
        advantages: ['Безлимитный трафик'],
        products: [
            { id: 11, months: 1, priceMinor: 20_000, currency: 'RUB' },
            { id: 12, months: 3, priceMinor: 60_000, currency: 'RUB' },
            { id: 13, months: 6, priceMinor: 100_000, currency: 'RUB' },
            { id: 14, months: 12, priceMinor: 200_000, currency: 'RUB' },
        ],
    }
}

test('period selection updates the full price above the selector without a second total', async t => {
    const { root } = mountPricing(t, { plans: [plan()], state: 'ready' })
    assert.equal(displayedPrice(root), '200 ₽ / 1 мес.')
    const all = elements(root)
    assert.ok(all.indexOf(all.find(element => element.props['aria-live'])) < all.indexOf(all.find(element => element.type === 'fieldset')))

    for (const [id, price] of [[12, '600 ₽ / 3 мес.'], [13, '1 000 ₽ / 6 мес.'], [14, '2 000 ₽ / 12 мес.'], [11, '200 ₽ / 1 мес.']]) {
        const radios = elements(root).filter(element => element.type === 'input')
        radios.find(element => element.props.value === id).props.onChange()
        await nextTick()
        assert.equal(displayedPrice(root), price)
        assert.deepEqual(radios.filter(element => element.props.checked).map(element => element.props.value), [id])
        assert.doesNotMatch(text(root), /Итого/)
    }
})

test('full period price preserves server minor units including kopecks', async t => {
    const tariff = plan()
    tariff.products[1].priceMinor = 199_099
    const { root } = mountPricing(t, { plans: [tariff], state: 'ready' })
    elements(root).find(element => element.type === 'input' && element.props.value === 12).props.onChange()
    await nextTick()
    assert.equal(displayedPrice(root), '1 990,99 ₽ / 3 мес.')
})

test('replaced server products reset an unavailable selection to the first current product', async t => {
    const { root, update } = mountPricing(t, { plans: [plan()], state: 'ready' })
    elements(root).find(element => element.type === 'input' && element.props.value === 14).props.onChange()
    await nextTick()
    const replacement = plan()
    replacement.products = [{ id: 91, months: 3, priceMinor: 75_000, currency: 'RUB' }]
    update({ plans: [replacement], state: 'ready' })
    await nextTick()
    assert.equal(displayedPrice(root), '750 ₽ / 3 мес.')
    assert.equal(elements(root).find(element => element.type === 'input').props.checked, true)
})

for (const state of ['empty', 'unavailable']) {
    test(`${state} state keeps the status message without prices or period controls`, t => {
        const { root } = mountPricing(t, { plans: [], state })
        assert.ok(elements(root).some(element => element.props.role === 'status'))
        assert.equal(elements(root).filter(element => element.type === 'input' || element.props['aria-live']).length, 0)
        assert.doesNotMatch(text(root), /Итого|₽/)
    })
}
