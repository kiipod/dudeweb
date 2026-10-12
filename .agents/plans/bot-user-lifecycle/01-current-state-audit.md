# Шаг 1 — Аудит User Lifecycle

На этом шаге production-код и schema БД не изменяются.

## User

Полностью проанализировать:

- [x] User model
- [x] migrations
- [x] relations
- [x] casts
- [x] Enum
- [x] scopes
- [x] services/actions
- [x] Telegram handlers

Особенно проверить:

- [x] `status`
- [x] `is_trial`
- [x] `trial_expired`
- [x] `is_free`
- [x] локальный tag / role, если существует
- [x] Remnawave identifiers
- [x] referral fields

Для каждого поля определить:

| Field | Reads | Writes | Purpose | Source of truth | Candidate for removal |
|---|---|---|---|---|---|

## Remnawave

Использовать актуальную Remnawave-интеграцию.

Найти:

- [x] получение User
- [x] создание User
- [x] изменение status
- [x] получение status
- [x] получение expireAt
- [x] обновление expireAt
- [x] получение device count
- [x] изменение пользователя

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

- [x] где определяется новый пользователь;
- [x] где определяется returning;
- [x] где определяется invited;
- [x] где создаётся referral relation;
- [x] где выдаётся trial;
- [x] где устанавливается status/tag.

## Self-referral

Найти текущую validation.

Проверить сценарий:

    referrer_id == current_user.id

и аналогичные способы self-referral через Telegram/deep-link.

## Promocode

Проследить:

- [x] ручной ввод promocode;
- [x] автоматический promocode;
- [x] returning promocode;
- [x] invited promocode;
- [x] проверку использования;
- [x] применение discount;
- [x] первую успешную оплату.

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

- [x] reward только за первую оплату или за каждую;
- [x] где создаётся ReferralReward;
- [x] как определяется referrer;
- [x] как определяется размер reward;
- [x] существует ли notification.

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

- [x] проверка `expireAt`;
- [x] reminder;
- [x] synchronization EXPIRED;
- [x] обработка окончания trial.

## Device limit

Найти:

- [x] поле лимита тарифа;
- [x] способ получения device count;
- [x] существующие проверки;
- [x] device management handler;
- [x] Remnawave DISABLED logic.

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

- [x] Все User state fields проанализированы
- [x] Remnawave flow проанализирован
- [x] Registration проанализирован
- [x] Returning flow проанализирован
- [x] Referral flow проанализирован
- [x] Promocode flow проанализирован
- [x] Expiration flow проанализирован
- [x] Device flow проанализирован
- [x] `docs/audit/bot-user-lifecycle.md` создан
- [x] Production-код не изменён
- [x] Schema не изменена

## Commit

`docs: audit bot user lifecycle`
