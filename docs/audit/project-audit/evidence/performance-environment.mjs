import { execFileSync } from 'node:child_process'
import { writeFile, readFile } from 'node:fs/promises'
import { cpus, totalmem } from 'node:os'
const php = String.raw`require 'vendor/autoload.php'; $app = require 'bootstrap/app.php'; $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap(); echo json_encode(['php'=>PHP_VERSION,'laravel'=>$app->version(),'environment'=>$app->environment(),'debug'=>config('app.debug'),'cache'=>config('cache.default'),'queue'=>config('queue.default'),'session'=>config('session.driver'),'database'=>config('database.default'),'ssrEnabled'=>config('inertia.ssr.enabled'),'postgres'=>Illuminate\Support\Facades\DB::selectOne('select version()')->version], JSON_THROW_ON_ERROR);`
const raw = execFileSync('php', ['-r', php], { encoding:'utf8' })
const data = { node: process.version, platform: process.platform, architecture:process.arch,
    logicalCpus: cpus().length, cpuModel: cpus()[0]?.model, hostVisibleMemoryBytes:totalmem(),
    note:'Shared development container; host-visible resources are not a dedicated benchmark allocation.',
    runtime: JSON.parse(raw.slice(raw.indexOf('{'))) }
for (const name of ['vite','vue','@inertiajs/vue3','tailwindcss','@playwright/test']) data[name] = JSON.parse(await readFile(`node_modules/${name}/package.json`,'utf8')).version
await writeFile('docs/audit/project-audit/evidence/performance-environment.json',JSON.stringify(data,null,2)+'\n')
console.log(JSON.stringify(data,null,2))
