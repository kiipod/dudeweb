# Landing V2 — Foundation Contract

Scope: шаг 03, 2026-11-05. Источники: [inventory](design-inventory.md),
[implementation map](implementation-map.md), повторное живое чтение всех восьми
адаптивов и `q35PVH/WkEIA` через Pen MCP. Master остаётся `KwQuD`.

## Решения до реализации

- Новый layout получает собственную границу `[data-landing-v2]`, белый фон,
  `color-scheme: light`, Plex Sans и foreground `#202126`. Это локальное
  оформление; class/data-theme HTML и сохранённый theme preference не меняются.
- Один `main#landing-v2-content`, default content slot; header/footer slots
  зарезервированы без пустых wrappers. Каркас пока содержит только brand lockup.
- `LandingV2Section` — единственная новая foundation component: внешний semantic
  section с fixed padding variant, внутренний `mx-auto` content container и
  одноосная grid. Props: `variant` из `hero/platforms/connection/news/subscription/footer`;
  default `hero`; default slot, без state/emits. Новые экранные секции не создаются.
- Максимальная content width 2000px, боковое поле задаётся отдельно от container:
  20/20/20/40/48/80/160/280px при 360/390/430/768/1024/1440/1920/2560.
  Внешний section имеет gutter, inner container — cap; padding не вычитается
  повторно из cap. За пределами 2560 content остаётся ограничен 2000px.
- Между reference widths размеры плавно интерполируются и ограничиваются
  соседними значениями. Ниже 360 сохраняются mobile values. Это решение
  реализации для V2-Q04, не CSS breakpoint metadata из Pen. Layout switches:
  tablet 768, wide tablet 1024, desktop 1440; текущие 1200/1600 breakpoints
  других страниц не перенастраиваются. Нужные новые V2 variants именованы отдельно.
- Section padding и type-role matrix переносятся из inventory §3/§5/§6.
  Desktop benefit title 24px на 1440 после 26px на 1024 сохранён намеренно.
  Text line heights остаются множителями, tracking задаётся отдельными tokens.
- CSS-first `@theme` хранится в `resources/css/landing-v2-tokens.css`, импорт
  рядом с существующими token files в app.css. Только уникальные `v2-*` имена;
  responsive overrides находятся на `[data-landing-v2]`. Существующие font-sans,
  font-mono, normal/medium/semibold/bold и стандартная spacing scale повторно
  не определяются. Отдельный вес Hero CTA — 650.
- Палитра V2 фиксирована из Pen, поэтому не alias к theme-dependent `--ui-*`.
  Radii используют имеющиеся radius values, где они совпадают; специальные
  размеры остаются именованными semantic tokens. Тени только для origin,
  micro-UI и fingerprint, без общей тени для секций.
- Grid foundation — вертикальный section flow, без придуманной 12-column сетки.
  Колонки конкретных sections (5 platform, 3 news, 2 subscription) остаются
  contract соответствующих section tasks. На странице пока одна колонка.

## Assets и fonts

Оригиналы доступны в каталоге активного Pen-документа через `/mnt/c/Users/kiipod/
.pencil/documents/d241f6ea-c3a7-4b71-9981-19aef7200bef/`. Читаются только
изображения; encrypted `.pen` читается исключительно MCP.

Assets размещены в `public/landing-v2/{brand,images,illustrations,brands}`;
manifest содержит Pen source, node ID, real media type, intrinsic size и SHA-256.
Изображения копируются побайтово, без перекодирования. Найдено расхождение:
три `images/generated-{6,7,8}.png` фактически **JPEG 1024×1024**. В repo они
получают `.jpg`, source path и hash сохраняются. Шесть micro-UI PNG —
890×546 RGBA. Переносим 23 исходных brand PNG, без перерисовки и случайных замен.
Полные shader faces с текстом не копируются как замена semantic markup.

Brand mark создаётся как SVG из прочитанных через MCP paths `gvtXH/rYDPv`,
цвета `#8E9BFF/#E87968`, frame 44×36. Это исходная геометрия Razor Loop,
не существующий favicon с отличающимися цветами. SVG подключён в каркасе;
остальные assets подготовлены для своих section steps, не показаны вне макета.

Уже установлены и импортированы Fontsource Sans Variable (wght 100–700,
включая 650, Cyrillic/Latin) и Mono 400/500/600/700. Шрифты не скачиваются
повторно; font availability и загрузка проверяются в браузере.

## Проверка

Все runtime-проверки выполнены внутри Sail, 2026-11-05:

| Проверка | Результат |
|---|---|
| Живой Pen MCP | Повторно прочитаны корни и section padding всех восьми V2 адаптивов, `WkEIA`, основные type roles и исходные paths `vdwZm`. Значения inventory подтверждены |
| `node --test tests/Unit/Frontend/landingV2Foundation.test.js` | **2 passed**: server render с optional shell slots, один main; отсутствие пустых header/footer без slots |
| `npx playwright test --project=landing-v2-foundation --project=landing-v2-routing` | **25 passed**: 19 foundation + 6 routing |
| `artisan test --filter='Landing(Test\|V2Test)'` | **8 passed / 95 assertions**, включая прежние пять tests главной |
| `npm run build` | Client и SSR build успешны, Vite 8.3.4 |
| Original asset integrity | **32/32 raster files** побайтово совпадают с доступными оригиналами Pen и SHA-256 manifest; SVG отдельно сверён с MCP paths |
| Browser assets | **33/33** URLs: успешный HTTP response, правильный Content-Type, SHA-256, intrinsic dimensions и image decoding |
| Fonts | Cyrillic Sans Variable 650 и Mono 500 загружаются; Sans 100–700 и Mono 400/500/600/700 уже доступны в dependencies и imports |
| Главная `/` | **16/16 baseline samples без различий**: восемь reference widths × light/dark, шесть областей на страницу |
| Собранный V2 SSR + hydration | **6/6**: 390/1440/2560 × light/dark, исходный h1 DOM сохранён, нет JS errors и hydration mismatch |
| Diff | `git diff --check`; generated `bootstrap/ssr/*` исключены из commit |

Foundation browser matrix проверяет все восемь reference widths и обе темы
старого сайта: белый V2 фон, foreground, color-scheme, typography scale и line
heights, шесть padding variants и точную ширину контейнера. Проверки вариантов
используют SSR markup реального `LandingV2Section`, вставленный только в тесте;
будущие секции не добавлены на `/landing` ради тестирования. Отдельно проверены
палитра, radii и локальные shadows, промежуточные размеры 320–2561 и 3840px,
симметричное центрирование, cap 2000px и отсутствие horizontal overflow.

Проверки сравнивают числовые размеры с допуском 0.01–0.1px и rendered RGB:
Chromium может возвращать `20.0001px`, а minifier — `#fff` вместо `#ffffff`.
Это эквивалентные вычисленные значения. Текущий brand heading имеет вес 600;
другие крупные headings на будущих секциях используют существующий 500.

Baseline главной снят до foundation changes и сравнён после реализации в том
же локальном checkout/runtime: computed color/background/font/line-height,
padding/gap и bounds для header/h1/advantages/devices/pricing/footer совпали.
Локальные evidence-файлы находятся в ignored
`storage/framework/testing/landing-v2-foundation/`: `home-before.json`,
`home-after.json`, `verify-home.mjs`, четыре `foundation-{width}.png`.
Снимки 390 и 2560 просмотрены: каркас с исходным логотипом, ожидаемыми полями
и белым фоном, без лишних секций. Это не pixel acceptance полного лендинга.

Дополнительная controlled hydration-проверка `verify-hydration.mjs` запустила
собранный `bootstrap/ssr/ssr.js` на свободном loopback port, передала ему
реальные Inertia page data `/landing` и проверила гидратацию возвращённого HTML
с production client bundle. Renderer остановлен после проверки. Постоянный
SSR service, Laravel SSR config, `.env` и production environment не менялись.
Успешный локальный fixture run не является production SSR acceptance.

V2-Q04 получил implementation contract выше; V2-Q10 закрыт в части доступных
оригинальных изображений и fonts. Полные текстовые shader faces намеренно
не заменяют semantic markup. Остальные открытые contracts из inventory
относятся к следующим этапам. Header, Hero, content/news, pricing/footer и
motion в шаге 03 не реализованы; на странице остаётся только foundation.

Изменение общего `app.css` ограничено импортом нового token file. Все новые
tokens имеют namespace `v2-*`, responsive overrides — `[data-landing-v2]`.
Старые routes, PHP, shared components, HTML theme/preference и существующие
landing tokens не менялись. Новые listeners/composables/VueUse primitives
не нужны: responsive foundation выражена CSS. Новые dependencies отсутствуют.
