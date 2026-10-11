# Шаг 16 — Финальная проверка и передача

## Цель задачи

Подтвердить, что перенос дизайна завершён без регрессий backend/Telegram flows,
неразрешённых placeholder contracts и изменений исходного Pen-документа.

## Зависимости

- Завершён шаг 15.
- Все defects из visual/accessibility matrix закрыты или явно приняты.
- Все обязательные `Needs review` разрешены.

## Конкретные действия

- [ ] Повторно вызвать Pencil `get_app_state` и подтвердить исходный документ.
- [ ] Сверить Pen top-level/component/variable counts с исходным baseline; не
  выполнять mutations.
- [ ] Проверить `git status`, diff и отсутствие изменений вне утверждённого
  frontend/backend scope.
- [ ] Проверить отсутствие placeholder links, demo values, fake responses и
  debug logging.
- [ ] Проверить route list, middleware, FormRequests, policies и CSRF.
- [ ] Выполнить targeted test suites для auth/account/payment/referral/support.
- [ ] Выполнить полный Laravel test suite в Sail.
- [ ] Выполнить production frontend build.
- [ ] Выполнить formatter dry-run по изменённым PHP paths.
- [ ] Повторить critical browser smoke flows на 390 и 1440, light/dark.
- [ ] Повторить Hero forward/back/reduced-motion checks.
- [ ] Проверить no-console-error/no-hydration-warning в CSR и SSR mode,
  если SSR утверждён.
- [ ] Обновить checklist каждого task-файла только после фактической проверки.
- [ ] Подготовить handoff summary: routes, components, contracts, tests,
  intentional deviations и remaining risks.

## Критерии готовности

- Все обязательные plan checkboxes закрыты доказательствами.
- Полный test suite и production build проходят.
- Visual/accessibility verification matrix закрыта.
- Нет неразрешённых блокирующих uncertainties.
- Existing payment webhook, Telegram и Remnawave tests не регрессировали.
- Pen-документ не изменён.

## Команды проверки

```bash
git status --short --branch
docker compose exec -T laravel.test php artisan route:list --except-vendor
docker compose exec -T laravel.test composer test
npm run build
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential <changed-php-paths>
git diff --check
```

## Сценарии проверки

- Anonymous: landing -> menu -> CTA -> auth.
- Auth: login/register/recovery по утверждённому contract.
- Account: dashboard -> subscription -> payment -> return state.
- Account: connection copy -> referral share -> support -> profile -> logout.
- Remote/provider failure и successful retry.
- Mobile 390 dark, tablet 768 light, desktop 1440 dark/light.
- Keyboard-only и reduced-motion smoke pass.
