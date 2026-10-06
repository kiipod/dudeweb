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

- [ ] получить актуальный Remnawave state;
- [ ] передать его UserStateManager;
- [ ] определить необходимый local tag;
- [ ] изменить tag только при необходимости.

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

- [ ] не менять tag на основании отсутствующих данных;
- [ ] не считать пользователя EXPIRED;
- [ ] зафиксировать ошибку;
- [ ] сохранить последнее подтверждённое состояние.

## Performance

Если используется периодический sync:

- [ ] не выполнять очевидный N+1 без необходимости;
- [ ] учитывать rate limits Remnawave;
- [ ] использовать существующие API capabilities.

## Tests

- [ ] EXPIRED → INACTIVE
- [ ] ACTIVE → ACTIVE
- [ ] повторный sync идемпотентен
- [ ] FAMILY защищён
- [ ] FRIENDS защищён
- [ ] Remnawave failure не портит local state
- [ ] LIMITED обработан согласно принятому правилу
- [ ] DISABLED обработан согласно принятому правилу

## Проверка

- [ ] Автоматическое expiration синхронизируется
- [ ] Chatbot payment синхронизируется
- [ ] Внешние изменения Remnawave учитываются
- [ ] Нет конкурирующих механизмов state management
- [ ] UserStateManager используется централизованно

## Commit

`feat: synchronize user state with remnawave`
