import assert from 'node:assert/strict'
import test from 'node:test'
import { connectionDownloadNote } from '../../../resources/js/utils/connectionDownload.js'

for (const [platform, label, filename, note] of [
    ['windows', 'Windows (Установщик)', 'app-windows-amd64-setup.exe', 'amd64'],
    ['windows', 'Windows на ARM (Установщик)', 'app-windows-arm64-setup.exe', 'arm64'],
    ['macos', 'macOS (Apple Silicon)', 'app-macos-arm64.dmg', 'arm64'],
    ['macos', 'macOS (Intel)', 'app-macos-amd64.dmg', 'amd64'],
    ['linux', 'x64 (.deb)', 'app-linux-x64.deb', '.deb (x64)'],
    ['linux', 'arm64 (.deb)', 'app-linux-arm64.deb', '.deb (arm64)'],
    ['linux', 'x64 (.rpm)', 'app-linux-x64.rpm', '.rpm (x64)'],
    ['linux', 'arm64 (.rpm)', 'app-linux-arm64.rpm', '.rpm (arm64)'],
    ['linux', 'x64 (.arch)', 'app-linux-x64.pkg.tar.zst', '.arch (x64)'],
    ['linux', 'amd64 (AppImage)', 'app-linux-amd64.AppImage', 'AppImage (x64)'],
    ['android', 'Открыть в Google Play', 'app', 'Google Play'],
    ['android', 'Скачать APK', 'app.apk', 'APK'],
    ['ios', 'App Store (RU)', 'app', 'App Store (RU)'],
    ['ios', 'App Store (Global)', 'app', 'App Store (Global)'],
]) {
    test(`download note ${platform}: ${note}`, () => {
        assert.equal(connectionDownloadNote({ label, url: `https://downloads.example.test/${filename}` }, platform), note)
    })
}

test('unknown source keeps its label without guessing an architecture', () => {
    assert.equal(connectionDownloadNote({ label: 'Другой пакет', url: 'invalid' }, 'linux'), 'Другой пакет')
    assert.equal(connectionDownloadNote({ label: 'Скачать пакет', url: 'https://downloads.example.test/arm64-app?fallback=amd64' }, 'linux'), 'arm64')
    assert.equal(connectionDownloadNote({ label: 'Скачать пакет', url: 'https://downloads.example.test/app?architecture=arm64' }, 'linux'), 'пакет')
})
