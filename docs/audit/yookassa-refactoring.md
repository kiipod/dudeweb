# Аудит и рефакторинг модуля YooKassa

Дата первичного аудита: 2026-10-06.

## Ограничение исходного плана

Файл `.agents/plans/yookassa-refactoring/01-current-state-audit.md` побайтно
совпадает с `00-overview.md` и не содержит отдельного чеклиста шага 1. Поэтому
текущий аудит выполнен по целям overview и по зависимостям шагов 2–6. Это не
расширяет область изменений: Promocode, Referral и Remnawave рассматриваются
только как существующие участники платёжного flow.

## Проверенные источники

- `docs/yookassa/declined-payments.md` — инициаторы и причины отмены;
- `docs/yookassa/test-payment.md` — тестовые successful/canceled сценарии;
- установленный `yoomoney/yookassa-sdk-php` 3.15.1;
- `app/Payment/**`, платёжные контроллеры, Telegram handler и middleware;
- `Payment`, связанные модели, миграции и фабрики;
- `PromocodeService`, `ReferralService` и Remnawave-вызовы;
- все payment-related Feature-тесты.

## Текущая архитектура

```text
POST /payments ── PaymentController ─┐
                                    ├─ PaymentService::createPayment()
Telegram buy callback ─ BotHandler ─┘       ├─ PromocodeService
                                            ├─ локальный Payment
                                            └─ YooKassa Client::createPayment()

YooKassa webhook
  └─ EnsureYooKassaWebhookSource
      └─ YooKassaWebhookController
          └─ PaymentService::handleNotification()
              ├─ повторная проверка Client::getPaymentInfo()
              ├─ succeeded
              │   ├─ processing claim
              │   ├─ Remnawave subscription extension
              │   ├─ PromocodeService::markAsUsed()
              │   ├─ ReferralService::handlePayment()
              │   └─ TelegramPaymentNotifier::succeeded()
              └─ canceled
                  ├─ локальный status = canceled
                  └─ TelegramPaymentNotifier::canceled()
```

`PaymentReturnController` не меняет статус. Webhook остаётся источником истины,
а return URL только возвращает Telegram-пользователя в бота или показывает
информационный ответ web-пользователю.

## Создание платежа

Оба входа используют `PaymentService::createPayment()`. Сервис:

1. нормализует `PaymentSource` и ключ идемпотентности;
2. возвращает ранее созданный Payment для того же логического запроса;
3. проверяет Promocode через существующий `PromocodeService`;
4. фиксирует snapshot продукта: `product_id`, `months`, `original_amount`,
   итоговый `amount`, описание и source;
5. создаёт локальный Payment до внешнего вызова;
6. передаёт локальный ID и source в metadata YooKassa;
7. сохраняет ID YooKassa, новый `confirmation_url` и данные ответа.

Web использует клиентский заголовок `Idempotency-Key`. Telegram строит ключ из
ID callback query; повторная доставка одного callback не создаёт дубликат.

## Webhook и идемпотентность

- Транспорт ограничен allow-list IP в `EnsureYooKassaWebhookSource`.
- Локальный Payment ищется по уникальному `yookassa_payment_id`.
- Состояние из notification не принимается на доверии: сервис получает текущий
  Payment через SDK и проверяет ID и status.
- Succeeded flow защищён `processing_token`, row lock, `processed_at` и
  уникальным `referral_rewards.payment_id`.
- Promocode и Referral завершаются внутри транзакционной части после успешной
  синхронизации подписки.
- Telegram notification защищён `notified_at`.
- Внешние YooKassa и Remnawave вызовы не выполняются внутри долгой DB-транзакции.

## Canceled flow до изменений

Фактическое поведение отличается от описанного в overview в одной детали:
текущий notifier уже не отправляет старый `confirmation_url`. Он показывает
callback-кнопку `action:buy`, после которой общий create path создаёт новый
локальный и новый YooKassa Payment.

Остаются функциональные пробелы:

- `cancellation_details.party` и `reason` не считываются;
- всем причинам соответствует один общий текст;
- отсутствие details и неизвестный reason явно не покрыты fallback-тестом;
- нет end-to-end теста `canceled webhook -> retry callback -> новый Payment`;
- допустимость retry и рекомендуемое действие не представлены доменной моделью;
- canceled notification вызывает notifier из DB-транзакции, то есть сетевой
  Telegram-вызов удерживает row lock.

## Ответственности PaymentService до рефакторинга

| Responsibility | Тип | Отдельные зависимости | Оценка |
|---|---|---|---|
| Создание локального и YooKassa Payment | application/integration | Client, PromocodeService, PaymentReturnUrl | Основная операция, кандидат на отдельный creator |
| Парсинг и маршрутизация webhook | integration/application | SDK NotificationFactory, Client | Независимая операция |
| Succeeded processing claim | persistence/idempotency | DB | Связан с successful processing |
| Продление Remnawave subscription | integration/business | RemnawaveApi | Отдельная ответственность |
| Фиксация Promocode и Referral | business orchestration | PromocodeService, ReferralService | Не дублировать; только оркестрация |
| Canceled state и retry presentation | business/application | DB, Telegram notifier | Требует cancellation mapping |
| Telegram notification/idempotency | presentation/integration | TelegramPaymentNotifier, DB | Не относится к созданию платежа |

Класс содержит 500+ строк и шесть constructor dependencies. Публичный API
небольшой (`createPayment`, `handleNotification`), но внутри смешаны создание,
SDK mapping, webhook routing, subscription, post-processing, locks и Telegram.
Рефакторинг должен сохранить эти публичные методы как совместимый facade либо
обновить все два подтверждённых call site создания и один webhook call site.

## Transactions и ошибки

- Локальный Payment сохраняется до YooKassa API. При ошибке остаётся запись без
  `yookassa_payment_id`, которую можно безопасно повторить с тем же ключом.
- Succeeded processing не держит транзакцию во время Remnawave HTTP, но хранит
  durable target `subscription_expires_at`, чтобы retry не продлил подписку
  второй раз.
- Финальные Promocode/Referral/status изменения выполняются под row lock.
- Canceled status меняется под row lock; повторный webhook не повторяет
  Telegram side effect благодаря `notified_at`.
- В логи попадают class/code и идентификаторы, но не message исключения и не
  credentials. Пользователь получает безопасные сообщения.

## Тестовое покрытие до изменений

Покрыты создание Web/Telegram, discount/metadata, idempotency key, безопасные
ошибки SDK, return URL, webhook transport, succeeded side effects, повторный
succeeded webhook, concurrent processing claim, Remnawave retry target,
неизвестный Payment и базовый canceled callback.

Не покрыты cancellation details, message mapping, неизвестная причина, новый
Payment после retry callback и failure retry creation после canceled.

Baseline-команда:

```bash
./vendor/bin/sail artisan test --compact \
  tests/Feature/PaymentServiceTest.php \
  tests/Feature/PaymentEndpointTest.php \
  tests/Feature/PaymentReturnTest.php \
  tests/Feature/TelegramPaymentTest.php \
  tests/Feature/YooKassaWebhookProcessingTest.php \
  tests/Feature/YooKassaWebhookTransportTest.php
```

Результат: 26 tests, 115 assertions, все прошли; PHPUnit отметил 26 tests как
deprecated из-за существующих PHP 8.5 deprecation notices.

## Риски и решения для следующих шагов

- Использовать `PaymentInterface::getCancellationDetails()` установленного SDK,
  а не payload-текст или HTTP status.
- Держать mapping сообщений вне Telegram handler/notifier.
- Сохранять callback retry: новый Payment создаётся только после явного действия
  пользователя и через тот же `createPayment()` path.
- Не использовать и не очищать исторический `confirmation_url` canceled Payment.
- Не создавать автоматический retry Payment из повторно доставляемого webhook.
- Не менять бизнес-правила Promocode, Referral и Remnawave.
- Вынести сетевые уведомления из DB transaction, сохранив идемпотентность.

## Статус шага 1

- [x] Точки входа и payment creation flow проверены.
- [x] Webhook succeeded/canceled flow проверен.
- [x] Идемпотентность и транзакционные границы проверены.
- [x] Promocode, Referral, Subscription и Telegram side effects проверены.
- [x] Payment model, migrations, enums и relations инвентаризированы.
- [x] Текущее тестовое покрытие и пробелы зафиксированы.
- [x] Baseline payment-related tests проходят в Sail.

## Refactored architecture

После шага 3 `PaymentService` сохранён как совместимый application facade с
двумя публичными методами: `createPayment()` и `handleNotification()`. Он больше
не зависит напрямую от SDK, Telegram, Remnawave, Promocode или Referral.

```text
PaymentService
├─ PaymentCreator
│  ├─ PromocodeService
│  ├─ PaymentReturnUrl
│  └─ YooKassa Client
└─ PaymentNotificationHandler
   ├─ YooKassa Client (проверка актуального состояния)
   ├─ SuccessfulPaymentProcessor
   │  ├─ SubscriptionExtender -> RemnawaveApi
   │  ├─ PromocodeService
   │  ├─ ReferralService
   │  └─ PaymentStatusNotifier -> TelegramPaymentNotifier
   └─ CanceledPaymentProcessor
      ├─ PaymentCancellationResolver
      └─ PaymentStatusNotifier -> TelegramPaymentNotifier
```

| Component | Responsibility |
|---|---|
| `PaymentService` | Стабильная точка входа для Controller, Telegram и webhook Controller |
| `PaymentCreator` | Локальный Payment, сумма/snapshot, idempotency и вызов YooKassa createPayment |
| `PaymentNotificationHandler` | Парсинг notification, lookup, проверка актуального состояния через SDK и routing по event |
| `SuccessfulPaymentProcessor` | Processing claim, orchestration successful side effects и финальный status |
| `SubscriptionExtender` | Расчёт durable `expireAt` target и синхронизация Remnawave |
| `CanceledPaymentProcessor` | Идемпотентный переход в canceled и запуск cancellation notification |
| `PaymentStatusNotifier` | Source routing и idempotency guard `notified_at` |
| `PaymentCancellationResolver` | Типизированный mapping party/reason в безопасное пользовательское действие |
| `TelegramPaymentNotifier` | Только Telegram-текст и кнопки |

Транзакции ограничены row locks и локальными изменениями, кроме отправки
Telegram notification. Она намеренно остаётся внутри короткой транзакции:
`notified_at` записывается атомарно с конкурентной проверкой, а ошибка отправки
откатывает marker и позволяет повторному webhook повторить доставку. YooKassa и
Remnawave HTTP-вызовы выполняются вне DB-транзакций. Новые interface/proxy слои
не добавлялись; каждый выделенный класс содержит отдельную операцию и собственный
набор зависимостей.

Публичные call sites не изменились:

- `PaymentController` и `BotHandler` вызывают общий `createPayment()`;
- `YooKassaWebhookController` вызывает общий `handleNotification()`;
- Promocode и Referral остаются в существующих domain services;
- Telegram handler не содержит cancellation mapping или webhook logic.

## Payment columns

Схема сверена по трём миграциям, модели и read-only выводу
`artisan db:table payments --database=pgsql`. В доступной dev БД — 26 колонок.
Доступа к production data в рамках задачи нет, поэтому nullable legacy-поля и
исторические snapshots не удаляются и не ужесточаются без отдельного backfill.

| Column | Purpose | Classification | Action | Reason |
|---|---|---|---|---|
| `id` | Локальный ID и metadata/return URL reference | REQUIRED | Keep | Primary key, читается return/webhook flows |
| `user_id` | Владелец платежа | REQUIRED | Keep | Relations, Telegram, Promocode/Referral; FK |
| `product_id` | Snapshot выбранного продукта и retry target | REQUIRED | Keep nullable | Старые rows могли появиться до добавления поля; FK |
| `promocode_id` | Promocode snapshot и retry target | REQUIRED | Keep nullable | Нужен deferred mark-as-used и canceled retry; FK |
| `yookassa_payment_id` | ID провайдера и webhook lookup | REQUIRED | Keep unique | Основной ключ сопоставления webhook; nullable до успешного create API |
| `idempotency_key` | Логический create request | REQUIRED | Keep unique | Защищает Web/Telegram create от дублей |
| `source` | Канал Web/Telegram | REQUIRED | Keep | Return routing и Telegram notification |
| `months` | Snapshot срока продукта | REQUIRED | Keep | Subscription extension и Referral rule |
| `original_amount` | Цена до скидки | AUDIT | Keep | История скидки и support; snapshot нужен при изменении Product |
| `confirmation_url` | Redirect URL конкретной попытки | REQUIRED | Keep nullable | Нужен pending flow и история; canceled URL намеренно не переиспользуется |
| `status` | Локальное состояние payment flow | REQUIRED | Keep nullable | Runtime routing; nullable legacy rows требуют data audit до ограничения |
| `subscription_expires_at` | Durable target продления | REQUIRED | Keep | Не допускает повторного продления при retry Remnawave |
| `processed_at` | Время завершения post-processing | AUDIT | Keep | История и диагностика; не заменяет status |
| `notified_at` | Marker Telegram side effect | REQUIRED | Keep | Идемпотентность повторных webhook |
| `processing_token` | Claim конкурентного succeeded processing | REQUIRED | Keep | Не допускает одновременный remote sync |
| `processing_started_at` | Возраст processing claim | REQUIRED | Keep | Позволяет восстановить зависший claim после timeout |
| `amount` | Фактическая сумма после скидки | REQUIRED | Keep | YooKassa payload/response snapshot и support |
| `currency` | Валюта платежа | AUDIT | Keep | YooKassa response snapshot; нельзя выводить из amount |
| `description` | Описание заказа на момент оплаты | AUDIT | Keep | Provider/support snapshot при изменении Product/Plan |
| `metadata` | Локальная копия metadata YooKassa | AUDIT | Keep | Диагностика сопоставления local/user/product/source |
| `recipient_account_id` | YooKassa recipient snapshot | AUDIT | Keep | Диагностика магазина-получателя |
| `recipient_gateway_id` | YooKassa gateway snapshot | AUDIT | Keep | Диагностика маршрута получателя |
| `refundable` | Возможность refund в ответе YooKassa | AUDIT | Keep | Историческое состояние провайдера и admin UI |
| `test` | Признак тестового платежа | AUDIT | Keep | Отделяет test transactions в support/admin |
| `created_at` | Время создания локальной попытки | AUDIT | Keep | История и ordering в admin |
| `updated_at` | Время последнего локального изменения | AUDIT | Keep | Диагностика lifecycle |

### Indexes and constraints

До шага 4 PostgreSQL содержал:

- primary key `payments_pkey (id)`;
- unique `payments_yookassa_payment_id_unique` для webhook lookup;
- unique `payments_idempotency_key_unique` для create idempotency;
- foreign keys `user_id`, `product_id`, `promocode_id` без child indexes.

Добавлен `payments_user_id_status_index (user_id, status)`: он соответствует
реальному запросу `ReferralService` о предыдущем successful Payment и имеет
`user_id` leading column для relation/FK операций. Отдельные индексы на
`product_id`, `promocode_id`, processing timestamps и низкоселективный `status`
не добавлялись: подтверждённых lookup/order сценариев для них нет.

Удаляемых колонок не найдено. `processed_at`, provider response fields и
timestamps могли выглядеть как неиспользуемые в ветвлении, но классифицированы
как `AUDIT`; `UNKNOWN` колонок после анализа нет. Migration удаления/переноса
данных не требуется.
