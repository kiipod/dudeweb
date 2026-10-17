# Шаг 2 — Design foundation, tokens и theme contract

## Цель задачи

Перенести подтверждённые Pen tokens в CSS-first Tailwind foundation и
подготовить светлую/тёмную темы без реализации отдельных страниц.

## Зависимости

- Завершён шаг 1.
- Утверждены `U-12`, `U-13`, `U-14`, `U-19`, `U-25` и light semantic palette.
- Pen boards `I · Mini Design System`, `H · Component States`, `J`, `V`, `U`,
  `U2`, `ODHOo` (`K · Logo Concepts · SVG`) и `hc0K9`
  (`L · Logo Lockup Variants`), а также актуальные landing frames `A`–`F`,
  `M`/`N` для Hero/public-shell raw tokens.

## Обязательные skills

- `frontend-design` — token system, typography, layout principles и проверка
  визуальной специфичности против Pen.
- `tailwind-best-practices` — semantic tokens и CSS-first foundation.
- `vue-best-practices` — только если theme bootstrap затрагивает Vue/Vite code;
  тогда обязательны его core references.
- `tailwind-4-docs` — только для точного v4 API при заранее и отдельно
  инициализированном актуальном snapshot.

## Конкретные действия

- [x] Составить полную token map: Pen variable/raw value -> semantic purpose ->
  Tailwind `@theme` variable.
- [x] Добавить IBM Plex Sans и IBM Plex Mono через одобренные npm font packages;
  определить fallback stack и font-display policy.
- [x] Извлечь из Pen утверждённый `06 · Razor Loop` с исходной SVG geometry и
  viewBox; использовать icon для favicon и назначенные horizontal/stacked
  lockups, не смешивая его с `Connected DW`.
- [x] Описать в `resources/css/app.css` цвета, font families, type scale,
  spacing, radius, container и breakpoint tokens через CSS-first `@theme`.
- [x] Настроить semantic design tokens и использовать их вместо случайных raw
  palette classes в компонентах.
- [x] Зафиксировать компактный design contract: 4–6 core colors, роли IBM Plex
  Sans/Mono, type scale, layout/alignment principles и единственный основной
  выразительный приём; сверить его с Pen до реализации screens.
- [x] Настроить `--ui-radius`, container и light/dark semantic surface/text/
  border variables.
- [x] Сохранить `@import "tailwindcss"` единственным framework CSS import.
- [x] Проверить, что Tailwind v4 source detection видит все статические class
  strings; не строить классы конкатенацией.
- [x] Проверить существующий class-order tooling; при его отсутствии сохранять
  единый Tailwind order вручную и не добавлять formatter plugin без отдельного
  решения.
- [x] Определить project utilities только для реально повторяющихся primitives,
  например focus ring или visually-hidden motion text.
- [x] Не создавать page-specific component classes и не использовать `@apply`
  как основную архитектуру.
- [x] Зафиксировать contrast review для всех text/surface/status пар.
- [x] Настроить pre-hydration theme bootstrap для `light/dark` и `localStorage`
  без flash в текущем CSR entrypoint; OS preference использовать только для
  первого сохранённого выбора, SSR sign-off оставить в отложенном `U-22`.

## Реализованный contract

### Token map

| Pen source | Semantic purpose | Tailwind/CSS contract |
| --- | --- | --- |
| `bg-dark #0A0A0B` / `account-bg-light #FBF9F4` | application canvas | `bg-background`, `--ui-background` |
| `surface-dark #14151B` / `account-surface-light #F8F5EE` | neutral surface | `bg-surface`, `--ui-surface` |
| `elev-dark #1B1D27` / `account-elev-light #F4F0E8` | elevated surface | `bg-elevated`, `--ui-elevated` |
| `text-dark #F5F5F6` / `account-text-light #24211D` | primary text | `text-foreground`, `--ui-foreground` |
| `secondary-dark #A1A1AA` / `account-secondary-light #625C54` | secondary text | `text-secondary`, `--ui-secondary` |
| `muted-dark #8B8B98` / `account-muted-light #7A7268` | muted metadata | `text-muted`, `--ui-muted` |
| `border-dark #34384A` / `account-border-light #DED8CC` | structural border | `border-border`, `--ui-border` |
| `accent #8E9BFF`, light action `#5B61E6` | primary action/focus | `accent`, `accent-hover`, `accent-soft`, `accent-foreground`, `focus` |
| `success #56D6AE`, direct `warning #E3B45B`, `error #F08A9B` | status accents and accessible text | `success*`, `warning*`, `error*`; exact Pen raw colors remain named tokens |
| `font-ui IBM Plex Sans` | UI/display | `font-sans`; variable weights `100–700`, system sans fallback; public intermediate weights reproduce rendered Pen as documented in 2026-10-17 reconciliation |
| `font-mono IBM Plex Mono` | labels/numbers | `font-mono`; weights `400/600`, system mono fallback |
| `Inter` in Razor Loop wordmark | brand only | `font-brand`; self-hosted `700`, separately approved 2026-10-17 |
| `10–24`, `28`, Hero `38/42/54/76/108 px` | UI and display type scale | named `text-ui-*`, `text-page-title`, `text-section-title`, `text-display-*`, `text-hero-*` |
| `4/8/12/16/24/32/48/64 px` | control/content/section rhythm | named `spacing-*` tokens |
| `8/10/11/12/14/16/18 px` | control/card/panel/dialog shape | named `radius-*` plus `--ui-radius` |
| `768/1200/1600 px`, `720/900/1920/2560 px` | tablet/desktop/wide and role-specific content bounds | `breakpoint-tablet/desktop/wide`, `container-reading/account/page/shell`; 2560 теперь Pen reference |
| Service Cloud/Orbits flat background and shared action/text values; preserved Signal Orbit mesh values | primary Hero and backup | `bg-background`, `text/bg/border-hero-*`, backup `--ui-hero-*`; no raw palette duplication in Vue |
| public header `64/88/96/112 px` | mobile/tablet/desktop/wide shell rhythm | `spacing-public-header-*` |

### Compact visual contract

- Core palette: Night `#0A0A0B`, Paper `#FBF9F4`, Iris `#8E9BFF`, Iris Strong
  `#5B61E6`, Mint `#56D6AE`, Coral `#F08A9B`; Amber `#E3B45B` is a supporting
  status color.
- IBM Plex Sans carries UI and display hierarchy; IBM Plex Mono is limited to
  labels, numbers and technical values. Fontsource provides local Cyrillic and
  Latin assets with `font-display: swap`. Сверка 2026-10-17 добавила Mono
  `500/700` из уже установленного пакета для footer labels и Hero eyebrow.
- Public Pen reference content uses a `1280 px` left-aligned canvas at the
  `1440 px` reference; the new UHD boards explicitly expand page grids to
  `1840 px` and public chrome to `2560 px`. Reading and
  account content retain `720/900 px` bounds. Mobile is below `768 px`, tablet
  is `768–1199 px`, desktop starts at `1200 px`, and the Pen-backed wide public
  layout starts at `1600 px`.
- Desktop-to-UHD values are fluid endpoints, not two fixed presets: public
  shell gutters, Hero grid/columns, display type and signal geometry stay at
  their desktop minimum through `1440 px`, then interpolate continuously to
  the exact `2560 px` reference. The `1600 px` breakpoint may change section
  structure, but must not jump directly to final UHD dimensions.
- The primary expressive public device is the Service Cloud / Service Orbits
  SVG composition with 23 locally hosted theme-aware service logos (2026-10-17). The
  asymmetric Signal Orbit mesh-gradient and its pointer-only response remain
  available only in the preserved backup;
  `06 · Razor Loop` remains the brand mark. Other surfaces
  stay quiet, bordered and free of decorative gradients or heavy shadows.
- `BrandLogo` exposes fixed `icon`, `horizontal` and `stacked` variants. Its SVG
  keeps the Pen paths and `0 0 213.435 147.7913` viewBox; the icon is also the
  SVG favicon.

### Contrast and tooling review

- Minimum checked light pair is muted/background at `4.50:1`; foreground,
  secondary, accent/action and accessible status text pairs range from
  `4.64:1` to `15.23:1`.
- Checked dark text/action/status pairs range from `5.88:1` to `18.16:1`.
- `forced-colors` maps semantic roles to system colors; `20rem` is the minimum
  canvas width and the tested page has no horizontal overflow.
- No Prettier/Tailwind class-order plugin exists. Class order is maintained
  manually; no dependency or formatter configuration was added.
- Variant maps contain complete static class strings. The production build
  emitted the custom logo, radius and semantic color utilities.
- No project `@utility` was needed yet; focus remains an explicit semantic token.
  No `@apply` or page-specific CSS class was added.

### Verification evidence

- `./vendor/bin/sail npm run build` passes for both client and SSR bundles with
  Tailwind `4.3.3`, Vue `3.5.44` and Vite `8.3.4`.
- A real browser hard reload originally confirmed explicit light, explicit dark
  and the former `system` mode before app mount. The product contract was
  narrowed on 2026-10-15 to two explicit modes; the OS preference now selects
  only the first persisted value. Computed canvas / text pairs remain
  `#FBF9F4/#24211D` and `#0A0A0B/#F5F5F6`.
- Browser font loading reported IBM Plex Sans ready; the live logo retained
  `0 0 213.435 147.7913` and `#7C8AFD`.
- A `480 px` CSS viewport at device scale `2` had no horizontal overflow.
  Emulated `forced-colors: active` resolved canvas/text/border/focus to system
  colors and also had no horizontal overflow.
- Pen boards `H`, `I`, `K` and `L` were captured read-only and had no collapsed,
  clipped or broken foundation layout. The `.pen` document was not changed.

## Критерии готовности

Текущие responsive font/spacing endpoints и ограничения повторной проверки
зафиксированы в [сверке 2026-10-17](2026-10-17-pen-reconciliation.md).
Inter `700` подключён только для wordmark по отдельному подтверждению владельца
2026-10-17; остальной UI сохраняет IBM Plex Sans/Mono. Heading line heights
повторяют округлённые Pen bounds `36/40/52/73/104 px`. Raw intermediate weights
Pen и их фактическая отрисовка различаются; public display/Hero actions и обычные
menu items используют browser `400`, чтобы сохранить исходные переносы и
геометрию текста. Уточнённое owner decision: только кнопка «Войти» в header
на всех ширинах использует `font-semibold` / `600`; ссылки в menu и footer
сохраняют прежнее обычное начертание `400`.

- Все подтверждённые Pen tokens имеют единственное semantic представление.
- Выбранный logo contract однозначен; невыбранные concepts не попадают в UI.
- Light и dark palette воспроизводят Pen и не зависят от случайных raw classes.
- Шрифты загружаются без layout-breaking fallback.
- Vue-компоненты получают корректные semantic colors и radius через Tailwind
  design tokens.
- Сборка проходит; landing/account страницы ещё не реализуются.

## Команды проверки

```bash
rg -n "@theme|--color-|--font-|--radius-|--breakpoint-" resources/css vite.config.js
./vendor/bin/sail npm run build
git diff --check
```

Если меняется PHP-конфигурация:

```bash
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential <paths>
```

## Сценарии проверки

- Открыть пустой theme specimen в light и dark modes.
- Проверить background/surface/elevated/text/border/accent/success/error/warning.
- Проверить IBM Plex Sans и Mono при медленной загрузке шрифтов.
- Проверить отсутствие theme flash при hard reload и SSR hydration.
- Проверить 200% zoom и системный high-contrast режим.

## Needs review

До инициализации локального `tailwind-4-docs` snapshot любые новые или
version-sensitive Tailwind API сверяются с установленным package source и
помечаются `Needs review`.

`Needs review`: `@theme inline` и class-based `@custom-variant dark` проверены
по source фактически установленного Tailwind `4.3.3` и успешной CSR/SSR сборкой,
но formal cross-check с project `tailwind-4-docs` snapshot остаётся отложенным,
поскольку его инициализация не входит в этот шаг. Operational SSR/theme-flash
sign-off по-прежнему отложен в `U-22`; CSR bootstrap выполняется до `@vite`.

