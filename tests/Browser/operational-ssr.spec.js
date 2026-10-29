import { expect, test } from '@playwright/test'
import { verificationRoutes } from './helpers/verificationRoutes.js'

async function trackHydration(page, theme) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
        if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
    })
    await page.addInitScript(theme => {
        localStorage.setItem('dudeweb-theme', theme)
        const observer = new MutationObserver(() => {
            const heading = document.querySelector('#app h1')
            if (!heading) return
            window.__serverHeading = heading
            observer.disconnect()
        })
        observer.observe(document, { childList: true, subtree: true })
    }, theme)
    return async () => {
        await page.waitForFunction(() => document.getElementById('app')?.__vue_app__)
        // A client-only remount can look right while discarding the SSR DOM.
        expect(await page.evaluate(() => window.__serverHeading === document.querySelector('#app h1'))).toBe(true)
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        expect(errors).toEqual([])
    }
}

for (const url of ['/', '/login', '/register', '/forgot-password']) {
    for (const theme of ['light', 'dark']) {
        test(`SSR markup hydrates in place ${url} ${theme}`, async ({ page, request }) => {
            const response = await request.get(url)
            expect(response.status()).toBe(200)
            const html = await response.text()
            expect(html).toContain('data-server-rendered="true"')
            expect(html).toMatch(/<h1\b/)
            const assertHydrated = await trackHydration(page, theme)
            await page.goto(url)
            await assertHydrated()
        })
    }
}

// Protected compositions go through the real Node renderer with test props.
// Laravel authorization/provider contracts remain covered by Feature tests.
for (const [component, url, title, props] of verificationRoutes) {
    for (const theme of ['light', 'dark']) {
        test(`SSR fixture hydrates ${component} ${theme}`, async ({ page, request }) => {
            const template = await (await request.get('/login')).text()
            const pageData = JSON.parse(template.match(/<script\b[^>]*\bdata-page="app"[^>]*>([\s\S]*?)<\/script>/)[1])
            const render = await request.post(process.env.PLAYWRIGHT_SSR_RENDER_URL || 'http://127.0.0.1:13714/render', {
                data: { ...pageData, component, url, props: { errors: {}, ...props } },
            })
            expect(render.status()).toBe(200)
            const result = await render.json()
            const html = `${template.slice(0, template.indexOf('<body>'))}<body><div class="isolate">${result.body}</div></body></html>`
            await page.route(`**${url}`, route => route.request().isNavigationRequest()
                ? route.fulfill({ contentType: 'text/html', body: html })
                : route.fallback())
            const assertHydrated = await trackHydration(page, theme)
            await page.goto(url)
            await assertHydrated()
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
            if (component.startsWith('Account/') && !component.startsWith('Account/Payments')) {
                await page.setViewportSize({ width: 390, height: 844 })
                const more = page.getByRole('button', { name: 'Ещё', exact: true })
                await more.click()
                await expect(page.getByRole('dialog', { name: 'Ещё', exact: true })).toBeVisible()
                await page.keyboard.press('Escape')
                await expect(more).toBeFocused()
            }
        })
    }
}
