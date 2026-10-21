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

Audit и открытые пункты: [verification matrix](audit/pen-verification.md).
Physical checks: [ручной протокол](audit/pen-step15-manual.md).

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
