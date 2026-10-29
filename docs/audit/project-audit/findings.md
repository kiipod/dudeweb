# Project Audit — Findings

## Summary

Обновлять после каждого диагностического этапа.

| Priority | Open | In Progress | Fixed | Verified | Blocked |
|---|---:|---:|---:|---:|---:|
| P0 | 0 | 0 | 0 | 0 | 0 |
| P1 | 4 | 0 | 0 | 0 | 0 |
| P2 | 13 | 0 | 0 | 0 | 1 |
| P3 | 2 | 0 | 0 | 0 | 0 |

Значения пересчитывать по реальным записям.

## Findings Register

| ID | Priority | Area | Location | Summary | Status |
|---|---|---|---|---|---|
| PEN-001 | P2 | Pen Design / Audit environment | Pen MCP | Источник дизайна недоступен из-за лимита тарифа | BLOCKED |
| FE-001 | P2 | Frontend | ProfileTelegram.vue:31 | Refresh Telegram не показывает локальную transport-ошибку | OPEN |
| FE-002 | P3 | Frontend / Contracts | Account/Profile.vue:12; Account/Subscription.vue:11 | Неиспользуемые обязательные props | OPEN |
| SEC-001 | P1 | Secrets / Configuration | app/Remnawave/Config/vless-reality-angie.json:35 | Credential literals и private keys в tracked operational configs | OPEN |
| SEC-002 | P1 | Authorization / MoonShine | app/MoonShine/Resources/MoonShineUser/MoonShineUserResource.php:24 | Non-superuser получает admin-management capability | OPEN |
| SEC-003 | P2 | Network trust / Webhook / Rate limiting | bootstrap/app.php:30 | Wildcard trusted proxies размывает source-IP boundary | OPEN |
| SEC-004 | P2 | Dependencies / MIME | composer.lock:5015 | symfony/mime 8.1.7 содержит известную уязвимость | OPEN |
| SEC-005 | P2 | Telegram / Webhook configuration | config/telegraph.php:62 | Telegram webhook registration и verification читают разные secret keys | OPEN |
| SEC-006 | P2 | Logging / Secrets | docker/caddy/Caddyfile:9 | Access logs не маскируют bearer tokens в URI | OPEN |
| SEC-007 | P2 | Deployment / Network exposure | docker-compose-prod.yml:47 | Production Compose публикует PostgreSQL без host bind restriction | OPEN |
| BE-001 | P1 | Backend | app/Payment/SubscriptionExtender.php:59 | Повтор старого платежа сокращает более новую подписку | OPEN |
| BE-002 | P2 | Backend | app/Services/UserLifecycleSynchronizationService.php:118 | Batch mapping пропускает web-only numeric identities | OPEN |
| BE-003 | P2 | Backend | app/Payment/PaymentCreator.php:130,257 | Telegram duration определяется цифрами display name | OPEN |
| BE-004 | P2 | Backend | app/Payment/PaymentCreator.php:54 | Retry с прежним ключом пересчитывает provider amount | OPEN |
| BE-005 | P2 | Backend | app/Payment/PaymentCreator.php:114 | Неудачное создание invoice оставляет бессрочный merge blocker | OPEN |
| BE-006 | P2 | Backend | app/Providers/AppServiceProvider.php:107 | Guest log-viewer вызывает null member Error | OPEN |
| BE-007 | P3 | Backend | config/database.php:62,82 | PHP 8.5 bootstrap использует deprecated PDO constants | OPEN |
| BE-008 | P1 | Backend | database/migrations/2025_12_15_100431_create_user_promocodes_table.php | UNIQUE promocode_id запрещает второй usage общего промокода | OPEN |
| PERF-001 | P2 | Performance / Frontend | resources/js/app.js:18 | Все страницы входят в initial JS graph через eager import | OPEN |
| PERF-002 | P2 | Performance / External API | app/Services/DeviceLimitEnforcementService.php:120 | Batch продолжает HWID requests после 429 без cooldown | OPEN |

Подробная запись PEN-001 находится в разделе Detailed Findings этого реестра.
Тематический отчёт: [`pen-design.md`](pen-design.md).

PEN-001: по информации пользователя, сброс лимита Pen MCP — 1 ноября 2026 года.
После 1 ноября вернуться к этапу 02 и связанным задачам; BLOCKED сохраняется
до повторной проверки доступа и чтения макетов.

Не добавлять демонстрационные дефекты как реальные.

## Detailed Findings

### PEN-001 — Pen MCP заблокирован лимитом тарифа

**Priority:** P2

**Area:** Pen Design / Audit environment

**Status:** BLOCKED

**Location:** `.agents/plans/project-audit/02-pen-design-audit.md`, раздел «Подключение Pen».

**Related report:** `docs/audit/project-audit/pen-design.md`.

#### Description / Evidence

2026-10-29 вызов `pencil.get_app_state({})` вернул `isError: true`, MCP
`-32603`: лимит использования текущего плана исчерпан, design tools заблокированы.
Ни список экранов, ни токены, ни состояния прочитать не удалось.

#### Expected behavior

Pen MCP предоставляет read-only доступ к актуальному согласованному макету.

#### Actual behavior

Доступ заблокирован сервисом. Соответствие интерфейса не проверено.

#### Impact

Заблокирована основная проверка этапа 02. P2 отражает ограничение аудита;
пользовательский дефект или production-инцидент не установлен.

#### Proposed solution

По информации пользователя от 2026-10-29, лимит сбросится **1 ноября 2026 года**.
После 1 ноября вернуться к PEN-001, этапу 02 и связанным задачам, зависящим
от Pen. Повторно проверить доступ; до подтверждения сохранять BLOCKED.

Восстановить доступ к Pen MCP в рамках доступного тарифа/периода и повторить
чтение источника. Не обходить лимит и не изменять `.pen` напрямую.

#### Verification steps

1. Повторить `get_app_state` после восстановления доступа.
2. Прочитать актуальный список экранов, токены и состояния через Pen MCP.
3. Выполнить сравнение по этапу 02 и приложить актуальные доказательства.

#### Resolution

Не устранено. Исправлений реализации нет. Первичная фиксация блокировки:
коммит `87ebd5c`; перенос записи в единый реестр не снимает BLOCKED.

### FE-001 — Refresh Telegram не обрабатывает transport errors локально

**Priority:** P2

**Area:** Frontend / Error handling

**Status:** OPEN

**Location:** `resources/js/components/profile/ProfileTelegram.vue:28`, особенно `:31`.

**Related report:** `docs/audit/project-audit/frontend.md`.

#### Description

Ручная проверка привязки и refresh при возвращении в окно вызывают
`router.reload` только с `onFinish`. Нет локальных onNetworkError/onHttpException;
показанный InlineAlert читает errors mutation-формы, а не ошибки этого reload.

#### Evidence

`evidence/frontend-probe.mjs` воспроизводит на реальном UI bundle с синтетическим
pending Telegram и транспортом. В `frontend-probe.json`: HTTP 503 — inlineAlerts
пуст, появляется один служебный dialog; network abort — inlineAlerts пуст,
pageerror `Network error (http://127.0.0.1/account/profile)`.
Кнопка после запроса снова enabled, но пользователю не сообщается локально,
что статус не удалось обновить. Проверены также синтетические 401/403.

#### Expected behavior

Ошибка проверки привязки отображается в контексте Telegram с понятным retry;
необработанная transport-ошибка не выходит в pageerror, ложного success нет.

#### Actual behavior

HTTP ошибка отдаётся default exception UI Inertia; network ошибка остаётся
необработанной без сообщения в секции. Старое pending состояние сохраняется.

#### Impact

При нестабильной сети или недоступном сервере пользователь не понимает,
почему Telegram-статус не изменился. P2: локальный recoverable UX-дефект,
потеря данных и нарушение авторизации не установлены.

#### Proposed solution

Добавить локальную обработку ошибок refresh, cleanup/cancellation и retry
с сохранением partial reload, deduplication и focus-triggered обновления.
Рассмотреть feature composable; не менять бизнес-процесс привязки.

#### Verification steps

1. В pending/ready/applying выполнить refresh при network abort, 503, 401, 403.
2. Проверить локальное сообщение, отсутствие unhandled pageerror и ложного success.
3. Успешно повторить запрос; проверить focus event, deduplication и уход со страницы.

#### Resolution

Исправлений нет. OPEN; диагностическое воспроизведение не означает VERIFIED.

### FE-002 — Обязательные props без потребителя

**Priority:** P3

**Area:** Frontend / Contracts

**Status:** OPEN

**Location:** `resources/js/pages/Account/Profile.vue:12`, `resources/js/pages/Account/Subscription.vue:11`.

**Related report:** `docs/audit/project-audit/frontend.md`.

#### Description / Evidence

Profile объявляет required Object `themePreference`, но не читает и не передаёт
его дочерним компонентам; тема управляется `useTheme` через ProfileTheme/layout.
Subscription объявляет required String `serviceState`, но не использует его;
видимые состояния формируются из subscription/catalogue. Поиск по текущим SFC
подтверждает только declaration каждого prop внутри соответствующей страницы.

#### Expected behavior

Обязательные props отражают фактические зависимости страницы; намеренно
зарезервированные contracts явно документированы.

#### Actual behavior

Страница требует данные, от которых её текущие rendering/behavior не зависят.
Обоснование резервирования в компоненте отсутствует.

#### Impact

P3: избыточная связанность server/page/fixtures и вводящий в заблуждение contract.
Пользовательская поломка темы или подписки этим finding не утверждается.

#### Proposed solution

Согласовать contract: удалить неиспользуемую обязательность/prop или обосновать
и реализовать необходимое использование. При удалении проверить server props
и fixtures отдельно; не создавать второй store темы и не смешивать с redesign.

#### Verification steps

Проверить использование обоих contracts, frontend unit/SSR и browser Profile/
Subscription в двух темах, включая loading/error и history navigation.

#### Resolution

Изменений реализации нет; OPEN.

### SEC-001 — Credential literals и private keys в tracked operational configs

**Priority:** P1

**Area:** Secrets / Configuration

**Status:** OPEN

**Location:** `app/Remnawave/Config/vless-reality-angie.json:35; vless-reality-zapret.json:35; vless-inbounds-angie.json:35; vless-to-vless-ru-to-de-node.json:35,66; docker/remnawave/.env.panel:21,22,66,82,88; docker/remnawave/.env.sub:5`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

Четыре tracked privateKey декодируются в 32 bytes; operational env-файлы содержат непустые JWT/API/DB/Cloudflare credential-поля без очевидных template markers. Наличие literal доказано, активность в deployment неизвестна.

#### Evidence

evidence/security-static-scan.json и security-static-scan.py: только locations/field names/booleans, без values. Git ls-files подтверждает tracking.

#### Expected behavior

В репозитории — безопасные шаблоны; private credentials поступают из runtime secret storage.

#### Actual behavior

Непустые credential literals доступны каждому читателю checkout/history.

#### Impact / Exploitation conditions

Условие: credentials используются или использовались в реальной инфраструктуре, а checkout/история доступны атакующему. Возможна компрометация VPN/API/DB. P1 отражает экспозицию credential material, не установленный факт взлома; P0 без проверки действительности не назначен.

#### Proposed solution

Owner должен установить использование credentials и согласовать rotation/revoke. Заменить literals шаблонами, исключить runtime env из tracking и оценить очистку истории/артефактов. Rotation/history rewrite не выполнять автоматически в диагностике.

#### Verification steps

Повторить redacted scan и Git tracking/history review; после согласованной rotation проверить отказ старых credentials владельцем без записи значений в evidence.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### SEC-002 — Non-superuser получает admin-management capability

**Priority:** P1

**Area:** Authorization / MoonShine

**Status:** OPEN

**Location:** `app/MoonShine/Resources/MoonShineUser/MoonShineUserResource.php:24; app/MoonShine/Resources/MoonShineUser/Pages/MoonShineUserFormPage.php:51; app/Providers/MoonShineServiceProvider.php:42`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

Системный resource наследует default withPolicy=false; custom authorizationRules отсутствуют. Роль 2 не ограничена относительно создания административных identities.

#### Evidence

SecurityProbeTest::test_non_superuser_can_open_administrator_creation: factory user role 2, isSuperUser=false, can(CREATE)=true, HTTP 200 настоящей form-page с moonshine_user_role_id. Установленный ModelResource::isCan возвращает true без policy.

#### Expected behavior

Управление администраторами и их ролями разрешено только явно уполномоченной роли; оператор не должен получать capability из факта входа в панель.

#### Actual behavior

Non-superuser получает разрешение CREATE и форму выбора роли, включая системный admin-management workflow.

#### Impact / Exploitation conditions

Условие: аккаунт MoonShine с несуперпользовательской ролью. Возможны privilege escalation и расширение доступа к secrets/payment resources. Успешный POST создания суперадминистратора не выполнялся; подтверждены capability и доступ к форме, а не anonymous bypass.

#### Proposed solution

Согласовать role matrix; включить policy/custom rules именно для системных ресурсов, проверять способности на backend, а не только скрывать menu. Не подключать web PaymentPolicy к MoonshineUser без корректного actor contract.

#### Verification steps

Role matrix для guest/web-only/operator/superuser на admin CRUD и прямых requests; operator получает 403 при создании/обновлении администраторов и ролей, superuser сохраняет согласованные права.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### SEC-003 — Wildcard trusted proxies размывает source-IP boundary

**Priority:** P2

**Area:** Network trust / Webhook / Rate limiting

**Status:** OPEN

**Location:** `bootstrap/app.php:30; app/Http/Middleware/CheckYooKassaWebhookSource.php:37`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

Приложение доверяет forwarded headers от любого REMOTE_ADDR; YooKassa allowlist и rate limiter используют request->ip().

#### Evidence

SecurityProbeTest::test_forwarded_source_is_accepted_from_an_arbitrary_peer: synthetic peer 203.0.113.10, пустое body — 403 без XFF; с allowlisted XFF — 500 parser error. Это доказывает проход source gate, не обработку платежа.

#### Expected behavior

Forwarded identity принимается только от согласованных proxies, внешние peers не задают собственный доверенный IP.

#### Actual behavior

Произвольный direct peer может подменить request->ip() разрешённым XFF.

#### Impact / Exploitation conditions

Условие: доступ к backend в обход доверенного edge либо proxy, сохраняющий client-supplied XFF. Обход IP allowlist и IP rate-limit buckets. Production edge sanitation/доступность backend не проверены. Provider reread остаётся независимым барьером против поддельного payment success.

#### Proposed solution

Ограничить trusted proxies фактической сетью edge, закрыть direct backend, проверить sanitation forwarded chain. Не удалять forwarded handling целиком: корректная proxy-доставка webhook должна сохраниться.

#### Verification steps

Недоверенный REMOTE_ADDR с поддельными XFF/XFP не проходит фильтр; доверенный proxy с реальным allowlisted provider IP проходит. Проверить rate-limit key и HTTPS detection на обеих цепочках.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### SEC-004 — symfony/mime 8.1.7 содержит известную уязвимость

**Priority:** P2

**Area:** Dependencies / MIME

**Status:** OPEN

**Location:** `composer.lock:5015`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

Locked symfony/mime v8.1.7 затронут CVE-2026-45070 / GHSA-vqc8-7275-q272 (medium).

#### Evidence

evidence/security-composer-audit.json: Composer exit 1. Актуальный официальный advisory Symfony указывает affected >=8,<8.1.10 и patched 8.1.10; первичная ссылка приведена в security.md.

#### Expected behavior

Locked runtime dependency не содержит известного advisory либо имеет явно принятый компенсированный риск.

#### Actual behavior

Composer audit сообщает один advisory для runtime transitive dependency.

#### Impact / Exploitation conditions

Для header injection необходимо влияние на имя MIME parameter. Такой app input path не обнаружен в просмотренных notifications; remote exploitation приложения не доказана. P2 соответствует medium dependency risk.

#### Proposed solution

Согласовать минимальный совместимый patch до 8.1.10 или новее и повторить dependency/mail/auth проверки. Устаревшие списки patched versions 8.0.12 и др. не использовать: официальный advisory уточняет, что исправление там не выпускалось.

#### Verification steps

Проверить совместимость lock/update в отдельной remediation задаче, composer audit без этого advisory, mail/verification/password-reset regressions без реальной рассылки.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### SEC-005 — Telegram webhook registration и verification читают разные secret keys

**Priority:** P2

**Area:** Telegram / Webhook configuration

**Status:** OPEN

**Location:** `config/telegraph.php:62; app/Http/Middleware/VerifyTelegramLinkWebhook.php:32; vendor/defstudio/telegraph/src/Concerns/InteractsWithWebhooks.php:53`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

App хранит TELEGRAPH_WEBHOOK_SECRET в webhook.secret, но установленный Telegraph registerWebhook default читает webhook.secret_token. App middleware требует header для linking при непустом webhook.secret.

#### Evidence

SecurityProbeTest::test_configured_telegram_secret_is_not_sent_by_default_registration: synthetic config, default registration payload без secret_token; headerless linking request получает 403. Реальный setWebhook не вызывался.

#### Expected behavior

Default registration и inbound verification используют один согласованный secret; зарегистрированный Telegram присылает ожидаемый header.

#### Actual behavior

Конфигурация environment сама по себе не передаёт secret_token в default registration, хотя inbound middleware уже его требует.

#### Impact / Exploitation conditions

Условие: TELEGRAPH_WEBHOOK_SECRET настроен, регистрация выполнена без явного --secret/альтернативной передачи. Legitimate linking может перестать работать, что побуждает отключать дополнительный proof. Live registration неизвестна; secret-path fallback без optional header не объявлен самостоятельным bypass.

#### Proposed solution

Унифицировать config contract с установленным Telegraph API и проверить регистрацию payload/inbound middleware вместе. Перерегистрация live webhook только после согласованной реализации; vendor не патчить.

#### Verification steps

Synthetic default registration содержит ожидаемый secret_token; matching header допускается, отсутствующий/неверный отклоняется; отдельный тест подтверждает сохранение согласованного secret-path-only режима.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### SEC-006 — Access logs не маскируют bearer tokens в URI

**Priority:** P2

**Area:** Logging / Secrets

**Status:** OPEN

**Location:** `docker/caddy/Caddyfile:9; config/telegraph.php:29; app/Http/Controllers/Auth/NewPasswordController.php:31`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

Production Caddy пишет access logs в stdout в console format без URI filter. Приложение использует password-reset token в path, payment-return token в query и default bot token в webhook path.

#### Evidence

Source review Caddyfile: log output stdout/format console, redaction rules отсутствуют. Caddy documentation описывает default request logging и отдельные query/regexp filters; redaction credential headers сама по себе не редактирует URI.

#### Expected behavior

Bearer credentials и reset proofs редактируются/исключаются из access logs до экспорта в log storage.

#### Actual behavior

Для запросов, проходящих через этот Caddy config, URI остаётся без app-specific token filtering.

#### Impact / Exploitation conditions

Условие: sensitive URL обслуживается этим host и access logs доступны третьей стороне/оператору без credential privileges. Возможна утечка reset/return proofs и, если webhook обслуживается этим edge, bot token. Реальные логи и routing bot host не проверялись; active token leak не утверждается.

#### Proposed solution

Настроить согласованное masking query/path proofs либо исключение sensitive request logs, сохранив нужные operational metadata. Оценить права/retention логов; при подтверждённой утечке согласовать rotation.

#### Verification steps

На отдельном тестовом Caddy отправить только synthetic sensitive paths/query; убедиться, что stdout/collector не содержат fixture tokens. Не копировать live tokens в запросы или отчёты.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### SEC-007 — Production Compose публикует PostgreSQL без host bind restriction

**Priority:** P2

**Area:** Deployment / Network exposure

**Status:** OPEN

**Location:** `docker-compose-prod.yml:47`

**Related report:** `docs/audit/project-audit/security.md`.

#### Description

pgsql имеет ports ${DB_PORT}:5432 без loopback IP, хотя app и DB уже соединены внутренней network.

#### Evidence

docker-compose-prod.yml:47-48; опубликованный host port не ограничен loopback в Compose. Production deployment и firewall не запускались/не сканировались.

#### Expected behavior

DB доступна только согласованным app/admin peers; внешняя публикация отсутствует либо имеет явное ограничение bind/perimeter.

#### Actual behavior

Shipped production Compose задаёт публикацию на host interfaces без ограничения source/bind address.

#### Impact / Exploitation conditions

Условие: использование этого Compose на externally reachable host и отсутствие внешнего firewall запрета. Появляется прямой DB attack surface. Реальная доступность порта и пригодность credentials неизвестны; это конфигурационный риск, не подтверждённый внешний доступ к БД.

#### Proposed solution

Убрать ненужный ports mapping или ограничить loopback/доверенным интерфейсом и firewall по согласованному operational contract. Не менять текущую сеть в диагностике.

#### Verification steps

Проверить rendered config без вывода env values; на изолированном deployment app сохраняет DB access, untrusted interface недоступен. Production perimeter проверяет владелец в отдельной согласованной процедуре.

#### Resolution

Диагностика от 2026-10-29. Production-исправлений нет; OPEN.

### BE-001 — Повтор старого платежа сокращает более новую подписку

**Priority:** P1

**Area:** Backend

**Status:** OPEN

**Location:** `app/Payment/SubscriptionExtender.php:59; app/Services/UserStateManager.php`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

При сохранённом subscription_expires_at Extender повторно применяет абсолютный target без проверки последующих операций. Общий mutation lock не защищает от старого retry после завершившегося нового продления.

#### Evidence

Probe saved_payment_target_can_shorten_a_newer_subscription: remote expiry 2027-01-01, сохранённый target 2026-12-01; отправлен PATCH с более ранним expiry. Сравниваются timestamps. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Повтор не должен отменять результат последующих оплаченных или referral операций.

#### Actual behavior

Более новый срок перезаписывается старым target.

#### Impact

Потеря оплаченного срока при retry после другого продления; P1 из-за прямого ущерба подписке. Реальная параллельность и provider mutation не запускались.

#### Proposed solution

Согласовать durable recovery/conflict протокол платежей с source/target и другими mutation operations. Простое max не гарантирует начисление ещё не доставленного оплаченного интервала.

#### Verification steps

Retry после другого платежа/referral, remote timeout до/после применения, потеря claim и конкурентные workers: срок не сокращается, услуга не теряется и не начисляется дважды.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-002 — Batch mapping пропускает web-only numeric identities

**Priority:** P2

**Area:** Backend

**Status:** OPEN

**Location:** `app/Services/UserLifecycleSynchronizationService.php:118; app/Services/DeviceLimitEnforcementService.php`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

Batch resolver сопоставляет chat_id/username, не учитывая remnawave_user_id. Web-only user имеет numeric mapping и provisioning username, но локальный username null.

#### Evidence

Probe batch_mapping_skips_a_web_only_numeric_identity: remote ID 42 сопоставлен с user.remnawave_user_id=42, оба batch checked=0; lifecycle tag не изменён, HWID вызовов нет. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Поддерживаемые web identities участвуют в lifecycle/device enforcement по numeric mapping.

#### Actual behavior

Пользователь исключается из обработки несмотря на действующий mapping.

#### Impact

Устаревший локальный lifecycle и отсутствие device enforcement у web-only аккаунтов. Telegram-only reminders здесь не оцениваются как нарушение.

#### Proposed solution

Общий numeric-first batch resolver с проверенным legacy fallback; сохранить защиту от conflicting identities.

#### Verification steps

Web-only и Telegram, смена username, отсутствующий username, конфликт numeric/legacy IDs, страницы stream и превышенный device limit.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-003 — Telegram duration определяется цифрами display name

**Priority:** P2

**Area:** Backend

**Status:** OPEN

**Location:** `app/Payment/PaymentCreator.php:130,257`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

Web использует Product.months, Telegram — regex по имени продукта. В админке имя и months редактируются независимо.

#### Evidence

Probe telegram_invoice_uses_name_digits_instead_of_months: months=1, имя «Пакет на 30 дней», резервируется payment.months=30. SDK намеренно отклоняет запрос после reserve. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Переименование тарифа не меняет приобретаемый срок; источником служит явное поле duration.

#### Actual behavior

Первая цифра в имени определяет Telegram months.

#### Impact

Неверный оплачиваемый срок и расхождение web/Telegram; реального списания в probe нет.

#### Proposed solution

Использовать Product.months для обоих каналов с явной политикой совместимости legacy nullable products.

#### Verification steps

Telegram/web parity, произвольные цифры в названии, переименование, legacy данные и фактическая target date.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-004 — Retry с прежним ключом пересчитывает provider amount

**Priority:** P2

**Area:** Backend

**Status:** OPEN

**Location:** `app/Payment/PaymentCreator.php:54`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

Для существующего invoice без provider ID повтор пересчитывает сумму по текущему Product/Promocode, сохраняя старую локальную сумму и idempotency key.

#### Evidence

Probe retry_recalculates_provider_amount_from_mutated_catalogue: SDK получает 200.00, затем 300.00 на одном ключе после изменения цены; payment.amount остаётся 20000. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Один ключ представляет неизменный provider request, согласованный с invoice snapshot.

#### Actual behavior

Payload меняется при неизменном key и локальном amount.

#### Impact

Невосстановимый retry или расхождение сумм; реакция живой YooKassa на такой повтор не проверялась.

#### Proposed solution

Сохранять provider request snapshot и воспроизводить его; новый intent создавать только явно, с сохранением ownership и защиты от двойной оплаты.

#### Verification steps

Изменить цену/скидку/каталог между попытками: amount, currency, description, metadata и return URL для старого key неизменны; проверить ambiguous timeout.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-005 — Неудачное создание invoice оставляет бессрочный merge blocker

**Priority:** P2

**Area:** Backend

**Status:** OPEN

**Location:** `app/Payment/PaymentCreator.php:114; app/Services/Profile/TelegramAccountMerger.php:79`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

Pending сохраняется до SDK вызова; при отказе без provider ID нет завершения/reconciliation, а merger блокирует любой Pending независимо от возраста.

#### Evidence

Probe failed_creation_attempt_keeps_blocking_telegram_link: SDK exception, Pending без provider ID; через два дня валидный Telegram link получает запрет merge до remote calls. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Неуспешный или неопределённый create имеет восстановимое состояние и не блокирует merge навсегда без reconciliation.

#### Actual behavior

Брошенный Pending остаётся неотличим от реально ожидающего оплаты.

#### Impact

Пользователь не может объединить аккаунты после неудачной оплаты. Timeout нельзя автоматически считать отсутствием provider платежа.

#### Proposed solution

Разделить creation failed/unknown и payable Pending, добавить безопасную reconciliation и согласовать merge predicates. Не отменять неоднозначный платёж только по возрасту.

#### Verification steps

Proved absent, provider accepted/response lost, delayed webhook, stale intent, retry тем же ключом и concurrent merge.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-006 — Guest log-viewer вызывает null member Error

**Priority:** P2

**Area:** Backend

**Status:** OPEN

**Location:** `app/Providers/AppServiceProvider.php:107`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

Auth callback вызывает auth()->user()->isSuperUser() без проверки отсутствующего пользователя.

#### Evidence

Probe log_viewer_guest_raises_an_error: гостевой GET /log-viewer без exception handler вызывает Error: Call to a member function isSuperUser() on null. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Гость получает контролируемый redirect/401/403 в соответствии с маршрутом; доступ ограничен superuser.

#### Actual behavior

Возникает необработанная ошибка, обычный handler возвращает 500.

#### Impact

Падение маршрута админского инструмента и шум ошибок. Доступ к логам этим probe не доказан; SEC-002 не дублируется.

#### Proposed solution

Явно согласовать admin guard/session middleware и null-safe predicate с superuser-only policy.

#### Verification steps

Guest UI/API, обычный пользователь, non-superuser admin и superuser: корректные отказы и разрешения без 500.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-007 — PHP 8.5 bootstrap использует deprecated PDO constants

**Priority:** P3

**Area:** Backend

**Status:** OPEN

**Location:** `config/database.php:62,82`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

MySQL конфигурация вычисляет PDO::MYSQL_ATTR_SSL_CA, deprecated в установленном PHP 8.5.12; это происходит и при PostgreSQL.

#### Evidence

Финальные probes: 7 tests/22 assertions, две deprecations. Existing targeted suite: 53 deprecated tests/4 passed, 240 assertions; warnings указывают на эти две строки. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Поддерживаемый runtime загружает конфигурацию без deprecated API.

#### Actual behavior

Bootstrap создаёт deprecation warnings.

#### Impact

Шум diagnostics и долг совместимости, assertion failures не вызваны.

#### Proposed solution

Проверить доступный API установленного PDO MySQL и перейти на поддерживаемую константу с сохранением SSL options. Не отключать warnings.

#### Verification steps

PHP 8.5 bootstrap/targeted tests без deprecations; PostgreSQL и MySQL SSL configuration работают.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### BE-008 — UNIQUE promocode_id запрещает второй usage общего промокода

**Priority:** P1

**Area:** Backend

**Status:** OPEN

**Location:** `database/migrations/2025_12_15_100431_create_user_promocodes_table.php; app/Services/PromocodeService.php:145; app/Payment/SuccessfulPaymentProcessor.php`.

**Related report:** [backend.md](backend.md), разделы 3–9.

#### Description

Service поддерживает общий код с count>1/unlimited, но user_promocodes.promocode_id уникален. Миграция merged history снимает unique user_id, оставляя unique promocode_id.

#### Evidence

Probe shared_promocode_cannot_record_a_second_eligible_user: count=2, первый user успешен, второй получает UniqueConstraintViolationException; count=1 и одна usage row. backend-schema.json подтверждает индекс. Исходник probes: `evidence/BackendProbeTest.php`; финальный результат: `evidence/backend-probe.junit.xml`; команды и ограничения: `evidence/backend-checks.md`.

#### Expected behavior

Разные допустимые пользователи расходуют общий код в пределах count атомарно, без SQL отказа.

#### Actual behavior

Любой второй user одного кода упирается в unique constraint.

#### Impact

P1: SuccessfulPaymentProcessor выполняет remote extension до complete/markAsUsed; после оплаченного события локальное завершение может падать уже после внешнего эффекта. SQL отказ воспроизведён, реальный платёж не проводился.

#### Proposed solution

Новая forward migration для правильной cardinality; сохранить merged history, ограничения повторного usage и row locks/count. Согласовать remote/local recovery.

#### Verification steps

Два пользователя count=2, unlimited/personal codes, concurrent last usage, повтор тем же user, merged history и retry после remote success/local SQL failure.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### PERF-001 — Все страницы входят в initial JS graph через eager import

**Priority:** P2

**Area:** Performance / Frontend

**Status:** OPEN

**Location:** `resources/js/app.js`, resolve/import.meta.glob; `public/build/manifest.json` (generated evidence, не production source fix).

**Related report:** [performance.md](performance.md), разделы 3, 9.

#### Description

Eager glob включает все 16 Inertia page SFC в общий initial JS вместо загрузки
page graph по маршруту. Это конкретная лишняя загрузка, а не превышение
несогласованного численного bundle budget.

#### Evidence

Сборка на e564464: один JS 412950 bytes (gzipSync 122796 bytes), page dynamicImports
пуст. Все шесть fresh-context login samples загружают app-DoLRCyK-.js; V8 coverage
sample показывает 1012 unexecuted из 1602 functions. Coverage функций не равен
unused byte percentage. Доказательства: `evidence/performance-browser.mjs/json`,
`evidence/performance-environment.json`, `evidence/performance-checks.md`.

#### Expected behavior

Initial graph содержит текущую страницу и необходимые shared dependencies;
прочие page modules подгружаются по navigation без изменения UI/SSR contracts.

#### Actual behavior

Login получает общий graph всех страниц, включая неиспользуемые в этом сценарии.

#### Impact

Лишняя передача и parse/compile работа на холодном входе; эффект на реальной
мобильной сети не измерен. Локальные быстрые timings не устраняют лишнюю загрузку.

#### Proposed solution

Проверить lazy Inertia page resolution и разумные shared chunks; сохранить
loading/error feedback, prefetch/cache и SSR/client resolution parity. Размерный
бюджет согласовать отдельно, не вводить произвольный порог.

#### Verification steps

Повторить сборку и cold login: manifest содержит page chunks, login не получает
граф всех страниц. Сравнить bytes/parse на одинаковых условиях; проверить переходы,
history, stale assets/loading failures и SSR hydration. Нужна отдельная
SSR-enabled проверка: текущее окружение CSR.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

### PERF-002 — Batch продолжает HWID requests после 429 без cooldown

**Priority:** P2

**Area:** Performance / External API

**Status:** OPEN

**Location:** `app/Services/DeviceLimitEnforcementService.php`, processPage loop/catch;
`app/Remnawave/BaseApi.php`, handle.

**Related report:** [performance.md](performance.md), разделы 7–9.

#### Description

Каждый 429 превращается в ApiException и обрабатывается как индивидуальная ошибка
пользователя. Общего provider cooldown нет, Retry-After теряется; цикл сразу
отправляет следующие HWID requests в том же rate-limited batch.

#### Evidence

Synthetic stream: 10 eligible Telegram users, все HWID ответы 429 с
Retry-After:60. Получено 10 HWID calls за 52.983ms, включая девять после первого
rate limit; checked=0, failed=10, SQL queries=4. Измерение изолированного fake,
не нагрузка на живой API. `evidence/PerformanceProbeTest.php`,
`evidence/performance-backend.json`, `evidence/performance-probe.junit.xml`:
1 test/14 assertions, failures/errors=0, 2 существующих deprecations BE-007.

#### Expected behavior

Provider rate limit останавливает или откладывает соответствующий поток запросов
до допустимого срока, с bounded recovery и сохранением безопасного прогресса.

#### Actual behavior

После 429 оставшиеся пользователи немедленно вызывают тот же ограниченный API.

#### Impact

Бесполезные requests/logging и failures растут с размером страницы во время
rate limit, замедляя восстановление. Реальные provider quota и длительность
production cooldown неизвестны; численный production SLA не утверждается.

#### Proposed solution

Сохранить rate-limit metadata и применить provider-scoped bounded cooldown/defer
с безопасным resume/backoff. Не спать безгранично под scheduler/DB lock и не
добавлять универсальный retry для mutation endpoints.

#### Verification steps

429 первым/средним запросом, Retry-After seconds/date/missing/invalid, смена
страницы, повтор scheduler и параллельные workers: запросы не обходят cooldown,
работа возобновляется, прогресс не теряется и обычные per-user ошибки остаются
изолированными. Проверить read/mutation safety отдельно.

#### Resolution

Диагностика 2026-10-29. Исправлений нет; OPEN.

## Шаблон новой записи

Для каждой обнаруженной проблемы использовать шаблон:

### [ID] — [Название]

**Priority:** P0 / P1 / P2 / P3

**Area:** Security / Frontend / Backend / ...

**Status:** OPEN

**Location:** `path/to/file:line`

**Related report:** `docs/audit/...`

#### Description

Описание проблемы.

#### Evidence

Подтверждение проблемы.

#### Expected behavior

Ожидаемое поведение.

#### Actual behavior

Фактическое поведение.

#### Impact

Последствия и условия возникновения.

#### Proposed solution

Рекомендуемое исправление.

#### Verification steps

Как проверить исправление.

#### Resolution

Заполняется после исправления:

- изменённые файлы;
- commit;
- результат проверки;
- оставшиеся ограничения.

## Remediation Order

Список согласованных проблем для исправления.

Не заполнять предположениями до завершения аудита.

## Accepted Risks

Риски, явно принятые пользователем.

## Blocked Findings

Проблемы, исправление или проверка которых невозможны
в текущем окружении.
