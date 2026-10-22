# Браузерные проверки Playwright

Playwright Test установлен как dev dependency с фиксированной версией.
Конфигурация и тесты написаны на JavaScript. Все команды выполняются через
Laravel Sail; Chromium запускается внутри контейнера приложения, независимо
от Pen Browser.

## Подготовка

При запущенном Sail:

```bash
./vendor/bin/sail npm ci
./vendor/bin/sail npx playwright install chromium
./vendor/bin/sail npm run build:client
```

Установленный Sail runtime PHP 8.5 на Ubuntu 24.04 уже включает системные
библиотеки Playwright и `PLAYWRIGHT_BROWSERS_PATH=0`. Browser binaries хранятся
в `node_modules/playwright-core/.local-browsers`, поэтому после `npm ci` или
обновления Playwright нужно снова выполнить `playwright install chromium`.
Исходник runtime: `vendor/laravel/sail/runtimes/8.5/Dockerfile`.

Приложение должно быть доступно внутри контейнера по `http://127.0.0.1`;
Playwright использует уже запущенный Sail HTTP server. Для другого адреса:

```bash
./vendor/bin/sail exec -e PLAYWRIGHT_BASE_URL=http://laravel.test laravel.test npm run test:e2e
```

## Запуск

```bash
./vendor/bin/sail npm run test:e2e
./vendor/bin/sail npm run test:e2e -- --project=chromium-mobile
./vendor/bin/sail npm run test:e2e -- --list
```

`playwright.config.js` задаёт smoke projects Chromium desktop `1440×1024` /
light и mobile viewport `390×844` / dark, а также отдельный project
`account-dashboard`. Mobile project проверяет responsive viewport,
а не эмулирует физический телефон. Каждый тест получает отдельный browser
context. По умолчанию включён reduced motion; motion-сценарии должны явно
переопределять эту настройку. Retries отключены, тесты выполняются одним worker.

Начальный smoke открывает настоящую `/login`, проверяет отрисовку, Tab и
Shift+Tab между полями, Enter на переключателе видимости пароля, отсутствие
необработанных page errors и сохранение full-page screenshot. Данные аккаунтов
не создаются, формы на сервер не отправляются.

HTML report: `playwright-report/index.html`. Диагностика упавших тестов
(screenshots/traces) находится в `test-results/`; screenshot успешного smoke
прикреплён к HTML report. Оба каталога
исключены из Git. Не добавляйте browser storage state с сессиями в репозиторий.

## Dashboard — шаг 8

```bash
./vendor/bin/sail npm run test:e2e -- --project=account-dashboard
```

Project проверяет:

- dashboard на `320/360/390/768/1024/1440/1920/2560` в light/dark;
- шесть состояний × четыре ширины × две темы, включая 0/2/5 устройств;
- меню «Ещё» на 390/768: Enter, Tab/Shift+Tab, Escape, видимый focus,
  inert, scroll lock, focus return, backdrop, support intent и resize;
- network/503 error → fresh retry, loading и защиту от двойного запроса;
- processing/logout, theme при Inertia navigation, desktop skip link и
  прокрутку sidebar;
- длинный текст и text-only ×2 на 320, включая скрытие skip link и More overlay.

`helpers/accountDashboard.js` загружает настоящий Blade/Vite document с
`/login` и в контексте браузера подменяет только Inertia page data и account
transport. Рендерятся настоящие компоненты текущей client build. Реальные
пользователи и Remnawave не затрагиваются; authorization/provider mapping
проверяются отдельно Laravel Feature-тестами. Logout/retry в этих browser
сценариях получают контролируемые ответы, а не вызывают реальный backend.

К dashboard attachments относятся full-page и viewport screenshots; для More
снимается viewport. На маленьком экране full-page screenshot может показывать
fixed navigation посреди документа — для сравнения с Pen frame используйте
соответствующий `viewport-*` attachment. Именованные PNG находятся в каталоге
каждого теста внутри `test-results/`.

Скриншоты сохраняются для визуального review, автоматический pixel baseline
против Pen не создаётся. Browser keyboard проверяется через Playwright input;
ручная проверка физической клавиатуры и screen reader относится к шагу 15.
Operational SSR/hydration остаётся отдельным `U-22`: client/SSR build и CSR
browser tests сами по себе его не подтверждают.

## Responsive и Pen matrix — шаг 15

```bash
./vendor/bin/sail npm run test:e2e -- --project=responsive-accessibility
./vendor/bin/sail npm run test:e2e -- --project=pen-frames
./vendor/bin/sail npm run test:e2e -- --project=control-presentation
./vendor/bin/sail npm run test:e2e -- --project=connection-url
./vendor/bin/sail npm run test:e2e -- --project=pointer-focus
./vendor/bin/sail npm run test:e2e -- --project=rendered-contrast
./vendor/bin/sail npm run test:e2e -- --project=pen-surfaces
./vendor/bin/sail npm run test:e2e -- --project=pen-shells
./vendor/bin/sail npm run test:e2e -- --project=hero-acceptance
./vendor/bin/sail npm run test:e2e -- --project=signal-orbit-acceptance
./vendor/bin/sail npm run test:e2e -- --project=contrast-regression
./vendor/bin/sail npm run test:e2e -- --project=public-acceptance
./vendor/bin/sail npm run test:e2e -- --project=pen-auth-account-details
```

`responsive-accessibility` проверяет 16 page compositions в обеих темах,
промежуточные widths/reflow, targets/spacing, labels/ID references,
computed text и field-boundary contrast, text ×2 с проверкой clipping и forced
colors. Дополнительно сохраняет полный landing и оба Hero на
360/390/768/1440/2560. Отказ SVG ресурсов выбирает сохранённый Signal Orbit.
Не добавлены axe/Vitest или другие зависимости. Эти проверки не заменяют
screen reader, native zoom и физическое устройство.

`pen-frames` использует read-only snapshot
`docs/audit/pen-verification-frames.json`: 205 route/state cases, 10 visual-only
boards не становятся routes. Для каждого case прикладываются screenshot,
layout metrics и contrast JSON. Тест не объявляет pixel equality с Pen;
источник screenshots Pen — только read-only `TakeScreenshot` через MCP.
Representative fixtures не изменяют реальные accounts/providers/payments.

`control-presentation`: полный keyboard cycle на 16 compositions, painted
focus и icon-only contrast, hover, overlays, native radio ArrowRight,
selected indicator >=3:1 до/после выбора и в forced colors, auth
error/loading/disabled presentation. Browser assertions не заменяют AT.

`connection-url`: 56 native manual-copy cases для Dashboard/Connection и
Referral web/Telegram на 320/360/390/768/1024/1440/2560 в обеих темах,
а также 12 touch-selection cases. Проверяет полный URL с query/fragment
в readonly input, реальное Ctrl+C и button copy в browser clipboard,
выделение по клику/тапу, focus/contrast, resize и отсутствие page overflow.
Длинное значение прокручивается внутри поля; masked previews не используются.
Touch contexts — browser emulation, не физические устройства. Подробнее —
[referral URL audit](audit/pen-referral-url.md).

`pointer-focus`: 86 presentation cases — mouse activation всех controls в
16 compositions, touch и реально открытые overlays. Проверяет отсутствие
дополнительного outline после pointerdown и его возврат через Tab. Для
generic buttons/links блокируются навигации и mutations после native focus;
настоящие actions покрываются `interactive-states`. Disabled controls не
являются pointer targets. Правило и границы — в
[аудите pointer focus](audit/pen-pointer-focus.md).

`account-connection` дополнительно раскрывает первые два шага на всех восьми
ширинах в обеих темах и проверяет геометрию стрелки select, размеры CTA
«Скачать»/«Добавить подписку», server href/target и текст 2×. Native keyboard
и forced-colors arrow проверяются отдельно. `account-referral` применяет
тот же helper к селектору канала приглашения. Подробнее —
[аудит селекторов и действий инструкции](audit/pen-connection-controls.md).

`rendered-contrast`: оба Hero на пяти reference widths в двух темах.
Service Cloud использует production projection в четырёх fixed poses при
paused runtime; Signal Orbit — static fallback. Дополнительно измеряются
пять текстовых ролей финального gradient CTA. Screenshot фона сканируется
по line boxes с шагом 2 CSS px; для Hero проверяются цвет и geometry
opaque text outline по G18. Opacity groups явно исключены из приближения.
Attachments содержат JSON measurements и `hero-pose-*.png`; это конечная
выборка, не все animation frames и не pixel equality с Pen. Подробнее —
[control audit](audit/pen-control-verification.md).

`pen-surfaces`: 84 existing route/state fixtures и 196 roles из read-only
`pen-surface-roles.json`. Сравнивает background/border/radii/padding/gap/width
карточек, copy rows, support bubbles и connection steps с live Pen snapshot,
включая Full HD/QHD и открытый More/promo. Width двух вложенных copy rows
учитывает HTML parent border; demo heights не фиксируются. Measurements
прикладываются к case. Подробности — [surface audit](audit/pen-surface-verification.md).

`pen-shells`: 101 auth/status/public fixture compositions и 543 роли из
read-only `pen-shell-roles.json`. Проверяет geometry, fills/borders, status
glyphs и menu shadows. Public login имеет source hug sizing: padding/height
точные, ширина зависит от текста. Light highlighted menu item воспроизводится
как hover; tablet menu сохраняет положение под header. Отклонения и source
IDs — в [shell audit](audit/pen-shell-verification.md). Measurements и шесть
focused PNG прикрепляются к cases.

Оба source projects требуют видимость ролей; `pen-shells` проверяет собственный
layout fill до ancestor fallback, geometry inset borders и minimum heights
menu/payment secondary actions. Их чувствительность подтверждена четырьмя
negative controls: [review проверки](audit/pen-verification-review.md).

Audit и открытые пункты: [verification matrix](audit/pen-verification.md).
`hero-acceptance`: 34 cases по live Hero roles и принятому fallback contract.
Проверяет 23 SVG/46 local resources, static source metrics, один missing SVG,
renderer DOM failure, original fallback paths/CTA, forced colors и envelope.
10 Cloud и 10 resource-fallback scenes прикладывают PNG. Native visible smoke
этим project не объявляется; [Hero audit](audit/pen-hero-verification.md).
Physical checks: [ручной протокол](audit/pen-step15-manual.md).

`public-acceptance`: 13 compositions — 11 direct references из
`pen-public-detail-roles.json` (144 source roles) и два явно обозначенных
inferred light cases на 360/768. Проверяет public icon sizes/colors,
pricing selector surfaces/gaps, responsive text alignment и направление/
порядок цветов final CTA gradient из shell snapshot. Captures: 60 sections,
три menu panels и три menu viewports. До исправлений source assertions
воспроизводили UI defects; [public audit](audit/pen-public-verification.md)
содержит before-results, scope screenshot review и native capture limitation.

`pen-auth-account-details`: 194 non-public Pen route/state fixtures в обеих
темах на 390/768/1440/1920/2560. Snapshot содержит 1794 records: 1744
presentation roles и 50 status/payment composition captures, дополняющих
существующие `pen-shells`/`pen-surfaces`/typography assertions. Проверяются
icon size/foreground, шесть Lucide artworks, header controls, inputs,
bottom-nav gaps, internal surfaces, overlays/close controls/handles и
70 step-number typography roles. Raw colors остаются в snapshot; accepted
contrast/active-state mappings задаются отдельно. Шесть дублирующих sidebar
Theme rows явно вынесены в `omittedRoles`, не сопоставлены с logout.

Каждый case прикладывает measurements, viewport и content PNG. Отдельная
gallery содержит 194 полные пары и 102 focused Pen/browser pairs; transient
overlay frames заменены captures после завершения transition. Это визуальная
сверка с source metrics, без заявления pixel equality thumbnails.
Source IDs, воспроизведённые failures, intentional deviations и итоговые
результаты — в [auth/account audit](audit/pen-auth-account-visual-verification.md).

`signal-orbit-acceptance`: 12 browser cases с явным `variant="signal-orbit"`.
Test-only Vite transform меняет один caller в отдельной build внутри storage;
production source, обычный build и routes не меняются. Проверяются responsive
logo lockups по live source paths, pointer deformation/settling/bounds,
reduced-motion/coarse static gates, CTA, public menu и forced colors.

Contrast coverage требует отсутствие unresolved entries на тех же DOM
instances: alpha surfaces вычисляются по цепочке родителей, translucent
chrome — с bound по всем sRGB backdrops, gradients — по painted PNG.
`contrast-regression` проверяет low-contrast и unsupported paint negative
controls. Подробности, exceptions и scope — в
[аудите оставшейся приёмки](audit/pen-remaining-acceptance.md).

## Operational SSR — шаг 15

Для проверки нужны production client/SSR build, Node renderer и отдельный
локальный HTTP server с включённым SSR. Запустить в отдельных терминалах:

```bash
./vendor/bin/sail npm run build
./vendor/bin/sail node bootstrap/ssr/ssr.js
./vendor/bin/sail exec --user sail -e INERTIA_SSR_ENABLED=true -e INERTIA_SSR_THROW_ON_ERROR=true laravel.test php artisan serve --host=127.0.0.1 --port=8015 --no-reload
```

После старта обоих процессов:

```bash
./vendor/bin/sail exec --user sail -e PLAYWRIGHT_SSR_BASE_URL=http://127.0.0.1:8015 laravel.test npm run test:e2e -- --project=operational-ssr
```

Project `operational-ssr` появляется только при явном
`PLAYWRIGHT_SSR_BASE_URL`; обычный suite не требует запущенного SSR. URL Node
renderer по умолчанию `http://127.0.0.1:13714/render`, при необходимости задаётся
`PLAYWRIGHT_SSR_RENDER_URL`. Прогон проверяет 8 реальных initial HTTP visits и
32 fixture compositions: серверный h1 остаётся тем же DOM-узлом после
hydration, нет mismatch/page errors, theme/More работают после mount.

После проверки остановить временный HTTP server и renderer (Ctrl+C в их
терминалах; renderer также можно остановить через
`./vendor/bin/sail artisan inertia:stop-ssr`). `.env` не меняется, обычный
SSR-off CSR runtime сохраняется. При `sail exec` указывать `--user sail`, чтобы
test reports не стали принадлежать root. Не запускать два Playwright процесса
одновременно в один `test-results/`/`playwright-report/`.

Документация: [installation](https://playwright.dev/docs/intro),
[Docker](https://playwright.dev/docs/docker),
[configuration](https://playwright.dev/docs/test-configuration).
