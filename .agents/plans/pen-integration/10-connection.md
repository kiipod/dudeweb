# Шаг 10 — Подключение и устройства

## Цель задачи

Реализовать connection page с выбором платформы, copyable subscription link,
пошаговыми инструкциями и переходом к подтверждённой поддержке.

## Продолжение и design contract — 2026-10-20

Шаг 9 закрыт в `4556e1a`; на старте checkout был чистым. Implementation
и CSR/browser verification шага 10 завершены. По запросу владельца этап принят
и закрыт текущим коммитом.
Pen остаётся read-only. Выбраны `php-per-cs3`, `laravel-best-practices`,
`frontend-design`, `vue-best-practices`, `tailwind-best-practices`;
`laravel-13-attribute-refactor` — для проверенного `Config` в DI каталога.

| Роль | Mobile 390 | Tablet 768 | Desktop 1440 | QHD 2560 |
| --- | --- | --- | --- | --- |
| Content top / gap | 16 / 12 | 28 / 12 | 32 / 12 | 32 / 12 |
| Content width | viewport − 40 | 640 | 900 | 1120 |
| Platform layout | 3 + 2 | 5 columns | 5 columns | 5 columns |
| Platform height / icon / label | 86 / 24 / 16 | 100 / 26 / 18 | 100 / 26 / 18 | 120 / 32 / 22 |
| Step padding / gap / number | 14 / 12 / 36 | 20 / 16 / 36 | 20 / 16 / 36 | 24 / 16 / 44 |
| Copy row minimum height | 64 | 68 | 72 | 80 |

Source: `QjIv0/mF4B8`, `U7Wfs/okkpo`, `aVoTp/g50K9K`,
`gxlsa/wEse8`. Typography/color roles reuse the accepted interface system:
IBM Plex Sans/Mono; Night `#0A0A0B`, Paper `#FBF9F4`, Iris `#8E9BFF`,
surface/border semantic tokens. Platform brand paths already exist in `UiIcon`.
Instructions remain left-aligned; cards and step numbers follow Pen, without
new decorative effects. QHD keeps the bounded account content width.

Component map: `Account/Connection` is a thin page; feature container owns
platform selection and request composables; `PlatformSelector` is controlled
native radios, `ConnectionSteps` receives ordered backend instructions,
`ConnectionDevices` renders safe device metadata and emits revoke intent.
`CopyableLink` gains visible feedback and a selectable manual-copy fallback.
Backend services own remote reads, sanitized catalogue and authorized deletion.

Источник общего app content предоставлен владельцем на `sub.dudeweb.xyz`.
Персональный path не сохраняется в source/config/audit. Текущий Remnawave
`Default.config` равен null; read-only source inspection выполняется отдельно
от персональных subscription props. Неизвестные app/platform data отображаются
как unavailable, без placeholder URLs или независимой Vue-копии инструкций.

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

- [x] Передавать subscription URL и device metadata только authenticated user.
- [x] Не сохранять subscription URL в localStorage, analytics или logs.
- [x] Реализовать platform selector для Windows, macOS, Linux, Android и iOS.
- [x] При открытии и перезагрузке страницы автоматически выбирать ОС устройства;
  ручной выбор действует до перезагрузки и не сохраняется между загрузками.
- [x] Передавать `platforms[]` с app/download links и упорядоченными
  platform-specific instructions из backend-каталога, скопированного из общего
  content Remnawave subscription page; не хардкодить вторую копию во Vue.
- [x] Если данные платформы отсутствуют, использовать честный unavailable state,
  а не placeholder URL.
- [x] Реализовать copy action с success/error feedback и manual-copy fallback.
- [x] Реализовать три шага подключения из Pen.
- [x] Подключить `Как подключиться` и `Нужна помощь` к подтверждённым routes.
- [x] Отобразить device count/limit без дублирования device-limit rules.
- [x] При наличии удаления устройства использовать существующий Remnawave
  contract через отдельный FormRequest/action и authorization.
- [x] Добавить loading/error/retry states для Remnawave calls.
- [x] Добавить Feature tests с HTTP fakes и authorization checks.

## Критерии готовности

- Subscription link доступна только владельцу session.
- Все platform controls доступны клавиатурой и имеют selected state.
- Начальная платформа определяется по браузеру, включая iPadOS desktop mode;
  после перезагрузки восстанавливается определённая ОС, а не ручной выбор.
  При неизвестной ОС выбирается первая платформа каталога (Windows).
- Copy feedback работает в secure context и fallback mode.
- Ни один download/support link не является placeholder.
- Remnawave error не раскрывает credentials или internal response.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Connection
./vendor/bin/sail artisan test --filter=Hwid
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --dry-run --diff --using-cache=no --sequential <changed-php-files>
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run test:e2e
./vendor/bin/sail npm run build
git diff --check
```

## Сценарии проверки

- Каждая из пяти платформ и keyboard selection.
- Автоматический выбор всех пяти ОС, iPadOS desktop mode, unknown OS,
  ручное переключение и возврат к определённой ОС после page reload.
- Clipboard success, permission denied и unsupported browser.
- Missing subscription URL, Remnawave timeout и retry.
- Device counts 0, limit-1, limit и over-limit domain state.
- Session user пытается получить ссылку другого пользователя.

## Реализация и evidence — 2026-10-20

- `GET /account/connection` и `DELETE /account/connection/devices` используют
  существующие `auth:web`, `auth.session`, `verified` и CSRF. Dedicated
  `AccountConnectionPolicy` проверяет capabilities; `DestroyDeviceRequest`
  принимает только opaque device token. Inertia history encrypted,
  response `Cache-Control: no-store, private`.
- `AccountConnectionDevices` читает session mapping по numeric ID, проверяет
  remote identity и владельца каждого HWID, использует scoped timeouts 5s/3s.
  Props содержат только name/platform/OS и encrypted token с local owner,
  remote mapping и HWID; raw HWID/IP/userAgent/credentials не раскрываются.
- Перед удалением token проверяется заново, fresh provider list подтверждает
  ownership. Per-user cache lock сериализует удаления. Чужой token, сменившийся
  mapping, tampering и повторный revoke отклоняются; обработчик Remnawave
  получает `userId` из session mapping, а не request. Provider failure не
  считается успешным удалением и не раскрывает текст ответа.
- Сервис `ConnectionCatalogue` читает `resources/data/connection-apps.json`.
  Это prepared copy общих данных из
  `https://sub.dudeweb.xyz/assets/.app-config-v2.json`, полученная read-only
  2026-10-20. Snapshot содержит source/date/version и только platforms/apps/
  blocks/buttons; персональная страница или её payload не копировались.
- Сохранены исходные приложения и порядок: Windows INCY/Happ/FlClashX,
  macOS INCY/Happ/FlClashX, Linux Happ/INCY/FlClashX,
  Android v2rayTUN/INCY/Happ/FlClashX, iOS INCY/Happ. Первый вариант —
  исходный первый, остальные доступны в select внутри раскрытого шага 1.
  Промежуточные source blocks (обновление/ручной import) объединяются во
  второй из трёх Pen steps без потери текста. Vue не содержит копии каталога.
- `detectConnectionPlatform` определяет default platform по доступному
  `navigator.userAgentData.platform`, с fallback на userAgent/platform.
  iPhone/iPad/iPod выбирают iOS; Mac identity с несколькими touch points
  учитывается как эвристика iPadOS desktop mode. Android проверяется раньше
  Linux; ChromeOS/unknown OS сохраняют первую платформу server catalogue.
  Определение выполняется в `onMounted`, чтобы сохранить одинаковый initial
  render для SSR/client. Ручной выбор не записывается в storage/history;
  после полной перезагрузки ОС определяется заново. Выбирается только ID,
  присутствующий в props; unavailable content остаётся честным состоянием.
  API reference: [MDN NavigatorUAData.platform](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform);
  desktop identity iPadOS: [WebKit](https://bugs.webkit.org/show_bug.cgi?id=212937).
- Download URLs пропускаются только как HTTPS без встроенных credentials;
  import templates допускают только точные source forms
  `incy://add/`, `happ://add/`, `v2raytun://import/`,
  `flclashx://install-config?url=`. Сервер подставляет только проверенный URL
  текущего владельца. При отсутствующем URL import links не выдаются.
  Неизвестная платформа/приложение не получает placeholder links.
- `CopyableLink` использует composable с single-submit guard, visible success/
  error, secure Clipboard API, cleanup/focus restoration в legacy fallback
  и selectable readonly input для ручного копирования при отказе.
  URL не пишется в localStorage или logs и не передаётся в copy events.
- Включён раздел подключения в account navigation и dashboard action
  `Как подключиться`. `Нужна помощь` сохраняет согласованный destination
  `https://t.me/hey_dude_web`; support URL самого source-конфига не подменяет
  ранее принятый web contract.

### Проверка

- [x] Полный Laravel suite: 229 tests / 2136 assertions, failures 0.
  Существующие PDO deprecations отмечают 218 tests; в этом scope не исправлялись.
  Connection/HWID cases проверяют auth, ownership, metadata safety, missing
  mapping/URL/catalogue, remote timeout/retry, counts 0/4/5/6, token replay,
  changed mapping, malicious download и provider POST failure.
- [x] Frontend Node 69/69, включая 20 OS detection cases; client/SSR build
  повторно успешен после auto-selection. PHP CS Fixer —
  12 changed/new PHP files, 0 fixes; route:list — 24 routes;
  `git diff --check` проходит.
- [x] Full Playwright до дополнения OS detection: 167/167 —
  139 прежних dashboard/payment/login и 28 новых
  connection cases. Native radio/summary/select keyboard, пять платформ,
  app change, clipboard success/denied/unsupported/legacy, selection/focus,
  unavailable data, network/503 retry без stale URL, single delete и
  mutation error; responsive 320/360/390/768/1024/1440/1920/2560, обе темы.
- [x] После OS detection повторно пройден connection Playwright 37/37:
  прежние 28 cases и 9 новых — пять ОС, iPad desktop, unknown fallback,
  unavailable content и отсутствие ОС в props. Проверены начальные инструкции,
  ручное переключение и возврат к определённой ОС после полной перезагрузки.
  OS signals эмулируются в Chromium; реальные Safari/iOS не запускались.
- [x] Text-only ×2 на 320 в обеих темах: воспроизведён и исправлен intrinsic
  overflow copy row через `grid-cols-1`/`min-w-0`; regression scenarios проходят.
- [x] Просмотрены screenshots 390 dark, 768 light и 2560 dark рядом с live Pen.
  Основной экран следует reference roles; список устройств ниже инструкции
  использует существующие account tokens, поскольку Pen P не содержит list.
  Full-page mobile screenshot может показывать fixed bottom nav посреди
  документа; viewport attachments используются для сверки frame geometry.

Report: `playwright-report/index.html`; screenshots/traces: `test-results/`.
Browser transport/data — контролируемые fixtures поверх реального Blade/Vite
document, provider — HTTP fakes. Реальные устройства не удалялись; установка
приложений/OS import handlers не запускались. Operational SSR/hydration,
physical keyboard/screen reader и полная pixel matrix остаются шагом 15.
Generated SSR artifacts исключаются; Pen и зависимости не изменялись.
Шаг 10 принят владельцем и закрыт текущим коммитом. Шаг 11 не начат.
