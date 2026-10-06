# Шаг 2 — UserStateManager

## Цель

Создать единый компонент, управляющий локальными пользовательскими тегами
и синхронизацией состояния с Remnawave.

## Источник истины

Remnawave является источником истины для фактического subscription status.

UserStateManager не должен поддерживать независимый конкурирующий status.

## Ответственность

Создать:

`UserStateManager`

Фактическое namespace и расположение выбрать согласно архитектуре проекта.

UserStateManager отвечает за:

- получение актуального состояния пользователя;
- определение локального tag;
- изменение tag;
- необходимые изменения Remnawave status в chatbot-сценариях;
- синхронизацию Remnawave → local state;
- защиту специальных FAMILY / FRIENDS.

## Lifecycle

### Registration

При успешной регистрации нового пользователя:

- [ ] Remnawave User создан
- [ ] Trial создан
- [ ] Local tag → `TRIAL`

### Payment

После подтверждённого `payment.succeeded`:

- [ ] Remnawave subscription активирована / продлена
- [ ] Remnawave status → `ACTIVE`, если это требуется API
- [ ] Local tag → `ACTIVE`

Не менять tag по return URL.

Изменение должно происходить только после подтверждённой оплаты.

### Expiration

Если Remnawave сообщает:

`EXPIRED`

то:

- [ ] Local tag → `INACTIVE`

Это правило применяется как к:

- trial;
- обычной оплаченной подписке.

### Trial expiration

Если trial закончился без оплаты:

    TRIAL
      ↓
    Remnawave EXPIRED
      ↓
    local INACTIVE

- [ ] Не использовать отдельную конкурирующую trial-expiration модель без необходимости

### Reactivation

Если INACTIVE пользователь оплачивает подписку:

    INACTIVE
       ↓
    payment.succeeded
       ↓
    Remnawave ACTIVE
       ↓
    local ACTIVE

### FAMILY / FRIENDS

- [ ] `FAMILY` защищён от обычной lifecycle-синхронизации
- [ ] `FRIENDS` защищён от обычной lifecycle-синхронизации
- [ ] обычный EXPIRED sync не должен случайно заменить их на INACTIVE
- [ ] обычный payment flow не должен случайно заменить их на ACTIVE

Если фактическая бизнес-логика проекта требует другого поведения —
зафиксировать это до реализации.

## API

Не фиксировать заранее сигнатуры методов.

После анализа определить минимальный понятный API, например операции:

- sync from Remnawave;
- mark trial;
- mark active;
- mark inactive;
- disable user.

Не создавать методы только ради CRUD над tag.

## Atomicity

Проверить сценарии частичного failure:

    Remnawave updated
    local DB failed

и:

    local DB updated
    Remnawave failed

Определить безопасный порядок операций.

Не скрывать рассинхронизацию.

## Tests

- [ ] registration → TRIAL
- [ ] TRIAL + EXPIRED → INACTIVE
- [ ] ACTIVE + EXPIRED → INACTIVE
- [ ] INACTIVE + payment → ACTIVE
- [ ] FAMILY сохраняется
- [ ] FRIENDS сохраняется
- [ ] повторный sync идемпотентен

## Проверка

- [ ] Состоянием управляет один компонент
- [ ] Remnawave остаётся source of truth
- [ ] Chatbot exceptions явно определены
- [ ] Lifecycle покрыт тестами
- [ ] FAMILY / FRIENDS защищены
- [ ] Нет дублирующей state logic

## Commit

`feat: add user state manager`
