// Actual Caddy binary, isolated local listener; no production service or credentials.
import { spawn, execFileSync } from 'node:child_process'
import { readFile, writeFile, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'
const binary='storage/app/audit-caddy-stage09'
const source=await readFile('docker/caddy/Caddyfile','utf8')
const root=await mkdtemp(join(tmpdir(),'audit-caddy-'))
const config=source.replace('dudeweb.xyz {',':19209 {').replace('    php_fastcgi app:9000',`    handle /audit-gateway {
        reverse_proxy 127.0.0.1:1
    }
    handle {
        respond "Synthetic fixture" 204
    }`).replace('/app/public','/var/www/html/public')
const path=join(root,'Caddyfile');await writeFile(path,config)
const version=execFileSync(binary,['version'],{encoding:'utf8'}).trim()
execFileSync(binary,['adapt','--config','docker/caddy/Caddyfile','--adapter','caddyfile'],{stdio:['ignore','ignore','pipe']})
let logs='';const child=spawn(binary,['run','--config',path,'--adapter','caddyfile'])
child.stdout.on('data',v=>logs+=v);child.stderr.on('data',v=>logs+=v)
const stopped=new Promise(resolve=>child.on('exit',resolve))
const cases=['/reset-password/fixtureReset?token=fixtureReturn','/telegraph/fixtureBot/webhook','/payments/return?token=fixturePayment','/audit-gateway?token=fixtureGateway','/ordinary']
const statuses=[]
try {
    for(let i=0;i<100;i++) {try{await fetch('http://127.0.0.1:19209/health');break}catch{await new Promise(r=>setTimeout(r,50))}}
    for(const path of cases){const r=await fetch(`http://127.0.0.1:19209${path}`,{headers:{Referer:'https://audit.example.test/reset-password/fixtureReferer'}});statuses.push(r.status);await r.text()}
    await new Promise(r=>setTimeout(r,200))
} finally {child.kill('SIGTERM');await stopped}
for(const token of ['fixtureReset','fixtureReturn','fixtureBot','fixturePayment','fixtureGateway','fixtureReferer']) assert.equal(logs.includes(token),false,`Unredacted fixture in logs`)
const records=logs.split('\n').flatMap(line=>{try{return [JSON.parse(line)]}catch{return []}}).filter(r=>r.request)
assert.ok(records.length>=cases.length)
assert.ok(records.every(r=>r.request.uri==='REDACTED'&&!('Referer' in (r.request.headers||{}))))
assert.equal(statuses[3],502)
await writeFile('docs/audit/project-audit/evidence/final-caddy.json',JSON.stringify({version,adaptation:'PASS',isolatedCases:cases.length,statuses,requestLogRecords:records.length,allUrisRedacted:true,referersAbsent:true,fixtureTokensAbsent:true,includesGatewayError:true,productionServiceStarted:false},null,2)+'\n')
console.log(JSON.stringify({version,cases:cases.length,requestLogRecords:records.length,fixtureTokensAbsent:true}))
