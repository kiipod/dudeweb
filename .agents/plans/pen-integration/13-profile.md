# Шаг 13 — Профиль, безопасность и theme preference

## Цель задачи

Реализовать profile page на подтверждённой identity model, включая account
information, security actions, theme selector и logout.

## Зависимости

- Завершён шаг 12.
- Решены `U-01`, `U-04`, `U-11`, `U-14`, `U-21`.
- Pen screen `S` в mobile/tablet/desktop, dark/light.

## Конкретные действия

- [ ] Передавать только подтверждённые profile fields; не показывать demo email.
- [ ] Определить read-only/editable fields и authorization contract.
- [ ] Если доступна смена password, использовать отдельный FormRequest,
  current-password validation и session invalidation policy.
- [ ] Если password отсутствует в identity model, не показывать неработающий
  action; отразить утверждённую альтернативу.
- [ ] Реализовать logout через POST/DELETE с CSRF, не ссылкой GET.
- [ ] Реализовать selector `Системная / Светлая / Тёмная` как accessible
  single-choice control.
- [ ] Сохранять preference в утверждённом client/server storage.
- [ ] Синхронизировать system mode change без reload.
- [ ] Реализовать loading/error/success feedback для security operations.
- [ ] Добавить Feature tests для authorization, update/password/logout.
- [ ] Проверить, что theme preference не попадает в business User fields без
  отдельной schema decision.

## Критерии готовности

- Profile показывает реальные поля выбранной identity model.
- Logout, password/security action и theme selector функциональны.
- Нельзя изменить или прочитать чужой профиль.
- Theme сохраняется согласно contract и не вызывает flash/hydration mismatch.
- Отсутствующие возможности не представлены активными controls.

## Команды проверки

```bash
docker compose exec -T laravel.test php artisan test --filter=Profile
docker compose exec -T laravel.test php artisan test --filter=Password
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Services tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- Read-only profile с длинными identity values.
- Password change: wrong current, mismatch, success, session behavior.
- Logout success, CSRF failure и back-button cache.
- System/light/dark, OS theme change и hard reload.
- Mobile/tablet bottom nav и desktop sidebar active state.

