# Audit: models and migrations

## Scope and sources

The audit covers every PHP file in `app/Models/` and the matching migrations in
`database/migrations/`. The descriptions below reflect the current code and schema; they do not
assume entities or fields mentioned in the plan exist.

`app/Models/` contains 12 models:

- `Advantage`
- `ChatMessage`
- `Payment`
- `Plan`
- `PlanAdvantage`
- `Product`
- `Promocode`
- `ReferralBonuses`
- `ReferralReward`
- `TelegramBot`
- `User`
- `UserPromocode`

There are no `Referral` or `Subscription` Eloquent models. A referral is represented by the
self-referencing `users.referrer_user_id` foreign key. Subscription data is read from Remnawave
DTOs and is not persisted in a local `subscriptions` table.

All project models declare strict types. Every model except `User` and `TelegramBot` extends
Eloquent `Model`; `User` extends Laravel's `Authenticatable`, and `TelegramBot` extends the
Laravel Telegraph package model.

## Models

### `User`

Schema sources:

- `0001_01_01_000000_create_users_table.php`
- `2025_11_26_165453_add_column_referrer_user_id_in_users_table.php`

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `first_name` | varchar | nullable |
| `last_name` | varchar | nullable |
| `username` | varchar | required |
| `chat_id` | integer | required, unique |
| `is_trial` | boolean | default `true` |
| `trial_expired` | datetime | nullable |
| `is_premium` | boolean | default `false` |
| `is_free` | boolean | default `false` |
| `referrer_user_id` | unsigned bigint | nullable, foreign key to `users.id` |
| `status` | enum | `new`, `active`, `trial`, `inactive`; no database default |
| `welcome_back_shown_at` | timestamp | nullable |
| `state` | varchar | nullable |
| `state_payload` | json | nullable |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

The model uses the `Notifiable` trait. Casts are `chat_id` to integer, the three `is_*` fields to
boolean, `trial_expired` to datetime, `state_payload` to array, and `status` to
`App\Bot\Telegram\Enums\UserStatus`.

Relations:

- `referrer()` — `belongsTo(User::class, 'referrer_user_id')`;
- `referrals()` — `hasMany(User::class, 'referrer_user_id')`;
- `payments()` — `hasMany(Payment::class)` through `payments.user_id`;
- `receivedReferralRewards()` — `hasMany(ReferralReward::class, 'referrer_user_id')`;
- `referralRewardsFromFriends()` — `hasMany(ReferralReward::class, 'referred_user_id')`;
- `notifications()` — inherited from `Notifiable`, backed by the `notifications` table.

Observed mismatch: the database enum uses lowercase values, while `UserStatus` is a backed enum
with uppercase values (`NEW`, `TRIAL`, `ACTIVE`, `INACTIVE`). The MoonShine user-status enum uses
lowercase values. This audit records the discrepancy without changing it.

### `ChatMessage`

Schema source: `2025_12_18_123742_create_chat_messages_table.php`.

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `type` | enum | `welcome`, `welcome_back`, `welcome_ref`, `help`, `partners`, `profile`, `message`, `plans`; default `message` |
| `text` | text | required |
| `placeholders` | json | nullable |
| `status` | enum | `active`, `inactive`, `draft`, `planned`; default `active` |
| `sent_at` | datetime | nullable |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

`placeholders` is cast to array and `sent_at` to datetime. The model defines status scopes
`active`, `inactive`, `draft`, and `planned`, plus type scopes `welcome`, `welcomeBack`,
`welcomeRef`, `help`, `partners`, `profile`, and `message`. There is no `plans` scope even though
`plans` is a permitted type. The model has no relation to `User`; the schema has no `user_id`.

### `Plan`

Schema source: `2025_11_12_181847_create_plans_table.php`.

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `name` | varchar | required |
| `short_name` | varchar | nullable |
| `code` | varchar | required, not unique |
| `description` | text | required |
| `status` | enum | `active`, `inactive`, `draft`; default `active` |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

Relations:

- `products()` — `hasMany(Product::class)`;
- `advantages()` — `belongsToMany(Advantage::class)` through `plan_advantages`.

The `active`, `inactive`, and `draft` scopes filter the respective string status. `status` exists
in the schema and scopes but is omitted from `$fillable`; `DatabaseSeeder` nevertheless passes it
to `Plan::create()`, so that supplied value is discarded and the database default applies.

### `Product`

Schema source: `2025_11_12_181922_create_products_table.php`.

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `plan_id` | bigint | foreign key to `plans.id` |
| `name` | varchar | required |
| `price` | bigint | required; stored in minor currency units by current callers |
| `status` | enum | `active`, `inactive`, `draft`; default `active` |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

`price` is cast to integer. `plan()` is a `belongsTo(Plan::class)` relation. The same three status
scopes as `Plan` are present.

There is no dedicated duration/period field. The seeded period is encoded in `name`: `1 месяц`,
`3 месяца`, `6 месяцев`, and `12 месяцев`. Seed prices are respectively `20000`, `60000`,
`100000`, and `200000`; bot and message code divide them by 100 for display in rubles.

### `PlanAdvantage`

Schema source: `2025_12_18_150756_create_plan_advantages_table.php`.

Fields are `id`, `plan_id` (foreign key to `plans.id`), `advantage_id` (foreign key to
`advantages.id`), and Laravel timestamps. Relations are `plan()` as `belongsTo(Plan::class)` and
`advantage()` as `belongsTo(Advantage::class)`. The table has no composite unique constraint, so
duplicate plan/advantage pairs are possible.

### `Advantage`

Schema source: `2025_12_18_103300_create_advantages_table.php`.

Fields are `id`, required string `title`, and Laravel timestamps. `plans()` is a
`belongsToMany(Plan::class)` relation through `plan_advantages`.

### `Payment`

Schema source: `2025_11_12_184358_create_payments_table.php`.

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `user_id` | bigint | foreign key to `users.id` |
| `confirmation_url` | varchar | nullable |
| `status` | varchar | nullable; no enum, validation, or default |
| `amount` | bigint | required |
| `currency` | varchar(3) | required |
| `description` | varchar | nullable |
| `metadata` | json | nullable |
| `recipient_account_id` | unsigned integer | nullable |
| `recipient_gateway_id` | unsigned integer | nullable |
| `refundable` | boolean | required, no default |
| `test` | boolean | required, no default |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

`amount` is cast to integer, `metadata` to array, and `refundable`/`test` to boolean. Relations:

- `user()` — `belongsTo(User::class)`;
- `referralRewards()` — `hasMany(ReferralReward::class)`.

There is no `provider` column or provider enum. The closest provider-related fields are nullable
numeric `recipient_account_id` and `recipient_gateway_id`. There is no `subscription_id`, local
`Subscription` model, or Payment-to-Subscription relation.

Payment statuses are not defined anywhere as an enum or fixed list. The schema accepts any
nullable string, the model does not cast it, and MoonShine renders it as a free-form text field.
No production code currently creates or updates a `Payment`, so no de facto status vocabulary is
present in this repository.

### `Promocode`

Schema source: `2025_12_15_092814_create_promocodes_table.php`.

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `user_id` | bigint | nullable foreign key to `users.id` |
| `title` | varchar | required; no unique constraint |
| `type` | enum | `fixed` or `percent` |
| `discount_value` | integer | required |
| `count` | integer | nullable |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

Relations are `user()` as the optional owning/assigned user and `userPromocodes()` as all usage
records. In current service code, `percent` subtracts a percentage and `fixed` subtracts the raw
stored amount, clamped to zero. The schema places no numeric bounds on `discount_value` or
`count`, has no active/expiry fields, and does not explain whether `count = null` is unlimited.

### `UserPromocode`

Schema source: `2025_12_15_100431_create_user_promocodes_table.php`.

Fields are `id`, `user_id`, `promocode_id`, and Laravel timestamps. `user_id` and `promocode_id`
are each independently unique foreign keys. Consequently a user can have at most one usage row,
and a promocode can be associated with at most one user, rather than uniqueness being enforced on
the pair.

Relations are `user()` as `belongsTo(User::class)` and `promocode()` as
`belongsTo(Promocode::class)`. There is no explicit `used_at`; `created_at` is the only available
usage timestamp.

### Referral representation (`Referral` is absent)

The requested `Referral` model/table does not exist. The inviter-to-invitee link is stored directly
on `users.referrer_user_id` and exposed through `User::referrer()` and `User::referrals()`. The
foreign key is added by a separate migration and has no explicit delete/update action.

### `ReferralBonuses`

Schema source: `2026_04_23_165737_create_referral_bonuses_table.php`.

Fields are `id`, unsigned tiny integer `paid_months`, unsigned small integer `bonus_days`, and
Laravel timestamps. The plural model name maps conventionally to `referral_bonuses`. It is a
lookup table mapping a number of paid months to reward days. The model defines no relations to
`ReferralReward`, `User`, `Payment`, or the absent `Referral` model. There are also no uniqueness
constraints.

### `ReferralReward`

Schema source: `2025_11_26_144603_create_referral_rewards_table.php`.

Fields:

| Field | Database type | Null/default/constraint |
| --- | --- | --- |
| `id` | bigint | primary key |
| `referrer_user_id` | bigint | foreign key to `users.id` |
| `referred_user_id` | bigint | foreign key to `users.id` |
| `payment_id` | bigint | foreign key to `payments.id` |
| `days_added` | integer | required |
| `created_at`, `updated_at` | timestamp | nullable Laravel timestamps |

Relations:

- `user()` — `belongsTo(User::class)` without an explicit foreign key. Eloquent therefore looks
  for `user_id`, which the table does not have; the intended referrer link is not correctly
  expressed by this method;
- `referredUser()` — `belongsTo(User::class, 'referred_user_id')`;
- `payment()` — `belongsTo(Payment::class)`.

The model/table has neither a bonus type nor an accrual status. The only reward value is
`days_added`; presence of the row is the only persisted indication that the reward was created.
There is no unique constraint on `payment_id`, although `ReferralService` checks for an existing
row before creating one.

### `TelegramBot`

Schema source: `2025_11_12_135544_create_telegraph_bots_table.php`. The related Telegraph chat
schema is in `2025_11_12_135545_create_telegraph_chats_table.php`.

Fields are `id`, unique required `token`, nullable `name`, and Laravel timestamps. The class is a
custom subclass of `DefStudio\Telegraph\Models\TelegraphBot`, explicitly uses the
`telegraph_bots` table, and makes `token` and `name` fillable. It inherits the package's `chats`
relation to `DefStudio\Telegraph\Models\TelegraphChat`; there is no project-local chat model.

`registerBotCommands()` registers `/profile`, `/plans`, `/partners`, and `/help` with Telegraph
and immediately sends the registration request.

## Enums and status vocabularies used by models

There is no top-level `app/Enums/` directory. Relevant native enums are split between
`app/Bot/Telegram/Enums/` and `app/MoonShine/Enums/`:

| Enum | Values | Model/schema connection |
| --- | --- | --- |
| `UserStatus` | `NEW`, `TRIAL`, `ACTIVE`, `INACTIVE` | Cast of `User.status`; values conflict in case with the lowercase database enum |
| `ChatMessageType` | `welcome`, `welcome_back`, `welcome_ref`, `help`, `partners`, `profile`, `message`, `plans` | Matches `chat_messages.type`; not configured as a model cast |
| `OnboardingScenario` | unbacked `Welcome`, `WelcomeBack`, `MainMenu` | Controls onboarding flow, not persisted by a model |
| `StatusEnum` | `active`, `inactive`, `draft` | MoonShine display/edit enum for `Plan.status` and `Product.status` |
| `MessageStatusEnum` | `active`, `inactive`, `draft`, `planned` | MoonShine display/edit enum for `ChatMessage.status` |
| `ChatTypeEnum` | same eight lowercase chat types | MoonShine display/edit enum for `ChatMessage.type` |
| `PromocodeTypeEnum` | `fixed`, `percent` | MoonShine display/edit enum matching `promocodes.type` |
| `UserStatusEnum` | `new`, `trial`, `active`, `inactive` | MoonShine display/edit enum matching the database values for `users.status` |

Additional string statuses without native enums:

- `Plan.status` and `Product.status`: `active`, `inactive`, `draft`;
- `ChatMessage.status`: `active`, `inactive`, `draft`, `planned`;
- `Payment.status`: nullable arbitrary string; no defined statuses;
- Remnawave subscription/user statuses are external DTO string values and are documented in the
  API audit rather than as local Eloquent statuses.

## Migration-level observations relevant to later payment integration

- No local subscription table exists, so a successful payment cannot be linked to a persisted
  subscription through the current schema.
- `payments` has no external payment identifier, product/plan reference, duration/month count,
  idempotency key, provider discriminator, paid/completed timestamp, or unique constraint.
- `ReferralService` reads `$payment->months`, but neither the migration nor the model defines a
  `months` field.
- Foreign keys generally have no explicit delete behavior, except Telegraph chats cascading when
  a bot is deleted.
- All migrations have implemented `down()` methods.
