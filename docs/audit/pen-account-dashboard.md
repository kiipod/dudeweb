# Account dashboard — шаг 8

## Актуальный результат — Playwright, 2026-10-20

CSR/Inertia browser acceptance выполнен. Предыдущие записи о неудачном capture
ниже сохранены как история; успешный результат получен отдельным Chromium в
Sail, без Pen Browser. Operational SSR остаётся отложенным `U-22`.

| Проверка | Результат |
|---|---|
| Полный Playwright | 78/78, 29.1s, failures 0 |
| Account scenarios | 76: 16 responsive, 48 states, 4 More, 2 text ×2, 2 transport errors, loading, navigation/theme, logout, skip/sidebar |
| Laravel AccountDashboard | 26 tests / 523 assertions, failures 0, существующие 26 PDO deprecations |
| Frontend Node | 49/49 |
| Client/SSR build | Passed; generated SSR artifacts восстановлены |
| Operational SSR | `inertia:check-ssr` exit 1: SSR server не запущен, sign-off не выполнен |

Playwright открывает настоящий Blade/Vite document с `/login`, подменяет
Inertia page JSON на Account/Dashboard и контролирует account transport только
внутри browser context. Рендерятся текущие production components. Fixture
не добавляет routes/config/demo data в приложение. Реальные accounts,
Remnawave и logout не затрагиваются. Авторизация и server/provider mapping
проверяются Feature suite, а не подменённым browser response.

### Visual review с read-only Pen

Прочитаны актуальные K/K2 dark/light references: mobile `PvBmx`/`v0L0ox`,
tablet `uS6Mr`/`rp4vg`, desktop `YzRDo`/`xDKac`, Full HD `R07QE`/`cjR8r`,
QHD `Swiwc`/`mbnBl`, More `n3Las`/`qyfca` и `VcLN4`/`mlxDX`, boards
`udMVl`/`eg9Ml`. Pen не изменялся.

- Получены и просмотрены dashboard light/dark screenshots на
  `320/360/390/768/1024/1440/1920/2560`. Прямые K references сравнивались на
  `390/768/1440/1920/2560`; `320/360/1024` — responsive extension проверки.
- Сверены chrome/content alignment, Night/Paper surfaces, type hierarchy,
  карточки и copy row. Width endpoints — 900/1040/1120, sidebar 280.
- More в обеих темах: viewport screenshots на 390 и 768; full-width mobile,
  520×372 tablet по центру, backdrop под header. Видимый focus ring — реальное
  keyboard state, дополнение к default Pen frame.
- Для states снята 48-case screenshot matrix (шесть состояний × четыре widths
  × две темы) и проверены labels/0/2/5 devices/отсутствие stale subscription
  при error. Представления состояний просмотрены с U/U2, loading снят отдельно.
- Dynamic name/date/link, browser emoji rendering и natural content growth
  отличаются от Pen demo copy. Future actions остаются disabled по принятому
  owner contract; их muted appearance ожидаем. «Обновить данные» — ранее
  реализованное явное действие fresh read. На 320/360 допускается wrapping;
  на 390 подпись «Подключение» теперь однострочная, как в Pen.
- Для сравнения с reference viewport используются `viewport-*` attachments.
  Full-page screenshots также сохранены; fixed navigation в них остаётся на
  позиции viewport, а документ может продолжаться ниже. Pixel-baseline
  comparison с Pen автоматически не выполнялась; это visual review изображений
  и подтверждённых role metrics.

### Найденные defects и исправления

1. На 390 label «Подключение» занимал 28.78 px вместо одной строки 14.4 px.
   Live Pen `c6NUQr` задаёт items без горизонтального padding и icons 20 px.
   Убраны лишние item insets и применён существующий icon size `sm` (20 px).
   Regression assertion сначала упал в light/dark, затем прошёл.
2. На text-only ×2 скрытый skip link выглядывал на 56 px сверху: фиксированный
   `-top-16` был меньше его выросшей высоты. Account skip link теперь скрывается
   через `-translate-y-full`, при focus возвращается в viewport. Regression
   скрытия и keyboard Enter → main подтверждены в завершающем прогоне.

### Keyboard и transport

Enter открывает More через реальный tab order; initial focus — close, далее
support → logout → close. Tab/Shift+Tab зациклены, disabled будущие items
пропускаются. Escape/close возвращают focus, снимают inert/scroll lock.
Проверены backdrop, support intent и resize на desktop. Во время logout close
disabled и Escape не закрывает dialog; после controlled success overlay удалён.
Theme сохраняется при Inertia navigation, sidebar доступен при высоте 400.

Network/503 failure скрывают прежнюю подписку и дают retry; следующий controlled
success отображает fresh expired/5-device props. Loading скрывает прежние
данные; двойной browser click создаёт один request. На 320 с text ×2 нет
horizontal overflow, clipped headings/paragraphs/buttons; overlay учитывает
выросший header. Physical keyboard и screen reader matrix — общий scope шага 15.

Тесты и повторный запуск описаны в [browser-testing.md](../browser-testing.md).
Report `playwright-report/index.html`, именованные PNG — `test-results/`.
Оба каталога ignored; production code изменён только в account nav/skip link.
Шаг 9 не начат; PHP-файлы, dependencies и Pen в этом прогоне не менялись.

## Контракт перед реализацией, 2026-10-19

Источник: live read-only Pen `PvBmx`/`v0L0ox`, `uS6Mr`/`rp4vg`,
`YzRDo`/`xDKac`, `Swiwc`/`mbnBl`, mobile/tablet `K2` и board
`udMVl`/`eg9Ml`. Pen не изменяется.

| Роль | Mobile | Tablet | Desktop / Full HD | QHD |
|---|---|---|---|---|
| Header | 68 px | 68 px | 80 px | 80 px |
| Sidebar | — | — | 280 px | 280 px |
| Bottom nav | 80 px | 80 px | — | — |
| Content | viewport − 40 px | до 640 px | 900 / 1040 px | до 1120 px |
| Content top padding | 18 px | 28 px | 32 px | 32 px |
| Section gap | 14 px | 14 px | 14 px | 14 px |
| Heading | 34 px | 42 px | 48 px | 64 px |
| Title | 20 px | 22 px | 24 px | 32 px |
| Body | 15 px | 16 px | 17 px | 21 px |
| Primary action | 56 px | 60 px | 64 px | 72 px |
| More sheet | full width | 520 px | — | — |

Desktop reference widths are 900 px at 1440 and 1040 px at 1920; QHD is
1120 px at 2560. Interpolation follows these three endpoints. Sidebar fill is
`#111113` dark / `#F4F0E8` light, distinct from subscription-card surfaces.
Desktop top-bar title uses the foreground text role.

Content grows naturally when text is enlarged; Pen fixed frame heights do not
clip runtime content. Sidebar remains 280 px. Between Full HD and QHD the
existing responsive interface roles interpolate. Safe-area insets augment
mobile navigation/sheet padding. Sheet reference height 372 px is a minimum;
long text and smaller viewports may grow/scroll within available height.

Palette: existing Night/Paper surfaces, Iris action, Mint success, Coral error.
IBM Plex Sans is the interface font; Mono displays the masked connection URL.
No new decorative treatment or alternative visual system is introduced.

## Границы компонентов

- `AccountLayout`: единственный main, skip link, responsive header/sidebar/nav,
  тема, меню и выход; получает active key и заголовок, не получает remote secrets.
- `AccountTopHeader`, `AccountSidebar`, `AccountBottomNavigation`: навигация и
  active/disabled presentation, без запросов доменных данных.
- `MoreNavigationSheet`: пункты меню и logout intent.
- `BaseOverlay` / `useOverlay`: modal semantics, Teleport, focus trap/return,
  Escape, inert background, scroll lock и lifecycle cleanup.
  Измеренные offsets/padding используют `@theme inline`, чтобы локальные CSS
  variables вычислялись на overlay/main, а не подменялись root fallback.
  Перед открытием sheet chrome измеряется синхронно, без ожидания ResizeObserver.
- `Account/Dashboard`: composition surface с явными server props.
- `DashboardSubscription`, `DashboardConnection`, `DashboardDevices`:
  представление безопасного server contract и локальный copy/retry intent.
- `AccountDashboardData`: свежий read Remnawave по owned numeric ID,
  минимальные DTO/array props и честное error state, без записи remote truth.
- `useDashboardRefresh`: Inertia reload/provisioning intent, duplicate-request
  guard, cancellation on unmount, loading и validation/HTTP/network errors.
  При ошибке обновления прежние active props скрыты до нового успешного read.

## Принятые границы поведения

- Владелец выбрал: будущие разделы видны, но неактивны до соответствующих шагов.
  Подписка/подключение/referral/profile не ведут на 404 и не получают placeholder
  routes. Поддержка использует существующий Telegram URL до шага 12.
- Dashboard states: trial, active, expiring, expired, limited, loading,
  service_error. Восьмой вариант board — discount applied — относится к оплате
  и реализуется в шаге 9 после server-side расчёта, не выдаётся за факт dashboard.
- `expireAt` и remote status определяют доступ; `expiring` — менее трёх суток.
  Никаких cross-request status caches и локальных дат вместо ответа provider.
- Источник имени тарифа — последняя успешная owned покупка. Для trial используется
  название пробного доступа; отсутствие покупки не подменяется случайным тарифом.
- В Inertia передаётся только безопасная identity summary, presentation state,
  план, дата/остаток, owned subscription URL и summary устройств. Raw provider
  payload, пароли, squad IDs и HWIDs не передаются и не логируются.
- Сбой получения подписки или устройств даёт service_error без stale active
  props. Повтор GET перечитывает provider. Отсутствующий numeric mapping требует
  отдельного уже существующего provisioning retry после подтверждения email.
- Loading — локальное состояние Inertia-запроса; кнопки повторного запроса
  защищены от двойной отправки. Нет искусственной задержки или demo success.
- Modal inert включает весь account chrome, хотя backdrop рисуется ниже header.
  Закрытие отменяется во время logout; resize на desktop закрывает sheet.

## Проверка

Продолжение 2026-10-20: live read-only Pen подтвердил mobile/tablet/desktop/
Full HD/QHD `K`/`K2`, dark/light и восемь примеров account/checkout board.
Скриншоты исходных `PvBmx` и `VcLN4` прочитаны; Pen не изменялся.

- Sail AccountDashboard: 26 tests / 523 assertions.
- Полный Sail Laravel suite: 189 tests / 1548 assertions, failures 0;
  178 deprecated / 11 passed, существующие PDO deprecations не устранены этим шагом.
- Frontend suite: 49/49, включая 5 regression/lifecycle tests refresh:
  network/HTTP/validation failures не раскрывают прежние active props,
  double retry игнорируется, новый mapping переключает provisioning на GET,
  unmount отменяет только незавершённый запрос.
- Client/SSR build проходит; это не подтверждение operational SSR.
- PHP CS Fixer dry-run по 7 backend-файлам шага: 0 fixable.
- Route registry: 18 application routes, будущие account routes не подставлены.
- Browser CSR fixture с тестовыми props: 16/16 width/theme cases на
  `320/360/390/768/1024/1440/1920/2560`, включая `2560×1440`; один main/h1,
  без overflow/Vue errors, 900/1040/1120 content, 280 sidebar и Pen palette.
- State matrix 48/48: trial/active/expiring/expired/limited/service_error ×
  320/768/1440/2560 × light/dark. Loading проверен реальным Inertia reload
  с подменённым только browser transport, без provider calls.
- Browser regression: duplicate click даёт один request; network/503 скрывают
  старую подписку; следующий успешный read показывает свежие expired/5-device
  props без ошибок. Изменение реальных account/provider данных не выполнялось.
- More на 320/390/768/1024: 390/full-width mobile и 520 tablet, height 372;
  light/dark 390/768, initial focus, modal label/inert/scroll lock, обработчики
  Tab/Shift+Tab/Escape, focus return и navigation-close. Во время logout close/
  logout disabled, Escape не закрывает sheet; resize на desktop закрывает menu.
- Long name/plan/expiration и 0 devices на 320: overflow 0. Text-only ×2:
  overflow/clipped buttons 0. Backdrop равен фактической высоте header 77/159,
  main bottom padding равен nav height + 16; sidebar при высоте 400 scrollable.
- Live screenshot capture завершился timeout 60s, затем `A capture is already
  running`; прямой CDP Page.captureScreenshot также timeout 30s. Это не visual
  sign-off. CDP Tab не переместил initial focus, native keyboard остаётся открытой.
- Временный browser fixture удалён; generated `bootstrap/ssr/*` восстановлены
  к исходному checkout, без изменения закоммиченных ранее artifacts.

Operational SSR остаётся отложенным `U-22`; build не считается SSR sign-off.

## Повторный screenshot smoke после обновления Pen Browser — 2026-10-20

По запросу владельца повторён захват в обновлённом Browser. `get_app_state`
подтвердил доступный Pen; `load-page http://localhost/` успешно открыл главную.
До развёртывания account fixture проверен минимальный capture страницы:

- `return-screenshot`, target `query`, selector `header`: IPC timeout 60000 ms.
- Прямой CDP `Page.captureScreenshot`, PNG без captureBeyondViewport:
  `browser-node:agent-tool` timeout 30000 ms.
- Следующий read-only CDP `Runtime.evaluate`: `A capture is already running`.

Изображения не получены. Account screenshot matrix не запускалась после
неуспешного smoke; визуальная приёмка остаётся открытой. Код приложения и Pen
не изменялись, временный fixture не создавался.

## Продолжение с незавершённых пунктов — 2026-10-20

Checkout: чистая ветка `pen-integration`, commit `1bfd6e4`. Первый
незавершённый этап — шаг 8. Прежние Sail checks в этом запуске не повторялись.

- Live read-only Pen повторно подтвердил dashboard mobile dark/light
  `390×844`, tablet `768×1024`, desktop `1440×1024`, QHD `2560×1440`, tablet
  `K2` `768×1024` и reusable More sheet `390×372`. Pen не изменялся.
- Browser открыл `http://localhost/`, но минимальный `return-screenshot` для
  `header` снова завершился `IPC request "browser" timed out after 60000ms`.
  Изображения нет; account screenshot matrix не запускалась.
- После timeout CDP `Runtime.evaluate` доступен; повторного
  `A capture is already running` в этом запуске не получено.
- Keyboard transport проверен на публичной странице. Focus emulation
  переключает `document.hasFocus()` с `false` в `true`, но Tab через
  `keyDown`/`keyUp` не перемещает focus с body. Отдельная проба
  `rawKeyDown`/`keyUp` со skip link, сфокусированной через `.focus()`, также
  оставляет active element прежним. Это диагностика Browser, а не account
  keyboard acceptance. Focus emulation отключена, focus снят, scroll сброшен.
- Fixture не создавался; runtime/config/dependencies и реальные
  account/provider данные не изменялись.

Native keyboard и screenshot comparison открыты; SSR сохраняет отложенный
статус `U-22`. Шаг 8 не закрыт, шаг 9 не начат.

## Повторная попытка после следующего обновления Browser — 2026-10-20

По новому сообщению владельца об обновлении Pen Browser повторены проверки:

- `load-page http://localhost/` работает. Захват `header` через
  `return-screenshot` снова завершился IPC timeout 60000 ms, без изображения.
- Временный static fixture из текущих Vue dashboard/layout/components собран
  через Sail Vite, без изменения основной build configuration и SSR artifacts.
  Fixture открыт по `/__account-review/`; Inertia установила URL `/account`,
  отрисован заголовок «Привет, Алексей 👋». Использовались только тестовые props,
  без реальных account/provider изменений.
- На fixture `Page.bringToFront` и CDP Tab `keyDown`/`keyUp` не переместили
  focus с body; `document.hasFocus()` остался `false`. Native keyboard не принят.
- Прямой `Page.captureScreenshot` с `fromSurface:false` и
  `captureBeyondViewport:false` завершился timeout 30000 ms. Следующие команды
  возвращали `A capture is already running`; дополнительная диагностика событий
  не выполнилась. Account screenshot comparison не проведена.
- Sail AccountDashboard повторно: 26 tests / 523 assertions, exit 0; 26
  существующих PDO deprecations. Frontend повторно: 49/49, failures 0.
- `sail artisan inertia:check-ssr`: exit 1, `Inertia SSR server is not running.`
  Operational SSR не подтверждён, `U-22` остаётся отложенным.
- Временные source/build directories fixture удалены. Код приложения, Pen,
  dependencies и runtime configuration не менялись.

Владелец явно выбрал «Оставить шаг 8 открытым до исправления Browser».
Ни visual/native keyboard acceptance, ни SSR не отмечены выполненными.
Шаг 9 не начинается; перенос проверок в шаг 15 не согласован.

## Ещё одна попытка незавершённых проверок — 2026-10-20

- До запуска capture на публичной странице установлен временный listener
  `keydown`. CDP Tab через `rawKeyDown`/`keyUp` после `Page.bringToFront`
  не дал ни одного события; active element остался skip link. Повтор через
  `keyDown`/`keyUp` с focus emulation также дал `events: []`, хотя
  `document.hasFocus()` стал `true`. Это уточняет сбой keyboard transport;
  native keyboard acceptance по-прежнему не выполнен. Listener удалён,
  focus emulation отключена, focus/scroll восстановлены до capture.
- Впервые успешно получен browser `return-screenshot` для public `header`:
  изображение light header с logo, theme/login/menu controls. Это успешный
  capture smoke, а не account screenshot comparison.
- Временный dashboard fixture снова собран через Sail Vite и открыт;
  применены viewport `390×844` и dark theme. Сняты read-only Pen screenshots
  `PvBmx`, `VcLN4`, `YzRDo`, `xDKac`, `Swiwc`, `mbnBl` для сверки.
- Browser `return-screenshot` сначала full-page, затем query
  `#account-content`: оба завершились IPC timeout 60000 ms. Изображений
  dashboard нет. Между попытками CDP probe вернул `A capture is already running`.
  Поэтому account comparison и её responsive/theme matrix не засчитаны.
- Временные source/build directories удалены. Тесты приложения повторно не
  запускались: production code не менялся, предыдущие результаты сохранены.

Частично восстановлен только screenshot smoke. Шаг 8 остаётся открытым по
прежнему решению владельца; статус отложенного SSR `U-22` не меняется.

После проверки Browser принял навигацию на `http://localhost/`, однако
`Emulation.clearDeviceMetricsOverride` и восстановление исходной light theme
вернули `A capture is already running`. Сброс viewport/theme не подтверждён:
могут сохраняться тестовые `390×844` и dark theme; требуется восстановление
работоспособности Browser. Focus emulation и keyboard listener были убраны
ещё до запуска screenshot и не оставлены активными.
