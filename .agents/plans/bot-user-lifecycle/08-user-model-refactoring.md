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

- [ ] reads
- [ ] writes
- [ ] queries
- [ ] scopes
- [ ] casts
- [ ] tests
- [ ] Telegram handlers
- [ ] Services
- [ ] Jobs
- [ ] migrations

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

## is_free

Определить фактическое назначение.

Проверить связь с:

- FAMILY;
- FRIENDS;
- бесплатной подпиской;
- бессрочной подпиской.

Не заменять автоматически на tag без анализа.

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

- [ ] назначение понятно;
- [ ] references отсутствуют или мигрированы;
- [ ] данные не нужны исторически;
- [ ] replacement определён;
- [ ] tests обновлены;
- [ ] rollback продуман.

## Документация

Обновить:

`docs/audit/bot-user-lifecycle.md`

таблицей:

| Field | Classification | Replacement | Action | Reason |
|---|---|---|---|---|

## Проверка

- [ ] Все поля классифицированы
- [ ] `is_trial` проверен
- [ ] `trial_expired` проверен
- [ ] `is_free` проверен
- [ ] `status` проверен
- [ ] UNKNOWN поля не удалены
- [ ] Историческая семантика учтена
- [ ] Удалены только доказанно лишние поля
- [ ] Tests проходят

## Commit

Если schema изменилась:

`refactor: simplify user state model`

Если нет:

`docs: audit user state model`
