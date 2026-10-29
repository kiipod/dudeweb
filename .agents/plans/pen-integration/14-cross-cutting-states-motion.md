# Шаг 14 — Состояния, overlays и motion hardening

## Цель задачи

Системно проверить и унифицировать все интерактивные состояния, overlays,
micro-interactions и async feedback после реализации страниц.

## Зависимости

- Завершён шаг 13.
- Pen boards `H`, `U`, `U2`, menu-open frames, promo/more drawers и payment
  result screens.
- Все реализованные routes и components.

## Обязательные skills

- `frontend-design` — self-critique, motion restraint и единая visual language.
- `vue-best-practices` — core references и только применимые Teleport/
  Transition/animation references для фактических overlays и motion.
- `tailwind-best-practices` — state variants, class ordering и token discipline.

## Конкретные действия

- [x] Создать inventory всех buttons, links, fields, selectors, menus, drawers,
  dropdowns, modals и async actions.
- [x] Для каждого элемента отметить default/hover/focus/active/disabled/loading/
  error/success coverage.
- [x] Сверить primary button: default `#8E9BFF`, hover `#A8B1FF`, focus
  two-pixel high-contrast outline из Pen.
- [x] Проверить selected period/platform/theme/navigation states.
- [x] Проверить disabled actions: pointer, keyboard и programmatic activation.
- [x] Проверить async actions на duplicate submit и race conditions.
- [x] Реализовать только нужные overlays: mobile menu, More drawer, promo
  sheet/dialog и подтверждённые modal flows.
- [x] Сверить breakpoint presentation: `Ещё` — mobile/tablet bottom sheet;
  промокод — mobile/tablet bottom sheet и desktop centered dialog.
- [x] Для overlay обеспечить title, accessible description, focus trap,
  `Escape`, outside-click policy, scroll lock и focus return.
- [x] Унифицировать UI motion в пределах `150-250ms` и использовать transform/
  opacity для enter/leave.
- [x] Не добавлять одинаковый fade-up каждой секции или новый декоративный
  autoplay вне принятого Hero. Desktop Service Cloud управляется
  mouse hover/drag и инерцией по hero236 поверх медленного ambient rotation.
  Mobile/tablet SVG воспроизводит автономные орбиты исходного Pen shader.
  Reduced motion и background/offscreen gating
  действуют на оба режима.
  Запасной Signal Orbit реагирует только на направление мыши и возвращается
  к статичному Pen path без изменения layout bounds.
- [x] Отключить несущественную motion при reduced motion.
- [x] Проверить toast vs inline alert: actionable errors остаются рядом с
  действием/формой.
- [x] Проверить slow network и navigation interruption для всех async flows.

## Критерии готовности

- State matrix заполнена для каждого интерактивного элемента.
- Нет control без focus-visible или с hover-only functionality.
- Все overlays корректно управляют фокусом и закрытием.
- Loading state предотвращает повторное действие.
- Motion соответствует Pen и reduced-motion требованиям.

## Команды проверки

```bash
rg -n "hover:|focus:|focus-visible:|active:|disabled:|loading|processing|Transition|prefers-reduced-motion" resources/js resources/css
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run test:e2e
./vendor/bin/sail artisan test
./vendor/bin/sail npm run build
git diff --check
```

## Сценарии проверки

- Keyboard-only walkthrough всех routes.
- Pointer hover и touch device без hover.
- Slow 3G/latency: submit, route visit, remote props, payment pending.
- Open overlay -> nested action -> close/back -> focus return.
- Reduced motion для overlay transitions и статичная Service Cloud/Orbits
  композиция в `t=0`; pause/resume при background/offscreen, forced-colors
  suppression, theme SVG switch и fallback при ошибке renderer/ресурсов.
- Desktop sphere: hover в разные стороны/от центра, drag/capture/release,
  переход от инерции к ambient rotation без сброса ориентации, движение до hover
  и отсутствие mouse response на mobile/tablet.
- Запасной Signal Orbit: static при reduced motion, touch/coarse pointer и
  в фоне; pointer response затухает в покое.
- Service error -> retry -> success без stale error.

## Implementation — 2026-10-20

Inventory, state matrix, live Pen provenance и component boundaries:
[docs/audit/pen-interactive-states.md](../../../docs/audit/pen-interactive-states.md).

Public menu и account overlays используют общий `useOverlay`; добавлены
доступные descriptions, inert leaving DOM и корректный быстрый reopen,
public resize cleanup и защита programmatic focus. `useActionForm` объединяет
Inertia guard/transport feedback/cancellation; профиль сохраняет собственный
текст ошибок через `useProfileForm`. Provisioning получает обработку сбоев и
cancel при unmount. Clipboard отбрасывает устаревший success/error после смены
ссылки, copy/share явно показывают busy. More отражает текущий раздел и
блокирует competing navigation при logout. Shared primary border states
сверены с Pen и вынесены в semantic theme roles.

UI transitions используют 200ms (enter/color) / 150ms (leave), opacity или
transform; reduced motion отключает их и loader rotation. Async errors
остаются рядом с действием. Новых overlay flows, toast/dependencies и Hero
animation mechanics нет; Pen read-only.

## Проверка — 2026-10-20

- Sail Node: **79/79**, включая action form guard/cancellation, provisioning
  failures и clipboard race, плюс существующие Hero/geometry/state tests.
- Полный финальный Sail Playwright: **399/399** за 2.7 min, включая **62 новых
  cross-cutting scenarios**. Native Tab + focus-visible audit проходят на
  всех 16 page compositions в 390/1440; отдельно проверены actual Tab/Shift+Tab,
  Escape/focus restore, enter/leave/reopen, latency/duplicate synthetic submits,
  network/HTTP recovery и delayed response после navigation. Touch contexts
  на 390/1440 имеют `(hover: none) and (pointer: coarse)` и рабочие controls.
- SVG Hero: browser 390/768/1440/2560, обе theme assets, native drag capture,
  reduced t=0, offscreen resume, controlled hidden state, forced colors и
  resource failure → Signal Orbit. Дополнительные unit cases проверяют точные
  steering/inertia/ambient и disposal contracts. Renderer/layout не менялись.
- Полный Sail Laravel: **277 tests / 2628 assertions**, без падений.
  **266** tests имеют существующие PDO deprecation notices; новых PHP changes нет.
- Client и SSR production build успешны. `git diff --check` проходит;
  generated `bootstrap/ssr/ssr-manifest.json`, `ssr.js`, `ssr.js.map` исключены.
- Pen state board и More/promo screenshots прочитаны и визуально сопоставлены
  с актуальными browser captures; public light/dark menu снят после окончания
  opacity transition, focus contrast и overlay geometry сохранены.

Первый общий прогон выявил два изменения текста profile HTTP error при
унификации form wrapper. Восстановлено прежнее contextual message через
`useProfileForm`; существующие tests сохранены, финальный общий прогон проходит.

Logs: `/tmp/pen-step14-node-final.log`, `/tmp/pen-step14-browser-final.log`,
`/tmp/pen-step14-php-final.log`, `/tmp/pen-step14-build-final.log`.
Browser captures/traces/report находятся в ignored `test-results/` /
`playwright-report/`; test sources входят в change set.

Implementation и CSR/browser verification завершены. По запросу владельца
шаг 14 принят и закрывается этим коммитом.
Physical keyboard/screen-reader/device matrix, полная финальная responsive
screenshot comparison, production SMTP и operational SSR/hydration (U-22)
остаются в шаге 15. Controlled hidden emulation не считается физическим
background-tab smoke. К шагу 15 в этом этапе не переходим.

