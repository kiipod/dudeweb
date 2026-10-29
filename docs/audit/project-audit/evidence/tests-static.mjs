// Syntax checks only; execute through Sail.
import { readdir, writeFile } from 'node:fs/promises'
import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'
const run=promisify(execFile)
const files=['artisan','public/index.php','.php-cs-fixer.dist.php']
async function walk(dir) { for (const e of await readdir(dir,{withFileTypes:true})) { const p=`${dir}/${e.name}`; if (e.isDirectory()) { if (!['bootstrap/cache','bootstrap/ssr'].includes(p)) await walk(p) } else if(p.endsWith('.php') && !p.endsWith('.blade.php')) files.push(p) } }
for(const d of ['app','bootstrap','config','database','lang','routes','tests']) await walk(d)
let cursor=0; const failures=[];const start=Date.now()
await Promise.all(Array.from({length:4},async()=>{while(cursor<files.length) {const file=files[cursor++];try{await run('php',['-l',file])}catch(e){failures.push({file,message:e.stdout||e.stderr||e.message})}}}))
const output={command:'php -l, 4 local workers through Sail',files:files.length,failures,elapsedMs:Date.now()-start,phpModules:execFileSync('php',['-m'],{encoding:'utf8'}).trim().split('\n'),excluded:'Blade templates, dependencies, skills, bootstrap/cache and bootstrap/ssr'}
await writeFile('docs/audit/project-audit/evidence/tests-static.json',JSON.stringify(output,null,2)+'\n')
console.log(JSON.stringify({files:output.files,failures,elapsedMs:output.elapsedMs}))
