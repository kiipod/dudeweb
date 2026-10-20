import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { accountFixture, expectLayout, inertiaResponse, screenshot } from './helpers/accountDashboard.js'

const uuid = 'df31dc3e-1c73-4ef5-a37b-9d0b66053aaf'
const formProps = { submissionId: uuid, subjectMax: 160, bodyMax: 10000 }
const metadata = { subject: 'Не получается подключиться', status: 'OPEN', statusLabel: 'Открыто', updatedAt: '2026-10-20T12:40:00Z', updatedLabel: '20 октября 2026, 12:40' }
const message = (id, author, body) => ({ id, author, authorLabel: author === 'customer' ? 'Ты' : 'Поддержка', body, createdAt: '2026-10-20T12:35:00Z', timeLabel: '20 октября, 12:35' })
const paginate = (data, url, current = 1, last = 1) => ({ data, current_page: current, last_page: last, links: [
    { url: current > 1 ? `${url}?page=${current - 1}` : null, label: '&laquo; Previous', active: false },
    ...Array.from({ length: last }, (_, i) => ({ url: `${url}?page=${i + 1}`, label: String(i + 1), active: current === i + 1 })),
    { url: current < last ? `${url}?page=${current + 1}` : null, label: 'Next &raquo;', active: false },
] })
const overview = (data = [{ ...metadata, preview: 'Проверили настройки — попробуй добавить ссылку ещё раз…', url: '/account/support/1' }]) => ({ errors: {}, serviceState: 'ready', tickets: paginate(data, '/account/support') })
const conversation = (status = 'OPEN') => ({ errors: {}, ...formProps, serviceState: 'ready', ticket: { ...metadata, status, statusLabel: status === 'OPEN' ? 'Открыто' : 'Закрыто', replyUrl: '/account/support/1/messages' }, messages: paginate([
    message(1, 'customer', 'Не получается добавить ссылку в приложение.'),
    message(2, 'operator', 'Проверили настройки. Скопируй ссылку заново и добавь её в приложение.'),
], '/account/support/1') })
const paths = { Index: '/account/support', Create: '/account/support/create', Show: '/account/support/1' }
const titles = { Index: 'Dude, мы на связи.', Create: 'Напиши нам', Show: metadata.subject }
async function fixture(page, request, name = 'Index', props = name === 'Index' ? overview() : name === 'Create' ? { errors: {}, ...formProps } : conversation()) {
    return accountFixture(page, request, props, { component: `Account/Support/${name}`, url: paths[name], title: name === 'Show' ? props.ticket?.subject ?? 'Поддержка' : titles[name] })
}
async function fillTicket(page) {
    await page.getByRole('textbox', { name: 'Тема обращения', exact: true }).fill('Помогите с настройкой')
    await page.getByRole('textbox', { name: 'Сообщение', exact: true }).fill('Подробное описание вопроса')
}

test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => { throw error })
    page.on('console', event => { if (event.type() === 'warning' && event.text().includes('[Vue warn]')) throw new Error(event.text()) })
})

for (const theme of ['light', 'dark']) {
    for (const name of ['Index', 'Create', 'Show']) {
        for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 2560]) {
            test(`${name} ${width} ${theme}`, async ({ page, request }, info) => {
                await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1024 })
                await page.emulateMedia({ colorScheme: theme })
                await fixture(page, request, name)
                await expectLayout(page)
                if (name === 'Create') {
                    await expect(page.getByRole('textbox', { name: 'Тема обращения', exact: true })).toHaveAttribute('maxlength', '160')
                    await expect(page.getByRole('textbox', { name: 'Сообщение', exact: true })).toHaveAttribute('maxlength', '10000')
                    if (width === 390) {
                        const header = page.locator('#account-shell > header')
                        expect((await header.boundingBox()).height).toBe(68)
                        const buttons = header.getByRole('button')
                        expect((await buttons.first().boundingBox()).y).toBeLessThan(30)
                    }
                } else if (name === 'Show') {
                    const articles = page.getByRole('list', { name: 'Переписка с поддержкой' }).getByRole('article')
                    await expect(articles).toHaveCount(2)
                    const positions = await articles.evaluateAll(elements => elements.map(e => ({ left: e.getBoundingClientRect().left, width: e.getBoundingClientRect().width, background: getComputedStyle(e).backgroundColor })))
                    expect(positions[0].left).toBeGreaterThan(positions[1].left)
                    expect(positions[0].background).not.toBe(positions[1].background)
                }
                if (width < 1200) await expect(page.getByRole('button', { name: 'Ещё', exact: true })).toHaveClass(/text-accent/)
                else await expect(page.getByRole('navigation', { name: 'Разделы личного кабинета' }).getByRole('link', { name: 'Поддержка', exact: true })).toHaveAttribute('aria-current', 'page')
                await screenshot(page, info, `support-${name}-${width}-${theme}`)
            })
        }
        test(`${name} 320 long content and text 2x ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width: 320, height: 900 })
            await page.emulateMedia({ colorScheme: theme })
            const long = 'Длинноесловобезпробелов'.repeat(12)
            const props = name === 'Index' ? overview([{ ...metadata, subject: long, preview: long, url: '/account/support/1' }]) : name === 'Create' ? { errors: { subject: long, body: long }, ...formProps } : conversation()
            if (name === 'Show') { props.ticket.subject = long; props.messages.data[1].body = long }
            await fixture(page, request, name, props)
            await page.evaluate(() => {
                const elements = [...document.querySelectorAll('#app *')]
                const sizes = elements.map(e => parseFloat(getComputedStyle(e).fontSize))
                elements.forEach((e, i) => { e.style.fontSize = `${sizes[i] * 2}px` })
            })
            await expectLayout(page)
            await screenshot(page, info, `support-${name}-text2x-${theme}`)
        })
    }
}

test('empty and closed states offer a real new ticket destination', async ({ page, request }) => {
    await fixture(page, request, 'Index', overview([]))
    await expect(page.getByText('Обращений пока нет.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Написать в поддержку' })).toHaveAttribute('href', paths.Create)
    await fixture(page, request, 'Show', conversation('CLOSED'))
    await expect(page.getByText('Обращение закрыто. Если нужна помощь, создай новое.')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Ответить в обращении' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Новое обращение', exact: true })).toHaveAttribute('href', paths.Create)
})

test('create uses keyboard, blocks duplicates and shows only persisted success', async ({ page, request }) => {
    const server = await fixture(page, request, 'Create')
    let release
    const pending = new Promise(resolve => { release = resolve })
    let posts = 0
    await page.route('**/account/support', async route => {
        posts++
        expect(route.request().method()).toBe('POST')
        expect(route.request().postDataJSON()).toEqual({ subject: 'Помогите с настройкой', body: 'Подробное описание вопроса', submission_id: uuid })
        await pending
        const props = conversation()
        props.ticket.subject = 'Помогите с настройкой'
        props.messages.data = [message(1, 'customer', 'Подробное описание вопроса')]
        await inertiaResponse(route, { ...server.page(), component: 'Account/Support/Show', url: paths.Show, props })
    })
    await fillTicket(page)
    await page.getByRole('textbox', { name: 'Сообщение', exact: true }).focus()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Отправить обращение' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Отправляем…' })).toBeDisabled()
    await page.keyboard.press('Enter')
    expect(posts).toBe(1)
    await expect(page.getByRole('list', { name: 'Переписка с поддержкой' })).toHaveCount(0)
    release()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Помогите с настройкой')
    await expect(page.getByRole('article')).toHaveCount(1)
})

for (const failure of ['validation', 'http', 'network']) {
    test(`create ${failure} preserves draft and allows retry`, async ({ page, request }) => {
        const server = await fixture(page, request, 'Create')
        await page.route('**/account/support', async route => {
            if (failure === 'network') await route.abort('failed')
            else if (failure === 'http') await route.fulfill({ status: 503, body: 'Unavailable' })
            else await inertiaResponse(route, { ...server.page(), props: { ...server.props, errors: { subject: 'Укажи тему', body: 'Проверь сообщение' } } })
        })
        await fillTicket(page)
        await page.getByRole('button', { name: 'Отправить обращение' }).click()
        await expect(page.getByText(failure === 'validation' ? 'Проверь сообщение' : failure === 'http' ? 'Не удалось создать обращение. Попробуй ещё раз.' : 'Проверь соединение и попробуй отправить обращение ещё раз.')).toBeVisible()
        await expect(page.getByRole('textbox', { name: 'Сообщение', exact: true })).toHaveValue('Подробное описание вопроса')
        await expect(page.getByRole('button', { name: 'Отправить обращение' })).toBeEnabled()
        if (failure === 'validation') await expect(page.getByRole('textbox', { name: 'Тема обращения', exact: true })).toHaveAttribute('aria-invalid', 'true')
    })
}

test('reply blocks duplicates, waits for persistence, clears body and rotates submission intent', async ({ page, request }) => {
    const server = await fixture(page, request, 'Show')
    let release
    const pending = new Promise(resolve => { release = resolve })
    const submissions = []
    await page.route('**/account/support/1/messages', async route => {
        const data = route.request().postDataJSON()
        submissions.push(data)
        await pending
        server.props = { ...server.props, messages: { ...server.props.messages, data: [...server.props.messages.data, message(2 + submissions.length, 'customer', data.body)] } }
        await inertiaResponse(route, server.page())
    })
    const body = page.getByRole('textbox', { name: 'Ответить в обращении' })
    const send = page.getByRole('button', { name: 'Отправить ответ', exact: true })
    await body.fill('Спасибо, проверю')
    await body.focus()
    await page.keyboard.press('Tab')
    await expect(send).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(send).toBeDisabled()
    await page.keyboard.press('Enter')
    expect(submissions).toHaveLength(1)
    await expect(page.getByRole('article')).toHaveCount(2)
    release()
    await expect(page.getByRole('article')).toHaveCount(3)
    await expect(body).toHaveValue('')
    await expect(page.getByRole('status')).toContainText('Сообщение отправлено')
    await body.fill('Ещё вопрос')
    await send.click()
    await expect(page.getByRole('article')).toHaveCount(4)
    expect(submissions[0].submission_id).toBe(uuid)
    expect(submissions[1].submission_id).not.toBe(uuid)
})

for (const failure of ['validation', 'http', 'network']) {
    test(`reply ${failure} preserves draft without optimistic history`, async ({ page, request }) => {
        const server = await fixture(page, request, 'Show')
        await page.route('**/account/support/1/messages', async route => {
            if (failure === 'network') await route.abort('failed')
            else if (failure === 'http') await route.fulfill({ status: 500, body: 'Unavailable' })
            else await inertiaResponse(route, { ...server.page(), props: { ...server.props, errors: { body: 'Обращение закрыто. Создай новое, если нужна помощь.' } } })
        })
        const body = page.getByRole('textbox', { name: 'Ответить в обращении' })
        await body.fill('Мой ответ')
        await page.getByRole('button', { name: 'Отправить ответ' }).click()
        await expect(page.getByRole('alert')).toContainText(failure === 'validation' ? 'Обращение закрыто.' : failure === 'http' ? 'Не удалось отправить ответ.' : 'Проверь соединение')
        await expect(body).toHaveValue('Мой ответ')
        await expect(page.getByRole('article')).toHaveCount(2)
        await expect(page.getByRole('button', { name: 'Отправить ответ' })).toBeEnabled()
    })
}

test('reload has loading, failure and recovery while retaining the reply draft', async ({ page, request }) => {
    const server = await fixture(page, request, 'Show')
    const body = page.getByRole('textbox', { name: 'Ответить в обращении' })
    await body.fill('Не терять этот текст')
    let release
    const pending = new Promise(resolve => { release = resolve })
    server.reload = async route => { await pending; await route.abort('failed') }
    await page.getByRole('button', { name: 'Обновить данные', exact: true }).click()
    await expect(page.getByText('Загружаем обращения…')).toBeVisible()
    expect(server.reloadCount).toBe(1)
    release()
    await expect(page.getByText('Не удалось загрузить поддержку.')).toBeVisible()
    server.reload = route => inertiaResponse(route, server.page())
    await page.getByRole('button', { name: 'Попробовать снова' }).click()
    await expect(body).toHaveValue('Не терять этот текст')
    expect(server.reloadCount).toBe(2)
})

test('initial read failure hides history and can recover through Inertia', async ({ page, request }) => {
    const server = await fixture(page, request, 'Index', { ...overview(), serviceState: 'error' })
    await expect(page.getByText(metadata.subject)).toBeHidden()
    server.props = overview()
    await page.getByRole('button', { name: 'Попробовать снова' }).click()
    await expect(page.getByText(metadata.subject)).toBeVisible()
})

test('history and subjects escape markup and keep deterministic server order', async ({ page, request }) => {
    const props = conversation()
    props.ticket.subject = '<b>Тема</b>'
    props.messages.data = [message(4, 'customer', '<script>window.__unsafe = true</script>'), message(9, 'operator', 'Вторая строка\nСохранённый порядок')]
    await fixture(page, request, 'Show', props)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('<b>Тема</b>')
    await expect(page.getByRole('article').first()).toContainText('<script>window.__unsafe = true</script>')
    expect(await page.evaluate(() => window.__unsafe)).toBeUndefined()
    await expect(page.getByRole('article').last()).toContainText('Сохранённый порядок')
})

test('list, create, conversation, pagination and browser back use real links', async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const server = await fixture(page, request)
    await page.route('**/account/support/create', route => inertiaResponse(route, { ...server.page(), component: 'Account/Support/Create', url: paths.Create, props: { errors: {}, ...formProps } }))
    await page.route('**/account/support/1', route => inertiaResponse(route, { ...server.page(), component: 'Account/Support/Show', url: paths.Show, props: { ...conversation(), messages: paginate(conversation().messages.data, paths.Show, 1, 2) } }))
    await page.route('**/account/support/1?page=2', route => inertiaResponse(route, { ...server.page(), component: 'Account/Support/Show', url: `${paths.Show}?page=2`, props: { ...conversation(), messages: paginate([message(51, 'operator', 'Последняя страница')], paths.Show, 2, 2) } }))
    await page.getByRole('link', { name: 'Написать в поддержку' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Create)
    await page.getByRole('link', { name: 'Назад к обращениям' }).click()
    await page.getByRole('link', { name: /Не получается подключиться/ }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Show)
    await page.getByRole('navigation', { name: 'Страницы переписки' }).getByRole('link', { name: 'Дальше' }).click()
    await expect(page.getByText('Последняя страница')).toBeVisible()
    await page.goBack()
    await expect(page.getByText('Не получается добавить ссылку в приложение.')).toBeVisible()
    await page.getByRole('link', { name: 'Назад к обращениям' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles.Index)
})

test('native MoonShine forms expose keyboard reply and close actions with CSRF', async ({ page }) => {
    // Generated by SupportTest from actual MoonShine render and isolated database factories.
    const html = await readFile('storage/framework/testing/support-operator.html', 'utf8')
    await page.route('**/admin/support-browser-fixture', route => route.fulfill({ contentType: 'text/html', body: html }))
    await page.goto('/admin/support-browser-fixture')
    const body = page.getByRole('textbox', { name: 'Ответ клиенту' })
    await expect(body).toBeVisible()
    await expect(page.getByText('<script>private()</script>', { exact: true })).toBeVisible()
    await expect(page.getByText('<script>private()</script>', { exact: true })).toHaveCSS('white-space', 'pre-wrap')
    await expect(page.getByText('<script>private()</script>', { exact: true })).toHaveCSS('overflow-wrap', 'anywhere')
    await body.fill('Ответ с клавиатуры')
    await body.focus()
    await page.keyboard.press('Tab')
    const send = page.getByRole('button', { name: 'Отправить ответ', exact: true })
    await expect(send).toBeFocused()
    const form = await send.evaluate(e => ({ action: e.form.action, method: e.form.method, csrf: Boolean(e.form.querySelector('[name="_token"]').value), submission: e.form.querySelector('[name="submission_id"]').value }))
    expect(form.method).toBe('post')
    expect(form.action).toMatch(/\/admin\/support\/\d+\/messages$/)
    expect(form.csrf).toBe(true)
    expect(form.submission).toMatch(/^[\da-f-]{36}$/i)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Закрыть обращение' })).toBeFocused()
})
