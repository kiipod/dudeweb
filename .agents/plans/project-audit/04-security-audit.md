# Шаг 4 — Security Audit

## Цель

Выявить уязвимости приложения, ошибки авторизации,
небезопасные конфигурации и риски внешних интеграций.

Все активные проверки выполнять только в разрешённом
локальном или тестовом окружении.

## Authentication

- [x] Проверить login/logout.
- [x] Проверить session management.
- [x] Проверить срок действия токенов.
- [x] Проверить password hashing.
- [x] Проверить session fixation.
- [x] Проверить cookie flags.
- [x] Проверить защиту от brute force.
- [x] Проверить rate limiting.

## Authorization

- [x] Проверить middleware.
- [x] Проверить policies/gates.
- [x] Проверить разграничение ролей.
- [x] Проверить доступ к чужим ресурсам.
- [x] Проверить IDOR.
- [x] Проверить ownership checks.
- [x] Проверить защищённость административных маршрутов.

Особенно проверить операции с:

- подписками;
- платежами;
- устройствами;
- профилем пользователя;
- промокодами;
- реферальными данными.

## Input Validation

- [x] Проверить Request validation.
- [x] Проверить SQL injection.
- [x] Проверить XSS.
- [x] Проверить CSRF.
- [x] Проверить SSRF.
- [x] Проверить mass assignment.
- [x] Проверить path traversal.
- [x] Проверить небезопасную десериализацию.
- [x] Проверить загрузку файлов.

## Payments

Если используется YooKassa:

- [x] Проверить создание платежей.
- [x] Проверить серверный расчёт суммы.
- [x] Проверить привязку платежа к пользователю.
- [x] Проверить обработку webhook.
- [x] Проверить проверку подлинности уведомлений.
- [x] Проверить повторную доставку webhook.
- [x] Проверить идемпотентность.
- [x] Проверить защиту от повторного начисления.
- [x] Проверить отменённые платежи.
- [x] Проверить отсутствие доверия к return URL как подтверждению оплаты.

## Telegram

- [x] Проверить авторизацию callback.
- [x] Проверить ownership пользовательских операций.
- [x] Проверить обработку deep-link.
- [x] Проверить защиту от self-referral.
- [x] Проверить повторную обработку callback.
- [x] Проверить хранение bot token.
- [x] Проверить безопасное логирование.

## Remnawave

- [x] Проверить хранение API credentials.
- [x] Проверить авторизацию запросов.
- [x] Проверить обработку ошибок API.
- [x] Проверить доступ к чужим подпискам.
- [x] Проверить изменение статусов.
- [x] Проверить управление устройствами.
- [x] Проверить защиту от некорректных внешних данных.

## Configuration

- [x] Проверить APP_DEBUG.
- [x] Проверить production error output.
- [x] Проверить CORS.
- [x] Проверить HTTPS.
- [x] Проверить security headers.
- [x] Проверить доступность служебных файлов.
- [x] Проверить .gitignore.
- [x] Проверить секреты в tracked files.
- [x] Проверить логирование персональных данных.

## Dependencies

Выполнить доступные проверки:

- composer audit
- npm audit

Дополнительно проверить:

- [x] Поддерживаемость зависимостей.
- [x] Известные уязвимости.
- [x] Риски обновления.
- [x] Прямые и транзитивные зависимости.

Не выполнять автоматическое массовое обновление зависимостей.

## Findings

Использовать префикс SEC.

Для каждой уязвимости указать:

- затронутый компонент;
- необходимые условия эксплуатации;
- возможное воздействие;
- воспроизводимое безопасное доказательство;
- приоритет;
- способ устранения.

Не сохранять в отчётах реальные секреты или эксплуатационные данные.

## Отчёт

Создать:

docs/audit/project-audit/security.md

Разделы:

1. Authentication
2. Authorization
3. Input Validation
4. Payment Security
5. Telegram Security
6. External API Security
7. Configuration
8. Dependencies
9. Security Findings
10. Limitations

## Проверка

- [x] Authentication проверена.
- [x] Authorization проверена.
- [x] Input validation проверена.
- [x] Интеграции проверены.
- [x] Конфигурации проверены.
- [x] Dependency audit выполнен либо ограничение зафиксировано.
- [x] findings.md обновлён.
- [x] Production-код не изменён.

## Результат диагностики — 2026-10-29

Отчёт: `docs/audit/project-audit/security.md`.
Единый реестр: `docs/audit/project-audit/findings.md`.
Новых findings: **P0 — 0, P1 — 2, P2 — 5, P3 — 0** (SEC-001–SEC-007 OPEN).

Checkbox отражают выполненный source/local review в объёме отчёта, а не
отсутствие уязвимостей или production acceptance. Через Sail:
192 targeted tests / 2029 assertions, 3 diagnostic probes / 10 assertions,
оба набора без failures и с зафиксированными PHP 8.5 deprecations.
Composer audit: один medium advisory; npm audit: известных vulnerabilities 0.
Production-code/dependencies/credentials не менялись.

Actual production TLS/cookies/error output, firewall/proxy chain и действительность
credential literals не проверены. Полный lifecycle review всех transitive packages,
forensic scan Git history и всех файлов на секреты не выполнены.
Эти ограничения и guest 500 log-viewer явно отражены в отчёте; не считать их PASS.
К live проверкам возвращаться в согласованном operational/remediation scope.
Этап 02 остаётся BLOCKED до восстановления Pen после 1 ноября; этап 05 не начат.
Результаты подготовлены к фиксации коммитом `docs: audit application security`.

## Commit

docs: audit application security
