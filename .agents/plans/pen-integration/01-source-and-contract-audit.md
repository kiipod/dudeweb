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

## Обязательные skills

- `frontend-design` — сверка visual intent и экранной структуры Pen.
- `vue-best-practices` — проектирование page/component/composable contracts.
- `tailwind-best-practices` — аудит будущей token/component foundation.
- `laravel-best-practices` — route, validation, authorization, query, service и
  external-boundary contracts.
- `laravel-13-attribute-refactor` на этом planning-only шаге не применяется;
  его применимость фиксируется для конкретного implementation step.

## Конкретные действия

- [ ] Повторно вызвать `get_app_state` и убедиться, что открыт ожидаемый
  `dudeweb.pen`; не выполнять Pencil mutations.
- [ ] Сверить количество и названия top-level frames, reusable components и
  variables с baseline в README.
- [ ] При расхождении с baseline составить delta inventory и классифицировать
  каждый новый frame как route, route-state или visual-only reference до
  изменения последующих task-файлов.
- [ ] Составить таблицу `Pen frame -> route -> Inertia page -> props -> user
  actions -> backend handler` для всех уникальных экранов.
- [ ] Отдельно отметить purely visual state frames, которые не требуют route.
- [ ] Зафиксировать public/auth/account route names и middleware.
- [ ] Решить `U-01`–`U-04`: identity, web session, registration и password
  recovery contracts.
- [ ] Решить `U-05`–`U-11`: subscription, products, payments, support,
  referrals, connection и profile contracts.
- [ ] Решить `U-12`–`U-16`: breakpoints, fonts, theme и Hero scroll policy.
- [ ] Решить или явно отложить `U-18`–`U-22` и `U-24`–`U-27` с owner и blocking
  scope; зафиксировать уже закрытые `U-17` и `U-23` без повторного открытия.
- [ ] Составить component map: одна ответственность на компонент, thin route
  pages как composition surfaces, явные props/emits и границы composables.
- [ ] Составить skill map по каждому implementation step и перечислить
  обязательные Vue/Laravel optional references/rules по фактическому concern.
- [ ] Для каждого мутирующего действия определить FormRequest, policy/gate,
  service/action и response type без написания production code на этом шаге.
- [ ] Подтвердить, какие Pen-тексты являются статическими, а какие должны
  приходить из server props.
- [ ] Классифицировать `Q2 · Referral Terms` как protected read-only page,
  утвердить route/path/back-navigation и источник discount/reward content по
  `U-27`.
- [ ] Зафиксировать mapping remote Remnawave state к UI states, не меняя
  существующие lifecycle rules.
- [ ] Зафиксировать payment flow: создание, redirect, return, pending refresh,
  success, error и retry.
- [ ] Зафиксировать responsive overlay map для mobile/tablet/desktop `Ещё` и
  промокода, включая presentation, backdrop, inert scope и focus contract.
- [ ] Зафиксировать, какой logo/lockup и какой Static Hero mode являются
  approved source; не выбирать их по названию frame или расположению на canvas.
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
./vendor/bin/sail artisan route:list --except-vendor
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

