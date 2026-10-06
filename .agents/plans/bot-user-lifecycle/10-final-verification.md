# Шаг 10 — Финальная проверка User Lifecycle

На этом шаге новая функциональность не добавляется.

Исправляются только найденные проблемы.

## 1. Registration

Новый User:

- [ ] создаётся корректно
- [ ] получает Remnawave subscription
- [ ] получает trial
- [ ] local tag = TRIAL

## 2. Self-referral

- [ ] Пользователь не может пригласить себя
- [ ] Self-referral relation не создаётся
- [ ] Automatic promocode не выдаётся
- [ ] ReferralReward не создаётся

## 3. Returning user

Проверить:

- [ ] ACTIVE → не returning
- [ ] LIMITED → не returning
- [ ] DISABLED → не returning
- [ ] допустимый expired/returning scenario работает
- [ ] status берётся из Remnawave

## 4. Automatic promocode

Invited:

- [ ] automatic discount применён
- [ ] цена отображается со скидкой
- [ ] `У меня есть промокод` отсутствует

Returning:

- [ ] automatic discount применён
- [ ] ручной promocode скрыт

Проверить:

- [ ] automatic + manual не суммируются
- [ ] invited + returning не дают двойную скидку
- [ ] canceled payment не расходует promocode
- [ ] successful payment расходует promocode
- [ ] следующая оплата не получает одноразовую скидку

## 5. Trial lifecycle

Проверить:

    registration
        ↓
      TRIAL
        ↓
    Remnawave EXPIRED
        ↓
      INACTIVE

- [ ] Flow работает

После оплаты:

    INACTIVE
        ↓
    payment.succeeded
        ↓
    Remnawave ACTIVE
        ↓
    local ACTIVE

- [ ] Flow работает

## 6. Paid subscription expiration

    ACTIVE
      ↓
    Remnawave EXPIRED
      ↓
    INACTIVE

- [ ] Flow работает

## 7. FAMILY / FRIENDS

- [ ] FAMILY не заменяется TRIAL
- [ ] FAMILY не заменяется ACTIVE автоматически
- [ ] FAMILY не заменяется INACTIVE автоматически
- [ ] FRIENDS защищён аналогично
- [ ] Expiration reminder не отправляется бессрочному пользователю

## 8. Expiration reminder

- [ ] >1 дня → notification отсутствует
- [ ] 1 день → notification отправляется
- [ ] notification отправляется один раз
- [ ] после renewal учитывается новый expireAt

## 9. Referral reward

Провести несколько успешных платежей referred User.

### Payment #1

- [ ] Referrer получает reward
- [ ] Referrer получает Telegram notification

### Payment #2

- [ ] Referrer получает новое reward
- [ ] Referrer получает новое notification

### Payment #3

- [ ] Referrer получает новое reward

### Duplicate webhook

- [ ] Повторный webhook Payment #3 не создаёт ещё одно reward
- [ ] Notification не дублируется

### Canceled

- [ ] Reward отсутствует

## 10. Device limit

Проверить:

    count < limit
    count == limit
    count > limit

При превышении:

- [ ] Remnawave → DISABLED
- [ ] Пользователь получает notification
- [ ] Есть переход в device management
- [ ] Повторная проверка не спамит
- [ ] Recovery после уменьшения устройств проверен

## 11. Remnawave source of truth

- [ ] Status читается из актуального Remnawave API
- [ ] EXPIRED корректно синхронизируется
- [ ] LIMITED корректно обрабатывается
- [ ] DISABLED корректно обрабатывается
- [ ] Remnawave failure не изменяет local state ошибочно

## 12. UserStateManager

- [ ] Registration использует UserStateManager
- [ ] Payment flow использует UserStateManager
- [ ] Expiration sync использует UserStateManager
- [ ] Device flow согласован с UserStateManager
- [ ] State logic не дублируется по handlers/services

## 13. User schema

- [ ] `is_trial` имеет доказанное назначение или удалён
- [ ] `trial_expired` имеет доказанное назначение или удалён
- [ ] `is_free` имеет доказанное назначение или удалён
- [ ] `status` имеет доказанное назначение или удалён
- [ ] Нет двух независимых источников истины для одного состояния

## 14. Automated tests

- [ ] Registration tests
- [ ] Self-referral tests
- [ ] Returning tests
- [ ] Automatic promocode tests
- [ ] Promocode one-time tests
- [ ] Referral reward tests
- [ ] Referral idempotency tests
- [ ] UserStateManager tests
- [ ] Trial expiration tests
- [ ] Subscription expiration tests
- [ ] Reminder tests
- [ ] Device limit tests
- [ ] Remnawave synchronization tests
- [ ] Payment tests

Запустить весь test suite.

- [ ] Все тесты проходят

## 15. Static checks

Использовать существующие инструменты проекта.

- [ ] Formatter проходит
- [ ] Linter проходит, если настроен
- [ ] Static analysis проходит, если настроен

## 16. Code cleanup

- [ ] Нет `dd()`
- [ ] Нет `dump()`
- [ ] Нет временного debug-кода
- [ ] Нет закомментированной legacy implementation
- [ ] Нет ненужных imports
- [ ] Нет временных TODO
- [ ] Нет дублирующей state logic

## 17. Definition of Done

План завершён, когда:

- [ ] Self-referral невозможен
- [ ] ACTIVE/LIMITED/DISABLED не считаются returning
- [ ] Invited/returning promocode применяется автоматически
- [ ] Ручной promocode скрывается при automatic discount
- [ ] Promocodes не суммируются
- [ ] Automatic promocode одноразовый
- [ ] UserStateManager является единой точкой управления lifecycle
- [ ] TRIAL → INACTIVE работает
- [ ] INACTIVE → ACTIVE после оплаты работает
- [ ] ACTIVE → INACTIVE после expiration работает
- [ ] FAMILY / FRIENDS защищены
- [ ] Reminder за 1 день работает
- [ ] Referrer получает reward за каждую успешную оплату referral
- [ ] Referrer получает notification
- [ ] Device limit переводит Remnawave User в DISABLED
- [ ] Device management flow доступен
- [ ] Recovery device limit проверен
- [ ] User fields проаудированы
- [ ] Лишние поля удалены только при наличии доказательств
- [ ] Remnawave остаётся source of truth
- [ ] Все tests проходят
- [ ] Static checks проходят

После завершения обновить:

`.agent/plans/bot-user-lifecycle/00-overview.md`

и отметить шаг 10 выполненным.

## Commit

`test: verify bot user lifecycle`
