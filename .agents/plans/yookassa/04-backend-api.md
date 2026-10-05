# Шаг 4 — Backend API создания платежа

## Задачи

### Request

- [x] Найти существующий Request для создания платежа
- [x] Если отсутствует — создать `CreatePaymentRequest`
- [x] Валидировать `product_id`
- [x] Валидировать опциональный `promocode`

### Controller

- [x] Найти существующий `PaymentController`
- [x] Если отсутствует — создать его
- [x] Реализовать метод `store()`
- [x] Получить авторизованного User
- [x] Найти Product
- [x] Проверить Promocode существующей логикой
- [x] Вызвать `PaymentService`
- [x] Не дублировать платёжную бизнес-логику в Controller

### Response

- [x] Вернуть локальный `payment_id`
- [x] Вернуть `confirmation_url`

### Route

- [x] Добавить `POST /payments`
- [x] Защитить маршрут существующим `auth` middleware

## Проверка

- [x] `php artisan route:list` содержит `POST /payments`
- [x] Неавторизованный запрос отклоняется
- [x] Валидный запрос создаёт Payment
- [x] Валидный запрос возвращает `payment_id`
- [x] Валидный запрос возвращает `confirmation_url`
- [x] Невалидный `product_id` возвращает 422
- [x] Невалидный промокод обрабатывается существующей логикой

## Commit

`feat: add payment creation endpoint`
