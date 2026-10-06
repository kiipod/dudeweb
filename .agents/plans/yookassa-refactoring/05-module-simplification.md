# Шаг 5 — Упрощение архитектуры платёжного модуля

## Цель

Проверить платёжный модуль целиком и убрать лишнюю сложность без изменения
бизнес-функциональности.

## Зависимости

Перед началом прочитать:

`docs/audit/yookassa-refactoring.md`

Учитывать архитектуру после рефакторинга PaymentService.

## Проверка flow

Повторно проследить:

    Backend API ─┐
                 ├→ Payment creation
    Telegram ────┘
                       ↓
                    YooKassa
                       ↓
                    Webhook
                       ↓
             Payment processing
                       ↓
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
    Subscription   Promocode      Referral
         ↓
     Remnawave

Для каждого этапа проверить необходимость существующих слоёв.

## Дублирование

Найти дублирование между:

- [x] Backend Controller и Telegram
- [x] Controller и PaymentService
- [x] webhook Controller и PaymentService
- [x] succeeded и canceled flow
- [x] Promocode processing
- [x] Referral processing
- [x] Subscription processing
- [x] Telegram notifications
- [x] DTO mapping
- [x] error handling
- [x] logging

Убрать только фактическое дублирование.

## Неиспользуемый код

Найти:

- [x] unused methods;
- [x] unused DTO;
- [x] unused Enum;
- [x] unused Actions;
- [x] unused Services;
- [x] legacy payment logic;
- [x] старые retry handlers;
- [x] старые Telegram callbacks;
- [x] dead branches.

Перед удалением выполнить поиск всех references.

## Слои

Проверить, нет ли классов, которые:

- только проксируют один вызов;
- не содержат ответственности;
- существуют только из-за предыдущего рефакторинга;
- дублируют SDK;
- дублируют Eloquent;
- дублируют существующий Service/Action.

Удалять слой только если архитектура становится проще.

## Payment creation

Убедиться, что Backend и Telegram используют единый механизм:

    create payment
         ↓
    PaymentService / соответствующий application service
         ↓
    YooKassa

- [x] Расчёт суммы единый
- [x] Promocode единый
- [x] Metadata едины
- [x] Idempotency едина
- [x] Retry использует тот же механизм

## Webhook

Убедиться:

- [x] Controller остаётся тонким
- [x] parsing не дублируется
- [x] status routing централизован
- [x] succeeded logic не дублируется
- [x] canceled logic не дублируется
- [x] идемпотентность централизована

## Telegram

Telegram слой должен отвечать преимущественно за:

- пользовательский ввод;
- отображение сообщений;
- кнопки;
- вызов application/payment logic.

Проверить:

- [x] нет расчёта суммы;
- [x] нет прямой работы с YooKassa SDK без необходимости;
- [x] нет Subscription business logic;
- [x] нет Referral business logic;
- [x] нет дублирования canceled mapping.

## Naming

Проверить названия:

- Services
- Actions
- Handlers
- DTO
- Enum
- methods

Названия должны отражать ответственность.

Не переименовывать классы только ради косметики, если это создаёт большой
diff без архитектурной пользы.

## Проверка

- [x] Дублирование уменьшено
- [x] Dead code удалён
- [x] Лишние слои удалены
- [x] Не добавлены ненужные слои
- [x] Backend и Telegram используют общую payment logic
- [x] Webhook flow понятен
- [x] Canceled flow понятен
- [x] Retry flow понятен
- [x] Business rules сохранены
- [x] Все tests проходят

Обновить:

`docs/audit/yookassa-refactoring.md`

и добавить итоговую схему архитектуры.

## Commit

`refactor: simplify yookassa payment module`
