# Шаг 9 — Refactoring

## Цель

Улучшить качество кода, производительность,
архитектуру и соответствие Pen-макетам.

Исправлять согласованные проблемы P2/P3
и подтверждённый технический долг.

## Условия начала

- [x] Критические проблемы обработаны.
- [x] Scope рефакторинга согласован.
- [x] Существующие тесты проверены.
- [x] Доступны baseline-метрики, если требуется оптимизация.

## Подготовка

- [x] Прочитать findings.md.
- [x] Прочитать backend.md.
- [x] Прочитать frontend.md.
- [x] Прочитать pen-design.md.
- [x] Прочитать performance.md.
- [x] Определить зависимости между изменениями.
- [x] Разбить рефакторинг на независимые логические части.

## Backend Refactoring

Для подтверждённых проблем:

- [x] Уменьшить избыточные ответственности.
- [x] Декомпозировать сложные методы.
- [x] Устранить дублирование.
- [x] Упростить условные конструкции.
- [x] Удалить доказанно неиспользуемый код.
- [x] Упростить зависимости.
- [x] Улучшить error handling.
- [x] Проверить транзакции.
- [x] Сохранить API-контракты.

Не создавать лишние Service/Action/Interface.

## Frontend Refactoring

- [x] Устранить дублирование компонентов.
- [x] Упростить состояние.
- [x] Убрать ненужные watchers/effects.
- [x] Упростить формы.
- [x] Устранить CSS duplication. — NOT_APPLICABLE: подтверждённой проблемы в audit scope нет.
- [x] Исправить подтверждённые responsive issues. — NOT_APPLICABLE: подтверждённой проблемы в audit scope нет.
- [x] Исправить подтверждённые UX issues.
- [x] Сохранить интерактивность.

## Pen Design Fixes

Для каждого PEN finding:

- [ ] Проверить соответствующий макет. — BLOCKED, PEN-001; visual fixes вне текущего scope.
- [ ] Исправить подтверждённое расхождение. — BLOCKED, PEN-001; visual fixes вне текущего scope.
- [ ] Проверить mobile viewport. — BLOCKED, PEN-001; visual fixes вне текущего scope.
- [ ] Проверить desktop viewport. — BLOCKED, PEN-001; visual fixes вне текущего scope.
- [ ] Проверить интерактивные состояния. — BLOCKED, PEN-001; visual fixes вне текущего scope.
- [ ] Проверить отсутствие визуальных регрессий. — BLOCKED, PEN-001; visual fixes вне текущего scope.

Не изменять дизайн произвольно.

## Performance Optimization

- [x] Исправить подтверждённые N+1. — NOT_APPLICABLE: подтверждённой проблемы в audit scope нет.
- [x] Оптимизировать тяжёлые запросы. — NOT_APPLICABLE: подтверждённой проблемы в audit scope нет.
- [x] Уменьшить лишние API-вызовы.
- [x] Оптимизировать frontend bundles, если необходимо.
- [x] Оптимизировать изображения. — NOT_APPLICABLE: подтверждённой проблемы в audit scope нет.
- [x] Оптимизировать вычисления.
- [x] Проверить кеширование.

После изменения сравнить показатели с baseline.

## Database Refactoring

- [x] Проверить необходимость schema changes.
- [x] Проверить все references.
- [x] Проверить исторические данные.
- [x] Проверить rollback.
- [x] Проверить миграции на тестовой БД.

Не удалять столбцы только потому,
что они выглядят избыточными.

## Testing

Для каждого изменения:

- [x] Добавить или обновить тесты.
- [x] Запустить связанные тесты.
- [x] Проверить исходный finding.
- [x] Проверить регрессии.
- [x] Обновить findings.md.

## Documentation

Для каждого исправления указать:

- Finding ID;
- изменённые файлы;
- принятое решение;
- результаты тестов;
- метрики до/после, если применимо;
- commit.

## Проверка

- [x] Согласованные проблемы обработаны.
- [x] Не создана лишняя архитектурная сложность.
- [x] Бизнес-логика сохранена.
- [x] API-контракты сохранены либо изменения согласованы.
- [x] Performance regression отсутствует по доступным измерениям.
- [ ] Pen fixes проверены — BLOCKED; актуальный Pen не прочитан, изменений дизайна нет.
- [x] Findings обновлены.

## Commit

Использовать отдельные commits по задачам:

refactor: resolve BE-...
perf: resolve PERF-...
fix: resolve PEN-...

## Результат этапа 09 — 2026-10-29

По указанию пользователя после фиксации08 scope включает15 оставшихся OPEN P2/P3:
SEC-003–007, BE-002–007, FE-001/002, PERF-001/002. Все15 — FIXED, не VERIFIED.
PEN-001 остаётся BLOCKED; актуальный Pen, дизайн и .pen не менялись. Этап01 также
не закрыт заочно. Общие checklist отмечают выполненный review/изменение по
подтверждённому concern, не массовое удаление/декомпозицию ради checklist.

Отчёт: `docs/audit/project-audit/refactoring.md`, протокол/evidence `refactor-*`.
Backend331 tests/3104 assertions passed без deprecations; frontend unit103 passed;
main Playwright1770 passed,0 failed/skipped/flaky; operationalSSR отдельно32 fixture
passed/8 live failed (marker отсутствует). Не считать их успешной live acceptance.
Caddy2.10.2 isolated log cases+adapt PASS. Syntax429/0, scoped formatter0 изменений,
Composer audit0 advisories после единственного package patch symfony/mime8.1.10.

Login JS412950→236479 bytes, gzipSync122796→82417; учитываются shared chunks.
HWID calls при десяти fake429 users10→1, SQL queries4→4. Web Vitals timings
снимались параллельно с regression; их улучшение не заявляется. Query baselines
7/2 сохранены, неподтверждённые indexes/N+1/image оптимизации не выполнялись.

Новая nullable payment snapshot/recovery migration тестировалась только на testing
DB. После24h или без legacy snapshot автоматического POST нет: explicit operator
reconciliation требует merchant evidence; competing workers должны быть остановлены.
Перед production rollout задать exact TRUSTED_PROXIES, применить migrations,
обновить config cache/consumers и отдельно проверить webhook/log/network behavior.
Production deployment, actual provider requests и live webhook registration не
выполнялись. Это operational follow-up, не VERIFIED или ACCEPTED_RISK.

Stage08 committed отдельно: f78ef04,6709fc0,8182155,fb8f13f и docs3ff3b24.
Stage09 source commits:409e2a4,0133a3f,e28cb1c,3711b79,03d25b2,b6a18bd,c817626,19ee7bf,667c002. Новых findings0 по
всем приоритетам; реестр21 ID:20 FIXED/1 BLOCKED/0 OPEN. Чужие env-примеры
сохранены. Временный renderer/export container удалены/остановлены, generated
SSR восстановлены. Остановка перед10, final verification не запускалась.
