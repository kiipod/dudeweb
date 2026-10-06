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

- [ ] определить reward согласно программе;
- [ ] начислить reward;
- [ ] связать reward с конкретным Payment;
- [ ] сохранить связь с referred User;
- [ ] сохранить связь с referrer.

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

- [ ] Один Payment создаёт максимум одно предусмотренное reward
- [ ] Другой успешный Payment того же referred User может создать новое reward

Желательно обеспечить связь/idempotency на уровне данных, если существующая
архитектура это позволяет.

## Notification

После успешного начисления отправить referrer сообщение.

Смысл сообщения:

> Ваш друг оплатил подписку. Вам начислено вознаграждение согласно
> реферальной программе.

Использовать фактические данные reward, если существующий UX их показывает.

- [ ] Notification отправляется referrer
- [ ] Не отправляется referred User вместо referrer
- [ ] Отправляется после успешного начисления
- [ ] Повторный webhook не дублирует сообщение

## Failed / canceled

- [ ] pending не создаёт reward
- [ ] canceled не создаёт reward
- [ ] failed flow не создаёт reward

## Tests

- [ ] первая оплата → reward
- [ ] вторая оплата → новое reward
- [ ] третья оплата → новое reward
- [ ] duplicate webhook → без duplicate reward
- [ ] canceled → без reward
- [ ] self-referral → без reward
- [ ] notification отправляется referrer

## Commit

`fix: reward referrer on each successful payment`
