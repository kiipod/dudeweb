# Перенос дизайна dudeweb из Pen

## Статус

План подготовлен по результатам read-only аудита Pen-документа 2026-10-11,
актуализирован по Pen и checkout 2026-10-13 и закрыт по frontend/backend
контрактам шага 1 решениями владельца 2026-10-14. Повторный read-only аудит
2026-10-15 зафиксировал новую landing-редакцию: Signal Orbit Hero,
два самостоятельных Pen reference на `2560×1440`, новые responsive shell
метрики и удаление scroll-storyboard/отдельных fallback boards. Design
foundation шага 2 и shared UI components шага 3 актуализированы; public shell
шага 4 и статичный Hero шага 5 реализованы и собраны. По решению владельца
2026-10-16 ambient-анимация удалена; WQHD source — light frame `N`.
Pen Browser WQHD live check подтверждает geometry и отсутствие анимации; полная five-width/light-dark
matrix остаётся открытой. Шаг 6 не начат. Исходные макеты Pen не изменялись.

## Цель

Последовательно перенести дизайн из открытого документа `dudeweb.pen` в
существующий Laravel + Inertia + Vue проект, сохранив текущую архитектуру,
mobile-first подход и существующие бизнес-контракты.

План охватывает:

- публичный лендинг;
- статичный Signal Orbit Hero как основной Hero contract;
- выбранный logo/lockup contract из Pen logo-system boards;
- светлую и тёмную темы;
- аутентификацию и восстановление доступа;
- личный кабинет, подписку и оплату;
- подключение устройств, реферальный раздел с отдельной страницей условий,
  поддержку и профиль;
- адаптивные Pen-варианты 360, 390, 768, 1440 и 2560 px;
- состояния `default`, `hover`, `focus`, `active`, `disabled`, `loading`,
  `error` и `success`;
- доступность, reduced motion и визуальную сверку с Pen.

## Источники истины и приоритеты

1. Открытый Pen-документ `dudeweb.pen` — визуальная композиция, тексты,
   размеры референсных viewport, компоненты, цвета, типографика и motion spec.
2. Фактический код, schema и установленные версии зависимостей — доступная
   бизнес-логика, маршруты, данные и технические ограничения.
3. `AGENTS.md` — архитектурные и процессные правила проекта.
4. `docs/audit/skills/README.md` и `docs/audit/skills/inventory.md` — текущая
   карта выбора и применимости project-level skills.
5. Неподтверждённые детали не реализуются предположительно: они фиксируются как
   `Needs review` в разделе «Неопределённости».

Последнее явно принятое владельцем решение имеет приоритет над прежним motion
contract. Hero больше не использует scroll-driven последовательность: весь
заголовок `Любимые сервисы снова рядом` виден сразу. Последнее решение
владельца 2026-10-16 отменяет CSS morph: Signal Orbit полностью статичен.

## Результат аудита Pen

### Документ и состав

- Документ: `dudeweb.pen`.
- Верхнеуровневых фреймов: 137.
- Формальных reusable-компонентов: 10.
- Variables: 19.
- Структурных layout-проблем: 0; пять `partially clipped` diagnostics относятся
  к намеренно выходящему за bounds декоративному `Morphing Color Blob` в
  tablet/desktop/UHD Hero и проверяются визуально.

Группы фреймов:

| Группа | Количество | Содержание |
| --- | ---: | --- |
| Лендинг и спецификации | 13 | mobile/light/dark, 360 validation, tablet, desktop, 2560 dark/light, menu-open, states, design system |
| Logo-system boards | 2 | SVG concepts и icon/horizontal/stacked lockups |
| Account boards | 4 | dark/light components и account/checkout states |
| Mobile account | 40 | 20 экранов в dark и light, включая условия реферальной программы |
| Tablet account | 40 | 20 экранов в dark и light, включая открытые `Ещё`, промокод и условия реферальной программы |
| Desktop account | 38 | 19 экранов в dark и light, включая promo dialog и условия реферальной программы |

Повторный аудит зафиксировал дельту `122 -> 136` без Pencil mutations:

| Новые фреймы | ID | Роль в реализации |
| --- | --- | --- |
| `J1`–`J6 · Static Hero` | `blWdJ`, `HbqLE`, `Y7YcIU`, `AUHPH`, `IPo8p`, `C2C5YY` | visual-only reference для статического Hero на 360/390/768/1440 |
| `K · Logo Concepts · SVG` | `ODHOo` | visual-only выбор направления logo |
| `L · Logo Lockup Variants` | `hc0K9` | visual-only выбор icon/horizontal/stacked lockup |
| `K2 · Account Dashboard · Tablet · More Open` | `VcLN4`, `mlxDX` | route-state dashboard, dark/light |
| `L2 · Subscription · Promo Open · Tablet` | `n9UuR`, `Nn7dT` | route-state subscription, dark/light |
| `L2 · Subscription · Promo Open · Desktop` | `jodkF`, `k4r5Hy` | route-state subscription, dark/light |

Logo boards и Static Hero не создают самостоятельные routes. `K2`/`L2` —
визуальные состояния существующих account routes, а не отдельные страницы.

Предыдущий read-only аудит зафиксировал дельту `136 -> 142` без Pencil
mutations:

| Новые фреймы | ID | Роль в реализации |
| --- | --- | --- |
| `Q2 · Referral Terms · Mobile` | `paZk6`, `LNwLW` | самостоятельная read-only account page, dark/light |
| `Q2 · Referral Terms · Tablet` | `BYL5v`, `hhNkq` | та же page в tablet shell, dark/light |
| `Q2 · Referral Terms · Desktop` | `jSIgm`, `Uel2T` | та же page в desktop shell, dark/light |

`Q2` связан с основным `Q · Referral` явной ссылкой «Условия партнёрской
программы» и обратным действием «Назад к приглашениям». Поэтому это новый
route/page внутри referral flow, а не visual-only state. Утверждены path
`/account/referral/terms` и route name `account.referral.terms`.

Повторный read-only аудит 2026-10-15 зафиксировал дельту `142 -> 137`:

| Изменение | ID | Роль в реализации |
| --- | --- | --- |
| Удалён `G · Hero Motion Storyboard` | прежний storyboard | scroll/pinning contract отменён |
| Удалены `J1`–`J6 · Static Hero` | `blWdJ`, `HbqLE`, `Y7YcIU`, `AUHPH`, `IPo8p`, `C2C5YY` | отдельные fallback references больше не являются source |
| Добавлен `M · Desktop UHD Dark · 2560×1440` | `j8pJq` | полноценный dark landing reference |
| Добавлен `N · Desktop UHD Light · 2560×1440` | `eM8HW` | полноценный light landing reference |

Hero теперь встроен как `2 · Static Hero · Signal Orbit` во все landing frames.
Reusable count и variables не изменились. Pencil mutations не выполнялись.

Референсные размеры:

- small mobile: `360 px`;
- mobile: `390 px`;
- tablet: `768 px`;
- desktop: `1440 px`.
- UHD desktop: `2560 px` (`j8pJq`/`eM8HW`).

Это контрольные viewport, а не отдельные CSS breakpoint сами по себе. CSS
boundaries остаются mobile `<768`, tablet `768–1199`, desktop `>=1200`, wide
`>=1600`; reading/form/account containers не растягиваются вместе с public
landing grid.

### Уникальные пользовательские потоки

- Лендинг: header, Hero, преимущества, платформы, тариф, финальный CTA, footer.
- Mobile menu: dark/light и открытое состояние.
- Account dashboard: default и открытый `Ещё` на mobile/tablet.
- Подписка: default, mobile/tablet promo sheet и desktop promo dialog.
- Auth: login, registration, recovery, reset-link-sent, new password,
  password-changed.
- Подключение: Windows, macOS, Linux, Android, iOS и три шага настройки.
- Referral: ссылка, share/copy, показатели, empty state и отдельная страница
  условий программы.
- Support: список обращений, новое обращение, диалог.
- Profile: данные аккаунта, безопасность, theme selector, logout.
- Payment: pending, success, failure.
- Account states: trial, active, expiring, expired, limited, loading,
  service error, discount applied.

### Static Signal Orbit Hero

Новая редакция удаляет storyboard и fallback-разделение. Основным и
единственным Hero является `2 · Static Hero · Signal Orbit`:

- eyebrow `HEY, DUDE!`;
- заголовок `Любимые сервисы\nснова рядом` виден сразу;
- описание `dudeweb помогает пользоваться любимыми сервисами для работы,
  развлечений и общения — просто и без лишних сложностей.`;
- CTA `Попробовать бесплатно` и `Посмотреть тариф`;
- строка `3 дня бесплатно · До 5 устройств`;
- точная path geometry Signal Orbit:
  `M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z`
  с `viewBox 0 0 300 300`;
- dark mesh palette `#665BE8/#B441B0/#E87950/#566ED8` при opacity `0.48`,
  light palette `#858FF3/#D982C9/#F09A6F/#8EA3F4` при opacity
  `0.38/0.42/0.44` на mobile/desktop/UHD (повторная сверка Pen 2026-10-16);
- heading scale `38/42/54/76/108 px` на `360/390/768/1440/2560`;
- Hero heights `560/560/800/984/1328 px` на тех же references. На desktop
  `Header + Hero` занимают один reference viewport: `96 + 984 = 1080 px` и
  `112 + 1328 = 1440 px`. Последнее решение владельца: header и Hero должны
  целиком помещаться в один экран. Поэтому desktop Hero имеет точную высоту
  `100dvh - header`, без fixed/min-height от Pen. Учитывается фактическая
  область браузера, которая может быть ниже физического разрешения монитора.
- На desktop/WQHD/UHD текстово-кнопочная Hero-группа центрируется относительно
  полного viewport, а не только области под header: fluid offset равен половине
  текущей высоты header (`48 px` на `1440`, `56 px` на `2560`). Это принятое
  owner correction к буквальному вертикальному положению группы в Pen. Content
  вертикально позиционируется независимо от grid-row декоративного Signal Orbit:
  увеличение SVG на WQHD не должно влиять на центр текста и actions.
- Pen geometry Signal Orbit `861×830 px` на desktop / `1536×1246 px` на
  WQHD служит исходной геометрией и верхней границей размера. Последнее решение
  владельца требует вписать SVG внутрь Hero, сохраняя его пропорции и overlap
  описания. После удаления анимации используется статичный reference `N`:
  при `2560×1440` SVG `1536×1246 px`, top `38 px`, bottom `44 px` внутри Hero.
  Эти отступы ограничивают доступную высоту; в низком окне обе стороны SVG
  масштабируются одним aspect ratio. Запас под morph удалён.
  Горизонтальный anchor под текстовой колонкой сохраняется.
  SVG не участвует в flow и не перехватывает pointer events. Секция использует
  `overflow: hidden` как защиту. Прежние fixed-height / overflow-visible
  corrections отменены.

Hero не pinned и не зависит от scroll progress. SVG использует исходный
статичный path из Pen во всех motion preferences. CSS morph, keyframes,
scale/rotation и animation duration/easing tokens удалены. Metadata ambient
motion в Pen не используется после прямого решения владельца вернуть статику.

Desktop geometry между `1440` и `2560` интерполируется плавно. Wide breakpoint
не должен скачком включать `1800 px` grid внутри viewport около `1600 px`:
container, обе колонки, typography и shell gutter остаются fluid и достигают
точных Pen-значений только на reference endpoints; ширина, высота и смещение
signal также плавно интерполируются между Pen references. Четыре угловых mesh
цвета смешиваются двумя horizontal gradients и vertical alpha mask.

### Токены и типографика

Pen предоставляет 19 variables:

- dark: `bg #0A0A0B`, `surface #14151B`, `elevated #1B1D27`,
  `text #F5F5F6`, `secondary #A1A1AA`, `muted #8B8B98`,
  `border #34384A`;
- semantic: `accent #8E9BFF`, `success #56D6AE`;
- account light: `bg #FBF9F4`, `surface #F8F5EE`, `elevated #F4F0E8`,
  `text #24211D`, `secondary #625C54`, `muted #7A7268`,
  `border #DED8CC`;
- fonts: `IBM Plex Sans` и `IBM Plex Mono`.

В Mini Design System также зафиксированы:

- spacing scale: `4, 8, 12, 16, 24, 32, 48, 64`;
- частые radius: `8, 10, 11, 12, 14, 16, 18`;
- UI motion: `150-250ms`;
- Hero статичен; ambient autoplay не используется;
- карточки: нейтральная поверхность, тонкая граница, без тяжёлой тени.

Часть light-цветов и state-цветов записана в Pen напрямую, а не variables.
Шаг 2 должен составить полную semantic token map без потери значений.

### Reusable-компоненты Pen

| ID | Название |
| --- | --- |
| `AJ40x` | Account Top Header |
| `c6NUQr` | Account Bottom Navigation |
| `sDedj` | Status Badge · Active |
| `l86vnd` | Copyable Link |
| `Lbab2` | Primary Action |
| `eSkQx` | Inline Alert |
| `e9Cb0` | Subscription Period Selector |
| `k6KWf` | Subscription Summary |
| `Vxu7B` | Account More Navigation Sheet |
| `LI7B7` | Account Promo Code Sheet |

`Vxu7B` и `LI7B7` добавлены после первого аудита. `Vxu7B` пока не используется
как `ref`, а `LI7B7` используется двумя dark responsive instances; часть light
и responsive variants собрана обычными frames. Поэтому implementation contract
выводится из всех instances/states, а не только из formal component.

### Responsive overlay contract

- mobile `Ещё`: bottom sheet `390 x 372`, на всю ширину viewport;
- tablet `Ещё`: bottom sheet `520 x 372`, центрированный по горизонтали;
- mobile promo: bottom sheet `390 x 354`;
- tablet promo: bottom sheet `520 x 354`, центрированный по горизонтали;
- desktop promo: dialog `500 x 354` с radius `24`, центрированный в main area;
- tablet/mobile backdrops начинаются под account header, desktop promo backdrop
  визуально покрывает main area после sidebar.

Focus/inert/scroll-lock semantics не выводятся только из визуальной геометрии;
они подтверждаются в `U-20` и реализуются доступным modal contract.

### Referral terms contract

Новые `Q2` frames задают одинаковый content contract для 390/768/1440 и обеих
тем:

- заголовок `Партнёрская программа` и описание
  `Условия для участия простые.`;
- бонус другу: `30% на первую покупку подписки`;
- четыре последовательных шага: приглашение, оформление подписки, успешная
  оплата и начисление бонуса пригласившему;
- reward matrix: `1 месяц -> +7 дней`, `3 месяца -> +14 дней`,
  `6 месяцев -> +21 день`, `12 месяцев -> +30 дней`;
- mobile/tablet сохраняют active section `Ещё`, desktop — active sidebar item
  `Пригласить друга`.

Эти значения совпадают с текущими `PromocodeService`, `ReferralService`,
`ReferralBonus` seed data и durable reward flow: приглашённый получает
одноразовую скидку на первую успешную оплату, а referrer — отдельный reward за
каждую успешную оплату. Однако Vue не должен копировать проценты и матрицу как
самостоятельные бизнес-правила. Page получает live server-confirmed values и
явную content version по утверждённому `U-27`.

Не каждый повторяющийся паттерн оформлен в Pen как formal component. При
реализации повторяемые shell, auth, state и navigation patterns должны стать
небольшими focused Vue-компонентами с явными props/emits contracts.

## Результат аудита репозитория

### Фактический стек

- PHP `8.5`, Laravel `13.34.0`.
- `inertiajs/inertia-laravel 3.5.1`.
- `@inertiajs/vue3 3.9.1` и `@inertiajs/vite 3.9.1`.
- Vue `3.5.44`.
- Tailwind CSS и `@tailwindcss/vite 4.3.3`.
- Vite `8.3.4`.
- JavaScript stack; TypeScript в текущем frontend не настроен.

### Текущее frontend-состояние

- Единственная Inertia page: `../../../resources/js/pages`.
- Страница является demo-заглушкой и использует `<script setup>`.
- `AppLayout.vue` использует семантические `header`, `nav` и `footer`, но
  содержит временные links к секциям demo-страницы.
- `app.css` содержит только импорт Tailwind; design tokens, fonts, breakpoints
  и custom utilities отсутствуют.
- Отдельная UI component library, включая Nuxt UI, не установлена; UI
  primitives должны быть локальными Vue-компонентами или семантическим HTML.
- SSR dependencies и build script присутствуют, но operational entrypoint и
  способ запуска должны быть подтверждены в `U-22`.
- IBM Plex assets в проекте отсутствуют.
- Frontend lint, unit, component и E2E test scripts отсутствуют.

### Текущие HTTP-контракты

Доступно пять application routes:

- `GET /` — Inertia `App`;
- `POST /payments` — JSON creation endpoint, `auth:web`;
- `GET /payments/return` — проверяет подписанный token, сейчас возвращает
  plain response для web payment;
- `POST /webhooks/yookassa` — provider webhook.
- `GET /test` — незакрытый диагностический Remnawave route с `dd()`; он не
  является частью целевого web UI contract и должен быть отдельно удалён либо
  ограничен до публикации account routes.

Web login/register/logout/password routes и Inertia routes личного кабинета
отсутствуют.

### Доступная доменная база

- `Plan`, `Product`, `Advantage` и связи могут дать тариф и преимущества.
- `Payment` и существующий payment service покрывают создание и lifecycle
  YooKassa payment.
- `User`, `ReferralReward`, `ReferralBonus` и referrals relation дают часть
  referral-данных.
- Remnawave handlers дают subscription URL, remote expiration/status и HWID
  devices, но web-facing orchestration отсутствует.
- Support ticket model/service/routes отсутствуют; текущая Telegram-поддержка
  ведёт на внешний Telegram URL.

### Критические расхождения

- Pen auth/profile используют email и password, а таблица `users` хранит
  обязательные Telegram `username`/`chat_id` и не содержит email/password;
  standalone web user при текущей schema создать нельзя.
- `web` guard объявлен, но web-auth flow не реализован.
- Remnawave lookup/lifecycle сейчас связывает local и remote user по Telegram
  `chat_id` либо `username`. Для web-only users отсутствуют stable remote key и
  provisioning flow.
- Pen содержит support tickets и conversation, которых нет в домене.
- Pen показывает web referral URL, текущая логика генерирует Telegram bot link.
- Pen referral terms содержат точные discount/reward значения; они совпадают с
  текущими seed/service rules, но в backend пока нет единого versioned contract
  для публикации условий в web UI.
- Pen payment pages предполагают live status UI; текущий return endpoint
  возвращает текст и не предоставляет Inertia status props.
- Local snapshot `tailwind-4-docs` не инициализирован; точный Tailwind API,
  выходящий за уже используемые возможности, отмечается `Needs review`.

## Обязательный skill contract

Перед началом каждого шага агент повторно определяет применимые skills по
фактическому scope этого шага. Наличие каталога или вывод `npx skills list` не
означают, что skill выбран автоматически.

Порядок работы со skills:

1. Проверить актуальные `AGENTS.md`, `docs/audit/skills/README.md`, inventory и
   при необходимости `npx skills list`.
2. До изменений явно объявить выбранные skills и причину выбора каждого.
3. Полностью прочитать `SKILL.md` каждого выбранного skill и только необходимые
   references/scripts по его routing instructions.
4. Применять project-specific ограничения поверх generic guidance: npm,
   JavaScript + `<script setup>`, FormRequest, CSS-first `@theme`.
5. Неподтверждённый API или конфликт фиксировать как `Needs review`, а не
   заменять предположительной реализацией.

Матрица выбора:

| Concern шага | Обязательные skills | Что они контролируют |
| --- | --- | --- |
| Новый UI, перенос или заметная visual/UX правка | `frontend-design` | Design intent, типографика, layout, motion restraint и визуальная критика против Pen |
| Любые Vue, `.vue`, Vue Router или Vite-with-Vue изменения | `vue-best-practices` | Component map, `<script setup>`, data flow, reactivity, composables и optional references по фактическому поведению |
| Tailwind classes, tokens, CSS-first config, review или cleanup | `tailwind-best-practices` | Semantic tokens, короткие упорядоченные class lists, fixed variant maps и отказ от `@apply` как component architecture |
| Laravel backend architecture, routes, validation, security, queries или errors | `laravel-best-practices` | Thin controllers, FormRequests, policies, services/actions, Eloquent/query behavior, external boundaries и error handling |
| Разрешённая Laravel 13 attribute-конфигурация в затронутом component | `laravel-13-attribute-refactor` | Только approved attribute matrix после проверки class, target, constructor и framework integration в установленном source |
| Точный Tailwind v4 API/config/migration | `tailwind-4-docs` только с актуальным snapshot | Version-specific API; инициализация snapshot — отдельная задача с явным разрешением |

Для `vue-best-practices` перед Vue implementation всегда читаются core
references `reactivity.md`, `sfc.md`, `component-data-flow.md` и
`composables.md`. Slots, fallthrough attrs, Teleport, Transition и animation
references читаются только в шагах, где соответствующее поведение реально
нужно. Проект остаётся на JavaScript: TypeScript-примеры skill адаптируются к
явным runtime `defineProps`/`defineEmits` contracts.

Для `laravel-best-practices` перед backend implementation выбираются и читаются
только rule-файлы, соответствующие затронутым concerns. Проектное требование
FormRequest имеет приоритет над допустимой в generic guidance inline
validation. `laravel-13-attribute-refactor` выбирается независимо и не является
причиной расширять scope до несвязанной attribute-миграции.

Отсутствие готовых semantic `@theme` tokens и shared component layer не
блокирует этот первичный перенос: шаг 2 создаёт token foundation, шаг 3 —
component foundation, и только затем реализуются screens. React-примеры из
`tailwind-best-practices` не копируются: не добавляются `clsx`,
`tailwind-merge`, JS config или formatter plugins; variants реализуются явной
Vue map со статическими Tailwind class strings.

## Целевая архитектура

```text
Laravel route/controller/FormRequest
        |
        v
Inertia page props + redirects/errors
        |
        v
Thin route page (composition surface)
        |
        +--> feature components
        +--> shared UI components
        +--> focused composables for local interaction/motion
        |
        v
Semantic Vue components + Tailwind 4 design tokens
```

Правила:

- не создавать отдельный REST API для данных, которые естественно передать
  через Inertia props;
- сохранить существующий JSON payment endpoint до отдельного решения о его
  контракте;
- `Request`/`FormRequest` остаются action-scoped, сервисы поведения controller
  внедряются через constructor;
- страницы остаются composition surfaces;
- props идут вниз, события вверх;
- локальные interaction/motion concerns выносятся в `useXxx()` composables;
- JavaScript stack сохраняется, самовольной миграции на TypeScript нет;
- интерактивные primitives реализуются через семантический HTML и focused
  Vue-компоненты без скрытых library contracts;
- Tailwind остаётся CSS-first через `@theme`.

## Порядок выполнения

Шаги выполняются последовательно:

1. [x] [Контракты и фиксация источников](01-source-and-contract-audit.md)
2. [x] [Design foundation и tokens](02-design-foundation.md)
3. [x] [Переиспользуемые UI-компоненты](03-shared-ui-components.md)
4. [ ] [Публичный shell и навигация](04-public-shell-navigation.md) — current
   UHD implementation/build готовы, browser matrix открыта
5. [ ] [Static Signal Orbit Hero](05-static-hero.md) — implementation/build
   готовы, browser matrix открыта
6. [ ] [Остальные секции лендинга](06-landing-content.md)
7. [ ] [Auth и password flows](07-authentication-flows.md)
8. [ ] [Account shell и dashboard](08-account-shell-dashboard.md)
9. [ ] [Подписка и оплата](09-subscription-payment.md)
10. [ ] [Подключение устройств](10-connection.md)
11. [ ] [Реферальный раздел](11-referral.md)
12. [ ] [Поддержка](12-support.md)
13. [ ] [Профиль](13-profile.md)
14. [ ] [Состояния, overlays и motion hardening](14-cross-cutting-states-motion.md)
15. [ ] [Адаптивность и доступность](15-accessibility-responsive-verification.md)
16. [ ] [Финальная проверка](16-final-verification.md)

После каждого шага:

1. выполнить блок **Проверка**;
2. отметить выполненные микрозадачи;
3. обновить статус шага в этом файле;
4. выполнить указанный Commit.

Не переходить к следующему шагу, пока текущий не прошёл проверку.

Зависимость линейная: шаг `N` начинается только после успешной проверки,
фиксации результатов и Commit шага `N-1`. Если шаг упирается в `Needs review`,
работа останавливается на этом boundary без подстановки фиктивной логики.

## Общая матрица состояний

Каждый интерактивный компонент проверяется минимум в состояниях:

- default;
- hover только на устройствах с hover capability;
- keyboard focus-visible;
- active/selected/open;
- disabled;
- loading/pending;
- validation/service error;
- success/confirmation.

Pen явно задаёт default/hover/focus для primary button, active selector,
mobile menu, promo/more drawers и account/payment states. Для состояний, не
отрисованных в Pen, нельзя вводить новую визуальную систему: используется
семантическое browser/Vue behavior, оформленное подтверждёнными design tokens,
а результат помечается для визуального review.

## Общие команды проверки

```bash
npm run build
./vendor/bin/sail artisan route:list --except-vendor
./vendor/bin/sail composer test
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential <paths>
git diff --check
```

PHP-CS-Fixer соответствует текущему `AGENTS.md` и фактически установленному
toolchain. Pint не используется и не добавляется без отдельной задачи.

## Decision log и отложенные границы

### Решения шага 1 — 2026-10-13/14

- Первоначальная read-only проверка `dudeweb.pen` подтвердила historical
  baseline `142` top-level frames. Повторный аудит после новой редакции
  подтвердил current baseline `137` top-level frames, `10` reusable components,
  `19` variables, `0` structural problems и `5` намеренных decorative clipping
  diagnostics внутри Signal Orbit. Pen не изменялся агентом.
- Утверждён route/data/action contract из
  [01-source-and-contract-audit.md](01-source-and-contract-audit.md). Web и
  Telegram регистрации создают независимые local/Remnawave accounts; linking и
  destructive merge вынесены за рамки этого плана.
- Web-регистрация сразу создаёт и аутентифицирует email/password пользователя
  без email verification. В том же flow выполняется idempotent Remnawave
  provisioning с сохранённым non-PII key; numeric `remnawave_user_id` становится
  устойчивой связью. Ошибка remote не откатывает local account и отображается
  как retryable `service_error`, без stale local subscription truth.
- `Product` получает явный период `1/3/6/12` месяцев. Payment return открывает
  owned status page с polling каждые две секунды до 60 секунд; terminal truth
  приходит только из webhook-processed local payment, retry создаёт новый
  payment attempt.
- Реализуется полный local support domain: ticket/message persistence,
  пользовательские list/create/conversation pages, ownership policies и
  операторские reply/close/reopen actions в MoonShine.
- Web и Telegram referral links работают параллельно. Оба используют opaque
  public token и атрибутируют inviter через `remnawave_user_id`; первая валидная
  атрибуция побеждает. При будущем merge ownership/rewards переходят local
  survivor соответствующего surviving remote ID без повторного начисления.
- Responsive boundaries: mobile `<768`, tablet `768–1199`, desktop `>=1200`;
  public wide layout starts at `1600`; `2560 x 1440` теперь имеет собственные
  dark/light Pen references `j8pJq`/`eM8HW`.
  IBM Plex Sans/Mono self-hosted через одобренные npm font packages. Theme:
  только `light/dark`, pre-hydration bootstrap и `localStorage` без server
  preference; OS preference выбирает первый сохранённый режим только при
  пустом или legacy storage.
- Public brand — `dudeweb`. Утверждён logo direction `06 · Razor Loop`: icon
  для favicon, horizontal/stacked lockups по назначению. Новая редакция Pen
  отменяет scroll-driven sequence и делает Signal Orbit единственным Hero
  contract на всех reference viewport; последнее owner decision возвращает
  статичный SVG без ambient motion.
- CTA ведут на `/register`, `/login`, `#pricing`. Terms/privacy routes и links
  отсутствуют до утверждённого content. Platform app/download links и
  инструкции приходят из backend-каталога, скопированного из общего content
  Remnawave subscription page. Landing и connection UI не хранят собственные
  Vue-копии; персональный `subscriptionUrl` доступен только его владельцу в
  authenticated connection flow.
- Referral Terms — protected read-only page; проценты и reward matrix приходят
  из live server rules вместе с явной content version.
- Pen показывает в footer `Пользовательское соглашение` и `Политика
  конфиденциальности`, но не содержит их content pages или route contract.
  Ссылки остаются `Needs review` и не выводятся как неработающие placeholders.
- `U-17`, `U-20`, `U-21`, `U-23`, `U-24` остаются закрытыми ранее принятыми
  tooling/accessibility/data/directory решениями.

### Явно отложено

- `U-04`: Telegram linking/merge mutation UI не входит в этот план. До отдельного
  решения допустим только read-only connection status.
- `U-18`: frontend test/a11y/E2E dependency не добавляется в текущем шаге и
  блокирует только automated часть шага 15.
- `U-22`: operational SSR остаётся неподтверждённым и блокирует только SSR
  sign-off; основной implementation contract остаётся CSR/Inertia.

## Ограничения плана

- Не изменять `.pen` и не импортировать в него результаты реализации.
- Не использовать placeholder API или фиктивные успешные ответы.
- Не добавлять зависимости без отдельного обоснования и согласования.
- Не менять Telegram, Remnawave, payment, promocode или referral бизнес-правила
  ради визуального соответствия.
- Не переходить к следующему task-файлу, пока текущий не проверен.
