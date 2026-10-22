# Шаг 15 — public shell и контентные секции landing

Дата: 2026-10-22. Продолжение шага 15 на ветке `pen-integration`.
Текущий HEAD — `7d9698c`; существующие незакоммиченные изменения сохранены.
Выбраны frontend-design, vue-best-practices и tailwind-best-practices.
Pen используется read-only; runtime, build и browser tests — через Sail.

## Source и scope сравнения

Live `Get(resolveVariables: true)` повторно проверил все 100 ранее сохранённых
public detail roles: дельты snapshot нет. Дополнительно прочитаны 44 text
alignment roles. Итого [snapshot](pen-public-detail-roles.json) содержит
**144 роли из 11 прямых references**. Для final CTA используется также
существующий gradient source `final-panel` из [shell snapshot](pen-shell-roles.json).

| Width / theme | Прямой Pen reference | Browser case |
| --- | --- | --- |
| 360 dark | `roQZ1` | direct |
| 360 light | Геометрия `roQZ1`, light palette `sCLcA` | inferred theme |
| 390 dark / light | `OidTs` / `sCLcA` | direct |
| 768 dark | `m3BuD` | direct |
| 768 light | Геометрия `m3BuD`, light palette `sCLcA` | inferred theme |
| 1440 dark / light | `j3aRaj` / `K1XlL` | direct |
| 2560 dark / light | `j8pJq` / `eM8HW` | direct |
| Menu mobile dark / light, tablet dark | `H2013` / `SnjXU` / `w0LF3` | direct state |

Для 360/light и 768/light нет самостоятельных current Pen frames. Эти cases
явно помечены как производные; цвет границ также берётся из light palette,
а не из dark geometry reference. На tablet сохраняется source center alignment.

Через `TakeScreenshot` получен **51 focused Pen PNG**: шесть public sections
в восьми прямых landing frames и три menu panels. Browser matrix сохраняет
**66 PNG**: шесть sections × пять widths × две темы, три menu panels и три
menu viewports. Final CTA сравнивается по полной секции с её внешними отступами;
panel geometry отдельно покрывает `pen-shells`. Menu panel PNG браузера
обрезает внешний shadow по границе элемента; shadow проверяется в viewport
и существующих source assertions. Light menu снимается с hover первого пункта,
как в прямом source.

Просмотр comparison sheets включает header/brand/controls, преимущества,
платформы, pricing, final CTA, footer и menu. Проверяются композиция, переносы,
порядок, alignment, границы и декор; source assertions дополняют screenshot
review точными размерами и цветами. Pen thumbnails ограничены 400px по длинной
стороне: это не pixel equality мелкой типографики или font rasterization.

Сохраняются принятые отличия: representative server prices и преимущества,
полная цена периода без деления на месяцы, semantic contrast corrections,
усиленный selected outline, отсутствие legal links без согласованных страниц,
footer year из runtime и положение tablet menu под фактическим header.
Footer может стать короче после удаления двух несогласованных links;
высоты pricing/content допускают рост с реальными данными и текстом.

## Найденные и исправленные defects

| ID | Source / наблюдение | Исправление и regression |
| --- | --- | --- |
| D-15-29 | Theme icon: `T9WZVW` 17px, `jKpP6` 22px, `lCd64` 24px; раньше везде 16px и общий secondary color | Fixed variant `publicTheme` в UiIcon и responsive semantic token; отдельная public theme palette, включая desktop dark `#B7BEFF` и light `#5B61D6`. Exact width/height/color assertions. |
| D-15-30 | Selector `s4vW8X` / `Hcryu` использовал page background вместо `#11131A` / `#EEEAE1`; selected `khBQN` / `f3IACX` — общий tile вместо `#303650` / white. `ENzi7` / `TUerf`: gap 8/0 вместо 12; `aEVX1`: action gap 12 вместо 10 | Выделены selector/selected/border roles и responsive header/action gaps. Высота, inset border geometry, fills и gaps сверяются с source. Усиленный accent outline сохранён. |
| D-15-31 | Feature icons (`Wv8aY`, `LS2ek`), pricing/final eyebrows (`ZFlNt`, `gh5CR`) и menu arrows (`OssW9`) использовали один общий accent-text | Отдельные semantic roles с исходными light/dark colors. Остальные accent call sites не меняются; forced colors имеют system mappings. |
| D-15-32 | `HtNKO` / `tCvfu` и `o0C81a` / `d9W5Y`: mobile intro должен быть left-aligned. Реализация центрировала на всех widths | Left на mobile, center с tablet. До исправления **3/3** direct mobile cases падают на четырёх text roles каждый. Добавлены **44** source alignment roles, включая centered tablet/desktop и menu compositions. |
| D-15-33 | Final CTA `apg6H` / `z51HkA`, desktop `AXSXy`, UHD `Mzme1`: Pen rotation 90° направляет gradient влево, реализация использовала `to right` | `bg-linear-to-l`, исходные endpoints сохранены. `.pen` schema задаёт CCW от up, CSS — clockwise. Assertions проверяют преобразование угла и порядок цветов. До исправления **2/2** themes падали: CSS 90° вместо 270°. |

Начальный Sail public regression воспроизводил ошибки во всех **11/11**
прямых references. После первой группы corrections все 11 прошли; screenshot
review затем независимо выявил D-15-32 и D-15-33. Их before-failures сохранены
отдельно. Это пять новых UI defects, суммарно **33** в шаге 15.

Границы компонентов сохранены: `PublicHeader` отвечает за chrome/theme,
`PublicMobileMenu` за overlay navigation; четыре landing components — за
свои sections. Новая оркестрация, props, business rules и зависимости не
добавлялись. Tokens находятся в CSS-first `@theme` / theme palette.

## Повтор видимого native Hero smoke

Pen Browser загрузил реальное приложение. При `1440×1080` до capture:

- `document.hidden=false`, Cloud ready/running/interactive; SVG **580×620**
  в bounds `(732.5, 277.98)`, 23 SVG images.
- Две выборки image coordinates с интервалом 500ms различаются до pointer
  input: ambient SVG обновляется в видимом context.
- CDP mouse hover, press `(1180,380)`, drag `(700,500)` за левую границу SVG
  и release дают `pointerdown`, `gotpointercapture`, `pointerup`,
  `lostpointercapture` с **isTrusted=true**. Dragging true при press/capture,
  false после release; running/interactive сохраняются.
- `return-screenshot` для `.service-hero` снова завершается **IPC timeout
  60000ms**. После него `document.hidden=true`, running/interactive false.
  Probes/listeners удалены, viewport override снят; storage и Pen не менялись.

Это положительный частичный native input/ambient результат, но не полный
visual motion/background-return acceptance. N-15-02 / M-09 остаются открытыми;
mobile/tablet live orbits и запасной Signal Orbit этим запуском не проверены.
Probe предшествовал финальным public CSS corrections; Hero renderer не менялся.
Принудительная подмена `document.hidden` не применялась.

## Проверка и artifacts

Focused public matrix: **13/13** cases, **168** detail role instances и
13 gradient checks; 11 прямых source compositions и два inferred theme cases.
Production client/SSR build, frontend **81/81** и Laravel **277 tests /
2628 assertions** проходят. В Laravel сохраняются прежние 266 PDO deprecations.
Полный browser suite на окончательном build — **1120/1120 за 8.9 минуты**,
exit 0. HTML-report подтверждает 17 projects, 0 unexpected/skipped/flaky и
наличие всех **1774 attachments**. В нём ровно 205 Pen, 84 surface,
101 shell, 34 Hero и 13 public cases. Состав и counters сохранены в
`full-summary.json` и `review-evidence.json`. Промежуточные прогоны,
остановленные после новых visual findings, итогом не считаются.

```bash
./vendor/bin/sail npm run build
./vendor/bin/sail npx playwright test --project=public-acceptance
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail composer test
./vendor/bin/sail npm run test:e2e
git diff --check
```

Artifacts: `storage/app/pen-step15/public-review/index.html`, `pen/*.png`,
`*-sheet.png`, `report/index.html`, `full-report/index.html`, `scenes.json`.
`review-evidence.json` сохраняет counts, before-failures, native limitation
и SHA-256 фактически просмотренных browser PNG. Сгенерированные SSR files
восстановлены до байтов рабочего дерева в начале этого продолжения;
прежний незакоммиченный diff не сброшен.
Before-failure logs: `/tmp/pen-step15-public-review.log`,
`/tmp/pen-step15-public-alignment-before.log`,
`/tmp/pen-step15-public-gradient-before.log`. Итоговые logs:
`/tmp/pen-step15-public-final.log`, `/tmp/pen-step15-public-full.log`,
`/tmp/pen-step15-public-build-final.log`, `/tmp/pen-step15-public-frontend.log`,
`/tmp/pen-step15-public-laravel.log`.

Статическая public comparison имеет результат в этом scope. Детальная visual
приёмка auth/shared/account, native motion, physical keyboard/AT/device/zoom
и внешний reset SMTP остаются открытыми. Operational SSR на новом build здесь
не повторяется; прежние 40/40 — историческая evidence. Шаг 15 не закрыт,
шаг 16 не начат; commit не создавался.

## Последующее подтверждение владельца и повтор public regression

Владелец явно подтвердил **M-01…M-11 пройдены; внешний SMTP не проверялся**.
Это supersedes прежние manual статусы, включая M-09 в разделе native probe
выше. Результат записан в [ручной протокол](pen-step15-manual.md) как
owner-reported; ОС/browser/AT/device не указаны и не выведены из эмуляции.
Успех capture Pen Browser не заявляется; Service Cloud motion принят по M-09
в обычном видимом браузере. M-12 остаётся открытым.

Присланные 11 public failures с `public-acceptance.spec.js:20:5` совпадают
с начальным before-fix логом. В текущем тесте declaration находится на
строке 40, добавлены также два inferred light cases. Новый запуск в Sail
без изменения production source или build — **13/13 за 14.6s**, exit 0,
0 unexpected/skipped/flaky. Все 11 перечисленных IDs прошли; состав проверен
по встроенному `report.json`, не только по счётчику console log.

Новый report: `storage/app/pen-step15/public-review/owner-followup/report/index.html`;
machine-readable summary — `owner-followup/summary.json`.
Log: `/tmp/pen-step15-public-owner-followup.log`.
Это focused повтор, не новый полный suite: прежний **1120/1120** выше
остаётся предыдущим результатом. Шаг 15 не закрывается: detailed auth/account
visual, оставшийся explicit Signal Orbit scope, quantitative contrast chains
и внешний SMTP требуют отдельного результата.
