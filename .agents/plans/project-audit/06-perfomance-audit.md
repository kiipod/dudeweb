# Шаг 6 — Performance Audit

## Цель

Выявить реальные проблемы производительности frontend,
backend, БД и внешних интеграций.

Оптимизацию выполнять только после измерений или
подтверждения конкретного неэффективного алгоритма.

## Baseline

- [x] Определить доступные средства измерения.
- [x] Зафиксировать конфигурацию окружения.
- [x] Определить критические пользовательские сценарии.
- [x] Зафиксировать исходные метрики.
- [x] Отделить локальные измерения от production-показателей.

Не выполнять нагрузочные тесты на production без разрешения.

## Database

- [x] Найти N+1 queries.
- [x] Проверить eager loading.
- [x] Проверить тяжёлые JOIN.
- [x] Проверить запросы без нужных индексов.
- [x] Проверить лишние SELECT *.
- [x] Проверить pagination.
- [x] Проверить повторные запросы.
- [x] Проверить планы выполнения тяжёлых запросов.

## Backend

- [x] Проверить синхронные внешние HTTP-вызовы.
- [x] Проверить timeout.
- [x] Проверить retry policy.
- [x] Проверить Queue/Jobs.
- [x] Проверить Scheduler.
- [x] Проверить кеширование.
- [x] Проверить повторные вычисления.
- [x] Проверить неэффективные циклы.
- [x] Проверить потребление памяти.

## Frontend

- [x] Проверить размер JS bundle.
- [x] Проверить размер CSS bundle.
- [x] Проверить code splitting.
- [x] Проверить lazy loading.
- [x] Проверить загрузку изображений.
- [x] Проверить шрифты.
- [x] Проверить лишние API-запросы.
- [x] Проверить повторные рендеры.
- [x] Проверить тяжёлые анимации.
- [x] Проверить scroll performance.

## Web Vitals

Если доступны браузерные инструменты:

- [x] LCP.
- [ ] INP. — не получен; Event Timing entries пусты, ограничение зафиксировано.
- [x] CLS.
- [x] FCP.
- [x] TTFB.

Для каждой метрики указать условия измерения.

## External Integrations

- [x] Проверить количество Remnawave API requests.
- [x] Проверить YooKassa API requests.
- [x] Проверить Telegram API requests.
- [x] Проверить batch processing.
- [x] Проверить обработку rate limits.
- [x] Проверить повторные вызовы при ошибках.

## Отчёт

Создать:

docs/audit/project-audit/performance.md

Для каждой измеренной проблемы указать:

| Scenario | Metric | Baseline | Target | Finding |
|---|---|---|---|---|

Target задавать на основании требований или согласованной цели.

Не придумывать численные показатели.

## Findings

Использовать префикс PERF.

Указывать измерения и условия воспроизведения.

## Проверка

- [x] Доступные метрики собраны.
- [x] Критические сценарии проверены.
- [x] Backend bottlenecks проанализированы.
- [x] Frontend bottlenecks проанализированы.
- [x] Database queries проверены.
- [x] Findings обновлены.
- [x] Production-код не изменён.

## Commit

docs: audit application performance

## Результат диагностики — 2026-10-29

Отчёт: `docs/audit/project-audit/performance.md`; протокол и исходные данные
находятся в `evidence/performance-*` и `evidence/PerformanceProbeTest.php`.
Новые PERF-001/002 OPEN: P0 — 0, P1 — 0, P2 — 2, P3 — 0.

Собраны client bundle, 12 Chromium navigation samples, SQL counts/EXPLAIN и
синтетический rate-limit batch. PHP probe: 1 test / 14 assertions, failures/errors=0,
2 deprecations (BE-007). Runtime только Sail. Все отмеченные пункты означают
диагностический анализ с ограничениями отчёта, не production acceptance.
INP не измерен достоверно и оставлен открытым. Остальные browser timings —
локальные наблюдения, не field Web Vitals. Production load, реальные provider
вызовы, длительная память/конкуренция и крупная DB distribution не проверялись.
Production-код не изменён. Этап 07 не начат. Результаты подготовлены к фиксации
коммитом `docs: audit application performance`.
