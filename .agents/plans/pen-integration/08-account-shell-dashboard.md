# Шаг 8 — Account shell и dashboard

## Цель задачи

Создать responsive account shell и dashboard на реальных User/Remnawave данных,
включая все account states из Pen.

## Зависимости

- Завершён шаг 7.
- Решены `U-05`, `U-12`, `U-14`, `U-21`, `U-22`.
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

- [ ] Создать protected account routes и Account layout.
- [ ] Реализовать mobile/tablet top header + bottom navigation.
- [ ] Реализовать desktop sidebar, top bar и active route indication.
- [ ] Реализовать mobile/tablet bottom-sheet `Ещё` с
  invite/support/profile/logout: full-width на mobile и `520 x 372`,
  центрированный снизу, на tablet; desktop использует sidebar без `K2` state.
- [ ] Реализовать доступный local bottom-sheet/dialog component в соответствии
  с Pen и `U-20`, не добавляя новую UI dependency без отдельного решения.
- [ ] Управлять focus trap, `Escape`, background scroll и focus return.
- [ ] Создать focused service/action, собирающий dashboard view data из local
  User и Remnawave; controller остаётся orchestration layer.
- [ ] Не сохранять remote truth в новые local поля без отдельного domain
  решения.
- [ ] Передать через Inertia props plan, status, expiration, remaining days,
  subscription URL и device count.
- [ ] Нормализовать trial/active/expiring/expired/limited/loading/error state в
  явный presentation DTO/array contract.
- [ ] Не раскрывать полный subscription URL в logs или ненужных shared props.
- [ ] Реализовать dashboard sections и actions по Pen.
- [ ] Добавить retry UX для Remnawave failure без ложного active state.
- [ ] Добавить authorization и Inertia Feature tests, включая query count/
  remote fake expectations.

## Критерии готовности

- Shell переключается mobile/tablet/desktop без дублирования route content.
- Dashboard поддерживает восемь Pen account states.
- Remote failure не маскируется cached/demo данными.
- Bottom nav/sidebar имеют корректный active state и accessible labels.
- Props минимальны, сериализуемы и не содержат секретов.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=AccountDashboard
./vendor/bin/sail artisan route:list --except-vendor
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Services routes tests/Feature
npm run build
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
- Light/dark/system при route navigation.

