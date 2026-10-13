# Перенос дизайна Hey Dude из Pen

## Статус

План подготовлен по результатам read-only аудита Pen-документа 2026-10-11 и
повторно актуализирован по Pen и текущему checkout 2026-10-13. Реализация не
начата. Исходные макеты Pen не изменялись.

## Цель

Последовательно перенести дизайн из открытого документа `dudeweb.pen` в
существующий Laravel + Inertia + Vue проект, сохранив текущую архитектуру,
mobile-first подход и существующие бизнес-контракты.

План охватывает:

- публичный лендинг;
- scroll-driven Hero;
- статические Hero variants с назначением, требующим решения `U-26`;
- выбранный logo/lockup contract из Pen logo-system boards;
- светлую и тёмную темы;
- аутентификацию и восстановление доступа;
- личный кабинет, подписку и оплату;
- подключение устройств, реферальный раздел с отдельной страницей условий,
  поддержку и профиль;
- адаптивные варианты 360, 390, 768 и 1440 px;
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

Явное требование пользователя имеет приоритет над макетом. В частности,
последовательность Hero должна быть:

`Hey Dude -> любимые -> сервисы -> снова -> рядом`.

## Результат аудита Pen

### Документ и состав

- Документ: `dudeweb.pen`.
- Верхнеуровневых фреймов: 142.
- Формальных reusable-компонентов: 10.
- Variables: 19.
- Layout-проблем по результатам структурного обхода: 0.

Группы фреймов:

| Группа | Количество | Содержание |
| --- | ---: | --- |
| Лендинг и спецификации | 12 | mobile/light/dark, 360 validation, tablet, desktop, menu-open, storyboard, states, design system |
| Static Hero references | 6 | 360/390/768/1440, light/dark где предусмотрено |
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

Последний read-only аудит зафиксировал дельту `136 -> 142` без Pencil
mutations:

| Новые фреймы | ID | Роль в реализации |
| --- | --- | --- |
| `Q2 · Referral Terms · Mobile` | `paZk6`, `LNwLW` | самостоятельная read-only account page, dark/light |
| `Q2 · Referral Terms · Tablet` | `BYL5v`, `hhNkq` | та же page в tablet shell, dark/light |
| `Q2 · Referral Terms · Desktop` | `jSIgm`, `Uel2T` | та же page в desktop shell, dark/light |

`Q2` связан с основным `Q · Referral` явной ссылкой «Условия партнёрской
программы» и обратным действием «Назад к приглашениям». Поэтому это новый
route/page внутри referral flow, а не visual-only state. Точные path и route
name утверждаются в шаге 1 вместе с `U-03`.

Референсные размеры:

- small mobile: `360 px`;
- mobile: `390 px`;
- tablet: `768 px`;
- desktop: `1440 px`.

Это контрольные viewport, а не подтверждённые CSS breakpoint. Точные пороги
переключения layout должны быть утверждены в шаге 1.

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

### Hero motion spec

Storyboard `G · Hero Motion Storyboard` задаёт семь состояний:

1. `Hey Dude` — начальный viewport;
2. `любимые`;
3. `сервисы`;
4. `снова`;
5. `рядом`;
6. появляется conversion CTA;
7. Hero освобождается и открывает следующий раздел.

Ограничения из Pen:

- состояния 1-6 pinned;
- прокрутка работает в обе стороны;
- переходы `200-350ms`, `opacity` + `translateY(12px)`;
- autoplay отсутствует;
- `prefers-reduced-motion`: полный заголовок и CTA сразу, без pinning.

Новые `J1`–`J6 · Static Hero` задают точный responsive visual reference:

- заголовок `Hey, dude!\nлюбимые сервисы снова рядом`;
- описание `Работай, смотри, слушай и общайся без лишних ограничений. Hey Dude
  помогает оставаться на связи с тем, что тебе нравится.`;
- CTA `Попробовать бесплатно` и `Посмотреть тариф`;
- строка `3 дня бесплатно · До 5 устройств`;
- font size заголовка `42/62/82 px` для mobile/tablet/desktop reference.

Default scroll-driven contract остаётся приоритетным по явному требованию
пользователя. Точная роль static frames и пунктуация первого состояния
фиксируются в `U-26`, а не предполагаются из названия board.

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
самостоятельные бизнес-правила. Источник и versioning этого content contract
утверждаются в `U-27`, после чего page получает server-confirmed props.

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

1. [ ] [Контракты и фиксация источников](01-source-and-contract-audit.md)
2. [ ] [Design foundation и tokens](02-design-foundation.md)
3. [ ] [Переиспользуемые UI-компоненты](03-shared-ui-components.md)
4. [ ] [Публичный shell и навигация](04-public-shell-navigation.md)
5. [ ] [Scroll-driven Hero](05-scroll-driven-hero.md)
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

## Неопределённости (`Needs review`)

### Decision log шага 1 — 2026-10-13

- Read-only повторная проверка `dudeweb.pen` подтвердила baseline `142`
  top-level frames, `10` reusable components, `19` variables и отсутствие
  layout-проблем; новой дельты после `136 -> 142` нет.
- Pen, production-код и тесты на шаге 1 не изменяются. Полная route/data/action
  карта, component map и mutation contract зафиксированы в
  [01-source-and-contract-audit.md](01-source-and-contract-audit.md).
- Route registry в шаге 1 является точным proposal, но не принят до решения
  `U-03`; зависимые route implementation steps остаются заблокированы.
- Корректировка владельца 2026-10-13 заменила первоначальный mandatory-link
  contract: web создаёт самостоятельных email/password пользователей без
  Telegram, Telegram продолжает создавать самостоятельных пользователей, а
  linking между каналами опционален. Несвязанные аккаунты имеют отдельные
  подписки и оплачиваются отдельно.
- `U-01` и `U-02` закрыты: open web registration разрешена, email обязателен к
  подтверждению, password reset использует отдельный `users` broker и
  доставляется по email. `U-04` открыт заново только для proof/link,
  collision/merge и unlink двух уже существующих аккаунтов.
- Корректировка владельца 2026-10-13 фиксирует linked topology: после связки
  существует одна локальная запись `users` и один Remnawave user с заполненными
  `email` и `telegramId`; отдельный слой `service_accounts` не создаётся.
  Telegram-first flow добавляет подтверждённые web credentials и патчит remote
  `email`, web-first flow добавляет доказанный Telegram identity и патчит remote
  `telegramId`. Для устойчивой связи локально хранится numeric Remnawave user ID,
  а не используется изменяемый username.
- Если до связки уже существуют две local и две Remnawave записи, конечная
  topology известна, но `U-04` остаётся открытым для выбора survivor, сохранения
  оплаченного времени, переноса ownership/FK, referral/promo conflicts, cleanup
  проигравшей remote-записи и допустимости unlink. До этого destructive merge
  не реализуется.
- `U-18`, `U-19`, `U-22`, `U-25`, `U-26` и `U-27` явно отложены с owner и
  blocking scope в task-файле. Это не разрешает использовать placeholder
  tooling, brand assets, SSR assumptions или referral content.
- `U-20` закрыто техническим accessibility contract: account sheets/dialog
  модальны, фон приложения inert, focus trapped/restored, Escape и backdrop
  закрывают только безопасное непроцессинговое состояние, scroll блокируется.
  Геометрия затемнения не уменьшает semantic inert scope.
- `U-21` закрыто: все показанные в Pen даты, email/identity labels, device
  counts, referral metrics, tickets и payment values — только демонстрационные;
  runtime-значения приходят из минимальных server props либо отсутствуют вместе
  с заблокированным flow.
- `U-24` закрыто: сохраняется фактическая lowercase convention
  `resources/js/pages`, `resources/js/layouts`; новые каталоги создаются как
  `components` и `composables`, без дублей только регистром.

- `U-03` — окончательные URL и route names для auth/account разделов.
- `U-04` — optional Telegram linking: proof-of-control в обоих направлениях;
  для двух уже существующих local/Remnawave accounts — canonical survivor,
  оплаченный остаток, перенос subscription/payment/referral data, cleanup
  проигравшей remote-записи и допустимость unlink. Результат уже фиксирован как
  одна local и одна remote запись, а не shared-entitlement слой.
- `U-05` — источник subscription status/expiration/device count, cache policy и
  UX при недоступности Remnawave; дополнительно numeric `remnawave_user_id`,
  provisioning/lifecycle web-only пользователя и generated non-PII remote
  username без зависимости от `chat_id`/Telegram username.
- `U-06` — точная mapping `Product` к периодам 1/3/6/12 месяцев и отображаемая
  цена; в Pen цена оставлена как `— ₽`.
- `U-07` — payment return live-update: reload/poll interval, terminal timeout и
  разрешённый retry contract.
- `U-08` — support tickets: создавать новую доменную модель или оставить
  внешний Telegram support flow.
- `U-09` — определить dual-channel referral attribution: web invite для
  standalone registration, Telegram bot link для bot registration, дедупликация
  и запрет self-referral между identities/аккаунтами после linking.
- `U-10` — download URLs и platform-specific инструкции подключения.
- `U-11` — профиль: редактируемые поля, re-verification при смене email,
  password/session security actions и размещение Telegram connection status.
- `U-12` — точные CSS breakpoints между 390/768/1440 reference layouts.
- `U-13` — способ загрузки и лицензирование IBM Plex Sans/Mono.
- `U-14` — theme default, persistence, system mode и SSR/hydration contract.
- `U-15` — destinations для CTA, terms, privacy и footer links.
- `U-16` — точная scroll distance на состояние Hero и mobile pinning policy.
- `U-18` — frontend test/a11y/E2E tooling отсутствует; добавление dependencies
  требует отдельного согласования.
- `U-19` — название бренда: пользователь называет проект Hey Dude, а Pen и код
  используют `dudeweb`, при этом Hero содержит `Hey Dude`.
- `U-22` — operational SSR: текущий checkout содержит dependencies и build
  script, но рабочий entrypoint и способ запуска в целевом окружении ещё не
  доказаны.
- `U-25` — выбрать утверждённое logo direction (`01 · Connected DW` или
  `06 · Razor Loop`) и lockups для header/sidebar/favicon; board сообщает о
  трёх направлениях, но содержит два, а Razor Loop wordmark использует `Inter`
  вне заявленной IBM Plex typography.
- `U-26` — подтвердить назначение `J1`–`J6 · Static Hero`: только
  `prefers-reduced-motion`, дополнительный fallback или breakpoint-specific
  замена; отдельно согласовать `Hey, dude!` в static frames с приоритетной
  последовательностью `Hey Dude -> любимые -> сервисы -> снова -> рядом`.
- `U-27` — определить source/versioning для публично показываемых условий
  реферальной программы: live значения из `ReferralBonus` и automatic referral
  promocode либо утверждённый versioned legal/content snapshot. В обоих случаях
  Q2 не должен расходиться с фактическими правилами начисления.

### Закрытые расхождения аудита

- `U-01` закрыто 2026-10-13 уточнённым решением владельца: `User` может быть
  web-only, Telegram-only или связанным аккаунтом с обеими identities. Web и
  Telegram регистрации независимы; без linking это два отдельных платных
  набора local/Remnawave account и подписки.
- `U-02` закрыто 2026-10-13: публичная web-регистрация создаёт самостоятельного
  пользователя по email/password; verification и reset доставляются
  стандартными Laravel email notifications через `users` password broker.
  Production mailer должен быть реально настроен и не может оставаться `log`.
- `U-17` закрыто 2026-10-13: `AGENTS.md` и repository toolchain требуют
  PHP-CS-Fixer; Pint отсутствует и плану не нужен.
- `U-23` закрыто 2026-10-13: `inertiajs/inertia-laravel 3.5.1`,
  `@inertiajs/vue3 3.9.1` и `@inertiajs/vite 3.9.1` используют major 3.
- `U-20` закрыто 2026-10-13: для `Ещё` и promo применяется единый modal
  accessibility contract; визуальная область backdrop не ограничивает inert
  scope.
- `U-21` закрыто 2026-10-13: демонстрационные значения Pen не становятся
  frontend fixtures и должны приходить из подтверждённых server props.
- `U-24` закрыто 2026-10-13: frontend продолжает фактическую lowercase
  directory convention.

## Ограничения плана

- Не изменять `.pen` и не импортировать в него результаты реализации.
- Не использовать placeholder API или фиктивные успешные ответы.
- Не добавлять зависимости без отдельного обоснования и согласования.
- Не менять Telegram, Remnawave, payment, promocode или referral бизнес-правила
  ради визуального соответствия.
- Не переходить к следующему task-файлу, пока текущий не проверен.
