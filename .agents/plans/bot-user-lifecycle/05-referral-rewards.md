# Шаг 5 — Referral Rewards

## Цель

Проверить и исправить referral reward flow.

При каждой успешной оплате приглашённого пользователя referrer должен
получить предусмотренное реферальной программой вознаграждение.

## Source

Использовать существующую referral program.

Не придумывать:

- размер reward;
- тип reward;
- период reward;
- ограничения программы.

## Payment succeeded

При:

`payment.succeeded`

проверить наличие referrer.

Если referrer существует:

- [x] определить reward согласно программе;
- [x] начислить reward;
- [x] связать reward с конкретным Payment;
- [x] сохранить связь с referred User;
- [x] сохранить связь с referrer.

## Каждая оплата

Проверить:

    payment #1 → reward #1
    payment #2 → reward #2
    payment #3 → reward #3

Если это соответствует существующей модели ReferralReward.

Не ограничивать начисление первой оплатой.

Удалить старую first-payment-only проверку, если она существует и
противоречит новому требованию.

## Идемпотентность

Повторный webhook одного Payment:

    payment #1
      webhook #1 → reward
      webhook #2 → no new reward

- [x] Один Payment создаёт максимум одно предусмотренное reward
- [x] Другой успешный Payment того же referred User может создать новое reward

Желательно обеспечить связь/idempotency на уровне данных, если существующая
архитектура это позволяет.

## Notification

После успешного начисления отправить referrer сообщение.

Смысл сообщения:

> Ваш друг оплатил подписку. Вам начислено вознаграждение согласно
> реферальной программе.

Использовать фактические данные reward, если существующий UX их показывает.

- [x] Notification отправляется referrer
- [x] Не отправляется referred User вместо referrer
- [x] Отправляется после успешного начисления
- [x] Повторный webhook не дублирует сообщение

## Failed / canceled

- [x] pending не создаёт reward
- [x] canceled не создаёт reward
- [x] failed flow не создаёт reward

## Tests

- [x] первая оплата → reward
- [x] вторая оплата → новое reward
- [x] третья оплата → новое reward
- [x] duplicate webhook → без duplicate reward
- [x] canceled → без reward
- [x] self-referral → без reward
- [x] notification отправляется referrer

## Commit

`fix: reward referrer on each successful payment`
