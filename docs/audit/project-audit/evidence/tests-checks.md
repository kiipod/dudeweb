# Test suite audit — execution protocol

2026-10-29, baseline e50e978, Sail-only runtime. No production source/test fixes.

## Backend

```bash
./vendor/bin/sail artisan test --log-junit docs/audit/project-audit/evidence/tests-backend.junit.xml
./vendor/bin/sail php -d pcov.enabled=1 -d pcov.directory=/var/www/html/app vendor/bin/phpunit --coverage-clover docs/audit/project-audit/evidence/tests-coverage.xml
```

Both exit 0, 306 tests / 2997 assertions / 0 failures/errors/skips. Normal JUnit
19.636s, Laravel wall20.02s; coverage21.927s. Two unique PDO constant deprecations
(BE-007); Laravel lists295 deprecated and11 passed. No all-green-without-warnings
claim. PCOV covers app only; no branch coverage or agreed threshold.

Configured composer test includes config:clear then artisan test. Initial attempt
`composer test -- --log-junit ...` failed because Composer also passed --log-junit
to config:clear; no backend tests ran in that attempt. Corrected command above
executes the same suite and saves JUnit. No Composer script was changed.

## Frontend and build

```bash
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run build
./vendor/bin/sail npm run test:e2e -- --list
./vendor/bin/sail npm run test:e2e -- --reporter=json --output=/tmp/project-audit-stage07-browser-results
```

Node exit0:103 passed,0 failed/skipped/cancelled/todo,629.658ms. List:1766 tests,
23 default specs; operational SSR is conditional, not silently included.
Build client+SSR exit0. Existing bootstrap/ssr files were backed up before build
and restored byte-for-byte after temporary renderer shutdown; no SSR artifacts
are included as source changes. Build log was kept under /tmp; summary here.

Initial full Playwright run was interrupted by overlapping output directory
ownership/reset from parallel SSR run (EACCES .playwright-artifacts-8). Its partial
results are NOT counted. Full rerun uses dedicated output above. Ownership of
ignored generated test-results was restored to sail:sail, no test assertions changed.
Final default browser exit0:1766 passed,0 failed/skipped/flaky,1025.554s.
Safe per-test result summary is recorded in tests-browser.json; raw54MB reporter
output with bulky attachments remains outside tracked evidence under /tmp.

## Operational SSR

```bash
./vendor/bin/sail node bootstrap/ssr/ssr.js
./vendor/bin/sail exec -T laravel.test env PLAYWRIGHT_SSR_BASE_URL=http://127.0.0.1 npx playwright test --project=operational-ssr --reporter=json
```

Temporary renderer port13714; Laravel ssr.enabled stays false. Exit1:32 fixture
passed,8 live failed,0 skipped/flaky,14.322s. All live failures:missing server-rendered
marker, same known environment limitation. Renderer stopped by SIGINT afterwards.
Evidence summary removes full HTML/CSRF data; no live SSR pass claimed.

## Infrastructure

```bash
./vendor/bin/sail exec -T laravel.test python3 tests/Infrastructure/test_supervisor_runtime.py
```

Exit1:3 setup failures root!=deploy,0 process assertions verified. Requires production
image/default deploy user; current Sail environment cannot provide that contract.
This is BLOCKED operational verification, not proof of a production Supervisor bug.
Initial shorthand `sail python3` was unsupported; corrected Sail exec ran the test.
No host test fallback. Full safe setup failure details:tests-infrastructure.txt.

## Static and dependency checks

```bash
./vendor/bin/sail node docs/audit/project-audit/evidence/tests-static.mjs
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential --dry-run --format=json
./vendor/bin/sail composer audit --format=json
./vendor/bin/sail npm audit --json
```

Syntax exit0:420 own PHP files,0 failures,6.136s. Formatter exit0:0 files needing
changes,11.498s. Composer audit exit1:one advisory symfony/mime alreadySEC-004;
npm audit exit0:known vulnerabilities0. Raw safe audit/formatter JSON saved alongside.
No PHPStan/Psalm/ESLint/typecheck configured, none installed for checklist purposes.
No frontend formatter configured. Blade compilation separate; syntax script excludes
Blade/generated/vendor/skills/cache, not a full Blade syntax acceptance.

## Data and interpretation

Testing DB/factories/array mail/cache/session and synthetic providers follow
phpunit.xml/current tests; no real charges/messages/provider acceptance. Browser
account endpoints use fixtures. PCOV XML contains source metrics/line numbers,
not source code or secrets. Report JSON summaries preserve test status/title/duration
and safe error summaries; ephemeral raw Playwright HTML/trace payloads stay outside
tracked evidence. Full default run and independent SSR run are separate outcomes.
Diagnostic probes from previous audit stages are not counted as regression tests.
