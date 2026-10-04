# Шаг 8 — YooKassa Webhook: обработка платежа

## Зависимости

Перед реализацией прочитать:

- `docs/audit/models.md`
- `docs/audit/services.md`
- `docs/audit/api.md`

Использовать существующие механизмы Promocode, Referral и Remnawave.

## Задачи

### Notification

- [x] Добавить в PaymentService обработку notification
- [x] Распарсить notification согласно SDK / документации YooKassa
- [x] Получить тип события
- [x] Получить YooKassa payment ID
- [x] Найти локальный Payment

### Неизвестный Payment

- [x] Не создавать Payment из webhook
- [x] Залогировать неизвестный `yookassa_payment_id`
- [x] Не выполнять бизнес-логику для неизвестного платежа

### payment.canceled

- [x] Обработать `payment.canceled`
- [x] Установить локальный статус `canceled`
- [x] Не изменять Subscription
- [x] Не начислять referral reward
- [x] Не фиксировать использование промокода

### payment.succeeded

- [x] Обработать `payment.succeeded`
- [x] Проверить текущий статус локального Payment
- [x] Установить статус `succeeded`

### Идемпотентность

Повторный webhook не должен повторно выполнять бизнес-операции.

- [x] Повторный `payment.succeeded` не продлевает Subscription второй раз
- [x] Повторный webhook не применяет Promocode второй раз
- [x] Повторный webhook не создаёт ReferralReward второй раз
- [x] Повторный webhook не должен повторно синхронизировать Remnawave без необходимости
- [x] Учесть возможность конкурентной обработки одинаковых webhook

### Subscription

- [x] Получить существующую Subscription
- [x] Определить приобретённый период
- [x] Определить текущую дату окончания
- [x] Рассчитать:

      new_end = max(current_end, now()) + purchased_period

- [x] Обновить Subscription
- [x] Сохранить новую дату окончания

### Remnawave

- [x] Использовать Handler, найденный во время аудита
- [x] Не создавать параллельную реализацию Remnawave API
- [x] Передать новый `expireAt`
- [x] Синхронизировать подписку

### Promocode

- [x] Проверить, использовался ли Promocode при создании Payment
- [x] Использовать существующую модель `UserPromocode`
- [x] Зафиксировать использование только после `payment.succeeded`
- [x] Не фиксировать использование повторно

### Referral

- [x] Проверить существующую реферальную механику
- [x] Проверить, является ли это первой успешной оплатой приглашённого
- [x] Применить существующую механику referral reward
- [x] Не начислять reward повторно

### Telegram: succeeded

- [x] Проверить `source`
- [x] Если `source = telegram`, определить Telegram user
- [x] Отправить сообщение об успешной оплате
- [x] Указать новую дату окончания подписки

### Telegram: canceled

- [x] Для Telegram payment отправить сообщение об отмене
- [x] Добавить кнопку `Попробовать снова`
- [x] Кнопка должна использовать существующий flow выбора / создания платежа

### Ошибки

- [x] Логировать ошибки обработки
- [x] Не логировать YooKassa secret key
- [x] Не оставлять Payment в неконсистентном состоянии
- [x] Учесть ошибки синхронизации с Remnawave согласно существующей архитектуре проекта

## Проверка

- [x] `payment.succeeded` переводит Payment в `succeeded`
- [x] Subscription продлевается
- [x] Дата рассчитывается от `max(current_end, now())`
- [x] Remnawave получает новый `expireAt`
- [x] Promocode фиксируется
- [x] Referral reward применяется при выполнении условий
- [x] Telegram-пользователь получает уведомление

- [x] повторный `payment.succeeded` не продлевает Subscription
- [x] повторный webhook не использует Promocode повторно
- [x] повторный webhook не начисляет ReferralReward повторно

- [x] `payment.canceled` переводит Payment в `canceled`
- [x] canceled payment не продлевает Subscription

- [x] неизвестный Payment не приводит к созданию Subscription

## Commit

`feat: handle yookassa payment notifications`
