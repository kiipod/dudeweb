# Шаг 12 — Поддержка

## Цель задачи

Реализовать утверждённый persisted support flow, визуально соответствующий
списку, созданию обращения и conversation в Pen, включая операторскую работу
через MoonShine.

## Зависимости

- Завершён шаг 11.
- Обязательно решён `U-08`.
- Pen screens `R`, `R2`, `R3` в mobile/tablet/desktop, dark/light.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — support
  UI, form/conversation component map, data flow и visual states.
- `laravel-best-practices` — domain boundary, migrations, policies,
  FormRequests, deterministic queries, errors и security tests.
- `laravel-13-attribute-refactor` — условно для approved Model/Controller/
  FormRequest/Factory/Testing configuration после installed-source check.

## Конкретные действия

- [ ] Реализовать утверждённые `SupportTicket`/`SupportMessage` models и native
  enum statuses `OPEN`/`CLOSED`; ticket belongs to customer, message has exactly
  one customer/operator author.
- [ ] Зафиксировать DB/application invariant для двух nullable author foreign
  keys без хранения raw polymorphic class names.
- [ ] Добавить только новые обратимые migrations с foreign keys/indexes.
- [ ] Проектировать indexes из реальных ownership/order queries, проверять
  существующие FK indexes и не добавлять дублирующие индексы механически.
- [ ] Добавить policies и FormRequests для create/reply actions.
- [ ] Держать controllers тонкими, conversation operations — в service/action.
- [ ] Создавать ticket и первое customer message атомарно; запретить customer
  reply в закрытый ticket.
- [ ] Добавить MoonShine resources/actions для operator reply, close и reopen,
  используя те же domain services/status transitions.
- [ ] Реализовать Inertia list, create form и conversation pages.
- [ ] Использовать `useForm()` с processing/errors/recent success.
- [ ] Реализовать empty, loading, validation, service error, open/closed states.
- [ ] Не поддерживать attachments, realtime, unread counters и outbound
  notifications: они не входят в утверждённый create/read/reply/close/reopen
  contract.
- [ ] Добавить ownership/security tests: нельзя читать/отвечать в чужом ticket.

## Критерии готовности

- UI отражает реально выбранный support contract.
- Нет fake ticket history или локального optimistic message без persistence.
- Validation, authorization и ordering покрыты tests.
- Customer conversation и MoonShine operator actions доступны с клавиатуры.
- Pen responsive layout воспроизведён только для функционально существующих
  экранов.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Support
./vendor/bin/sail artisan migrate:status
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Models app/Policies app/Services database/migrations tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- Empty list и populated list с deterministic newest-first ordering.
- Create validation, success, duplicate submit и backend failure.
- Conversation open/closed, reply success/failure.
- Попытка доступа к чужому ticket.
- Operator reply, close/reopen и customer reply prohibition after close.
- Long subject/message, keyboard focus и screen reader labels.

