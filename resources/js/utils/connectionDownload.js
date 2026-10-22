export function connectionDownloadNote(link, platform) {
    let pathname = ''
    try {
        pathname = new URL(link.url).pathname
    } catch {
        // The source label still distinguishes a link without a parsable URL.
    }

    const source = `${link.label} ${pathname}`
    const architecture = /\b(?:arm64|aarch64)\b/i.test(source)
        ? 'arm64'
        : /\b(?:amd64|x64|x86_64)\b/i.test(source) ? 'amd64' : ''

    if (platform === 'linux') {
        const format = source.match(/\.(deb|rpm|arch)\b/i)?.[0].toLowerCase()
            ?? (/\bAppImage\b/i.test(source) ? 'AppImage' : /\.pkg\.tar\./i.test(pathname) ? '.arch' : '')
        if (format) {
            const linuxArchitecture = architecture === 'amd64' ? 'x64' : architecture
            return linuxArchitecture ? `${format} (${linuxArchitecture})` : format
        }
    }

    return architecture || link.label.replace(/^(?:Скачать|Открыть в)\s+/i, '')
}
