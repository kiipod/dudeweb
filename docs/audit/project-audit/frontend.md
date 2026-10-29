# Frontend Audit — 2026-10-29

Этап 03, ветка `project-audit`, исходный commit `87ebd5c`.
Диагностика выполнена в описанном ниже объёме; исправления реализации не вносились.
Новые findings: **FE-001 — P2 OPEN**, **FE-002 — P3 OPEN**.

## 1. Architecture

Прочитаны overview, задача этапа 03, README и реестр аудита, отчёт этапа 02.
`project-inventory.md` отсутствует: сведения о frontend проверены непосредственно
в текущем checkout; полноценный этап 01 не выполнялся. По указанию пользователя
этап 03 начат при BLOCKED этапа 02. Pen не запрашивался: данный технический
аудит независим от визуальной сверки. К Pen и зависимым проверкам нужно
вернуться после 1 ноября 2026 года с повторной проверкой доступа.

Selected skills: `vue-best-practices` (включая четыре core references),
`tailwind-best-practices`. Сохранены JS, Composition API, CSS-first Tailwind.
PHP backend не ревьюировался; routes получены через Sail `artisan route:list`.

| Слой | Реализация и ответственность |
|---|---|
| Entry | `app.js`: fonts/CSS, theme/input modality, Inertia, CSR либо hydration |
| SSR | `ssr.js`: отдельное `createSSRApp`, resolver и renderer |
| Pages | Public/Home; 5 Auth; Dashboard, Subscription, Connection, Referral/Terms, Support CRUD views, Profile, Payments/Show |
| Layouts | PublicLayout: header/footer; AccountLayout: sidebar/header/bottom nav/More, measured chrome offsets |
| Feature UI | profile, subscription, connection, support, referral, public/hero |
| Shared UI | BaseButton/Field/Select/Overlay, StatePanel, CopyableLink, icons, badges |
| Logic | project composables и pure utilities вместо общего API/store слоя |

UI routes обслуживает Laravel/Inertia; отдельного Vue Router/Pinia нет.
Account navigation определяется единым `ACCOUNT_NAVIGATION` и текущим URL.
Entry и SSR используют eager glob страниц. Это кандидат для отдельного анализа
разбиения bundle; без измерения загрузки он не объявлен дефектом производительности.

## 2. Component Quality

Проверены entry/layouts, shared controls, формы Auth/Profile/Support,
subscription checkout/payment status, connection, referral и Hero lifecycle.
Pages в основном собирают feature-компоненты. Самый большой из компонентов
верхнего уровня feature-папок — `UiIcon.vue` (235 строк), преимущественно реестр
иконок; размер сам по себе не считается основанием для разделения.
Сложные состояния вынесены в composables, fixed variant maps используются в
BaseButton, StatusBadge, layout spacing и других shared controls.

Подтверждены неиспользуемые обязательные props — FE-002. Критического
дублирования компонентов в просмотренных feature-потоках не установлено.
Повторяются классы ссылок-действий в Auth/Payment: возможное последующее
объединение требует отдельного решения о navigation contract, массовая
переработка в диагностике не выполняется. Сборка не заменяет unused-import lint;
полное доказательство отсутствия мёртвого кода и неиспользуемых npm dependencies
не получено. `concurrently` используется Composer dev script и не является
неиспользуемой зависимостью только потому, что его нет в JS imports.

## 3. State Management

Inertia props — источник серверных данных; computed формируют производные
значения. Формы имеют локальное состояние. `useTheme` содержит единственное
client preference state; первый render фиксирован для совпадения с SSR.
Theme bootstrap работает до mount. Hydration fixture-проверки прошли в обеих темах.

`useActionForm` защищает от повторной отправки до onStart, отменяет форму
при unmount. Refresh composables используют partial reload и cancellation.
`usePaymentStatus` ограничивает polling 60 секундами и оставляет manual retry.
`useCopyableLink` проверяет revision/alive, удаляет временный textarea и timers.
Hero освобождает RAF/listeners/observers; unit/browser lifecycle сценарии прошли.
Heap profiling не проводился: это проверка явного cleanup, не доказательство
отсутствия всех утечек памяти.

VueUse уже применяется для media queries, resize и event listeners.
Ручные browser primitives в сложных Hero/clipboard/swipe потоках оценены с учётом
SSR, pointer capture, cancellation и manual-copy contracts; массовой замены нет.
Проблема локальной обработки refresh-ошибок Telegram подтверждена как FE-001.

## 4. Forms

Auth/Profile/Support используют Inertia forms и общий action wrapper;
checkout/promo используют установленный `useHttp`. По source установленного
Inertia проверено: 422 заполняет errors и возвращает undefined, прочие HTTP
ошибки бросаются; catch в promo не затирает 422 только из-за самого наличия catch.

Проверены required/email controls, server errors, labels/aria-describedby,
processing/disabled/loading, duplicate intent, сохранение обычного ввода,
success feedback и retry. Очистка password-полей при завершении запроса
преднамеренна и не классифицирована как потеря обычного ввода.
Browser-проверки включают validation/HTTP/network ошибки Auth/Support/Profile,
promo, idempotency key, payment retry, polling и уход со страницы.
Account/provider transport подменяется fixtures: реальные платежи, письмо,
Telegram и production-данные не использовались.

## 5. Navigation

`evidence/frontend-probe.json`: 11 уникальных литеральных внутренних href из
Vue/JS сопоставлены с фактическими GET routes; отсутствующих маршрутов нет.
Это ограниченная статическая проверка: URL из server props, шаблонов и
внешних сервисов требуют отдельного сценария, а не покрываются этим regex.
Динамические support/payment переходы дополнительно проверены существующими
browser tests. Account active state покрыт unit tests.

Живые read-only проверки: гость `/account` → 302 `/login`, неизвестный URL → 404,
Login → Register → browser back → forward работает без pageerror.
HTTP 401/403 исследованы на синтетическом Telegram reload transport, не через
реальную истёкшую сессию/чужие данные. FE-001 относится к этому потоку.
Общий аудит backend authorization остаётся за этапом 04.

## 6. Accessibility

Автоматически проверены один main/h1, русская локаль, labels, target geometry,
keyboard focus, focus trap/return, inert background, Escape, scroll lock,
password disclosure, styled select, reduced motion и forced colors.
Contrast helper в responsive suite требует пустые failures и manualDetails,
а не считает unsupported измерения успешными.
Семантические токены находятся в `app.css` и импортируемых тематических CSS,
shared components существуют; prerequisite Tailwind skill соблюдён.
Keyboard-focus variant включает `:has(:focus-visible)`, поэтому sr-only radios
могут показывать outline на label без самостоятельного tabindex label.

Эти проверки не являются полным WCAG-аудитом. Реальные screen readers,
физические устройства и ручная accessibility acceptance не выполнялись.

## 7. Responsive Behavior

Responsive suite проверяет 320, 360, 390, 414, 600, 640, 768, 1024, 1280,
1440, 2560 CSS px, обе темы; feature suites добавляют 1920px.
Проверены overflow, clipping controls, text enlargement, forced colors и
reflow. Это CSS reflow/text scaling, а не native browser zoom.
Touch suite проверяет swipe, отмену/multitouch, приоритет scrolling,
editable controls и busy overlay. Используется Chromium automation,
не физическая touch-приёмка; Safari/Firefox не проверены.

## 8. Browser Errors

| Проверка через Sail | Результат |
|---|---|
| `node --test tests/Unit/Frontend/*.test.js` | 103 passed |
| Playwright smoke desktop/mobile + interactive-states + responsive-accessibility + touch-dismiss | 320 passed, 3.1m |
| Playwright dashboard + subscription-payment + connection + referral + support + profile + styled-select | 494 passed, 3.4m |
| `npm run build:client` | PASS, app JS 412.95 kB / gzip 123.77 kB |
| `npm run build:ssr` | PASS; generated files восстановлены из backup |
| operational-ssr | **32 passed, 8 failed**, exit 1 |
| Дополнительный read-only probe | FE-001 воспроизведён; routes/history/guest redirect проверены |

SSR server изначально не работал; `artisan config:show inertia` показал
`ssr.enabled=false`. Для диагностики временно запущен Node renderer.
32 fixture-сценария используют его напрямую: SSR DOM сохраняется при hydration,
проверяются обе темы и overlays. 8 live HTTP сценариев для `/`, `/login`,
`/register`, `/forgot-password` упали на отсутствии `data-server-rendered="true"`:
основной Laravel endpoint остался в CSR configuration. Это **не успешная
operational SSR-приёмка**. Конфигурация не менялась; после диагностики временный
renderer остановлен, `bootstrap/ssr/*` восстановлены. Для live SSR acceptance
нужно отдельное SSR-enabled окружение, её нельзя заменить fixture-результатами.

Source/runtime FE-001 и сырые безопасные результаты:
`evidence/frontend-probe.mjs`, `evidence/frontend-probe.json`.
Краткий воспроизводимый протокол запусков: `evidence/frontend-checks.md`.
Обычные suite проверки console/pageerror прошли в предусмотренных ими сценариях;
это не blanket-утверждение об отсутствии всех network/console errors.
Diagnostic probe отдельно зафиксировал необработанный Network error в FE-001.

## 9. Refactoring Candidates

- FE-001: вынести refresh Telegram в composable с локальными errors и cleanup,
  сохранив focus-triggered refresh, deduplication и partial props.
- FE-002: согласовать и убрать неиспользуемые обязательные props либо подключить
  их к фактическому contract. Не создавать второй theme store.

Remediation scope не согласован и production-изменений нет. Eager imports и
повторяющиеся link classes — вопросы для последующей оценки, без утверждений
о доказанном performance impact и без заранее назначенной переработки.

## 10. Findings References

Единый реестр: `docs/audit/project-audit/findings.md`.

| ID | Priority | Status | Суть |
|---|---|---|---|
| FE-001 | P2 | OPEN | Telegram refresh не обрабатывает transport errors локально |
| FE-002 | P3 | OPEN | Обязательные props без потребителя в Profile/Subscription |
| PEN-001 | P2 | BLOCKED | Ранее зарегистрирован; к Pen вернуться после 1 ноября |

Полнота: все разделы этапа рассмотрены, доказанные проблемы записаны,
непроверенные области обозначены. Production-код и существующие tests не
изменены; новый probe — диагностический артефакт отчёта. Этап 04 не начинался.
