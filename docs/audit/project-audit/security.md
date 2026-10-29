# Security Audit — 2026-10-29

Этап 04; ветка `project-audit`, исходный commit `45537e0`. Диагностический
аудит выполнен в указанном объёме. Production-код, настройки, dependencies,
существующие tests и внешние сервисы не изменялись.

Новых findings: **P0 — 0, P1 — 2, P2 — 5, P3 — 0**. Все семь — OPEN.
Существующие PEN-001/FE-001/FE-002 не дублируются.

Прочитаны overview, задача, README/реестр project-audit и отчёт frontend.
Задача 04 не задаёт отдельного списка зависимостей; отсутствие отчёта этапа 01
сохраняется как ограничение. Pen здесь не требуется; этап 02 остаётся BLOCKED,
возврат к нему после 1 ноября 2026 года. Этап 05 не начинался.

Selected skills: сначала `php-per-cs3`, затем `laravel-best-practices` с
validation/routing/http-client/error-handling rules. Указанный skill-файл
`rules/security.md` отсутствует; это ограничение набора references, а не
основание пропустить проверки. Поведение сверено с текущими исходниками и
установленными framework/package sources. Attribute-refactor не проводился.

## 1. Authentication

Web guard отделён от MoonShine. Login использует нормализованный email,
`attempt` и `session()->regenerate()`. Logout вызывает invalidate,
regenerateToken и clearHistory. Регистрация не выдаёт trial до email verification.
На account routes установлены auth:web, auth.session, собственная проверка
web_session_version и verified. Sensitive profile actions проверяют текущий
пароль и обновляют hash/remember credentials; session revocation работает
также при file/database session drivers согласно targeted tests.

Password cast — hashed, default bcrypt; правила создания/смены проверяют
min 8 символов и byte limit 72 для bcrypt. Password broker users:
expire 60 минут, throttle 60 секунд. Reset token проверяет framework broker;
recovery UI не подтверждает существование email или успешную доставку.
Подписанные verification URL ограничены сроком и user/hash. Telegram challenge
хранит token/session hashes, действует 10 минут и требует последовательного
consent. Web return signature имеет TTL; Telegram payment return служит
навигацией, не подтверждением оплаты и не авторизацией чужого payment.

Web limiter: identity+IP и общий IP bucket; MoonShine LoginFormRequest содержит
RateLimiter с лимитом 5 попыток. Устойчивость IP buckets зависит от SEC-003.
Локально session cookie: HttpOnly, SameSite=Lax, Secure=false на HTTP;
XSRF-TOKEN намеренно доступен JS. Это не доказательство production cookie flags.
Прод-шаблон содержит APP_DEBUG=false и HTTPS APP_URL; текущие live prod settings
и TLS/cookies не проверялись. Session TTL по default config — 120 минут.

## 2. Authorization

Account routes и FormRequests используют policies/gates. PaymentPolicy проверяет
owner и status/source для retry; return token не заменяет owner session.
SupportTicketPolicy ограничивает customer собственными обращениями, operator
использует отдельный guard. Domain service повторяет capability под lock.
Profile использует текущего session user, а не user_id из input; referral
выдаёт собственные links/aggregate metrics, не список чужих identities.

Device token шифрует owner/remote/hwid; при delete повторно проверяются владелец,
mapping и свежий remote device list. Numeric remote ID из локального mapping
проверяется на совпадение. Чужие/повреждённые tokens отвергаются.

Targeted tests покрыли own/foreign payments, support и devices, profile capability,
unverified и разделение guards. **SEC-002:** это не распространяется на
системные MoonShine resources: default withPolicy=false и отсутствие custom
authorization rules допускают role 2 к admin-management форме. Воспроизведены
`can(CREATE)=true` и HTTP 200 формы с role selector. Создание реального
суперадминистратора и изменение действующих ролей не выполнялись.

Гостевой `/admin` перенаправляет (302); `/log-viewer` в локальном probe вернул
500 без доказательства выдачи логов. Это не считается успешной проверкой
штатного guest redirect log-viewer. Полный RBAC matrix и этот error path
требуют дальнейшей проверки в согласованном remediation scope.

## 3. Input Validation

Проверены FormRequests Auth/Profile/Support/Payment/Device, validated/safe data
и повторная авторизация domain operations. Broad fillable User/Payment сам
по себе не доказывает mass-assignment exploit: открытые endpoints выбирают
поля явно. Попытки подменить owner/amount/author покрыты existing feature tests.
В SQL-просмотре `LOWER(title) = ?` параметризован; прямое включение user input
в raw SQL в изученных HTTP потоках не найдено.

Vue interpolation и Blade `{{ }}` экранируют customer messages; raw v-html/
Blade output для этих данных не обнаружены. Existing support tests проверяют
escaping. CSRF исключение ограничено YooKassa webhook; sensitive browser POST/
PATCH/DELETE остаются под request-forgery middleware. Проверки CSRF, которые
явно включают middleware в tests, входят в targeted suite; обычный PHPUnit
запуск сам по себе не подтверждает CSRF (framework отключает его в tests).

Outbound Remnawave endpoint берётся из config, не из request URL. Сервер не
загружает произвольный subscription URL пользователя: он выдаётся владельцу
как ссылка после проверки схемы/credentials. SSRF через произвольный input URL
в просмотренных публичных потоках не найден; egress/DNS инфраструктуры не тестировались.
PHP unserialize/eval/shell execution на HTTP input не найдены в просмотренных
app/routes. Это ограниченный source review, не доказательство отсутствия
gadget chains во всех dependencies. Queue serialization не принимает произвольный
публичный payload как объект.

Customer upload endpoint не найден; административный avatar ограничен image/
mimes и allowedExtensions jpg/png/jpeg/gif. Image storage served from public
disk, production execution rules/path isolation на сервере не проверены.
Локальные `/.env`, `/.git/config`, `/composer.json`, encoded traversal вернули
404, `/storage/logs/laravel.log` — 403. Bodies/secret values не сохранялись.

## 4. Payment Security

Product/price/period/currency рассчитываются сервером. FormRequest принимает
product_id, promo и validated idempotency header; amount/user_id не задаются
покупателем. WebPaymentPurchase сверяет reuse key с owner/product/source/promo
под lock, повторяет проверки активного продукта/плана, проверяет promo ownership.
История/status/retry доступны через PaymentPolicy.

Webhook source проверяется по IP. **SEC-003:** wildcard trusted proxies
позволяет произвольному direct peer подставить разрешённый XFF. Probe сравнил
403 без XFF и 500 parser error с тем же пустым body и подставленным XFF:
подтверждён проход IP gate, а не успешная обработка платежа.

Второй независимый барьер сохранён: PaymentNotificationHandler читает provider
state через аутентифицированный YooKassa client и проверяет id/status до
бизнес-эффектов. Неизвестные payments игнорируются. Поэтому SEC-003 не является
доказательством возможности начислить подписку по поддельному JSON.
Successful processing защищён claim/row lock, а remote extension сохраняет
абсолютную retry target. Duplicate/concurrent/canceled/stale-notification и
retries покрыты targeted tests. Return URL лишь выбирает UI и не меняет status.
Реальная оплата, webhook от провайдера и production proxy chain не проверялись.

## 5. Telegram Security

Default webhook идентифицирует bot по secret path token. linking flow дополнительно
проверяет private chat, sender id, non-bot sender, одноразовый challenge,
bot id, TTL и originating browser session hash; merge ownership сохраняется
под lock. Повторный callback, чужой bot/session и self-referral проверяются tests.
Payment buy использует callback sender, серверный product и promo checks;
idempotency key выводится из callback id.

**SEC-005:** app config/middleware используют `telegraph.webhook.secret`,
но установленный Telegraph 1.73 registerWebhook default читает
`telegraph.webhook.secret_token`. Probe на synthetic bot подтвердил отсутствие
secret_token в исходящем payload и 403 входящего linking запроса без header.
Настройка TELEGRAPH_WEBHOOK_SECRET без явного CLI `--secret`/другой регистрации
может заблокировать legitimate linking. Текущий webhook в Telegram не читался
и не перерегистрировался. Вне linking default path-token auth остаётся;
не заявляется anonymous bypass при неизвестном bot token.

Bot token хранится в БД Telegraph и доступен в разрешённых admin forms;
это усиливает последствия SEC-002 и требует контроля DB/backups.
**SEC-006:** secret URL paths и query tokens не маскируются Caddy access log.
Middleware отключает Telegraph debug именно для linking, но это не редактирует
reverse-proxy URI logs. Сами журналы с реальными токенами не читались.

## 6. External API Security

Проверен текущий локальный Remnawave contract 3.4.3 и owner-facing интеграционный
слой: фиксированный base URL, Bearer authorization, encoded path parameters,
identity/device consistency checks, ограниченные timeouts на account reads.
Malformed/mismatched remote data переводится в service error; private API error
не попадает в Inertia props. SubscriptionUrl допускает только http(s) без
userinfo; raw API keys/HWID/IP не выдаются пользователю вместо safe props.
Subscription status/expireAt берутся из Remnawave, а не из client input.

**SEC-001:** найденные tracked operational configs содержат privateKey и
credential literals. Четыре privateKey декодируются в 32 bytes. Активность
ключей/credentials и использование этих шаблонов в deployment не проверялись.
Сканер сохраняет только file/line/field и booleans — без secret values/hashes.
Не все literal-поля считаются живыми secrets: has_template_marker отдельно
помечает очевидные шаблоны. Нужны owner review и согласованная rotation.

## 7. Configuration

Production Caddy root — `/app/public`, HTTPS задаётся hostname block, app
forceScheme('https') включён в production. Это source evidence, не TLS scan.
Default app.debug=false и `.env.prod.example` false; фактический production
error output не проверен. Локальный debug endpoint не использован как основание
объявить production debug leak.

CSP/X-Frame-Options/nosniff/HSTS/referrer-policy в локальном `/login` не получены;
в shipped Caddyfile дополнительные header policies не заданы. Это наблюдение
для hardening review, без доказанного exploit и без утверждения о live edge.
ACAO в локальных ответах отсутствует; отдельного permissive CORS config в
проверенных app настройках нет. Полная cross-origin matrix не выполнялась.

`.gitignore` покрывает обычный `.env` и runtime keys, но не уже tracked
operational secret files — SEC-001. **SEC-006:** access log console → stdout
без URI filtering. **SEC-007:** production Compose публикует PostgreSQL
`${DB_PORT}:5432` без host IP; для app уже есть внутренняя network.
Host firewall, cloud security groups и фактический внешний доступ не проверялись.
Caddy/HTTP cookie production acceptance и сетевой perimeter остаются отдельными
операционными проверками.

## 8. Dependencies

Проверены actual lockfiles и установленные packages: Laravel 13.38.0,
Telegraph 1.73.0, MoonShine 4.20.0, YooKassa SDK 3.16.0, symfony/mime 8.1.7.
Runtime probes: PHP 8.5.12 / PHPUnit 12.5.40.

| Проверка Sail | Результат |
|---|---|
| `composer audit --locked --format=json` | exit 1; 1 medium advisory; abandoned пуст |
| `npm audit --json` | exit 0; известных vulnerabilities 0; total dependencies 166 |
| 14 targeted Feature classes | exit 0; 192 tests, 2029 assertions, deprecations |
| `php vendor/bin/phpunit .../SecurityProbeTest.php` | exit 0; 3 tests, 10 assertions, 2 PHP deprecations |
| PHP CS Fixer scoped to diagnostic artifact | exit 0, 0 changed files |
| Static credential scan / local HTTP metadata probe | exit 0; redacted JSON рядом |

**SEC-004:** composer.lock содержит symfony/mime 8.1.7, затронутый
CVE-2026-45070 / GHSA-vqc8-7275-q272. Эксплуатация требует влияния на имя
MIME parameter; такого app input path в просмотренных notifications не найдено.
Это подтверждённая уязвимая dependency, не доказанный удалённый app exploit.
Официальный advisory указывает patch 8.1.10; ранние версии, ошибочно объявленные
patched в агрегаторах, использовать как target нельзя.
[Advisory Symfony](https://github.com/symfony/symfony/security/advisories/GHSA-vqc8-7275-q272).

Автоматические update/fix не выполнялись. При remediation — минимальный
совместимый patch с повторным audit и mail/auth regression, без major migration.
Absence of npm advisories не доказывает безопасность всех JS paths; abandoned
пуст не заменяет ручную проверку support lifecycle каждого transitive пакета.
Два PHP 8.5 deprecations (`config/database.php:62,82`) относятся к
PDO::MYSQL_ATTR_SSL_CA, не классифицированы как самостоятельная уязвимость.

## 9. Security Findings

| ID | Priority | Status | Подтверждённый факт |
|---|---|---|---|
| SEC-001 | P1 | OPEN | Private keys/credential literals в tracked operational configs |
| SEC-002 | P1 | OPEN | Non-superuser допущен к созданию admin identities |
| SEC-003 | P2 | OPEN | Произвольный direct peer может spoof IP через trusted XFF |
| SEC-004 | P2 | OPEN | symfony/mime 8.1.7 попадает под актуальный advisory |
| SEC-005 | P2 | OPEN | Registration secret key не совпадает с app verification key |
| SEC-006 | P2 | OPEN | URI access logs не редактируют bearer tokens |
| SEC-007 | P2 | OPEN | Production Compose публикует PostgreSQL без bind address |

Подробные условия, impact, locations и verification steps — в едином
`findings.md`. Порядок remediation не утверждён; fixes/rotation/deploy не выполнялись.

## 10. Limitations

- Только локальный Sail и testing DB; внешние HTTP интеграции в probes запрещены.
  Existing provider tests используют fakes/mocks; live acceptance не заявляется.
- Probes утверждают unsafe current behavior для доказательства findings;
  их PASS не означает, что перечисленные уязвимости исправлены.
- Не проверены production secrets validity, firewall, proxy sanitation,
  TLS/security headers, production cookie/error output, реальные mail/Telegram flows.
- Scan credential literals ограничен operational Remnawave configs; дополнительно
  проверены tracked filenames/.gitignore и source logging. Полный forensic
  анализ всей Git history, всех backups и всех файлов на секреты не выполнялся.
- Log-viewer guest GET вернул 500; доступ к содержимому логов не доказан.
  Heap/SAST/fuzzing, полноценный pentest всех vendor/admin CRUD и image decoders
  не проводились; эти области не объявлены безопасными.
- HTTP probe сохраняет только statuses/header flags/cookie flags; тела и реальные
  token values не записаны. Документы также не содержат найденных secret values.

Источники для интерпретации config: [Laravel trusted proxies](https://laravel.com/framework/docs/13.x/requests#configuring-trusted-proxies),
[Caddy request logging](https://caddyserver.com/docs/caddyfile/directives/log).
Все выводы о checkout перепроверены по текущим исходникам, не перенесены из
старых audit/memory snapshots как актуальные факты.

## Follow-up — stage 08

SEC-001 и SEC-002 исправлены в этапе 08 (FIXED, не VERIFIED); по SEC-001 владелец подтвердил неиспользуемые тестовые значения. Подробности, команды и ограничения: [critical-fixes.md](critical-fixes.md). Исторические результаты диагностики выше не переписывались.

## Follow-up — stage 09

SEC-003–007 обработаны в этапе09, composer advisory устранён patch update; actual isolated Caddy error/access redaction passed. Production network/webhook rollout ещё требуется. См. [refactoring.md](refactoring.md), source fixes FIXED, не VERIFIED.
