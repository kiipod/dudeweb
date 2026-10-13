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
- [ ] Зафиксировать public/auth/account route names и middleware.
- [ ] Решить `U-01`–`U-04`: identity, web session, registration и password
  recovery contracts.
- [ ] Решить `U-05`–`U-11`: subscription, products, payments, support,
  referrals, connection и profile contracts.
- [ ] Решить `U-12`–`U-16`: breakpoints, fonts, theme и Hero scroll policy.
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
- [ ] Классифицировать `Q2 · Referral Terms` как protected read-only page,
  утвердить route/path/back-navigation и источник discount/reward content по
  `U-27`.
- [x] Зафиксировать mapping remote Remnawave state к UI states, не меняя
  существующие lifecycle rules.
- [ ] Зафиксировать payment flow: создание, redirect, return, pending refresh,
  success, error и retry.
- [x] Зафиксировать responsive overlay map для mobile/tablet/desktop `Ещё` и
  промокода, включая presentation, backdrop, inert scope и focus contract.
- [ ] Зафиксировать, какой logo/lockup и какой Static Hero mode являются
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
- Read-only обход подтвердил `142` top-level frames, `10` formal reusable
  components, `19` variables и `0` layout-проблем. От baseline README дельты
  нет, поэтому последующие task-файлы не переписывались.
- Использовались только read operations `Get`/`GetVariables`; Pencil mutations
  не выполнялись.
- Production-код и тесты не изменялись. Текущие handlers ниже описаны как
  evidence, а будущие handlers — как proposal или blocker.
- В checkout существует пятый application route `GET /test`, который напрямую
  вызывает Remnawave и завершает запрос через `dd()`. Он не входит в UI map и
  требует отдельного удаления/ограничения до публикации web UI.

Статусы в таблицах:

- **existing** — контракт уже существует в checkout;
- **proposed** — точное имя зафиксировано для product-owner review, но route ещё
  нельзя реализовывать;
- **blocked** — backend/domain contract отсутствует либо зависит от открытого
  `U-*`;
- **visual-only** — reference/state без самостоятельного URL.

### Screen, route, data и action map

| Pen frame/flow | Route и Inertia page | Минимальные props | Действия | Backend contract |
| --- | --- | --- | --- | --- |
| Landing `A`–`F` (например `OidTs`) | proposed `GET /`, `home`, `Public/Home` | `plans[]`, `advantages[]`, `auth.user?`, destinations | login, trial, pricing anchors, legal/support links | read-only controller/query; exact login route remains `U-03`, product/legal destinations remain `U-06`/`U-15` |
| Mobile menu open (например `H2013`) | visual-only state of `home` | те же, что у landing | open/close, navigate | local state; no endpoint |
| Login `M` (`HhyAE`) | proposed `GET /login`, `login`, `Auth/Login` | `canRegister`, `canResetPassword`, flash | submit email/password | contract fixed; exact route acceptance remains `U-03` |
| Registration `N` (`peVB0`) | proposed `GET /register`, `register`, `Auth/Register` | legal destinations, verification capability | create independent web user by email/password | open registration accepted; Remnawave provisioning remains `U-05`, legal destination remains `U-15` |
| Recovery `O` (`Yd1Y4`) | proposed `GET /forgot-password`, `password.request`, `Auth/ForgotPassword` | flash status | request reset email | standard `users` password broker; exact route acceptance remains `U-03` |
| Reset-link-sent `O2` (`qV2vd`) | route-state of `Auth/ForgotPassword` | generic flash status | resend/back | no user enumeration and no separate GET |
| New password `O3` (`ERga7`) | proposed `GET /reset-password/{token}`, `password.reset`, `Auth/ResetPassword` | token, email | reset password | `users` broker; invalid/expired/reused tokens rejected |
| Password changed `O4` (`mSTSX`) | route-state after reset redirect to `login` | success flash | go to login | no standalone route |
| Email verification notice | proposed `GET /email/verify`, `verification.notice`, `Auth/VerifyEmail` | masked email, flash | resend verification/logout | `auth:web`; framework notification; account access still denied |
| Dashboard `K`/`K2` (`PvBmx`) | proposed `GET /account`, `account.dashboard`, `Account/Dashboard` | `user`, `subscription`, `devicesSummary`, `serviceState` | subscribe, connect, open More | account props require authenticated verified web user; Telegram linking is optional, Remnawave provisioning/UX remains `U-05` |
| Dashboard More open (`n3Las`, `VcLN4`, `mlxDX`) | visual-only route-state of dashboard | navigation destinations | navigate/logout/close | local modal state; logout behavior is fixed, exact route remains `U-03` |
| Subscription `L` (`P4PAH`) | proposed `GET /account/subscription`, `account.subscription`, `Account/Subscription` | `subscription`, `products[]`, `automaticDiscount?`, `payments[]` | select period, promo, create payment | product/payment presentation blocked by `U-06`, `U-07` |
| Promo open (`oL7tp`, `n9UuR`, `Nn7dT`, `jodkF`, `k4r5Hy`) | visual-only route-state of subscription | current selection and validation state | validate/apply/remove promo | current service exists, but no standalone web action; exact contract remains with `U-06`/`U-07` |
| Connection `P` (`QjIv0`) | proposed `GET /account/connection`, `account.connection`, `Account/Connection` | `subscriptionUrl`, `platforms[]`, `devices[]`, `deviceLimit`, `serviceState` | choose platform, copy URL, download, revoke device, support | Remnawave read/delete exists; copy is local; content/downloads blocked by `U-10` |
| Referral `Q` (`QIQ4z`) | proposed `GET /account/referral`, `account.referral`, `Account/Referral/Index` | `inviteUrl`, `metrics`, `recentRewards[]` | copy/share invite, open terms | aggregates exist; URL blocked by `U-09` |
| Referral terms `Q2` (`paZk6` and responsive/theme variants) | proposed `GET /account/referral/terms`, `account.referral.terms`, `Account/Referral/Terms` | `friendDiscountPercent`, `rewardMatrix[]`, `contentVersion?` | back to referral | protected read-only; source/versioning blocked by `U-27` |
| Support list `R` (`O8T2D6`) | proposed only if local domain accepted: `GET /account/support`, `account.support.index`, `Account/Support/Index` | `tickets[]` | create/open ticket | blocked by `U-08`; current honest alternative is external Telegram link |
| New support ticket `R2` (`OWEdQ`) | proposed only if accepted: `GET /account/support/create`, `account.support.create`, `Account/Support/Create` | categories/limits | submit ticket | blocked by `U-08`; no model/service exists |
| Conversation `R3` (`T6vDvD`) | proposed only if accepted: `GET /account/support/{ticket}`, `account.support.show`, `Account/Support/Show` | authorized `ticket`, `messages[]` | reply | blocked by `U-08`; no model/service exists |
| Profile `S` (`AxIiC`) | proposed `GET /account/profile`, `account.profile`, `Account/Profile` | `user`, `telegramConnection`, `securityCapabilities`, `themePreference` | update profile/password/theme, link Telegram, logout sessions | Pen lacks linked/unlinked/collision UI; linking remains `U-04`, other profile behavior `U-11`/`U-14` |
| Payment pending/success/failure | proposed single `GET /account/payments/{payment}`, `account.payments.show`, `Account/Payments/Show` | authorized payment status and safe display fields | refresh/retry/back | create/return/webhook exist; status endpoint and live policy blocked by `U-07` |

Theme pairs, viewport copies, hover/focus/component-state boards, Mini Design
System, Hero storyboard, Static Hero boards and logo-system boards are all
visual-only. Trial/active/expiring/expired/limited/loading/service-error variants
are data states of account routes. They do not create new URLs.

### Proposed route registry and middleware boundary

This registry is the exact proposal for core `U-03` routes. Independent web
identity/session behavior is fixed, but route names and paths are not accepted
until `U-03` is approved. Optional Telegram linking routes remain blocked by
`U-04` and are not silently treated as part of registration.

| Scope | Methods and names | Middleware/authorization |
| --- | --- | --- |
| Public | `GET /` `home`; `GET /terms` `legal.terms`; `GET /privacy` `legal.privacy` | `web`; no auth. Legal content/destinations still need `U-15` |
| Guest auth | `GET/POST /login` `login`/`login.store`; `GET/POST /register` `register`/`register.store`; `GET/POST /forgot-password` `password.request`/`password.email`; `GET /reset-password/{token}` `password.reset`; `POST /reset-password` `password.update` | `web`, `guest:web`; registration/login/reset throttled by normalized email plus IP; explicitly use `web` guard and `users` broker because application defaults belong to MoonShine |
| Email verification | `GET /email/verify` `verification.notice`; `GET /email/verify/{id}/{hash}` `verification.verify`; `POST /email/verification-notification` `verification.send` | `auth:web`; verification action also `signed` and throttled; resend throttled; only verified users reach account routes |
| Session | `DELETE /logout` `logout` | `web`, `auth:web`, CSRF |
| Account reads | `account.dashboard`, `account.subscription`, `account.connection`, `account.referral`, `account.referral.terms`, `account.profile` under `/account` | `web`, `auth:web`, `verified`; page queries scoped to authenticated user |
| Optional Telegram connection | route names/path deferred; web-to-bot and bot-to-web initiation both require short-lived one-time proof | authenticated side plus proof of the other identity; the accepted result is one local `User` and one Remnawave user with both `email` and `telegramId`; two-account collision and unlink semantics remain `U-04` |
| Payment | existing `POST /payments` `payments.store`; existing signed-token `GET /payments/return` `payments.return`; proposed account payment status route | creation uses `auth:web`; status uses `auth:web` plus payment ownership policy; return token never substitutes account authorization |
| Device mutation | proposed `DELETE /account/devices/{device}` `account.devices.destroy` | `auth:web`, FormRequest, ownership/capability policy; remote ID must not be trusted without matching authenticated Remnawave user |
| Support | `account.support.*` only if `U-08` accepts a local ticket domain | `auth:web`, per-ticket policy; otherwise use external HTTPS Telegram handoff and create no fake routes |

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
| Hero/landing | `HeroStory`, `FeatureList`, `PlatformList`, `PricingPreview`, `LandingCta` | present server/static content; Hero receives ordered states/reduced-motion mode and emits CTA intent only |
| Account shell | `AccountTopHeader`, `AccountSidebar`, `AccountBottomNavigation`, `AccountMoreSheet` | responsive navigation; active route is a prop; sheet receives `open`, emits `update:open` and navigation intent |
| Shared UI | `BaseButton`, `BaseField`, `InlineAlert`, `StatusBadge`, `CopyableValue`, `PeriodSelector`, `SubscriptionSummary`, `BaseOverlay` | one semantic primitive/pattern each; fixed variant maps; no arbitrary class-string API |
| Subscription/payment | `ProductPeriodPicker`, `PromoForm`, `PaymentHistory`, `PaymentStatePanel` | controlled selection/form/status display; mutation intent emitted upward; Inertia page/form owns requests |
| Connection | `PlatformSelector`, `ConnectionSteps`, `DeviceList` | controlled platform state, instructions, authorized revoke intent; no Remnawave calls in components |
| Referral | `ReferralInvite`, `ReferralMetrics`, `ReferralRewardTable` | copy/share and presentation; terms are server props, never embedded business rules |
| Support/profile | `TicketList`, `TicketForm`, `ConversationThread`, `ProfileForm`, `ConnectedAccounts`, `SecurityActions`, `ThemeSelector` | created only after corresponding contracts are accepted; `ConnectedAccounts` receives channel/capability state and emits link/unlink intent without implementing merge rules |

Composable boundaries:

- `useTheme` — bootstrap/persistence/system synchronization after `U-14`;
- `useOverlay` — open state, focus trap/restore, Escape, inert and scroll lock;
- `useHeroScroll` — deterministic state index and reduced-motion fallback after
  `U-16`/`U-26`;
- `useClipboardShare` — Clipboard/Web Share capability and local feedback;
- `usePaymentStatus` — polling/reload/timeout only after `U-07`;
- platform selection stays local until reuse justifies a composable.

### Mutation contract

Names below are implementation contracts, not production classes created by
this audit. Every web mutation retains CSRF protection and returns an Inertia
redirect/errors unless the table explicitly preserves the existing JSON API.

| Mutation | FormRequest | Authorization | Service/action | Response |
| --- | --- | --- | --- | --- |
| Login/logout | `LoginRequest` / no payload request | guest / authenticated `web` session | framework auth session action | redirect with regenerated/invalidated session; validation errors; exact routes remain `U-03` |
| Web registration | `RegisterRequest` | guest; normalized unique email and confirmed password | focused web registration/provisioning action | create independent local user, authenticate through `web`, regenerate session, send verification notification; remote provisioning point remains `U-05` |
| Reset link/password | `PasswordResetLinkRequest`, `ResetPasswordRequest` | guest + throttle + valid `users` broker token | framework password broker plus mail notification | generic redirect/flash without enumeration; reset invalid/expired/reused token errors |
| Link/merge Telegram | dedicated link/confirm/merge FormRequests after flow approval | authenticated verified web user plus one-time proof of Telegram control; collision policy required | idempotent account-linking action with locks, durable merge state and an explicit Remnawave boundary | simple link produces one local `User` and one remote user with both identity fields; two-account consolidation remains blocked by `U-04` |
| Create payment | existing `CreatePaymentRequest` | authenticated web user; active product validation | existing `PaymentService` + `PromocodeService` | existing `201` JSON `{payment_id, confirmation_url}`; `422`/`502` errors |
| Apply promo preview | dedicated request required only if a separate action is accepted | authenticated user; product active; promo eligibility | `PromocodeService` via thin action | Inertia redirect/partial props or JSON must be decided with `U-06`/`U-07`; no endpoint is assumed now |
| Revoke device | `DestroyDeviceRequest` | authenticated user plus device ownership/capability policy | account device action wrapping Remnawave HWID handler | redirect with flash/service error; never expose remote credentials |
| Create ticket/reply | `StoreTicketRequest`, `StoreTicketMessageRequest` | ticket create/view/update policies | support actions/services | redirect/errors; entirely blocked by `U-08` |
| Update profile/password | `UpdateProfileRequest`, `UpdatePasswordRequest` | authenticated verified owner/capability gate | identity/profile actions | redirect + success/errors; exact editable fields/session effects remain `U-11` |
| Theme preference | `UpdateThemePreferenceRequest` only if server persistence is selected | authenticated owner or local-only, per `U-14` | preference action or `useTheme` local storage | redirect/`204` or no request; blocked by `U-14` |

Accepted auth details and unresolved linking boundary:

- a new deployment-safe migration adds nullable unique `email`, nullable
  `email_verified_at` and nullable password hash to the populated `users` table,
  and makes `chat_id`/`username` nullable for web-only rows. Every row must retain
  at least one valid identity channel: verified-capable email credentials,
  Telegram identity, or both;
- a separate `password_reset_tokens` table is required because the configured
  `users` broker references it but no migration currently creates it;
- web registration creates a new local `User` independently of Telegram,
  initially with the safe inactive lifecycle classification. It authenticates
  through `Auth::guard('web')`, regenerates the session and sends the framework
  verification notification. Later logins use the same explicit guard but do
  not resend verification automatically;
- standalone web registration requires a new Remnawave provisioning contract.
  Current code creates/fetches remote users with Telegram `username` and matches
  stream records by `telegramId` or username, so a stable non-PII remote key and
  stored local-to-remote identifier must be approved under `U-05`;
- an unlinked web account and an unlinked Telegram account are separate user
  records with separate payments, referrals, device limits and Remnawave
  subscriptions. Linking must never silently grant one account the other's
  entitlement;
- the accepted linked topology is exactly one local `users` row and one
  Remnawave user. The surviving remote record contains both `email` and
  `telegramId`; no separate `service_accounts` ownership layer is introduced;
- in the low-conflict Telegram-first path, the existing local row receives the
  normalized email and password hash while verification is pending. Only after
  verification is `email_verified_at` set and the same Remnawave user patched
  with that email. In the web-first path, the existing local row receives the
  proven `chat_id` and Telegram username, then the same Remnawave user is
  patched with `telegramId`. Proof must be short-lived, single-use and hashed
  at rest;
- local rows must store the numeric Remnawave user ID as the stable remote
  mapping (proposed column `remnawave_user_id` under `U-05`). Username remains a
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
- the local database and Remnawave cannot be committed atomically. The merge
  action therefore requires locks, a durable staged state, idempotent retries
  and explicit compensation/reconciliation. The losing remote user must not be
  disabled or deleted before the local survivor and patched remote survivor are
  confirmed;
- unlink after physical consolidation is unresolved and cannot mean restoring
  the two former histories automatically. Until a product rule exists, the
  implementation must not offer destructive unlink;
- until `U-04` is decided, linking UI may show only honest availability/status;
  it may not execute a fake or partially destructive merge;
- unverified web users may access only verification notice/resend/logout, not
  account pages;
- password recovery always returns a generic response. It uses
  `Password::broker('users')`, framework reset tokens and email notification;
- production delivery requires a configured non-`log` mailer and valid
  `MAIL_FROM_*`. Queueing is enabled only with an operational worker; no UI may
  report delivery success from a fake/log-only transport.

Copy, Web Share, selector changes, menu/dialog open state and Hero progress are
client interactions, not backend mutations.

### Static copy versus server props

| Static design/content copy | Required server props |
| --- | --- |
| Section headings, field labels, button labels, empty-state explanations, connection step structure after content approval, accessibility labels | authenticated identity display, account creation date and editable capabilities |
| Hero word sequence `Hey Dude -> любимые -> сервисы -> снова -> рядом` and reduced-motion explanatory copy after `U-26` | plans/products, period, price/currency, automatic/manual discount result |
| Generic payment state headings and safe retry guidance | payment ID/status/amount/product/timestamps, and whether retry is allowed |
| Generic subscription/support/referral labels | Remnawave status/expiration/subscription URL/device count/limit; referral URL/metrics/rewards; support tickets/messages if domain exists |
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
| remote `ACTIVE`, non-trial | `active` | `expiring` may only be a display derivation from `expireAt`; threshold needs product confirmation under `U-05` |
| remote `EXPIRED` or `expireAt` not in future under current lifecycle reconciliation | `expired`/inactive | no local expiration fallback |
| remote `LIMITED` or `DISABLED` | `limited` | preserve current local-tag behavior; do not silently recast as expired |
| connection/API error | `service_error` | show retry/support-safe UI; do not render cached local status as current truth |

`subscriptionUrl` feeds copy/connect actions; `hwidDeviceLimit` and the HWID
device handler feed device summary/list. Raw Remnawave credentials, passwords,
internal squads and provider payloads are never Inertia props. Cache duration,
failure UX and the exact expiring threshold keep `U-05` open.

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
6. The proposed authorized payment page may display `pending`, `succeeded` or
   `canceled` only from the local payment record after webhook processing.
7. Poll interval, terminal timeout, return redirect target, ownership policy and
   allowed retry/idempotency behavior are not present today. They keep `U-07`
   and the payment-flow checklist item open; no client-side success inference is
   allowed.

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
| 5 | three frontend skills; Vue state-driven animation, then Transition/class-based reference only for the chosen technique |
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
| `U-02` | Closed by product owner/technical contract | Public web registration creates a standalone email/password user; verification and password reset use Laravel notifications and the explicit `users` broker. Real production mail transport is an environment prerequisite |
| `U-03` | Needs product review | Exact updated registry is above; accept or amend route paths/names; blocks route implementation from step 4 onward |
| `U-04` | Partially resolved; needs product/backend/security review | Topology is accepted: linking ends with one local `User` and one Remnawave user containing both `email` and `telegramId`, without a `service_accounts` layer. Still define bidirectional proof, canonical survivor, paid-time handling, ownership transfer and referral/promo conflicts for two existing accounts, losing-remote cleanup and whether unlink is possible; blocks linking UI/profile completion |
| `U-05` | Needs product/backend review | Remnawave remains truth and stale fallback is forbidden. Provision web-only users and store numeric `remnawave_user_id` locally instead of depending on username; define creation timing, generated non-PII username, cache/failure UX and expiring threshold; blocks registration completion and steps 8/10 |
| `U-06` | Needs product/backend review | Active `Product` is current source, but months are inferred from name in payment creation. Approve explicit period mapping and display price contract; blocks steps 6/9 |
| `U-07` | Needs product/backend review | Web return is plain pending text and no status endpoint exists. Approve polling, timeout, redirect and retry/idempotency contract; blocks step 9 |
| `U-08` | Needs product review | Only external Telegram support exists. Recommended narrow option is honest Telegram handoff unless a local ticket domain is explicitly commissioned; blocks step 12 |
| `U-09` | Needs product/backend review | Define web and Telegram invite destinations, attribution across both registration channels, deduplication and self-referral prevention for linked identities; blocks step 11 |
| `U-10` | Needs product/content review | Platform download URLs/instructions are absent; blocks landing platform destinations and step 10 |
| `U-11` | Needs product/security review | Define editable profile fields, email-change re-verification, password/session actions and placement of Telegram connection state; blocks step 13 |
| `U-12` | Needs design review | References are 360/390/768/1440, not CSS thresholds. Proposed boundaries are mobile `<768`, tablet `768–1199`, desktop `>=1200`; blocks steps 2/8/15 until accepted |
| `U-13` | Needs design/legal review | IBM Plex files/license/source absent; blocks typography foundation/auth fidelity |
| `U-14` | Needs product/frontend review | Choose default/system modes, persistence and pre-hydration bootstrap; blocks theme foundation/shell/profile |
| `U-15` | Needs product/legal review | CTA, terms/privacy/footer destinations/content absent; blocks public shell/content |
| `U-16` | Needs design review | Story order is fixed, but distance/pinning thresholds are not. Approve motion policy; blocks step 5 |
| `U-17` | Closed | PHP-CS-Fixer is the repository tool; do not reopen |
| `U-18` | Deferred; engineering owner | No frontend test/a11y/E2E toolchain. Blocks automated portion of step 15, not manual audit; dependency addition needs separate approval |
| `U-19` | Deferred; product owner | Approve public brand string (`Hey Dude` versus `dudeweb`); blocks copy/logo steps 2/4/6 |
| `U-20` | Closed; technical decision | Modal/inert/focus contract fixed above; no product behavior invented |
| `U-21` | Closed; data contract | Demo values are never fixtures; runtime values are server props or the flow remains absent |
| `U-22` | Deferred; platform owner | SSR packages/build entry exist, runtime operation unproved. Blocks SSR/hydration sign-off in steps 8/15, not CSR contract planning |
| `U-23` | Closed | Inertia server/client/Vite packages are major 3; do not reopen |
| `U-24` | Closed; architecture decision | Preserve lowercase existing directories; blocks removed for step 3 |
| `U-25` | Deferred; product/design owner | No logo source is approved and no repo asset exists; blocks steps 2/4/favicon work |
| `U-26` | Deferred; product/design owner | Decide whether Static Hero is reduced-motion only, broader fallback or breakpoint replacement, and reconcile punctuation; blocks step 5 |
| `U-27` | Deferred; product/legal/backend owner | Prefer server-derived live discount/reward values plus explicit content version, or approve a versioned legal snapshot; blocks referral terms step 11 |

### Current stop boundary

The remaining unchecked items require product/security/design decisions rather
than more repository inference: route acceptance `U-03`, two-account merge
details `U-04`, `U-05`–`U-16`,
referral terms source, payment live policy and approved logo/Static Hero source.
`U-01` and `U-02` remain closed under the corrected independent-account model.
Step 1 and its README status remain incomplete, no commit is created, and step
2 must not start.

