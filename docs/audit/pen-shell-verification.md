# Шаг 15 — auth/status и публичные layout roles

Дата: 2026-10-22. Продолжение после D-15-19…24, ветка `pen-integration`.
Pen читается только через MCP; исходный документ не менялся.

## Source и coverage

Из текущих 215 frames сохранены **543 роли в 101 reference**:
90 auth/status/payment и 11 public, включая три открытых menu. Source IDs,
размеры, padding, gap, radius, fill, stroke, status glyphs и menu shadows — в
[pen-shell-roles.json](pen-shell-roles.json). Widths: 360/390/768/1440/1920/2560;
обе темы там, где есть соответствующий reference.

| Роли | Количество |
| --- | ---: |
| Auth header / content | 90 / 90 |
| Status icon / payment secondary action | 50 / 20 |
| Public theme / login | 11 / 11 |
| Advantages layout / feature / icon tile | 11 / 66 / 66 |
| Platforms layout / platform | 11 / 55 |
| Pricing layout / final panel | 11 / 11 |
| Footer layout / links | 11 / 11 |
| Menu panel / item / CTA | 3 / 12 / 3 |

Read-only `TakeScreenshot` для status artwork: `G35E7A`, `Rhl7Z`, `JGmpE`,
`oHoCI`, для menu — `RZFVB/w4lZ2D`. Дополнительно перечитаны public
header/menu и их responsive варианты.
Обычные auth compositions уже соответствовали проверенным layout values;
перестройка форм не потребовалась.

Дополнительно сопоставлены full-frame source captures `qV2vd/NDzQS/z75E8g/tYWHi`
со свежими browser PNG финальной сборки: artwork и интервалы действий
соответствуют проверяемым ролям, новых clipping/overflow не обнаружено.
У O2 сохранены безопасный runtime copy и support action, поэтому высота
контента отличается от короткого Pen demo. Уменьшенный source capture
не подтверждает точность мелкой типографики.

## Исправленные defects

| ID | Подтверждённое расхождение | Исправление и source examples |
| --- | --- | --- |
| D-15-25 | O2/O4 и successful payment использовали generic theme surfaces; O2 показывал plain mail, pending — другие clock hands. Pending/error backgrounds также отличались от source | Чёрный icon container в обеих темах для O2/O4/success; отдельные source accent/success glyph colors. `mail-check` и `clock-3`, pending `#E3B45B1A`, error `#F08A9B1A`. `G35E7A/Rhl7Z`, `LaGyj/Cdgj0`, `JGmpE/qg2jO`, `oHoCI/u4N5Id`, `VZTvx/DBGzh`. Size 68, radius 22, glyph 30 сохранены. |
| D-15-26 | Secondary payment actions имели generic surface/border и vertical padding 12; actions gap был 8 вместо 16 | Status secondary background `#171923/#EFEAE1`, border `#3A3F55/#D8D0C4`, vertical padding 0, gap 16. Responsive horizontal padding и minimum height сохранены. `PZSIp/IVetu`, `fTTRc/D5ltr` и остальные 16 экземпляров. |
| D-15-27 | Theme/login buttons в public header использовали один generic elevated background/border для всех widths | Отдельные neutral theme/login roles: light `#F7F3EC/#D8D0C4`; dark mobile/tablet theme `#111218/#303444`, login `#171923/#434A68`; desktop theme `#171923/#434A68`, login `#1B1E2A/#485071`. `pZQPB/c6gpWA`, `h8yoQT/vMDBn`, `HsTQS/e8hOY`, `AlIR4/HbeTS`, `q4mone/hmitW`. |
| D-15-28 | Public menu panel/items имели generic palette, gap 4 в обеих темах, отсутствовала тень; light CTA border отличался от source | Panel `#151518/#FFFEFA`, border `#323238/#D8D0C4`, gap 4/6; items `#222537/#FFFEFA`, light borders `#DED8CC`, light hover `#EEF0FF/#C9CEF2`. Source outer shadows и semantic accent CTA border. `HUo8a/RZFVB/w4lZ2D`, `OxgB4/yD2gq/Sj7py`, `YdXHE/J0Ida/DXMX1`. |

Новые semantic tokens записаны в `auth-tokens.css` и `landing-tokens.css`.
`AuthStatus` владеет O2/O4 artwork, `PaymentResultShell` — payment artwork и
action gap; page задаёт presentation secondary links. `PublicHeader` и
`PublicMobileMenu` используют фиксированные theme roles. Existing overlay,
focus/scroll lock и data contracts сохраняются.

Геометрия двух новых SVG взята из уже используемой pinned Lucide **0.468.0**:
[mail-check](https://github.com/lucide-icons/lucide/blob/0.468.0/icons/mail-check.svg),
[clock-3](https://github.com/lucide-icons/lucide/blob/0.468.0/icons/clock-3.svg).
Добавлены entries существующего `LANDING_ICONS`; ISC notice находится рядом
в `landingIconPaths.LICENSE.txt`. Новая зависимость не устанавливалась.

## Сопоставление и сохранённые отклонения

- Размеры/radii/padding/gaps сравниваются с raw source, без подстановки CSS
  tokens в expected values. Для float layout допустимо 0.05px, для widths —
  1px. Source alpha нормализуется браузером: Chromium сериализует `#…1A`
  как `rgba(…, 0.1)`; handwritten decimal не является отдельным цветом.
- В `public-login` live source width не задан: это `hug`, а не fixed width.
  Поэтому проверяются exact padding/height, а measured width сохраняется
  в attachment. На UHD получено 101px против Pen 104px при одинаковых
  font size 19, padding 24 и source label; font-derived width не фиксируется.
- Menu item/CTA expected width учитывает 2px родительской HTML border box,
  как в surface audit; Pen stroke накладывается поверх layout.
- У layout containers фон может рисоваться предком; измеряется первый
  непрозрачный ancestor. Footer block margins не сравниваются с Pen flex gap.
- Первый light menu item в reference выделен. Здесь это **интерпретация
  pointer hover**, проверяемая через `hover()`. Постоянный selected state для
  первой секции не добавляется: контракт active section в Pen не определён.
- У tablet menu в Pen panel y=76/backdrop y=64 при header height 88. Сохраняется
  существующее размещение под реальным header: panel y=100, backdrop y=88.
  Это intentional overlap-prevention deviation, не попытка повторить
  противоречивую координату source.
- Accepted semantic primary colors и светлые warning/error foreground
  `#805B10/#A33E50` сохраняются для contrast. Цвета status glyph на чёрном
  background теперь одинаковы в обеих темах, как в source. Forced colors для
  новых neutral controls используют Canvas/ButtonText; system palette
  проверяет общий suite.
- Content heights с demo copy и абсолютные вертикальные позиции не становятся
  fixed runtime geometry. Feature/platform source heights — minimum heights.
  Рост реальных данных и текста допустим.

## Проверка

Добавлен Playwright project `pen-shells`: 101 existing fixture compositions,
543 роли, `shell-measurements` для каждого case. Проверяются padding/radii,
gaps, widths с описанным hug rule, surface/border colors, status glyph size,
color и отличающие mail-check/clock-3 paths; menu labels — по source foreground;
shadows — по source color,
offset и blur. В шести focused references прикладывается `shell-detail` PNG.

Первый прогон: **61 failed / 40 passed**; failures включали реальные defects
и ошибки сравнения clamp floats/transparent ancestors. После production fixes
отдельно устранены false positives alpha serialization и hug width.
Focused matrix: **101/101**; после добавления shadow assertions — **3/3**
menu cases. Unit suite с регистрацией новых SVG names — **79/79**.

Focused PNG выявил регрессию при добавлении tokens: `--color-public-menu`
пересекался с typography `--text-public-menu`; utility `text-public-menu`
перекрашивал labels в цвет panel. Цветовой token переименован в
`public-menu-panel`, добавлено сравнение foreground всех 12 labels с live Pen.
На предыдущей сборке новый regression воспроизвёл проблему в **3/3** cases:
dark foreground `#151518` вместо `#F5F5F6`, light `#FFFEFA` вместо `#24211D`.
После переименования token — **3/3 passed**; focused PNG обеих тем повторно
просмотрены вместе с source `RZFVB/w4lZ2D`.
Общий промежуточный прогон остановлен перед новой сборкой и не используется
как итоговый результат. Это исправление внутри D-15-28.

Финальный Sail suite: **1073/1073 за 7.8 минуты**, frontend **79/79**,
Composer/Laravel **277 tests / 2628 assertions**, exit 0; сохраняются прежние
PDO deprecations в 266 tests. Production client/SSR build и `git diff --check`
проходят. Generated SSR bundles восстановлены из HEAD. Копия report —
`storage/app/pen-step15/shell-final-report/index.html`; команды и logs — в
[verification audit](pen-verification.md). Проверенный Sail Node — **24.16.0**;
параллельные правки requirements до 24.22.1 сохранены, переход runtime не
проверялся. Полная visual acceptance,
native ambient/pointer, M-01…M-11 и внешний SMTP M-12 остаются открытыми.
DOM metrics и несколько focused PNG не закрывают всю visual matrix.
Шаг 15 продолжается; шаг 16 не начат, commit не создавался.

Review assertions: [V-15-01…04](pen-verification-review.md). Поиск layout fill
теперь начинается с самого target, inset ring проверяется вместе с geometry,
menu/secondary-action minimum height сравнивается с source; все roles должны
быть видимыми. Negative controls подтверждают чувствительность; положительный
повтор обоих source projects — **185/185**. Предыдущие 1073/1073 выше являются
историческим полным прогоном, а не повтором после review.
