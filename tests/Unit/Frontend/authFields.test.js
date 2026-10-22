import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createRenderer, createSSRApp, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'

async function component(path, replacements = []) {
    const filename = new URL(`../../../resources/js/${path}`, import.meta.url)
    const { descriptor } = parse(await readFile(filename, 'utf8'))
    let source = compileScript(descriptor, { id: path, inlineTemplate: true }).content
        .replace(/import UiIcon from ['"][^'"]+['"]/g, 'const UiIcon = () => null')
        .replace(/from (['"])vue\1/g, `from ${JSON.stringify(import.meta.resolve('vue'))}`)
    for (const [from, to] of replacements) source = source.replace(from, to)
    source = `import { h as testH } from ${JSON.stringify(import.meta.resolve('vue'))};\n${source}`
    return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default
}

const BaseField = await component('components/ui/BaseField.vue')
const BaseButton = await component('components/ui/BaseButton.vue')
const BaseSelect = await component('components/ui/BaseSelect.vue', [[
    "from '@/composables/useSelect'",
    `from '${new URL('../../../resources/js/composables/useSelect.js', import.meta.url).href}'`,
]])
const UiIcon = await component('components/ui/UiIcon.vue', [[
    "from '@/utils/landingIconPaths'",
    `from '${new URL('../../../resources/js/utils/landingIconPaths.js', import.meta.url).href}'`,
]])
const PasswordField = await component('components/auth/PasswordField.vue', [[
    "import BaseField from '@/components/ui/BaseField.vue'",
    "const BaseField = { props: ['id', 'type', 'disabled', 'modelValue'], setup: (props, { slots }) => () => testH('div', null, [testH('input', { id: props.id, type: props.type, disabled: props.disabled }), slots.suffix?.()]) }",
]])

test('auth icons accept their registered names without Vue validation warnings', async () => {
    const warnings = []
    const app = createSSRApp({ render: () => h('div', ['mail', 'lock', 'eye', 'eyeOff', 'mail-check', 'clock-3'].map(name => h(UiIcon, { name }))) })
    app.config.warnHandler = message => warnings.push(message)
    const html = await renderToString(app)
    assert.equal((html.match(/<svg/g) ?? []).length, 6)
    assert.deepEqual(warnings, [])
})

test('auth field associates label and errors and escapes server error text', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(BaseField, { id: 'email', label: 'Email', variant: 'auth', type: 'email', autocomplete: 'email', error: '<script>bad</script>' }) }))
    assert.match(html, /for="email"/)
    assert.match(html, /id="email"/)
    assert.match(html, /aria-describedby="email-error"/)
    assert.match(html, /aria-invalid="true"/)
    assert.match(html, /autocomplete="email"/)
    assert.match(html, /id="email-error"/)
    assert.match(html, /aria-live="polite"/)
    assert.match(html, /&lt;script&gt;/)
    assert.doesNotMatch(html, /<script>/)
})

test('hint association changes to an error association and disabled fields stay native disabled', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(BaseField, { id: 'password', label: 'Пароль', hint: 'Подсказка', disabled: true }) }))
    assert.match(html, /aria-describedby="password-hint"/)
    assert.match(html, /aria-invalid="false"/)
    assert.match(html, /<input[^>]+disabled/)
    assert.doesNotMatch(html, /password-error/)
})

test('loading submit is native disabled and replaces the action with its progress label', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(BaseButton, { type: 'submit', label: 'Войти', loadingLabel: 'Входим…', loading: true }) }))
    assert.match(html, /type="submit"/)
    assert.match(html, /aria-busy="true"/)
    assert.match(html, /<button[^>]+disabled/)
    assert.match(html, /Входим…/)
    assert.doesNotMatch(html, />Войти</)
})

test('navigation action keeps native URL and external target with button presentation', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(BaseButton, { href: 'https://downloads.example.test/app', target: '_blank', rel: 'noopener noreferrer', label: 'Скачать' }) }))
    assert.match(html, /^<a\b/)
    assert.match(html, /href="https:\/\/downloads.example.test\/app"/)
    assert.match(html, /target="_blank"/)
    assert.match(html, /rel="noopener noreferrer"/)
    assert.match(html, /bg-accent /)
    assert.doesNotMatch(html, /type="button"|disabled=/)
})

test('disabled and loading navigation actions cannot follow their URL', async () => {
    for (const state of [{ disabled: true }, { loading: true }]) {
        const html = await renderToString(createSSRApp({ render: () => h(BaseButton, { href: 'happ://add/owned-url', label: 'Добавить подписку', ...state }) }))
        assert.match(html, /^<a\b/)
        assert.match(html, /aria-disabled="true"/)
        assert.match(html, /tabindex="-1"/)
        assert.doesNotMatch(html, /href=/)
    }
})

test('select SSR renders the selected value and label without an open popup', async () => {
    const warnings = []
    const app = createSSRApp({ render: () => h(BaseSelect, { id: 'app', name: 'application', 'aria-label': 'Приложение', modelValue: 'second', options: [{ value: 'first', label: 'Первое' }, { value: 'second', label: 'Второе' }] }) })
    app.config.warnHandler = warning => warnings.push(warning)
    const html = await renderToString(app)
    assert.match(html, /role="combobox"/)
    assert.match(html, /aria-expanded="false"/)
    assert.match(html, /aria-label="Приложение"/)
    assert.match(html, /Второе/)
    assert.match(html, /<input[^>]+name="application"[^>]+value="second"/)
    assert.doesNotMatch(html, /role="listbox"/)
    assert.deepEqual(warnings, [])
})

test('disabled select keeps its trigger and form value disabled', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(BaseSelect, { disabled: true, name: 'application', modelValue: 1, options: [{ value: 1, label: 'Первое' }] }) }))
    assert.match(html, /<button[^>]+disabled/)
    assert.match(html, /<input[^>]+disabled/)
})

function mount(t) {
    const node = (type, text = '') => ({ type, text, props: {}, children: [], parent: null })
    const remove = child => {
        if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
        child.parent = null
    }
    const renderer = createRenderer({
        createElement: type => node(type), createText: text => node('#text', text), createComment: text => node('#comment', text),
        insert(child, parent, anchor = null) { remove(child); parent.children.splice(anchor ? parent.children.indexOf(anchor) : parent.children.length, 0, child); child.parent = parent },
        remove, setText: (element, text) => { element.text = text }, setElementText: (element, text) => { element.text = text; element.children = [] },
        parentNode: element => element.parent, nextSibling: element => element.parent?.children[element.parent.children.indexOf(element) + 1] ?? null,
        patchProp: (element, key, previous, value) => { element.props[key] = value },
    })
    const root = node('root')
    const update = disabled => renderer.render(h('div', [h(PasswordField, { id: 'password', disabled }), h(PasswordField, { id: 'password_confirmation', autocomplete: 'new-password', disabled })]), root)
    update(false)
    t.after(() => renderer.render(null, root))
    return { root, update }
}
const elements = root => [root, ...root.children.flatMap(elements)]

test('password visibility controls are independent, labelled and do not submit the form', async t => {
    const { root, update } = mount(t)
    const buttons = elements(root).filter(e => e.type === 'button')
    assert.equal(buttons.length, 2)
    assert.ok(buttons.every(button => button.props.type === 'button' && button.props['aria-label'] === 'Показать пароль'))
    buttons[0].props.onClick()
    await nextTick()
    assert.deepEqual(elements(root).filter(e => e.type === 'input').map(e => e.props.type), ['text', 'password'])
    assert.equal(buttons[0].props['aria-label'], 'Скрыть пароль')
    assert.equal(buttons[0].props['aria-controls'], 'password')
    assert.equal(buttons[0].props['aria-pressed'], true)
    buttons[0].props.onClick()
    await nextTick()
    assert.ok(elements(root).filter(e => e.type === 'input').every(e => e.props.type === 'password'))
    update(true)
    await nextTick()
    assert.ok(elements(root).filter(e => e.type === 'button' || e.type === 'input').every(e => e.props.disabled === true))
})
