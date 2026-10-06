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

- [ ] Backend Controller и Telegram
- [ ] Controller и PaymentService
- [ ] webhook Controller и PaymentService
- [ ] succeeded и canceled flow
- [ ] Promocode processing
- [ ] Referral processing
- [ ] Subscription processing
- [ ] Telegram notifications
- [ ] DTO mapping
- [ ] error handling
- [ ] logging

Убрать только фактическое дублирование.

## Неиспользуемый код

Найти:

- [ ] unused methods;
- [ ] unused DTO;
- [ ] unused Enum;
- [ ] unused Actions;
- [ ] unused Services;
- [ ] legacy payment logic;
- [ ] старые retry handlers;
- [ ] старые Telegram callbacks;
- [ ] dead branches.

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

- [ ] Расчёт суммы единый
- [ ] Promocode единый
- [ ] Metadata едины
- [ ] Idempotency едина
- [ ] Retry использует тот же механизм

## Webhook

Убедиться:

- [ ] Controller остаётся тонким
- [ ] parsing не дублируется
- [ ] status routing централизован
- [ ] succeeded logic не дублируется
- [ ] canceled logic не дублируется
- [ ] идемпотентность централизована

## Telegram

Telegram слой должен отвечать преимущественно за:

- пользовательский ввод;
- отображение сообщений;
- кнопки;
- вызов application/payment logic.

Проверить:

- [ ] нет расчёта суммы;
- [ ] нет прямой работы с YooKassa SDK без необходимости;
- [ ] нет Subscription business logic;
- [ ] нет Referral business logic;
- [ ] нет дублирования canceled mapping.

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

- [ ] Дублирование уменьшено
- [ ] Dead code удалён
- [ ] Лишние слои удалены
- [ ] Не добавлены ненужные слои
- [ ] Backend и Telegram используют общую payment logic
- [ ] Webhook flow понятен
- [ ] Canceled flow понятен
- [ ] Retry flow понятен
- [ ] Business rules сохранены
- [ ] Все tests проходят

Обновить:

`docs/audit/yookassa-refactoring.md`

и добавить итоговую схему архитектуры.

## Commit

`refactor: simplify yookassa payment module`
