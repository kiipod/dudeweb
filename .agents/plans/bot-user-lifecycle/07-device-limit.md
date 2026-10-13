# Шаг 7 — Контроль количества устройств

## Цель

Контролировать количество устройств пользователя относительно лимита тарифа.

## Источники

Device count получать из существующей Remnawave-интеграции.

Device limit получать из фактического Product / Plan.

Не дублировать эти значения отдельными константами.

## Условие

Если:

    device_count > plan.device_limit

выполнить:

    Remnawave status → DISABLED
             ↓
    Telegram notification
             ↓
    device management flow

## Remnawave

- [x] Получить актуальный device count
- [x] Получить актуальный plan limit
- [x] Сравнить значения
- [x] При превышении изменить Remnawave status на DISABLED

Использовать существующий Handler/API.

## UserStateManager

Изменение Remnawave status должно проходить через согласованный lifecycle.

Не создавать отдельную конкурирующую state logic.

Проверить, должен ли локальный tag изменяться при `DISABLED`.

Не предполагать автоматически:

`DISABLED == INACTIVE`

Remnawave status и local tag имеют разный смысл.

## Telegram

При превышении отправить сообщение о том, что разрешённое тарифом количество
устройств превышено.

Предоставить переход в существующий:

device management handler.

- [x] Пользователь получает сообщение
- [x] Есть кнопка управления устройствами
- [x] Callback ведёт в существующий handler
- [x] Не создаётся дублирующий device management flow

## Recovery

Обязательно проверить существующее поведение после удаления лишних устройств.

Определить:

- должен ли status автоматически возвращаться ACTIVE;
- кто выполняет recovery;
- при каком условии.

Не оставлять пользователя DISABLED навсегда без анализа recovery flow.

## Idempotency

Если пользователь уже DISABLED из-за device limit:

- [x] не отправлять бесконечные одинаковые notifications;
- [x] не выполнять лишние status updates.

## Tests

- [x] count < limit → ничего
- [x] count == limit → ничего
- [x] count > limit → DISABLED
- [x] notification отправлена
- [x] management button работает
- [x] повторная проверка идемпотентна
- [x] recovery flow проверен

## Commit

`feat: enforce subscription device limit`
