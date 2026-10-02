# Шаг 4 — Backend API создания платежа

## Задачи

### Request

- [ ] Найти существующий Request для создания платежа
- [ ] Если отсутствует — создать `CreatePaymentRequest`
- [ ] Валидировать `product_id`
- [ ] Валидировать опциональный `promocode`

### Controller

- [ ] Найти существующий `PaymentController`
- [ ] Если отсутствует — создать его
- [ ] Реализовать метод `store()`
- [ ] Получить авторизованного User
- [ ] Найти Product
- [ ] Проверить Promocode существующей логикой
- [ ] Вызвать `PaymentService`
- [ ] Не дублировать платёжную бизнес-логику в Controller

### Response

- [ ] Вернуть локальный `payment_id`
- [ ] Вернуть `confirmation_url`

### Route

- [ ] Добавить `POST /payments`
- [ ] Защитить маршрут существующим `auth` middleware

## Проверка

- [ ] `php artisan route:list` содержит `POST /payments`
- [ ] Неавторизованный запрос отклоняется
- [ ] Валидный запрос создаёт Payment
- [ ] Валидный запрос возвращает `payment_id`
- [ ] Валидный запрос возвращает `confirmation_url`
- [ ] Невалидный `product_id` возвращает 422
- [ ] Невалидный промокод обрабатывается существующей логикой

## Commit

`feat: add payment creation endpoint`
