// Parse production Compose using only synthetic env, entirely inside Sail.
import { mkdtemp, writeFile } from 'node:fs/promises'
import { execFileSync, spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import assert from 'node:assert/strict'
const binary='storage/app/audit-docker-compose-stage10'
const root=await mkdtemp(join(tmpdir(),'audit-compose-'))
const synthetic='PGPASSWORD=synthetic\nDB_DATABASE=testing\nDB_USERNAME=synthetic\nDB_PASSWORD=synthetic\nDB_TZ=UTC\n'
const path=join(root,'env');await writeFile(path,synthetic+'TRUSTED_PROXIES=127.0.0.1\n')
const env={PATH:process.env.PATH}
const version=execFileSync(binary,['version','--short'],{encoding:'utf8',env}).trim()
const args=['--env-file',path,'-f','docker-compose-prod.yml','config','--format','json']
const config=JSON.parse(execFileSync(binary,args,{encoding:'utf8',env,stdio:['ignore','pipe','pipe']}))
assert.equal(config.services.pgsql.ports?.length||0,0)
assert.equal(config.services.app.environment.TRUSTED_PROXIES,'127.0.0.1')
assert.ok(config.services.app.networks['dude-network']!==undefined)
assert.ok(config.services.pgsql.networks['dude-network']!==undefined)
await writeFile(path,synthetic)
const missing=spawnSync(binary,args,{encoding:'utf8',env})
assert.notEqual(missing.status,0)
assert.ok(missing.stderr.includes('TRUSTED_PROXIES'))
await writeFile('docs/audit/project-audit/evidence/final-compose.json',JSON.stringify({version,configurationParse:'PASS',onlySyntheticEnvironment:true,dbHostPortsAbsent:true,sharedInternalNetworkPreserved:true,explicitTrustedProxyEnvironment:true,missingProxyConfigurationRejected:true,noEngineOrProductionServiceStarted:true},null,2)+'\n')
console.log(JSON.stringify({version,configurationParse:'PASS',dbHostPortsAbsent:true,missingProxyRejected:true}))
