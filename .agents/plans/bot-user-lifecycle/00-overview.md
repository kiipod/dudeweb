# Доработка User Lifecycle и бизнес-логики Telegram-бота

> **Область:** регистрация, trial, returning/invited users, promocode,
> referral program, UserStateManager, Remnawave synchronization,
> subscription notifications и device limits.

## Цель

Привести пользовательские сценарии Telegram-бота к единой модели
состояния пользователя и устранить дублирование состояния между локальной
БД и Remnawave.

Основные задачи:

1. запретить self-referral;
2. корректно определять returning user;
3. автоматически применять одноразовый промокод invited/returning user;
4. исключить суммирование промокодов;
5. реализовать UserStateManager;
6. синхронизировать локальные теги с Remnawave;
7. реализовать lifecycle TRIAL → ACTIVE → INACTIVE;
8. сохранить специальные FAMILY / FRIENDS;
9. реализовать уведомление за 1 день до окончания подписки;
10. проверить и исправить referral rewards;
11. реализовать контроль device limit;
12. провести аудит полей User;
13. определить необходимость локального `users.status`.

## Терминология

### Remnawave status

Статус пользователя/подписки в Remnawave.

Remnawave API является источником истины для фактического состояния
подписки пользователя.

Примеры существующих статусов:

- ACTIVE
- LIMITED
- DISABLED
- EXPIRED

Не считать этот список полным без сверки с актуальным Remnawave API.

### Local tag

Локальная бизнес-классификация пользователя чатботом.

Не смешивать tag и Remnawave status.

Требуемые теги:

- TRIAL
- ACTIVE
- INACTIVE
- FAMILY
- FRIENDS

Перед реализацией проверить существующие Enum/поля и фактические названия.

## Источник истины

Для состояния подписки и пользователя источником истины является:

Remnawave API.

Исключение — chatbot-сценарии, в которых локальное состояние необходимо
изменить как часть бизнес-операции.

Локальная БД не должна самостоятельно конкурировать с Remnawave как второй
независимый источник истины.

## Основной lifecycle

### Новый пользователь

    registration
         ↓
    trial subscription
         ↓
    Remnawave user
         ↓
    local tag = TRIAL

### Trial закончился без оплаты

    Remnawave
    status → EXPIRED
         ↓
    synchronization
         ↓
    local tag → INACTIVE

### Оплата

    payment.succeeded
         ↓
    subscription activation
         ↓
    Remnawave
    status → ACTIVE
         ↓
    UserStateManager
         ↓
    local tag → ACTIVE

### Окончание оплаченной подписки

    Remnawave
    status → EXPIRED
         ↓
    UserStateManager
         ↓
    local tag → INACTIVE

## Специальные пользователи

Теги:

- FAMILY
- FRIENDS

зарезервированы для пользователей с бессрочной подпиской.

Обычная lifecycle-синхронизация не должна автоматически заменять эти теги
на TRIAL / ACTIVE / INACTIVE без явно определённого бизнес-правила.

## Returning user

Пользователь не может считаться returning user, если его текущий
Remnawave status:

- ACTIVE
- LIMITED
- DISABLED

Фактическая логика определения returning user должна быть проверена на
шаге аудита.

## Invited / Returning promocode

Для invited или returning user:

    eligible user
         ↓
    automatic promocode
         ↓
    тарифы отображаются уже со скидкой
         ↓
    ручное поле "У меня есть промокод" скрыто
         ↓
    первая успешная оплата
         ↓
    promocode consumed

Промокоды не суммируются.

Автоматический промокод можно использовать один раз при первой успешной
оплате.

## Referral

Self-referral запрещён.

При каждой успешной оплате приглашённого пользователя:

    referred user
         ↓
    payment.succeeded
         ↓
    referral reward
         ↓
    referrer
         ↓
    Telegram notification

Вознаграждение должно начисляться согласно существующей реферальной
программе.

## Device limit

Если количество устройств превышает лимит текущего тарифа:

    device_count > plan.device_limit
         ↓
    Remnawave status → DISABLED
         ↓
    Telegram notification
         ↓
    переход в device management flow

Не придумывать способ определения количества устройств или лимита.
Использовать существующую модель и Remnawave API.

## Ограничения

- не дублировать Remnawave state без необходимости;
- не менять payment flow без необходимости;
- не менять тарифную модель без необходимости;
- не придумывать новые referral rules;
- не придумывать новые promocode rules;
- не изменять FAMILY / FRIENDS без отдельного правила;
- не удалять User columns без полного анализа references;
- не проводить несвязанный рефакторинг.

## Шаги

- [x] Шаг 1 — Аудит текущего lifecycle
- [x] Шаг 2 — UserStateManager
- [ ] Шаг 3 — Referral registration и returning users
- [ ] Шаг 4 — Автоматический first-payment promocode
- [ ] Шаг 5 — Referral rewards
- [ ] Шаг 6 — Subscription notifications
- [ ] Шаг 7 — Device limit
- [ ] Шаг 8 — User model refactoring
- [ ] Шаг 9 — Lifecycle synchronization
- [ ] Шаг 10 — Финальная проверка

## Порядок выполнения

Шаги выполняются последовательно.

После каждого шага:

1. выполнить раздел **Проверка**;
2. исправить найденные проблемы;
3. повторить проверку;
4. отметить выполненные checkbox;
5. обновить этот overview;
6. выполнить Commit;
7. не переходить к следующему task-файлу без явного указания пользователя.
