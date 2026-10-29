# Шаг 15 — quantitative contrast и явный Signal Orbit

Дата: 2026-10-22. Продолжение `.agents/plans/pen-integration/15-accessibility-responsive-verification.md`.
Выбраны frontend-design, vue-best-practices и tailwind-best-practices.
Pen, production UI, backend и зависимости в этом продолжении не менялись.
Работа велась поверх существующих незакоммиченных изменений шага 15.

## Источник и оставшаяся граница

Read-only inventory вновь дал **215** top-level frames. Выбранный Razor Loop
прочитан на board `hc0K9`: paths `jcQgR`/`Z4phh` и horizontal wordmark
`y6vI5i` (`Inter`, 700). Сохранён отдельный
[source snapshot](pen-selected-logo-roles.json). Два paths совпадают с
`BrandLogo.vue`; horizontal/icon selection проверяется на реальных header
breakpoints. Остальные logo concepts и stacked preview не становятся routes.
Account wordmark сохраняет ранее принятое interface mapping.

По ответу владельца **SMTP пока недоступен**. M-12 остаётся открытым:
письма не отправлялись, dev Mailpit/log не считаются внешней доставкой.
Принятые M-01…M-11 сохраняются без расширения их provenance.

## Закрытие quantitative contrast chains

В рабочем дереве уже находились усиленные `contrastTools`, `pageContrast`,
`paintedFocus` и семь regression cases. Здесь они повторно прочитаны,
проверены на всех 205 Pen compositions и 96 control scenarios. Прежние
257 computed `manual` entries не объявляются успешными по одному наличию
другого passing test: новая проверка требует отсутствие unresolved entries
в том же DOM case и сопоставляет painted measurements по selector.

Методы:

- CSS colors, включая `oklab()`/`color-mix()`, переводятся браузером в sRGB
  без предварительного округления до 8-bit. Alpha fills обычных surfaces
  композитятся поверх фактической цепочки родителей.
- Для полупрозрачного fixed/sticky chrome считается консервативная граница
  контраста по всем sRGB backdrops. Родительская заливка не выдаётся за
  доказательство контраста поверх произвольного прокрученного контента.
- Для gradient text и focus rings используются PNG реального painted
  background. Text styles и scroll восстанавливаются. Четыре Hero roles
  проверяются относительно opaque контура по G18; отдельный existing
  rendered-contrast project сохраняет четыре фиксированные Cloud poses.
- Opacity groups/filter/blend/неподдерживаемый foreground остаются unresolved,
  а coverage assertion требует их отсутствия. Нативные inactive controls и
  logotypes — явно записанные исключения. Произвольный `font-brand` class
  не освобождает обычный текст от измерения.
- Проверяются placeholders/field values, field boundaries, icon-only controls,
  painted keyboard focus, hover, выбранные radio indicators и overlays.
  Отдельные regression cases намеренно создают недостаточный контраст и
  неподдерживаемую отрисовку; они подтверждают, что измеритель это обнаруживает.

Критерии взяты из [SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
[SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
и [G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18).
Порог применяется к неокруглённому результату. Декоративным card borders
не приписывается обязательный контраст границы поля.

Первый focused Sail прогон: **308/308 за 4.1 минуты**, 0 skipped/flaky:

| Evidence из attachments | Количество |
| --- | ---: |
| Computed text measurements | 3291 |
| Field boundaries | 130 |
| Painted text measurements | 32 |
| All-sRGB backdrop bounds | 102 |
| Явные exceptions | 193 |
| Keyboard focus measurements (основные циклы) | 678 |
| Hover states | 562 |
| Icon measurements во всех состояниях | 1282 |
| Unresolved text / fields | 0 / 0 |
| Text / field failures | 0 / 0 |

Минимум computed text — **4.57748:1**, painted text — **4.65630:1**.
Это конечная acceptance matrix, а не сертификация всего приложения по WCAG
или доказательство для каждого кадра анимации. Physical/AT provenance остаётся
в [ручном протоколе](pen-step15-manual.md).

Report: `storage/app/pen-step15/remaining-acceptance/contrast-report/index.html`.
Состав и inline attachments прочитаны из ZIP HTML-report; screenshots
не считаются просмотренными только из-за наличия файла.

## Явный Signal Orbit в браузере

Добавлен `signal-orbit-acceptance`: **12 cases**. Helper создаёт отдельную
Vite build в `storage/app/pen-step15/signal-orbit-build/`, используя штатный
config. Единственная test-only source transform — замена вызова в Home на
`<LandingHero variant="signal-orbit" />`, с проверкой ровно одного совпадения.
Production files и обычный `/build/` не перезаписываются. Browser context
получает настоящий server document и отдельные JS/CSS/fonts через route
fixtures. Private Vue props не мутируются, child components не заменяются
stubs, новых production routes/переключателей нет.

На 360/390/768/1440/2560 в обеих темах проверяются:

- реальный explicit parent/child mount, один h1 и отсутствие Service Cloud
  resources до какого-либо injected failure;
- точные выбранные logo paths и responsive icon/horizontal header lockup;
- pointer response через Playwright mouse input, синхронность обоих paths,
  сохранение SVG box и нахождение деформированного контура внутри исходного;
- возврат **точного** исходного path после затухания; reduced motion сохраняет
  static paths и box после mouse input;
- contrast текущего explicit composition, доступность CTA по hit testing,
  public menu поверх mobile/tablet Hero и forced-colors hiding декора.

Два дополнительных touch/coarse contexts (390/1440) проверяют static paths
при touch и попытке synthetic mouse steering. Это browser emulation, а не
новое физическое устройство. SVG resource/renderer failure paths и fallback
envelope повторяются существующим `hero-acceptance` в полном suite.

Первый прогон до дополнительных logo/contour assertions — **12/12 за 43.8s**.
Окончательная редакция входит в итоговый общий прогон ниже. Browser PNG
прилагаются к десяти explicit compositions; прежняя статическая Pen comparison
и accepted overlap описаны в [Hero audit](pen-hero-verification.md).

Pen Browser успешно выполнил load-page, но последующий IPC request завершился
timeout 60000ms; после этого он не сообщает загруженную страницу. Нового
visible Pen Browser smoke здесь нет. Это ограничение инструмента не выдаётся
за physical acceptance или ошибку UI. Результаты Playwright и владельца
сохраняются раздельно.

## Итоговые проверки

Production client/SSR build, frontend **81/81**, Laravel **277 tests /
2628 assertions** проходят в Sail. Сохраняются прежние PDO deprecations в
266 Laravel tests. Generated SSR восстановлены byte-for-byte до исходного
состояния рабочего дерева; прежний diff сохранён. Operational SSR и deployment
в этом продолжении не менялись и заново не проверялись.

Полный browser suite — **1333/1333 за 13.6 минуты**, exit 0. HTML-report
подтверждает 20 projects, 0 skipped/flaky/unexpected/errors, все **2386
attachments** доступны. Включены окончательные 12 explicit cases с logo/contour
assertions, 34 fallback/asset cases, 205 Pen, 96 controls, 20 rendered-contrast,
7 contrast regressions и 194 auth/account detail cases.
Просмотрены все десять окончательных explicit Hero PNG на пяти widths в
обеих темах: clipping текста/CTA и новых отличий от сохранённого fallback
contract не обнаружено. Принятые overlap и text outline сохраняются.
Для удобства PNG извлечены без изменения из JSON-report в `explicit-scenes/`.

Из итоговых contrast attachments: 4393 computed text measurements, 154 field
boundaries, 120 painted measurements, 132 all-sRGB backdrop bounds и 245
явных exceptions. Дополнительно — 350 ролей в 60 fixed Hero/gradient scenes.
Unresolved text/field chains и failures — **0**; minimum text ratios совпали
с focused прогоном выше. Это counts measurements из attachments, не число
уникальных UI elements; повторные routes/themes считаются отдельно.

Artifacts: `storage/app/pen-step15/remaining-acceptance/final-report/index.html`,
`final-results.json`, `final-summary.json` и `live-inventory.json` в review folder.
Logs — `/tmp/pen-step15-remaining-{build,frontend,laravel,browser}.log`.
`git diff --check` проходит. **Шаг 15 остаётся открыт только до M-12 SMTP**;
шаг 16 не начинается, commit не создаётся.

## Правка владельца — полная ссылка подключения на desktop

По следующему запросу владельца Dashboard и Connection с desktop breakpoint
1200px показывают полный subscription URL в native readonly input, включая
`https://`, path, query и fragment. Раньше row содержал только masked span.
Клик/фокус выделяет всё значение; native Ctrl+A/C и горизонтальная прокрутка
работают без кнопки. Значение передаётся напрямую из существующего owner-only
prop, не восстанавливается из masked preview. Mobile/tablet preview и referral
variant сохраняются. Desktop row использует существующий semantic field
border вместо декоративного copy border; это intentional deviation по новой
функциональной роли. Raw Pen snapshot не менялся.

Добавлены восемь browser regressions для двух страниц × двух desktop widths
× двух тем: длинный URL с query/fragment, реальное native копирование и чтение
clipboard, readonly, click selection, focus/contrast и mobile resize.
Прежние assertions masked-only desktop обновлены под новый owner contract.

Sail: **157/157 browser cases за 1.6 минуты**, frontend **81/81**, client/SSR
build и diff check проходят. Проверены dashboard/connection projects целиком,
новые manual-copy cases и затронутые control/surface cases. Полный 1333-case
suite выше относится к build **до этой правки**; заново не запускался, как и
Laravel/operational SSR. Generated SSR восстановлены до исходных байтов
рабочего дерева; backend не менялся.

Report: `storage/app/pen-step15/connection-url/final-report/index.html`;
Summary: `storage/app/pen-step15/connection-url/final-summary.json`.
Шаг 15 остаётся открыт только до M-12 SMTP; commit не создавался.

### Уточнение — то же поле на mobile/tablet

Владелец распространил полное readonly отображение на все viewport widths.
В Dashboard/Connection больше не передаётся masked display value; subscription
variant всегда рендерит native input с полным URL. Semantic field border также
используется на всех ширинах. Referral presentation не менялась. Это новое
решение supersedes сохранение compact mobile/tablet preview в предыдущем
разделе; raw Pen snapshot остаётся read-only.

Sail: **183/183 за 1.7 минуты**, без skipped/flaky/unexpected: 76 dashboard,
37 connection, 34 URL (28 native manual-copy + 6 touch-selection), 12 controls
и 24 source surface cases. На 320/360/390/768/1024/1440/2560 в обеих темах
проверены полный value с query/fragment, реальное Ctrl+C и clipboard read,
readonly, click selection, focus/contrast, resize и отсутствие page overflow.
Touch emulation на 360/390/768 в обоих разделах подтверждает selection по тапу;
это не новый physical device smoke. Frontend **81/81**, client/SSR build и
diff check проходят; generated SSR восстановлены до исходных байтов рабочего
дерева. Backend не менялся; Laravel/operational SSR и полный suite не повторялись.

Report: `storage/app/pen-step15/connection-url-responsive/final-report/index.html`;
JSON/summary находятся в той же review folder. M-12 SMTP остаётся открытым,
шаг 16 не начинается; commit не создавался.

### Уточнение — контур только при keyboard focus

По следующему запросу владельца click/tap больше не рисует дополнительный
outline у controls. Выделение URL и selected/error/disabled presentation
сохранены, Tab/стрелки показывают прежний theme focus indicator. Реализация,
проверка всех классов и границы — в [отдельном аудите](pen-pointer-focus.md).
Sail: **86/86 pointer/touch + 192/192 controls/interaction**, frontend
**84/84**, client/SSR build и diff check. Generated SSR восстановлены до
исходных байтов рабочего дерева; полный suite и Laravel/operational SSR
не повторялись. SMTP остаётся единственным открытым пунктом шага 15.
