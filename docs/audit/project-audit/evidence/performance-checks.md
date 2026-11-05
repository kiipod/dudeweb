# Performance audit — reproduction

2026-10-29, branch project-audit, base e564464. All project commands inside Sail.

```bash
./vendor/bin/sail npm run build:client
./vendor/bin/sail node docs/audit/project-audit/evidence/performance-environment.mjs
./vendor/bin/sail node docs/audit/project-audit/evidence/performance-browser.mjs
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential docs/audit/project-audit/evidence/PerformanceProbeTest.php
./vendor/bin/sail php vendor/bin/phpunit docs/audit/project-audit/evidence/PerformanceProbeTest.php --log-junit docs/audit/project-audit/evidence/performance-probe.junit.xml
```

Build success, 738 transformed modules, 4.20s. Browser script completed 12 samples
(2 routes × 2 widths × 3), all HTTP 200, no submissions or application mutations.
INP unavailable: empty Event Timing interaction entries are not a zero result.
No network/CPU throttling; fresh browser contexts, shared local server/cache.

Final PHP probe: 1 test / 14 assertions / 0 failures / 0 errors / 2 deprecations,
2.171s; existing PDO MYSQL_ATTR_SSL_CA warnings, BE-007. Earlier invalid synthetic
DTO and wrong coverage field assumptions were corrected; those attempts are not
used as successful evidence. PHP-CS-Fixer: 0 files fixed in final formatting run.

Generated evidence:

- performance-environment.json: selected driver/config names, versions, shared resources;
- performance-browser.json: navigation timing, observed LCP/CLS, resources, functions coverage, scroll intervals;
- performance-backend.json: parameterized SQL texts without bindings, counts/timing, testing EXPLAIN, fake 429 outcomes;
- performance-probe.junit.xml: final diagnostic assertions;
- scripts alongside JSON preserve exact methodology.

PHP uses RefreshDatabase/testing and synthetic factories; live DB is only read
for version() by environment collection. No real provider mutations, charges,
messages, secrets or user rows are recorded. Plan/runtime/config/production source
remain untouched apart from diagnostic docs/evidence and task status. No SSR build,
no generated SSR changes, no dependencies installed. Whole-suite audit is stage07.

Limitations: this is local sampling, not field Web Vitals or production load;
rounded performance.memory is not a heap profile; query samples use unmapped
subscription owner/empty catalogue and one shared product; EXPLAIN uses a small
synthetic table, not production distribution. No benchmark claim for live provider
latency, concurrency, deep pagination, delivery, GPU/physical mobile or sustained
memory use. Targets and findings are detailed in ../performance.md.
