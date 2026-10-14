# Шаг 7 — Аутентификация и восстановление доступа

## Цель задачи

Реализовать только утверждённый web-auth contract и соответствующие Pen pages:
login, registration, recovery, reset-link-sent, new password и
password-changed.

## Зависимости

- Завершён шаг 6.
- Обязательно решены `U-01`–`U-04` и `U-13`.
- Pen screens `M`, `N`, `O`, `O2`, `O3`, `O4` в mobile/tablet/desktop,
  dark/light.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — auth UI,
  component/data-flow contracts и styling.
- `laravel-best-practices` — routing, FormRequests, security, rate limiting,
  session/error handling и Feature tests.
- `laravel-13-attribute-refactor` — только если controller/FormRequest или
  Container/DI configuration затрагивает approved attribute concern; каждый
  attribute сначала проверяется в установленном `laravel/framework`.

Если identity/storage/reset delivery не утверждены, шаг блокируется: нельзя
создавать email/password flow поверх Telegram-only модели предположительно.

## Конкретные действия

- [ ] Добавить routes и thin controllers в соответствии с утверждённой auth
  архитектурой.
- [ ] Вынести validation/authorization в FormRequest; не использовать inline
  controller validation.
- [ ] Добавить rate limiting для login, registration и recovery.
- [ ] Использовать Inertia responses/redirects и standard validation error bag.
- [ ] Реализовать auth pages через `<script setup>` и `useForm()`.
- [ ] Сопоставить `processing`, `errors`, `recentlySuccessful` с Pen states.
- [ ] Использовать локальные focused form components только при подтверждённом
  повторном использовании; UI library contract не предполагать, так как такая
  dependency в текущем checkout отсутствует.
- [ ] Реализовать password visibility control с accessible label.
- [ ] Настроить autocomplete: `email`, `current-password`, `new-password`.
- [ ] Заблокировать duplicate submit во время `processing`.
- [ ] Показать server/global error через inline alert, не только toast.
- [ ] Сохранить intended destination после login.
- [ ] После registration сразу создать authenticated `web` session и запустить
  idempotent Remnawave provisioning; не добавлять email verification route,
  notification или `verified` middleware.
- [ ] При Remnawave failure сохранить local account и показать retryable
  `service_error`; повторный provisioning использует тот же non-PII key.
- [ ] Реализовать logout/CSRF/session regeneration по framework conventions.
- [ ] Не добавлять social providers: они отсутствуют в Pen и контрактах.
- [ ] Добавить Feature tests для success, validation, rate limit,
  authentication и guest/auth redirects.

## Критерии готовности

- Все шесть auth/password states имеют реальные маршруты и проверенные flows.
- Password/token/email handling соответствует выбранной модели и не ослабляет
  CSRF/session security.
- Forms доступны с клавиатуры и объявляют ошибки полям.
- Loading/error/success states соответствуют Pen и server responses.
- Нет fake reset email или неработающей регистрации.

## Команды проверки

```bash
./vendor/bin/sail artisan route:list --except-vendor
./vendor/bin/sail artisan test --filter=Auth
./vendor/bin/sail artisan test --filter=Password
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http routes tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- Login: valid, invalid credentials, validation, throttled, double submit.
- Registration: mismatch password, existing identity, immediate authenticated
  success, Remnawave success/failure/idempotent retry без email verification.
- Recovery: unknown/known identity без user enumeration.
- Reset: invalid, expired, reused и valid token.
- Authenticated user открывает guest-only route.
- Guest открывает protected account route и возвращается после login.

