# Шаг 16 — Финальная проверка и передача

## Статус — 2026-10-27

По решению владельца из завершённого шага 15 принят единственный
незавершённый пункт **M-12 SMTP / N-15-03**. Проверка реальной доставки
reset-письма не выполнена; последнее подтверждённое состояние — SMTP
недоступен. Перенос не закрывает этот пункт и не подтверждает готовность
к production. Финальная проверка начата: live `dudeweb.pen` подтверждён,
baseline сверён с согласованной синхронизацией от 2026-10-26 — **216
top-level frames / 13 reusable components / 30 variables**, placeholders нет.
Прежний baseline 139/10/19 устарел; новая доска `sLiqn` — спецификация
компонентов и взаимодействий, а не дополнительный route. Источник —
[аудит синхронизации](../../../docs/audit/pen-frontend-sync-2026-10-26.md).
Pen в этом продолжении доступен только для чтения.
Результаты, handoff contracts и границы проверки —
[финальный audit](../../../docs/audit/pen-final-verification.md).
Все независимые от внешнего SMTP пункты ниже проверены. Шаг остаётся открытым
до M-12; реальная доставка и production readiness не подтверждены.
По решению владельца текущее состояние принимается для коммита; дальнейшая
работа над шагом пока не продолжается. M-12 сохраняет незавершённый статус.

## Цель задачи

Подтвердить, что перенос дизайна завершён без регрессий backend/Telegram flows,
неразрешённых placeholder contracts и изменений исходного Pen-документа.

## Зависимости

- Шаг 15 завершён с явным переносом M-12 SMTP / N-15-03 в этот шаг по
  решению владельца от 2026-10-26.
- Все defects из visual/accessibility matrix закрыты или явно приняты.
- Все обязательные `Needs review` разрешены, кроме перенесённого
  M-12 SMTP / N-15-03, который должен быть закрыт в этом шаге.

## Обязательные skills

- Повторно выбрать `frontend-design`, `vue-best-practices`,
  `tailwind-best-practices` и `laravel-best-practices` для review фактически
  изменённых concerns, перечитать обязательные references/rules и проверить
  итоговый diff по каждому из них.
- `laravel-13-attribute-refactor` выбрать только если итоговый diff содержит
  approved attribute concern; повторно проверить attributes по installed
  framework source.
- `tailwind-4-docs` не выбирать только ради финального review; он нужен лишь
  при точном version-specific concern и актуальном snapshot.

## Конкретные действия

- [x] Повторно вызвать Pencil `get_app_state` и подтвердить исходный документ:
  `dudeweb.pen`, document id `d241f6ea-c3a7-4b71-9981-19aef7200bef`.
- [x] Сверить Pen counts с текущим baseline `216 top-level / 13 reusable / 30
  variables` после согласованной синхронизации 2026-10-26; при новой дельте
  остановиться, повторить read-only audit и
  обновить plan до implementation verification; не выполнять mutations.
- [x] Проверить `git status`, diff и отсутствие изменений вне утверждённого
  frontend/backend scope. Исходный worktree содержал только четыре документа
  переноса M-12; ветка `pen-integration`, HEAD `d9911bc`.
- [x] Проверить отсутствие placeholder links, demo values, fake responses и
  debug logging в production UI/routes/services. Fixture transports остаются
  только в tests; anchors и email placeholders не являются fake destinations.
- [x] Проверить route list, middleware, FormRequests, policies и CSRF:
  41 application route, `/test` отсутствует; exceptions ограничены webhook.
- [x] Выполнить targeted test suites для auth/account/payment/referral/support:
  197 tests / 2422 assertions, exit 0.
- [x] Выполнить полный Laravel test suite в Sail: 306 tests / 2997 assertions,
  exit 0, без failures; 295 tests имеют PDO deprecation, 11 — без предупреждений.
- [x] Выполнить production frontend build: client и SSR прошли;
  frontend unit/SSR tests — 103/103.
- [x] Выполнить formatter dry-run по изменённым PHP paths:
  0 fixable из 375 non-Blade PHP paths между `83ce546` и HEAD.
- [x] Повторить critical browser smoke flows на 390, 1440 и 2560, light/dark:
  отдельный CSR probe — 102/102, включая реальные public Inertia переходы;
  account states/transport/retry проверены browser projects текущего build.
- [x] Подтвердить отсутствие Hero pinning/scroll-state и обычный document flow
  к следующей секции; primary Service Cloud/Orbits сохраняет Pen composition:
  desktop ambient rotation с hover/drag/inertia, mobile/tablet original shader
  motion. При reduced motion статика, в фоне/вне viewport RAF остановлен.
- [x] Повторить Service Cloud/Orbits Hero на пяти reference widths и обеих
  темах; fallback/явный выбор сохранённого Signal Orbit, его pointer response
  и reduced-motion/touch gating; выбранный logo lockup, tablet `Ещё`, tablet promo
  sheet, desktop promo dialog и Q2 referral terms visual/keyboard smoke checks.
  Текущий build: Hero 34/34, explicit Signal Orbit 12/12; responsive,
  interaction, overlays и Q2 входят в подтверждённое browser coverage ниже.
- [x] Проверить no-console-error/no-hydration-warning в CSR и SSR mode:
  CSR 102/102 и локальный operational SSR 40/40. В SSR сохранена DOM identity
  серверного h1; временные renderer/HTTP server остановлены после проверки,
  generated SSR восстановлены byte-for-byte к исходному worktree.
- [x] Обновить checklist каждого task-файла только после фактической проверки:
  прежние перенесённые позиции шагов 6–8 связаны с evidence шагов 15/16;
  SMTP не отмечен выполненным, его единый открытый ID — M-12 ниже.
- [x] Подготовить handoff summary: routes, components, contracts, tests,
  intentional deviations и remaining risks — в финальном audit.

Итог browser coverage: **1763 cases / 24 projects**. Первый полный run:
1703 passed / 60 failed на устаревших source/state ожиданиях. После live Pen
сверки полностью повторены затронутые projects: **205/205 pen-frames** и
**194/194 auth/account details**; остальные 1364 cases прошли в общем run.
Единый чистый full browser run после этих test-only исправлений не повторялся;
первый report с failures сохранён. Отдельно CSR **102/102**, operational SSR
**40/40**. Production PHP/Vue/CSS не менялись, assertions не отключались.

### M-12 — реальная доставка reset-письма

Перенесено из шага 15 по решению владельца 2026-10-26. Исходный ID
**M-12 / N-15-03** сохраняется для связи с аудитом и
[ручным протоколом](../../../docs/audit/pen-step15-manual.md).

- [ ] Проверить реальную доставку reset-письма на явно согласованный
  тестовый email через настроенный production-like прямой SMTP mailer.
  Подтвердить получение вне Mailpit/log/fake, корректный From и правильные
  URL/домен. Открыть ссылку, изменить тестовый пароль и убедиться, что ссылка
  не используется повторно; пароль не должен попадать в письмо. Сохранить
  результат в ручном протоколе и handoff без паролей, reset tokens и secrets.

Проверка обязательна перед production. До доступности SMTP и согласования
тестового адреса пункт остаётся открытым; dev transport и автоматические
assertions не заменяют внешнюю доставку. Настройка —
[docs/mail.md](../../../docs/mail.md).

2026-10-27 владелец повторно подтвердил: SMTP пока недоступен, M-12 оставить
открытым. Безопасная проверка локальной конфигурации: `smtp`, Mailpit,
`MAIL_URL` не задан. Письма не отправлялись, credentials не выводились.

## Критерии готовности

- Все обязательные plan checkboxes закрыты доказательствами.
- Полный test suite и production build проходят.
- Visual/accessibility verification matrix закрыта.
- Нет неразрешённых блокирующих uncertainties.
- M-12 SMTP / N-15-03 закрыт фактической внешней доставкой reset-письма,
  проверкой From, URL и одноразовой ссылки; результат записан в протоколе.
- Existing payment webhook, Telegram и Remnawave tests не регрессировали.
- Pen-документ не изменён.

## Команды проверки

```bash
git status --short --branch
./vendor/bin/sail artisan route:list --except-vendor
./vendor/bin/sail composer test
./vendor/bin/sail npm run build
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --dry-run --diff --using-cache=no --sequential <changed-php-paths>
git diff --check
```

## Сценарии проверки

- Anonymous: landing -> menu -> CTA -> auth.
- Auth: login/register/recovery по утверждённому contract.
- Account: dashboard -> subscription -> payment -> return state.
- Account: connection copy -> referral share -> referral terms -> back ->
  support -> profile -> logout.
- Remote/provider failure и successful retry.
- Mobile 390 dark, tablet 768 light, desktop 1440 dark/light и wide desktop
  2560 dark/light.
- Keyboard-only и reduced-motion smoke pass.
