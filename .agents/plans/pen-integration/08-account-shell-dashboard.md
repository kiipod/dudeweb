# Шаг 8 — Account shell и dashboard

## Цель задачи

Создать responsive account shell и dashboard на реальных User/Remnawave данных,
включая все account states из Pen.

## Зависимости

- Завершён шаг 7.
- Решены `U-05`, `U-12`, `U-14`, `U-21`, `U-22`.
- Pen `J`, `V`, `K`, `K2`, `U`, `U2` во всех viewport/theme variants.

## Конкретные действия

- [ ] Создать protected account routes и Account layout.
- [ ] Реализовать mobile/tablet top header + bottom navigation.
- [ ] Реализовать desktop sidebar, top bar и active route indication.
- [ ] Реализовать mobile bottom-sheet `Ещё` с invite/support/profile/logout.
- [ ] Использовать `UDrawer` или другой подтверждённый Nuxt UI primitive в
  соответствии с Pen и `U-20`.
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
docker compose exec -T laravel.test php artisan test --filter=AccountDashboard
docker compose exec -T laravel.test php artisan route:list --except-vendor
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Services routes tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- Trial, active, expiring, expired и limited users.
- Remnawave timeout/error и successful retry.
- 0/2/5 devices и long expiration labels.
- Mobile `Ещё`: open, close, navigate, logout, focus return.
- Desktop sidebar active state для каждой account route.
- Light/dark/system при route navigation.

