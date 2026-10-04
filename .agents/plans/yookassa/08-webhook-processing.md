# Шаг 8 — YooKassa Webhook: обработка платежа

## Зависимости

Перед реализацией прочитать:

- `docs/audit/models.md`
- `docs/audit/services.md`
- `docs/audit/api.md`

Использовать существующие механизмы Promocode, Referral и Remnawave.

## Задачи

### Notification

- [ ] Добавить в PaymentService обработку notification
- [ ] Распарсить notification согласно SDK / документации YooKassa
- [ ] Получить тип события
- [ ] Получить YooKassa payment ID
- [ ] Найти локальный Payment

### Неизвестный Payment

- [ ] Не создавать Payment из webhook
- [ ] Залогировать неизвестный `yookassa_payment_id`
- [ ] Не выполнять бизнес-логику для неизвестного платежа

### payment.canceled

- [ ] Обработать `payment.canceled`
- [ ] Установить локальный статус `canceled`
- [ ] Не изменять Subscription
- [ ] Не начислять referral reward
- [ ] Не фиксировать использование промокода

### payment.succeeded

- [ ] Обработать `payment.succeeded`
- [ ] Проверить текущий статус локального Payment
- [ ] Установить статус `succeeded`

### Идемпотентность

Повторный webhook не должен повторно выполнять бизнес-операции.

- [ ] Повторный `payment.succeeded` не продлевает Subscription второй раз
- [ ] Повторный webhook не применяет Promocode второй раз
- [ ] Повторный webhook не создаёт ReferralReward второй раз
- [ ] Повторный webhook не должен повторно синхронизировать Remnawave без необходимости
- [ ] Учесть возможность конкурентной обработки одинаковых webhook

### Subscription

- [ ] Получить существующую Subscription
- [ ] Определить приобретённый период
- [ ] Определить текущую дату окончания
- [ ] Рассчитать:

      new_end = max(current_end, now()) + purchased_period

- [ ] Обновить Subscription
- [ ] Сохранить новую дату окончания

### Remnawave

- [ ] Использовать Handler, найденный во время аудита
- [ ] Не создавать параллельную реализацию Remnawave API
- [ ] Передать новый `expireAt`
- [ ] Синхронизировать подписку

### Promocode

- [ ] Проверить, использовался ли Promocode при создании Payment
- [ ] Использовать существующую модель `UserPromocode`
- [ ] Зафиксировать использование только после `payment.succeeded`
- [ ] Не фиксировать использование повторно

### Referral

- [ ] Проверить существующую реферальную механику
- [ ] Проверить, является ли это первой успешной оплатой приглашённого
- [ ] Применить существующую механику referral reward
- [ ] Не начислять reward повторно

### Telegram: succeeded

- [ ] Проверить `source`
- [ ] Если `source = telegram`, определить Telegram user
- [ ] Отправить сообщение об успешной оплате
- [ ] Указать новую дату окончания подписки

### Telegram: canceled

- [ ] Для Telegram payment отправить сообщение об отмене
- [ ] Добавить кнопку `Попробовать снова`
- [ ] Кнопка должна использовать существующий flow выбора / создания платежа

### Ошибки

- [ ] Логировать ошибки обработки
- [ ] Не логировать YooKassa secret key
- [ ] Не оставлять Payment в неконсистентном состоянии
- [ ] Учесть ошибки синхронизации с Remnawave согласно существующей архитектуре проекта

## Проверка

- [ ] `payment.succeeded` переводит Payment в `succeeded`
- [ ] Subscription продлевается
- [ ] Дата рассчитывается от `max(current_end, now())`
- [ ] Remnawave получает новый `expireAt`
- [ ] Promocode фиксируется
- [ ] Referral reward применяется при выполнении условий
- [ ] Telegram-пользователь получает уведомление

- [ ] повторный `payment.succeeded` не продлевает Subscription
- [ ] повторный webhook не использует Promocode повторно
- [ ] повторный webhook не начисляет ReferralReward повторно

- [ ] `payment.canceled` переводит Payment в `canceled`
- [ ] canceled payment не продлевает Subscription

- [ ] неизвестный Payment не приводит к созданию Subscription

## Commit

`feat: handle yookassa payment notifications`
