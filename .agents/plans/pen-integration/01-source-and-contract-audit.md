# Шаг 1 — Фиксация источников и frontend-контрактов

## Цель задачи

Перед реализацией зафиксировать экранную карту, маршруты, Inertia props,
мутирующие действия и решения по всем `Needs review`, чтобы следующие шаги не
создавали отсутствующую бизнес-логику.

## Зависимости

- [README.md](README.md).
- Доступ к открытому `dudeweb.pen` через Pencil MCP.
- Текущее состояние `routes/web.php`, моделей, миграций, Remnawave handlers и
  payment services.
- Решения владельца продукта по блокирующим неопределённостям.

## Конкретные действия

- [ ] Повторно вызвать `get_app_state` и убедиться, что открыт ожидаемый
  `dudeweb.pen`; не выполнять Pencil mutations.
- [ ] Сверить количество и названия top-level frames, reusable components и
  variables с baseline в README.
- [ ] Составить таблицу `Pen frame -> route -> Inertia page -> props -> user
  actions -> backend handler` для всех уникальных экранов.
- [ ] Отдельно отметить purely visual state frames, которые не требуют route.
- [ ] Зафиксировать public/auth/account route names и middleware.
- [ ] Решить `U-01`–`U-04`: identity, web session, registration и password
  recovery contracts.
- [ ] Решить `U-05`–`U-11`: subscription, products, payments, support,
  referrals, connection и profile contracts.
- [ ] Решить `U-12`–`U-16`: breakpoints, fonts, theme и Hero scroll policy.
- [ ] Решить или явно отложить `U-17`–`U-23` с owner и blocking scope.
- [ ] Для каждого мутирующего действия определить FormRequest, policy/gate,
  service/action и response type без написания production code на этом шаге.
- [ ] Подтвердить, какие Pen-тексты являются статическими, а какие должны
  приходить из server props.
- [ ] Зафиксировать mapping remote Remnawave state к UI states, не меняя
  существующие lifecycle rules.
- [ ] Зафиксировать payment flow: создание, redirect, return, pending refresh,
  success, error и retry.
- [ ] Обновить decision log в README и снять только реально решённые блокеры.

## Критерии готовности

- Для каждого уникального экрана существует однозначная route/data/action map.
- Ни один UI action не опирается на выдуманный endpoint или fake data.
- Auth/support/referral/payment blockers имеют принятое решение либо явно
  блокируют зависимые шаги.
- Подтверждены reference viewport и предполагаемые CSS breakpoint boundaries.
- Pen остаётся неизменённым, production code не изменён.

## Команды проверки

```bash
git status --short --branch
php artisan route:list --except-vendor
rg -n "Route::|Inertia::render|auth:web" routes app/Http
rg -n "email|password|chat_id|username" app/Models database/migrations config/auth.php
rg -n "subscriptionUrl|expireAt|devices|referral|support" app
git diff --check
```

Pencil read-only сценарии:

1. `get_app_state` возвращает `dudeweb.pen`.
2. `execute` с `Get` и `GetVariables` читает структуру и variables.
3. Не вызываются `Insert`, `Copy`, `Update`, `Replace`, `Move`, `Delete`,
   `SetVariables` или `Generate`.

## Сценарии проверки

- Проверить карту для anonymous landing visitor.
- Проверить login/register/recovery при выбранной identity model.
- Проверить authenticated active/trial/expired/limited user.
- Проверить недоступность Remnawave и отсутствие локального stale fallback.
- Проверить payment pending/success/failure и повторную попытку.
- Проверить support/referral actions только с подтверждёнными контрактами.

