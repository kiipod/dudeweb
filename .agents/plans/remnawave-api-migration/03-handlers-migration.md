# Шаг 3 — Миграция Remnawave Handler

## Зависимости

Перед началом прочитать:

- `docs/remnawave/api-1.json`
- `docs/remnawave/migration.md`

Использовать DTO, обновлённые на предыдущем шаге.

## Задачи

Для каждого Handler со статусом `MODIFIED` или `REPLACED` выполнить следующие проверки.

### Endpoint

- [ ] Сверить endpoint с `api-1.json`
- [ ] Обновить endpoint при необходимости
- [ ] Проверить path parameters
- [ ] Проверить формат path parameters

### HTTP method

- [ ] Сверить HTTP-метод
- [ ] Обновить HTTP-метод при необходимости

### Query parameters

- [ ] Удалить устаревшие query parameters
- [ ] Добавить новые required query parameters
- [ ] Обновить названия изменённых параметров
- [ ] Обновить типы значений

### Request body

- [ ] Сверить наличие `requestBody`
- [ ] Использовать актуальный request DTO
- [ ] Проверить структуру сериализации
- [ ] Удалить устаревшие поля
- [ ] Добавить новые required-поля
- [ ] Не отправлять поля, отсутствующие в schema

### Response

- [ ] Сверить success response code
- [ ] Сверить response schema
- [ ] Использовать актуальный response DTO
- [ ] Обновить получение вложенных данных
- [ ] Обновить обработку массивов
- [ ] Учесть nullable response согласно документации

### Error responses

- [ ] Сверить документированные error response codes
- [ ] Проверить существующую обработку ошибок
- [ ] Адаптировать её при изменении контракта
- [ ] Не скрывать ошибки нового API

### Removed Handler

Для Handler со статусом `REMOVED`:

- [ ] проверить наличие replacement в `migration.md`;
- [ ] если replacement существует — перевести использование на него;
- [ ] если replacement отсутствует — не придумывать реализацию;
- [ ] зафиксировать невозможность миграции.

### HTTP Client

- [ ] Проверить, изменился ли base path API
- [ ] Проверить формат Authorization
- [ ] Проверить обязательные headers
- [ ] Проверить Content-Type
- [ ] Проверить Accept
- [ ] Изменять HTTP-клиент только если это подтверждено `api-1.json` или существующей конфигурацией новой панели

## Проверка

- [ ] Каждый Handler использует актуальный endpoint
- [ ] Каждый Handler использует актуальный HTTP method
- [ ] Path parameters соответствуют API
- [ ] Query parameters соответствуют API
- [ ] Request body соответствует schema
- [ ] Response соответствует schema
- [ ] Handler используют актуальные DTO
- [ ] Устаревшие параметры не отправляются
- [ ] Не используются удалённые endpoint
- [ ] Все неразрешённые расхождения зафиксированы

## Commit

`refactor: migrate remnawave handlers to new api`
