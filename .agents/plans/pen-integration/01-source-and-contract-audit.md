# Шаг 1 — Фиксация источников и frontend-контрактов

## Цель задачи

Перед реализацией зафиксировать экранную карту, маршруты, Inertia props,
мутирующие действия и решения по всем `Needs review`, чтобы следующие шаги не
создавали отсутствующую бизнес-логику.

## Зависимости

- [README.md](README.md).
- Доступ к открытому `dudeweb.pen` через Pencil MCP.
- Текущее состояние `routes/web.php`, моделей, миграций, Remnawave handlers и
  payment services.
- Решения владельца продукта по блокирующим неопределённостям.

## Обязательные skills

- `frontend-design` — сверка visual intent и экранной структуры Pen.
- `vue-best-practices` — проектирование page/component/composable contracts.
- `tailwind-best-practices` — аудит будущей token/component foundation.
- `laravel-best-practices` — route, validation, authorization, query, service и
  external-boundary contracts.
- `laravel-13-attribute-refactor` на этом planning-only шаге не применяется;
  его применимость фиксируется для конкретного implementation step.

## Конкретные действия

- [x] Повторно вызвать `get_app_state` и убедиться, что открыт ожидаемый
  `dudeweb.pen`; не выполнять Pencil mutations.
- [x] Сверить количество и названия top-level frames, reusable components и
  variables с baseline в README.
- [x] При расхождении с baseline составить delta inventory и классифицировать
  каждый новый frame как route, route-state или visual-only reference до
  изменения последующих task-файлов.
- [x] Составить таблицу `Pen frame -> route -> Inertia page -> props -> user
  actions -> backend handler` для всех уникальных экранов.
- [x] Отдельно отметить purely visual state frames, которые не требуют route.
- [x] Зафиксировать public/auth/account route names и middleware.
- [x] Решить `U-01`–`U-04`: identity, web session, registration и password
  recovery contracts.
- [x] Решить `U-05`–`U-11`: subscription, products, payments, support,
  referrals, connection и profile contracts.
- [x] Решить `U-12`–`U-16`: breakpoints, fonts, theme и актуальный static
  Signal Orbit Hero policy.
- [x] Решить или явно отложить `U-18`–`U-22` и `U-24`–`U-27` с owner и blocking
  scope; зафиксировать уже закрытые `U-17` и `U-23` без повторного открытия.
- [x] Составить component map: одна ответственность на компонент, thin route
  pages как composition surfaces, явные props/emits и границы composables.
- [x] Составить skill map по каждому implementation step и перечислить
  обязательные Vue/Laravel optional references/rules по фактическому concern.
- [x] Для каждого мутирующего действия определить FormRequest, policy/gate,
  service/action и response type без написания production code на этом шаге.
- [x] Подтвердить, какие Pen-тексты являются статическими, а какие должны
  приходить из server props.
- [x] Классифицировать `Q2 · Referral Terms` как protected read-only page,
  утвердить route/path/back-navigation и источник discount/reward content по
  `U-27`.
- [x] Зафиксировать mapping remote Remnawave state к UI states, не меняя
  существующие lifecycle rules.
- [x] Зафиксировать payment flow: создание, redirect, return, pending refresh,
  success, error и retry.
- [x] Зафиксировать responsive overlay map для mobile/tablet/desktop `Ещё` и
  промокода, включая presentation, backdrop, inert scope и focus contract.
- [x] Зафиксировать, какой logo/lockup и какой Static Hero mode являются
  approved source; не выбирать их по названию frame или расположению на canvas.
- [x] Обновить decision log в README и снять только реально решённые блокеры.

## Критерии готовности

- Для каждого уникального экрана существует однозначная route/data/action map.
- Ни один UI action не опирается на выдуманный endpoint или fake data.
- Auth/support/referral/payment blockers имеют принятое решение либо явно
  блокируют зависимые шаги.
- Подтверждены reference viewport и предполагаемые CSS breakpoint boundaries.
- Pen остаётся неизменённым, production code не изменён.

## Команды проверки

```bash
git status --short --branch
./vendor/bin/sail artisan route:list --except-vendor
rg -n "Route::|Inertia::render|auth:web" routes app/Http
rg -n "email|password|chat_id|username" app/Models database/migrations config/auth.php
rg -n "subscriptionUrl|expireAt|devices|referral|support" app
git diff --check
```

Pencil read-only сценарии:

1. `get_app_state` возвращает `dudeweb.pen`.
2. `execute` с `Get` и `GetVariables` читает структуру и variables.
3. Не вызываются `Insert`, `Copy`, `Update`, `Replace`, `Move`, `Delete`,
   `SetVariables` или `Generate`.

## Сценарии проверки

- Проверить карту для anonymous landing visitor.
- Проверить login/register/recovery при выбранной identity model.
- Проверить authenticated active/trial/expired/limited user.
- Проверить недоступность Remnawave и отсутствие локального stale fallback.
- Проверить payment pending/success/failure и повторную попытку.
- Проверить support/referral actions только с подтверждёнными контрактами.

## Результат выполнения — 2026-10-13

### Source snapshot и границы аудита

- `get_app_state` повторно вернул открытый `dudeweb.pen` по ожидаемому пути.
- Этот historical snapshot подтвердил `142` top-level frames, `10` formal
  reusable components, `19` variables и `0` layout-проблем. Повторный аудит
  2026-10-15 после принятой владельцем редакции supersedes counts и Hero/wide
  contracts ниже: current baseline равен `137/10/19`.
- Использовались только read operations `Get`/`GetVariables`; Pencil mutations
  не выполнялись.
- Production-код и тесты не изменялись. Текущие handlers ниже описаны как
  evidence, а будущие handlers — как proposal или blocker.
- В checkout существует пятый application route `GET /test`, который напрямую
  вызывает Remnawave и завершает запрос через `dd()`. Он не входит в UI map и
  требует отдельного удаления/ограничения до публикации web UI.

#### Повторный source audit — 2026-10-15

- Read-only `get_app_state`/`Get` подтвердили current baseline `137` top-level
  frames, `10` reusable components и `19` variables.
- Удалены один Hero storyboard и шесть самостоятельных static fallback boards;
  добавлены `j8pJq`/`eM8HW` как полноценные dark/light landing references на
  `2560×1440`.
- `2 · Static Hero · Signal Orbit` встроен во все landing frames. Он не имеет
  script/shader/animation properties и заменяет прежние scroll/fallback
  contracts.
- Структурных layout problems нет. Пять `partially clipped` diagnostics
  относятся только к oversized decorative `Morphing Color Blob` внутри
  tablet/desktop/UHD Hero и соответствуют визуальному clipping approach.
- Новые footer labels agreement/privacy открывают `U-28`: визуальное наличие
  labels не определяет route/content contract.
- Pencil mutations не выполнялись.

Статусы в таблицах:

- **existing** — контракт уже существует в checkout;
- **approved** — product owner утвердил контракт, но production route ещё не
  реализован;
- **deferred** — поведение сознательно вынесено за рамки текущей реализации;
- **blocked** — backend/domain contract отсутствует либо зависит от открытого
  `U-*`;
- **visual-only** — reference/state без самостоятельного URL.

### Screen, route, data и action map

| Pen frame/flow | Route и Inertia page | Минимальные props | Действия | Backend contract |
| --- | --- | --- | --- | --- |
| Landing `A`–`F`, `M`/`N` UHD (например `OidTs`, `j8pJq`) | approved `GET /`, `home`, `Public/Home` | `plans[]`, `advantages[]`, `auth.user?`, destinations | login, trial, pricing anchor, support | read-only controller/query; CTA ведут на `/register`, `/login`, `#pricing`; terms/privacy links скрыты до утверждённого content |
| Mobile menu open (например `H2013`) | visual-only state of `home` | те же, что у landing | open/close, navigate | local state; no endpoint |
| Login `M` (`HhyAE`) | approved `GET /login`, `login`, `Auth/Login` | `canRegister`, `canResetPassword`, flash | submit email/password | explicit `web` guard; normalized email plus IP throttle |
| Registration `N` (`peVB0`) | approved `GET /register`, `register`, `Auth/Register` | registration capability | create independent web user by email/password | account becomes authenticated immediately without email verification; local and Remnawave provisioning contract fixed below |
| Recovery `O` (`Yd1Y4`) | approved `GET /forgot-password`, `password.request`, `Auth/ForgotPassword` | flash status | request reset email | standard `users` password broker |
| Reset-link-sent `O2` (`qV2vd`) | route-state of `Auth/ForgotPassword` | generic flash status | resend/back | no user enumeration and no separate GET |
| New password `O3` (`ERga7`) | approved `GET /reset-password/{token}`, `password.reset`, `Auth/ResetPassword` | token, email | reset password | `users` broker; invalid/expired/reused tokens rejected |
| Password changed `O4` (`mSTSX`) | route-state after reset redirect to `login` | success flash | go to login | no standalone route |
| Dashboard `K`/`K2` (`PvBmx`) | approved `GET /account`, `account.dashboard`, `Account/Dashboard` | `user`, `subscription`, `devicesSummary`, `serviceState` | subscribe, connect, open More | available immediately after registration under `auth:web`; Remnawave failure is an explicit `service_error`, never stale local truth |
| Dashboard More open (`n3Las`, `VcLN4`, `mlxDX`) | visual-only route-state of dashboard | navigation destinations | navigate/logout/close | local modal state; logout uses the approved session route |
| Subscription `L` (`P4PAH`) | approved `GET /account/subscription`, `account.subscription`, `Account/Subscription` | `subscription`, `products[]`, `automaticDiscount?`, `payments[]` | select period, promo, create payment | server products expose explicit `months`, price and currency; payment lifecycle fixed below |
| Promo open (`oL7tp`, `n9UuR`, `Nn7dT`, `jodkF`, `k4r5Hy`) | visual-only route-state of subscription | current selection and validation state | validate/apply/remove promo | focused preview action uses `PromocodeService`; payment creation revalidates every value |
| Connection `P` (`QjIv0`) | approved `GET /account/connection`, `account.connection`, `Account/Connection` | `subscriptionUrl`, `platforms[]`, `devices[]`, `deviceLimit`, `serviceState` | choose platform, copy URL, revoke device, support | Remnawave read/delete exists; backend `platforms[]` is a prepared copy of the common app links and instructions shown on a Remnawave subscription page, while the user-specific `subscriptionUrl` remains an authenticated prop |
| Referral `Q` (`QIQ4z`) | approved `GET /account/referral`, `account.referral`, `Account/Referral/Index` | `webInviteUrl`, `telegramInviteUrl`, `metrics`, `recentRewards[]` | copy/share either invite, open terms | both channels resolve attribution to the inviter's stable Remnawave identity; merge policy fixed below |
| Referral terms `Q2` (`paZk6` and responsive/theme variants) | approved `GET /account/referral/terms`, `account.referral.terms`, `Account/Referral/Terms` | `friendDiscountPercent`, `rewardMatrix[]`, `contentVersion` | back to referral | protected read-only; live server rules plus explicit content version |
| Support list `R` (`O8T2D6`) | approved `GET /account/support`, `account.support.index`, `Account/Support/Index` | authorized `tickets[]` | create/open ticket | local persisted ticket domain with deterministic newest-activity ordering |
| New support ticket `R2` (`OWEdQ`) | approved `GET /account/support/create`, `account.support.create`, `Account/Support/Create` and `POST /account/support`, `account.support.store` | subject/body limits | create ticket plus first message atomically | `StoreSupportTicketRequest`, policy/gate and service action |
| Conversation `R3` (`T6vDvD`) | approved `GET /account/support/{ticket}`, `account.support.show`, `Account/Support/Show`; `POST /account/support/{ticket}/messages`, `account.support.messages.store` | authorized `ticket`, ordered `messages[]` | reply while open | owner policy; operators reply/close/reopen through MoonShine support resources |
| Profile `S` (`AxIiC`) | approved `GET /account/profile`, `account.profile`, `Account/Profile` | `user`, `telegramConnection`, `securityCapabilities`, `themePreference` | update name/email/password/theme, logout sessions | email changes immediately after normalized uniqueness/current-password check; Telegram linking status is read-only because merge UI is deferred |
| Payment pending/success/failure | approved `GET /account/payments/{payment}`, `account.payments.show`, `Account/Payments/Show` | authorized payment status and safe display fields | refresh/retry/back | two-second polling for at most 60 seconds; webhook-processed local status is authoritative; retry creates a new payment |

Theme pairs, viewport copies, hover/focus/component-state boards, Mini Design
System and logo-system boards are visual-only. Static Signal Orbit Hero встроен
в landing frames; удалённые storyboard/Static Hero boards больше не являются
source. Trial/active/expiring/expired/limited/loading/service-error variants are
data states of account routes. They do not create new URLs.

### Approved route registry and middleware boundary

This registry closes `U-03`. Optional Telegram linking/merge routes are deferred
outside this plan and are not silently treated as part of registration.

| Scope | Methods and names | Middleware/authorization |
| --- | --- | --- |
| Public | `GET /` `home` | `web`; no auth. Terms/privacy routes and links are omitted until approved content exists |
| Guest auth | `GET/POST /login` `login`/`login.store`; `GET/POST /register` `register`/`register.store`; `GET/POST /forgot-password` `password.request`/`password.email`; `GET /reset-password/{token}` `password.reset`; `POST /reset-password` `password.update` | `web`, `guest:web`; registration/login/reset throttled by normalized email plus IP; explicitly use `web` guard and `users` broker because application defaults belong to MoonShine |
| Session | `DELETE /logout` `logout` | `web`, `auth:web`, CSRF |
| Account reads | `account.dashboard`, `account.subscription`, `account.connection`, `account.referral`, `account.referral.terms`, `account.support.*`, `account.profile`, `account.payments.show` under `/account` | `web`, `auth:web`; page queries scoped to authenticated user |
| Optional Telegram connection | deferred outside this plan; no mutation route is exposed | profile may show honest read-only connection state; eventual merge requires the separate durable contract recorded under `U-04` |
| Payment | existing `POST /payments` `payments.store`; existing signed-token `GET /payments/return` `payments.return`; approved `GET /account/payments/{payment}` `account.payments.show` | creation/status use `auth:web`; status also uses payment ownership policy; return token never substitutes account authorization |
| Device mutation | approved `DELETE /account/devices/{device}` `account.devices.destroy` | `auth:web`, FormRequest, ownership/capability policy; remote ID must not be trusted without matching authenticated Remnawave user |
| Support | approved `account.support.index/create/store/show` and `account.support.messages.store` | `auth:web`, ticket ownership policy, open-ticket reply rule; operator mutations stay behind MoonShine authentication/authorization |

The existing `POST /webhooks/yookassa` remains provider-facing with
`CheckYooKassaWebhookSource`, CSRF exception and provider re-fetch. It is not an
Inertia action.

### Component and composable map

Route pages remain thin composition surfaces and own no reusable business rule.
Runtime props/emits stay explicit in the existing JavaScript stack.

| Layer | Components | Responsibility and public contract |
| --- | --- | --- |
| Layouts | `PublicLayout`, `AuthLayout`, `AccountLayout` | page chrome and landmarks only; slots for content; Account layout receives navigation/user summary and emits no domain mutation |
| Public shell | `PublicHeader`, `PublicMobileMenu`, `PublicFooter` | navigation presentation; menu receives `open`/destinations and emits `update:open`/`navigate` |
| Hero/landing | `LandingHero`, `FeatureList`, `PlatformList`, `PricingPreview`, `LandingCta` | present server/static content; static Hero has no reactive mode/props/emits and keeps destinations in the route composition contract |
| Account shell | `AccountTopHeader`, `AccountSidebar`, `AccountBottomNavigation`, `AccountMoreSheet` | responsive navigation; active route is a prop; sheet receives `open`, emits `update:open` and navigation intent |
| Shared UI | `BaseButton`, `BaseField`, `InlineAlert`, `StatusBadge`, `CopyableValue`, `PeriodSelector`, `SubscriptionSummary`, `BaseOverlay` | one semantic primitive/pattern each; fixed variant maps; no arbitrary class-string API |
| Subscription/payment | `ProductPeriodPicker`, `PromoForm`, `PaymentHistory`, `PaymentStatePanel` | controlled selection/form/status display; mutation intent emitted upward; Inertia page/form owns requests |
| Connection | `PlatformSelector`, `ConnectionSteps`, `DeviceList` | controlled platform state, instructions, authorized revoke intent; no Remnawave calls in components |
| Referral | `ReferralInvite`, `ReferralMetrics`, `ReferralRewardTable` | copy/share and presentation; terms are server props, never embedded business rules |
| Support/profile | `TicketList`, `TicketForm`, `ConversationThread`, `ProfileForm`, `ConnectedAccounts`, `SecurityActions`, `ThemeSelector` | support components implement the approved persisted ticket domain; `ConnectedAccounts` is read-only in this plan and does not expose deferred merge/unlink actions |

Composable boundaries:

- `useTheme` — pre-hydration bootstrap and `localStorage` persistence for the
  explicit `light`/`dark` choice; OS preference is used once only when no valid
  stored choice exists; no server mutation in the first version;
- `useOverlay` — open state, focus trap/restore, Escape, inert and scroll lock;
- `useClipboardShare` — Clipboard/Web Share capability and local feedback;
- `usePaymentStatus` — two-second status reload for at most 60 seconds, then a
  user-triggered refresh/retry path;
- platform selection stays local until reuse justifies a composable.

### Mutation contract

Names below are implementation contracts, not production classes created by
this audit. Every web mutation retains CSRF protection and returns an Inertia
redirect/errors unless the table explicitly preserves the existing JSON API.

| Mutation | FormRequest | Authorization | Service/action | Response |
| --- | --- | --- | --- | --- |
| Login/logout | `LoginRequest` / no payload request | guest / authenticated `web` session | framework auth session action | redirect with regenerated/invalidated session and validation errors |
| Web registration | `RegisterRequest` | guest; normalized unique email and confirmed password | focused web registration plus idempotent Remnawave provisioning action | create and authenticate the local user immediately without email verification; attempt remote provisioning in the same flow and persist retryable failure state without fabricating a subscription |
| Reset link/password | `PasswordResetLinkRequest`, `ResetPasswordRequest` | guest + throttle + valid `users` broker token | framework password broker plus mail notification | generic redirect/flash without enumeration; reset invalid/expired/reused token errors |
| Link/merge Telegram | deferred outside this plan | no public mutation | future idempotent account-linking action with locks, durable merge state and explicit Remnawave boundary | profile exposes status only; eventual referral ownership follows the surviving `remnawave_user_id` |
| Create payment | existing `CreatePaymentRequest` | authenticated web user; active product validation | existing `PaymentService` + `PromocodeService` | existing `201` JSON `{payment_id, confirmation_url}`; `422`/`502` errors |
| Apply promo preview | `PreviewPromocodeRequest` | authenticated user; product active; promo eligibility | `PromocodeService` via thin action | focused JSON action returns code, discount percent, original amount and final amount; payment creation revalidates the same inputs and never trusts the preview |
| Revoke device | `DestroyDeviceRequest` | authenticated user plus device ownership/capability policy | account device action wrapping Remnawave HWID handler | redirect with flash/service error; never expose remote credentials |
| Create ticket/reply | `StoreSupportTicketRequest`, `StoreSupportMessageRequest` | authenticated ticket owner; reply only while open | support ticket/message actions | creation persists ticket and first message atomically; reply redirects with validation/errors and no optimistic fake message |
| Operator reply/status | MoonShine resource validation | authorized MoonShine operator | support reply/status actions shared with domain services | persist operator reply; close/reopen ticket; no direct uncontrolled model mutation from presentation code |
| Update profile/password | `UpdateProfileRequest`, `UpdatePasswordRequest` | authenticated owner plus current-password confirmation for sensitive changes | identity/profile actions | name/email changes apply immediately without verification; password change invalidates other sessions; redirect with success/errors |
| Theme preference | none in the first version | local-only | `useTheme` local storage | no request; only `light`/`dark` are stored, OS preference selects the first persisted value, and bootstrap runs before hydration |

### Approved support domain

- `SupportTicket` belongs to `User`, has a required subject, native enum status
  `OPEN`/`CLOSED`, `closed_at` and timestamps. The list is ordered by latest
  persisted conversation activity with a unique tie-breaker.
- `SupportMessage` belongs to a ticket and records exactly one author channel:
  the customer `User` or an authorized MoonShine operator. The schema keeps
  explicit nullable foreign keys plus an invariant that exactly one author is
  present; raw polymorphic class names are not stored.
- Creating a ticket and its first customer message is one database transaction.
  Customers may read only their own tickets and reply only while `OPEN`.
- Authorized operators use dedicated MoonShine support resources/actions to
  read, reply, close and reopen. The same domain services enforce status
  transitions for web and admin entry points.
- Conversation messages are ordered oldest-first by creation time plus ID;
  tickets are never automatically deleted. Attachments, realtime delivery,
  unread counters and outbound notifications remain outside this first full
  create/read/reply/close/reopen contract.

### Approved referral attribution

- The referral page exposes both web and Telegram invite URLs. Each carries an
  opaque public token which resolves server-side to the inviter's numeric
  `remnawave_user_id`; no local ID, `chat_id` or raw remote ID is exposed.
- The first valid attribution wins. Duplicate registration attempts and
  self-referral across either channel are rejected.
- Before linking, independent web and Telegram accounts retain independent
  referrals and rewards. If a later merge is executed, referral ownership and
  reward foreign keys move to the local survivor corresponding to the surviving
  `remnawave_user_id`; payment-level uniqueness prevents double rewards.
- Referral terms use live `ReferralBonus` and automatic referral-discount rules
  from the server plus an explicit content version. Vue never owns a copied
  discount percentage or reward matrix.

Accepted auth, provisioning and deferred linking boundary:

- a new deployment-safe migration adds nullable unique `email`, nullable
  password hash, nullable unique numeric `remnawave_user_id` and a durable
  generated non-PII provisioning key to the populated `users` table, and makes
  `chat_id`/`username` nullable for web-only rows. `email_verified_at` and email
  verification routes/middleware are not introduced. Every row must retain at
  least one valid identity channel: email credentials, Telegram identity, or
  both;
- a separate `password_reset_tokens` table is required because the configured
  `users` broker references it but no migration currently creates it;
- web registration creates a new local `User` independently of Telegram,
  initially with the safe inactive lifecycle classification. It authenticates
  through `Auth::guard('web')` and regenerates the session immediately, without
  sending or waiting for an email verification notification;
- the same registration action attempts immediate Remnawave provisioning with
  the stored generated non-PII key. On success it stores the numeric remote ID.
  Because the local database and Remnawave are not atomic, a remote failure does
  not discard the new local account: it produces an explicit retryable
  `service_error`, and an idempotent retry reuses the same provisioning key;
- an unlinked web account and an unlinked Telegram account are separate user
  records with separate payments, referrals, device limits and Remnawave
  subscriptions. Linking must never silently grant one account the other's
  entitlement;
- the accepted linked topology is exactly one local `users` row and one
  Remnawave user. The surviving remote record contains both `email` and
  `telegramId`; no separate `service_accounts` ownership layer is introduced;
- in the future low-conflict Telegram-first path, the existing local row may
  receive normalized email credentials without a verification phase and the
  same Remnawave user is patched with that email. In the web-first path, the
  existing local row receives the
  proven `chat_id` and Telegram username, then the same Remnawave user is
  patched with `telegramId`. Proof must be short-lived, single-use and hashed
  at rest;
- local rows store the numeric Remnawave user ID as the stable remote mapping.
  Username remains a
  mutable display/provider field and is not a safe primary mapping key;
- linking adds the missing identity field to the surviving remote user; it does
  not copy or regenerate `shortUuid`, protocol credentials, subscription URL,
  device state or squad membership from another remote record;
- if both identities already belong to different `users` rows, the system also
  has two sets of foreign-key-owned payments/promocodes/referrals/rewards and
  may have two remote subscriptions. The accepted end state still physically
  consolidates them into one local row and one remote user: all eligible local
  ownership references must be reassigned to a chosen survivor, and the remote
  survivor receives both identity fields. The survivor rule, paid-time policy,
  self-referral/reward conflicts, duplicate promocodes and losing-remote cleanup
  remain explicitly unresolved in `U-04`;
- web and Telegram invite links coexist. Each resolves through an opaque public
  referral token to the inviter's numeric `remnawave_user_id`; neither exposes
  `chat_id`, local user ID or the raw remote ID. Existing local
  `referrer_user_id`/reward foreign keys remain the storage mechanism. If a
  future account merge is performed, those references are reassigned to the
  local survivor whose `remnawave_user_id` equals the surviving remote user;
  payment-scoped reward uniqueness is preserved, and self-referrals created by
  collapsing identities are rejected or surfaced as merge conflicts rather
  than double-applied;
- the local database and Remnawave cannot be committed atomically. The merge
  action therefore requires locks, a durable staged state, idempotent retries
  and explicit compensation/reconciliation. The losing remote user must not be
  disabled or deleted before the local survivor and patched remote survivor are
  confirmed;
- unlink after physical consolidation is unresolved and cannot mean restoring
  the two former histories automatically. Until a product rule exists, the
  implementation must not offer destructive unlink;
- linking/merge implementation is deferred outside this plan. UI may show only
  honest read-only connection status and may not execute a fake or partially
  destructive merge;
- password recovery always returns a generic response. It uses
  `Password::broker('users')`, framework reset tokens and email notification;
- production delivery requires a configured non-`log` mailer and valid
  `MAIL_FROM_*`. Queueing is enabled only with an operational worker; no UI may
  report delivery success from a fake/log-only transport.

Copy, Web Share, selector changes and menu/dialog open state are client
interactions, not backend mutations. Static Hero has no client state.

### Static copy versus server props

| Static design/content copy | Required server props |
| --- | --- |
| Section headings, field labels, button labels, empty-state explanations, accessibility labels | authenticated identity display, account creation date and editable capabilities; backend platform catalog copied from the common Remnawave subscription-page instructions; authenticated user subscription URL |
| Static Hero eyebrow `HEY, DUDE!`, heading `Любимые сервисы снова рядом`, description and CTA labels | plans/products, period, price/currency, automatic/manual discount result |
| Generic payment state headings and safe retry guidance | payment ID/status/amount/product/timestamps, and whether retry is allowed |
| Generic subscription/support/referral labels | Remnawave status/expiration/subscription URL/device count/limit; both referral URLs/metrics/rewards; persisted support tickets/messages |
| Legal shell labels and navigation | legal/privacy/referral terms content and content version when rules can change |

No email, dates, prices, device counts, ticket content, referral metrics or
payment results shown in Pen may be copied into Vue fixtures. This closes
`U-21`.

### Remnawave-to-UI mapping

Remote Remnawave remains subscription truth. A linked remote user carries both
`email` and `telegramId`; orchestration must fetch it through the numeric remote
ID stored on the local survivor rather than mutable username matching, then
expose only safe derived props. The current Remnawave client/OpenAPI contract
supports patching nullable `email` and `telegramId`; it does not itself provide
the local-history or duplicate-subscription merge transaction.

| Source condition | UI state | Notes |
| --- | --- | --- |
| request in flight | `loading` | skeleton/disabled actions; not a stored lifecycle state |
| remote `ACTIVE` with existing trial classification | `trial` | preserve current `UserStateManager` classification rules |
| remote `ACTIVE`, non-trial | `active` | `expiring` is a display derivation when `expireAt` is less than three days away |
| remote `EXPIRED` or `expireAt` not in future under current lifecycle reconciliation | `expired`/inactive | no local expiration fallback |
| remote `LIMITED` or `DISABLED` | `limited` | preserve current local-tag behavior; do not silently recast as expired |
| connection/API error | `service_error` | show retry/support-safe UI; do not render cached local status as current truth |

`subscriptionUrl` feeds copy/connect actions; `hwidDeviceLimit` and the HWID
device handler feed device summary/list. Raw Remnawave credentials, passwords,
internal squads and provider payloads are never Inertia props. The first
implementation performs a fresh provider read for each relevant Inertia request
instead of using a cross-request status cache; provider failure maps to
`service_error` and never falls back to local expiration/status.

### Existing and required payment lifecycle

1. Account page receives active product IDs and display values from server.
2. Existing `POST /payments` validates the active product and optional promo,
   creates an idempotent YooKassa payment and returns `201` JSON with local ID
   and provider confirmation URL; `502` is a safe retryable creation error.
3. Browser navigates to `confirmation_url`.
4. Existing signed-token `GET /payments/return` validates the payment token.
   Telegram payments return to the bot; web payments currently receive plain
   pending text.
5. Trusted webhook plus provider re-fetch is authoritative for terminal
   `succeeded`/`canceled`; successful processing extends Remnawave and applies
   referral behavior before UI may claim success.
6. The approved authorized payment page may display `pending`, `succeeded` or
   `canceled` only from the local payment record after webhook processing.
7. Web return redirects to the authorized payment page. It reloads status every
   two seconds for at most 60 seconds. After timeout it stops automatically and
   offers manual refresh; no client-side success inference is allowed.
8. A retry after terminal cancellation or retryable creation failure creates a
   new idempotent payment attempt from the same server-confirmed product/promo
   inputs; it never reuses or mutates the canceled provider payment.

### Approved visual and interaction decisions

- Public brand is `dudeweb`; актуальная редакция использует один Signal Orbit
  Hero с eyebrow `HEY, DUDE!` и сразу видимым heading `Любимые сервисы снова
  рядом`.
- Logo direction is `06 · Razor Loop`: icon for favicon, horizontal lockup for
  public header and stacked/horizontal variants where the account shell needs
  them. Exact Pen SVG geometry and original viewBox are preserved.
- Hero не использует pinning или scroll progress. Последнее owner decision
  2026-10-16 отменяет ранее утверждённый CSS morph: Signal Orbit использует
  исходную статичную Pen geometry во всех motion preferences. Ambient metadata
  из Pen не применяется после этого решения.
- CSS layout boundaries are mobile `<768`, tablet `768–1199`, desktop `>=1200`.
  Within desktop, `>=1600` switches to wide public geometry; `2560 x 1440` now
  has explicit dark/light Pen references `j8pJq`/`eM8HW`.
- IBM Plex Sans/Mono are self-hosted through the approved npm font packages;
  adding those two dependencies is in scope for the foundation step.
- Theme supports only `light`/`dark`, persists the explicit value in
  `localStorage` and is applied before hydration. When no valid value exists,
  the OS preference selects and persists the initial mode; later OS changes do
  not create a third mode. No server preference is stored in the first version.
- Public CTA destinations are `/register`, `/login` and `#pricing`. Terms and
  privacy links/routes stay absent until approved content exists. Platform
  app/download links and instructions come from a backend catalog copied from
  the common content of a Remnawave subscription page; Vue does not maintain a
  second copy or expose a user-specific subscription URL on the public landing.

### Responsive overlay and focus contract

| Trigger | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| `Ещё` | `390 x 372` bottom sheet | centered `520 x 372` bottom sheet | no overlay; destinations live in persistent sidebar |
| Promo | `390 x 354` bottom sheet | centered `520 x 354` bottom sheet | centered `500 x 354` dialog in main visual area |

All rendered sheets/dialogs use modal semantics (`role="dialog"`, labelled
title, `aria-modal="true"`), Teleport when required by stacking context, initial
focus on the first meaningful control, focus trap, return focus to trigger,
Escape handling and body scroll lock. The application behind the overlay is
inert, including account header/navigation/sidebar even where Pen dims only the
main visual region. Backdrop/Escape may close only when no non-cancelable async
submit is running. This closes `U-20`; exact pixels remain Pen references rather
than new CSS breakpoint definitions.

### Skill map for implementation steps

| Step | Selected skills and concern-specific reading |
| --- | --- |
| 2 | `frontend-design`, `tailwind-best-practices`; `vue-best-practices` core only if Vue bootstrap changes; `tailwind-4-docs` only after separately approved current snapshot |
| 3 | three frontend skills; Vue core plus slots/fallthrough only for actual public contracts |
| 4 | three frontend skills; Vue Teleport only if menu leaves its stacking context |
| 5 | three frontend skills; Vue core for the static Signal Orbit; no animation, reactive state or composable |
| 6 | three frontend skills; `laravel-best-practices` only for route/props/query changes (`routing`, `architecture`, `eloquent`, `db-performance`) |
| 7 | three frontend skills plus `laravel-best-practices` (`routing`, `validation`, `security`, `error-handling`); Laravel attribute skill only for an actually supported approved concern |
| 8 | three frontend skills plus Laravel architecture/query/external-boundary/error rules; Vue Teleport/Transition for sheets; attribute skill conditional after framework-source check |
| 9 | three frontend skills plus Laravel validation/security/query/error rules; attribute skill conditional |
| 10 | three frontend skills plus Laravel validation/security/http-client/error rules; attribute skill conditional |
| 11 | three frontend skills plus Laravel authorization/query/performance rules; attribute skill conditional |
| 12 | three frontend skills plus Laravel architecture/migrations/policies/validation/query/error/security rules; attribute skill conditional only if local ticket domain is approved |
| 13 | three frontend skills plus Laravel validation/security/session/error rules; attribute skill conditional |
| 14 | three frontend skills; Vue Teleport/Transition/state-animation references only for implemented overlays/motion |
| 15 | three frontend skills for visual/a11y review; Laravel skill only if a found defect requires backend PHP changes |
| 16 | reselect skills matching the actual diff; attribute skill only for approved attributes; Tailwind docs only for a live version-specific concern |

Every Vue implementation step starts with the core reactivity/SFC/data-flow/
composable references and stays on JavaScript. Laravel rule selection remains
concern-scoped, and installed framework source is checked before any attribute.

### Decision register and blocking scope

| ID | Status/owner | Evidence, recommendation and blocking scope |
| --- | --- | --- |
| `U-01` | Closed by product owner | `User` may be web-only, Telegram-only or linked. Both channels create independent local and Remnawave accounts; unlinked accounts retain separate billing/subscriptions |
| `U-02` | Closed by product owner | Public web registration immediately authenticates a standalone email/password user without email verification. Password reset still uses the explicit `users` broker and generic email delivery |
| `U-03` | Closed by product owner | Route registry and middleware boundary above are approved |
| `U-04` | Closed for this plan by product owner | Linking/merge UI and mutations are deferred outside this plan; profile shows connection status only. Future merge must still use locks, staged state, reconciliation and the surviving `remnawave_user_id` ownership rule |
| `U-05` | Closed by product owner/technical contract | Registration creates the local account immediately and attempts idempotent Remnawave provisioning with a stored non-PII key; numeric remote ID is persisted, no cross-request status cache or stale local fallback is used, and `expiring` means less than three days |
| `U-06` | Closed by product owner | `Product` receives explicit `months` values `1/3/6/12`; price/currency/period are server props, and promo preview is server-validated then revalidated during payment creation |
| `U-07` | Closed by product owner | Web return redirects to the owned payment page; polling is every two seconds for 60 seconds, webhook-processed local status is authoritative, and retry creates a new payment attempt |
| `U-08` | Closed by product owner | Implement the full persisted support ticket/message domain, owner web UI and MoonShine operator reply/close/reopen flow described above |
| `U-09` | Closed by product owner | Web and Telegram invite links coexist and resolve through opaque tokens to `remnawave_user_id`; first valid attribution wins, self-referral is rejected, and future merge reassigns ownership to the surviving remote identity |
| `U-10` | Closed by product owner/backend | Backend will provide `platforms[]` as a prepared copy of the common app links and instructions already shown on a Remnawave subscription page. Landing and connection UI consume this server contract without hardcoded Vue copies; a user-specific subscription URL is passed separately only to its authenticated owner |
| `U-11` | Closed by product owner | Name, surname, email and password are editable; email changes immediately after uniqueness/current-password checks, password change invalidates other sessions, Telegram state is read-only |
| `U-12` | Closed by product owner/design; extended 2026-10-15 | Mobile `<768`, tablet `768–1199`, desktop `>=1200`, public wide `>=1600`; `2560 x 1440` is an explicit Pen reference, not implementation-only extrapolation |
| `U-13` | Closed by product owner/design | Self-host IBM Plex Sans/Mono through the two approved npm font packages |
| `U-14` | Closed by product owner/frontend; updated 2026-10-15 | Only `light/dark`; OS preference selects the first persisted mode when storage is empty or legacy, pre-hydration application and `localStorage`; no server persistence in v1 |
| `U-15` | Closed by product owner | CTA use `/register`, `/login`, `#pricing`; terms/privacy routes and links remain absent until approved content exists |
| `U-16` | Superseded and closed by current Pen/product decision; updated by owner 2026-10-16 | Hero content is immediately visible on every viewport; no scroll progress, pinning, release state or fallback mode. Signal Orbit is static; the earlier ambient CSS morph is removed |
| `U-17` | Closed | PHP-CS-Fixer is the repository tool; do not reopen |
| `U-18` | Deferred; engineering owner | No frontend test/a11y/E2E toolchain. Blocks automated portion of step 15, not manual audit; dependency addition needs separate approval |
| `U-19` | Closed by product owner | Public brand is `dudeweb`; current Hero copy is `HEY, DUDE!` plus `Любимые сервисы снова рядом` |
| `U-20` | Closed; technical decision | Modal/inert/focus contract fixed above; no product behavior invented |
| `U-21` | Closed; data contract | Demo values are never fixtures; runtime values are server props or the flow remains absent |
| `U-22` | Deferred; platform owner | SSR packages/build entry exist, runtime operation unproved. Blocks SSR/hydration sign-off in steps 8/15, not CSR contract planning |
| `U-23` | Closed | Inertia server/client/Vite packages are major 3; do not reopen |
| `U-24` | Closed; architecture decision | Preserve lowercase existing directories; blocks removed for step 3 |
| `U-25` | Closed by product owner/design | Use Pen `06 · Razor Loop`: icon favicon, horizontal public lockup and appropriate account lockup, preserving exact SVG geometry/viewBox |
| `U-26` | Superseded and closed by current Pen/product decision | Separate fallback policy no longer exists: Hero content is always visible, and Signal Orbit is static for all motion preferences |
| `U-27` | Closed by product owner/backend | Referral terms are derived from live server discount/reward rules and carry an explicit content version |
| `U-28` | Needs review; content/product owner | Footer now draws agreement/privacy labels, but Pen provides no content pages, routes or approved destinations; do not render dead links until that contract exists |

### Remaining implementation boundaries

Step 1 has no unresolved decision blocking step 2. `U-18` blocks only the
automated frontend-tooling portion of step 15; `U-22` blocks only SSR operational
sign-off. Telegram linking/merge is outside this plan, so no step may add its
mutation UI opportunistically. Production code still begins only after this
planning step is verified, checked off in README and committed.

