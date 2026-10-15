# Шаг 3 — Переиспользуемые UI-компоненты и state contracts

## Цель задачи

Создать минимальный набор reusable Vue-компонентов по Pen patterns, сохранив
семантические HTML primitives и явные props/emits contracts.

## Зависимости

- Завершён шаг 2.
- Подтверждён token/theme contract.
- Решена единая frontend directory convention `U-24`.
- Pen reusable components `AJ40x`, `c6NUQr`, `sDedj`, `l86vnd`, `Lbab2`,
  `eSkQx`, `e9Cb0`, `k6KWf`, `Vxu7B`, `LI7B7`.

## Обязательные skills

- `frontend-design` — visual hierarchy и осознанные component boundaries.
- `vue-best-practices` — core references; дополнительно `component-slots.md` и
  `component-fallthrough-attrs.md` только для реально нужных public contracts.
- `tailwind-best-practices` — semantic variants, class ordering и отсутствие
  произвольных style overrides у shared design-system components.

## Конкретные действия

- [x] Составить component map с одной ответственностью на компонент.
- [x] Использовать семантический HTML напрямую, если Vue-компонент не добавляет
  устойчивый дизайн- или behavior-contract.
- [x] Реализовать account primitives: top header, bottom navigation, sidebar,
  status badge, copyable link, primary action, inline alert, period selector и
  subscription summary.
- [x] Реализовать `MoreNavigationSheet` и `PromoCodeSheet` как reusable content
  contracts, отделив их содержимое от responsive overlay presentation
  (mobile/tablet sheet, desktop dialog где он нарисован).
- [x] Реализовать выбранные `BrandMark`/`LogoLockup` из точной Pen SVG geometry
  с исходным `viewBox`; не перерисовывать и не аппроксимировать path.
- [x] Реализовать общие patterns: brand link, page heading, empty/service state,
  auth shell и payment result shell только при подтверждённом повторном
  использовании.
- [x] Для каждого компонента описать props, emits, slots, disabled/loading/
  error behavior и accessible name.
- [x] Для shared variants использовать явную Vue map `variant ->` статическая
  Tailwind class string; не принимать произвольный набор classes как основной
  design-system API.
- [x] Использовать `<script setup>` и текущий JavaScript stack.
- [x] Не мутировать props; изменения передавать событиями вверх.
- [x] Для selector/tabs применить семантические button/radio/tab roles в
  соответствии с фактическим поведением.
- [x] Для CopyableLink реализовать clipboard success/error feedback и fallback.
- [x] Для async actions единообразно блокировать повторную отправку и показывать
  loading state.
- [x] Проверить, что slots и fallthrough attrs опираются только на явные
  contracts локальных Vue-компонентов; optional slot wrappers не должны
  создавать пустую разметку.
- [x] Добавить component-level visual/state showcase в application code только
  если он не попадает в production navigation; иначе проверять на страницах.

## Критерии готовности

- Формальные Pen components имеют reusable Vue equivalents либо документированное
  решение использовать семантический HTML напрямую.
- Все public component contracts явны и не зависят от route/page internals.
- Default, hover, focus-visible, active, disabled и loading состояния доступны
  с клавиатуры и визуально согласованы.
- Нет дублирующихся button/card/input реализаций.
- Build и применимые тесты проходят.

## Команды проверки

```bash
rg -n "<script>|defineProps|defineEmits|defineModel|v-model|disabled|loading" resources/js
rg -n "text-(red|blue|gray|zinc|slate)-|bg-(red|blue|gray|zinc|slate)-" resources/js
npm run build
git diff --check
```

## Сценарии проверки

- Пройти все controls клавишами `Tab`, `Shift+Tab`, `Enter`, `Space`.
- Проверить pointer hover только на hover-capable устройстве.
- Проверить disabled action: нет события, submit или route transition.
- Проверить double-click по loading action.
- Проверить successful/failed copy, form error и service error.
- Проверить light/dark/system theme для каждого primitive.

## Результат выполнения — 2026-10-15

### Component map и public contracts

Компоненты остаются в текущем JavaScript stack и используют runtime
`defineProps`/`defineEmits`/`defineModel`. Произвольный Tailwind class-string не
является public API; variants разрешаются только через статические maps.

| Компонент | Ответственность | Public contract и состояния |
| --- | --- | --- |
| `BrandLogo` / `BrandLink` | exact `06 · Razor Loop` icon/horizontal/stacked lockup и бренд-ссылка | `variant`, `href`; exact Pen paths и исходный `viewBox`; accessible name находится на logo/link |
| `UiIcon` | единый renderer используемых Lucide-like glyphs | фиксированные `name`/`size`; всегда decorative `aria-hidden`, accessible name задаёт владеющий control |
| `BaseButton` | обычное button/submit действие | `variant`, `size`, `type`, `disabled`, `loading`, `fullWidth`, label/default slot; emit `click`; native disabled, `aria-busy`, loading label и focus-visible |
| `BaseField` | label + native input + hint/error | `v-model`, `id`, `label`, input/autocomplete/constraint props, `disabled`, `readonly`, `hint`, `error`; optional `suffix`; label association, `aria-invalid` и `aria-describedby` |
| `InlineAlert` | локальное info/success/warning/error сообщение | `variant`, `message`, optional `title`/default slots; `role=status`, для error — `role=alert` |
| `StatusBadge` | компактный subscription/service status | `status`, optional server-confirmed `label`; active/trial/expiring/expired/limited/loading/service-error maps; `role=status` |
| `CopyableLink` | readonly value и clipboard action | `value`, `copyLabel`; emits `copied`/`copy-error`; Clipboard API, legacy fallback и отдельный polite success/error announcement |
| `PageHeading` | единый heading/description/action boundary | `title`, `description`, optional `actions`; wrapper отсутствует без slot |
| `StatePanel` | повторяемый empty/loading/service-error/success pattern | `state`, `title`, `description`, optional `actions`; busy/status/alert semantics из состояния |
| `AccountTopHeader` | mobile/tablet account brand, page title, theme/profile controls | `pageTitle`, `theme`, `profileHref`; emit `change-theme`; explicit control labels |
| `AccountBottomNavigation` | mobile/tablet primary navigation | `items`, `activeKey`; emits `navigate`/`select-action`; links use `aria-current`, local action uses `aria-pressed` |
| `AccountSidebar` | desktop account navigation/logout | `items`, `activeKey`, `profileHref`, `logoutLoading`; emits `navigate`/`logout`; active route, keyboard focus и busy logout |
| `MoreNavigationSheet` | только reusable content панели `Ещё` | `items`, `logoutLoading`; emits `close`/`navigate`/`logout`; не владеет backdrop, focus trap, Teleport или body lock |
| `PeriodSelector` | controlled single period selection | `v-model`, server-provided `options`, `name`, `legend`, `disabled`, `loading`; native radio group сохраняет keyboard behavior |
| `SubscriptionSummary` | presentation server-confirmed plan/period/discount/total | `plan`, `period`, `discount`, `total`; semantic `dl`, без клиентского расчёта цены |
| `PromoCodeSheet` | только reusable promo form content | `v-model`, `processing`, `error`, `note`; emits `apply`/`close`; processing блокирует повторный submit/close |
| `AuthShell` | повторяемая brand/title/form/footer композиция auth frames | `title`, `description`, default/`footer` slots; сам не владеет form state или request |
| `PaymentResultShell` | повторяемая pending/succeeded/canceled payment композиция | `status`, `title`, `description`, optional `actions`; status/alert semantics, без client-side вывода payment truth |

`BaseOverlay` намеренно не создан на этом шаге. Presentation contract с
Teleport, inert, focus trap/restore, Escape и scroll lock реализуется только на
шаге реального account overlay, поэтому content components не содержат
половинчатой modal-логики.

### Semantic HTML вместо лишних компонентов

- обычные navigation rows остаются `Link`/`button` внутри соответствующего
  navigation component;
- summary использует `dl`/`dt`/`dd`, selector — native radio inputs в
  `fieldset`, headings — `h1`/`h2`;
- отдельные generic card/input wrappers не создавались поверх уже существующих
  `BaseField`, `StatePanel` и domain-specific summary/sheet boundaries.

### Visual и behavior verification

- Все десять formal Pen components и их responsive/theme instances прочитаны
  read-only; `Vxu7B` подтверждён как formal component без instances, а light
  variants сверены по account component boards.
- Уже реализованный `BrandLogo` повторно использован без изменения geometry:
  `0 0 213.435 147.7913`, отдельные primary/highlight paths.
- Временная, не связанная с production navigation showcase-page собрала и
  отрисовала все новые SFC; после проверки page и временная route-подмена
  удалены из checkout.
- Browser review пройден на `390 px` dark и `1440 px` light: горизонтального
  overflow нет; component hierarchy, sheet content, sidebar и statuses не
  collapsed и не clipped.
- Keyboard Tab дал реальный `2px` focus-visible outline; native radio group
  содержит четыре options и выбранное значение; loading/disabled actions стали
  native disabled.
- CopyableLink проверен отдельно для denied clipboard и успешного Clipboard
  API: polite region сообщил соответственно error и success.
- `./vendor/bin/sail npm run build` прошёл для client и SSR после удаления
  showcase; повторная clean build убрала временные showcase utilities из
  generated CSS. `git diff --check` проходит.

### Отложенные границы

- Постоянный component showcase не оставлен: текущий Vite entry eagerly
  включает все Inertia pages, поэтому даже unrouted page увеличила бы production
  bundle. Visual review выполнен временной страницей без итогового runtime
  fixture.
- Автоматические component/a11y tests остаются в границе `U-18`; новые test
  dependencies на этом шаге не добавлялись.

