# Шаг 10 — Final Verification

## Цель

Подтвердить качество проекта после аудита,
исправлений и рефакторинга.

Сформировать финальный технический отчёт.

## 1. Findings Integrity

- [ ] Прочитать findings.md.
- [ ] Проверить уникальность ID.
- [ ] Проверить актуальность статусов.
- [ ] Проверить наличие evidence.
- [ ] Проверить наличие verification steps.
- [ ] Проверить ссылки на commits.
- [ ] Проверить отсутствие потерянных findings.
- [ ] Проверить отсутствие необоснованных VERIFIED.

## 2. Frontend

- [ ] Проверить frontend build.
- [ ] Проверить console errors.
- [ ] Проверить navigation.
- [ ] Проверить forms.
- [ ] Проверить responsive.
- [ ] Проверить accessibility.
- [ ] Проверить исправленные frontend findings.

## 3. Pen Design

- [ ] Повторно сравнить исправленные страницы.
- [ ] Проверить desktop.
- [ ] Проверить tablet.
- [ ] Проверить mobile.
- [ ] Проверить animations.
- [ ] Проверить interactive components.
- [ ] Проверить отсутствие визуальных регрессий.

## 4. Security

- [ ] Повторить проверки исправленных уязвимостей.
- [ ] Проверить authentication.
- [ ] Проверить authorization.
- [ ] Проверить payment security.
- [ ] Проверить webhook idempotency.
- [ ] Проверить secrets/configuration.
- [ ] Повторить dependency audit, если применимо.

## 5. Backend

- [ ] Проверить основные бизнес-сценарии.
- [ ] Проверить error handling.
- [ ] Проверить transactions.
- [ ] Проверить database relations.
- [ ] Проверить external integrations.
- [ ] Проверить исправленные backend findings.

## 6. Performance

- [ ] Повторить доступные измерения.
- [ ] Сравнить baseline и final.
- [ ] Проверить database performance.
- [ ] Проверить frontend performance.
- [ ] Проверить отсутствие регрессий.
- [ ] Зафиксировать фактические результаты.

## 7. Automated Tests

Повторно запустить:

- [ ] Backend unit tests.
- [ ] Backend feature tests.
- [ ] Integration tests.
- [ ] Frontend tests.
- [ ] E2E tests, если доступны.
- [ ] PHP static analysis.
- [ ] Frontend lint/typecheck.
- [ ] Frontend production build.

Зафиксировать:

- passed;
- failed;
- skipped;
- blocked.

Не скрывать неуспешные проверки.

## 8. Database

- [ ] Проверить migrations на изолированной БД.
- [ ] Проверить rollback, где безопасно и применимо.
- [ ] Проверить indexes.
- [ ] Проверить foreign keys.
- [ ] Проверить отсутствие потери тестовых данных.
- [ ] Проверить совместимость schema с приложением.

## 9. Git Review

Выполнить:

git status --short
git diff

При необходимости проверить diff относительно базового commit.

- [ ] Нет случайных изменений.
- [ ] Нет секретов.
- [ ] Нет временного debug-кода.
- [ ] Нет неиспользуемых imports.
- [ ] Нет случайно удалённых тестов.
- [ ] Нет отключённых проверок.
- [ ] Нет несогласованных изменений API.

## 10. Final Report

Создать:

docs/audit/project-audit/final-report.md

Структура:

### Executive Summary

Краткий итог аудита.

### Scope

Какие области проверены.

### Findings Summary

Количество проблем по приоритетам и статусам.

### Security

Результаты проверки безопасности.

### Frontend and Pen

Результаты проверки интерфейса.

### Backend

Результаты code review и рефакторинга.

### Performance

Измерения до и после.

### Tests

Команды и результаты тестов.

### Changes

Список выполненных исправлений и commits.

### Remaining Issues

Оставшиеся OPEN/BLOCKED/ACCEPTED_RISK.

### Limitations

Что не удалось проверить и почему.

### Conclusion

Обоснованная оценка готовности проекта.

## 11. Definition of Done

- [ ] Все findings актуализированы.
- [ ] Исправленные проблемы повторно проверены.
- [ ] Все доступные тесты запущены.
- [ ] Все результаты задокументированы.
- [ ] Security recheck завершён.
- [ ] Frontend recheck завершён.
- [ ] Pen recheck завершён.
- [ ] Performance recheck завершён.
- [ ] Git diff проверен.
- [ ] final-report.md создан.
- [ ] overview.md обновлён.

Если остались P0/P1 или заблокированные критические проверки,
не объявлять проект полностью готовым к production.

## Commit

docs: finalize project audit report
