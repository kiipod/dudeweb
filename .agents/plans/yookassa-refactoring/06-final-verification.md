# Шаг 6 — Финальная проверка YooKassa после рефакторинга

На этом шаге новая функциональность не добавляется.

Исправляются только проблемы, найденные во время финальной проверки.

## Зависимости

Прочитать:

- `docs/audit/yookassa-refactoring.md`
- `docs/yookassa/declined-payments.md`
- `docs/yookassa/test-payment.md`

## 1. Создание платежа

Проверить Backend API:

- [ ] Payment создаётся
- [ ] YooKassa Payment создаётся
- [ ] `yookassa_payment_id` сохраняется
- [ ] `confirmation_url` сохраняется
- [ ] Payment получает `pending`
- [ ] Amount корректен
- [ ] Promocode корректен

Проверить Telegram:

- [ ] Payment создаётся через общую payment logic
- [ ] Пользователь получает рабочую кнопку оплаты
- [ ] `source = telegram` сохраняется

## 2. Успешный платёж

Провести тестовый платёж согласно:

`docs/yookassa/test-payment.md`

Проверить:

- [ ] Получен `payment.succeeded`
- [ ] Payment получает `succeeded`
- [ ] Subscription продлевается один раз
- [ ] Remnawave получает правильный `expireAt`
- [ ] Promocode фиксируется один раз
- [ ] ReferralReward создаётся согласно бизнес-правилам
- [ ] Telegram notification отправляется

## 3. Отменённый платёж

Использовать:

`docs/yookassa/declined-payments.md`

Проверить:

- [ ] Получен `payment.canceled`
- [ ] Payment получает `canceled`
- [ ] `cancellation_details.party` обработан
- [ ] `cancellation_details.reason` обработан
- [ ] Пользователь получает соответствующее сообщение
- [ ] Не отображается технический reason
- [ ] Не используется старый `confirmation_url`

## 4. Повторная оплата

После canceled:

- [ ] Пользователь может инициировать новую попытку
- [ ] Создаётся новый локальный Payment
- [ ] Создаётся новый YooKassa Payment
- [ ] Новый `yookassa_payment_id` отличается от старого
- [ ] Новый `confirmation_url` отличается от старого
- [ ] Новый Payment имеет `pending`
- [ ] Новая ссылка открывается
- [ ] Новый платёж можно успешно завершить

После успешного retry:

- [ ] Новый Payment становится `succeeded`
- [ ] Старый Payment остаётся `canceled`
- [ ] Subscription продлевается только по успешному Payment

## 5. Неизвестная причина отмены

Смоделировать неизвестный `cancellation_details.reason`.

- [ ] Exception не возникает
- [ ] Используется fallback
- [ ] Старый URL не отправляется
- [ ] Retry flow остаётся безопасным

## 6. Идемпотентность

Повторно обработать один `payment.succeeded`.

- [ ] Subscription не продлевается повторно
- [ ] Promocode не применяется повторно
- [ ] ReferralReward не создаётся повторно

Повторно обработать один `payment.canceled`.

- [ ] Не создаются неконтролируемые retry Payment
- [ ] Пользователь не получает неконтролируемые дубли сообщений
- [ ] Старый confirmation URL не возвращается в flow

## 7. PaymentService

Проверить итоговый класс.

- [ ] Ответственность класса понятна
- [ ] Нет чрезмерно длинных методов
- [ ] Нет глубокой вложенности без необходимости
- [ ] Нет дублирующей бизнес-логики
- [ ] Нет Telegram UI logic
- [ ] Нет ненужных abstraction layers

## 8. Payment model

Сверить с:

`docs/audit/yookassa-refactoring.md`

- [ ] Все оставшиеся столбцы имеют назначение
- [ ] UNUSED поля удалены либо обоснованно оставлены
- [ ] AUDIT поля не удалены случайно
- [ ] UNKNOWN поля не удалены без подтверждения
- [ ] Индексы соответствуют реальным запросам
- [ ] Relations корректны

## 9. Module architecture

- [ ] Backend использует общую payment logic
- [ ] Telegram использует общую payment logic
- [ ] Retry использует общую payment logic
- [ ] Webhook Controller остаётся тонким
- [ ] YooKassa SDK не дублируется собственными abstraction без необходимости
- [ ] Subscription logic не дублируется
- [ ] Promocode logic не дублируется
- [ ] Referral logic не дублируется
- [ ] Cancellation mapping не дублируется

## 10. Static checks

Использовать только уже настроенные проектом инструменты.

- [ ] PHP syntax проходит
- [ ] Formatter проходит
- [ ] Linter проходит, если настроен
- [ ] Static analysis проходит, если настроен

## 11. Automated tests

Запустить payment-related tests.

- [ ] Payment creation tests проходят
- [ ] Webhook tests проходят
- [ ] Succeeded tests проходят
- [ ] Canceled tests проходят
- [ ] Cancellation reason tests проходят
- [ ] Retry payment tests проходят
- [ ] Idempotency tests проходят
- [ ] Subscription tests проходят
- [ ] Promocode tests проходят
- [ ] Referral tests проходят
- [ ] Telegram payment tests проходят

Запустить весь test suite.

- [ ] Все тесты проекта проходят

## 12. Code cleanup

Проверить:

- [ ] Нет `dd()`
- [ ] Нет `dump()`
- [ ] Нет временного debug-кода
- [ ] Нет тестовых credentials
- [ ] Нет закомментированной старой реализации
- [ ] Нет временных TODO, созданных во время рефакторинга
- [ ] Нет неиспользуемых imports
- [ ] Нет очевидного dead code

## 13. Git diff

Выполнить:

    git status --short
    git diff

Проверить:

- [ ] Изменения относятся только к текущему плану
- [ ] Нет случайных изменений
- [ ] Пользовательские изменения не перезаписаны
- [ ] Пользовательские изменения не откатывались

## 14. Definition of Done

План считается завершённым, когда:

- [ ] `payment.canceled` учитывает `cancellation_details`
- [ ] Сообщения соответствуют причинам из `declined-payments.md`
- [ ] Старый `confirmation_url` не используется повторно
- [ ] Retry создаёт новый Payment
- [ ] Retry создаёт новый YooKassa Payment
- [ ] Пользователь получает новый рабочий `confirmation_url`
- [ ] Повторный webhook идемпотентен
- [ ] PaymentService отрефакторен
- [ ] Ответственности PaymentService уменьшены
- [ ] Таблица Payment проаудирована
- [ ] Лишние поля удалены только при наличии доказательств
- [ ] Архитектура модуля упрощена
- [ ] Функциональность не потеряна
- [ ] Тестовый successful flow проходит
- [ ] Тестовый canceled/retry flow проходит
- [ ] Все automated tests проходят
- [ ] Static checks проходят

После успешного завершения обновить:

`.agent/plans/yookassa-refactoring/00-overview.md`

и отметить:

`Шаг 6 — Финальная проверка`

как выполненный.

## Commit

`test: verify yookassa payment refactoring`
