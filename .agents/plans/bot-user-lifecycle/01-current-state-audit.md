# Шаг 1 — Аудит User Lifecycle

На этом шаге production-код и schema БД не изменяются.

## User

Полностью проанализировать:

- [ ] User model
- [ ] migrations
- [ ] relations
- [ ] casts
- [ ] Enum
- [ ] scopes
- [ ] services/actions
- [ ] Telegram handlers

Особенно проверить:

- [ ] `status`
- [ ] `is_trial`
- [ ] `trial_expired`
- [ ] `is_free`
- [ ] локальный tag / role, если существует
- [ ] Remnawave identifiers
- [ ] referral fields

Для каждого поля определить:

| Field | Reads | Writes | Purpose | Source of truth | Candidate for removal |
|---|---|---|---|---|---|

## Remnawave

Использовать актуальную Remnawave-интеграцию.

Найти:

- [ ] получение User
- [ ] создание User
- [ ] изменение status
- [ ] получение status
- [ ] получение expireAt
- [ ] обновление expireAt
- [ ] получение device count
- [ ] изменение пользователя

Проверить актуальные DTO/Handler после migration Remnawave API.

## Registration

Проследить полный flow:

    /start
      ↓
    referral parsing
      ↓
    local User
      ↓
    Remnawave User
      ↓
    trial
      ↓
    Telegram

Определить:

- [ ] где определяется новый пользователь;
- [ ] где определяется returning;
- [ ] где определяется invited;
- [ ] где создаётся referral relation;
- [ ] где выдаётся trial;
- [ ] где устанавливается status/tag.

## Self-referral

Найти текущую validation.

Проверить сценарий:

    referrer_id == current_user.id

и аналогичные способы self-referral через Telegram/deep-link.

## Promocode

Проследить:

- [ ] ручной ввод promocode;
- [ ] автоматический promocode;
- [ ] returning promocode;
- [ ] invited promocode;
- [ ] проверку использования;
- [ ] применение discount;
- [ ] первую успешную оплату.

Определить, возможно ли сейчас суммирование скидок.

## Referral

Проследить:

    invite
      ↓
    registration
      ↓
    referral relation
      ↓
    referred payment
      ↓
    reward

Определить:

- [ ] reward только за первую оплату или за каждую;
- [ ] где создаётся ReferralReward;
- [ ] как определяется referrer;
- [ ] как определяется размер reward;
- [ ] существует ли notification.

Сравнить с требованием:

**вознаграждение начисляется при каждой успешной оплате приглашённого
пользователя.**

## Subscription expiration

Найти существующие:

- scheduled jobs;
- commands;
- queues;
- cron;
- notifications.

Определить, есть ли уже:

- [ ] проверка `expireAt`;
- [ ] reminder;
- [ ] synchronization EXPIRED;
- [ ] обработка окончания trial.

## Device limit

Найти:

- [ ] поле лимита тарифа;
- [ ] способ получения device count;
- [ ] существующие проверки;
- [ ] device management handler;
- [ ] Remnawave DISABLED logic.

## Документация

Создать:

`docs/audit/bot-user-lifecycle.md`

Описать:

- Current User State
- Registration Flow
- Trial Flow
- Returning User Flow
- Referral Flow
- Promocode Flow
- Subscription Expiration Flow
- Device Limit Flow
- User Columns
- Problems / Refactoring Candidates

## Проверка

- [ ] Все User state fields проанализированы
- [ ] Remnawave flow проанализирован
- [ ] Registration проанализирован
- [ ] Returning flow проанализирован
- [ ] Referral flow проанализирован
- [ ] Promocode flow проанализирован
- [ ] Expiration flow проанализирован
- [ ] Device flow проанализирован
- [ ] `docs/audit/bot-user-lifecycle.md` создан
- [ ] Production-код не изменён
- [ ] Schema не изменена

## Commit

`docs: audit bot user lifecycle`
