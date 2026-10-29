// Test-only current SSR renderer on a separate port; never stops user services.
import { readFile, writeFile, unlink } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
const path='bootstrap/ssr/stage09-renderer.mjs'
const source=await readFile('bootstrap/ssr/ssr.js','utf8')
const needle='import createServer from "@inertiajs/vue3/server";'
assert.ok(source.includes(needle),'Build current SSR bundle first; expected server factory import.')
await writeFile(path,source.replace(needle,'import auditCreateServer from "@inertiajs/vue3/server";\nconst createServer = (render, options) => auditCreateServer(render, { ...options, port: 13715 });'),{flag:'wx'})
try {
    const child=spawn(process.execPath,[path],{stdio:'inherit'})
    const stop=()=>child.kill('SIGTERM')
    process.on('SIGINT',stop);process.on('SIGTERM',stop)
    await new Promise((resolve,reject)=>{child.once('exit',resolve);child.once('error',reject)})
    process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop)
} finally {await unlink(path)}
