# Account dashboard — шаг 8

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
