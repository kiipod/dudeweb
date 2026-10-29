# Stage 10 — reproduction protocol

2026-10-29, branch project-audit, source baseline e593be7. Runtime only Sail.
No production deployment or provider mutations. PHP DB suites run sequentially.

## Main verification

```bash
./vendor/bin/sail npm run build
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php artisan test --log-junit docs/audit/project-audit/evidence/final-backend.junit.xml
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run test:e2e -- --reporter=json --output=/tmp/project-audit-stage10-browser-results
./vendor/bin/sail composer audit --format=json
./vendor/bin/sail npm audit --json
./vendor/bin/sail node docs/audit/project-audit/evidence/final-static.mjs
./vendor/bin/sail node docs/audit/project-audit/evidence/final-environment.mjs
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential --dry-run --format=json
```

Build client+SSR PASS. Backend331/3104, no failures/errors/skips/deprecations;
Laravel20.92s/JUnit20.537323s. Frontend103/0fail/0skip,497.001159ms.
Default browser1770expected/0unexpected/0skipped/0flaky,1066.581680s,
24 projects; 2026-10-29T18:53:18.816Z. Composer0advisories/npm0vulnerabilities.
Syntax433files/0failures; full configured formatter files=[]/9.807s.
Full finder excludes diagnostic docs probes; both explicit probe paths also
formatted/checked (files=[]). PHPStan/Psalm/ESLint/typecheck NOT_CONFIGURED;
JavaScript stack preserved. No branch/statement coverage rerun in stage10.

## Database and performance

```bash
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php vendor/bin/phpunit docs/audit/project-audit/evidence/FinalDatabaseVerificationTest.php --log-junit docs/audit/project-audit/evidence/final-database.junit.xml
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php vendor/bin/phpunit docs/audit/project-audit/evidence/FinalPerformanceProbeTest.php --log-junit docs/audit/project-audit/evidence/final-performance.junit.xml
./vendor/bin/sail node docs/audit/project-audit/evidence/final-performance-browser.mjs
```

DB1/19PASS/JUnit0.948817s; performance1/14PASS/JUnit2.103324s. Testing DB only,
RefreshDatabase and fake/prevented external requests. Safe rollback only when
new recovery fields null; populated metadata rollback not attempted. Campaign
unsafe rollback blocked without dropping usages. Nine-table schema only saved.
12cold-context browser samples, routes / and /login,390/1440,3each. Full browser
suite concurrent: timings observational; deterministic bytes/query/request counts
compared with stage06. INP/field load/distributed providers NOT_MEASURED.

## Operational SSR — both outcomes retained

Own fresh renderer, temporary wrapper binds13715 (user13714 process untouched):

```bash
./vendor/bin/sail node docs/audit/project-audit/evidence/refactor-ssr-renderer.mjs
./vendor/bin/sail exec -T laravel.test env PLAYWRIGHT_SSR_BASE_URL=http://127.0.0.1 PLAYWRIGHT_SSR_RENDER_URL=http://127.0.0.1:13715/render npx playwright test --project=operational-ssr --reporter=json --output=/tmp/project-audit-stage10-ssr-results
```

Main endpoint32fixturePASS/8liveFAIL/0skip/flaky,15.793484s. Missing SSR marker;
CLI SSRflagtrue, existing HTTP effective runtime/renderer path not independently
established. Do not relabel failure as source defect or PASS.

Controlled independent HTTP integration, without altering main endpoint:

```bash
./vendor/bin/sail exec -T laravel.test env APP_ENV=testing APP_DEBUG=false DB_DATABASE=testing CACHE_STORE=array SESSION_DRIVER=array MAIL_MAILER=array QUEUE_CONNECTION=sync INERTIA_SSR_ENABLED=true INERTIA_SSR_URL=http://127.0.0.1:13715 php artisan serve --host=127.0.0.1 --port=18080 --no-reload
./vendor/bin/sail exec -T laravel.test env PLAYWRIGHT_SSR_BASE_URL=http://127.0.0.1:18080 PLAYWRIGHT_SSR_RENDER_URL=http://127.0.0.1:13715/render npx playwright test --project=operational-ssr --reporter=json --output=/tmp/project-audit-stage10-isolated-ssr-results
```

40PASS/0FAIL/0skip/flaky,11.857929s. Only public synthetic integration; no real
mail/provider activity. Own artisan server and renderer stopped with SIGINT;
wrapper removed and three original tracked SSR artifacts restored from initial
backup. Existing application processes/config not changed. This proves controlled
HTTP SSR integration, not deployed process supervision or main endpoint repair.

## Network/logging/secrets

```bash
./vendor/bin/sail node docs/audit/project-audit/evidence/final-caddy.mjs
./vendor/bin/sail node docs/audit/project-audit/evidence/final-compose.mjs
./vendor/bin/sail exec -T laravel.test python3 docs/audit/project-audit/evidence/final-secret-scan.py
```

Caddy2.10.2 previously extracted binary, current Caddyfile adapt +5synthetic cases,
7requestlogs, full URI redaction/Referer removal confirmed incl upstream502.
Compose5.6.1 standalone parser copied from installed host plugin into ignored
storage/app/audit-docker-compose-stage10; parser executed inside Sail, synthetic
environment only. No engine ops/service starts, no dependency added. DB hostports
absent/internalnetwork preserved, explicitproxies accepted/missing rejected.
Secret scanner stores field presence/template/decode flags only, no secret/hash.
Owner test-value clarification retained; ignored local runtime env preserved.

## Unavailable operational checks

```bash
./vendor/bin/sail exec -T laravel.test python3 tests/Infrastructure/test_supervisor_runtime.py
```

Exit1,3setupfailures/0.001s: process userroot != requireddeploy. Actual supervisor
assertions not reached. BLOCKED production-image verification, not proved process
failure. No host-test fallback. Pen MCP not called before Nov1 reset; PEN-001
BLOCKED, current design unknown. Real SMTP/reset-mail, provider/merchant state,
production edge/network/process lifecycle remain external acceptance.

## Git / report integrity

Host git status/diff/diff--check,21ID/status/evidence/commit ancestry,36relative
links verified. Stage09 split14cases into5classes without weakening assertions;
all331defaulttests discovered. Stage10 adds docs/probes only. Two preexisting
.env.example(+1)/.env.prod.example(-1) changes untouched. Raw Playwright54MB HTML/
attachments outside Git; only curated stats/title/status/duration retained.
Production API/checks/secrets not changed. Stage10 results committed separately
as `docs: finalize project audit report`; no next step executed.
