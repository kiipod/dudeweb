# Шаг 12 — Поддержка

## Цель задачи

Реализовать утверждённый persisted support flow, визуально соответствующий
списку, созданию обращения и conversation в Pen, включая операторскую работу
через MoonShine.

## Продолжение — 2026-10-20

Шаг 11 закрыт в `c093eb8`, checkout чистый, ветка `pen-integration`.
`U-08` закрыт: persisted customer tickets/messages и MoonShine operator
reply/close/reopen; attachments/realtime/unread/notifications не входят в scope.
Выбраны `php-per-cs3`, `laravel-best-practices`, `laravel-13-attribute-refactor`,
`frontend-design`, `vue-best-practices`, `tailwind-best-practices`.

Pen read-only: перечитаны R/R2/R3 и theme/viewport variants до 2560.

| Роль | 390 | 768 | 1440 | 2560 |
| --- | --- | --- | --- | --- |
| Content width | viewport − 40 | 640 | 900 | 1120 |
| R/R2 top / gap | 18 / 14 | 28 / 14 | 32 / 14 | 32 / 14 |
| R3 top / gap | 14 / 12 | 28 / 12 | 32 / 12 | 32 / 12 |
| Message bubble width | 90% | 85% | 76% | 76% |
| Bubble padding / gap | 16 / 8 | 16 / 8 | 20 / 8 | 24 / 8 |
| Message textarea min height | 170 | 170 | 170 | 220 |
| Reply row / button | 64 / 48 | 68 / 52 | 72 / 56 | 80 / 64 |

Sources: `O8T2D6/L5BgpO`, `OWEdQ/SyUrJ`, `T6vDvD/W51hy`,
`KGdfe/UH7vV`, `UYnGA/SUvoH`, `mcRqQ/VR3RH`, `l4js1/JsjWB`,
`F8Mmpx/S44h8`, `QBgn3/qZJqL`, `CAJqn/l0ixe`, `hIpNn/Z4qh01`,
`XhQCy/i4tri3`. Reuse IBM Plex Sans/Mono and interface typography; customer
bubble light/dark `#E7E9FF/#282D4A`, operator `#EFEAE1/#171923` become semantic
support tokens. Content stays left aligned; bubbles follow author direction.

Component map: thin Index/Create/Show pages; `SupportTicketList`,
`SupportTicketForm`, `SupportConversation`, `SupportReplyForm` own focused
render/form concerns. A shared support request composable handles safe errors
and Inertia reload. `SupportConversationService` owns transactions, locks,
idempotency and status transitions; `SupportData` prepares scoped/paginated
props. Customer and MoonShine requests use the same service and policy.
MoonShine resource exposes read-only list/detail plus dedicated POST forms;
generic model create/update/delete actions are disabled. Native back links,
pagination and explicit refresh/retry supplement the Pen screens to support
the persisted contract. Public support remains Telegram; account navigation,
limited-subscription help and connection help use `/account/support`.

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

- [x] Реализовать утверждённые `SupportTicket`/`SupportMessage` models и native
  enum statuses `OPEN`/`CLOSED`; ticket belongs to customer, message has exactly
  one customer/operator author.
- [x] Зафиксировать DB/application invariant для двух nullable author foreign
  keys без хранения raw polymorphic class names.
- [x] Добавить только новые обратимые migrations с foreign keys/indexes.
- [x] Проектировать indexes из реальных ownership/order queries, проверять
  существующие FK indexes и не добавлять дублирующие индексы механически.
- [x] Добавить policies и FormRequests для create/reply actions.
- [x] Держать controllers тонкими, conversation operations — в service/action.
- [x] Создавать ticket и первое customer message атомарно; запретить customer
  reply в закрытый ticket.
- [x] Добавить MoonShine resources/actions для operator reply, close и reopen,
  используя те же domain services/status transitions.
- [x] Реализовать Inertia list, create form и conversation pages.
- [x] Использовать `useForm()` с processing/errors/recent success.
- [x] Реализовать empty, loading, validation, service error, open/closed states.
- [x] Не поддерживать attachments, realtime, unread counters и outbound
  notifications: они не входят в утверждённый create/read/reply/close/reopen
  contract.
- [x] Добавить ownership/security tests: нельзя читать/отвечать в чужом ticket.

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
./vendor/bin/sail artisan test --compact
./vendor/bin/sail artisan migrate:status
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential <changed-php-paths>
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run build
./vendor/bin/sail npm run test:e2e
git diff --check
```

## Сценарии проверки

- Empty list и populated list с deterministic newest-first ordering.
- Create validation, success, duplicate submit и backend failure.
- Conversation open/closed, reply success/failure.
- Попытка доступа к чужому ticket.
- Operator reply, close/reopen и customer reply prohibition after close.
- Long subject/message, keyboard focus и screen reader labels.

## Результаты проверки — 2026-10-20

Implementation и CSR/browser verification завершены. По запросу владельца
этап принят и закрыт текущим коммитом.
Шаг 13 не начат. Все runtime-команды выполнены через Sail.

- Laravel: **260 tests / 2454 assertions**, включая **21 SupportTest / 210
  assertions**. Проверены guest/unverified boundaries, own list и conversation,
  foreign read/reply denial, forged owner/author/status, validation, create/reply
  rollback, safe read/write errors, replay/conflicting UUID, deterministic
  ordering, bounded queries, обе pagination boundaries, redirect к последней
  странице после reply, operator reply/close/reopen и невозможность customer
  transition. Существующие PDO PHP 8.5 deprecations не изменялись.
- Frontend Node: **70/70**. Финальный полный Playwright: **291/291**, включая
  **68 support scenarios**, после исправления общей шапки. Native MoonShine
  multiline formatting проверен после повторного реального server render.
- Support browser matrix: Index/Create/Show × light/dark ×
  `320/360/390/768/1024/1440/1920/2560`; отдельные long-content/text ×2 проверки
  на 320 для всех трёх экранов. Исправлен перенос heading «Обращения» при ×2.
  Исправлена общая шапка: длинное «Новое обращение» переносится внутри своей
  колонки, сохраняя controls справа и height 68 на 390, как в Pen. Этот размер
  закреплён browser assertion и проверен общей регрессией кабинета.
  Проверены empty/closed, escaped markup, navigation/back/pagination,
  keyboard create/reply, busy/double-click, validation/network/HTTP failures,
  сохранение draft и отсутствие optimistic history, refresh/loading/error/retry.
- MoonShine **4.19.5**: native index/detail реально отрендерены Feature-тестом;
  browser использует этот HTML из изолированных factories, проверяет label,
  focus order, CSRF и dedicated POST forms. Reply/close/reopen persistence и
  authorization проверены HTTP Feature-тестами. Generic create/update/delete
  выключены. В отдельном admin CSS нет application Tailwind utilities, поэтому
  сохранение переводов строк и перенос длинных слов задаются непосредственно
  на message paragraph, без изменения глобальных стилей.
- `UseFactory`, `UseModel`, `UsePolicy` проверены по installed framework
  class/target/constructor/integration; запрещённые substitutes не добавлялись.
  Исправлено несовпадение Builder contract с установленным MoonShine.
- Migration `2026_10_20_194258_create_support_tables` применена в dev PostgreSQL,
  статус `[7] Ran`. `down/up` проверены только в изолированной test transaction.
  CHECK обеспечивает XOR author и согласованность OPEN/CLOSED с closed_at;
  FKs `RESTRICT` сохраняют историю при попытке удалить связанного автора/ticket.
  Фактические PostgreSQL indexes перечитаны через `Schema::getIndexes`:
  они соответствуют owner/activity и ticket/created_at/ID queries;
  UUID unique constraints работают вместе с user/ticket row locks.
- Client/SSR build, scoped PER-CS3 formatter и `git diff --check` проходят.
  PHPDoc присутствует перед каждым методом; Blade проверен отдельно.
  Generated `bootstrap/ssr/*` восстановлены и не входят в diff.
- Скриншоты реализации сопоставлены с read-only Pen R/R2/R3: проверены
  mobile list/conversation, QHD conversation и responsive form; bubble widths,
  colors и layout соответствуют role matrix. Browser artifacts доступны в
  `test-results/account-support-*` и Playwright report (не коммитятся).

Operational SSR (`U-22`), физическая mobile keyboard и screen-reader matrix
остаются в шаге 15. Это не считается их sign-off. Нет attachments, realtime,
unread counters или outbound notifications; Pen не изменялся.

