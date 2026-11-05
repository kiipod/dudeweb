# Landing V2 — Static news contract

Этап 07, 2026-11-06. Источники: [inventory](design-inventory.md),
[implementation map](implementation-map.md), живой Pen MCP — восемь News frames,
master `iTg4q`, актуальный state board `nmCRU`. Документ Pen не изменяется.

## Решения до реализации

Три статические презентационные карточки после Connection. Порядок из Pen:
Нидерланды (4 ноября 2026), обслуживание (2 ноября 2026), сервис восстановлен
(3 ноября 2026). Сортировка по дате не выполняется. Структура: cover →
category/date → headline. Описаний, excerpts, авторов, «Читать далее», slider,
автопрокрутки и анимации covers/dates в источнике нет; они не добавляются.

Палитра: page `#FFFFFF`, heading `#242A34`, article title `#303745`,
lavender label `#8E9BFF`, tag `#F1F3F8`, date `#6D778B`. Plex Sans: 500 для
headings, category и «Все новости»; normal для dates. Существующие V2 foundation
tokens используются повторно, дополнительные роли — `v2-news-*`.

```text
mobile:  title / all-news label (одна строка от 360) → три cards вертикально
768:     title + all-news label → cover 216×216 | metadata + title, три строки
1024+:   title + all-news label → три равные editorial columns
```

На 2560 сохраняются source internal paddings: header 32, cards 32/24/48,
gap 32; content cap 2000px. На остальных widths общие края foundation без
дополнительного горизонтального inset. Оформление — bright original covers
и тихая typography, без новой рамки вокруг всей секции и без card surfaces.
Тексты выровнены влево, явные переводы строки в headlines сохранены.

## Component/data map

- `LandingV2News`: section с h2, статичным «Все новости» и композицией cards;
  нет props/emits/state. Использует `LandingV2Section` variant news.
- `LandingV2NewsCard`: prop item Object, required; нет emits/state. Один
  semantic article с h3, original cover и `<time datetime="YYYY-MM-DD">`.
  Изображение иллюстрирует соседний headline, `alt=""` не дублирует его.
- `landingV2News.js`: локальный массив трёх записей (id/category/title/date/
  dateLabel/cover). Titles содержат исходные newlines, dateLabel фиксирован;
  нет Date/Intl timezone-dependent formatting или запроса к API.
- Page остаётся composition surface и подключает section после Connection.

Оригинальные `.jpg` из foundation (`netherlands`, `maintenance`,
`service-restored`) используются без изменения bytes. Intrinsic 1024×1024,
source object-fit cover. Новые images/dependencies не нужны.

## Links и dates

V2-Q02: поиск в routes/controllers/frontend pages не обнаружил реальных News
destinations. Live Pen не содержит href/article pages. По прямому требованию
task 07 «Все новости» — обычный span, cards — articles: нет fake route, href="#",
disabled/dead buttons, role=button, tabindex или click handler. Композиция
lavender label + decorative arrow сохранена. Hover underline/arrow reveal/focus
из board относится к настоящим links; здесь такие эффекты не применяются,
чтобы статичная презентация не обещала действие.

V2-Q07: source visible dates и current board задают 2026; stale editorial-draft
metadata с publicationDate=null не трактуется как CMS state. Во frontend
хранятся presentation dates, в UI нет «Черновик». Новостей как продукта,
backend endpoints/tables/migrations/models/controllers, CMS/admin CRUD,
scheduler, feeds и заглушечных страниц не создаётся.

## Responsive values

| Width | Cover | Section / article title | Metadata | Row gap | All-news height / type |
|---:|---|---|---:|---:|---|
| 360 | 320×313.6 | 24 / 22 | 12 | 32 | 44 / 12 |
| 390 | 350×343 | 26 / 22 | 12 | 32 | 44 / 12 |
| 430 | 390×382.2 | 26 / 22 | 12 | 32 | 44 / 12 |
| 768 | 216×216 | 36 / 24 | 12 | 24 | 46 / 14 |
| 1024 | 293.333×280 | 36 / 24 | 12 | 24 | 46 / 14 |
| 1440 | 410.667×390 | 44 / 24 | 12 | 24 | 46 / 14 |
| 1920 | 517.333×496 | 52 / 28 | 14 | 24 | 46 / 14 |
| 2560 | 629.333×600 | 64 / 32 | 16 | 32 | 58 / 19 |

Cover mobile aspect 50/49, tablet square, columns bounded height interpolation
между source desktop samples. Radius 8, master 12. Tag radius 3, padding 4×7,
master 6×10; metadata gap 12. Article gap 16, master 24. Header bottom rule
`#E6E9EF`, без outer frame; marker gap 10/16/24, source marker 2×24/master3×36.
Header vertical padding 20 mobile, 24 tablet/desktop, 32 master. При 320px
статичный all-news label может перейти на вторую строку без overflow.

## Проверка

Выбраны `frontend-design`, `vue-best-practices`, `tailwind-best-practices`, Pen
`pen-dev`. Новые browser/reactive primitives не нужны: это static data и CSS
layout, без listeners, timers, observers, Date/Intl или VueUse composables.
Проектные JavaScript + `<script setup>` и CSS-first `@theme` сохранены.

Все runtime-проверки выполнены через Sail:

| Проверка | Результат |
|---|---|
| Живой Pen MCP | Повторно прочитаны News trees восьми адаптивов, `nmCRU`, typography, spacing, covers, dates и отсутствие href; snapshots master/mobile/tablet сопоставлены |
| `npm run build` | Client + SSR build успешны, Vite 8.3.4 |
| `npx playwright test --project=landing-v2-news --project=landing-v2-content --project=landing-v2-hero --project=landing-v2-navigation --project=landing-v2-foundation --project=landing-v2-routing` | **115 passed**: 18 news + 97 regressions предыдущих этапов |
| `node --test tests/Unit/Frontend/landingV2Foundation.test.js` | **2 passed** |
| `artisan test --filter='Landing(Test\|V2Test)'` | **10 passed / 105 assertions** |
| Controlled built-bundle SSR/hydration | **6/6**: 390/1440/2560 × light/dark, News section и первая article гидратируются с сохранением DOM, три карточки и точные ISO dates присутствуют, без JS/hydration errors |
| Старый `/` | **16/16** сравнений с baseline без различий, восемь widths × light/dark, шесть regions на страницу |
| Endpoints | `artisan route:list --json` до/после побайтово совпадает; новых backend endpoints нет |
| Source isolation | Старые Header/Hero/Platforms/Connection, shared components/composables, PHP/routes, database/migrations, assets, dependencies и theme store не менялись |
| Diff | `git diff --check`; generated `bootstrap/ssr/*` восстановлены и исключены из commit |

News matrix проверяет точный порядок, title/category/date, ISO datetime,
исходные cover URLs и decode 1024×1024, object-fit, размеры и radii images,
section/header/article typography, gaps, tablet list и desktop columns.
Header height отличается от Pen меньше чем на 1px из-за native/browser line
metrics; outer frame отсутствует, остаётся только нижний rule. Реальная
section вставлена после Connection, без других новых sections.

Pointer clicks по label/headline сохраняют `/landing`; в секции нет links,
buttons, role=button/link или tabindex, курсор не обещает действие. Keyboard
Tab не попадает в news presentation. Network observation не обнаружила
fetch/XHR-запросов. Отсутствие backend/database additions дополнительно
подтверждается Git scope: новые файлы — Vue, JS data, CSS, browser tests и docs.
Это не утверждение о schema production database, к ней задача не обращалась.

Дополнительно проверены widths 320/600/767/769/1023/1025/1200/1439/1600/2561/3840,
отсутствие horizontal overflow, reduced motion и forced colors. Существующие
foundation tests повторно проверили bytes/hashes и decode всех 33 assets;
новости не создают новые raster files и не меняют manifest.

Просмотрены browser snapshots 390/768/2560 рядом с live Pen; дополнительные
1024/1440 сохранены в ignored `test-results/landing-v2-news-*`. Baseline и
hydration scripts — в ignored `storage/framework/testing/landing-v2-foundation/`.
Это локальная приёмка статического блока, не physical-device, полная финальная
accessibility/pixel или production acceptance. Permanent SSR service/config и
production environment не менялись. Deployment не выполнялся.

Существующий content-order test расширен четвёртой section `v2-news-title`;
прежний порядок первых трёх секций и все их checks сохранены. Новые токены
изолированы в `landing-v2-news-tokens.css` с V2 overrides. Шаг 08 и дальнейшие
этапы не выполнялись. Overview DoD остаётся финальному этапу.
