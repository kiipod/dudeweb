# Pen — verification matrix шага 15

Дата: 2026-10-21; public continuation 2026-10-22. Ветка: `pen-integration`, исходный commit `54113c9`.
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
| I-15-03 | Intentional URL presentation | По уточнениям владельца Dashboard/Connection и Referral на всех ширинах показывают полный server URL в readonly input, включая `https://`, path/query/fragment; native selection/copy доступны без кнопки. Длинное значение прокручивается внутри поля. Оба variants используют контрастный field border; masked preview и clipping exception удалены. [Referral уточнение](pen-referral-url.md). |
| I-15-04 | Intentional pointer/keyboard focus presentation | По запросу владельца дополнительный outline не рисуется при click/tap у полей, selectors и остальных controls. Общий `keyboard-focus` variant сохраняет контур при keyboard input; selected/error/disabled presentation и native URL selection/copy сохранены. [Аудит и regression](pen-pointer-focus.md): 86 pointer/touch + 192 controls/interaction, frontend 84/84. |
| I-15-05 | Intentional select/action presentation | По запросу владельца оба native select используют общую центрированную стрелку с внутренним отступом; действия инструкции «Скачать» и «Добавить подписку» оформлены основными кнопками по interface scale. До 768 px — ширина блока, далее — по содержимому. [Source, решение и проверка](pen-connection-controls.md). |
| I-15-06 | Intentional connection section headings | По запросу владельца добавлены небольшие h2 «Ваша ссылка для подключения» и «Инструкция для подключения» с дополнительными отступами; sections именованы через заголовки. [Решение и проверка](pen-connection-controls.md): 38 connection + 20 surface/detail cases. |
| N-15-01 | Закрыт в описанном acceptance scope | Public/Hero и auth/account visual audits дополнены quantitative contrast и явным Signal Orbit. Source comparison, measurements, exceptions и ограничения записаны отдельно; получение screenshots само по себе не считается visual sign-off. [Итог оставшейся приёмки](pen-remaining-acceptance.md). |
| N-15-02 | Закрыт по ручному отчёту владельца | Владелец 2026-10-22 явно подтвердил успешные M-01…M-11: keyboard, screen reader, native zoom, touch/safe areas и Service Cloud motion/background. [Ручной протокол](pen-step15-manual.md) обновлён; ОС/browser/AT/device не указаны и не придуманы. Сбой capture Pen Browser остаётся ограничением инструмента. |
| N-15-03 | Needs review | Production-like reset mail: владелец 2026-10-22 подтвердил, что SMTP пока недоступен. M-12 остаётся открытым; письма не отправлялись. |

Продолжение детальной проверки: [typography, Q2 и contrast audit](pen-detail-verification.md).
Дополнительно исправлены D-15-10…16: tracking заголовков/wordmark, weights
labels/controls, Q2 reward table, author colors переписки, подпись тарифа и
контраст светлого success на operator bubble. Их source IDs и regression
criteria находятся в том документе и в `typography` frame matrix.

Для финального gradient CTA получены 10 наборов измерений (пять widths × две
темы), шесть текстовых ролей каждый: в выборке нет failures, минимум 4.665:1
light / 5.039:1 dark. Остальные gradient/opacity chains и динамический Hero
сохраняют статус N-15-01.

Продолжение 2026-10-22: [controls и текст поверх декора](pen-control-verification.md).
Live inventory снова 215/10/19. Исправлены D-15-17 (selected theme border) и
D-15-18 (контур текста обоих Hero). Проверены 96 control cases и 20
fixed-pose/painted-background cases. В новой плотной выборке final CTA имеет
пять непосредственных текстовых ролей; Hero — шесть, четыре с контуром.
Opacity groups не выдаются за простой foreground alpha. Native motion и
остальная детальная visual matrix остаются N-15-01/02; владелец подтвердил,
что M-01…M-11 пока не проверял. SMTP остаётся N-15-03.

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

## Повторная проверка 2026-10-22

- `./vendor/bin/sail npm run build`: production client/SSR build прошёл.
- `./vendor/bin/sail npm run test:e2e`: **888/888** за 6.4 минуты, включая
  205 Pen references, 168 responsive/a11y, 96 controls и 20 rendered-contrast.
  Selected radio indicators и painted focus дополнительно проходят forced colors.
- `./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js`: **79/79**.
- `./vendor/bin/sail composer test`: **277 tests / 2628 assertions**, exit 0.
  Существующие PDO deprecations в 266 tests сохраняются.
- `git diff --check`: прошёл. Generated `bootstrap/ssr/*` восстановлены из HEAD;
  исходное рабочее дерево было чистым.
- Report: `playwright-report/index.html`; сохранённая копия —
  `storage/app/pen-step15/presentation-final-report/index.html`. Poses и JSON —
  в `test-results/rendered-contrast-*/`. Build/test logs —
  `/tmp/pen-step15-{build,browser-final,frontend-final,php-final}.log`.

Operational SSR 40/40 выше относится к предыдущему этапу; в этом продолжении
не перезапускался. Изменены presentation styles и browser checks, hydration/
server contracts не менялись. Commit не создавался. Шаг 15 остаётся открытым.

## Продолжение — surfaces кабинета

[Surface audit](pen-surface-verification.md) и [snapshot](pen-surface-roles.json)
содержат 196 named roles в 84 route/state references. Live Pen перечитан
read-only. Исправлены D-15-19…24: radii/padding и card borders dashboard,
subscription overview/summary, referral card/statistics, connection step fill,
support bubble borders и фиксированные subscription/referral copy variants.

Исходная regression matrix: 64 failures / 20 passed; после fixes — **84/84**.
Дополнительные copy-row differences воспроизведены тремя focused cases.
Profile identity и support list сохраняют исходные styles. Geometry с реальным
copy вправе расти; Pen demo heights не используются как runtime contract.
Правило родительского CSS border описано явно; оно не скрывает неизвестную
разницу ширины. Manual-copy input сохраняет контрастную field boundary.

Общая visual приёмка и N-15-01/02/03 остаются открытыми. Native/AT/SMTP
результаты не появились. Pen, dependencies и backend не менялись.

Финальная проверка surface-продолжения:

- Sail production client/SSR build — успешно.
- Sail browser suite — **972/972** за 7 минут: прежние 888 плюс 84 surface cases.
- Sail frontend unit — **79/79**.
- Sail Composer/Laravel — **277 tests / 2628 assertions**, exit 0;
  прежние PDO deprecations в 266 tests сохраняются.
- `git diff --check` проходит; `bootstrap/ssr/*` исключены из diff.
- Копия report — `storage/app/pen-step15/surface-final-report/index.html`.
  Logs — `/tmp/pen-step15-surface-{build,browser-final,frontend,php-final}.log`.

Operational SSR в этой части не перезапускался. Commit не создавался;
исходные незакоммиченные D-15-17/18 и их tests/audits сохранены.

## Продолжение — auth/status/public layouts

[Shell audit](pen-shell-verification.md) и [snapshot](pen-shell-roles.json)
фиксируют **543 роли в 101 reference**: auth header/content, status artwork,
payment secondary actions и public section/card/header/menu geometry.
Исправлены **D-15-25…28**: status background/glyphs, payment action fills/
borders/gap, neutral header roles и menu palette/gaps/shadows. Теперь всего
зарегистрировано 28 исправленных defects шага 15.

Raw source сравнивается с реальными components; public login сохраняет live
`hug` sizing, а tablet menu — позицию под фактическим header. Existing semantic
contrast colors сохранены. Подробные source IDs и ограничения — в shell audit.
Focused matrix **101/101**, затем menu shadow checks **3/3**. Focused PNG
выявил token collision, который перекрашивал labels: новый regression
воспроизвёл **3/3 failures**, после переименования цветового token — **3/3 passed**.
Общий промежуточный прогон остановлен и не считается итоговым результатом.

Production client/SSR build и frontend **79/79** проходят. Composer/Laravel:
**277 tests / 2628 assertions**, exit 0; прежние PDO deprecations в 266 tests.
Финальный общий browser suite: **1073/1073 за 7.8 минуты**, exit 0, на
пересобранном client build. Включает финальные **101/101 pen-shells** с
label/shadow assertions. `git diff --check` проходит; три generated SSR
bundle восстановлены из HEAD. Копия report:
`storage/app/pen-step15/shell-final-report/index.html`.
Logs: `/tmp/pen-step15-shell-{build-final,browser-final,frontend,php-final}.log`.

В финальном status обнаружены параллельные изменения `package.json` engines
и `docker/app/Dockerfile`: требование/образ Node повышены до 24.22.1. Они
сохранены и не входят в эту UI-сверку. Фактический Sail runtime этого прогона —
**Node v24.16.0**; результаты выше не подтверждают переход на Node 24.22.1.

N-15-01/02/03 остаются открытыми: полная visual comparison, native ambient/
pointer, physical/AT/device protocol и внешний reset SMTP требуют результата.
Operational SSR в этом продолжении не повторялся. UI-исправления не меняют
Pen/backend/dependency versions; commit не создавался, шаг 16 не начат.

## Review самой проверки

[Verification review](pen-verification-review.md) подтверждает live 215 IDs,
состав исторического report **1073 expected / 0 skipped / 0 flaky**,
205/84/101 source cases и наличие всех 1605 attachments. В нём исправлены
verification defects V-15-01…04: собственный layout fill, inset geometry,
minimum height menu/actions и видимость source roles. Каждая из четырёх
контролируемых mutations раньше проходила, после усиления assertions падает.
Временные hooks удалены; реальные fixtures проходят **185/185**.

Это новый focused прогон двух затронутых projects, не повтор всего 1073 suite.
Production UI и build assets не менялись. Новый report:
`storage/app/pen-step15/verification-review/report/index.html`.
257 `manual` entries в computed contrast не объявляются успешными измерениями;
visual/native/AT/SMTP acceptance и шаг 15 остаются открытыми.

## Продолжение оставшихся пунктов — Hero

[Hero audit](pen-hero-verification.md) и [source snapshot](pen-hero-roles.json):
восемь прямых live references, 16 read-only source captures, просмотр 20
browser Hero PNG на пяти widths в обеих темах. Два light cases имеют
производную geometry/theme mapping, поскольку прямого frame нет.
Проверены static source content/geometry, 23 SVG и 46 local theme URLs,
отказ одного ресурса, renderer failure, reduced-motion/forced colors,
fallback envelope и ранее принятый overlap описания.

Sail browser **63/63**, frontend **81/81**, diff check. Новый report и gallery:
`storage/app/pen-step15/hero-review/`. Production UI/build не менялись;
1073/1073 выше — прежний полный suite, не новый результат этого продолжения.

Pen Browser сначала сообщил visible/ready, но capture снова timeout 60s,
после него document.hidden=true. Native ambient/hover/drag/background не
засчитываются; probes/media/viewport подмены сняты. Общая visual matrix и
physical/AT/SMTP остаются открытыми. Шаг 16 не начат, commit не создавался.

## Продолжение — public shell и контентные секции landing

[Public audit](pen-public-verification.md) и
[source snapshot](pen-public-detail-roles.json): 144 роли из 11 прямых Pen
references. Первые 100 повторно совпали с live Get; добавлены 44 responsive
text alignment roles. Ещё два browser cases явно используют производную
light palette для 360/768 без самостоятельных source frames. Final CTA
gradient проверяется по существующему shell source.

Исправлены D-15-29…33 — theme icon sizing/palette, pricing selector fills и
gaps, public accent roles, mobile intro alignment и CTA gradient direction.
Начальные 11 direct cases падали; alignment regression отдельно воспроизвёл
3/3 failures, gradient regression — 2/2 failures в обеих темах. После fixes
focused matrix проходит **13/13**: 168 detail role instances и 13 gradients.

Получены 51 focused Pen PNG и 66 browser PNG, просмотрены 10 light/dark public
section compositions и три menu states. В плане закрыта статическая public
comparison в описанном scope; data/legal/accessibility deviations сохранены.
Это не pixel equality Pen thumbnails или подтверждение physical/AT поведения.
Новая gallery: `storage/app/pen-step15/public-review/index.html`.

Native Browser до capture: visible ambient image updates, trusted drag за
bounds SVG и корректный capture/release. После capture IPC timeout 60s
context становится hidden и RAF останавливается. Полный native/background
smoke остаётся открыт. Probes/listeners/viewport override удалены.

Sail production client/SSR build, frontend **81/81**, Laravel **277 tests /
2628 assertions** и diff check проходят. Generated SSR files восстановлены
byte-for-byte до состояния рабочего дерева в начале этого продолжения;
существующий незакоммиченный diff сохранён. Итоговый полный browser suite
на окончательном build — **1120/1120 за 8.9 минуты**, exit 0, 17 projects,
0 unexpected/skipped/flaky; все 1774 attachments доступны. Состав report
подтверждает 205 Pen / 84 surface / 101 shell / 34 Hero / 13 public cases.
Report: `storage/app/pen-step15/public-review/full-report/index.html`;
machine-readable counters — `full-summary.json` рядом с gallery.
Operational SSR здесь не повторяется. Auth/account detailed visual,
physical keyboard/AT/device/zoom и внешний reset SMTP остаются открытыми;
шаг 15 не закрыт, шаг 16 не начат.

## Последующий отчёт владельца

Владелец подтвердил **M-01…M-11 пройдены, M-12 внешний SMTP не проверялся**.
Это supersedes исторические записи «результатов нет» / «physical/AT open»
выше; canonical [ручной протокол](pen-step15-manual.md) и checklist шага 15
обновлены. Service Cloud native motion принят по M-09 владельца, без
объявления IPC timeout Pen Browser успешным capture. M-12 остаётся открыт.

Присланные **11 public failures** с declaration `:20:5` совпадают с before-fix
логом. Новый Sail повтор текущего `:40:5` — **13/13 за 14.6s**, 0 failures,
skipped и flaky; все 11 direct IDs прошли, плюс два inferred light cases.
Report: `storage/app/pen-step15/public-review/owner-followup/report/index.html`.
Production source/build не менялись, полный suite не перезапускался.
Открыты detailed auth/shared/account visual, оставшийся explicit Signal Orbit
scope, quantitative contrast chains и M-12; шаг 15 не закрыт.

## Детальная visual-сверка auth/account

[Auth/account audit](pen-auth-account-visual-verification.md): live Get всех
194 non-public references и 8684 nodes, 194 полные пары и 102 focused pairs.
Прежние 250 auth/status shell и 196 account surface roles совпали с текущим
source; добавлены 1794 detail records (1744 presentation, 50 compositions).
Исправлены D-15-34…42: glyph geometry/artwork, account chrome/navigation,
More/promo decoration, subscription surfaces, support badge/chevron, номера
шагов. Raw source и intentional deviations сохранены явно.

Окончательный Sail browser suite — **1314/1314 за 11.1 минуты**, 18 projects,
0 skipped/flaky/unexpected; проверены все **2356 attachments**. Включены
194 detail / 205 Pen / 84 surface / 101 shell / 34 Hero / 13 public cases.
Frontend **81/81**, Laravel **277 tests / 2628 assertions**, client/SSR build
и diff check проходят; прежние 266 PDO deprecations сохраняются. Generated
SSR восстановлены до исходных байтов рабочего дерева; operational SSR не
перезапускался. Report и gallery:
`storage/app/pen-step15/auth-account-review/final-report/index.html`,
`storage/app/pen-step15/auth-account-review/index.html`.

Auth/account visual scope закрыт. Ручные M-01…M-11 приняты; открыты M-12 SMTP,
explicit Signal Orbit scope и оставшиеся quantitative contrast chains.
Шаг 15 остаётся открытым, шаг 16 не начат; commit не создавался.

## Продолжение — quantitative contrast и явный Signal Orbit

Предыдущие открытые contrast/explicit пункты закрыты в
[описанном scope](pen-remaining-acceptance.md). Live inventory — **215/215 IDs**,
без missing/extra. Focused contrast — **308/308**; отдельная explicit matrix
добавляет 12 browser cases с настоящими components, selected logo source
paths, pointer response/settling, неизменным SVG box и ограниченным contour,
reduced/coarse gates, CTA/menu и forced colors.

Итоговый Sail browser **1333/1333 за 13.6 минуты**, 20 projects,
0 skipped/flaky/unexpected/errors. Подтверждены все **2386 attachments**.
В итоговых contrast records: 4393 computed text / 154 field boundaries /
120 painted measurements / 132 all-sRGB backdrop bounds; unresolved chains
и failures отсутствуют. Отдельные 350 text-role instances в 60 fixed
Hero/gradient scenes также проходят. Methods/exceptions сохранены явно.

Frontend **81/81**, Laravel **277 tests / 2628 assertions**, client/SSR build
и diff check проходят с прежними PDO deprecations. Generated SSR восстановлены
до исходных байтов рабочего дерева; operational SSR не повторялся. Pen,
production UI и backend в этом продолжении не менялись. Report:
`storage/app/pen-step15/remaining-acceptance/final-report/index.html`;
machine-readable summary — `final-summary.json` в review folder.

Владелец уточнил: **SMTP пока недоступен**. Открыт только **M-12**; M-01…M-11
сохраняют принятую provenance. Шаг 15 не закрыт, шаг 16 не начат;
commit не создавался.
