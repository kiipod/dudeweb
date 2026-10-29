# Интервалы секций личного кабинета — 2026-10-26

Владелец попросил добавить воздух между секциями Subscription/Profile/Support
и проверить остальные страницы кабинета. Правка расширяет прежние Pen spacing
roles, не меняет типографику, цвета, ширину контента и бизнес-поведение.
Незакоммиченная предыдущая правка единых текстовых ссылок сохраняется.

## Источник и план

Live Pen прочитан read-only через `pen-dev`: `PvBmx`, `P4PAH`, `AxIiC`,
`O8T2D6`, `lUzA6`, `Razno`, `xrpVH`, `I0x6P`. Подтверждены общие интервалы
Dashboard/Support 14 px, Subscription 10 px и Profile 12 px, включая desktop/
QHD. Они почти не отличаются от внутренних 7–13 px в карточках и формах.
Pen документ не изменяется; приоритет нового owner request зафиксирован здесь.

Два уровня spacing через существующий CSS-first `@theme`:

| Роль | Mobile <768 | Tablet 768+ | Desktop 1200+ | FHD/QHD 1920+ |
| --- | ---: | ---: | ---: | ---: |
| `account-section`: самостоятельные блоки страницы | 24 | 20 | 24 | 24 |
| `account-group`: связанные группы/заголовок и содержимое | 16 | 12 | 16 | 16 |

Повторное уточнение владельца: мобильные интервалы приняты, на планшетах и
десктопах секции выглядели разрозненно. Прежний рост до 32/40/48 px для секций
и 20/24/28 px для групп отменён. На планшетах ритм компактнее; на desktop/FHD/
QHD ограничен 24/16 px и больше не растёт с шириной экрана. Меняются только
два общих токена в существующих breakpoint overrides; component map прежний.

Карточки/поля сохраняют прежние compact gaps и padding. Переписка сохраняет
12 px между сообщениями; расстояние до заголовка/формы увеличивается отдельно.
Не увеличиваем icon gaps, row metadata, размеры controls или chrome.
Существующие шрифты IBM Plex и light/dark palette остаются без изменений.

Component map: route pages остаются composition surfaces и используют общий
`gap-account-section`; checkout, ticket form/list, payment history и security
используют `gap-account-group` для внутренних групп. Profile identity остаётся
компактной карточкой. Connection убирает прежние дополнительные `pt` у URL/
instructions: границы секций получают один общий интервал без накопления.
Referral/Terms и Dashboard следуют тому же внешнему ритму; отдельные steps
и list items группируются плотнее. Payment result shell не требует изменений.

## Проверка первоначальной правки

Sail client/SSR build и frontend **103/103** проходят. Отдельный browser probe
проверил **144 contexts**: девять страниц × восемь ширин
320/360/390/768/1024/1440/1920/2560 × обе темы. Замерены CSS gap и **464
фактических промежутка между соседними блоками**, включая fragment/contents
components в support/referral; они совпадали с первоначальной матрицей
24/32/40/48 и 16/20/24/28 px. Проверены
внутренние группы, отсутствие horizontal overflow, открытые identity/password
forms профиля во всей matrix и text ×2 на 320. JS/Vue warnings/errors нет.

Просмотрены mobile 390/light Subscription/Profile/Support, Subscription
768/dark и 1440/light, Profile 2560/light, Support conversation 1440/light.
Группы визуально отделены; карточки не распадаются на несвязанные элементы.
Скриншоты и измерения: `storage/app/pen-step15/account-spacing/`.
Sail browser regressions: **815/815 за 7.3 минуты**, девять projects —
dashboard, subscription/payment, connection, referral, support, profile,
control presentation, Pen surfaces и auth/account details. Skipped/flaky/
unexpected нет. Проверены также error/loading/empty states, формы, payment
poll/retry, clipboard, overlays, native keyboard и selected/forced-color states.
Прежние fills/borders/padding/width карточек соответствуют сохранённым roles.
Report: `playwright-report/index.html`. Generated SSR восстановлены
byte-for-byte к HEAD; `git diff --check` проходит.

Backend, live provider operations и production deployment не входят в правку.
Operational SSR не повторялся; физические устройства не проверялись.
M-12 SMTP остаётся открыт, шаг 16 не начинается; commit не создавался.

## Проверка компактного tablet/desktop

Sail `npm run build:client` проходит. Probe в
`storage/app/pen-step15/account-spacing-compact/verify.mjs` проверил **216
contexts / 696 фактических промежутков**: девять страниц × 12 ширин
320/360/390/767/768/1024/1199/1200/1440/1919/1920/2560 × обе темы.
CSS gap и реальные промежутки совпадают с актуальной матрицей. Для **54
мобильных contexts** на 320/360/390 геометрия секций полностью совпала с
сохранёнными замерами предыдущей правки. Open profile forms, text ×2 на 320
и отсутствие horizontal overflow проверены; JS/Vue warnings/errors нет.

Просмотрены новые screenshots Subscription 1440/light, Profile 768/dark и
Support conversation 2560/light: визуальное разделение секций сохраняется при
более компактном ритме. Артефакты и `results.json` находятся рядом с probe.
Существующие Sail browser tests profile/subscription-payment/support:
**216/216 за 1.3 минуты**, skipped/flaky/unexpected нет. `git diff --check`
проходит. Generated SSR не менялись; прежние незакоммиченные изменения
сохранены. Frontend unit/SSR и backend повторно не запускались для CSS-правки.

Live Pen повторно прочитать не удалось: Pencil сообщил об отсутствии
подключения к desktop app. Основание изменения — сохранённый read-only аудит
и прямое уточнение владельца. Шаг 16 не начинается; commit не создавался.
