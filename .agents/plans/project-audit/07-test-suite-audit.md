# Шаг 7 — Test Suite Audit

## Цель

Проверить существующее тестовое покрытие, запустить
все доступные тесты и зафиксировать исходное качество проекта.

## Test Environment

- [ ] Определить test configuration.
- [ ] Проверить тестовую БД.
- [ ] Проверить изоляцию от production.
- [ ] Проверить mock/fake внешних API.
- [ ] Проверить тестовые credentials.
- [ ] Проверить подготовку fixtures.
- [ ] Проверить миграции тестовой БД.

Не запускать тесты, способные изменить production-данные.

## Backend Tests

Найти и запустить:

- [ ] Unit tests.
- [ ] Feature tests.
- [ ] Integration tests.
- [ ] API tests.
- [ ] Database tests.

Использовать существующие команды проекта.

Если используется Laravel/PHPUnit/Pest,
определить фактическую команду запуска.

## Frontend Tests

Найти и запустить:

- [ ] Unit/component tests.
- [ ] Integration tests.
- [ ] E2E tests.
- [ ] Accessibility tests, если настроены.

Проверить:

- [ ] frontend build;
- [ ] lint;
- [ ] typecheck, если настроен;
- [ ] formatter check.

## Static Analysis

Запустить настроенные инструменты:

- [ ] PHP syntax checks.
- [ ] PHPStan/Psalm.
- [ ] Pint/PHP-CS-Fixer check.
- [ ] ESLint.
- [ ] TypeScript check.
- [ ] Dependency audit.

Не добавлять новые инструменты только ради заполнения checklist.

## Critical Scenarios

Проверить наличие тестов для:

- [ ] Registration.
- [ ] Trial activation.
- [ ] Subscription expiration.
- [ ] Payment creation.
- [ ] Payment succeeded.
- [ ] Payment canceled.
- [ ] Webhook idempotency.
- [ ] Promocode one-time usage.
- [ ] Self-referral.
- [ ] Referral reward.
- [ ] Remnawave synchronization.
- [ ] Device limit.
- [ ] Authentication/authorization.

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

- [ ] Запустить coverage.
- [ ] Зафиксировать фактические показатели.
- [ ] Определить непокрытые критические участки.

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

- [ ] Свести findings всех этапов.
- [ ] Проверить уникальность ID.
- [ ] Проверить приоритеты.
- [ ] Проверить доказательства.
- [ ] Сформировать remediation order.
- [ ] Обновить overview.

Остановиться перед шагом 08.

Не приступать к исправлениям без подтверждения пользователя.

## Проверка

- [ ] Все доступные тесты запущены.
- [ ] Результаты сохранены.
- [ ] Пробелы покрытия выявлены.
- [ ] Статический анализ выполнен либо ограничение зафиксировано.
- [ ] findings.md актуален.
- [ ] Production-код не изменён.

## Commit

docs: audit automated tests and coverage
