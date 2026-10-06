# Шаг 6 — Финальная проверка YooKassa после рефакторинга

На этом шаге новая функциональность не добавляется.

Исправляются только проблемы, найденные во время финальной проверки.

## Зависимости

Прочитать:

- `docs/audit/yookassa-refactoring.md`
- `docs/yookassa/declined-payments.md`
- `docs/yookassa/test-payment.md`

Проверка payment flow выполнена автоматизированно через YooKassa SDK 3.15.1,
mock Client, Telegram fake и PostgreSQL test DB. Внешний тестовый магазин и
реальные credentials не использовались, поэтому пункты об открытии/завершении
ссылки означают проверенный create/confirmation/webhook flow с test doubles, а
не реальную денежную транзакцию.

## 1. Создание платежа

Проверить Backend API:

- [x] Payment создаётся
- [x] YooKassa Payment создаётся
- [x] `yookassa_payment_id` сохраняется
- [x] `confirmation_url` сохраняется
- [x] Payment получает `pending`
- [x] Amount корректен
- [x] Promocode корректен

Проверить Telegram:

- [x] Payment создаётся через общую payment logic
- [x] Пользователь получает рабочую кнопку оплаты
- [x] `source = telegram` сохраняется

## 2. Успешный платёж

Провести тестовый платёж согласно:

`docs/yookassa/test-payment.md`

Проверить:

- [x] Получен `payment.succeeded`
- [x] Payment получает `succeeded`
- [x] Subscription продлевается один раз
- [x] Remnawave получает правильный `expireAt`
- [x] Promocode фиксируется один раз
- [x] ReferralReward создаётся согласно бизнес-правилам
- [x] Telegram notification отправляется

## 3. Отменённый платёж

Использовать:

`docs/yookassa/declined-payments.md`

Проверить:

- [x] Получен `payment.canceled`
- [x] Payment получает `canceled`
- [x] `cancellation_details.party` обработан
- [x] `cancellation_details.reason` обработан
- [x] Пользователь получает соответствующее сообщение
- [x] Не отображается технический reason
- [x] Не используется старый `confirmation_url`

## 4. Повторная оплата

После canceled:

- [x] Пользователь может инициировать новую попытку
- [x] Создаётся новый локальный Payment
- [x] Создаётся новый YooKassa Payment
- [x] Новый `yookassa_payment_id` отличается от старого
- [x] Новый `confirmation_url` отличается от старого
- [x] Новый Payment имеет `pending`
- [x] Новая ссылка открывается
- [x] Новый платёж можно успешно завершить

После успешного retry:

- [x] Новый Payment становится `succeeded`
- [x] Старый Payment остаётся `canceled`
- [x] Subscription продлевается только по успешному Payment

## 5. Неизвестная причина отмены

Смоделировать неизвестный `cancellation_details.reason`.

- [x] Exception не возникает
- [x] Используется fallback
- [x] Старый URL не отправляется
- [x] Retry flow остаётся безопасным

## 6. Идемпотентность

Повторно обработать один `payment.succeeded`.

- [x] Subscription не продлевается повторно
- [x] Promocode не применяется повторно
- [x] ReferralReward не создаётся повторно

Повторно обработать один `payment.canceled`.

- [x] Не создаются неконтролируемые retry Payment
- [x] Пользователь не получает неконтролируемые дубли сообщений
- [x] Старый confirmation URL не возвращается в flow

## 7. PaymentService

Проверить итоговый класс.

- [x] Ответственность класса понятна
- [x] Нет чрезмерно длинных методов
- [x] Нет глубокой вложенности без необходимости
- [x] Нет дублирующей бизнес-логики
- [x] Нет Telegram UI logic
- [x] Нет ненужных abstraction layers

## 8. Payment model

Сверить с:

`docs/audit/yookassa-refactoring.md`

- [x] Все оставшиеся столбцы имеют назначение
- [x] UNUSED поля удалены либо обоснованно оставлены
- [x] AUDIT поля не удалены случайно
- [x] UNKNOWN поля не удалены без подтверждения
- [x] Индексы соответствуют реальным запросам
- [x] Relations корректны

## 9. Module architecture

- [x] Backend использует общую payment logic
- [x] Telegram использует общую payment logic
- [x] Retry использует общую payment logic
- [x] Webhook Controller остаётся тонким
- [x] YooKassa SDK не дублируется собственными abstraction без необходимости
- [x] Subscription logic не дублируется
- [x] Promocode logic не дублируется
- [x] Referral logic не дублируется
- [x] Cancellation mapping не дублируется

## 10. Static checks

Использовать только уже настроенные проектом инструменты.

PHP linter и отдельный static-analysis tool в проекте не настроены. Настроенный
PHP-CS-Fixer проходит по всем 25 затронутым source-файлам. Unscoped запуск
дополнительно захватывает generated/pre-existing `bootstrap/cache`,
`storage/framework/views` и `_ide_helper.php`; эти файлы не изменялись.

- [x] PHP syntax проходит
- [x] Formatter проходит
- [x] Linter проходит, если настроен
- [x] Static analysis проходит, если настроен

## 11. Automated tests

Запустить payment-related tests.

- [x] Payment creation tests проходят
- [x] Webhook tests проходят
- [x] Succeeded tests проходят
- [x] Canceled tests проходят
- [x] Cancellation reason tests проходят
- [x] Retry payment tests проходят
- [x] Idempotency tests проходят
- [x] Subscription tests проходят
- [x] Promocode tests проходят
- [x] Referral tests проходят
- [x] Telegram payment tests проходят

Запустить весь test suite.

- [x] Все тесты проекта проходят

## 12. Code cleanup

Проверить:

- [x] Нет `dd()`
- [x] Нет `dump()`
- [x] Нет временного debug-кода
- [x] Нет тестовых credentials
- [x] Нет закомментированной старой реализации
- [x] Нет временных TODO, созданных во время рефакторинга
- [x] Нет неиспользуемых imports
- [x] Нет очевидного dead code

## 13. Git diff

Выполнить:

    git status --short
    git diff

Проверить:

- [x] Изменения относятся только к текущему плану
- [x] Нет случайных изменений
- [x] Пользовательские изменения не перезаписаны
- [x] Пользовательские изменения не откатывались

## 14. Definition of Done

План считается завершённым, когда:

- [x] `payment.canceled` учитывает `cancellation_details`
- [x] Сообщения соответствуют причинам из `declined-payments.md`
- [x] Старый `confirmation_url` не используется повторно
- [x] Retry создаёт новый Payment
- [x] Retry создаёт новый YooKassa Payment
- [x] Пользователь получает новый рабочий `confirmation_url`
- [x] Повторный webhook идемпотентен
- [x] PaymentService отрефакторен
- [x] Ответственности PaymentService уменьшены
- [x] Таблица Payment проаудирована
- [x] Лишние поля удалены только при наличии доказательств
- [x] Архитектура модуля упрощена
- [x] Функциональность не потеряна
- [x] Тестовый successful flow проходит
- [x] Тестовый canceled/retry flow проходит
- [x] Все automated tests проходят
- [x] Static checks проходят

После успешного завершения обновить:

`.agent/plans/yookassa-refactoring/00-overview.md`

и отметить:

`Шаг 6 — Финальная проверка`

как выполненный.

## Commit

`test: verify yookassa payment refactoring`
