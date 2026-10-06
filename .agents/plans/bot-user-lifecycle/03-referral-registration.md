# Шаг 3 — Referral Registration и Returning Users

## Self-referral

Пользователь не может пригласить самого себя.

Проверять self-referral до создания referral relation.
Сравнение выполняется по Telegram chat ID при разборе deep-link.

- [x] Сравнить current User и referrer
- [x] Не создавать relation при совпадении
- [x] Не выдавать referral benefits
- [x] Не выдавать invited promocode
- [x] Не создавать ReferralReward

Проверить обходные сценарии через повторный `/start` и deep-link.

## Existing referral

Проверить, может ли пользователь изменить referrer после регистрации.

Использовать существующее бизнес-правило проекта.

Не позволять смену referrer случайно через повторный `/start`.
Существующее правило сохранено: `referrer_user_id` задаётся только
при первичном создании User.

## Returning user

Источником status является Remnawave.

Пользователь **не может считаться returning**, если его Remnawave status:

- `ACTIVE`
- `LIMITED`
- `DISABLED`

- [x] Проверить ACTIVE
- [x] Проверить LIMITED
- [x] Проверить DISABLED

Определить допустимые returning statuses на основании API и существующей
бизнес-логики.

Допустимый status: `EXPIRED`. Дополнительно требуются local
`INACTIVE` и отсутствие ранее показанного welcome-back.

Не считать неизвестный status автоматически returning.

## Invited vs Returning

Проверить конфликт:

    invited + returning

Определить существующий бизнес-приоритет.

Не выдавать несколько автоматических скидок.
Новый invited User получает referral relation при регистрации;
существующий User не может стать invited повторно. Invited и
returning eligibility используют один идемпотентно создаваемый
пользовательский промокод.

## Tests

- [x] self-referral запрещён
- [x] повторный self-referral запрещён
- [x] self-referral не выдаёт скидку
- [x] ACTIVE не returning
- [x] LIMITED не returning
- [x] DISABLED не returning
- [x] допустимый пользователь определяется как returning
- [x] referrer не меняется неожиданно

## Commit

`fix: validate referral and returning users`
