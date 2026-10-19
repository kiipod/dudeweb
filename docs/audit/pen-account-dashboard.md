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
| Content | viewport − 40 px | до 640 px | до 900 px | до 1120 px |
| Content top padding | 18 px | 28 px | 32 px | 32 px |
| Section gap | 14 px | 14 px | 14 px | 14 px |
| Heading | 34 px | 42 px | 48 px | 64 px |
| Title | 20 px | 22 px | 24 px | 32 px |
| Body | 15 px | 16 px | 17 px | 21 px |
| Primary action | 56 px | 60 px | 64 px | 72 px |
| More sheet | full width | 520 px | — | — |

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
- `Account/Dashboard`: composition surface с явными server props.
- `DashboardSubscription`, `DashboardConnection`, `DashboardDevices`:
  представление безопасного server contract и локальный copy/retry intent.
- `AccountDashboardData`: свежий read Remnawave по owned numeric ID,
  минимальные DTO/array props и честное error state, без записи remote truth.

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

Результаты автоматических и browser проверок добавляются после реализации.
Operational SSR остаётся отложенным `U-22`; build не считается SSR sign-off.
