# Шаг 6 — Контентные секции лендинга

## Статус

Implementation принят владельцем 2026-10-18 с разрешением commit и перехода
к шагу 7. Полная screenshot comparison и live DOM check новых minimum heights
перенесены в шаг 15 без объявления их пройденными.

Синхронизация checklist в шаге 16, 2026-10-27: эти перенесённые проверки
фактически закрыты в шаге 15 — [public visual audit](../../../docs/audit/pen-public-verification.md)
и подтверждённые minimum heights в
[шаге 15](15-accessibility-responsive-verification.md).
Исторические capture failures ниже сохраняются как история, не текущий статус.

## Цель задачи

Перенести преимущества, платформы, тариф, финальный CTA и footer-content из
Pen, завершив responsive public landing page.

## Зависимости

- Завершён шаг 5.
- Утверждены `U-06`, `U-15`, `U-19`; `U-10` относится к connection в личном кабинете.
- Pen landing frames `A`–`F`, включая 360 validation frame, и UHD dark/light
  `M`/`N` (`j8pJq`/`eM8HW`).

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — visual
  fidelity, component map/data flow и maintainable Tailwind implementation.
- `laravel-best-practices` — только для route/controller, Inertia props,
  Eloquent queries и Feature test concerns этого шага.
- `laravel-13-attribute-refactor` — условно, только при затронутой approved
  attribute-конфигурации и после проверки installed framework source.

## Конкретные действия

- [x] Переписать route page на `<script setup>` и оставить её composition
  surface.
- [x] Вынести feature UI в `LandingAdvantages`, `LandingPlatforms`,
  `LandingPricing`, `LandingFinalCta` и только реально повторяемые child
  components.
- [x] Сохранить Pen copy, порядок секций и visual hierarchy.
- [x] Использовать актуальный section direction: centered editorial intro для
  advantages/platforms, split story/configuration для pricing и `Modern Split`
  final CTA с Razor Loop depth echoes из актуального Pen; не возвращаться к demo SaaS grid.
- [x] Реализовать шесть преимуществ без превращения каждой мелкой части в
  лишнюю generic card abstraction.
- [x] Реализовать platform grid для Windows, macOS, Linux, Android и iOS.
- [x] Показать платформы статичными некликабельными карточками без buttons,
  links, hover/focus actions и инструкций. Не передавать каталог приложений
  или `subscriptionUrl` на landing; инструкции относятся к шагу 10 в кабинете.
- [x] Передавать тариф, периоды, преимущества и цены из Inertia props, если они
  динамические по контракту шага 1.
- [x] Не оставлять `— ₽` как production price; показывать утверждённый
  unavailable/loading state при отсутствии данных.
- [x] Реализовать mobile-first layout по конкретным references: один столбец на
  mobile, responsive rows на tablet/desktop, UHD content width `1840 px`; не
  превращать wide advantages в один случайный six-column ряд, если Pen задаёт
  две строки по три cards.
- [x] Сохранить section anchors и scroll-margin под header.
- [x] Подключить CTA destinations без placeholder links.
- [x] Не добавлять footer agreement/privacy links до решения `U-28`; после
  утверждения реализовать routes/content отдельным согласованным scope.
- [x] Проверить text wrapping на 320/360 px, удвоенный размер текста и
  emulated 200%/400% effective CSS viewport; overflow 0 после restart Browser.
- [x] Добавить Inertia Feature test для `/`, props и public availability.

## Критерии готовности

- Лендинг визуально соответствует dark/light Pen frames.
- 360 validation layout не имеет horizontal overflow или clipping.
- Pricing отображает реальные server-provided данные или честный error state.
- CTA и links выполняют подтверждённые действия.
- Page component не содержит самостоятельную сложную business/state logic.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Landing
./vendor/bin/sail npm run build
rg -n "— ₽|to=\"#\"|href=\"#\"" resources/js
git diff --check
```

## Сценарии проверки

- Viewport: 320, 360, 390, 768, 1024, 1440 и 2560; 2560 сравнивается напрямую
  с `j8pJq`/`eM8HW`.
- Light/dark theme и hard reload.
- Pricing data: success, empty, unavailable.
- Long translated/server text: wrapping без обрезки.
- Anchor navigation с клавиатуры и back/forward history.


## Implementation contract — 2026-10-17

Шаг 5 закрыт commit `2f84db6`; шаг 6 разрешён владельцем. Новая read-only
сверка Pen A/D/E/M/N подтвердила преимущества 1/2/3 columns (UHD — 2 rows × 3),
platforms 2 columns с последним iOS на всю строку до desktop и 5 columns после,
pricing story/configuration split. Final CTA теперь использует Razor Loop
с depth echoes; прежнее указание Signal Orbit в этом пункте superseded source.

Design foundation: Night/Paper `#0A0A0B/#FBF9F4`, section `#111113/#F4F0E8`,
feature surface `#14161E/#FFFEFA`, feature border `#383D53/#DDD6CA`, icon tile
`#252A44/#ECEEFC`, tile border `#3E466F/#C8CAF0`. IBM Plex Sans/Mono сохраняются.
Semantic landing tokens добавляются в CSS-first @theme. На UHD content width
1840 px (gutter 360), desktop 1280 px (gutter 80); interpolation fluid.
Section headings normal weight как raw 650 в принятом Pen renderer; pricing
и final CTA — bold 700. Cards не получают лишних shadows или animations.

Component map:

- Public/Home — thin Inertia composition, только props/layout/section assembly.
- LandingAdvantages — шесть marketing features; device-limit copy из props.
- LandingPlatforms — статичный список пяти поддерживаемых платформ;
  только labels/icons, без props, интерактивности, app links и инструкций.
- LandingPricing — controlled period selection из server product IDs; полная
  цена выбранного периода `priceMinor / 100` и его months отображаются только
  над переключателем периода. Деления на months и строки «Итого» над CTA нет;
  empty/unavailable states сохраняются.
- LandingFinalCta — content и статичный responsive Razor Loop visual из Pen;
  никакой новой ambient motion без отдельного решения.
- LandingPageData — active unlimited plan/products/advantages и явные safe
  scalar props; ошибки query показывают unavailable, без фиктивных цен.

Согласно уточнению владельца, landing не загружает каталог Remnawave и не
передаёт `platforms[]`, apps, download URLs или connection instructions.
`PlatformCatalog` и `resources/data/platforms.json` удалены. Пять названий и
иконки — статичный display content компонента. Каталог приложений и инструкции
реализуются отдельно для authenticated connection flow в шаге 10.

U-06: новая nullable Product.months migration с deterministic backfill только
для четырёх известных seed labels 1/3/6/12; неизвестные products остаются без
web-price до явной настройки. Telegram/payment contracts не меняются. Price
остаётся integer minor units, currency RUB. По уточнению владельца сверху
показывается полная стоимость выбранного периода: `600 ₽ / 3 мес.`, а не
стоимость одного месяца. Лишняя строка «Итого» над кнопкой удалена; amount
покупки остаётся исходным server price. В feature tests покрываются
active/inactive, unknown period,
empty/unavailable и отсутствие connection catalogue в public props.

## Проверка implementation — 2026-10-17

- [x] Route `home` / Inertia `Public/Home`, thin controller/service и focused
  Vue feature components реализованы. Demo App.vue удалён.
- [x] 46 Hero SVG и принятую композицию Hero не меняли; PNG не возвращены.
- [x] Платформы — некликабельные list items. Backend catalogue, его JSON,
  раскрытие инструкций, download links и platform props удалены с landing.
  Персональный subscription URL не передаётся anonymous visitor.
- [x] Product.months добавлен новой nullable migration с backfill известных
  seed labels; factory/seeder и MoonShine period selector обновлены. Неизвестные
  периоды и nonpositive/inactive prices не публикуются. Payment/Telegram
  business behavior и старый resolver не менялись.
- [x] Landing Feature tests: 5 tests / 77 assertions, без failures; public,
  active/inactive/unknown periods, empty, query failure/unavailable и отсутствие
  connection catalogue в public props.
- [x] Полный Laravel suite: 121 tests / 629 assertions, без failures.
  PHPUnit помечает 110 tests deprecated из-за существующего
  `PDO::MYSQL_ATTR_SSL_CA` в `config/database.php:62`; 11 tests passed без
  этого предупреждения. Это не чистый warning-free suite; config не менялся.
- [x] Все 25 Node Hero tests в Sail; client/SSR production build.
- [x] PHP CS Fixer по 11 затронутым PHP files, затем 0 changes;
  `git diff --check` и placeholder/demo searches проходят.
- [x] Light/dark live DOM: 320/360/390/768/1024/1440/2560; overflow 0,
  шесть feature cards в 1/2/3 columns, ни один CTA/control не переполнен,
  один h1, section anchors и темы корректны. На UHD platforms/pricing/final
  heights 640/800/720 px, matching Pen endpoints. Desktop scrollbar 15 px
  уменьшает actual content width относительно reference canvas.
- [x] Browser DOM interaction: radio переключается с 1 на 6 месяцев,
  меняет полную цену выбранного периода (6 месяцев — 1000 RUB). Platform interaction
  из первоначальной реализации удалён по новому решению владельца.
- [x] Визуальная screenshot comparison с Pen на пяти widths в обеих темах:
  закрыта последующей проверкой шага 15, см. public visual audit выше.
- [x] После restart: native keyboard ArrowRight для period radio, Enter для
  header section link; history back/forward. Platform button удалён.
- [x] Text-only font-size ×2 на новых секциях: overflow 0, CTA не обрезаны.
  Effective 200%/400% emulation: CSS viewport 720/360 при DPR 2/4, overflow 0.
  Это эмуляция CSS viewport, не native browser zoom control.

Capture нового лендинга через native CDP `Page.captureScreenshot` завершился
30s timeout; последующие Browser команды возвращают `A capture is already
running`. Поэтому zoom/media/native checks после capture не выполнялись и
не заявляются пройденными. Новые sections пока не имеют visual sign-off;
шаг 6 остаётся открытым, commit шага 6 и переход к шагу 7 не выполняются.

Высоты секций могут расти относительно Pen, чтобы показывать реальные benefits
из БД и более длинные тексты без clipping. Final CTA пока статичный; ambient
metadata не переносилась. Точная
visual оценка и решение по дополнительной final-CTA motion остаются review.

Среда: `artisan migrate` в dev Sail применил новую months migration, а также
две ранее pending migrations `2026_10_12_211624_add_application_state_to_referral_rewards_table`
и `2026_10_12_214902_remove_is_free_from_users_table`. Это изменение dev schema;
код прежних migrations не менялся, production migration не запускалась.
Generated SSR artifacts после build исключены; исходный Pen не изменён.

## Уточнение проверки после restart Browser

Владелец перезапустил Browser. Page стала visible; native keyboard события
доставляются. Проверены ArrowRight → период 3 месяца / итого 600 RUB,
Enter → `#advantages` (target top 95.98 px при header 96 px),
history back → пустой hash, forward → `#advantages`. Все probes очищены.
Удвоение шрифтов новых sections дало overflow 0. Effective zoom 200%/400%
эмулирован CSS viewport 720/360 и DPR 2/4: overflow 0, controls не обрезаны.
Forced colors скрывает final SVG; reduced-motion media распознаётся. Число
`document.getAnimations()` не равно нулю из-за существующих UI transitions;
warning-free reduced-motion audit всей страницы остаётся задачей шага 14.

Native CDP screenshot 390 px получен и просмотрен: advantages intro/cards
согласованы с mobile reference. Desktop capture 1440 px содержит повторяющийся
вертикальный tile после 1142 px, поэтому не является корректным visual proof.
Повторный reduced-scale capture снова завершился 30s timeout. Полная пятиширинная
light/dark screenshot comparison остаётся открытой; шаг 6 не закрыт.
Перенесённый native SVG hover/drag/ambient sign-off шага 5 также не закрыт:
доступных live samples недостаточно для подтверждения всей capture/inertia цепочки.

## Уточнение владельца — статичные платформы, 2026-10-17

Секция платформ на главной — только пять некликабельных карточек. Нажатия,
раскрытие инструкций и download actions удалены вместе с сервисом каталога,
JSON snapshot и prop `platforms`. Инструкции подключения относятся к личному
кабинету и шагу 10; здесь их реализация не начинается. Прежнее распространение
`U-10` на landing отменено. Новая regression-проверка подтверждает отсутствие
каталога и connection data в public response. Landing tests: 5 / 77 assertions,
без failures; существующий PDO deprecation остаётся. Client/SSR build и
PHP CS Fixer по двум затронутым PHP files проходят. Шаг 6 остаётся открытым.

## Уточнение владельца — цена выбранного периода, 2026-10-17

Владелец подтвердил полную стоимость выбранного периода над переключателем:
1/3/6/12 месяцев используют соответствующий server `priceMinor / 100`, без
деления на months. На dev data это `200 / 600 / 1000 / 2000 ₽`. Строка «Итого»
над CTA удалена; единственная price live-region обновляет сумму и период вместе.
На mobile `<768 px` цена всегда стоит отдельной строкой под «Выбери период»,
чтобы переключение 1/3/6/12 месяцев не меняло высоту заголовка и положение
переключателя. На 320 px font-size цены 28 px, от 360 px — 30 px; tablet и
desktop сохраняют горизонтальный header. Проверены все периоды на
320/360/390/767/768/1440/2560 в обеих темах: смещение переключателя между
периодами 0 px, overflow 0. Пять component tests и client/SSR build проходят.
Копейки сохраняются, целые суммы отображаются без обязательных `,00`.
Галочка преимуществ использует полный check path и SVG 20 px вместо маленького
контура в SVG 16 px; плитка остаётся 28 px. Это явное уточнение Pen-размеров.

Проверка: 5 Node component regression tests в Sail проходят — все периоды,
копейки, обновление server products, empty/unavailable. Client/SSR build и
`git diff --check` проходят. Browser CDP: mouse → 3 месяца / 600 ₽, ArrowRight
→ 6 месяцев / 1000 ₽ с focus emulation. DOM clicks для всех четырёх периодов
на 320/360/390/768/1440/2560 в обеих темах корректны; 2560 проверен при высоте
1440. Дополнительной строки цены нет; overflow 0, в том числе при font-size
цены ×2. Полная screenshot matrix шага 6 остаётся открытой.

## Продолжение проверки — 2026-10-18

Checkout `pen-integration` начат с чистого worktree на `f9baf93`, уже содержащем
implementation шага 6. Проверен актуальный открытый Pen без mutations.
Размеры секции платформ в source — `649/649/630/536/649 px` на
`360/390/768/1440/2560`. Прежние minimum height tokens задавали
`616/616/600/528/640 px`; live DOM до исправления вернул
`645.84/645.84/629.88/535.03/642.42 px` без horizontal overflow.
Tokens исправлены по source; desktop `536 -> 649 px` интерполируется плавно
между `1440` и `2560`. Предыдущая запись о Pen endpoint `640 px` superseded
этой сверкой. Min-height позволяет секции расти при увеличении текста.

- [x] Sail Landing Feature tests: `5 tests / 77 assertions`, failures нет;
  остаётся существующий deprecation `PDO::MYSQL_ATTR_SSL_CA`.
- [x] Sail pricing component tests: `5/5`.
- [x] Sail client/SSR production build после исправления размеров.
  Generated SSR files не изменились.
- [x] Placeholder search не нашёл `— ₽`, `to="#"` или `href="#"`;
  `git diff --check` проходит.
- [x] Live DOM проверка новых minimum heights после загрузки новой сборки:
  подтверждена в шаге 15 на 360/390/768/1440/2560, обе темы, tolerance 0.02 px.
- [x] Полная screenshot comparison на пяти ширинах в обеих темах:
  закрыта public visual audit шага 15, включая явно inferred light cases.

`return-screenshot` для отдельной секции и прямой CDP capture видимой области
завершились timeout. После перезапуска Browser владельцем повторён native
capture на `390×844`; он также завершился timeout, после чего даже
`Runtime.evaluate` возвращает `A capture is already running`. Успешного live
снимка в этой проверке нет; source Pen screenshots не заменяют live comparison.
Новые minimum heights собраны, но повторный live DOM check заблокирован capture.
На момент этой проверки шаг 6 оставался открытым. Последующим решением
владелец разрешил commit и переход к шагу 7; две непроверенные позиции выше
перенесены в шаг 15 и остаются открытыми до фактического выполнения.
