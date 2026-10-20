# Шаг 13 — Профиль, безопасность и theme preference

## Цель задачи

Реализовать profile page на подтверждённой identity model, включая account
information, security actions, theme selector и logout.

## Зависимости

- Завершён шаг 12.
- Решены `U-01`, `U-04`, `U-11`, `U-14`, `U-21`.
- Pen screen `S` в mobile/tablet/desktop, dark/light.

## Продолжение — 2026-10-20

Шаг 12 закрыт в `1d83bd9`, ветка `pen-integration`, checkout чистый.
Выбраны `php-per-cs3` (первым), `laravel-best-practices`,
`laravel-13-attribute-refactor`, `frontend-design`, `vue-best-practices`,
`tailwind-best-practices`. Актуальные U-02/U-11 и route/action registry требуют
renewed email verification; старое условие «без verification» ниже исправлено.
Email/password — local identity; numeric `remnawave_user_id`, entitlement и
удалённые credentials не меняются. До завершения provisioning email не меняется:
иначе ambiguous remote create с прежним email потеряет ownership proof. Names и
password остаются редактируемыми; UI показывает фактическую capability.

Read-only Pen sources: mobile `AxIiC/iIBik`, tablet `jNyep/DDI5i`,
desktop `Razno/GvSnV`, FHD `VQJzQ/k4w1Xt`, QHD `I0x6P/k5hp1C`.

| Роль | 390 | 768 | 1440 | 2560 |
| --- | --- | --- | --- | --- |
| Content width | 350 | 640 | 900 | 1120 |
| Top / content gap | 18 / 12 | 28 / 12 | 32 / 12 | 32 / 12 |
| Heading / section / body | 34 / 20 / 15 | 42 / 22 / 16 | 48 / 24 / 17 | 64 / 32 / 21 |
| Account card padding / gap | 15 / 12 | 15 / 12 | 15 / 12 | 15 / 12 |
| Action / theme row min height | 56 | 60 | 64 | 72 |
| Theme inset / gap | 6 / 6 | 6 / 6 | 6 / 6 | 6 / 6 |

Reuse interface typography, background, input/accent-soft/error tokens and
shared controls. Account card light/dark `#F8F5EE/#14151B` gets semantic profile
surface token. Two choices replace Pen's obsolete System option per U-14.
Alignment stays left; controls grow with content and text enlargement.

Component map: thin `Account/Profile` page composes `ProfileIdentity`
(confirmed data + editable form), `ProfileSecurity` (independent password and
other-session forms), `ProfileTheme` (native radio group using existing
`useTheme`) and `ProfileLogout` (existing DELETE endpoint). `ProfileService`
owns locked identity/security mutations; `ProfileData` exposes only safe fields
and capabilities. Requests/Gate policy scope every mutation to session owner.
No linking, merge, unlink, account deletion or theme server endpoint is added.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — profile
  hierarchy, form/theme interactions, component contracts и styling.
- `laravel-best-practices` — FormRequests, authorization, session/security
  behavior и Feature tests.
- `laravel-13-attribute-refactor` — условно для approved configuration после
  проверки installed framework source.

## Конкретные действия

- [x] Передавать только подтверждённые profile fields; не показывать demo email.
- [x] Реализовать editable first name, last name и email; email меняется после
  normalized uniqueness и current-password проверки с новым подтверждением
  адреса согласно актуальным U-02/U-11.
- [x] Если доступна смена password, использовать отдельный FormRequest,
  current-password validation и session invalidation policy.
- [x] Если password отсутствует в identity model, не показывать неработающий
  action; отразить утверждённую альтернативу.
- [x] Реализовать logout через POST/DELETE с CSRF, не ссылкой GET.
- [x] Реализовать selector `Светлая / Тёмная` как accessible single-choice
  control без третьего системного режима.
- [x] Сохранять preference в утверждённом client/server storage.
- [x] Использовать OS preference только как первоначальный fallback при пустом
  или legacy storage; после выбора не синхронизировать тему с OS.
- [x] Реализовать loading/error/success feedback для security operations.
- [x] Показывать Telegram connection только как read-only status; не добавлять
  deferred linking/merge/unlink controls.
- [x] Добавить Feature tests для authorization, update/password/logout.
- [x] Проверить, что theme preference не попадает в business User fields без
  отдельной schema decision.

## Критерии готовности

- Profile показывает реальные поля выбранной identity model.
- Logout, password/security action и theme selector функциональны.
- Нельзя изменить или прочитать чужой профиль.
- Theme сохраняется согласно contract и не вызывает flash/hydration mismatch.
- Отсутствующие возможности не представлены активными controls.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Profile
./vendor/bin/sail artisan test --filter=Password
./vendor/bin/sail artisan test --compact
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential <changed-php-paths>
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run build
./vendor/bin/sail npm run test:e2e
git diff --check
```

## Сценарии проверки

- Read-only profile с длинными identity values.
- Password change: wrong current, mismatch, success, session behavior.
- Logout success, CSRF failure и back-button cache.
- Light/dark, первоначальный OS fallback и hard reload.
- Mobile/tablet bottom nav и desktop sidebar active state.

## Результаты проверки — 2026-10-20

Implementation и CSR/browser verification завершены. По запросу владельца
этап принят и закрыт текущим коммитом.
Шаг 14 не начат. Все runtime-команды выполнялись через Sail.

- Laravel: **277 tests / 2628 assertions**, включая **17 ProfileTest** и
  существующие PasswordRecovery/EmailVerification scenarios. Существующие PDO
  PHP 8.5 deprecations не менялись. Проверены verified web boundary, отсутствие
  чужих profile routes/data, forged owner/secret/provider/theme fields,
  normalized uniqueness и current-password proof, names-only update без
  verification reset, email change с новым signed link, invalid старого link,
  отсутствие повторного remote provisioning, retryable mail failure.
- Password/session tests проверяют wrong current, mismatch, minimum и bcrypt
  byte limit; смену hash и remember token, отзыв reset links, сохранение текущего
  login и смену session ID, отказ старой второй сессии и старого remember cookie.
  Auth guard выбирается явно: web. Проверка пароля и capability повторяется
  под user row lock; sensitive fields не попадают в flash input/logs.
- Реальный CSRF middleware включён для отдельных HTTP-тестов: profile/password
  и logout без token возвращают 419. GET logout запрещён, DELETE завершает
  текущий сеанс. Profile response: no-store, private и encrypted history.
- Frontend Node: **70/70**. Финальный полный Playwright: **337/337**, включая
  **46 profile scenarios**. Profile fixture использует реальный server-approved
  encryptHistory: true; после logout/back ключ отсутствует, Inertia выполняет
  новый GET, и приватный профиль не восстанавливается из browser history.
- Responsive screenshots: light/dark на
  320/360/390/768/1024/1440/1920/2560; на 320 — long identity/Telegram values
  и text ×2 отдельно для read/edit/password/sessions states. Проверены
  keyboard submit, duplicate intent/busy, server-owned success, validation,
  HTTP/network errors, сохранение безопасного draft и очистка password fields.
- Исправлена очистка security forms: Inertia после успеха запоминает submitted
  values как defaults, поэтому explicit empty defaults устанавливаются до
  reset. Регрессия закреплена success/failure browser tests.
- Theme проверен с empty/legacy/stored preference, hard reload, native radio
  keyboard, header toggle, отказом localStorage и блокировкой app bundle:
  bootstrap применяет сохранённую тему до загрузки JavaScript приложения.
  Последующие изменения OS не меняют выбор. Только light/dark, без DB field,
  server theme endpoint или синхронизации с OS после первоначального fallback.
- Profile включён в header, More и desktop sidebar. Обновлены прежние тесты,
  которые считали его disabled: Tab/Shift+Tab теперь явно проходят Profile link
  между Support и Logout; focus trap, restore и geometry checks сохранены.
- Read-only Pen S заново прочитан на пяти размерах и обеих темах; mobile и QHD
  screenshots сопоставлены с реализацией. Отклонения обусловлены утверждённым
  functionality: реальные names при наличии, edit forms, Telegram status,
  безопасное завершение других сеансов и две темы вместо obsolete System.
- Email до завершения provisioning остаётся read-only; сервер повторно
  проверяет numeric mapping до сохранения. Это сохраняет ownership proof при
  ambiguous remote create. Passwordless identity также не получает email или
  password/session mutation controls. Для нового адреса existing account
  verification screen показывает соответствующий текст, не обещает новый trial.
- Auth и RedirectToRoute проверены по установленному framework source:
  target, constructor и integration. Gate methods находятся в отдельной policy.
  Migration/schema/dependencies не менялись. Client/SSR build, scoped PER-CS3
  formatter и git diff --check проходят; method PHPDoc проверен отдельно.
  Generated bootstrap/ssr/* исключены из diff.

Artifacts: test-results/account-profile-* и Playwright report не коммитятся.
Operational SSR (U-22), физическая keyboard/screen-reader matrix и production
SMTP deliverability остаются в шаге 15. Browser CSR/bootstrap checks не являются
SSR/hydration sign-off. Telegram linking/merge/unlink и account deletion не
реализуются; Remnawave entitlement/credentials и исходный Pen не менялись.
