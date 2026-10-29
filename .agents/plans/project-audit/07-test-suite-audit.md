# Шаг 7 — Test Suite Audit

## Цель

Проверить существующее тестовое покрытие, запустить
все доступные тесты и зафиксировать исходное качество проекта.

## Test Environment

- [x] Определить test configuration.
- [x] Проверить тестовую БД.
- [x] Проверить изоляцию от production.
- [x] Проверить mock/fake внешних API.
- [x] Проверить тестовые credentials.
- [x] Проверить подготовку fixtures.
- [x] Проверить миграции тестовой БД.

Не запускать тесты, способные изменить production-данные.

## Backend Tests

Найти и запустить:

- [x] Unit tests.
- [x] Feature tests.
- [x] Integration tests.
- [x] API tests.
- [x] Database tests.

Использовать существующие команды проекта.

Если используется Laravel/PHPUnit/Pest,
определить фактическую команду запуска.

## Frontend Tests

Найти и запустить:

- [x] Unit/component tests.
- [x] Integration tests.
- [x] E2E tests.
- [x] Accessibility tests, если настроены.

Проверить:

- [x] frontend build;
- [x] lint — NOT_CONFIGURED;
- [x] typecheck — NOT_APPLICABLE (JavaScript stack);
- [x] formatter check — frontend NOT_CONFIGURED, PHP check выполнен.

## Static Analysis

Запустить настроенные инструменты:

- [x] PHP syntax checks.
- [x] PHPStan/Psalm — NOT_CONFIGURED, не запускались.
- [x] Pint/PHP-CS-Fixer check.
- [x] ESLint — NOT_CONFIGURED, не запускался.
- [x] TypeScript check — NOT_APPLICABLE (JavaScript stack).
- [x] Dependency audit.

Не добавлять новые инструменты только ради заполнения checklist.

## Critical Scenarios

Проверить наличие тестов для:

- [x] Registration.
- [x] Trial activation.
- [x] Subscription expiration.
- [x] Payment creation.
- [x] Payment succeeded.
- [x] Payment canceled.
- [x] Webhook idempotency.
- [x] Promocode one-time usage.
- [x] Self-referral.
- [x] Referral reward.
- [x] Remnawave synchronization.
- [x] Device limit.
- [x] Authentication/authorization.

Если функциональность отсутствует, отметить NOT_APPLICABLE.

Если функциональность есть, но теста нет,
создать TEST finding.

## Test Results

Для каждого набора записать:

- команду;
- окружение;
- количество passed;
- количество failed;
- количество skipped;
- причину blocked;
- время выполнения, если доступно;
- ключевые ошибки.

Не считать skipped тесты успешными.

## Coverage

Если coverage настроен:

- [x] Запустить coverage.
- [x] Зафиксировать фактические показатели.
- [x] Определить непокрытые критические участки.

Если coverage недоступен, не придумывать проценты.

## Отчёт

Создать:

docs/audit/project-audit/tests.md

Разделы:

1. Test Environment
2. Test Inventory
3. Commands
4. Backend Results
5. Frontend Results
6. Static Analysis
7. Critical Scenario Coverage
8. Missing Tests
9. Findings References

## Findings

Использовать префикс TEST.

Каждый независимый сбой должен иметь воспроизводимое описание.

Не создавать десятки findings для ошибок,
вызванных одной общей первопричиной.

## Контрольная точка

После завершения:

- [x] Свести findings всех этапов.
- [x] Проверить уникальность ID.
- [x] Проверить приоритеты.
- [x] Проверить доказательства.
- [x] Сформировать remediation order.
- [x] Обновить overview.

Остановиться перед шагом 08.

Не приступать к исправлениям без подтверждения пользователя.

## Проверка

- [x] Все доступные тесты запущены.
- [x] Результаты сохранены.
- [x] Пробелы покрытия выявлены.
- [x] Статический анализ выполнен либо ограничение зафиксировано.
- [x] findings.md актуален.
- [x] Production-код не изменён.

## Commit

docs: audit automated tests and coverage

## Результат диагностики — 2026-10-29

Отчёт: `docs/audit/project-audit/tests.md`; команды, JSON/JUnit/Clover и результаты
в `docs/audit/project-audit/evidence/tests-*`. Новый TEST-001 P2 OPEN; P0 — 0,
P1 — 0, P2 — 1, P3 — 0. Реестр сведен: 21 уникальный ID, 20 OPEN / 1 BLOCKED;
remediation order — предложение для согласования, не разрешение на исправления.

Sail: backend 306 tests / 2997 assertions без failures/errors/skips; frontend
unit 103 passed; default Playwright 1766 passed / 0 failed/skipped/flaky, 17m05.554s.
PCOV app: statement coverage 65.50%, method coverage 47.27%, branch недоступен.
PHP syntax 420 files без failures, PHP-CS-Fixer dry-run без изменений;
Composer advisory уже SEC-004, PHP deprecations уже BE-007, npm vulnerabilities 0.

Отдельно operational SSR: 32 fixture passed / 8 live failed (SSR disabled),
infrastructure: 3 setup failures root!=deploy, operational verification BLOCKED
в Sail. Не запускались не настроенные tools, реальные provider acceptance и
production-image lifecycle. Checkbox означает выполнение диагностики/фиксацию
ограничения, не успешность непроверенных или упавших сценариев. Coverage не
объявлен достаточным по несуществующему threshold. Сохранённые Pen tests не
заменяют blocked live-аудит 02. Первый прерванный browser run не засчитан.

Production-код/существующие tests не исправлялись. Generated SSR восстановлены,
временный renderer остановлен. Этапы 01/02 открыты, переход к 08 не выполнялся.
Результаты этапа 07 подготовлены к фиксации коммитом
`docs: audit automated tests and coverage`.
