# Шаг 7 — Аутентификация и восстановление доступа

## Дополнение владельца — 2026-10-19 (implementation готов)

Шаг 7 повторно открыт только для email verification и SMTP. Прежнее решение
о регистрации без подтверждения email отменено этим запросом. Шаг 8 не начат.

- [x] Добавить nullable `email_verified_at` новой обратимой migration и
  Laravel `MustVerifyEmail`, `Registered`, `VerifyEmail`, signed routes и
  `EmailVerificationRequest::fulfill()` / `Verified`.
- [x] Сохранить authenticated web session после регистрации; до подтверждения
  не обращаться к Remnawave и не выдавать бесплатный доступ. Защитить account,
  provisioning и web payment routes через `verified`, а provisioning service —
  отдельной проверкой persisted verification.
- [x] Отсчитывать три пробных дня от сохранённого `email_verified_at`;
  idempotent retries не меняют дату и не продлевают trial. Существующие remote
  accounts не пересоздавать; прежние web rows не backfill-ить verified.
- [x] Добавить notice/resend/logout UI с processing, honest SMTP errors и
  per-user resend throttle; сохранить intended destination, включая verification
  link после login. Recovery не обходит verification.
- [x] Добавить dev Mailpit и SMTP env example, настроить локальный `.env`,
  проверить реальные verification и recovery письма через SMTP.
- [x] Описать production SMTP/STARTTLS/SMTPS, secrets, HTTPS `APP_URL`, migration,
  config cache и отдельную проверку реальной доставки в [docs/mail.md](../../../docs/mail.md).
- [x] Пройти focused/full tests, frontend checks, client/SSR build, formatter,
  responsive/light-dark проверку нового состояния и `git diff --check`.

Live Pen прочитан read-only: 215 top-level frames, O2 status references
`qV2vd/wtQv3/aZlFJ/SDOrj` и light pairs. Отдельного verification frame нет.
Новая page использует существующие AuthShell/AuthStatus/BaseButton/InlineAlert,
без новой визуальной системы. Role matrix: h1 34/42/48/64, body 15/16/17/21,
controls 56/60/64/72, content viewport−40/600/640/800 для mobile/tablet/
desktop/QHD. Pen не меняется. Полная visual/native keyboard приёмка остаётся
открытой в шаге 15, новая page требует visual review как новый route-state.

Component boundary: `Auth/VerifyEmail` получает email/status/errors от сервера,
владеет двумя `useForm` для resend/logout; shell/status/shared controls сохраняют
свои роли. Registered event отправляет framework notification синхронно;
ошибка SMTP не удаляет аккаунт и не выдаётся за успешную отправку.

## Исторический статус — 2026-10-18

Шаг 6 принят и закоммичен в `b126f4b`. Backend и UI шага 7 реализованы;
Feature/component tests, build и DOM matrix проходят. По явному решению владельца
«делаем коммит и закрываем задачу» шаг 7 и UI reconciliation приняты и закрыты
как implementation этап. Native keyboard, полная screenshot comparison и
operational mail delivery перенесены в шаг 15 и не считаются пройденными.
На момент закрытия dev использовал `log`, поэтому recovery показывал unavailable.
Дополнение 2026-10-19 заменяет dev transport на SMTP/Mailpit; реальная
production доставка остаётся отдельной обязательной проверкой. Шаг 8 не начинается.

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

- `php-per-cs3` — первым для любого PHP-кода, PER-CS 3.x.
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

- [x] Добавить routes и thin controllers в соответствии с утверждённой auth
  архитектурой.
- [x] Вынести validation/authorization в FormRequest; не использовать inline
  controller validation.
- [x] Добавить rate limiting для login, registration и recovery.
- [x] Использовать Inertia responses/redirects и standard validation error bag.
- [x] Реализовать auth pages через `<script setup>` и `useForm()`.
- [x] Сопоставить `processing`, `errors`, `recentlySuccessful` с Pen states.
- [x] Использовать локальные focused form components только при подтверждённом
  повторном использовании; UI library contract не предполагать, так как такая
  dependency в текущем checkout отсутствует.
- [x] Реализовать password visibility control с accessible label.
- [x] Настроить autocomplete: `email`, `current-password`, `new-password`.
- [x] Заблокировать duplicate submit во время `processing`.
- [x] Показать server/global error через inline alert, не только toast.
- [x] Сохранить intended destination после login.
- [x] Исходная registration с немедленным authenticated provisioning реализована
  в предыдущем этапе; этот пункт superseded дополнением 2026-10-19: session
  создаётся сразу, provisioning разрешён только после verification.
- [x] При Remnawave failure сохранить local account и показать retryable
  `service_error`; повторный provisioning использует тот же non-PII key.
- [x] Реализовать logout/CSRF/session regeneration по framework conventions.
- [x] Не добавлять social providers: они отсутствуют в Pen и контрактах.
- [x] Добавить Feature tests для success, validation, rate limit,
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
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --dry-run --diff --using-cache=no --sequential <changed PHP paths>
./vendor/bin/sail npm run build
git diff --check
```

## Сценарии проверки

- Login: valid, invalid credentials, validation, throttled, double submit.
- Registration: mismatch password, existing identity, immediate authenticated
  success, ожидание verification, затем Remnawave success/failure/idempotent retry.
- Recovery: unknown/known identity без user enumeration.
- Reset: invalid, expired, reused и valid token.
- Authenticated user открывает guest-only route.
- Guest открывает protected account route и возвращается после login.

## Исторический source и implementation contract — 2026-10-18

Auth/provisioning/mail части ниже superseded дополнением 2026-10-19 выше;
остальные принятые UI/backend contracts сохраняются.

Read-only Pen inventory: `215` top-level frames, `10` reusable components,
`19` variables. К прежним `139` добавлены `76` Full HD/QHD references на
`1920×1080`/`2560×1440`: `24` auth и `52` account/payment. Это responsive
references существующих routes/states, без новых business flows. Для auth
прочитаны все `60` frames M/N/O/O2/O3/O4, включая новые wide copies; остальные
новые references подлежат чтению при реализации соответствующих шагов.

Visual foundation: Night/Paper `#0A0A0B/#FBF9F4`, auth input
`#111218/#F5F1EA`, input border `#3A3F55/#D8D0C4`, общие accent и text tokens,
IBM Plex Sans/Mono. Mobile gutter `20 px`, header `76 px` (`68 px` registration),
После повторного запроса владельца сверены изменённые screen instances:
tablet content `600 px`, desktop/1920 content `640 px`, QHD `800 px`. Page titles
`34/42/48/64 px`, fields/actions `56/60/64/72 px`; intermediate `650` воспроизводится через принятую Pen renderer
mapping к browser `400`. Нет декоративных cards/shadows или новой motion.
Полная матрица ролей и общие component boundaries — в
[UI reconciliation](2026-10-18-ui-reconciliation.md). Обычный intro —
`16/17/20/24 px`, field/label/link/status copy — `15/16/17/21 px`, action —
`15/16/17/19 px`; wordmark `20/22/22/26 px`. Поля используют общие interface
tokens; auth и promo сохраняют свои подтверждённые border roles.

Component map:

- `AuthShell`: header, main, bounded content и fixed responsive variants;
  используется утверждённый `BrandLink` вместо отдельного текстового logo.
- `BaseField`: прежний default и fixed auth variant; label, native input,
  error/hint association и icon/suffix. Auth input tokens — CSS-first.
- `PasswordField`: model, independent visibility, accessible non-submit toggle,
  autocomplete и disabled state; без request/business logic.
- `AuthStatus`: декоративный status icon для двух server-confirmed states.
- `Auth/Login`, `Register`, `ForgotPassword`, `ResetPassword`: по одной focused
  форме с `useForm`; processing блокирует controls, errors приходят с сервера.
  Success после redirect определяется server flash (`passwordChanged`/
  `linkRequested`), а не кратким `recentlySuccessful` на размонтированной форме.
- `Auth/AccountReady`: минимальный protected результат registration на
  `/account` с реальным retry/logout до dashboard шага 8. Нет account shell,
  подписки, тарифа, connection data или выдуманного subscription status.

Новая migration добавляет nullable unique normalized email, nullable hashed
password, remember token, numeric remote ID, durable non-PII key и provisioning
state; Telegram identity становится nullable. PostgreSQL CHECK сохраняет хотя
бы один identity channel. Отдельная migration создаёт broker token table.
Rollback identity migration отказывается удалять web identity, пока существуют
web-only rows; он не уничтожает их молча. В dev применены только эти две
миграции, production schema не менялась.

Регистрация создаёт независимый local account с `INACTIVE`, сразу логинит
через `web` и регенерирует session. Provisioning сериализован по local user:
GET по сохранённому `web_<random UUID>` key, POST только после 404, подтверждение
key/email/отсутствия Telegram identity, сохранение numeric ID и remote-derived
tag. При timeout/local persistence failure повтор сверяет тот же key и не
продлевает trial. Trial повторяет действующие bot параметры: три дня от local
creation, 30 GiB и текущий squad. При сбое account/session сохраняются,
durable state — `service_error`; retry принадлежит текущему `web` user через
FormRequest/Gate. Существующие Telegram rows не backfill-ятся предположительно.
При наличии numeric ID `UserStateManager` читает по нему; legacy Telegram
username fallback сохраняется. Scheduled web lifecycle/device UI — следующие
account steps; существующие Telegram rules не менялись.

`users` broker, normalization и rate limiting используют явные web contracts;
MoonShine default guard/broker сохранены. `#[Auth('web')]` проверен в installed
Laravel `13.35.0`: parameter target, constructor, StatefulGuard resolution и Container
integration; работа DI подтверждена Feature tests. Authenticated account и
payment requests используют `auth.session`, чтобы смена password hash
инвалидировала старые сессии. Passwords/key/remember token скрыты при serialization.

Recovery не раскрывает наличие identity: одинаковый request-confirmed ответ
для known/unknown email, broker throttle и per-recipient delivery failure.
Текст не утверждает успешную доставку. При глобально неподходящем transport
(`log`/`array` вне tests, composite transports без отдельного operational
подтверждения) форма показывает unavailable до обращения к identity.
Notification синхронная, с реальным framework token и `users` expiry; worker
не предполагается. Для production требуется operational SMTP/другой реальный
прямой mailer и корректный From. Fake/log mail не выдаётся за delivered.

Legal acceptance copy/links отсутствуют до U-28; подтверждение несуществующих
документов не добавлено. Linking/merge, social auth и verification не реализуются.

## Проверка — 2026-10-18

- [x] Auth/password Feature tests: `25 tests / 245 assertions`; invalid credentials,
  normalized unique identity, validation, throttles, immediate auth, provisioning
  success/failure/ambiguous POST/retry/conflict, guard isolation, logout, stale
  session invalidation, real broker token/expiry/reuse и identity CHECK.
- [x] Полный Laravel suite: `146 tests / 861 assertions`, failures нет.
  `135 deprecated` из-за существующего PDO constant в database config;
  `11 passed` без этого предупреждения. Это не warning-free suite.
- [x] `34/34` Node frontend tests, включая четыре новых auth component tests:
  label/error association, escaped errors, disabled/loading, visibility controls.
- [x] Client/SSR build; dependencies не добавлены.
- [x] DOM responsive matrix: четыре form routes × семь widths
  `320/360/390/768/1024/1440/2560` × две темы — `56` cases, overflow/clipping 0,
  один main/h1, labels связаны, цвета inputs совпадают с Pen.
- [x] Повторная matrix после обновления live Pen: `64/64` cases, четыре form
  routes × `320/360/390/768/1024/1440/1920/2560` × light/dark. Heading,
  intro, field/label/action/wordmark font sizes, field height и width совпали
  с новой таблицей с tolerance `0.51 px`; overflow/clipped controls нет.
  Повторный text-only ×2 на 320 px: `4/4`, overflow/clipping нет.
- [x] Shared UI SSR-preview: 16 component compositions без Vue warnings;
  `12/12` browser cases на 320/390/768/1440/1920/2560 × light/dark:
  action/field/period/copy/badge/heading/status/payment geometry и desktop
  sidebar 280/52/logo54. Preview не является приёмкой будущих account pages.
- [x] После UI reconciliation: `35/35` frontend tests и client/SSR build;
  добавлена regression для регистрации mail/lock/eye/eyeOff в UiIcon validator.
- [x] Live invalid login: server error у email, aria-describedby/invalid,
  password очищен. При задержанном XHR duplicate click даёт один request;
  processing делает submit/inputs native disabled, после ответа controls доступны.
- [x] Live recovery с dev log mailer: inline unavailable, success state не показан.
- [x] Text-only font-size ×2 на 320 px: все четыре form routes без overflow
  после исправления implicit grid minimum (`grid-cols-1`). До исправления
  login/recovery давали overflow `68/10 px`; временные стили удалены reload.
- [x] PHP CS Fixer dry-run по 27 PHP files: 0 changes; `git diff --check`.
- [ ] Native Tab/Shift+Tab/Enter matrix: CDP key commands не переместили focus;
  DOM focus/toggle не выдаются за native keyboard sign-off.
- [ ] Полная live visual comparison с Pen; существующий capture failure не
  заменяется DOM measurements.
- [ ] Operational reset delivery на реальную почту с production-like mailer.

Дополнительно найден и исправлен focus-visible defect существующего BaseField:
`outline-none` оставлял `outline-style:none` при `:focus-visible`. Явный
`focus-visible:outline-solid` проверен по installed Tailwind source и build;
browser regression до исправления показала `none` при outline width `2 px`.
После исправления CDP CSS forced focus-visible показал `solid / 2 px /
rgb(91, 97, 230)`; forced pseudo state снят. Это проверка CSS focus ring,
не подмена открытого native keyboard сценария.


## Проверка дополнения verification / SMTP — 2026-10-19

- [x] 17 новых verification Feature tests: account/payment/service guards,
  login intent и signed link после login, valid/expired/tampered/foreign/stale-email
  links, once-only Verified event и trial, resend throttle независимо от IP,
  SMTP failure и log-only unavailable, Telegram/MoonShine isolation, remote
  outage/retry без продления trial, existing remote account без повторного
  provisioning, reset без обхода verification, expiry и reversible migration.
- [x] Полный Sail Laravel suite: 163 tests / 1022 assertions, failures 0.
  PHPUnit показывает 152 deprecated и 11 passed; причина — существующий
  `PDO::MYSQL_ATTR_SSL_CA` в database config, не warning-free результат.
- [x] Frontend suite 35/35; client/SSR build проходит. Generated tracked
  `bootstrap/ssr/*` восстановлены к исходному состоянию, dependencies не добавлены.
- [x] PHP CS Fixer dry-run по 21 PHP files: 0 fixable; `git diff --check`.
- [x] Dev Mailpit v1.31.6 healthy, UI только `127.0.0.1:8025`, SMTP только
  Docker network. Локальный ignored `.env` настроен; применена только новая
  verification migration. Production compose/environment не менялись.
- [x] Operational SMTP smoke: Mailpit реально получил verification и recovery
  письма с настоящими application links. HTTP signed verification прошёл на
  временном dev user с подменённым в памяти Remnawave outage; confirmation
  сохранена, service_error честный, реальных provider calls нет. Временный
  user/reset token удалены; SMTP сообщения оставлены для просмотра в Mailpit.
- [x] Browser: реальная registration → VerifyEmail; server-confirmed success,
  один XHR при duplicate click, resend/logout disabled при processing,
  затем восстановлены; повторный resend показывает inline rate-limit error.
  Browser test account без remote ID удалён после проверки.
- [x] Light/dark DOM matrix 16/16: 320/360/390/768/1024/1440/1920/2560,
  QHD при 1440 px высоты. Overflow/clipped buttons 0, один main/h1;
  h1 34/42/48/64, controls 56/60/64/72, bounded content 600/640/800.
  Text-only ×2 на 320 px: overflow/clipping 0, кнопки растут по содержимому.
  Временные XHR hooks/styles/theme/viewport/focus emulation восстановлены.
- [ ] Visual screenshot review нового verification state: focused section
  capture снова завершился timeout 60s; он не считается visual verification.
- [ ] Native keyboard: CDP Tab не сдвинул focus с body; DOM/processing checks
  не подменяют native Tab/Shift+Tab/Enter sign-off.
- [ ] Production SMTP delivery в контролируемый реальный mailbox после
  настройки внешнего SMTP credentials/DNS/HTTPS. Dev capture не доказывает
  production deliverability; точная процедура в `docs/mail.md`.

Три открытые позиции сохраняются в verification boundary шага 15 / production
sign-off и не объявляются пройденными. Implementation дополнения готов к review
и commit; шаг 8 не начат. Исходный Pen не изменялся.
