# Шаг 15 — проверка качества верификации

Дата: 2026-10-22. Проверены требования текущего шага, browser assertions,
source snapshots и сохранённый HTML-report. Production UI, Pen, backend и
зависимости в этом review не менялись. Выбраны frontend-design,
vue-best-practices и tailwind-best-practices по правилам шага 15.

## Подтверждённая evidence

- Read-only live inventory: **215 IDs**, полностью совпадает с frame matrix;
  нет missing/extra/duplicate IDs. Из них 205 route/state references и
  10 visual-only boards.
- Из встроенного ZIP сохранённого `shell-final-report/index.html` прочитаны
  `report.json` и подробные records. Итог действительно **1073 expected,
  0 unexpected, 0 skipped, 0 flaky**, 15 projects, 469.7 seconds.
- В report есть ровно все **205 Pen**, **84 surface** и **101 shell** IDs;
  пропусков и лишних cases относительно source snapshots нет. Snapshots
  содержат **196 / 543** роли, без дублирующихся role IDs.
- В report **1605 attachments**: все ссылки на внешние файлы разрешаются,
  inline bodies находятся в самом report. Проверка наличия artifact не
  означает визуальный просмотр каждого screenshot.
- Q2 представлен **10** references: mobile/tablet/desktop/Full HD/QHD,
  две темы. В действии плана исправлено устаревшее число «шесть».
- Фактический Sail Node — **v24.16.0**. Параллельные изменения requirements
  до 24.22.1 сохранены; этот review не проверяет смену runtime.

Полный результат 1073/1073 относится к предыдущему прогону на том же client
build. Новая проверка ниже повторяет затронутые projects после усиления
assertions; она не объявляется новым полным suite или SSR acceptance.

## Найденные defects самой проверки

Каждый defect воспроизведён controlled mutation только browser DOM реального
fixture. Исходные assertions давали exit 0, хотя presentation была неверной.
После исправления та же mutation даёт exit 1 на соответствующей проверке.

| ID | Negative control | Почему прежняя проверка пропускала | Исправление |
| --- | --- | --- | --- |
| V-15-01 | `OidTs`: `#devices > div` получает `background-color: #ff00ff` | Для layout role поиск painted background начинался с parent, собственный фон проверяемого элемента игнорировался | Поиск начинается с target. Полностью прозрачный fill допускает переход к ancestor. Failure: `fill kfTJr`, фактический `rgb(255, 0, 255)`. |
| V-15-02 | `OidTs`: первый feature получает `box-shadow: 0 0 0 9px #383d53` | Assertion искал только цвет: внешний shadow любой толщины считался source inset border | Проверяется source color вместе с `0 0 0 1px inset`, где ширина берётся из snapshot. Failure: `inset ring f3y7m`. |
| V-15-03 | `H2013`: первый menu item получает `min-height: 0; height: 30px` | Source height была сохранена, но для menu items не сравнивалась | Проверяются min-height и actual height >= source minimum для menu items/CTA и secondary payment actions. Рост с текстом допустим. Failure: `minHeight OxgB4` 0 вместо 50 и actual height 30. |
| V-15-04 | `OidTs`: первый feature получает `visibility: hidden` | `toBeAttached()` подтверждал только DOM presence; hidden элемент сохраняет computed geometry/colors | Для всех shell/surface roles требуется `toBeVisible()`. Failure: expected visible, received hidden. |

Во всех **4/4** negative controls получен переход **pass → fail**. Временные
mutation hooks удалены до положительного прогона; production source и Pen
не модифицировались. Новые IDs относятся к verification defects и не
увеличивают счётчик 28 исправленных UI defects.

## Сопоставление с планом

| Требование шага 15 | Что подтверждает проверка | Статус |
| --- | --- | --- |
| Matrix каждого frame/route/state | Live 215 IDs, 205 report cases, 10 boards не превращены в routes | Подтверждено |
| Capture пяти widths, обе темы, UHD references | Responsive/public screenshot cases и файлы report; raw UHD roles в snapshot | Capture подтверждён; полная visual comparison открыта |
| Structure/spacing/type/color/radius/border | Typography assertions, 196 surface и 543 shell roles; source-derived expected values | Частично: это выбранные роли, не каждый node каждого frame |
| Q2 route и структура списка/таблицы/links | 10 references в report; assertions `pen-frames` и `account-referral` | Подтверждён заявленный автоматический scope |
| Intermediate widths и desktop Cloud geometry | `responsive-accessibility`: 11 widths на 16 compositions; 4 desktop viewports для обоих Hero, отдельная x-bound проверка Cloud | Подтверждён заявленный автоматический scope |
| Overflow/clipping/safe areas/zoom | DOM overflow, text ×2 и simulated viewport reflow; text clipping audit ограничен hidden/clip ancestors | Частично; native zoom, touch keyboard и safe areas остаются ручными |
| Landmarks/labels/status/keyboard/focus/targets | DOM/ARIA references, ariaSnapshot, Playwright keyboard/control checks и state tests | Частично; physical keyboard и чтение AT не подтверждены |
| Contrast | Computed text/field/icon/focus/selection checks и finite painted Hero/CTA cases | Частично; unsupported chains не считаются проверенными |
| Reduced motion/forced colors/reading order | Browser emulation, lifecycle assertions, static poses | Частично; native motion/background и AT остаются открытыми |
| Service Cloud и Signal Orbit полностью | Геометрия, fallback на resource error и finite poses; source screenshots | Полный ambient/hover/drag/device/visual smoke открыт |
| Operational SSR | Исторические 40/40 на отдельном renderer/HTTP server | Проверен прежний build; здесь не перезапускался |
| Reset SMTP | Результата внешней доставки нет | M-12 открыт |

В приложенных `text-contrast` reports обнаружены **257 entries `manual`**
(23 уникальных label). Это повторяющиеся измерения по разным cases, а не
257 самостоятельных defects. Причины — unsupported gradient/opacity chains.
Отдельные Hero/CTA роли покрывает `rendered-contrast`, но отсутствие failures
в computed helper не закрывает оставшиеся chains. Полный contrast checkbox
правильно остаётся открытым. Logo text и disabled/inert/hidden content также
исключаются helper по его явным правилам.

Другие явные границы: `pen-shells` сверяет geometry/color status glyphs и два
отличающих SVG paths; metadata иконок остальных public roles не является
полным icon artwork assertion. Footer gap, absolute y, hug widths и source
demo heights имеют описанные исключения. Их нельзя выдавать за pixel equality.
Focus helper проверяет computed outline и hit-test points внутри host, а не
сэмплирует весь painted contour: clipping самого outline требует отдельного
визуального результата. `ariaSnapshot` также не является проверкой объявления
и порядка чтения конкретным screen reader.

## Повторная проверка и artifacts

Команда положительного прогона после удаления mutation hooks:

```bash
./vendor/bin/sail npx playwright test --project=pen-shells --project=pen-surfaces
git diff --check
```

Результат — **185/185 за 1 минуту**, exit 0; все 739 source roles проходят
усиленные checks. UI/build assets не менялись, поэтому build, frontend/PHP
tests и остальные browser projects повторно не запускались. Их прошлые
результаты сохранены как историческая evidence, не как новый прогон.

- Report: `storage/app/pen-step15/verification-review/report/index.html`.
- Machine-readable artifact/negative-control summary:
  `storage/app/pen-step15/verification-review/artifact-evidence.json`.
- Positive log: `/tmp/pen-verification-review-final.log`.
- Negative logs: `/tmp/pen-review-{layout-fill,ring,menu-height,hidden-role}-{before,after}.log`.

Шаг 15 остаётся открытым. N-15-01/02/03 и M-01…M-12 не закрыты этим review.
На шаг 16 не переходили; commit не создавался.
