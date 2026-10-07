# Аудит lifecycle пользователей Telegram-бота

Аудит выполнен 6 октября 2026 года на ветке `bot-user-lifecycle` по состоянию
кода после Remnawave API migration и внедрения YooKassa. Production-код и
схема базы данных на этом шаге не изменялись.

## Источники и границы

- локальная схема и модели: `users`, `payments`, `promocodes`,
  `user_promocodes`, `referral_rewards`, `referral_bonus`, `plans`, `products`;
- Telegram flow: `BotHandler`, `UserRepository`, `UserOnboardingService`,
  `UserService`;
- payment flow: `PaymentService`, `SuccessfulPaymentProcessor`,
  `SubscriptionExtender`, `PaymentStatusNotifier`;
- бизнес-сервисы: `PromocodeService`, `ReferralService`,
  `PartnerMessageService`;
- Remnawave source of truth: локальный OpenAPI-файл
  `docs/remnawave/api-1.json`, Remnawave API v3.4.3, и текущие DTO/handlers.

OpenAPI подтверждает четыре удалённых subscription status: `ACTIVE`,
`DISABLED`, `LIMITED`, `EXPIRED`. Поле Remnawave `tag` является отдельной
nullable-категорией, а не status. Контракт также содержит user webhooks
(`user.modified`, `user.disabled`, `user.enabled`, `user.limited`,
`user.expired`, `user.expiration` и другие), однако приложение их сейчас не
принимает.

## Current User State

### Локальные enum

| Enum | Значения | Фактическое использование |
|---|---|---|
| `App\\Remnawave\\Enums\\UserStatus` | `ACTIVE`, `DISABLED`, `LIMITED`, `EXPIRED` | cast `users.status` и Remnawave DTO |
| `App\\Bot\\Telegram\\Enums\\UserStatus` | те же значения плюс `label()` | production-кодом не используется |
| `App\\Bot\\Telegram\\Enums\\UserTags` | `TRIAL`, `ACTIVE`, `INACTIVE`, `FRIENDS`, `FAMILY` | cast `users.tags`, onboarding и `UserService` |
| `App\\MoonShine\\Enums\\UserStatusEnum` | `new`, `trial`, `active`, `inactive` | к `User` не подключён и с DB enum `users.status` несовместим |

Критическое расхождение: `UserOnboardingService` обращается к
`UserTags::New`, но такого case нет. Вызов `resolveScenario()` для `/start`
завершается ошибкой до выбора onboarding-сценария.

`User` не содержит scopes. Relations:

- `referrer` / `referrals` используют `users.referrer_user_id`;
- `payments` связывает пользователя с платежами;
- `receivedReferralRewards` — rewards, где пользователь является referrer;
- `referralRewardsFromFriends` — rewards, вызванные платежами его referrals.

### Поля User

| Field | Reads | Writes | Purpose | Source of truth | Candidate for removal |
|---|---|---|---|---|---|
| `id` | relations, payments, promocodes, rewards | DB | Локальный PK | Local DB | Нет |
| `first_name`, `last_name` | MoonShine | `UserRepository` на каждом `/start`, MoonShine | Telegram profile metadata | Telegram, локальная копия | Нет оснований |
| `username` | Remnawave lookup, UI, referral statistics | `UserRepository` на каждом `/start`, MoonShine | Telegram username и текущий ключ поиска Remnawave User | Telegram для имени; Remnawave для remote identity | Нет; но нельзя считать стабильным Remnawave ID |
| `chat_id` | bot lookup, notifications, partner link | создание User, MoonShine | Telegram identity | Telegram, локальный unique key | Нет |
| `is_trial` | только MoonShine detail/form | при создании `true`, MoonShine | Предполагаемый локальный флаг trial | Не определён; фактически lifecycle задают Remnawave + `tags` | Да, предварительно `DUPLICATED/UNUSED`; окончательно решить на шаге 8 |
| `trial_expired` | MoonShine, `ReferralService`, один payment test | при создании `now()+3d`; затем `ReferralService` добавляет referrer bonus | Одновременно локальный конец trial и локальный конец referral-бонуса | Конфликтует с Remnawave `expireAt` | Да, но семантика смешана и данные нельзя удалять без migration/replacement |
| `is_premium` | MoonShine | Telegram profile на каждом `/start`, MoonShine | Telegram Premium metadata | Telegram | Нет, если metadata нужна админке |
| `is_free` | только MoonShine | при создании `false`, MoonShine | Неопределённый признак бесплатного пользователя | Не определён | Да, предварительно `UNKNOWN`; не удалять до шага 8 |
| `referrer_user_id` | relations, `ReferralService`, MoonShine | только при создании нового User, MoonShine relation form | Неизменяемая в bot flow referral relation | Local DB | Нет |
| `status` | advanced referral statistics | DB default `ACTIVE`, factory; production sync отсутствует | Задуман как копия Remnawave status | Remnawave, но local copy сейчас stale | Да, предварительно `DUPLICATED`; advanced UI требует replacement |
| `tags` | `/start`, onboarding | создание User, `showWelcome`, `UserService::refreshTags` | Локальная бизнес-классификация | Local DB, вывод частично строится из Remnawave `tag` | Нет; это требуемый local tag, но правила записи нужно централизовать |
| `welcome_back_shown_at` | onboarding | `showWelcomeBack` | One-time guard welcome-back сценария | Local DB | Нет, пока сохраняется этот UX |
| `state`, `state_payload` | manual promocode input | `BotHandler` | Состояние Telegram-диалога | Local DB | Нет в рамках lifecycle; отдельный bot state |
| `created_at`, `updated_at` | MoonShine/Eloquent | Eloquent | Audit timestamps | Local DB | Нет |

Поля `is_trial`, `trial_expired`, `is_free`, `status` не имеют scopes. Запросов
по ним в production-коде нет, кроме проверки payment status (это другое поле)
и чтения `User.status` в advanced statistics.

### Идентификаторы Remnawave

Локальный User не хранит Remnawave numeric `id` или `shortUuid`. Все текущие
операции сначала вызывают `GET /api/users/by-username/{username}`. При создании
в Remnawave передаются local `username` и `chat_id` как `telegramId`.

Это создаёт риск: `UserRepository` обновляет local username из Telegram, но
Remnawave username одновременно не обновляет. После смены Telegram username
поиск remote User по новому значению может перестать работать. OpenAPI не имеет
используемого приложением lookup по Telegram ID; numeric Remnawave ID доступен
в ответе, но локально не сохраняется.

## Registration Flow

Фактический `/start` flow:

1. `UserService::getReferrerChatId()` извлекает `ref_<chat_id>`.
2. `UserRepository` ищет referrer по `users.chat_id`.
3. `UserRepository::create()` обновляет существующего User либо создаёт нового
   уже с `is_trial=true`, local `trial_expired=now()+3d`, `tags=TRIAL` и,
   возможно, `referrer_user_id`.
4. Для `TRIAL` `BotHandler` намеренно пропускает `refreshTags()`.
5. `UserOnboardingService::resolveScenario()` пытается сравнить tag с
   несуществующим `UserTags::New`.
6. Из-за ошибки `showWelcome()` не достигается. Следовательно, штатный flow не
   гарантирует создание Remnawave User, remote trial и welcome message.

Предполагаемый, но сейчас недостижимый `showWelcome()` создаёт Remnawave User с:

- `status=ACTIVE` по default DTO;
- `tag=TRIAL`;
- `expireAt=now()+3d`;
- 30 GiB traffic limit;
- hard-coded internal squad UUID;
- local `tags=TRIAL` после успешного remote create.

Atomicity отсутствует: local User создаётся до remote User. Remote failure
оставляет local запись в `TRIAL`; отдельного retry/reconciliation механизма
нет. Обратный частичный failure также не компенсируется.

## Trial Flow

Trial одновременно представлен тремя локальными значениями (`is_trial`,
`trial_expired`, `tags=TRIAL`) и remote `status/tag/expireAt`.

- remote создание использует `tag=TRIAL` и конечный `expireAt`;
- `is_trial` после регистрации нигде автоматически не сбрасывается;
- `trial_expired` не синхронизируется с Remnawave;
- автоматического `EXPIRED -> INACTIVE` нет;
- `UserService::refreshTags()` смотрит на remote `tag`, не на remote `status`.

Поэтому окончание `expireAt` и remote `status=EXPIRED` сами по себе local
`tags` не изменяют.

## Returning User Flow

Сейчас returning определяется не по Remnawave status, а условием
`local tags=INACTIVE && welcome_back_shown_at IS NULL`.

Перед onboarding `refreshTags()` вызывается для любого tag, кроме `TRIAL`:

- remote `tag=ACTIVE` -> local `ACTIVE`;
- remote `tag=TRIAL` -> local `TRIAL`;
- любой другой tag, включая `null`, `FAMILY`, `FRIENDS` и неизвестное значение,
  -> local `INACTIVE`;
- remote status `ACTIVE/LIMITED/DISABLED/EXPIRED` не анализируется;
- при любой Remnawave ошибке local tag молча сохраняется.

Следствия:

- `ACTIVE`, `LIMITED` и `DISABLED` могут ошибочно стать returning, если remote
  tag не равен строкам `ACTIVE`/`TRIAL`;
- неизвестное значение автоматически трактуется как returning-compatible
  `INACTIVE`;
- `FAMILY` и `FRIENDS` не защищены и могут быть перезаписаны;
- welcome-back показывается максимум один раз, после чего повторный `/start`
  ведёт в profile;
- отдельного правила при конфликте invited + returning нет.

## Referral Flow

### Registration relation и self-referral

Bot deep-link содержит referrer Telegram chat ID, а в `users` сохраняется
local user ID. Для уже существующего User `UserRepository::create()` не меняет
`referrer_user_id`, поэтому повторный `/start` штатно не меняет referrer.

Явной проверки `current User == referrer` до передачи данных в repository нет.
Обычный новый пользователь не может найти самого себя как уже существующего
referrer, однако service/repository invariant отсутствует, схема разрешает
self-reference, а MoonShine может её записать. `ReferralService` отсекает
self-referral только на этапе reward. Единой защиты, исключающей relation,
promocode и reward, нет.

### Reward

После `payment.succeeded`:

1. `SubscriptionExtender` продлевает `Remnawave.expireAt` payer;
2. внутри local transaction consumed promocode фиксируется;
3. `ReferralService::handlePayment()` вызывается до перевода Payment в
   `SUCCEEDED`;
4. reward создаётся только если у payer нет другого успешного Payment;
5. referrer получает дни в local `users.trial_expired`, но его
   `Remnawave.expireAt` не изменяется;
6. `referral_rewards.payment_id` unique обеспечивает максимум один reward на
   Payment;
7. notification referrer отсутствует; `PaymentStatusNotifier` уведомляет payer.

Текущее поведение прямо противоречит требованию rewards за каждую оплату.
Тест `test_referral_reward_is_not_added_after_the_first_successful_payment`
закрепляет старое first-payment-only правило.

Есть два расходящихся источника размера reward:

- `ReferralService` читает `config/referral.php`: 1/3/6/12 месяцев дают
  7/21/45/90 дней;
- bot показывает таблицу `referral_bonus`, seed которой задаёт 7/14/21/30 дней.

Перед шагом 5 необходимо выбрать фактический существующий источник программы;
иначе начисление и показ пользователю различаются.

## Promocode Flow

### Manual

Manual flow устанавливает `state=awaiting_promocode`, находит code без учёта
регистра (`LOWER(title)`), проверяет остаток и отсутствие любого
`user_promocodes` для User, показывает discounted prices и передаёт один
`promocode_id` в callback/payment.

### Invited и returning

- invited User должен получить созданный `Promocode` на 30% в `showWelcome()`;
- returning User получает такой же `Promocode` в `showWelcomeBack()`;
- оба сценария используют `createForRefUser()` и не сохраняют тип eligibility;
- размер 30% является default аргументом service, а не общей конфигурацией;
- из-за сломанного onboarding автоматическое создание сейчас ненадёжно;
- invited + returning priority отсутствует, возможно несколько owned codes;
- `sendProducts()` выбирает первый доступный owned code без явного порядка.

`sendProducts()` всегда показывает кнопку «У меня есть промокод», даже если
automatic code уже найден. Один Payment может содержать только один
`promocode_id`, поэтому арифметического сложения скидок в текущем payment
расчёте нет; однако manual code можно выбрать вместо automatic, а multiple
automatic codes не имеют детерминированного приоритета.

Consumption реализован корректно относительно payment lifecycle:

- создание/pending/canceled не создают `user_promocodes` и не уменьшают count;
- только successful processing вызывает `markAsUsed()`;
- unique `user_promocodes.user_id` разрешает пользователю использовать только
  один promocode за всё время, независимо от его вида;
- duplicate success идемпотентен на уровне Payment processing.

Отдельный риск: `PromocodeService::validateForUser()` не проверяет, что
personal `promocodes.user_id` равен текущему User. Знающий code пользователь
может применить чужой персональный promocode.

## Subscription Expiration Flow

В приложении отсутствуют lifecycle command/job/scheduler и Remnawave webhook
endpoint. `routes/console.php` содержит только стандартную команду `inspire`, а
единственная custom command регистрирует Telegram-команды.

`expireAt` читается:

- в profile для показа даты и простой проверки `isFuture()`;
- в `SubscriptionExtender`, который вычисляет
  `max(remote expireAt, now) + purchased months`;
- в payment test fakes.

Нет:

- reminder за один день;
- durable marker идемпотентности reminder;
- обработки trial expiration;
- paid subscription expiration sync;
- массового или webhook-driven `EXPIRED -> local INACTIVE`.

Таблица Laravel `notifications` и trait `Notifiable` существуют, но notification
classes и их использование отсутствуют. Payment Telegram notifications имеют
отдельный `payments.notified_at` и относятся только к результату платежа.

## Device Limit Flow

Текущее приложение умеет:

- получить Remnawave User по username;
- получить список/`total` HWID devices по numeric Remnawave user ID;
- показать список устройств;
- удалить выбранное устройство;
- вызвать готовые Remnawave `disableUser()` / `enableUser()` handlers, хотя
  lifecycle-код их пока не использует.

Контроль лимита отсутствует:

- в `plans` и `products` нет `device_limit`;
- единственное описание «5 устройств» хранится как свободный текст Advantage;
- Remnawave `UserResponse.hwidDeviceLimit` доступен, но при trial creation не
  задаётся и в bot logic не читается;
- сравнения count/limit, disable, notification, idempotency marker и recovery
  flow нет.

Существующий device management callback можно переиспользовать. До шага 7
нужно определить структурированный источник plan limit: извлекать число из
текста Advantage нельзя.

## Remnawave Flow

| Операция | Текущая реализация | Использование |
|---|---|---|
| Получить User | `GET /api/users/by-username/{username}` | profile, devices, tags refresh, payment extension |
| Создать User | `POST /api/users` | только предполагаемый `showWelcome()` |
| Получить status | `UserResponse.status` enum | DTO доступен, lifecycle почти не читает |
| Получить tag | `UserResponse.tag` | `UserService::refreshTags()` |
| Получить `expireAt` | `UserResponse.expireAt` | profile и payment extension |
| Обновить User | `PATCH /api/users` | payment меняет только `expireAt` |
| Disable/enable | POST actions по numeric `userId` | handlers и tests есть, business flow отсутствует |
| Device count | `GET /api/hwid/devices/{userId}` -> `total` | profile; enforcement отсутствует |
| Device limit | `UserResponse.hwidDeviceLimit` | DTO есть, не используется |

`UpdateUserRequestDto` разрешает прямой status update только `ACTIVE` или
`DISABLED`; для enable/disable также существуют отдельные action endpoints.
`LIMITED` и `EXPIRED` являются наблюдаемыми состояниями, но не произвольными
значениями для записи этим DTO.

## Problems / Refactoring Candidates

### Блокирующие correctness-проблемы

1. `UserTags::New` отсутствует, поэтому `/start` падает при scenario resolve.
2. Новый User уже создаётся как `TRIAL`, из-за чего текущая модель не отличает
   «local row создан» от «remote registration завершена».
3. `BotHandler::advanced()` вызывает `label()` на
   `App\\Remnawave\\Enums\\UserStatus`, где метода нет; label существует в
   другом, неиспользуемом enum.
4. `UserService::refreshTags()` синхронизирует remote tag вместо source-of-truth
   status и уничтожает `FAMILY`/`FRIENDS`.
5. Payment success продлевает remote `expireAt`, но не переводит local tag в
   `ACTIVE`; явного enable для ранее `DISABLED` также нет.
6. Нет механизма внешней синхронизации expiration/status.

### Data model и source-of-truth

1. `users.status` — несинхронизированная копия Remnawave status с default
   `ACTIVE`; оставление требует явной cache/read-model семантики.
2. `is_trial` дублирует lifecycle и фактически не читается.
3. `trial_expired` одновременно означает local trial end и срок referral bonus,
   но реальная subscription date находится в Remnawave.
4. `is_free` имеет только admin-facing использование и не связан явно с
   `FAMILY`/`FRIENDS`.
5. Remnawave numeric ID не сохраняется, а mutable username используется как
   единственный remote lookup key.

### Отсутствующие сценарии

1. Нет централизованного `UserStateManager`.
2. Нет status-based returning eligibility.
3. Нет защиты special tags.
4. Нет automatic promocode priority/UI guard.
5. Referral reward ограничен первой оплатой и остаётся только local.
6. Нет notification referrer.
7. Нет expiration reminder.
8. Нет device-limit enforcement/recovery.
9. Нет Remnawave webhook consumer или polling sync.

### Решения, которые нельзя придумывать без подтверждения

- какой из двух наборов referral bonus является фактической программой;
- где хранить структурированный plan device limit;
- должен ли device-limit recovery автоматически делать `enable` и как отличить
  такой `DISABLED` от ручной/административной блокировки;
- нужна ли local cache-копия Remnawave status;
- как мигрировать исторические значения `trial_expired`, если поле удаляется;
- нужно ли сохранять numeric Remnawave user ID либо выбрать другой стабильный
  lookup/reconciliation механизм.

Эти вопросы не препятствуют созданию `UserStateManager` вокруг подтверждённых
правил, но должны быть разрешены до соответствующих schema/reward/device шагов.

## Решения шага 2: UserStateManager

После аудита принят следующий минимальный mapping. Целевой tag
должен совпадать в Remnawave и локальной БД:

| Remnawave state | Remnawave/local tag |
|---|---|
| `EXPIRED` | `INACTIVE` |
| `ACTIVE` + remote tag `TRIAL` | `TRIAL` |
| `ACTIVE` + любой другой обычный tag | `ACTIVE` |
| `LIMITED` | существующий local tag сохраняется |
| `DISABLED` | существующий local tag сохраняется |

`LIMITED` и `DISABLED` не эквивалентны `INACTIVE`: они описывают ограничение
доступа, а не окончание subscription lifecycle. Local `FAMILY` и `FRIENDS`
защищены от обычного sync, registration и payment transitions. Если special
tag пришёл из Remnawave, он также принимается локально и далее защищается.
При расхождении UserStateManager сначала обновляет remote tag и только
после успешного Remnawave response меняет local tag. Повторный sync
не отправляет PATCH, если теги уже совпадают.

При успешной оплате менеджер:

1. обновляет remote `expireAt`;
2. переводит remote status из `EXPIRED` в `ACTIVE`, но не снимает
   `LIMITED`/`DISABLED`;
3. задаёт обычному remote User tag `ACTIVE`;
4. только после успешного Remnawave response меняет local tag на `ACTIVE`.

Для `FAMILY`/`FRIENDS` payment продлевает remote subscription при необходимости,
но не заменяет remote/local special tag. Remote failure оставляет local tag без
изменений и пробрасывается в payment processor. Если remote update прошёл, а
local update завершился ошибкой, payment остаётся незавершённым; retry повторяет
идемпотентный update с сохранённым `payments.subscription_expires_at`, после чего
повторяет local transition. Рассинхронизация не подавляется.

## Решения шага 3: Referral Registration и Returning Users

Self-referral отсекается при разборе deep-link до поиска referrer и
создания User: current и referrer Telegram chat ID не могут совпадать.
Повторный `/start` не меняет `referrer_user_id`: relation по-прежнему
задаётся только при первичном создании User.

Returning eligibility определяется по фактическому Remnawave status,
полученному в том же `/start` request. Welcome-back доступен только для
`EXPIRED` + local `INACTIVE` + `welcome_back_shown_at IS NULL`. `ACTIVE`,
`LIMITED` и `DISABLED` returning-пользователями не считаются; неизвестный
status не может пройти enum десериализацию.

Для invited и returning eligibility создаётся один user-owned
автоматический промокод. Повторный вызов идемпотентен и
сериализуется через row lock User, чтобы не выдавать несколько
автоматических скидок одному User.

## Решения шага 4: Автоматический промокод первой оплаты

Активным automatic promocode считается первый доступный user-owned promocode
пользователя, пока для него отсутствует запись в `user_promocodes`. Выбор
централизован в `PromocodeService` и применяется в `PaymentCreator`, поэтому
правило одинаково для Telegram и web payment flow. Новые типы или значения
скидок не добавлялись: используются промокоды, созданные для invited/returning
eligibility на шаге 3.

Если automatic promocode активен, обзор и детали тарифов показывают цены со
скидкой, а Telegram-кнопка ручного ввода не создаётся. Прямой вызов manual
callback возвращает пользователя к тарифам с automatic discount. Для обычного
пользователя прежний manual flow сохранён.

Automatic promocode имеет приоритет над manual: ручной код нельзя применить
или передать напрямую в Payment поверх automatic. Один Payment по-прежнему
хранит только один `promocode_id`. Дополнительно personal promocode теперь
проверяет `promocodes.user_id`, поэтому его нельзя использовать другому User.
Invited + returning и повторная выдача не создают вторую скидку благодаря
идемпотентному `createForRefUser()`.

Создание Payment, ошибка провайдера и `payment.canceled` не создают
`user_promocodes` и не уменьшают `promocodes.count`. Consumption выполняется
только в successful payment processor. После успешной оплаты наличие
`user_promocodes` отключает automatic selection, поэтому следующая покупка
идёт без этой скидки и снова получает обычный manual flow.

## Решения шага 5: Referral Rewards

Фактическим источником размера reward выбрана существующая таблица
`referral_bonus`, которую редактирует MoonShine и показывает
`PartnerMessageService`. Дублирующий `config/referral.php` удалён, поэтому
начисление и отображение используют одну шкалу бонусных дней.

First-payment-only ограничение удалено: каждый успешно обработанный Payment
referred User создаёт отдельный `ReferralReward` и продлевает локальный
`trial_expired` referrer. Начисление выполняется в транзакции с блокировками
payer/referrer; уникальный `referral_rewards.payment_id` и дополнительная
проверка существования сохраняют правило «не более одного reward на Payment».
Self-referral по-прежнему отсекается.

После commit успешной оплаты `ReferralRewardNotifier` отправляет сообщение
именно referrer и записывает `referral_rewards.notified_at`. Повторный webhook
не отправляет сообщение повторно после сохранённой отметки. Pending, canceled
и ошибка Remnawave не доходят до начисления. Отправка Telegraph и фиксация
`notified_at` не являются распределённой транзакцией: при внешнем сбое между
этими операциями delivery остаётся retryable, но строгая exactly-once гарантия
за пределами БД не заявляется.

## Решения шага 6: Уведомление об окончании подписки

Единственный Laravel Scheduler запускает hourly-команду
`subscriptions:notify-expiring` с `withoutOverlapping`. Команда читает
актуальных пользователей через документированный Remnawave
`GET /api/users/stream` с cursor pagination и не использует local
`trial_expired` для определения срока подписки. Production Compose запускает
этот scheduler отдельным process `php artisan schedule:work` на том же
Laravel image и коде приложения.

Reminder отправляется, если remote `expireAt` находится в будущем не дальше
чем на 24 часа и remote status не `EXPIRED`. `LIMITED` и `DISABLED` сохраняют
reminder: эти статусы ограничивают доступ, но сами по себе не означают, что
подписка уже закончилась. FAMILY/FRIENDS не исключаются по одному local tag:
их фактически бессрочный remote `expireAt` не попадает в окно; конечный срок,
если Remnawave его вернёт, остаётся источником истины.

`users.subscription_reminder_sent_for` хранит только нормализованный до секунды
remote expiration, для которого сообщение уже отправлено. Это durable marker,
а не независимая копия текущего срока. Row lock и сравнение marker защищают от
повторного scheduler run и конкурентной обработки; новый `expireAt` после
renewal допускает новый reminder. Telegraph send выполняется до обновления
marker, поэтому ошибка доставки остаётся retryable; строгая distributed
exactly-once гарантия при аварии между внешней отправкой и DB commit не
заявляется.

## Решения шага 7: Контроль количества устройств

Структурированный лимит хранится в `plans.device_limit`: Product описывает
срок и цену, а все его варианты относятся к одному Plan с общими условиями.
Миграция устанавливает текущему единственному тарифу значение `5`, ранее
присутствовавшее только в тексте Advantage; поле добавлено в Plan model,
factory, seeder и MoonShine. Runtime-код не извлекает число из текста и не
использует отдельную константу.

Текущий Plan пользователя определяется по последнему созданному успешному
Payment с Product; pending/canceled Payment не меняют лимит. Пользователь без
успешной покупки пока не имеет фактического Product/Plan и в enforcement не
включается. Remote `hwidDeviceLimit` не подменяет этот источник: актуальный
device count читается через существующий
`GET /api/hwid/devices/{userId}`, а лимит — из локальной тарифной модели.

Hourly-команда `subscriptions:enforce-device-limits` использует тот же
Laravel Scheduler и Remnawave `GET /api/users/stream`. Для `ACTIVE` и
`LIMITED` она сравнивает `total` с `plan.device_limit`; только строгое
превышение вызывает существующий numeric-user action `disableUser()` через
`UserStateManager`. Local tag при этом не меняется: `DISABLED` ограничивает
доступ, но не означает `INACTIVE`. `EXPIRED` принудительно не переводится в
другой status.

`users.device_limit_exceeded_at` обозначает нарушение, которым владеет этот
flow, а `users.device_limit_notification_sent_at` — доставленное для него
Telegram notification. Поэтому уже существующий ручной `DISABLED` без marker
не присваивается device-limit flow и никогда автоматически не включается.
Повторная проверка собственного `DISABLED` не вызывает новый status action и
не дублирует сообщение. Если disable или notification оборвались, сохранённые
markers позволяют scheduler повторить только незавершённую часть.

Notification содержит фактические count/limit и кнопку `action:devices`,
ведущую в существующий `BotHandler::devices()`; отдельный management flow не
создан. После `deleteDevice()` ответ Remnawave уже содержит новый `total`,
поэтому recovery выполняется сразу. При `count <= plan.device_limit` только
собственный `DISABLED` включается через `UserStateManager::enableAfterDeviceLimitRecovery()`;
после успешного enable markers очищаются. Hourly-команда служит fallback для
удаления вне Telegram или изменения Plan. `LIMITED` и `EXPIRED` автоматически
не переводятся в `ACTIVE`, чтобы не снять независимое ограничение или не
оживить завершившуюся подписку.

## Решения шага 8: Аудит и рефакторинг User Model

Поиск выполнен по production-коду, tests, migrations, casts, Telegram handlers,
services, jobs и SQL/Eloquent queries. У `User` нет scopes, использующих
поля-кандидаты. Итоговая классификация:

| Field | Classification | Replacement | Action | Reason |
|---|---|---|---|---|
| `is_trial` | `DUPLICATED` | Local `tags` для бизнес-классификации; Remnawave `status` и `expireAt` для фактического состояния подписки | Remove | Поле всегда создавалось как `true`, после регистрации не изменялось и не читалось runtime-кодом. Самостоятельного исторического факта оно не хранило. |
| `trial_expired` | `REQUIRED` | Нет безопасной замены в текущей модели | Keep | `ReferralService` читает и продлевает это значение при каждом referral reward. Название и семантика унаследованы от trial, но исторические значения также содержат referral bonus, поэтому удаление или автоматическая миграция в Remnawave небезопасны. |
| `is_free` | `UNKNOWN` | `Needs review`; нельзя без правила подменять `FAMILY`, `FRIENDS` или бессрочной подпиской | Keep | Поле доступно в MoonShine, но production lifecycle его не читает и не обновляет. Подтверждённой связи с бесплатной или бессрочной подпиской нет, поэтому UNKNOWN-поле не удалено. |
| `status` | `DUPLICATED` | Remnawave `UserResponse.status` для удалённого состояния; local `tags` для локальной классификации и UI | Remove | Локальное значение имело только default/factory, не синхронизировалось, не участвовало в queries и могло быть stale. Единственное чтение в referral statistics заменено на `tags`; offline/cache сценарий отсутствует. |

`is_premium` остаётся Telegram profile metadata и обновляется при `/start`, а
`tags` остаётся обязательной локальной бизнес-классификацией. Эти поля имеют
самостоятельную семантику и не являются копией удалённого Remnawave status.

Вместе с колонками удалены два неиспользуемых enum: локальная копия
Remnawave status с `label()` и старый MoonShine enum со значениями
`new/trial/active/inactive`, несовместимыми с прежней схемой `users.status`.
Referral statistics теперь выводит label фактического local tag.

Новая миграция удаляет только `is_trial` и `status`. Её rollback восстанавливает
прежнюю схему и прежние default-значения. Индивидуальные значения строк не
восстанавливаются: до удаления они не были авторитетной или синхронизированной
историей, поэтому переносить их в другое поле нельзя. `trial_expired` и
неопределённый `is_free` остаются без изменения.
