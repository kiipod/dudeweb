# Шаг 9 — Синхронизация User Lifecycle

## Цель

Обеспечить актуальность local tag при изменениях состояния пользователя
в Remnawave.

## Проблема

Remnawave является source of truth.

Следовательно, изменения, произошедшие вне chatbot flow, также должны
отражаться локально.

Пример:

    trial expires automatically in Remnawave
                ↓
             EXPIRED
                ↓
    chatbot ничего не инициировал
                ↓
    local tag всё равно должен стать INACTIVE

## Existing mechanism

Перед реализацией проверить:

- webhooks Remnawave;
- scheduler;
- sync commands;
- background jobs;
- API polling.

Переиспользовать существующий механизм, если он есть.

## Synchronization

Для каждого синхронизируемого User:

- [x] получить актуальный Remnawave state;
- [x] передать его UserStateManager;
- [x] определить необходимый local tag;
- [x] изменить tag только при необходимости.

## Mapping

Минимально проверить:

    Remnawave EXPIRED
        ↓
    local INACTIVE

    successful payment
        ↓
    Remnawave ACTIVE
        ↓
    local ACTIVE

TRIAL устанавливается chatbot registration flow.

FAMILY / FRIENDS защищены.

Не создавать универсальный mapping status → tag без анализа семантики.

## LIMITED / DISABLED

Отдельно определить поведение local tag для:

- LIMITED
- DISABLED

Не считать их автоматически INACTIVE.

Зафиксировать принятое правило в документации.

## Failure handling

Если Remnawave временно недоступен:

- [x] не менять tag на основании отсутствующих данных;
- [x] не считать пользователя EXPIRED;
- [x] зафиксировать ошибку;
- [x] сохранить последнее подтверждённое состояние.

## Performance

Если используется периодический sync:

- [x] не выполнять очевидный N+1 без необходимости;
- [x] учитывать rate limits Remnawave;
- [x] использовать существующие API capabilities.

## Tests

- [x] EXPIRED → INACTIVE
- [x] ACTIVE → ACTIVE
- [x] повторный sync идемпотентен
- [x] FAMILY защищён
- [x] FRIENDS защищён
- [x] Remnawave failure не портит local state
- [x] LIMITED обработан согласно принятому правилу
- [x] DISABLED обработан согласно принятому правилу

## Проверка

- [x] Автоматическое expiration синхронизируется
- [x] Chatbot payment синхронизируется
- [x] Внешние изменения Remnawave учитываются
- [x] Нет конкурирующих механизмов state management
- [x] UserStateManager используется централизованно

## Commit

`feat: synchronize user state with remnawave`
