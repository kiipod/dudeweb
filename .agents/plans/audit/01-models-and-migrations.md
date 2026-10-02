# Шаг 1 — Audit: Models & Migrations

## Задачи

- [ ] Открыть `app/Models/` и составить полный список файлов
- [ ] Найти миграции для исследуемых моделей
- [ ] Описать модель `User`: поля из миграции, трейты, отношения
- [ ] Описать модель `ChatMessage`: поля, связь с User
- [ ] Описать модель `Plan`: поля, отношения с Product / PlanAdvantage
- [ ] Описать модель `Product`: поля, периоды, цены
- [ ] Описать модели `PlanAdvantage` и `Advantage`: поля, связи
- [ ] Описать модель `Payment`: статусы, суммы, провайдер, связь с User / Subscription
- [ ] Описать модель `Promocode`: тип (`percent` / `fixed`), ограничения
- [ ] Описать модель `UserPromocode`: связь с User / Promocode, дата использования
- [ ] Описать модель `Referral`: поля, связь пригласивший → приглашённый
- [ ] Описать модель `ReferralBonuses`: поля, связь с Referral, ReferralReward
- [ ] Описать модель `ReferralReward`: поля, тип бонуса, статус начисления
- [ ] Описать модель `TelegramBot`: поля, кастомная реализация Laravel Telegraph сущности
- [ ] Зафиксировать используемые Enum и статусы
- [ ] Создать файл `docs/audit/models.md` с результатами

## Проверка

- [ ] Файл `docs/audit/models.md` создан
- [ ] Все модели из `app/Models/` описаны
- [ ] Для каждой модели указаны поля
- [ ] Для каждой модели указаны отношения
- [ ] Указаны используемые Enum
- [ ] Указаны статусы `Payment`
- [ ] Указаны статусы `Subscription`
- [ ] Production-код не изменён

## Commit

`docs: audit models and migrations`
