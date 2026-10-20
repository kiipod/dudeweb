import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { ACCOUNT_NAVIGATION, activeAccountSection } from '../../../resources/js/utils/accountNavigation.js'
import { daysLabel, maskedSubscriptionUrl } from '../../../resources/js/utils/dashboardPresentation.js'

const root = new URL('../../../resources/js/', import.meta.url)
const vueUrl = import.meta.resolve('vue')
const cache = new Map()
async function component(path) {
    if (cache.has(path)) return cache.get(path)
    const { descriptor } = parse(await readFile(new URL(path, root), 'utf8'))
    let source = compileScript(descriptor, { id: path, inlineTemplate: true }).content
        .replace(/from (['"])vue\1/g, `from '${vueUrl}'`)
        .replace(/from ['"]@inertiajs\/vue3['"]/g, `from '${import.meta.resolve('@inertiajs/vue3')}'`)
    const imports = [...source.matchAll(/import (\w+) from ['"]@\/(.+?\.vue)['"]/g)]
    for (const [full, name, file] of imports) {
        const child = await component(file)
        source = source.replace(full, `import ${name} from '${child.url}'`)
    }
    source = source.replace(/from ['"]@\/(.+?)['"]/g, (_, path) => `from '${new URL(path.endsWith('.js') ? path : `${path}.js`, root).href}'`)
    const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
    const result = { url, value: (await import(url)).default }
    cache.set(path, result)
    return result
}
const Subscription = (await component('components/account/DashboardSubscription.vue')).value
const Connection = (await component('components/account/DashboardConnection.vue')).value
const NavLink = (await component('components/account/AccountNavLink.vue')).value
const MoreSheet = (await component('components/account/MoreNavigationSheet.vue')).value
async function render(Component, props) {
    const warnings = []
    const app = createSSRApp({ render: () => h(Component, props) })
    app.config.warnHandler = message => warnings.push(message)
    const html = await renderToString(app)
    assert.deepEqual(warnings, [])
    return html
}

test('remaining days use Russian plural forms including teens', () => {
    assert.deepEqual([0, 1, 2, 5, 11, 12, 21, 22, 25].map(daysLabel), [
        '0 дней', '1 день', '2 дня', '5 дней', '11 дней', '12 дней', '21 день', '22 дня', '25 дней',
    ])
})

test('visible connection label never exposes path or signed query values', () => {
    assert.equal(maskedSubscriptionUrl('https://sub.example.test/private-token?signature=secret#secret'), 'sub.example.test/…')
    assert.equal(maskedSubscriptionUrl('invalid'), '')
})

test('account route selection handles nested destinations and query strings', () => {
    for (const [url, expected] of [
        ['/account?source=login', 'dashboard'], ['/account/subscription', 'subscription'],
        ['/account/connection#devices', 'connection'], ['/account/referral/terms', 'referral'],
        ['/account/profile', 'profile'],
    ]) assert.equal(activeAccountSection(url), expected)
})

test('future sections remain disabled and support uses the existing real destination', () => {
    assert.deepEqual(ACCOUNT_NAVIGATION.filter(item => item.disabled).map(item => item.key), ['connection', 'referral', 'profile'])
    assert.equal(ACCOUNT_NAVIGATION.find(item => item.key === 'subscription').href, '/account/subscription')
    assert.equal(ACCOUNT_NAVIGATION.find(item => item.key === 'support').href, 'https://t.me/hey_dude_web')
})

test('all subscription states render the corresponding accessible badge and action', async () => {
    for (const [state, label] of [['trial', 'Пробный период'], ['active', 'Активна'], ['expiring', 'Скоро истечёт'], ['expired', 'Истекла'], ['limited', 'Ограничена']]) {
        const html = await render(Subscription, { subscription: { state, planName: 'Мой тариф', expiresAt: '2026-10-24T00:00:00Z', expiresOn: '24 октября 2026', remainingDays: 2 } })
        assert.match(html, new RegExp(label))
        assert.match(html, /<time datetime="2026-10-24T00:00:00Z"/)
        assert.match(html, /2 дня/)
        if (state === 'limited') assert.match(html, /href="https:\/\/t.me\/hey_dude_web"/)
        else assert.match(html, /href="\/account\/subscription"/)
    }
})

test('server plan and expiration labels are escaped', async () => {
    const html = await render(Subscription, { subscription: { state: 'active', planName: '<script>steal()</script>', expiresAt: '2026-10-24T00:00:00Z', expiresOn: '<b>date</b>', remainingDays: 3 } })
    assert.match(html, /&lt;script&gt;/)
    assert.doesNotMatch(html, /<script>/)
    assert.match(html, /&lt;b&gt;date/)
})

test('disabled navigation has native disabled semantics without a broken href', async () => {
    const html = await render(NavLink, { item: ACCOUNT_NAVIGATION.find(item => item.key === 'connection'), active: true })
    assert.match(html, /<button[^>]+disabled/)
    assert.match(html, /aria-current="page"/)
    assert.doesNotMatch(html, /href=/)
})

test('connection shows the masked domain and a truthful missing-link state', async () => {
    const html = await render(Connection, { url: 'https://sub.example.test/private-token?signature=secret' })
    assert.match(html, /sub.example.test\/…/)
    assert.doesNotMatch(html, /private-token|signature=secret/)
    const unavailable = await render(Connection, { url: null })
    assert.match(unavailable, /Ссылка подключения сейчас недоступна/)
    assert.doesNotMatch(unavailable, /Скопировать ссылку/)
})

test('more sheet exposes its dialog label and disables close/logout while logging out', async () => {
    const html = await render(MoreSheet, { items: ACCOUNT_NAVIGATION.filter(item => ['referral', 'support', 'profile'].includes(item.key)), logoutLoading: true })
    assert.match(html, /id="account-more-title"/)
    assert.match(html, /<button(?=[^>]+aria-label="Закрыть меню")(?=[^>]+disabled)[^>]*>/)
    assert.match(html, /Выходим/)
    assert.match(html, /aria-busy="true"/)
    assert.doesNotMatch(html, /href="\/account\/(referral|profile)"/)
})
