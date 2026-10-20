# Шаг 8 — Account shell и dashboard

## Текущий статус — 2026-10-20

Implementation начат в `edcbd58`, продолжен сверкой live read-only Pen и
проверками текущего checkout. Контракт и evidence:
[account dashboard audit](../../../docs/audit/pen-account-dashboard.md).
Backend, shared shell, states и retry реализованы; полная browser acceptance
остаётся открытой ниже. Шаг 9 не начинается.

По запросу владельца 2026-10-20 разрешён коммит текущей реализации и evidence.
Этот commit не закрывает оставшиеся visual/native keyboard/SSR проверки.

## Цель задачи

Создать responsive account shell и dashboard на реальных User/Remnawave данных,
включая все account states из Pen.

## Зависимости

- Завершён шаг 7.
- Решены `U-05`, `U-12`, `U-14`, `U-21`; `U-22` явно отложен, поэтому шаг
  реализует и проверяет CSR/Inertia contract без ложного SSR sign-off.
- Pen `J`, `V`, `K`, `K2`, `U`, `U2` во всех viewport/theme variants,
  включая новые tablet `K2` frames `VcLN4` и `mlxDX`.
- Pen reusable `Vxu7B · Account More Navigation Sheet`.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — account
  shell, responsive component map, data flow, overlays и styling.
- Для bottom-sheet/dialog дополнительно прочитать применимые
  `component-teleport.md` и `component-transition.md`.
- `laravel-best-practices` — service boundary, minimal Inertia props,
  authorization, Remnawave failure handling и query behavior.
- `laravel-13-attribute-refactor` — условно для approved configuration в
  затронутых Controllers/FormRequests/Container components после source check.

## Конкретные действия

- [x] Создать protected account routes и Account layout.
- [x] Реализовать mobile/tablet top header + bottom navigation.
- [x] Реализовать desktop sidebar, top bar и active route indication.
- [x] Реализовать mobile/tablet bottom-sheet `Ещё` с
  invite/support/profile/logout: full-width на mobile и `520 x 372`,
  центрированный снизу, на tablet; desktop использует sidebar без `K2` state.
- [x] Реализовать доступный local bottom-sheet/dialog component в соответствии
  с Pen и `U-20`, не добавляя новую UI dependency без отдельного решения.
- [x] Управлять focus trap, `Escape`, background scroll и focus return.
- [x] Создать focused service/action, собирающий dashboard view data из local
  User и Remnawave; controller остаётся orchestration layer.
- [x] Не сохранять remote truth в новые local поля без отдельного domain
  решения.
- [x] Передать через Inertia props plan, status, expiration, remaining days,
  subscription URL и device count.
- [x] Нормализовать trial/active/expiring/expired/limited/loading/error state в
  явный presentation DTO/array contract.
- [x] Не раскрывать полный subscription URL в logs или ненужных shared props.
- [x] Реализовать dashboard sections и actions по Pen; будущие разделы видны,
  но disabled по принятому owner contract из audit, без placeholder routes.
- [x] Добавить retry UX для Remnawave failure без ложного active state, включая
  network/HTTP failure самого Inertia reload.
- [x] Добавить authorization и Inertia Feature tests, включая query count/
  remote fake expectations.

## Критерии готовности

- Shell переключается mobile/tablet/desktop без дублирования route content.
- Dashboard поддерживает trial/active/expiring/expired/limited/loading/service
  error. Восьмой пример Pen board, discount applied, принадлежит оплате шага 9
  и не выдаётся за подтверждённую скидку dashboard.
- Remote failure не маскируется cached/demo данными.
- Bottom nav/sidebar имеют корректный active state и accessible labels.
- Props минимальны, сериализуемы и не содержат секретов.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=AccountDashboard
./vendor/bin/sail artisan route:list --except-vendor
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --dry-run --diff --using-cache=no --sequential app/Http/Controllers/Account app/Services/Account app/Policies/AccountDashboardPolicy.php app/Remnawave/BaseApi.php routes/web.php tests/Feature/AccountDashboardTest.php
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run build
git diff --check
```

## Сценарии проверки

- Trial, active, expiring, expired и limited users.
- Remnawave timeout/error и successful retry.
- 0/2/5 devices и long expiration labels.
- Mobile `Ещё`: open, close, navigate, logout, focus return.
- Tablet `Ещё`: centered open/close, backdrop below header, focus return и
  отсутствие horizontal overflow.
- Desktop sidebar active state для каждой account route.
- Light/dark при route navigation.

## Выполненная проверка — 2026-10-20

- [x] AccountDashboard: 26 tests / 523 assertions; authorization, owned mapping,
  remote states/expiry, 0/2/5 devices, timeouts/retry, query count, safe props,
  encrypted history и logout.
- [x] Полный Laravel suite: 189 tests / 1548 assertions; failures 0, 178
  deprecated из существующей PDO config остаются.
- [x] Frontend 49/49; client/SSR build; route:list; PHP CS Fixer 0 fixable.
- [x] Read-only Pen role matrix: 900/1040/1120 content endpoints, sidebar fill,
  desktop title. Sidebar прокручивается при малой доступной высоте.
- [x] Browser DOM probes mobile dashboard и tablet More 520×372: modal label,
  initial focus, inert, scroll lock, Tab/Shift+Tab/Escape handlers, focus return.
- [x] Browser responsive/theme 16/16 и state matrix 48/48; long labels и
  text-only ×2 на 320 без overflow/clipped buttons; More mobile/tablet в обеих
  темах, logout busy, navigation-close, resize и scrollable desktop sidebar.
- [x] Browser regression network/503 → error → fresh success, один request при
  double retry. Измеренные header/nav offsets работают через `@theme inline`:
  77/159 px header соответствует backdrop, padding учитывает выросший nav.
- [ ] Native keyboard и полная screenshot comparison. Capture timeout /
  `A capture is already running` не засчитываются как проверка.
- [ ] Operational SSR/hydration sign-off — отложенный `U-22` / шаг 15.

Повторный screenshot smoke после обновления Browser владельцем 2026-10-20
также не прошёл: header capture timeout 60s, прямой CDP capture timeout 30s,
затем `A capture is already running`. Изображений нет; screenshot comparison
не отмечена выполненной. Подробности в account dashboard audit.

