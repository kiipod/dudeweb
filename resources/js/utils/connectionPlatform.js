/** Best-effort default for app instructions; the user can always change it. */
export function detectConnectionPlatform(browser) {
    const hint = browser?.userAgentData?.platform?.toLowerCase() ?? ''
    const platform = browser?.platform?.toLowerCase() ?? ''
    const agent = browser?.userAgent?.toLowerCase() ?? ''

    // iPadOS can report a desktop Mac identity in Safari.
    if (/iphone|ipad|ipod/.test(`${agent} ${platform}`)
        || (platform.startsWith('mac') && browser?.maxTouchPoints > 1)) return 'ios'

    const hints = { windows: 'windows', macos: 'macos', linux: 'linux', android: 'android', ios: 'ios' }
    if (Object.hasOwn(hints, hint)) return hints[hint]
    if (hint === 'chrome os' || /cros/.test(agent)) return null

    const identity = `${agent} ${platform}`
    if (/android/.test(identity)) return 'android'
    if (/windows|\bwin32\b|\bwin64\b/.test(identity)) return 'windows'
    if (/macintosh|macintel|macppc|macos|mac os/.test(identity)) return 'macos'
    if (/linux/.test(identity)) return 'linux'
    return null
}
