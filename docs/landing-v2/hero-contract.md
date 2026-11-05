# Landing V2 — Hero contract

Этап 05, 2026-11-06. Источники: [inventory](design-inventory.md),
[foundation](foundation-contract.md), [navigation](navigation-contract.md),
повторное живое чтение восьми Hero frames и `m6JVjz/EUniL/iFKqa/Rqi5w`.
Master — `uBSEr` в `KwQuD`. Pen только читается.

## Решения до реализации

Палитра: page `#FFFFFF`, ink `#202126`, accent title `#7480D5`,
CTA `#8E9BFF`, copy `#686B75`, benefit surface `#F8F9FC`.
Plex Sans 500 для заголовков, normal для описаний, 650 для Hero CTA;
Plex Mono для приветствия и номеров. Тексты — inventory §2.1/2.2,
включая «Мы рядом» и «3 дня бесплатно · До 5 устройств».

```text
mobile/tablet                  desktop
rule + Hey, Dude!              rule + Hey, Dude!     copy
headline                       headline              CTA
copy / CTA / trial                                  trial
stack / accordion              six-panel accordion 4.75:1:1:1:1:1
```

Всё выровнено влево, общие края foundation. Акцент — единое поле преимуществ,
без дополнительных карточных сеток, parallax, entrance effects или старого Hero.
Это перенос заданной композиции: новые секции и рекламный copy не добавляются.
На desktop 1440/1920/2560 support column 420/520/640, gap 64/80/96;
padding сверху support 45/50/53. На tablet description ограничено 640,
CTA 340; на mobile CTA на всю ширину. Greeting 14/16/16/16/20/22
на mobile/768/1024/1440/1920/2560, rule 32/40/40/40/40/48.
CTA height 48/50/50/52/56/64; font 15/17/17/17/17/18;
radius 8/10/10/10/10/12. Trial font 12/14/14/13/16/18, line-height 1.45.

## Компоненты

- `LandingV2Hero`: semantic intro, один h1, action и композиция benefits;
  без props/emits. Подключается в тонкую Inertia page.
- `LandingV2Benefits`: состояние аккордеона и передача scroll styles в cards;
  без внешних props/emits. Реальная anchor target `#advantages`, tabindex −1.
- `LandingV2BenefitCard`: props benefit Object, index Number, active Boolean,
  running Boolean; emit select(index). Полный HTML copy, original illustration,
  компактный icon/title без миниатюры. Карточка не содержит настоящую форму.
- `LandingV2BenefitIcon`: prop name String; исходные Lucide glyphs, включая
  имеющиеся project paths; shared `UiIcon` не изменён, пакет не добавлен.
- `useLandingV2Benefits`: VueUse primitives, autoplay gates, ручной выбор,
  scroll progress; cleanup в scope. Начальное SSR/client состояние одинаковое.
- `landingV2Benefits.js`: шесть локальных source records, без API.

## Реализация отсутствующих bindings

V2-Q05: шесть native buttons поверх panels, без отдельной полосы tabs. Click,
Enter/Space выбирают карточку; стрелки, Home/End переводят выбор и фокус.
Ручной выбор и вход клавиатурой останавливают autoplay до явного запуска.
Пауза/запуск — отдельная текстовая кнопка сразу под полем, target ≥44px.
Hover mouse временно приостанавливает; touch hover не требуется.
Autoplay: hold 6450ms, transition 550ms, следующие смены через 7000ms.
После временной остановки начинается новый hold, пропущенные cards не догоняются.
Offscreen, hidden document, inert main, reduced motion и forced colors
останавливают timer. Initial SSR/client paused, autoplay запускается после mount.

V2-Q06: mobile progress 0…5 от обычного scroll по track 3120px с пятью шагами
не более 500px: `(track height − max(620px, viewport height)) / 5`.
Последняя карточка достигается и при отсутствии следующих секций на этапе 05.
Sticky stage 620px, top 16px. Shader geometry: card 500px, initial y32,
offset 14px, scale −3.5% за возраст до 82.5%; arrival в последних 20% шага.
Это implementation mapping незаданной длины track, не свойство Pen.
Нет wheel/touch preventDefault, scroll lock, timer demo или обязательного hover.
При viewport ниже 680px используется читаемый поток вместо clipped stage.

Reduced motion / forced colors: mobile — шесть cards в обычном document flow,
без track и transforms; desktop — остановленный аккордеон с manual controls.
CSS выбирает initial responsive/reduced layout без изменения дерева после mount.
Все native copy присутствуют в SSR HTML. Технические inline custom properties
разрешены только для вычисляемой scroll geometry, не для цветов/типографики.
Остальные размеры — `v2-*` tokens и scoped CSS/Tailwind.

CTA использует общий `LANDING_V2_TRIAL = /register`. Существующий guest
middleware определяет redirect authenticated user; бизнес-логика не меняется.
Остальные anchor targets, секции и общий motion audit остаются следующим этапам.

## Проверка

Выбраны `frontend-design`, `vue-best-practices`, `tailwind-best-practices`,
Pen `pen-dev`; для двух новых HTTP tests дополнительно `php-per-cs3` и
`laravel-best-practices`. VueUse 15 APIs проверены по установленным sources и
официальным [useTimeoutFn](https://vueuse.org/shared/usetimeoutfn/),
[useElementBounding](https://vueuse.org/core/useelementbounding/).
Новый browser state собран из VueUse primitives, без ручного timer/listener
lifecycle и постоянного RAF loop. Bounds читаются только для enabled mobile
stack; CSS выбирает responsive/reduced layout до hydration.

Все runtime-команды выполнены через Sail:

| Проверка | Результат |
|---|---|
| Живой Pen MCP | Восемь Hero trees, текущие motion/reduced boards, full/compact face sources, CTA typography и snapshots 390/768/2560 прочитаны повторно; документ не изменялся |
| `npm run build` | Client + SSR build успешны, Vite 8.3.4 |
| `npx playwright test --project=landing-v2-hero --project=landing-v2-navigation --project=landing-v2-foundation --project=landing-v2-routing` | **78 passed**: 23 Hero, 30 navigation, 19 foundation, 6 routing |
| `node --test tests/Unit/Frontend/landingV2Foundation.test.js` | **2 passed** |
| `artisan test --filter='Landing(Test\|V2Test)'` | **10 passed / 105 assertions**, включая прежние пять LandingTest |
| PHP CS Fixer | **0 исправлений / 1 файл**; действующий `@PER-CS3x0`, PHPDoc сохранён |
| Controlled built-bundle SSR | **6/6**: 390/1440/2560 × light/dark, header/h1/первая card гидратируются с сохранением DOM; шесть native cards и initial stack progress 0; без JS/hydration errors |
| Старая главная `/` | **16/16** baseline comparisons до/после, восемь widths × light/dark, шесть regions на страницу без изменений |
| Diff | `git diff --check`; generated `bootstrap/ssr/*` восстановлены и исключены из commit |

Hero matrix проверяет точный copy, иерархию одного h1 и шести h2, type scale,
CTA size/font/weight/radius, исходные 890×546 illustrations, положение поля
по live Pen (допуск 2px на native/browser text metrics), field height и ratio
4.75:1. Положение intro на 1440 уточнено: у support column нет минимального
20px gap, используется source `space-between`. Во всех восьми widths нет
горизонтального overflow, белая V2 palette не меняет theme preference сайта.

Motion tests проверяют полный 42s цикл и wrap через управляемые часы,
границу 6450ms, ручную остановку, pointer pause/resume, inert, offscreen и
controlled visibility event. Реальное CSS перераспределение ширины завершается
за заданные 550ms, bounds поля и ширина copy остаются постоянными. Keyboard
Home/End/стрелки и touch selection проверены на 768/1440/2560.

Mobile проверен в Chromium touch context 390×844 с native scroll: кадры
0→1→3→5→3→0, offsets 32+14×index, card 500px и scale до 82.5%, возврат назад,
автоматическое переключение reduced motion без scroll lock. На reduced motion,
forced colors и коротком viewport все шесть cards читаются обычным потоком.
Промежуточные widths 320/600/767/769/1200/1439/1600/2561/3840 не переполняются.

Delayed-image test задерживает загрузку всех шести illustrations после fonts
ready и сравнивает Hero/field/card geometry до/после decode: различий нет.
Это проверка отсутствия сдвигов от реализации/загрузки artwork, не измерение
полевых Core Web Vitals на всех устройствах. Scroll transforms и accordion
не меняют bounds следующих секций. Постоянный SSR service/config не менялись.

CTA: browser `/landing → /register` и реальная navigation к `#advantages`;
HTTP guest получает `Auth/Register`, authenticated web user — redirect к
`account.dashboard`. Покупка/выдача trial и внешние provider calls не менялись.
`#devices/#pricing` по-прежнему относятся к следующим section tasks.

Финальные browser snapshots 390 (reduced reading flow), 768/1440/2560 и mobile
stack просмотрены рядом с live Pen. Артефакты в ignored `test-results/landing-v2-hero-*`;
baseline/hydration scripts — в ignored
`storage/framework/testing/landing-v2-foundation/`. Это локальная приёмка Hero,
не physical-device, полная accessibility/pixel или production acceptance.

Новые tokens вынесены в `landing-v2-hero-tokens.css`, импортируемый V2 token
file. Responsive overrides ограничены `[data-landing-v2]`, component CSS scoped.
Старые Home/PublicLayout/Header/benefits, shared components, PHP production
code, routes, dependencies и theme store не менялись. Шаги 06–12 не выполнялись.
