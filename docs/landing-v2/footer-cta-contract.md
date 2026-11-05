# Landing V2 — Subscription и Footer

## Источник и границы этапа 08

Live Pen повторно прочитан 2026-11-06: Subscription/Footer всех восьми
ширин 360–2560, master `yRrOg`/`Hir0F`, motion states `C6Rzp`/`wrNMh`.
Прочитан исходный `assets/hero/dudeweb-graphite-wordmark.glsl` без изменения Pen.
Ориентир — белая секция, Plex Sans/Mono, тонкие разделители, двухцветный
заголовок и широкое контурное слово. Новых секций или изображений нет.

Пользователь явно согласовал **юридические подписи без ссылок**: адресов и
страниц документов в проекте нет. «Пользовательское соглашение» и «Политика
конфиденциальности» остаются текстом без href, tabindex и роли ссылки.
Социальных ссылок в source нет. Copyright сохраняется `© 20— dudeweb`.

## Компоненты и данные

- `LandingV2Subscription`: editorial intro, четыре supporting points и композиция
  селектора; props `plans: Array`, `state: ready|empty|unavailable`.
- `LandingV2PeriodSelector`: один план, native radio group 1/3/6/12, суммы и CTA;
  те же props. Доступны только периоды из server props, первая доступная запись
  выбрана по серверному порядку. Нет запроса API при выборе.
- `LandingV2Footer`: логотип, три группы, юридическая строка; footer slot layout,
  `data-v2-menu-background` для существующего overlay contract.
- `LandingV2Wordmark`: нативный SVG text Plex Sans 600, прозрачные внутренние
  области, статичный базовый контур и локальные echoes.
- `useLandingV2Wordmark`: VueUse pointer listeners на надписи, media preferences,
  visibility и reset при scroll/resize; исходное SSR/client состояние статично.

`LandingV2Controller` передаёт существующий `LandingPageData::get()` без изменения
сервиса, запросов, фильтров или старого `/`. Цены только server `priceMinor` RUB;
итого — стоимость периода, `/ мес.` — её деление на months для отображения,
без расчёта скидки. Сумма итого остаётся точной в копейках. Название и реальный
положительный deviceLimit берутся из того же public contract.

CTA ведёт на существующий `/register`, как действующий `LandingPricing`:
регистрация гостя или redirect зарегистрированного пользователя в account.
Выбор периода — локальный просмотр цены, он не создаёт платёж и не передаёт
неподдерживаемые query-параметры в checkout. Оплата и повторный выбор остаются
в существующем защищённом account flow. Пустой/ошибочный каталог показывает
существующие тексты empty/unavailable и реальный support вместо мнимой оплаты.

В Laravel изменён только публичный invokable controller: method injection
готового сервиса. Middleware, service registration, contextual binding и
другую attribute-конфигурацию этот diff не затрагивает. PHP styles — PER-CS 3,
Laravel architecture — существующий service/controller contract.

## Responsive и motion

Subscription: 1 колонка до 1440, затем две равные с общим gap 64/96/144px.
Editorial gap 24px (32 QHD), supporting points 2×2 с gap 20/24px
(36/36 QHD). Панель: tabs 52/60/72px, inset 24/32/40px, gap 24/24/32px,
CTA 48/54/58px. Underline 160ms, crossfade суммы 180ms без изменения высоты.
Reduced motion/forced colors отключают переходы; native radios сохраняют
клавиатурное управление и touch.

Footer: первые две группы рядом на mobile, «Информация» ниже; с 768 три
равные колонки. Gap секции 32/40/56px. Ширина слова равна общему контейнеру;
шрифт не заменяется изображением и не растягивается по одной оси.
Description в нижней строке занимает 420/500/880/1100/1400px при
768/1024/1440/1920/2560; copyright справа с вертикальным центрированием.
Native glyph bounds допускают до 3px hinting-разницы на compact widths;
размер шрифта и пропорции SVG проверяются независимо по source values.
Pointer glow ограничен областью около 260px, три lavender echoes, базовые
буквы неподвижны. Touch, ширины до 1024, reduced motion, forced colors и
скрытая вкладка оставляют статичный контур. Нет RAF, spring или таймера возврата.
Декоративная надпись не получает tabindex; keyboard focus предусмотрен на
реальных ссылках. Все стили ограничены V2 tokens/scoped components.

VueUse 15 API/options и SSR defaults сверены с установленным source и
официальными страницами [useEventListener](https://vueuse.org/core/useeventlistener/),
[useMediaQuery](https://vueuse.org/core/usemediaquery/),
[usePreferredReducedMotion](https://vueuse.org/core/usepreferredreducedmotion/).
Listener cleanup поручен VueUse; media preferences не управляют начальной
структурой SVG. Для `non-scaling-stroke` свойство задано самому text shape,
чтобы тонкий контур не уменьшался вместе с viewBox на mobile.
SVG central baseline центрирует font box как native line-height 1; проверяются
не только ширина и font size, но и ink bounds внутри SVG. Выравнивание через
`text-before-edge` здесь неверно: полный font box Plex составляет около 1.3em
и без компенсации опускает контуры за нижнюю границу source wordmark frame.

## Проверка

Все runtime checks выполнены через Sail, 2026-11-06:

- Client + SSR production build — успешно. Generated `bootstrap/ssr/*` исключены
  из commit; настройки production SSR не менялись.
- Playwright этапов 02–08 — **139/139**. После финального уточнения SVG baseline
  повторены все **24/24** Footer/CTA checks: восемь Pen widths × две theme
  preferences, native periods, точные копейки, отсутствие selection API request,
  настоящий переход к регистрации, keyboard/disabled periods, empty/unavailable,
  реальные href, plain legal captions, menu inert, mouse/touch, reduced motion,
  forced colors, controlled document visibility и промежуточные ширины до 3840.
- Laravel `LandingTest` + `LandingV2Test` — **13 tests / 180 assertions**:
  одинаковые public prices `/` и `/landing`, фильтры, `deviceLimit`, no account
  data, guest/authenticated access, HEAD, registration destination и error state.
- SSR layout unit tests — **2/2**.
- Изолированный renderer из собранного SSR: **6/6** width/theme hydration checks
  (390/1440/2560 × light/dark). Сохраняются реальные server DOM identities
  Subscription, checked radio, Footer, SVG и ранее перенесённых секций; нет
  hydration/JS ошибок. Wordmark изначально статичен; mobile menu инертит footer.
- Старая `/`: **16/16** width/theme samples, шесть областей (header, h1,
  advantages, devices, pricing, footer) полностью совпали с сохранённым baseline.
- `artisan route:list --json` до/после — идентичны; новые routes не добавлены.
- PHP CS Fixer (PER-CS 3), два изменённых PHP-файла — **0 исправлений**.
  PHPDoc, imports и method injection дополнительно проверены по diff.
- `git diff --check` — успешно. Скриншоты Subscription/Footer 390/768/1440/2560
  и pointer state просмотрены; исходные assets и старые public components
  не изменены.

Локальные логи: `/tmp/landing-v2-08-{build,php,format,unit,regression-final,
cta-final,hydration-final,home}.log`. Browser screenshots — ignored
`test-results/landing-v2-footer-cta-*/`; контролируемые SSR/home scripts —
`storage/framework/testing/landing-v2-foundation/`.

Это controlled Chromium/isolated SSR evidence. Физические устройства,
реальная смена вкладки, provider payment, production deploy и общий аудит
этапов 09–12 не заявляются завершёнными.
