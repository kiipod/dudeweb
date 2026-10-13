# Шаг 9 — Подписка, промокод и payment states

## Цель задачи

Реализовать subscription page, period selection, responsive promo overlay и
существующий YooKassa web payment flow, включая pending/success/failure screens.

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

- [ ] Передавать active plan/products/payment history через Inertia props с
  eager loading, минимальным набором columns и deterministic ordering с
  уникальным tie-breaker.
- [ ] Сопоставить periods 1/3/6/12 месяцев с реальными `Product` records.
- [ ] Реализовать keyboard-accessible single-selection PeriodSelector.
- [ ] Пересчитывать presentation summary только из server-confirmed product и
  promo results; не дублировать pricing business rules во Vue.
- [ ] Реализовать promo content с `useForm`/подтверждённым request contract,
  validation error и discount-applied state.
- [ ] Представлять promo как full-width bottom sheet на mobile, центрированный
  `520 x 354` bottom sheet на tablet и `500 x 354` centered dialog с radius
  `24` в desktop main area; content contract остаётся общим.
- [ ] Применить подтверждённые в `U-20` backdrop/inert/outside-click semantics;
  визуально свободный sidebar не считать автоматически интерактивным.
- [ ] Соблюсти правило, что automatic и manual discounts не суммируются.
- [ ] Использовать существующий `POST /payments` JSON contract либо изменить его
  только по решению шага 1 и с совместимыми тестами.
- [ ] Генерировать и отправлять idempotency key на логическую попытку оплаты.
- [ ] Блокировать duplicate payment submit и показывать provider error.
- [ ] Redirect выполнять только на полученный `confirmation_url`.
- [ ] Преобразовать web payment return в утверждённый Inertia flow без
  ослабления signed token проверки.
- [ ] Реализовать pending refresh только утверждённым способом; остановить его
  на terminal state/unmount/timeout.
- [ ] Retry failed/canceled payment должен создавать новую попытку через
  существующий service, не переиспользовать старый confirmation URL.
- [ ] Реализовать empty и populated payment history.
- [ ] Добавить Feature tests для auth, validation, promo, idempotency, return,
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
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Payment tests/Feature
npm run build
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

