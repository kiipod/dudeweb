# Шаг 3 — Layout and Design System

## Цель

Реализовать базовую структуру Landing V2 и стили,
соответствующие Pen.

## Зависимости

- design-inventory.md
- implementation-map.md

## Layout

- [x] Создать базовый layout Landing V2.
- [x] Настроить контейнеры.
- [x] Настроить общую сетку.
- [x] Настроить отступы секций.
- [x] Настроить фон страницы.
- [x] Настроить типографику.
- [x] Настроить адаптивную структуру.

## Design Tokens

- [x] Перенести цвета из Pen.
- [x] Перенести размеры и веса шрифтов.
- [x] Перенести spacing.
- [x] Перенести border radius.
- [x] Перенести shadows.
- [x] Перенести размеры контейнеров.

Не дублировать существующие токены без необходимости.

## Assets

- [x] Найти изображения из Pen.
- [x] Использовать доступные исходные assets.
- [x] Проверить корректность форматов.
- [x] Проверить размеры изображений.
- [x] Проверить шрифты.
- [x] Не заменять доступные оригинальные assets случайными аналогами.

Если нужный asset нельзя получить, зафиксировать ограничение.

## CSS Isolation

- [x] Проверить влияние глобальных стилей.
- [x] Не изменять внешний вид главной страницы.
- [x] Изолировать V2-specific styles.
- [x] Избежать конфликтов имён классов.
- [x] Не дублировать большие CSS-блоки.

## Проверка

- [x] Базовая сетка соответствует Pen.
- [x] Цвета соответствуют Pen.
- [x] Типографика соответствует Pen.
- [x] Assets подключены.
- [x] Нет глобальных CSS-регрессий.
- [x] / продолжает отображаться корректно.
- [x] Build проходит.

## Результаты проверки — 2026-11-05

Foundation contract и полная evidence matrix:
[foundation-contract.md](../../../docs/landing-v2/foundation-contract.md).
Значения повторно сверены живым Pen MCP по восьми V2 адаптивам, master `KwQuD`
и текущему visual-language board. Pen не изменялся.

Расширен собственный `LandingV2Layout`: white/light shell, Plex Sans, один
main и optional slots без пустых wrappers. Добавлен `LandingV2Section` с шестью
fixed padding variants, едиными responsive gutters и content cap 2000px.
V2 colors/type/spacing/radius/shadow tokens находятся в CSS-first `@theme`
отдельного `landing-v2-tokens.css`; новые имена `v2-*`, overrides ограничены
`[data-landing-v2]`. Общие шрифты, weights и совпадающие radii переиспользованы.
Ниже 360 сохраняется mobile scale; между references — bounded interpolation.

В `public/landing-v2/` подготовлены 33 assets с source IDs, реальными formats,
dimensions и hashes в manifest: исходный SVG mark, 23 brand PNG, шесть micro-UI
PNG и три news covers. Covers исходно названы `.png`, но содержат JPEG;
в repo extension `.jpg`, байты сохранены. SVG mark подключён в каркасе,
остальные изображения проверены по HTTP и browser decode для последующих
section tasks. Полные faces с текстом не используются вместо semantic markup.
Fonts уже установлены, включая Cyrillic и Sans weight 650.

Проверки через Sail:

- Foundation + routing Playwright: **25 passed** (восемь reference widths ×
  light/dark, шесть section variants, typography/spacing/container, palette,
  radii/shadows, assets; дополнительные intermediate и 3840px samples).
- SSR unit tests: **2 passed**.
- Laravel LandingTest + LandingV2Test: **8 passed / 95 assertions**.
- `npm run build`: успешны client и SSR build.
- Старый `/`: **16/16** сравнений с pre-change baseline, шесть областей
  страницы, computed styles и geometry без различий.
- Собранный V2 SSR bundle: **6/6** controlled hydration cases на
  390/1440/2560 × light/dark; h1 DOM сохранён, без JS/hydration errors.
- Исходные raster assets: **32/32** совпадают с Pen originals и manifest;
  все **33/33** assets декодируются и имеют правильные media type/dimensions.
- `git diff --check`; generated `bootstrap/ssr/*` исключены из commit.

Это локальная приёмка foundation. Визуальная приёмка будущих секций,
physical-device checks и production acceptance не заявляются. Старые PHP,
routes, shared components и theme preference не менялись; dependencies не
добавлялись. Шаги 04–12 не выполнялись. Overview DoD остаётся для финальной
проверки всего переноса.

## Commit

feat: implement landing v2 design foundation
