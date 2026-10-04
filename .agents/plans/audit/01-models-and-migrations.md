# Шаг 1 — Audit: Models & Migrations

## Задачи

- [x] Открыть `app/Models/` и составить полный список файлов
- [x] Найти миграции для исследуемых моделей
- [x] Описать модель `User`: поля из миграции, трейты, отношения
- [x] Описать модель `ChatMessage`: поля, связь с User
- [x] Описать модель `Plan`: поля, отношения с Product / PlanAdvantage
- [x] Описать модель `Product`: поля, периоды, цены
- [x] Описать модели `PlanAdvantage` и `Advantage`: поля, связи
- [x] Описать модель `Payment`: статусы, суммы, провайдер, связь с User / Subscription
- [x] Описать модель `Promocode`: тип (`percent` / `fixed`), ограничения
- [x] Описать модель `UserPromocode`: связь с User / Promocode, дата использования
- [x] Описать модель `Referral`: поля, связь пригласивший → приглашённый
- [x] Описать модель `ReferralBonuses`: поля, связь с Referral, ReferralReward
- [x] Описать модель `ReferralReward`: поля, тип бонуса, статус начисления
- [x] Описать модель `TelegramBot`: поля, кастомная реализация Laravel Telegraph сущности
- [x] Зафиксировать используемые Enum и статусы
- [x] Создать файл `docs/audit/models.md` с результатами

## Проверка

- [x] Файл `docs/audit/models.md` создан
- [x] Все модели из `app/Models/` описаны
- [x] Для каждой модели указаны поля
- [x] Для каждой модели указаны отношения
- [x] Указаны используемые Enum
- [x] Указаны статусы `Payment`
- [x] Production-код не изменён

## Commit

`docs: audit models and migrations`
