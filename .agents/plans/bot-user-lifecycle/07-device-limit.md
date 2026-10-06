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

- [ ] Получить актуальный device count
- [ ] Получить актуальный plan limit
- [ ] Сравнить значения
- [ ] При превышении изменить Remnawave status на DISABLED

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

- [ ] Пользователь получает сообщение
- [ ] Есть кнопка управления устройствами
- [ ] Callback ведёт в существующий handler
- [ ] Не создаётся дублирующий device management flow

## Recovery

Обязательно проверить существующее поведение после удаления лишних устройств.

Определить:

- должен ли status автоматически возвращаться ACTIVE;
- кто выполняет recovery;
- при каком условии.

Не оставлять пользователя DISABLED навсегда без анализа recovery flow.

## Idempotency

Если пользователь уже DISABLED из-за device limit:

- [ ] не отправлять бесконечные одинаковые notifications;
- [ ] не выполнять лишние status updates.

## Tests

- [ ] count < limit → ничего
- [ ] count == limit → ничего
- [ ] count > limit → DISABLED
- [ ] notification отправлена
- [ ] management button работает
- [ ] повторная проверка идемпотентна
- [ ] recovery flow проверен

## Commit

`feat: enforce subscription device limit`
