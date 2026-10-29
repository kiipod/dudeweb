# Production SSR preparation — verification

2026-10-29. Branch `project-audit`, base `34ae23e`; changes recorded as
`fix: supervise production Inertia SSR runtime`.
This is a focused follow-up to the audit, not a new production acceptance claim.
Historical stage10 results in `docs/audit/project-audit/` remain unchanged.

## Changes

- Supervisor owns one real Node renderer, automatic restart, TERM/group cleanup,
  priority5 keeps SSR alive until PHP-FPM(priority10) and scheduler(priority20) stop.
- Production Compose pins Laravel SSR enabled/URL and renderer port to loopback13714;
  no SSR port publication. Renderer now explicitly binds127.0.0.1.
- Container health checks renderer and build artifacts; explicit URL smoke checks
  SSR HTML for four real public endpoints without dumping response bodies.
- Make targets run inside app and control Supervisor; deployment documentation
  covers dependencies, build, cache, recreate/restart, acceptance and diagnostics.
- Existing scheduler/FPM test isolates its original two processes, while the new
  SSR suite independently verifies the actual renderer and browser hydration.

## Results

| Check | Result |
|---|---|
| `./vendor/bin/sail npm run build` | PASS client + SSR |
| `./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js` | PASS103,0fail/skip;621.129663ms |
| `./vendor/bin/sail exec -T -u sail laravel.test python3 tests/Infrastructure/test_ssr_runtime.py` | PASS4 lifecycle/integration tests,23.371s |
| Browser run inside isolated integration test | PASS40,0unexpected/skip/flaky;10.987742s |
| Supervisor crash restart | PASS PID changed, health recovered |
| Renderer stop/start health | PASS failure detected then recovery |
| Renderer bind | PASS /proc/net/tcp loopback-only listener |
| Supervisor SIGTERM | PASS exit0, child PID absent, port reusable |
| Healthy renderer + HTTP200 client-only fixture | PASS smoke rejects absent SSR marker |
| `node --check scripts/check-ssr.mjs` through Sail | PASS |
| Python AST parsing for both infrastructure test files through Sail | PASS |
| Production Compose config parse inside Sail with synthetic env | PASS SSR enabled/URL/port/healthcheck and no app/DB published ports |
| `docker build -f docker/app/Dockerfile -t dudeweb-ssr-verification:local .` | PASS production image build, Node version check under deploy |
| `git diff --check` | PASS |

Browser started2026-10-29T19:28:17.670Z. Runtime tests run only through Sail as
unprivileged `sail`; Supervisor policy is read from the real production config,
with only executable/root/socket/log/port isolated. PHP-FPM/scheduler are excluded
from the SSR test so no real business jobs run. Laravel HTTP uses testing DB,
array cache/session/mail and sync queue, SSR throw_on_error=true only in that
isolated test. No external messages, charges, webhook registration or migrations
against production. Browser raw HTML/attachments stay in temporary directories
and are removed by test cleanup. An initial harness attempt left three child PHP
HTTP listeners after terminating their Artisan parents; fixed with an isolated
process session and SIGTERM to its full process group. Confirmed test orphans
were removed by exact PID/port/command; final run left no new HTTP listeners.
Reading their environ was denied by PHP process protections; no sensitive
environment data was emitted. Existing main/18080 listeners were not touched.

Compose parser5.6.1 comes from the previously installed standalone tool under
ignored storage/app/audit-docker-compose-stage10; only configuration parsing
inside Sail, synthetic env, no service operation. No dependency added.

Production image build output digest:
`sha256:4286a24608d3985a0a3b471579bff9851b4646e924d9b43d427833fd56338c96`.
Build itself checks Node24.22.1/npm under image USERdeploy. Actual combined
PHP-FPM/scheduler/SSR process execution in that Alpine image was not run; lifecycle
and HTTP/hydration evidence is from Sail. Existing production-image-only scheduler
suite was not rerun under an incompatible Sail user and is not reported PASS.
No complete backend/default1770browser rerun: no PHP/business/UI behavior changed;
focused real SSR integration and frontend regression used instead.

## Remaining deployment acceptance

No production deployment, env/config-cache mutation, production restart or public
production domain smoke was performed. Operator must build/recreate with current
source, dependencies and assets, check three RUNNING programs/healthy status,
run `make ssr-check` and `make ssr-smoke SSR_BASE_URL=https://your-domain`, then
confirm browser hydration on the deployed release. See [ssr.md](ssr.md).
The existing main local endpoint was not restarted or repaired; audit8failures
remain historical and its effective SSR runtime remains a separate diagnosis.
Pen and other audit blockers are not closed by this work.

Generated tracked SSR artifacts restored to pre-task bytes after checks; they are
not source changes to commit. Existing user processes left running; only isolated
test processes started/stopped. Commit explicitly requested by the owner after
verification; no deployment or new memory update performed.
