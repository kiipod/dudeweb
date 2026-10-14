# Шаг 10 — Подключение и устройства

## Цель задачи

Реализовать connection page с выбором платформы, copyable subscription link,
пошаговыми инструкциями и переходом к подтверждённой поддержке.

## Зависимости

- Завершён шаг 9.
- Решены `U-05`, `U-10`, `U-21`.
- Remnawave subscription URL/HWID handlers.
- Pen screen `P` в mobile/tablet/desktop, dark/light.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` —
  responsive selector/instructions UI, explicit data flow и styling.
- `laravel-best-practices` — authorization, FormRequest/action boundary,
  outbound Remnawave timeouts/errors/fakes и secret-safe props.
- `laravel-13-attribute-refactor` — условно для approved configuration после
  проверки фактически установленного framework.

## Конкретные действия

- [ ] Передавать subscription URL и device metadata только authenticated user.
- [ ] Не сохранять subscription URL в localStorage, analytics или logs.
- [ ] Реализовать platform selector для Windows, macOS, Linux, Android и iOS.
- [ ] Передавать `platforms[]` с app/download links и упорядоченными
  platform-specific instructions из backend-каталога, скопированного из общего
  content Remnawave subscription page; не хардкодить вторую копию во Vue.
- [ ] Если данные платформы отсутствуют, использовать честный unavailable state,
  а не placeholder URL.
- [ ] Реализовать copy action с success/error feedback и manual-copy fallback.
- [ ] Реализовать три шага подключения из Pen.
- [ ] Подключить `Как подключиться` и `Нужна помощь` к подтверждённым routes.
- [ ] Отобразить device count/limit без дублирования device-limit rules.
- [ ] При наличии удаления устройства использовать существующий Remnawave
  contract через отдельный FormRequest/action и authorization.
- [ ] Добавить loading/error/retry states для Remnawave calls.
- [ ] Добавить Feature tests с HTTP fakes и authorization checks.

## Критерии готовности

- Subscription link доступна только владельцу session.
- Все platform controls доступны клавиатурой и имеют selected state.
- Copy feedback работает в secure context и fallback mode.
- Ни один download/support link не является placeholder.
- Remnawave error не раскрывает credentials или internal response.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Connection
./vendor/bin/sail artisan test --filter=Hwid
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Services tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- Каждая из пяти платформ и keyboard selection.
- Clipboard success, permission denied и unsupported browser.
- Missing subscription URL, Remnawave timeout и retry.
- Device counts 0, limit-1, limit и over-limit domain state.
- Session user пытается получить ссылку другого пользователя.
