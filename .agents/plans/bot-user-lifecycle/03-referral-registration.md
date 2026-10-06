# Шаг 3 — Referral Registration и Returning Users

## Self-referral

Пользователь не может пригласить самого себя.

Проверять self-referral до создания referral relation.

- [ ] Сравнить current User и referrer
- [ ] Не создавать relation при совпадении
- [ ] Не выдавать referral benefits
- [ ] Не выдавать invited promocode
- [ ] Не создавать ReferralReward

Проверить обходные сценарии через повторный `/start` и deep-link.

## Existing referral

Проверить, может ли пользователь изменить referrer после регистрации.

Использовать существующее бизнес-правило проекта.

Не позволять смену referrer случайно через повторный `/start`.

## Returning user

Источником status является Remnawave.

Пользователь **не может считаться returning**, если его Remnawave status:

- `ACTIVE`
- `LIMITED`
- `DISABLED`

- [ ] Проверить ACTIVE
- [ ] Проверить LIMITED
- [ ] Проверить DISABLED

Определить допустимые returning statuses на основании API и существующей
бизнес-логики.

Не считать неизвестный status автоматически returning.

## Invited vs Returning

Проверить конфликт:

    invited + returning

Определить существующий бизнес-приоритет.

Не выдавать несколько автоматических скидок.

## Tests

- [ ] self-referral запрещён
- [ ] повторный self-referral запрещён
- [ ] self-referral не выдаёт скидку
- [ ] ACTIVE не returning
- [ ] LIMITED не returning
- [ ] DISABLED не returning
- [ ] допустимый пользователь определяется как returning
- [ ] referrer не меняется неожиданно

## Commit

`fix: validate referral and returning users`
