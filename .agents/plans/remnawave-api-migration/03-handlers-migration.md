# Шаг 3 — Миграция Remnawave Handler

## Зависимости

Перед началом прочитать:

- `docs/remnawave/api-1.json`
- `docs/remnawave/migration.md`

Использовать DTO, обновлённые на предыдущем шаге.

## Задачи

Для каждого Handler со статусом `MODIFIED` или `REPLACED` выполнить следующие проверки.

### Endpoint

- [x] Сверить endpoint с `api-1.json`
- [x] Обновить endpoint при необходимости
- [x] Проверить path parameters
- [x] Проверить формат path parameters

### HTTP method

- [x] Сверить HTTP-метод
- [x] Обновить HTTP-метод при необходимости

### Query parameters

- [x] Удалить устаревшие query parameters
- [x] Добавить новые required query parameters
- [x] Обновить названия изменённых параметров
- [x] Обновить типы значений

### Request body

- [x] Сверить наличие `requestBody`
- [x] Использовать актуальный request DTO
- [x] Проверить структуру сериализации
- [x] Удалить устаревшие поля
- [x] Добавить новые required-поля
- [x] Не отправлять поля, отсутствующие в schema

### Response

- [x] Сверить success response code
- [x] Сверить response schema
- [x] Использовать актуальный response DTO
- [x] Обновить получение вложенных данных
- [x] Обновить обработку массивов
- [x] Учесть nullable response согласно документации

### Error responses

- [x] Сверить документированные error response codes
- [x] Проверить существующую обработку ошибок
- [x] Адаптировать её при изменении контракта
- [x] Не скрывать ошибки нового API

### Removed Handler

Для Handler со статусом `REMOVED`:

- [x] проверить наличие replacement в `migration.md`;
- [x] если replacement существует — перевести использование на него;
- [x] если replacement отсутствует — не придумывать реализацию;
- [x] зафиксировать невозможность миграции.

### HTTP Client

- [x] Проверить, изменился ли base path API
- [x] Проверить формат Authorization
- [x] Проверить обязательные headers
- [x] Проверить Content-Type
- [x] Проверить Accept
- [x] Изменять HTTP-клиент только если это подтверждено `api-1.json` или существующей конфигурацией новой панели

## Проверка

- [x] Каждый Handler использует актуальный endpoint
- [x] Каждый Handler использует актуальный HTTP method
- [x] Path parameters соответствуют API
- [x] Query parameters соответствуют API
- [x] Request body соответствует schema
- [x] Response соответствует schema
- [x] Handler используют актуальные DTO
- [x] Устаревшие параметры не отправляются
- [x] Не используются удалённые endpoint
- [x] Все неразрешённые расхождения зафиксированы

## Commit

`refactor: migrate remnawave handlers to new api`
