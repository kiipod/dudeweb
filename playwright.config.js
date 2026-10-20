import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests/Browser',
    forbidOnly: Boolean(process.env.CI),
    workers: 1,
    retries: 0,
    timeout: 30_000,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1',
        browserName: 'chromium',
        locale: 'ru-RU',
        reducedMotion: 'reduce',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium-desktop', testMatch: 'smoke.spec.js', use: { viewport: { width: 1440, height: 1024 }, colorScheme: 'light' } },
        { name: 'chromium-mobile', testMatch: 'smoke.spec.js', use: { viewport: { width: 390, height: 844 }, colorScheme: 'dark' } },
        { name: 'account-dashboard', testMatch: 'account-dashboard.spec.js' },
        { name: 'subscription-payment', testMatch: 'subscription-payment.spec.js' },
        { name: 'account-connection', testMatch: 'account-connection.spec.js' },
        { name: 'account-referral', testMatch: 'account-referral.spec.js' },
        { name: 'account-support', testMatch: 'account-support.spec.js' },
    ],
})
