# Landing V2 — Implementation Map

Этап: [02 — Routing and Architecture](../../.agents/plans/landing-v2/02-routing-and-architecture.md).
Источник дизайна: [живой Pen inventory шага 01](design-inventory.md).
Дата проверки checkout: 2026-11-05. Ветка: `landing-v2`.

Состояние после шага 03: изолированная основа layout, section component,
responsive tokens и исходные assets описаны в
[Foundation Contract](foundation-contract.md). Ниже сохранён архитектурный
снимок шага 02; его формулировки «пока» относятся к состоянию routing step.

Состояние после шага 04: header, mobile dialog, destinations, component APIs
и результаты проверок описаны в [Navigation Contract](navigation-contract.md).
Header передаётся в layout header slot; контентный каркас пока прежний.

Состояние после шага 05: прежний brand placeholder заменён semantic Hero и
шестью benefit cards; contracts, manual controls, mobile scroll/reduced flow
и evidence — [Hero Contract](hero-contract.md). Реальная target `#advantages`
уже существует; `#devices/#pricing` остаются следующим section tasks.

Состояние после шага 06: добавлены `LandingV2Platforms`, `LandingV2Connection`
и `LandingV2Signal` после Hero. `#devices` ведёт к реальной Platforms section.
Source geometry, component APIs, static diagram и результаты проверок описаны
в [Content Sections Contract](content-contract.md). Motion Connection остаётся
09, Subscription/Final CTA и `#pricing` — 08; News — 07.

## Route и entry points

| Адрес | Route name | Handler | Inertia page | Layout |
|---|---|---|---|---|
| `/` | `home` | `App\Http\Controllers\LandingController` | `Public/Home` | `PublicLayout` |
| `/landing` | `landing` | `App\Http\Controllers\LandingV2Controller` | `Public/LandingV2` | `LandingV2Layout` |

Оба маршрута — Laravel `GET|HEAD` в `routes/web.php`, стандартная группа `web`
из `bootstrap/app.php` с существующим `HandleInertiaRequests`. `/landing`
публичен для гостя и пользователя с web-session. Redirect с `/` отсутствует.
Старый handler, его `LandingPageData` и existing route middleware не меняются.
Новый invokable controller отвечает только за Inertia response; endpoint не
создаёт данные и пока не запрашивает pricing catalogue.

Фактический framework — Laravel **13.38.0** (Sail). Controller Middleware
attribute проверен в установленном framework: class/method repeatable,
constructor принимает middleware и optional only/except, integration находится
в `Route::attributeProvidedControllerMiddleware()`. Дополнительного controller
middleware для публичного V2 нет, поэтому attribute не добавлен. FormRequest,
Policy, DI registration и новый service для простого read-only render не нужны.

Frontend сохраняет текущую схему:

- `resources/js/app.js`: `import.meta.glob('./pages/**/*.vue')`, lazy page resolution;
- `resources/js/ssr.js`: тот же glob с `eager: true` для SSR;
- `vite.config.js`: существующий Laravel/Inertia/Vue pipeline и alias `@`;
- `resources/views/app.blade.php`: общая Inertia root view;
- PHP page name `Public/LandingV2` разрешается в
  `resources/js/pages/Public/LandingV2.vue` обоими entry points.

Vue Router, отдельный frontend entry point, API и новые dependencies не нужны.

## Page и Layout

| Файл | Ответственность | Contract шага 02 |
|---|---|---|
| `app/Http/Controllers/LandingV2Controller.php` | Отдельный HTTP handler V2 | `__invoke(): Inertia\Response`, render `Public/LandingV2`, без custom page props |
| `resources/js/pages/Public/LandingV2.vue` | Inertia composition surface для будущих V2 секций | JS `<script setup>`, `defineOptions({ layout: LandingV2Layout })`, Inertia `Head`, временный brand heading `dudeweb` |
| `resources/js/layouts/LandingV2Layout.vue` | Собственный semantic main и граница будущего оформления | Один `<main id="landing-v2-content" data-landing-v2 tabindex="-1">`, default slot; props/emits отсутствуют |

В этом этапе `/landing` показывает только минимальный brand heading. Секции,
header/footer, V2 design tokens, mobile navigation, motion и окончательная SEO
metadata ещё не реализованы. Это проверяемый маршрут и компонентный каркас,
а не законченный перенос дизайна. Текст заголовка документа взят из утверждённого
Hero copy; сообщение о ходе разработки пользователям не добавляется.

Новый layout не импортирует `PublicLayout`, `PublicHeader`, `PublicFooter`
или существующие landing sections. Нет global CSS, inline styles, изменения
HTML theme, localStorage или второго theme store. В шаге 02 каркас наследует
общую base typography/reset; собственное белое оформление V2 относится к шагу 03.
Тема старого сайта и её настройки сохраняются. Новая browser/reactive логика
не требуется, поэтому composables/VueUse primitives не добавлены.

Для следующих шагов: разместить semantic V2 tokens через CSS-first `@theme`
с отдельными именами, ограничивать специфичные selectors границей
`[data-landing-v2]` или scoped styles компонентов. Не переопределять глобальные
`--ui-*`, `.dark`, `:root`, body или текущие `.landing-*` selectors ради V2.
Конкретные значения и theme compatibility проверяются на шаге 03 по inventory.

## Shared components

Ни один shared component в шаге 02 не меняется. Проверка ниже определяет
пригодность для следующих шагов, а не обещает полную совместимость с V2.

| Источник | Пригодность | Ограничение / влияние |
|---|---|---|
| Inertia `Head` / `Link` | Переиспользовать текущую dependency | `Head` используется сейчас; навигация добавляется в соответствующем этапе |
| `components/ui/UiIcon.vue`, `utils/landingIconPaths.js` | Кандидаты для имеющихся lucide/phosphor glyphs | Проверять точные glyph names и размеры; не менять общий SVG contract для одного V2 icon |
| `components/brand/BrandLogo.vue` | Исходная Razor Loop geometry пригодна | Existing wordmark использует Inter и текущие sizes/colors, V2 требует Plex Sans; прямое включение не доказывает visual parity |
| `components/brand/BrandLink.vue` | Имеет Inertia Link и href prop | По умолчанию ведёт на `/`; конкретный V2 destination пока не утверждён, не переназначать default |
| `components/ui/BaseButton.vue` | Поведение link/button, busy/disabled полезно | Existing variant/size/radius/theme tokens отличаются от V2; compatibility или отдельные V2 actions определить в шаге 03, не добавлять произвольный class prop |
| `composables/useOverlay.js` | Кандидат для focus trap, Escape, inert/restore | Generic API поддерживает background/controls; применять при реализации меню с сохранением contracts |
| `components/ui/BaseOverlay.vue` | Не готовая оболочка V2 menu | Текущий sheet/backdrop/account styling отличается от белой панели V2 |
| `composables/useTheme.js` | Существующий единственный theme store | V2 не должен создавать второй store или менять предпочтение старого сайта |
| Font imports в `app.js` | IBM Plex Sans Variable и Plex Mono уже подключены | Экспорт fonts не нужен сейчас; точные веса/метрики сверяются при оформлении |
| `Services/Landing/LandingPageData` | Возможный источник проверенных public prices | Сейчас используется только `/`; решение об адаптации pricing contract нужно до реализации подписки, без выдуманных сумм |
| Existing `LandingPricing.vue` / subscription checkout | Источник существующих бизнес-contracts | Не копировать billing logic и не подменять дизайн V2 старой pricing card |
| Existing public sections/header/footer | Сохранить у `/` | Visual/motion/theme contracts отличаются от V2; прямое переиспользование всей секции не выбрано |

Новые UI packages, formatter plugins и TypeScript не добавляются. Foundation
уже существует в `resources/css/app.css`, импортируемых token files и
`resources/js/components/ui/`; шаг 03 расширяет её изолированно при необходимости.

## V2 components и section mapping

Будущие V2 section components размещать в
`resources/js/components/landing-v2/`, обычные project composables — в
`resources/js/composables/` с V2-specific именами при появлении реальной логики.
Пустые файлы/каталоги наперёд не создаются. Имена ниже — предлагаемая карта
разделения, конкретные props/emits определяются в задаче соответствующей секции.

| Pen section / master ID | Будущая граница | Ответственность / данные | Этап |
|---|---|---|---|
| 01 Navigation / `P4tz1` | `LandingV2Header`, `LandingV2MobileMenu` в layout | Brand, nav destinations, login/trial; menu state у header, события закрытия из меню | 04 |
| 02 Hero + benefits / `uBSEr` | `LandingV2Hero`, `LandingV2Benefits`, `LandingV2BenefitCard` | Intro и шесть full/compact faces из Pen; desktop/tablet accordion, mobile stack | 05, motion 09 |
| 04 Platforms / `JbOmk` | `LandingV2Platforms` | Пять supported platforms и утверждённые access facts | 06 |
| 05 Connection / `k4oz2` | `LandingV2Connection` | 23 бренда, diagram, copy; graphics отдельно от доступного текста | 06, motion 09 |
| 06 News / `iTg4q` | `LandingV2News`, `LandingV2NewsCard` | Три локальные записи с cover/category/date/title, без API | 07 |
| 07 Subscription / `yRrOg` | `LandingV2Subscription` | Один тариф и периоды 1/3/6/12; существующий server pricing contract после согласования | 08 |
| 08 Footer / `Hir0F` | `LandingV2Footer` в layout | Три link groups, outline wordmark, legal strip | 08, pointer effect 09 |

Текущий `/` продолжает использовать `components/public/*` и `PublicLayout`.
V2 page будет только компоновать секции; разметку всех секций не собирать
в одном page file. Ни один будущий компонент из таблицы сейчас не создан.

## Assets location

Для экспортируемых V2-only static assets выбран путь **`public/landing-v2/`**:
подкаталоги `images/`, `brands/`, `illustrations/` по фактической потребности.
Source-side URLs и node IDs перечислены в [inventory §4](design-inventory.md#4-assets).
Этот каталог пока не создаётся: экспорт/оптимизация не входят в routing step.
Не переносить Pen `images/generated-*` вслепую и не заменять текущие
`public/assets/hero/*`. Existing SVG paths/icons/fonts переиспользовать только
после проверки соответствия Pen. Shader texture с текстом не заменяет
семантический читаемый текст на сайте.

Для будущих news placeholders выбран локальный frontend module
`resources/js/data/landingV2News.js` — будет создан только на шаге 07.
DB tables, migrations, models, repositories, endpoints, CMS/admin CRUD,
scheduler и внешние news sources запрещены overview и не создаются.

## Открытые contracts

Все V2-Q01–V2-Q12 остаются в [inventory §9](design-inventory.md#9-open-questions).
Routing step подтверждает существующие destinations `/login`, `/register`,
`/account`, `/account/subscription`; это не автоматическое утверждение всех
V2 CTA. Ссылки на условия/приватность и новости ещё требуют решения.
Межсекционные anchors можно будет привязать внутри `/landing`, сохранив labels
Pen «Преимущества», «Устройства», «Тарифы». Их реализация относится к шагу 04.

Отсутствующие numeric prices, окончательные link destinations, CSS breakpoints,
keyboard/pause contracts и stale Pen metadata не мешают отдельному публичному
маршруту. Каркас не содержит фиктивных ссылок, цен или дополнительных секций.

## Проверка

Проверено 2026-11-05, все project runtime commands выполнены через Sail:

| Проверка | Команда / результат |
|---|---|
| Framework | `./vendor/bin/sail artisan --version` → Laravel 13.38.0 |
| Новый route | `./vendor/bin/sail artisan route:list --path=landing -vv` → один `GET\|HEAD landing`, name `landing`, `LandingV2Controller` |
| Старый route | `./vendor/bin/sail artisan route:list --name=home -vv` → один `GET\|HEAD /`, name `home`, `LandingController`; та же группа middleware |
| Laravel | `./vendor/bin/sail artisan test --filter='Landing(Test\|V2Test)'` → **8 passed, 95 assertions** |
| Client + SSR build | `./vendor/bin/sail npm run build` → оба build успешны, Vite 8.3.4; отдельный lazy chunk `LandingV2-*.js` присутствует |
| Browser smoke | `./vendor/bin/sail npx playwright test --project=landing-v2-routing` → **6 passed** |
| PHP style | Sail PHP CS Fixer с `.php-cs-fixer.dist.php`, `--using-cache=no --sequential`, только новый controller, routes и новый Feature test → **0 исправлений из 3 файлов** |
| Diff | `git diff --check`, проверка allowlist staged diff перед commit |

Новые Feature tests проверяют GET `/landing` для гостя и authenticated web user,
правильный Inertia component и HEAD без redirect. Существующий `LandingTest`
проверяет `/`, empty/ready/unavailable pricing states и отсутствие приватных
connection данных — все пять прежних tests прошли без изменения.

Browser test выполняет `/` → `/landing` → browser Back на 390/1440/2560px в
light/dark: старый headline и header/footer присутствуют на `/`, новый main с
brand heading — только на `/landing`; после возврата восстанавливается home,
header background совпадает, `data-theme` и localStorage preference сохранены.
JS errors и hydration warnings не обнаружены. Это controlled Chromium routing
smoke, не визуальная приёмка ещё не реализованного V2 и не проверка всех
существующих страниц сайта.

Новый route использует прежний middleware stack, без auth/guest-only restriction
и без изменений CSRF. `LandingController`, `Public/Home`, `PublicLayout`,
shared components, CSS/tokens, app/SSR entry points и root Blade не менялись.
Generated `bootstrap/ssr/ssr-manifest.json`, `ssr.js`, `ssr.js.map` после build
восстановлены из исходных копий и не входят в commit. Deployment не выполнялся.
Результат build не заявляется как проверка запущенного production SSR процесса.

Этап 02 завершён; этапы 03–12 не выполнялись. Overview Definition of Done
сохраняется для финальной приёмки всего лендинга, а не закрывается по каркасу.
