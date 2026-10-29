# Stage 09 — P2/P3 refactoring and fixes

Дата: 2026-10-29. Branch `project-audit`, base `3ff3b24`.
Этап 08 перед началом сохранён отдельными коммитами: SEC-001 `f78ef04`,
SEC-002/TEST-001 `6709fc0`, BE-008 `8182155`, BE-001 `fb8f13f`, отчёт `3ff3b24`.
Посторонние `.env.example` / `.env.prod.example` в эти коммиты не включены и
этим этапом не менялись.

## Scope and dependencies

По указанию пользователя перейти к следующему шагу обработаны оставшиеся 15
OPEN P2/P3: SEC-003–007, BE-002–007, FE-001/002, PERF-001/002. Прочитаны план 09,
overview, registry, backend/frontend, pen-design и performance reports. P1 source
fixes этапа 08 сохранены; VERIFIED/production acceptance там ещё не заявлены.

Pen MCP не вызывался: PEN-001 BLOCKED, повторный доступ после 1 ноября по
договорённости с владельцем. Новых визуальных расхождений не придумывали; дизайн,
`.pen`, responsive tokens и изображения не менялись. Этап 01 также остаётся открыт.

Skills: php-per-cs3, laravel-best-practices, vue-best-practices; существующие
semantic tokens/shared components сохранены, Tailwind guidance учитывался при
review UI. TypeScript, новые dependencies и generic Service/Action/Interface
layers не добавлялись. Единственное dependency изменение — patch symfony/mime.

## Decisions per finding

Все строки ниже имеют итог **FIXED**, не VERIFIED. Source commits этапа09 созданы по указанию пользователя; mapping указан ниже.

| ID | Файлы / решение | Проверка / ограничения |
|---|---|---|
| SEC-003 | bootstrap/app.php: TRUSTED_PROXIES — explicit comma-separated IP/CIDR list, default только loopback; production Compose требует явное значение | Direct peer с fake XFF/XFP не меняет ip/secure; trusted fixture proxy доставляет provider IP. Production сеть не инспектировалась/не менялась. |
| SEC-004 | composer.lock: symfony/mime 8.1.7 → 8.1.10, остальные package versions сохранены | Composer audit без advisories; полный auth/mail/payment backend regression, без реальной рассылки. Composer обновил также format metadata lock. |
| SEC-005 | config/telegraph.php и VerifyTelegramLinkWebhook используют webhook.secret_token установленного SDK | Default registration payload содержит synthetic secret; inbound matching/missing/incorrect/headerless режимы покрыты TelegramAccountLinkTest. Live setWebhook не вызывался. |
| SEC-006 | docker/caddy/Caddyfile: общий redacted_log_format для access и default runtime logs | Caddy 2.10.2 adapt + isolated runtime, включая gateway error; synthetic URI/query/Referer tokens отсутствуют, method/host/status остаются. |
| SEC-007 | docker-compose-prod.yml: host publication PostgreSQL удалена | App/DB остаются на внутренней сети. Deployment/firewall scan не выполнялся; внешний admin доступ требует отдельного согласованного transport. |
| BE-002 | Новый RemoteUserMapping, переиспользован lifecycle/device services | Numeric identity first, совместимый legacy fallback, отказ conflicting mapped username; web-only account участвует в обоих batches. Eager relation loading сохранён. |
| BE-003 | PaymentCreator::resolveMonths использует Product.months, отсутствующий/неположительный срок отклоняется | Telegram label «30 дней» при months=1 резервирует 1 month. Два existing fixtures с названием «3 месяца» теперь явно задают months=3; assertions не ослаблялись. Legacy nullable products требуют явного периода до покупки. |
| BE-004 | PaymentCreator разделяет reservation и submit; immutable provider_request + provider_request_expires_at | Повтор после изменения price/return URL отправляет идентичные payload/key и сумму. После гарантированного окна или без legacy snapshot POST не повторяется; нужна сверка. |
| BE-005 | provider_creation_failed_at / creation_resolution и payments:reconcile-creation | Unknown outcome не отменяется по возрасту. Operator может связать verified provider ID или явно подтвердить отсутствие после merchant investigation; legacy rows без новых markers поддержаны. Реальная сверка не выполнялась. |
| BE-006 | Null-safe log-viewer callback использует moonshine guard; UI middleware включает web session | Guest получает controlled denial, operator 403, superuser 200; callback больше не вызывает null member Error. |
| BE-007 | config/database.php использует Pdo\\Mysql::ATTR_SSL_CA установленного PHP 8.5 | Финальный полный backend без прежних двух deprecations. SSL option не удалён; реальное MySQL подключение не выполнялось. |
| FE-001 | ProfileTelegram.vue: local refresh error, handled network/HTTP failures, cancellation/unmount, retry | 4 новых browser cases: network/503/401/403, inline alert, retry → ready, alert cleared; focus dedup/partial reload/DELETE сохранены. |
| FE-002 | Profile/Subscription pages: удалены unused required declarations, inheritAttrs=false | Server fields пока сохранены для совместимости; одинаковый initial markup и единый theme store. Full account/browser/SSR fixtures прошли. |
| PERF-001 | app.js: lazy import.meta.glob page resolver, shared chunks остаются Vite-managed; SSR resolver eager | 16 page dynamicImports; фактический JS login уменьшился, не только entry. CSR/navigation/history и fixture hydration прошли. |
| PERF-002 | BaseApi сохраняет Retry-After в ApiException; device service defers provider-scoped cache cooldown | Numeric/date/malformed header tests, остановка page после первого 429, последующий run без HTTP до TTL. Failed=1 сигнализирует deferral; safe warning пишет только seconds. |

## Backend architecture and transaction boundaries

RemoteUserMapping устраняет два расходящихся lookup алгоритма. Запросы bounded
размером stream page, numeric/chat/username lookup выполняется одним SELECT;
загруженные payment/product/plan relations остаются eager. Legacy fallback не
присваивает remote user локальному аккаунту с другим numeric mapping.
Telegram-only reminder workflow не переписывался массово.

PaymentCreator сохраняет invoice под owner row lock и request snapshot под
payment row lock **до** SDK POST. SDK вне DB transaction. Повторы читают snapshot,
а не новый каталог. provider_request и creation_resolution скрыты из generic
Payment serialization, Inertia readers продолжают выбирать безопасные columns.
Новая миграция `2026_10_29_211351_add_provider_request_recovery_to_payments.php`
добавляет nullable JSON/timestamptz поля; старые миграции и данные не переписаны.

[YooKassa гарантирует идемпотентность 24 часа](https://yookassa.ru/developers/using-api/interaction-format).
Срок snapshot отсчитывается консервативно до первого POST и хранится в UTC.
Неизвестный результат после expiry, а также legacy intent без надёжного snapshot
не получает новый POST/новый срок гарантии. Provider ID, уже сохранённый для
проверенного invoice, возвращается прежним путём. Фиксированный key нельзя
объявлять вечной защитой от двойного платежа.

ReconcilePaymentCreation — узкий operator command, а не новый REST/UI API.
Provider-id branch reread SDK проверяет id, metadata payment/user/product/source,
amount/currency/status перед привязкой; при terminal state используется прежний
PaymentService/provider verification/processor. При mismatch нет записи.
Confirmed-absent branch **не проверяет отсутствие автоматически**: это доверенное
подтверждение оператора с обязательным audit reference. Состояние становится
Canceled, сохраняя snapshot/evidence; тогда прежний Pending merge blocker снят.
Ни timeout, ни old age не являются доказательством отсутствующего платежа.

Для ручной сверки остановить competing creation/merge/retry workers и проверить
merchant history, затем выполнить в согласованном app runtime один из вариантов:

```text
php artisan payments:reconcile-creation <local-id> --provider-id=<verified-id> --reason=<audit-reference>
php artisan payments:reconcile-creation <local-id> --confirmed-absent --reason=<merchant-investigation-reference>
```

Не передавать secret values в reason/CLI history. Команда использует user/payment
row locks, запрещает processing claim/merge/wrong state. Она не заменяет
операторскую сверку и не предоставляет общей транзакции с провайдером. Реальных
charges/refunds/cancellations и production reconciliation не выполнялось.

## Network, logs and deployment contract

Production Compose теперь fail-closed без explicit TRUSTED_PROXIES. Перед deploy
задать фактические IP/CIDR доверенного ingress, не `*`, проверить REMOTE_ADDR,
forwarded chain, HTTPS и provider webhook на staging. Default local loopback —
не утверждение о production Docker subnet. Host DB port больше не публикуется;
внутренний DB_HOST/service transport сохранён.

Caddy [filter encoder](https://caddyserver.com/docs/caddyfile/directives/log)
применён к access **и** runtime errors. Намеренно выбрана полная замена URI на
REDACTED и удаление Referer вместо попытки перечислить все будущие bearer URL.
Tradeoff: path/query diagnostics в access logs недоступны; method/host/status/bytes
сохраняются, route/action diagnostics следует получать без credentials из app
logs. Не включался log_credentials. Проверено пять synthetic request cases и
семь request-bearing log records, в том числе реальный локальный 502 proxy error.
Production Caddy не запускался; binary извлечён из stopped image и тестировался
внутри Sail на отдельном listener, без real tokens/ACME.

После deployment config changes нужен обычный cache rebuild/restart workers;
Telegram default registration с secret_token реализована, но live webhook нужно
перерегистрировать отдельно при согласованном rollout. Автоматической внешней
регистрации не было. Новый payment schema должен применяться перед новым кодом.
Не откатывать recovery columns после начала их использования; prefer forward fix.

## Before / after measurements

Baseline: e50e978 performance evidence этапа 06; after: отдельные refactor-* файлы.
Старые baseline JSON не перезаписывались. Bytes — фактически загруженные JS chunks,
сумма их disk size/gzipSync; это не HTTP Content-Encoding budget.

| Scenario | Before | After | Интерпретация |
|---|---:|---:|---|
| Cold login loaded JS | 412950 bytes | 236479 bytes | −42.73%, 11 реально загруженных chunks вместо общего graph |
| Cold login computed gzip | 122796 bytes | 82417 bytes | −32.88%; shared dependencies включены в сумму |
| Landing loaded JS | 412950 bytes | 274016 bytes | −33.64%, общий runtime + landing graph |
| Entry CSS / login global CSS | 147855 bytes | 137075 bytes | Landing CSS вынесен в route chunk; общий стиль landing не объявлен удалённым |
| HWID calls при 10 eligible/429 | 10 | 1 | −90% в том же fake page; во время cooldown повторный run не делает запросы |
| Subscription queries / 1→40 rows | 7→7 | 7→7 | N+1 не введён, page max10 сохранён |
| Referral queries / 1→40 rows | 2→2 | 2→2 | Aggregate contract сохранён |
| Device batch local queries | 4 | 4 | Eager loading сохранён |

12 after navigation samples, 390/1440, fresh contexts, no throttling. Они снимались
параллельно с full Playwright run: wall-time Web Vitals нельзя честно объявить
улучшенными из сравнения такого CPU/network contention. Сравнение bundle bytes и
числа fake requests детерминировано; нового численного SLA не вводили. INP не
объявлен измеренным, production load и physical mobile не проводились.

Retry-After default при malformed/missing header —60s; numeric/date поддержаны.
Проверен single-worker synthetic batch. Уже in-flight calls других workers не
выдаются за отменённые; реальная provider quota/distributed concurrency не
измерялась. Cache хранит cooldown, не устаревший provider subscription truth.

## Verification

- Backend full: **331 tests / 3104 assertions**, failures/errors/skips=0, **без
  deprecations**, Laravel wall20.14s / JUnit19.940s. После safe deferral logging
  targeted RefactoringRegressionTest: 14 tests/43 assertions passed.
- Frontend unit/SSR: **103 passed**, failed/skipped/cancelled/todo=0.
- Main Playwright: **1770 passed**, failed/skipped/flaky=0, 1053.378s (~17m33s).
- Operational SSR: **32 fixture passed / 8 live failed**, skipped/flaky=0;
  current isolated renderer on13715 и lazy client hydrate in place. Основной HTTP
  endpoint не содержит SSR marker; этот известный acceptance gap не исправлялся
  произвольным config change и не считается успешной live SSR проверкой.
- Client+SSR build PASS. Собственный temporary renderer остановлен, test copy
  удалена, исходные generated SSR восстановлены из backup; пользовательские
  процессы/настройки не останавливались.
- PHP syntax:429 files/0 failures. Scoped PHP-CS-Fixer dry-run:0 files to change.
- Composer audit:0 advisories, npm dependencies не менялись. Caddy actual adapt/
  isolated log test PASS, без credential values в evidence.
- Performance probe after:1 test/14 assertions PASS, без предупреждений.

Existing fixtures обновлены только там, где прежние неявные предположения
противоречили explicit period/proxy contract; проверки месяцев/доставки не
ослаблялись. Runtime только Sail. Незавершённые ранние попытки SDK fixture/date
и Caddy test handler order не выдаются за финальный результат. Ephemeral raw
Playwright output с HTML/attachments остаётся вне Git; evidence summaries сохраняют
status/title/duration. Полные команды: [refactor-checks.md](evidence/refactor-checks.md).

## Status and next boundary

15 findings переведены OPEN → FIXED; вместе с этапом 08 теперь **20 FIXED,
1 BLOCKED (PEN-001), 0 OPEN**, все21 ID сохранены. VERIFIED не присвоен.
Новых findings P0/P1/P2/P3 —0. Исторические отчёты не переписаны под новые исходы.

Scope не включает произвольное дробление классов, неподтверждённые N+1/index/image
оптимизации, новый дизайн, актуальную live Pen сверку или acceptance внешних
сервисов. Логические части этапа09 сохранены отдельными коммитами по указанию пользователя.
Ваши env-примеры сохранены отдельно. Этап 10 не начат, 01/02 не закрыты заочно.

## Source commits

- BE-003: `409e2a4`.
- BE-004: `409e2a4`.
- BE-005: `409e2a4`.
- BE-002: `0133a3f`.
- PERF-002: `0133a3f`.
- SEC-003: `e28cb1c`.
- SEC-007: `e28cb1c`.
- SEC-006: `3711b79`.
- BE-006: `3711b79`.
- SEC-005: `03d25b2`.
- SEC-004: `b6a18bd`.
- BE-007: `c817626`.
- FE-001: `19ee7bf`.
- FE-002: `19ee7bf`.
- PERF-001: `667c002`.

Перед коммитами14 regression cases без изменения assertions разделены по PaymentCreationRecoveryTest, BatchIdentityAndCooldownTest, IngressTrustTest, LogViewerAuthorizationTest и TelegramWebhookConfigurationTest; focused run14/43 passed. Более ранние evidence с именем RefactoringRegressionTest остаются историческими.
