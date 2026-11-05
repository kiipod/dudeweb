# Stage 09 — reproduction protocol

2026-10-29, base3ff3b24, project-audit. Runtime checks only through Sail.

```bash
./vendor/bin/sail composer update symfony/mime --with-dependencies --minimal-changes --no-interaction
./vendor/bin/sail composer audit --format=json
./vendor/bin/sail npm run build
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run test:e2e -- --reporter=json --output=/tmp/project-audit-stage09-browser-results
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php artisan test --log-junit docs/audit/project-audit/evidence/refactor-backend.junit.xml
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php artisan test --filter=RefactoringRegressionTest
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php vendor/bin/phpunit docs/audit/project-audit/evidence/RefactorPerformanceProbeTest.php --log-junit docs/audit/project-audit/evidence/refactor-performance.junit.xml
./vendor/bin/sail node docs/audit/project-audit/evidence/refactor-performance-browser.mjs
./vendor/bin/sail node docs/audit/project-audit/evidence/refactor-static.mjs
```

Full backend331/3104,0 failures/errors/skips/warnings,wall20.14s; targeted14/43.
Node103 passed. Default browser1770 passed/0 failed/skipped/flaky,1053.378s.
Composer only updates package symfony/mime8.1.7→8.1.10 plus lock-format metadata;
audit exit0/no advisories. New packages/tools were not added to project dependencies.
Build client+SSR exit0. Scoped PHP-CS-Fixer fix then dry-run executed over20 changed
PHP paths; JSON saved as refactor-formatter.json,files empty. Syntax429/0 failures.

## SSR boundary

Current built SSR bundle imported via temporary bootstrap/ssr/stage09-renderer.mjs;
only server factory wrapper changed to bind13715. It does not mutate production
SSR entry. Existing user renderer/13714 not stopped. Command:

```bash
./vendor/bin/sail node docs/audit/project-audit/evidence/refactor-ssr-renderer.mjs
./vendor/bin/sail exec -T laravel.test env PLAYWRIGHT_SSR_BASE_URL=http://127.0.0.1 PLAYWRIGHT_SSR_RENDER_URL=http://127.0.0.1:13715/render npx playwright test --project=operational-ssr --reporter=json --output=/tmp/project-audit-stage09-ssr-results
```

32 fixture pass/8 live fail,15.374s; live marker missing. Own renderer stopped with
SIGINT, temporary file removed, original3 SSR artifacts restored. Isolated output
avoids the collision seen in stage07. No stage10/live SSR acceptance claimed.

## Caddy

Image caddy:2.10-alpine pulled, stopped export container used only to copy binary
to ignored storage/app/audit-caddy-stage09. Tests execute the2.10.2 binary inside
Sail, not production container. Run:

```bash
./vendor/bin/sail node docs/audit/project-audit/evidence/refactor-caddy.mjs
```

Real production Caddyfile adapts successfully. Test-only listener19209 uses the
same imported filters plus synthetic204/upstream502 handlers. Five cases/seven
request logs; URI redacted, Referer absent, all fixture tokens absent across
access/default error logs. No real app/provider requests, ACME or deployment.
Earlier snippet-forward-reference/test respond-order attempts were corrected;
only final PASS saved. Log payloads/tokens are not committed.

## Interpretation and exclusions

After performance samples run alongside full browser regression. Bundle bytes/
query/request counts comparable; wall timing is observational, no Web Vitals
improvement or INP result claimed. Regression API calls fake; no real charges,
refunds, cancellations, webhook registration or merchant reconciliation.
Operator absent flag means human verification, not automatic provider absence.
New payment fields tested via RefreshDatabase/testing only. Stage08 and stage09
migrations must precede new code rollout; no production migration/rollback.
TRUSTED_PROXIES is now an explicit production Compose requirement; actual edge
IPs/firewall/host bind deployment are outside local validation. No env-example
edits included. Pen remains blocked; image/design/index changes not invented.
