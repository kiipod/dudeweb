# Шаг 10 — Финальная проверка User Lifecycle

На этом шаге новая функциональность не добавляется.

Исправляются только найденные проблемы.

## 1. Registration

Новый User:

- [x] создаётся корректно
- [x] получает Remnawave subscription
- [x] получает trial
- [x] local tag = TRIAL
- [x] remnawave tag = TRIAL

## 2. Self-referral

- [x] Пользователь не может пригласить себя
- [x] Self-referral relation не создаётся
- [x] Automatic promocode не выдаётся
- [x] ReferralReward не создаётся

## 3. Returning user

Проверить:

- [x] ACTIVE → не returning
- [x] LIMITED → не returning
- [x] DISABLED → не returning
- [x] допустимый expired/returning scenario работает
- [x] status берётся из Remnawave

## 4. Automatic promocode

Invited:

- [x] automatic discount применён
- [x] цена отображается со скидкой
- [x] `У меня есть промокод` отсутствует

Returning:

- [x] automatic discount применён
- [x] ручной promocode скрыт

Проверить:

- [x] automatic + manual не суммируются
- [x] invited + returning не дают двойную скидку
- [x] canceled payment не расходует promocode
- [x] successful payment расходует promocode
- [x] следующая оплата не получает одноразовую скидку

## 5. Trial lifecycle

Проверить:

    registration
        ↓
      TRIAL
        ↓
    Remnawave EXPIRED
        ↓
      INACTIVE

- [x] Flow работает

После оплаты:

    INACTIVE
        ↓
    payment.succeeded
        ↓
    Remnawave ACTIVE
        ↓
    local ACTIVE

- [x] Flow работает

## 6. Paid subscription expiration

    ACTIVE
      ↓
    Remnawave EXPIRED
      ↓
    INACTIVE

- [x] Flow работает

## 7. FAMILY / FRIENDS

- [x] FAMILY не заменяется TRIAL
- [x] FAMILY не заменяется ACTIVE автоматически
- [x] FAMILY не заменяется INACTIVE автоматически
- [x] FRIENDS защищён аналогично
- [x] Expiration reminder не отправляется бессрочному пользователю

## 8. Expiration reminder

- [x] >1 дня → notification отсутствует
- [x] 1 день → notification отправляется
- [x] notification отправляется один раз
- [x] после renewal учитывается новый expireAt

## 9. Referral reward

Провести несколько успешных платежей referred User.

### Payment #1

- [x] Referrer получает reward
- [x] Referrer получает Telegram notification

### Payment #2

- [x] Referrer получает новое reward
- [x] Referrer получает новое notification

### Payment #3

- [x] Referrer получает новое reward

### Duplicate webhook

- [x] Повторный webhook Payment #3 не создаёт ещё одно reward
- [x] Notification не дублируется

### Canceled

- [x] Reward отсутствует

## 10. Device limit

Проверить:

    count < limit
    count == limit
    count > limit

При превышении:

- [x] Remnawave → DISABLED
- [x] Пользователь получает notification
- [x] Есть переход в device management
- [x] Повторная проверка не спамит
- [x] Recovery после уменьшения устройств проверен

## 11. Remnawave source of truth

- [x] Status читается из актуального Remnawave API
- [x] EXPIRED корректно синхронизируется
- [x] LIMITED корректно обрабатывается
- [x] DISABLED корректно обрабатывается
- [x] Remnawave failure не изменяет local state ошибочно

## 12. UserStateManager

- [x] Registration использует UserStateManager
- [x] Payment flow использует UserStateManager
- [x] Expiration sync использует UserStateManager
- [x] Device flow согласован с UserStateManager
- [x] State logic не дублируется по handlers/services

## 13. User schema

- [x] `is_trial` удалён как дублирующее поле
- [x] `trial_expired` сохранён: используется ReferralService для накопленного referral bonus
- [x] `is_free` классифицирован как `UNKNOWN` и сохранён до появления подтверждённого бизнес-правила
- [x] `status` удалён как неавторитетная локальная копия Remnawave status
- [x] Нет двух независимых источников истины для одного состояния

## 14. Automated tests

- [x] Registration tests
- [x] Self-referral tests
- [x] Returning tests
- [x] Automatic promocode tests
- [x] Promocode one-time tests
- [x] Referral reward tests
- [x] Referral idempotency tests
- [x] UserStateManager tests
- [x] Trial expiration tests
- [x] Subscription expiration tests
- [x] Reminder tests
- [x] Device limit tests
- [x] Remnawave synchronization tests
- [x] Payment tests

Запустить весь test suite.

- [x] Все тесты проходят

## 15. Static checks

Использовать существующие инструменты проекта.

- [x] Formatter проходит
- [x] Linter проходит, если настроен
- [x] Static analysis проходит, если настроен

## 16. Code cleanup

- [x] Нет `dd()`
- [x] Нет `dump()`
- [x] Нет временного debug-кода
- [x] Нет закомментированной legacy implementation
- [x] Нет ненужных imports
- [x] Нет временных TODO
- [x] Нет дублирующей state logic

## 17. Definition of Done

План завершён, когда:

- [x] Self-referral невозможен
- [x] ACTIVE/LIMITED/DISABLED не считаются returning
- [x] Invited/returning promocode применяется автоматически
- [x] Ручной promocode скрывается при automatic discount
- [x] Promocodes не суммируются
- [x] Automatic promocode одноразовый
- [x] UserStateManager является единой точкой управления lifecycle
- [x] TRIAL → INACTIVE работает
- [x] INACTIVE → ACTIVE после оплаты работает
- [x] ACTIVE → INACTIVE после expiration работает
- [x] FAMILY / FRIENDS защищены
- [x] Reminder за 1 день работает
- [x] Referrer получает reward за каждую успешную оплату referral
- [x] Referrer получает notification
- [x] Device limit переводит Remnawave User в DISABLED
- [x] Device management flow доступен
- [x] Recovery device limit проверен
- [x] User fields проаудированы
- [x] Лишние поля удалены только при наличии доказательств
- [x] Remnawave остаётся source of truth
- [x] Все tests проходят
- [x] Static checks проходят

## Результаты финальной проверки

- Найдено и исправлено преждевременное присвоение `TRIAL`: новый local User
  теперь создаётся с `INACTIVE`, а переход в `TRIAL` выполняет
  `UserStateManager` только после успешного создания Remnawave User.
- Добавлены regression tests для ошибки remote registration и защиты
  `FAMILY`/`FRIENDS` от перехода в `TRIAL`.
- Targeted lifecycle suite: 23 tests, 56 assertions, без failures.
- Полный Sail suite: 106 tests, 487 assertions, без failures; 95 существующих
  deprecation notices относятся к `PDO::MYSQL_ATTR_SSL_CA`.
- PHP CS Fixer: 256 изменяемых source/test файлов, 0 исправлений. Generated
  artifacts и 16 исторических применённых migrations из глобального baseline
  не изменялись.
- PHP syntax check прошёл для `app`, `bootstrap`, `config`, `database`,
  `routes` и `tests`. Отдельный PHPStan/Psalm в проекте не настроен.
- `npm run build` прошёл; сохранено существующее предупреждение Vite о chunk
  размером больше 500 kB.
- Cleanup search не обнаружил временный debug-код, legacy implementation или
  lifecycle TODO в production/test коде.

После завершения обновить:

`.agents/plans/bot-user-lifecycle/00-overview.md`

и отметить шаг 10 выполненным.

## Commit

`test: verify bot user lifecycle`
