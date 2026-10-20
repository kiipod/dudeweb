# Шаг 9 — Подписка, промокод и payment states

## Цель задачи

Реализовать subscription page, period selection, responsive promo overlay и
существующий YooKassa web payment flow, включая pending/success/failure screens.

## Продолжение и read-only Pen matrix — 2026-10-20

Шаг 8 закрыт коммитом `105c1c1`. Implementation и CSR/browser verification
шага 9 завершены. По явному запросу владельца «делаем коммит» этап принят
и закрывается текущим коммитом. Следующий task-файл не начинается.
Pen не изменялся.

Повторная сверка live screen instances имеет приоритет над старой высотой
reusable `LI7B7` и прежней цифрой 354 в исходном contract:

| Роль | Mobile 390 | Tablet 768 | Desktop 1440 | QHD 2560 |
| --- | --- | --- | --- | --- |
| Subscription content top | 14 | 28 | 32 | 32 |
| Content width | viewport − 40 | 640 | 900 | 1120 |
| Promo width × natural height | 390 × 376 | 520 × 387 | 500 × 383 | 500 × 414 |
| Promo header minimum height | 76 | 76 | 76 | 76 |
| Promo handle area | 18 | 18 | hidden | hidden |
| Promo heading group gap | 2 | 2 | 2 | 2 |
| Field/action minimum height | 56 | 60 | 64 | 72 |

Источники: `P4PAH/r51co/lUzA6/xrpVH`, `oL7tp/sBT5Z`,
`n9UuR/Nn7dT`, `jodkF/k4r5Hy`, `i3LOc/BeUUT`. Высоты отражают обычный
контент; validation error и text enlargement увеличивают панель с доступной
прокруткой. Приоритет технического `U-20` сохраняется: desktop dialog
центрируется в main area, header/sidebar/background inert, async submit
блокирует закрытие.

Component map: `Account/Subscription` компонует overview, checkout и history;
`SubscriptionOverview` получает безопасную подписку; `SubscriptionCheckout`
управляет выбором через composable и передаёт controlled props в selector,
summary и promo content; `PaymentHistory` получает server pagination;
`Account/Payments/Show` компонует status shell и actions. `useWebPayment`
владеет idempotency key/redirect, `usePaymentStatus` — bounded Inertia reload.
Pricing rules остаются в `PromocodeService`/`SubscriptionCatalogue`.

## Зависимости

- Завершён шаг 8.
- Решены `U-06`, `U-07`, `U-20`, `U-21`.
- Существующие `POST /payments`, `PaymentService`, `PromocodeService` и signed
  payment return URL.
- Pen `L`, `L2`, `T`, `T2`, `T3`, `U`, `U2` во всех variants, включая tablet
  `L2` `n9UuR`/`Nn7dT` и desktop `L2` `jodkF`/`k4r5Hy`.
- Pen reusable `LI7B7 · Account Promo Code Sheet`.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — pricing,
  promo/payment states, component contracts и styling.
- `laravel-best-practices` — validation, security, deterministic queries,
  idempotency, provider boundary, error handling и Feature tests.
- `laravel-13-attribute-refactor` — только при фактически затронутой approved
  attribute-конфигурации и после проверки installed framework source.

## Конкретные действия

- [x] Передавать active plan/products/payment history через Inertia props с
  eager loading, минимальным набором columns и deterministic ordering с
  уникальным tie-breaker.
- [x] Сопоставить periods 1/3/6/12 месяцев с реальными `Product` records.
- [x] Реализовать keyboard-accessible single-selection PeriodSelector.
- [x] Пересчитывать presentation summary только из server-confirmed product и
  promo results; не дублировать pricing business rules во Vue.
- [x] Реализовать promo content с `useForm`/подтверждённым request contract,
  validation error и discount-applied state.
- [x] Представлять promo как full-width bottom sheet на mobile, центрированный
  bottom sheet шириной `520` на tablet и dialog шириной `500` с radius
  `24` в desktop main area; актуальные natural heights приведены в matrix
  выше, content contract остаётся общим.
- [x] Применить подтверждённые в `U-20` backdrop/inert/outside-click semantics;
  визуально свободный sidebar не считать автоматически интерактивным.
- [x] Соблюсти правило, что automatic и manual discounts не суммируются.
- [x] Использовать существующий `POST /payments` JSON contract либо изменить его
  только по решению шага 1 и с совместимыми тестами.
- [x] Генерировать и отправлять idempotency key на логическую попытку оплаты.
- [x] Блокировать duplicate payment submit и показывать provider error.
- [x] Redirect выполнять только на полученный `confirmation_url`.
- [x] Преобразовать web payment return в утверждённый Inertia flow без
  ослабления signed token проверки.
- [x] Реализовать pending refresh только утверждённым способом; остановить его
  на terminal state/unmount/timeout.
- [x] Retry failed/canceled payment должен создавать новую попытку через
  существующий service, не переиспользовать старый confirmation URL.
- [x] Реализовать empty и populated payment history.
- [x] Добавить Feature tests для auth, validation, promo, idempotency, return,
  pending/success/failure и retry.

## Критерии готовности

- Цена и итоговая сумма не вычисляются независимо на клиенте.
- Один user action не создаёт несколько платежей.
- Pending/success/failure UI основан на реальном local/provider status.
- Promo errors связаны с полем; discount state соответствует backend rule.
- Promo overlay сохраняет единый form state при разрешённых responsive changes
  и соответствует mobile/tablet/desktop `L2` references.
- Existing Telegram payment flow и webhook idempotency не изменены.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=PaymentEndpoint
./vendor/bin/sail artisan test --filter=PaymentReturn
./vendor/bin/sail artisan test --filter=YooKassaWebhook
./vendor/bin/sail artisan test --filter=AccountSubscriptionPayment
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --dry-run --diff --using-cache=no --sequential <changed-php-files>
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run test:e2e
./vendor/bin/sail npm run build
git diff --check
```

## Сценарии проверки

- Каждый период 1/3/6/12 с доступным/недоступным Product.
- Promo: valid, invalid, exhausted, already used, automatic discount conflict.
- Promo open/close/focus return на 390, 768 и 1440; resize между sheet/dialog
  без duplicate submit и потери validation error.
- Provider creation error и повторная попытка.
- Payment remains pending, then success/failure while page open.
- Tampered/expired return token.
- Double click и back/forward после provider redirect.

## Реализация и проверка — 2026-10-20

- [x] Protected subscription/status routes, promo/retry FormRequests и
  `PaymentPolicy`; `UsePolicy`, `UseModel` и `Config` проверены по installed
  framework source, включая targets, constructors и consumption.
- [x] `SubscriptionCatalogue` использует `Product.months`, deterministic
  ordering и существующий `PromocodeService`. Сервер возвращает весь snapshot
  цен, скидок и валюты; Vue форматирует значения без независимого pricing.
- [x] История scoped к владельцу, eager-loaded, по 10 строк с сортировкой
  `created_at DESC, id DESC`; payload не раскрывает provider URL/metadata/keys.
- [x] `WebPaymentPurchase` сериализует одинаковый intent cache lock, проверяет
  владельца/product/promo/source при повторе ключа, повторно валидирует eligibility
  перед созданием. Retry создаёт новую попытку; merchant cancellation не retryable.
- [x] Web return сохраняет HMAC token check и перенаправляет на защищённую
  owned page. Web token TTL — 86400 секунд от persisted payment creation;
  Telegram return semantics сохранены.
- [x] Success отображается после `processed_at`, а не из creation response.
  Polling local Inertia props — 2 секунды, максимум 60 секунд; остановка при
  terminal/network error/unmount, затем ручная проверка без вывода success по таймеру.
- [x] Inertia 3.9.1 `useHttp` использован для согласованных JSON actions вместо
  отдельного fetch; validation, processing, cancellation и error semantics
  проверены по installed source. Redirect следует только server confirmation URL.
- [x] Focused payment suite: 48 tests / 414 assertions, failures 0.
  Полный Laravel suite: 213 tests / 1846 assertions, failures 0; 202 tests
  отмечены существующими PDO deprecations, которые не исправлялись в этом scope.
- [x] Frontend Node: 49/49; client/SSR build успешен; PHP CS Fixer проверил
  22 changed/new PHP files, 0 fixes; route:list — 22 routes; `git diff --check`.
- [x] Full Playwright: 139/139 — прежние 78 dashboard/login и 61 subscription/
  payment. Проверены 320/360/390/768/1024/1440/1920/2560 и обе темы, keyboard
  radio selection, unavailable periods, empty/populated history, promo errors/
  focus trap/return/resize/busy/inert, double submit, provider error/new attempt,
  bounded polling/success/failure/network/unmount и text-only ×2 на 320.
- [x] Default promo height дополнительно сверена browser assertions с live
  Pen endpoints с tolerance 6 px для font rounding/borders; error content
  свободно увеличивает панель. Просмотрены representative subscription,
  desktop promo/error и payment screenshots рядом с read-only Pen references.

Browser fixtures подменяют только Inertia data/transport поверх реального
Blade/Vite document и текущей build; реальные payments/accounts/providers не
изменялись. `Активирована` из Pen не подставляется demo-датой: текущие props
достоверно предоставляют remote expiration/remaining days, они и показаны.
Technical U-20 main-area centering/backdrop сохраняется поверх геометрии Pen.

Report: `playwright-report/index.html`, screenshots/traces: `test-results/`.
Полный pixel baseline, physical keyboard/screen reader и operational
SSR/hydration остаются в шаге 15; client/SSR build не считается operational SSR.
Production YooKassa transaction не выполнялась. Generated SSR files исключены
из коммита и восстановлены к checkout; их прежнее состояние сохранено в `/tmp`.
В коммит входят только проверенный scope шага 9 и его статус. Шаг 10 не начат.

