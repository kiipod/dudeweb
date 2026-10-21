# Pen — verification matrix шага 15

Дата: 2026-10-21. Ветка: `pen-integration`, исходный commit `54113c9`.
Шаг 15 открыт; эта запись не является полной визуальной или AT-приёмкой.

## Источники и покрытие

Live документ `dudeweb.pen` прочитан через Pen MCP. Inventory использует
явный top-level predicate `ctx.depth === 0` и `ctx.skipChildren()`: **215
фреймов**, без чтения encrypted файла с диска и без mutations.

Каждый фрейм имеет отдельную запись в
[pen-verification-frames.json](pen-verification-frames.json): ID, имя,
размер Pen, component/route/state/theme и browser viewport height.
**205** записей — route/state references, **10** — visual-only boards:
`QJZCf`, `c5LjW`, `vbwL9`, `nNqCV`, `udMVl`, `eg9Ml`, `ODHOo`, `hc0K9`,
`SLuGe`, `LraS6`. Board не создаёт отдельного маршрута.

Все **215** Pen screenshots получены исключительно через read-only
`TakeScreenshot`. Исходные PNG сохранены в ignored
`storage/app/pen-step15/reference/<id>.png`. Дополнительно сняты восемь
актуальных Hero subtrees: `QfhD2/UQZi9/o6Ccn/XwYYP/wmAK2/BcmBV/NaUwK/v2heM`.
Полноэкранные TakeScreenshot thumbnails имеют максимум 400px по длинной
стороне; они подтверждают обзор композиции, но не пригодны для pixel baseline
мелкой типографики. Все 36 обзорных листов Pen/browser просмотрены: проверены
композиция, наличие основных действий и responsive rearrangement. Детальная
сверка мелкой типографики и состояний остаётся открытой; для неё нужны focused
subtrees и metrics. Обзор не объявляется полной pixel-приёмкой.

`tests/Browser/pen-frames.spec.js` создаёт отдельный browser case и attachment
`pen-<id>.png` для каждого из 205 route/state references. Для landing снимается
full page, для account/auth/payment и открытых overlays — viewport. Layout
metrics и text contrast JSON прикладываются к тому же case. Визуальная оценка
PNG не выводится из факта прохождения assertions.

Fixtures заменяют только Inertia data/transport в browser context и используют
реальные Vue components и Blade/Vite shell. Цены, даты, имя, статистика,
инструкции и support messages — representative test data. Они не добавляются
в production и не считаются реальными provider/payment результатами. Backend
ownership, данные и бизнес-правила отдельно проверяются Laravel Feature suite.

## Новые проверки

| Область | Покрытие | Ограничение |
| --- | --- | --- |
| Семантика | Все 16 page compositions в обеих темах: landmarks/h1, label associations, ID references, heading skips, control names, accessibility-tree attachments | Это focused assertions, не automated a11y engine и не AT walkthrough |
| Targets | 24px либо spacing exception с 24px circles; inline links в прозе исключены по WCAG 2.5.8 | Физическое touch-устройство — ручной протокол |
| Контраст текста | Computed foreground/background с alpha compositing, 4.5:1 для обычного и 3:1 для крупного текста | Gradients, opacity chains и logos вынесены из автоматического расчёта; требуется visual review |
| Reflow | 320/360/390/414/600/640/768/1024/1280/1440/2560, две темы, все 16 compositions; horizontal overflow и controls за краями; screenshots пяти reference widths | 640/320 моделируют CSS viewport при 1280px и zoom 200/400%; это не native zoom |
| Text ×2 | 320px, две темы, все compositions; отдельно размеры шрифта и line-height | Полная physical browser text-only zoom matrix остаётся ручной |
| Forced colors | Все 16 compositions в обеих темах; доступные controls и читаемый h1 | Не заменяет Windows high contrast/device smoke |
| SSR | Реальный Node renderer + production client/SSR build; 8 настоящих initial HTTP visits и 32 fixture compositions | Защищённые страницы рендерятся с безопасными test props; deployment/production config не менялись |

Точный критерий targets проверен по
[W3C SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
Порог контраста и правило крупного текста — по
[W3C SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
Границы полей проверяются по
[W3C SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
Короткие footer/payment links с достаточным spacing не объявляются defects
только из-за высоты строки меньше 24px. В открытом modal page h1 становится
inert; первый exposed h2 диалога допустим и не считается пропуском heading.

## Defects и intentional deviations

| ID | Классификация | Наблюдение и решение |
| --- | --- | --- |
| D-15-01 | Defect, исправлен; intentional color deviation от Pen | Светлый `#5B61E6` как мелкий текст на `#F4F0E8`, `#F5F1EA` и `#EEF0FF` давал 4.30/4.34/4.32:1. Добавлена semantic text role `accent-text`: `#4F55D8` в light, прежний `#8E9BFF` в dark. Заливка primary `accent` сохранена. Все прежние accent text call sites используют новую роль; `accent-foreground` сохранён. |
| D-15-02 | Defect, исправлен; intentional color deviation от Pen | Светлый muted `#7A7268` на surface `#F8F5EE` давал 4.35:1. Для мелкого текста и placeholders используется `#71695F`; dark muted сохранён. Live Pen подтверждает исходный `#7A7268` в account labels. |
| D-15-03 | Defect, исправлен | Client `createApp()` удалял настоящую SSR-разметку. Bootstrap выбирает `createSSRApp()` при наличии серверного DOM. Regression сравнивает identity h1 до и после mount. |
| D-15-04 | Defect, исправлен | SSR Teleport в `body` закрытого public menu при hydration удалял `.isolate` с `#app`. Public menu и BaseOverlay создают Teleport после mounted; CSR keyboard/leave/reopen contracts сохранены. |
| D-15-05 | Defect, исправлен | Сохранённый dark mode давал несовпадение server/client theme controls. Первый component render использует SSR-compatible light, после mount — локальное предпочтение. Pre-hydration head bootstrap сразу применяет сохранённую CSS palette. |
| D-15-06 | Defect, исправлен | Fixed mobile/tablet Hero height обрезала увеличенный ×2 текст; длинное слово заголовка выходило за 320px. Основной и запасной Hero используют исходную Pen height как minimum, допускают рост и переносят слишком длинное слово. 36 enlargement cases проходят; ordinary reference heights проверяются отдельно на пяти widths в двух темах. |
| D-15-07 | Defect, исправлен; intentional color deviation от Pen | Auth input borders имели 1.45:1 light и 1.91:1 dark относительно окружающего фона. Field boundary roles усилены до `#92887D` / `#707892`; select, manual-copy input и support reply используют field border, а не декоративный panel border. Обычные panel/button borders не объявляются обязательной границей поля. |
| D-15-08 | Defect, исправлен | В T2 отсутствовал показанный в Pen secondary action «Подключить устройство». Он ведёт на существующий `/account/connection` и показывается только для `succeeded`; pending/canceled не получают эту CTA. |
| D-15-09 | Defect, исправлен | В O2 возврат ко входу был малой текстовой ссылкой. Для подтверждённого `linkRequested` восстановлен primary action высотой interface-control, как в Pen; generic recovery copy и ссылка поддержки сохранены. |
| I-15-01 | Intentional data/copy deviation | UI использует актуальные server-backed даты, цены и имя; registration требует email verification; нет demo legal links без content; dashboard имеет действие обновления. Ранее принятые contracts не отменяются ради совпадения demo text. |
| I-15-02 | Intentional overlay deviation, U-20 | Live Pen `jodkF/k4r5Hy/VBwsg/i3LOc` центрирует desktop promo по viewport и затемняет sidebar. Принятый technical contract шага 1/9 центрирует dialog в main area и визуально затемняет только её, сохраняя inert всего фона. Этот owner exception сохранён. |
| I-15-03 | Intentional masked URL preview | CopyableLink показывает сокращённый домен/путь, допускающий ellipsis при text ×2; полный URL доступен через copy/manual fallback. Этот preview исключён из clipping audit; обычные заголовки и действия проверяются. |
| N-15-01 | Needs review | Полная детальная visual comparison каждого route/state и focused review мелкой типографики, gradient contrast и non-text controls должны иметь явный результат; получение screenshots не закрывает эти пункты. |
| N-15-02 | Needs review | Physical keyboard, screen reader, native zoom, touch/safe areas и видимая/background вкладка: владелец согласился выполнить [ручной протокол](pen-step15-manual.md); результат пока не предоставлен. |
| N-15-03 | Needs review | Production-like reset mail: тестовый адрес и настроенный внешний SMTP не предоставлены. Письма не отправлялись. |

Продолжение детальной проверки: [typography, Q2 и contrast audit](pen-detail-verification.md).
Дополнительно исправлены D-15-10…16: tracking заголовков/wordmark, weights
labels/controls, Q2 reward table, author colors переписки, подпись тарифа и
контраст светлого success на operator bubble. Их source IDs и regression
criteria находятся в том документе и в `typography` frame matrix.

Для финального gradient CTA получены 10 наборов измерений (пять widths × две
темы), шесть текстовых ролей каждый: в выборке нет failures, минимум 4.665:1
light / 5.039:1 dark. Остальные gradient/opacity chains и динамический Hero
сохраняют статус N-15-01.

## Operational SSR — U-22

Изначально `inertia:check-ssr` сообщил, что server не запущен. Для проверки
временно подняты `node bootstrap/ssr/ssr.js` и отдельный HTTP server внутри
Sail на loopback `8015`, с `INERTIA_SSR_ENABLED=true` и
`INERTIA_SSR_THROW_ON_ERROR=true`, без изменения `.env`.

После воспроизведения и исправления D-15-03/04/05 **40/40** scenarios проходят:
SSR markup существует до JavaScript, h1 сохраняет DOM identity после Vue
mount, нет hydration/page errors, light/dark preference применяется; account
More после hydration открывается, закрывается Escape и восстанавливает фокус.
Проверены все 16 compositions и настоящие `/`, `/login`, `/register`,
`/forgot-password` initial HTTP visits. Native controls после hydration
проверяются общим browser suite.

Финальный повтор на последнем client/SSR build: **40/40**. После проверки
временные Node renderer и HTTP server остановлены; generated SSR bundles
возвращены к исходному HEAD.

Это operational validation локального production build, а не подтверждение
production process supervision или выкладки. SSR остаётся выключенным в
обычном окружении проекта до отдельной настройки deployment.

## Проверка и оставшиеся границы

- Sail frontend unit suite: **79/79**.
- Sail Composer/Laravel: **277 tests / 2628 assertions**, exit 0; существующие
  PDO deprecations в 266 tests, без новых PHP changes.
- Production client/SSR build проходит.
- Operational SSR: **40/40** после fixes.
- Полный CSR/browser suite: **772/772** (399 прежних + 168 responsive/a11y
  + 205 Pen cases). После последних D-15-08/09 заново собрана production build
  и повторены все **205/205** Pen cases, включая новые CTA assertions.
- Снимки на 360/390/768/1440/2560 получены для всех 16 compositions в обеих
  темах; отдельно — 20 full landing и Hero-section PNG для двух Hero.
- 16 desktop geometry cases проходят на 1200×800, 1440×1080, 1920×1080 и
  2560×1440: header + Hero равны viewport height, контент центрирован по
  viewport, SVG внутри Hero; Service Cloud остаётся в своей колонке.
- Основной HTML report: `playwright-report/index.html`; последний frames
  report и SSR report — `storage/app/pen-step15/final-frames-report/` и
  `storage/app/pen-step15/ssr-report/`. Эти локальные artifacts ignored.
- `git diff --check` проходит; generated SSR bundles исключены из изменений.

Продолжение детальной проверки: полный набор **772/772** после tracking/weight
fixes. После последних D-15-13…16 пройдены **373/373** (205 Pen + 168
responsive/a11y) на финальном build, включая пять light conversation cases с
ранее недостаточным контрастом. Report:
`storage/app/pen-step15/detail-final-report/index.html`. Результат SSR 40/40 и
Laravel 277/2628 относится к предыдущему прогону; в этом продолжении менялись
только presentation roles и browser assertions, backend/runtime logic не менялись.

На шаг 16 не переходить. Полное закрытие шага 15 требует результатов открытых
visual и manual/SMTP пунктов. Исходный Pen, production secrets и deployment
не менялись; dependencies не добавлялись.
