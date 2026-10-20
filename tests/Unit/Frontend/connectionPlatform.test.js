import assert from 'node:assert/strict'
import test from 'node:test'
import { detectConnectionPlatform } from '../../../resources/js/utils/connectionPlatform.js'

for (const [name, browser, expected] of [
    ['Windows Chrome', { userAgentData: { platform: 'Windows' } }, 'windows'],
    ['macOS Chrome', { userAgentData: { platform: 'macOS' } }, 'macos'],
    ['Linux Chrome', { userAgentData: { platform: 'Linux' } }, 'linux'],
    ['Android Chrome', { userAgentData: { platform: 'Android' }, platform: 'Linux armv8l' }, 'android'],
    ['iOS hint', { userAgentData: { platform: 'iOS' } }, 'ios'],
    ['Windows Firefox', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32' }, 'windows'],
    ['macOS Safari', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', platform: 'MacIntel', maxTouchPoints: 0 }, 'macos'],
    ['Linux Firefox', { userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64)', platform: 'Linux x86_64' }, 'linux'],
    ['Android without hints', { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)', platform: 'Linux armv8l', maxTouchPoints: 5 }, 'android'],
    ['iPhone Safari', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone', maxTouchPoints: 5 }, 'ios'],
    ['iPad mobile mode', { userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)', platform: 'iPad', maxTouchPoints: 5 }, 'ios'],
    ['iPad desktop mode', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', platform: 'MacIntel', maxTouchPoints: 5 }, 'ios'],
    ['Windows touchscreen', { platform: 'Win32', maxTouchPoints: 10 }, 'windows'],
    ['platform fallback', { platform: 'MacIntel' }, 'macos'],
    ['client hint precedence over reduced UA', { userAgentData: { platform: 'Android' }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' }, 'android'],
    ['ChromeOS hint', { userAgentData: { platform: 'Chrome OS' }, platform: 'Linux x86_64' }, null],
    ['ChromeOS without hints', { userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 16093.68.0)', platform: 'Linux x86_64' }, null],
    ['unknown OS', { userAgent: 'Unknown browser', platform: 'FreeBSD' }, null],
    ['empty browser identity', {}, null],
    ['SSR without navigator', undefined, null],
]) {
    test(`connection OS detection: ${name}`, () => {
        assert.equal(detectConnectionPlatform(browser), expected)
    })
}
