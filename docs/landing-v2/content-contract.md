# Landing V2 — Content sections contract

Этап 06, 2026-11-06. Источники: [inventory](design-inventory.md),
[implementation map](implementation-map.md), живой Pen MCP — восемь Platforms
и Connection frames, `wgSpy`, master `JbOmk/k4oz2` в `KwQuD`.

## Границы и решения до реализации

Порядок этого этапа: **Platforms → One connection**, после существующего Hero.
Header/Hero завершены; News — 07; Subscription с Final CTA и Footer — 08.
Условный Pricing checklist в task 06 не создаёт вторую подписку: тарифы,
server pricing, скидки и payment CTA остаются этапу 08 согласно section mapping.
В двух текущих секциях нет actions, download buttons, links или callbacks.
Backend, платежи и новые destinations не нужны.

Палитра: page `#FFFFFF`, ink `#202126`, secondary `#697386`, border `#E3E6EE`,
brand `#8E9BFF`, platform glyph `#737B8D`. Plex Sans: headings/facts 500,
platform labels 600, body normal. Существующие foundation tokens и container
2000px сохраняются; новые роли получают namespace `v2-*`.

```text
Platforms: пять равных logo cells на всех widths
mobile/768: facts + setup / centered story
1024+:     facts + setup | centered story

Connection <1440: title + copy / cropped diagram (23 brands + origin)
Connection 1440+: diagram / title above waves + copy below waves
```

Это заданная Pen композиция: единая тонкая таблица вместо отдельных цветных
tiles; диаграмма продолжает белую страницу. Copy Platforms центрировано, setup
statement слева; Connection title/copy слева. Сохраняются явные line breaks:
Platforms через `<br>` до desktop, Connection на всех widths.

## Component map

- `LandingV2Platforms`: semantic section `#devices`, tabindex −1; пять labels
  и имеющиеся `UiIcon` glyphs, две access facts, setup и platform story.
  Нет props/emits/state. Shared `UiIcon` и старый `LandingPlatforms` не меняются.
- `LandingV2Connection`: semantic section с HTML heading/copy и композицией
  diagram; нет props/emits/state. Текст не встраивается в картинку.
- `LandingV2Signal`: один SVG diagram + origin/caption, 23 локальных source
  logos; нет внешних props/emits/state. Не компонент для каждого штриха.
- `landingV2Signal.js`: source positions и чистые вычисления geometry из
  `assets/hero/dudeweb-platform-signal.glsl`, без browser/reactive lifecycle.
- Inertia page остаётся composition surface, sections используют
  `LandingV2Section` variants `platforms/connection`.

## Visual и responsive

| Width | Platform row / icon / label | Facts row / titles / explanation | Setup padding / copy | Story padding / title / copy | Signal view / rendered height |
|---:|---|---|---|---|---|
| 360 | 88 / 22 / 12 | 120 / 32,24 / 12 | 24 / 14 | 24 / 30 / 15 | 720×520 / 231.111 |
| 390 | 88 / 22 / 12 | 120 / 32,24 / 12 | 24 / 14 | 24 / 30 / 15 | 720×520 / 252.778 |
| 430 | 88 / 22 / 12 | 120 / 32,24 / 12 | 24 / 14 | 24 / 30 / 15 | 720×520 / 281.667 |
| 768 | 96 / 24 / 15 | 128 / 38,28 / 14 | 24×32 / 16 | 32 / 36 / 16 | 1000×520 / 357.76 |
| 1024 | 96 / 24 / 15 | 128 / 38,28 / 14 | 24×32 / 16 | 32 / 36 / 16 | 1280×520 / 377 |
| 1440 | 112 / 24 / 18 | 144 / 42,32 / 15 | 28×40 / 17 | 32 / 44 / 17 | 1280×520 / 520 |
| 1920 | 112 / 24 / 20 | 144 / 48,38 / 18 | 28×40 / 19 | 32 / 52 / 19 | 1280×520 / 650 |
| 2560 | 140 / 32 / 22 | 168 / 52,44 / 20 | 32×48 / 21 | 48 / 60 / 21 | 1280×520 / 812.5 |

Logo labels mobile stacked, tablet+ horizontal. Facts и подписи центрированы;
«Один доступ» не разрывается на две строки. Story marker 2×24, master 3×36,
gap 16. Platform heading ink фактически `#202126`, facts `#262B34`.
Facts/explanations и signal caption имеют native `normal` line-height, где Pen
не задаёт множитель; body использует явный 1.5. Heading tracking −1px,
Platforms master −1.5; Connection compact −1.2, desktop −1.7.
Mobile setup row сохраняет source minimum 111px: на 430px browser font metrics
укладывают copy в две строки вместо трёх в Pen. Размер шрифта и текст не меняются;
минимум удерживает исходную композицию, при увеличении текста строка растёт.

Connection desktop field aspect 1280/520; heading x=720/1280, y=102/520,
description x=720/1280, y=340/520, width=500/1280. Origin x=552,y=232,w64,h56,
mark44×36; caption top302, центр x584. Compact view widths 720/1000/1280
обрезают правую область, сохраняя все 23 nodes. Caption font не уменьшается
ниже source 12px, desktop 13/16/18. Математика и viewBox не зависят от JS media
queries, initial SSR/client markup одинаковый.

## Diagram state и scope motion

На этапе 06 используется **source `u_static=1`, `u_phase=0`**: все 23 пары
«logo + incoming line» видимы с opacity .82, pulses и outgoing waves заморожены.
Это существующий reduced-motion state Pen, не новый графический сценарий.
Появление/исчезновение 7–13s, синхронизация opacity и непрерывные волны относятся
к этапу 09, как уже указано в implementation-map. Никакого автозапуска, таймера,
canvas/WebGL renderer или новой VueUse/browser логики в этапе 06 нет.

Routes повторяют cubic smoothstep source от правого края каждой 36×36 node
до x584 и y260+(index mod5−2)×1.1. Native SVG paths сохраняют геометрию при
resize; исходные brand PNG используются без перекодирования. Векторный field
декоративен (`aria-hidden`), текст Connection остаётся HTML. SVG defs имеют
локальный V2 namespace, не влияют на старую главную.

## Проверка

Выбраны `frontend-design`, `vue-best-practices`, `tailwind-best-practices` и
Pen `pen-dev`. Новая browser/reactive логика отсутствует: responsive layout
реализован CSS, SVG geometry вычисляется один раз при загрузке модуля. Поэтому
новый composable/VueUse primitive не нужен. Все runtime checks — через Sail.

| Проверка | Результат |
|---|---|
| Живой Pen MCP | Прочитаны оба section tree во всех восьми widths, current signal board, точная typography, spacing, borders и original glyphs; master/mobile/tablet snapshots сопоставлены; Pen не изменялся |
| `npm run build` | Client + SSR build успешны, Vite 8.3.4 |
| `npx playwright test --project=landing-v2-content --project=landing-v2-hero --project=landing-v2-navigation --project=landing-v2-foundation --project=landing-v2-routing` | **97 passed**: 19 content + 78 regressions предыдущих этапов |
| `node --test tests/Unit/Frontend/landingV2Foundation.test.js` | **2 passed** |
| `artisan test --filter='Landing(Test\|V2Test)'` | **10 passed / 105 assertions** |
| Controlled built-bundle SSR/hydration | **6/6**: 390/1440/2560 × light/dark, DOM header/Hero/Platforms/Signal сохранён; пять platform cells и 23 native SVG pairs присутствуют; без JS/hydration errors |
| Старая `/` | **16/16 baseline comparisons** без различий, восемь widths × light/dark, шесть regions страницы |
| Source isolation | Старые public components, Header/Hero, shared UiIcon/composables, PHP/routes, assets, dependencies и theme preference не менялись |
| Diff | `git diff --check`; generated `bootstrap/ssr/*` восстановлены и исключены из commit |

Content matrix проверяет порядок реальных sections после Hero, точные тексты,
пять равных platform columns, glyph/label/fact/title sizes, высоту facts row и
общую table geometry. Допуск table height — 6px из-за округлений native Pen
line boxes; фактические final samples отличаются примерно на 0–1.3px.
Desktop story и compact/desktop Connection composition соответствуют source.
Origin/mark dimensions и offsets проверены независимо на всех восьми widths.
Frame, field и заголовки не заменены raster screenshots.

Отдельно проверены 23 unique original URLs, source sentinel positions,
совпадение route start с правым краем каждого node, endpoints возле x584/y260,
пять outgoing waves и уникальные SVG defs. Все nodes целиком внутри crop на
mobile/tablet/desktop. Existing foundation checks повторно декодируют все
33 исходных assets и проверяют hashes manifest. Новые assets не добавлены.

Дополнительные widths 320/600/767/769/1023/1200/1439/1600/2561/3840 проверены
при обеих motion preferences; horizontal overflow отсутствует. Static diagram
содержит все 23 пары с единой opacity .82 и без animations. Forced colors
сохраняет HTML headings и copy. Реальная mobile menu navigation `#devices`
закрывает dialog до scroll, освобождает lock, переводит focus к section;
desktop anchor и active state тоже проверены. Это локальные Chromium checks,
не физические iOS/Android и не финальная accessibility acceptance.

SVG port сохраняет source координаты, кривые smoothstep и phase-0 positions.
GLSL anti-alias coverage и Gaussian pulses представлены SVG stroke/gradients;
это векторный эквивалент static composition, не побайтовый shader renderer или
pixel acceptance всех animation phases. Будущий motion audit остаётся 09.

Просмотрены финальные browser snapshots 390/768/1024/1440/2560 и source Pen
screenshots. Артефакты находятся в ignored `test-results/landing-v2-content-*`;
baseline, diagnostics и SSR/hydration scripts — в ignored
`storage/framework/testing/landing-v2-foundation/`. Permanent SSR service,
`.env` и production environment не менялись, deployment не выполнялся.

Foundation browser test получил только `.first()` для прежнего single-section
container probe: на странице теперь три настоящие секции. Все прежние tests и
assertions сохранены, новые sections дополнительно проверяются своей matrix.
Pricing/News/Footer не реализовывались. Overview DoD остаётся финальному этапу.
