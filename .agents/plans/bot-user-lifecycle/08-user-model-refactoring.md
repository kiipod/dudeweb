# Шаг 8 — Аудит и рефакторинг User Model

## Цель

После внедрения UserStateManager проверить необходимость локальных полей
состояния User.

## Поля-кандидаты

Особенно проверить:

- `is_trial`
- `trial_expired`
- `is_free`
- `status`

Не считать их автоматически лишними.

## Анализ каждого поля

Для каждого выполнить поиск:

- [x] reads
- [x] writes
- [x] queries
- [x] scopes
- [x] casts
- [x] tests
- [x] Telegram handlers
- [x] Services
- [x] Jobs
- [x] migrations

Классифицировать:

- `REQUIRED`
- `DERIVED`
- `DUPLICATED`
- `LEGACY`
- `UNUSED`
- `UNKNOWN`

## is_trial

Проверить, можно ли состояние однозначно определить через:

- local tag;
- Remnawave;
- Subscription.

Если да и поле не имеет самостоятельной функции — кандидат на удаление.

## trial_expired

Проверить, не дублирует ли оно:

    Remnawave EXPIRED
         +
    local INACTIVE

Если поле используется для исторического факта "trial был использован",
это отдельная семантика и его нельзя удалять только потому, что текущая
подписка EXPIRED.

Итог: `LEGACY`. Поле больше не читается и не изменяется runtime-flow.
Актуальный срок берётся из Remnawave `expireAt`, а состояние применения бонуса
хранится в `referral_rewards`. Колонка временно сохранена только для read-only
аудита исторических значений перед решением о backfill/removal.

## is_free

Определить фактическое назначение.

Проверить связь с:

- FAMILY;
- FRIENDS;
- бесплатной подпиской;
- бессрочной подпиской.

Не заменять автоматически на tag без анализа.

Итог повторного аудита: `UNUSED`. Подтверждённой связи с `FAMILY`, `FRIENDS`
или бессрочной подпиской нет; model, MoonShine и другие runtime references
удалены. Колонка удаляется отдельной обратимой миграцией.

## status

Проверить:

- что именно хранит `users.status`;
- дублирует ли он Remnawave status;
- используется ли для локального lifecycle;
- отличается ли от tag;
- нужен ли для offline/cache сценариев;
- используется ли в SQL queries.

Если это просто копия Remnawave status без самостоятельной роли —
рассмотреть удаление.

Если локальный status необходим как cache/read model — оставить и явно
зафиксировать его назначение и правила синхронизации.

## Migration

Удалять поле только если:

- [x] назначение понятно;
- [x] references отсутствуют или мигрированы;
- [x] данные не нужны исторически;
- [x] replacement определён;
- [x] tests обновлены;
- [x] rollback продуман.

## Документация

Обновить:

`docs/audit/bot-user-lifecycle.md`

таблицей:

| Field | Classification | Replacement | Action | Reason |
|---|---|---|---|---|

## Проверка

- [x] Все поля классифицированы
- [x] `is_trial` проверен
- [x] `trial_expired` проверен
- [x] `is_free` проверен
- [x] `status` проверен
- [x] `is_free` переклассифицирован в `UNUSED` и удалён после миграции references
- [x] Историческая семантика учтена
- [x] Удалены только доказанно лишние поля
- [x] Tests проходят

## Commit

Если schema изменилась:

`refactor: simplify user state model`

Если нет:

`docs: audit user state model`
