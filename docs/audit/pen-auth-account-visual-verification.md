# Шаг 15 — детальная visual-сверка auth/account

Дата: 2026-10-22. Текущий checkout ветки `pen-integration`; Pen прочитан
через `Get`/`TakeScreenshot`, без изменений документа. Выбраны и применены
`frontend-design`, `vue-best-practices`, `tailwind-best-practices`.

## Источник и границы проверки

Live inventory сохраняет 215 roots и 10 reusable components. Повторно
прочитаны все **194 non-public route/state references**, **8684 nodes**.
Это 40 mobile, 40 tablet, по 38 desktop/Full HD/QHD references в обеих темах:
390, 768, 1440, 1920 и 2560 px. Отдельного auth/account frame на 360 px нет;
поведение на 320/360 и промежуточных ширинах проверяет responsive suite.

- Auth: login, register, recovery, link-sent, reset, password-changed.
- Account: dashboard, subscription, connection, referral/Q2, support list,
  новое обращение, переписка, profile, четыре More и десять promo states.
- Payment: pending/succeeded/canceled, по десять references каждого состояния.

Сопоставлены composition, content hierarchy, responsive rearrangement,
spacing, typography, fills, borders, radii и glyph roles. Имеющиеся **250**
auth/status shell roles и **196** account surface roles повторно совпали с
live source: **0 deltas**. Typography опирается также на существующий snapshot
3932 text nodes: 184 heading, 194 brand, 70 control roles всех 205 screens.

Новый [detail snapshot](pen-auth-account-detail-roles.json) содержит **1794**
records: 1098 icons/copy icons, 208 header controls, 176 bottom-nav rows,
80 auth inputs, 76 internal surfaces, 14 overlays, 14 close controls, 8 handles, 70 step-number text roles
и 50 composition records. Последние 50 требуют наличие main и сохраняют
скриншоты; их status geometry/artwork проверяет существующий `pen-shells`.
Остальные 1744 records проверяют заявленные presentation properties.
Шесть исходных sidebar Theme rows сохранены отдельно в `omittedRoles`
с причиной исключения — они не сопоставляются с кнопкой выхода.

Просмотрены **194 полные пары Pen/браузер** на 25 обзорных листах и
**102 увеличенные пары** на 17 листах. Для прозрачных Pen fragments используется
фон соответствующей темы. Панели снимаются после завершения enter transition;
первые полупрозрачные browser captures заменены и не служат visual evidence.
Обзорные пары использовались для поиска расхождений; после fixes заново
сняты и просмотрены затронутые focused fragments. Итоговый browser suite
также сохраняет свежие 194 viewport и 194 content PNG.
Скриншоты Pen ограничены 400 px по длинной стороне. Поэтому мелкие размеры,
цвета и шрифты подтверждаются также source-derived assertions; равенство
каждого raster pixel и всех 8684 nodes не заявляется.

## Исправленные расхождения

| ID | Source / воспроизведённый defect | Исправление |
| --- | --- | --- |
| D-15-34 | Login eye `iMsdI` — 19 px; reset `z3IQxy/WczU9` — 18 px. Единая иконка была 20 px. | Отдельные semantic size variants для login/register и reset. Сохранена доступная кнопка 44×44. |
| D-15-35 | Header `yQJum/u64hJ`, `bFmRK`, `rXCS0`: radius 11, dark fill `#111218`, border `#303444`, secondary glyph; icon 20/22 px. Generic secondary button давал другие palette/radius/size. | `accountChrome`, tokens для chrome/border и responsive header glyph; профиль и переключатель темы согласованы. |
| D-15-36 | Sidebar `Ktm1g` — 19 px, meta — 18; bottom nav `IUyZs/mEG2p` — 20 px и gap 3. Неактивные glyphs были secondary вместо muted. | Размеры и gap приведены к source, inactive color roles разделены с label. |
| D-15-37 | Copy `P5kWVT/M78NkN` — 18, badge `hADFK/ZWPUa` — 15, share `d6DNR` — 18; profile `dxFVR/RVn81` — 20, QHD — 24. Применялись generic 16/20. | Фиксированные semantic icon variants, responsive profile action size; исправлен competing radius copy button. |
| D-15-38 | More `usUYh/csCtp`, promo `wxYVi/ueMoA`: border, row fill/foreground, close geometry, handles и chevrons отличались. | Overlay border `#414763`, More row `#20222E`, accent icons, 18 px chevrons, close width 44 / height 48–52 / radius 11, исходные fills и handle colors. More/profile logout получили source border `#5A3A45`. |
| D-15-39 | Devices `ge38V` требует monitor-smartphone; referral `i96F4/TgLhM` — file-text/users; promo `JSWUK` — ticket-percent; history `aZB5X` — receipt. Log-out artwork и прямоугольный message glyph вместо message-circle также отличались. | Восстановлены указанные glyphs из pinned Lucide 0.468.0, без новой зависимости; 20 px devices chevron, 18 px detail glyphs, 24 px users. |
| D-15-40 | Collapsed promo `W6FLgO` и empty history `eyEl9` использовали elevated/surface вместо source input fill. | Обе поверхности используют `bg-interface-input`, сохраняя minimum heights и рост с текстом. |
| D-15-41 | Support `mC1jS` показывался простым текстом; `XNFyb` отсутствовал. | Плашка 32 px с radius 13, inset 9 и source translucent fill; footer chevron 17 px. Добавлены исходные header gap и responsive-safe footer row. |
| D-15-42 | Номера Q2 `USJNJ/ryXer/Pc5dm/plVLs` использовали IBM Plex Mono и body sizing; connection numbers — weight 600. Pen требует IBM Plex Sans 650, 16 px до Full HD / 18 px QHD, line-height 1.2. | Общие `text-account-step-number` и `font-step-number`, без изменения counter/ordered-list semantics; 70 source text roles. |

SVG provenance: [Lucide 0.468.0](https://github.com/lucide-icons/lucide/tree/0.468.0/icons),
ISC notice сохранён в `resources/js/utils/landingIconPaths.LICENSE.txt`.
Независимый [artwork snapshot](pen-auth-account-icon-artwork.json) проверяет
shapes шести восстановленных glyphs; monitor-smartphone проверяется по
отличающему smartphone rect. Остальные icons имеют geometry/color checks
и visual review, без заявления полного path equality каждого glyph.

## Явные отличия от demo-макета

- Реальные даты, имя, ссылка, суммы, тексты provider steps и populated metrics
  не заменяются demo values ради совпадения скриншота. Их длина может менять
  высоты и переносы. Сохраняются добавленные по backend contract сведения
  Telegram, каналы приглашения, список устройств, refresh/back/error actions.
- Две темы light/dark, без System; источник содержит третью опцию. Шесть
  desktop promo frames дополнительно дублируют «Тема» в sidebar: продукт
  сохраняет принятый переключатель в header, без второй строки.
- В More-open активен More trigger; Pen под панелью сохраняет Home highlight.
- Password visibility остаётся справа в самостоятельной кнопке 44×44;
  источник login ставит glyph непосредственно после placeholder. Register
  также сохраняет доступные visibility controls. Меняется размер glyph,
  существующее поведение и keyboard contract сохранены.
- Сохраняются принятые accessibility mappings: усиленные input borders
  `#707892/#92887D`, light accent/muted/success/error foregrounds, primary/copy
  foreground, выбранный profile theme indicator. Raw source colors остаются
  в snapshot, mapping задан отдельно в assertions.
- Shared BaseButton сохраняет принятые interface-action typography/weight
  из [UI reconciliation](../../.agents/plans/pen-integration/2026-10-18-ui-reconciliation.md),
  включая logout, вместо индивидуальных body captions source кнопок.
- Legal/demo consent copy не добавляется без действующих документов.
  O2/T3 сохраняют согласованные дополнительные действия и рабочие states.
  Высоты status compositions зависят от этого содержимого.
- Desktop promo по U-20 центрируется в main area, весь background inert;
  viewport-centered Pen composition и затемнение sidebar не копируются.
  Source More padding/auto-height сохраняет ранее описанное правило sheet
  bottom inset; safe-area и text enlargement не фиксируются demo heights.

## Регрессии и проверка

Новые source assertions воспроизвели failures до исправлений: **7/7**
выбранных initial cases, **6/6** internal-content cases и **1/1** support
case, **1/1** message/handle case и **2/2** number-typography cases. Промежуточная полная detail matrix выявила ещё reset/share/QHD sizes;
ошибочное сопоставление Theme row с logout исправлено в новой проверке,
raw source row сохранена. Это исправление harness, не UI defect.

Итоговая проверка окончательного client build в Sail: **1314/1314 за 11.1
минуты**, включая **194/194** detail cases, 18 projects, 0 failures/skipped/
flaky. HTML-report и все **2356 attachments** проверены из embedded report
ZIP. Frontend **81/81**, Laravel **277 tests / 2628 assertions** (266 прежних
PDO deprecations), production client/SSR build и `git diff --check` проходят.
Generated SSR восстановлены byte-for-byte до состояния рабочего дерева на
начало продолжения; исходный незакоммиченный diff сохранён. Промежуточные
остановленные прогоны в этот результат не входят.

Artifacts находятся в `storage/app/pen-step15/auth-account-review/`:

- `source.json`, `pen/` — полный read-only Get и 194 source PNG;
- `before-browser/` — 194 screenshots предыдущего build;
- `focus.json`, `focus-pen/`, `focus-browser/`, `index.html` — 102 focused pairs;
- `before-report/`, `content-before-report/`, `ticket-before-report/`, `icon-handle-before-report/`, `type-before-report/` — failures;
- `final-summary.json` — counters полного успешного прогона;
- `report/` — промежуточные 194/194; `final-report/` — окончательный suite. `full-report/` — остановленный промежуточный прогон, не acceptance.

Ручные **M-01…M-11** приняты от владельца; **M-12 SMTP** не проверялся.
Явный Signal Orbit scope и оставшиеся quantitative contrast chains этим
продолжением не закрываются. Operational SSR 40/40 остаётся историческим
результатом предыдущего build. Шаг 16 не начат; commit не создавался.
