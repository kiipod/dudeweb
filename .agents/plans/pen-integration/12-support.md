# Шаг 12 — Поддержка

## Цель задачи

Реализовать утверждённый support flow, визуально соответствующий списку,
созданию обращения и conversation в Pen, не создавая ticket domain без решения
`U-08`.

## Зависимости

- Завершён шаг 11.
- Обязательно решён `U-08`.
- Pen screens `R`, `R2`, `R3` в mobile/tablet/desktop, dark/light.

Если выбран внешний Telegram support flow, этот шаг реализует только честный
handoff и не имитирует локальные tickets/conversation.

## Конкретные действия

- [ ] Зафиксировать режим: local ticket domain или external Telegram handoff.
- [ ] Для local режима определить Ticket/Message lifecycle, ownership,
  statuses, ordering, retention и notification channel до миграций.
- [ ] Добавить только новые обратимые migrations с foreign keys/indexes.
- [ ] Добавить policies и FormRequests для create/reply actions.
- [ ] Держать controllers тонкими, conversation operations — в service/action.
- [ ] Реализовать Inertia list, create form и conversation pages.
- [ ] Использовать `useForm()` с processing/errors/recent success.
- [ ] Реализовать empty, loading, validation, service error, open/closed states.
- [ ] Не поддерживать attachments, realtime или unread counters, если они не
  утверждены отдельным контрактом.
- [ ] Для external режима использовать существующий configured URL и
  объяснить переход пользователю.
- [ ] Добавить ownership/security tests: нельзя читать/отвечать в чужом ticket.

## Критерии готовности

- UI отражает реально выбранный support contract.
- Нет fake ticket history или локального optimistic message без persistence.
- Validation, authorization и ordering покрыты tests.
- External handoff либо local conversation доступны с клавиатуры.
- Pen responsive layout воспроизведён только для функционально существующих
  экранов.

## Команды проверки

```bash
docker compose exec -T laravel.test php artisan test --filter=Support
docker compose exec -T laravel.test php artisan migrate:status
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Models app/Policies app/Services database/migrations tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- Empty list и populated list с deterministic newest-first ordering.
- Create validation, success, duplicate submit и backend failure.
- Conversation open/closed, reply success/failure.
- Попытка доступа к чужому ticket.
- External Telegram unavailable/misconfigured.
- Long subject/message, keyboard focus и screen reader labels.

