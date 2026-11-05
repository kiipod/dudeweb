# Шаг 6 — Content Sections

## Цель

Реализовать все контентные секции Landing V2,
кроме Header, Hero, News и Footer/Final CTA,
которые выполняются отдельными задачами.

## Зависимости

- docs/landing-v2/design-inventory.md
- docs/landing-v2/implementation-map.md

## Section Inventory

- [x] Получить полный список секций из design-inventory.md.
- [x] Исключить уже реализованные секции.
- [x] Определить порядок реализации.
- [x] Определить общие UI patterns.
- [x] Определить необходимые assets.

Не добавлять секции, отсутствующие в актуальном макете.

## Для каждой секции

### Structure

- [x] Реализовать структуру.
- [x] Перенести заголовки.
- [x] Перенести описания.
- [x] Перенести карточки.
- [x] Перенести изображения.
- [x] Перенести кнопки и ссылки.
- [x] Сохранить порядок элементов.

### Design

- [x] Typography.
- [x] Spacing.
- [x] Colors.
- [x] Layout.
- [x] Borders.
- [x] Background.
- [x] Responsive variants.

### Functionality

- [x] Реализовать предусмотренные действия.
- [x] Использовать существующие бизнес-механизмы.
- [x] Не создавать дублирующую backend-логику.
- [x] Проверить ссылки и callbacks.

### Components

- [x] Выделять повторно используемые компоненты при необходимости.
- [x] Не создавать отдельный компонент для каждого декоративного элемента.
- [x] Избегать дублирования.
- [x] Сохранить понятную структуру.

## Pricing

В актуальном V2 тарифный блок — section 07 Subscription с Final CTA.
Он исключён из цели этого шага и отнесён к шагу 08 в implementation-map.
Следующие требования сохраняются для шага 08; их выполнение на шаге 06
не заявляется:

- Перенести дизайн из Pen.
- Проверить текущий источник тарифов.
- Переиспользовать существующую бизнес-логику, если она нужна.
- Не дублировать расчёт стоимости.
- Не изменять правила скидок.
- Проверить CTA оплаты.

Не считать тарифные значения из макета актуальными
backend-данными без проверки.

## Проверка

- [x] Все секции текущего шага из inventory реализованы.
- [x] Порядок соответствует Pen.
- [x] Тексты соответствуют Pen.
- [x] Assets соответствуют Pen.
- [x] Ссылки работают.
- [x] Адаптивность проверена.
- [x] Build проходит.
- [x] implementation-map.md обновлён.

## Результаты проверки — 2026-11-06

Контракт и полная evidence matrix:
[content-contract.md](../../../docs/landing-v2/content-contract.md).
Текущий scope из inventory: **Platforms → One connection**, после Hero.
Оба section tree, glyphs, точные тексты и responsive значения повторно прочитаны
живым Pen MCP во всех восьми адаптивах; current signal board подтверждён.
Pen не изменялся. Выбраны `frontend-design`, `vue-best-practices`,
`tailwind-best-practices`, Pen `pen-dev`.

Добавлены `LandingV2Platforms`, `LandingV2Connection`, `LandingV2Signal`, pure
source geometry и собственные V2 content tokens. На mobile пять platform cells
сохраняются в одном ряду, facts/story stacked; с 1024 — две информационные
области. Существующие shared `UiIcon` glyphs переиспользованы без изменения.
`#devices` теперь реальная section target с tabindex −1.

Connection содержит 23 исходных brand PNG, по одной связанной SVG route от
правого края каждого node до dudeweb origin, пять outgoing waves и wave fronts.
HTML copy вынесен над графикой до 1440 и расположен справа на desktop.
Используется source **static state `u_static=1/u_phase=0`**; все пары видимы.
Motion этой секции по implementation-map относится к шагу 09 и здесь не
закрывается. Нового browser state, таймеров, RAF loop, WebGL и dependencies нет.

Отметки пунктов о buttons/links/actions/callbacks означают исследованное
отсутствие их внутри этих двух sections. Фиктивные actions, downloads и API
не добавлены. Проверены существующие navigation anchors к реальным sections.
Pricing/Final CTA остаются 08; backend PHP, цены, скидки и оплата не менялись.

Проверки через Sail:

- **97 Playwright passed**: 19 content + 78 regression tests этапов 02–05.
  Восемь reference widths × light/dark preference, исходные copy/type/grid,
  table/field/origin/mark geometry, все 23 logo/route pairs, assets и actual
  mobile/desktop `#devices` navigation; дополнительные widths 320–3840,
  reduced motion и forced colors. Source static state проверен в обеих
  motion preferences, без преждевременного заявления motion acceptance.
- **10 Laravel tests / 105 assertions**, **2 SSR unit tests**.
- `npm run build`: успешные client + SSR build.
- **6/6 built-bundle SSR/hydration**: header/Hero/Platforms/Signal DOM сохранён,
  пять platform cells и 23 native pairs присутствуют, без JS/hydration errors.
- **16/16 baseline comparisons старой `/`** без различий. Старые public
  components, shared components/composables, routes, assets и theme store
  не менялись; новые CSS overrides ограничены V2.
- Snapshots 390/768/1024/1440/2560 просмотрены рядом с live Pen. Native/browser
  line metrics различаются: table height имеет допуск 6px, фактическое отличие
  final samples около 0–1.3px. На 430 browser copy занимает две строки;
  source minimum 111px сохраняет композицию без изменения текста/шрифта.
- SVG сохраняет source geometry; antialias bands/pulses представлены vector
  strokes/gradients. Это не pixel acceptance всех shader animation phases.
- `git diff --check`; generated `bootstrap/ssr/*` восстановлены и исключены
  из commit.

Это локальная приёмка двух content sections, не physical-device, полная
accessibility или production acceptance. Шаги 07–12 не выполнялись.
Overview DoD остаётся финальному этапу.

## Commit

feat: implement landing v2 content sections
