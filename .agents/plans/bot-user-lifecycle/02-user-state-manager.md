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
- синхронизацию tag между Remnawave и локальной БД;
- необходимые изменения Remnawave status в chatbot-сценариях;
- синхронизацию Remnawave → local state;
- защиту специальных FAMILY / FRIENDS.

## Lifecycle

### Registration

При успешной регистрации нового пользователя:

- [x] Remnawave User создан
- [x] Trial создан
- [x] Local tag → `TRIAL`

### Payment

После подтверждённого `payment.succeeded`:

- [x] Remnawave subscription активирована / продлена
- [x] Remnawave status → `ACTIVE`, если это требуется API
- [x] Local tag → `ACTIVE`

Не менять tag по return URL.

Изменение должно происходить только после подтверждённой оплаты.

### Expiration

Если Remnawave сообщает:

`EXPIRED`

то:

- [x] Remnawave tag → `INACTIVE`
- [x] Local tag → `INACTIVE`

Remnawave tag и local tag должны совпадать. При расхождении
UserStateManager сначала обновляет Remnawave и только после успеха —
локальную БД.

Это правило применяется как к:

- trial;
- обычной оплаченной подписке.

### Trial expiration

Если trial закончился без оплаты:

    TRIAL
      ↓
    Remnawave EXPIRED
      ↓
    Remnawave tag + local tag = INACTIVE

- [x] Не использовать отдельную конкурирующую trial-expiration модель без необходимости

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

- [x] `FAMILY` защищён от обычной lifecycle-синхронизации
- [x] `FRIENDS` защищён от обычной lifecycle-синхронизации
- [x] обычный EXPIRED sync не должен случайно заменить их на INACTIVE
- [x] обычный payment flow не должен случайно заменить их на ACTIVE

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

- [x] registration → TRIAL
- [x] TRIAL + EXPIRED → Remnawave/local INACTIVE
- [x] ACTIVE + EXPIRED → Remnawave/local INACTIVE
- [x] ACTIVE status → Remnawave/local ACTIVE
- [x] INACTIVE + payment → ACTIVE
- [x] FAMILY сохраняется
- [x] FRIENDS сохраняется
- [x] повторный sync идемпотентен
- [x] ошибка Remnawave не меняет local tag

## Проверка

- [x] Состоянием управляет один компонент
- [x] Remnawave остаётся source of truth
- [x] Chatbot exceptions явно определены
- [x] Lifecycle покрыт тестами
- [x] FAMILY / FRIENDS защищены
- [x] Нет дублирующей state logic

## Commit

`feat: add user state manager`
