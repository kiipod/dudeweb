# Шаг 3 — PaymentService: создание платежа

## Зависимости

Перед реализацией прочитать:

- `docs/audit/models.md`
- `docs/audit/services.md`

Использовать найденную существующую архитектуру.

Для проверки создания платежей использовать тестовый магазин YooKassa
согласно `docs/yookassa/test-payment.md`.

## Задачи

### PaymentService

- [x] Найти существующий `PaymentService`
- [x] Если существует — расширить его
- [x] Если отсутствует — создать `app/Payment/PaymentService.php`
- [x] Добавить `YooKassa\Client` через DI

### Расчёт суммы

- [x] Получить стоимость выбранного `Product`
- [x] Если передан `Promocode`, использовать существующую механику его проверки
- [x] Использовать существующую механику расчёта скидки
- [x] Рассчитать итоговую сумму
- [x] Не допускать отрицательную итоговую сумму

### Локальный Payment

- [x] Создать локальную запись `Payment`
- [x] Связать Payment с User
- [x] Связать Payment с выбранным Product / Subscription согласно существующей модели
- [x] Сохранить исходную / итоговую сумму согласно существующей схеме
- [x] Установить статус `pending`

### Запрос YooKassa

- [x] Реализовать `createPayment(...)`
- [x] Сформировать запрос через API SDK версии 3.15.1
- [x] Передать итоговую сумму
- [x] Использовать валюту `RUB`
- [x] Использовать `capture = true`
- [x] Добавить описание платежа
- [x] Использовать confirmation типа `redirect`
- [x] Передать `return_url`

### Metadata

- [x] Передать локальный `payment_id`
- [x] Передать `user_id`
- [x] Передать `product_id`
- [x] Передать `source`
- [x] Поддержать `source = web`
- [x] Поддержать `source = telegram`

### Идемпотентность

- [x] Создать idempotency key
- [x] Использовать его при запросе создания платежа
- [x] Не генерировать новый ключ при повторе одного и того же логического запроса, если существующая архитектура позволяет определить повтор

### Сохранение результата

- [x] Сохранить `yookassa_payment_id`
- [x] Сохранить итоговую сумму
- [x] Сохранить статус
- [x] Сохранить `confirmation_url`

### Ошибки

- [x] Проверить существующие payment exceptions
- [x] Если подходящего исключения нет — создать `PaymentCreationException`
- [x] Перехватывать ошибки YooKassa SDK
- [x] Логировать ошибку без credentials
- [x] Преобразовывать ошибку SDK в `PaymentCreationException`

## Проверка

- [x] PaymentService разрешается через DI
- [x] Создание платежа создаёт запись в `payments`
- [x] Payment имеет статус `pending`
- [x] Заполнен `yookassa_payment_id`
- [x] Заполнен `confirmation_url`
- [x] В metadata передан локальный `payment_id`
- [x] В metadata передан `source`
- [x] Промокод корректно влияет на сумму
- [x] При ошибке SDK выбрасывается `PaymentCreationException`
- [x] credentials не попадают в логи

### Проверка через тестовый магазин

- [x] Тестовый магазин настроен согласно `docs/yookassa/test-payment.md`
- [x] `PaymentService` успешно создаёт тестовый платёж
- [x] YooKassa возвращает `yookassa_payment_id`
- [x] YooKassa возвращает URL подтверждения платежа
- [x] `confirmation_url` сохраняется в локальном Payment
- [x] Тест выполняется без использования реальных платёжных данных

## Commit

`feat: add yookassa payment creation`
