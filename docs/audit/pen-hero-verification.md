# Шаг 15 — Hero static comparison и fallback acceptance

Дата: 2026-10-22. Продолжение открытых Hero пунктов шага 15. Production UI,
Pen и dependencies не менялись. Выбраны frontend-design, vue-best-practices
и tailwind-best-practices; runtime/tests — только Sail.

## Live source и визуальная сверка

Read-only `Get` заново прочитал восемь текущих Hero subtrees. Snapshot с
content/art IDs, sizes, positions, gap, root fill и shader uniforms сохранён
в [pen-hero-roles.json](pen-hero-roles.json).

| Width/theme | Hero | Content | Art |
| --- | --- | --- | --- |
| 360 dark | `o6Ccn` | `IHBFo` | `XtA2W` |
| 390 dark | `QfhD2` | `dYhQt` | `zE37V` |
| 390 light | `UQZi9` | `mY99J` | `ETaAd` |
| 768 dark | `XwYYP` | `ROJHI` | `HF1NP` |
| 1440 dark | `wmAK2` | `hw5F5` | `oJ5AJ` |
| 1440 light | `BcmBV` | `DUKrl` | `ybpQp` |
| 2560 dark | `NaUwK` | `rLgib` | `N9gdH` |
| 2560 light | `v2heM` | `YxJQC` | `qFv5B` |

Для всех восьми Hero и восьми content nodes получены read-only
`TakeScreenshot`; 16 source PNG сохранены без изменения в local artifacts.
Просмотрены **20 browser Hero PNG**: Service Cloud и Signal Orbit на пяти
reference widths в обеих темах. Галерея:
`storage/app/pen-step15/hero-review/index.html`.

У 360/light и 768/light нет отдельного прямого Hero reference. Для них явно
использованы geometry соответствующего dark frame и Paper/light palette
из прямых light references. Это производные theme cases, не новые Pen frames.

Проверены расположение, иерархия и переносы текста, action arrangement,
типографические масштабы, shapes/footprint декора, границы секции и видимость
CTA. Необъяснённых отличий в этом статическом scope не обнаружено.
Мелкая типографика дополнительно опирается на source typography assertions;
уменьшенные full-Hero Pen captures сами по себе не доказывают pixel equality.

Сохраняются принятые отличия: локальные SVG вместо Pen PNG atlas, semantic
contrast colors, контур вокруг четырёх text roles и desktop content,
центрированный относительно полного viewport. Последнее смещает content
на -48/-56px относительно raw Pen при 1440/2560. Actual content width/height,
gap и relative y сравниваются с snapshot с этим явным правилом; допуск 0.5px.
Mobile/tablet relative y соответствует Pen без поправки.

## Геометрия, assets и fallback

| Viewport | Cloud SVG | Cloud content width | Signal Orbit SVG |
| --- | --- | ---: | --- |
| 360×800 | 360×560 | 320 | 250×250 |
| 390×844 | 390×560 | 350 | 270×270 |
| 768×1024 | 768×800 | 600 | 465×468 |
| 1440×1080 | 580×620 | 580 | 861×830 |
| 2560×1440 | 900×920 | 820 | 1536×1246 |

`hero-acceptance` добавляет **34 cases**:

- 10 Service Cloud cases: 23 SVG images, все 46 preload URLs обеих тем,
  только local origin и SVG, theme href каждого service, decorative semantics,
  paused reduced-motion state, mask только для mobile/tablet, geometry и
  source content metrics. PNG/atlas запросов нет.
- 20 Signal Orbit cases: по пяти widths и двум темам отдельно отказ **одного**
  `openai-dark.svg` и ошибка append внутри реального SVG renderer. Это
  проверяет оба failure paths, включая отсутствие inactive-theme ресурса
  при предварительной загрузке обеих тем. Остаются один h1, оба CTA,
  исходные два paths; Cloud unmounted. Forced colors скрывает декор,
  сохраняя текст и CTA.
- 4 дополнительных fallback cases при 1200×800 и 1920×1080 в обеих темах:
  SVG и content находятся внутри Hero, header + Hero = viewport height.

Fault injection ограничен SVG root с class `service-logo-cloud`; остальные
SVG приложения не затрагиваются. Все подмены живут только в browser context.

Везде проверены четыре стороны SVG/content envelope. Для Cloud desktop
horizontal overlap равен 0. Для Signal Orbit overlap с текстовой колонкой
намеренный: **118px tablet, 188px desktop, 240px UHD**. Content находится
выше по z-index, SVG имеет `pointer-events:none`; CTA остаются доступными.

Пункт плана «без пересечения текстовой колонки» противоречил уже принятому
[контракту fallback](../../.agents/plans/pen-integration/README.md):
«сохраняя его пропорции и overlap описания», с сохранённым horizontal anchor.
Формулировка уточнена по этому существующему owner decision. SVG не пересекает
header/следующую секцию; design не меняется ради ошибочного blanket запрета.
Signal Orbit сверяется со своим сохранённым контрактом и таблицей
[reconciliation](../../.agents/plans/pen-integration/2026-10-17-pen-reconciliation.md),
а не с `Archived · Breathing Morph Blob` текущего Cloud frame.

Две новые frontend проверки компилируют реальный `LandingHero.vue` с
изолированными child stubs: default выбирает Cloud, explicit
`variant="signal-orbit"` обходит Cloud. Это проверка выбора parent component;
она не объявляется новым operational SSR или full-page browser mount
явного variant. Реальный fallback component браузер проверяет через оба
failure paths выше.

## Повтор native Browser smoke

Pen Browser успешно загрузил `http://localhost`. Первое чтение дало
`document.hidden=false`; на 1440×1080 Cloud был ready/running/interactive,
23 images, SVG 580×620. Однако `return-screenshot` для `.service-hero`
снова завершился IPC timeout **60000ms**. После этого Browser сообщает
`document.hidden=true`: RAF остановлен, interactive false, native input
не меняет scene. Повтор load-page и `Page.bringToFront` видимость не восстановили.

Это **не пройденный visible ambient/hover/drag/background smoke**. Измерение
в hidden context не подменяется принудительным изменением `document.hidden`.
Native capture/visible-motion acceptance остаётся N-15-01/02 и M-09.
Event probes удалены, viewport/media overrides сняты, DOM theme восстановлена;
localStorage не менялся. Исходный Pen не мутировал.

## Итог проверки

Sail:

- **63/63 browser scenarios**, exit 0, 37.1s: 34 новых acceptance,
  9 прежних Hero lifecycle/drag/resource/coarse и 20 geometry/enlargement.
- **81/81 frontend tests**, включая две новые parent-selection проверки;
  asset hash/projection, motion lifecycle и Signal Orbit bounds также проходят.
- `git diff --check` проходит. Production UI/build не менялись: build,
  Composer suite и остальные browser projects в этом продолжении не повторялись.
  Предыдущий полный 1073/1073 сохраняется как исторический результат.

Команда browser прогона:

```bash
./vendor/bin/sail npx playwright test --project=hero-acceptance --project=interactive-states --project=responsive-accessibility --grep 'Service Cloud|Signal Orbit|SVG Hero|desktop native drag|unavailable SVG|touch controls|desktop Hero geometry|Hero text enlargement'
```

Artifacts: `storage/app/pen-step15/hero-review/` — gallery, 16 `pen/*.png`,
20 browser Hero PNG и 10 content PNG, `static-scenes.json`, полный `report/`.
Logs: `/tmp/pen-step15-hero-final.log`, `/tmp/pen-step15-hero-frontend.log`.

Закрыта статическая часть Hero comparison и проверка fallback envelope с
принятым overlap. Общая visual matrix public/auth/account, native ambient/
pointer/background, физические keyboard/AT/device/zoom и M-12 SMTP сохраняются
открытыми. Шаг 15 продолжается; шаг 16 не начат, commit не создавался.
