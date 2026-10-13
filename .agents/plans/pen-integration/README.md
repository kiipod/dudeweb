# Перенос дизайна Hey Dude из Pen

## Статус

План подготовлен по результатам read-only аудита Pen-документа и текущего
репозитория 2026-10-11. Реализация не начата. Исходные макеты Pen не изменялись.

## Цель

Последовательно перенести дизайн из открытого документа `dudeweb.pen` в
существующий Laravel + Inertia + Vue проект, сохранив текущую архитектуру,
mobile-first подход и существующие бизнес-контракты.

План охватывает:

- публичный лендинг;
- scroll-driven Hero;
- светлую и тёмную темы;
- аутентификацию и восстановление доступа;
- личный кабинет, подписку и оплату;
- подключение устройств, реферальный раздел, поддержку и профиль;
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
4. Неподтверждённые детали не реализуются предположительно: они фиксируются как
   `Needs review` в разделе «Неопределённости».

Явное требование пользователя имеет приоритет над макетом. В частности,
последовательность Hero должна быть:

`Hey Dude -> любимые -> сервисы -> снова -> рядом`.

## Результат аудита Pen

### Документ и состав

- Документ: `dudeweb.pen`.
- Верхнеуровневых фреймов: 122.
- Формальных reusable-компонентов: 8.
- Layout-проблем по результатам структурного обхода: 0.

Группы фреймов:

| Группа | Количество | Содержание |
| --- | ---: | --- |
| Лендинг и спецификации | 12 | mobile/light/dark, 360 validation, tablet, desktop, menu-open, storyboard, states, design system |
| Account boards | 4 | dark/light components и account/checkout states |
| Mobile account | 38 | 19 экранов в dark и light |
| Tablet account | 34 | 17 экранов в dark и light |
| Desktop account | 34 | 17 экранов в dark и light |

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
- Account dashboard: default и mobile bottom-sheet `Ещё`.
- Подписка: default и открытый promo drawer.
- Auth: login, registration, recovery, reset-link-sent, new password,
  password-changed.
- Подключение: Windows, macOS, Linux, Android, iOS и три шага настройки.
- Referral: ссылка, share/copy, показатели и empty state.
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

Не каждый повторяющийся паттерн оформлен в Pen как formal component. При
реализации повторяемые shell, auth, state и navigation patterns должны стать
небольшими focused Vue-компонентами с явными props/emits contracts.

## Результат аудита репозитория

### Фактический стек

- PHP `8.5`, Laravel `13.35.0`.
- `inertiajs/inertia-laravel 3.5.1`.
- `@inertiajs/vue3 2.3.27`.
- Vue `3.5.42`, Vue Router `4.6.4`.
- Tailwind CSS и `@tailwindcss/vite 4.3.3`.
- Vite `8.2.2`.
- JavaScript stack; TypeScript в текущем frontend не настроен.

### Текущее frontend-состояние

- Единственная Inertia page: `../../../resources/js/pages`.
- Страница является demo-заглушкой и использует `<script setup>`.
- `AppLayout.vue` использует семантические `header`, `nav` и `footer`, но
  содержит временные links к секциям demo-страницы.
- `app.css` содержит только импорт Tailwind; design tokens, fonts, breakpoints
  и custom utilities отсутствуют.
- SSR entrypoint настроен без стороннего UI plugin.
- IBM Plex assets в проекте отсутствуют.
- Frontend lint, unit, component и E2E test scripts отсутствуют.

### Текущие HTTP-контракты

Доступно четыре application route:

- `GET /` — Inertia `App`;
- `POST /payments` — JSON creation endpoint, `auth:web`;
- `GET /payments/return` — проверяет подписанный token, сейчас возвращает
  plain response для web payment;
- `POST /webhooks/yookassa` — provider webhook.

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
  Telegram `username`/`chat_id` и не содержит email/password.
- `web` guard объявлен, но web-auth flow не реализован.
- Pen содержит support tickets и conversation, которых нет в домене.
- Pen показывает web referral URL, текущая логика генерирует Telegram bot link.
- Pen payment pages предполагают live status UI; текущий return endpoint
  возвращает текст и не предоставляет Inertia status props.
- `AGENTS.md` упоминает Pint, но установлен и настроен PHP-CS-Fixer, а Pint
  отсутствует.
- Local snapshot `tailwind-4-docs` не инициализирован; точный Tailwind API,
  выходящий за уже используемые возможности, отмечается `Needs review`.

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

Все шаги выполняются строго последовательно:

1. [Контракты и фиксация источников](01-source-and-contract-audit.md)
2. [Design foundation и tokens](02-design-foundation.md)
3. [Переиспользуемые UI-компоненты](03-shared-ui-components.md)
4. [Публичный shell и навигация](04-public-shell-navigation.md)
5. [Scroll-driven Hero](05-scroll-driven-hero.md)
6. [Остальные секции лендинга](06-landing-content.md)
7. [Auth и password flows](07-authentication-flows.md)
8. [Account shell и dashboard](08-account-shell-dashboard.md)
9. [Подписка и оплата](09-subscription-payment.md)
10. [Подключение устройств](10-connection.md)
11. [Реферальный раздел](11-referral.md)
12. [Поддержка](12-support.md)
13. [Профиль](13-profile.md)
14. [Состояния, overlays и motion hardening](14-cross-cutting-states-motion.md)
15. [Адаптивность и доступность](15-accessibility-responsive-verification.md)
16. [Финальная проверка](16-final-verification.md)

Зависимость линейная: шаг `N` начинается только после успешной проверки и
фиксации результатов шага `N-1`. Если шаг упирается в `Needs review`, работа
останавливается на этом boundary без подстановки фиктивной логики.

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
docker compose exec -T laravel.test php artisan route:list --except-vendor
docker compose exec -T laravel.test composer test
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential <paths>
git diff --check
```

PHP-CS-Fixer указан по фактически установленному toolchain. Замена на Pint
требует отдельного решения по неопределённости `U-17`.

## Неопределённости (`Needs review`)

- `U-01` — идентификатор web-пользователя: email/password из Pen или Telegram
  identity из текущей модели.
- `U-02` — источник регистрации, login, password reset token и канал доставки
  reset link отсутствуют.
- `U-03` — окончательные URL и route names для auth/account разделов.
- `U-04` — web-session bootstrap и способ связывания существующего Telegram
  пользователя с web-аккаунтом.
- `U-05` — источник subscription status/expiration/device count, cache policy и
  UX при недоступности Remnawave.
- `U-06` — точная mapping `Product` к периодам 1/3/6/12 месяцев и отображаемая
  цена; в Pen цена оставлена как `— ₽`.
- `U-07` — payment return live-update: reload/poll interval, terminal timeout и
  разрешённый retry contract.
- `U-08` — support tickets: создавать новую доменную модель или оставить
  внешний Telegram support flow.
- `U-09` — web referral URL расходится с текущей Telegram bot link.
- `U-10` — download URLs и platform-specific инструкции подключения.
- `U-11` — профиль: какие поля редактируются и существует ли password change
  для выбранной identity model.
- `U-12` — точные CSS breakpoints между 390/768/1440 reference layouts.
- `U-13` — способ загрузки и лицензирование IBM Plex Sans/Mono.
- `U-14` — theme default, persistence, system mode и SSR/hydration contract.
- `U-15` — destinations для CTA, terms, privacy и footer links.
- `U-16` — точная scroll distance на состояние Hero и mobile pinning policy.
- `U-17` — formatter: инструкция упоминает Pint, repository toolchain содержит
  PHP-CS-Fixer.
- `U-18` — frontend test/a11y/E2E tooling отсутствует; добавление dependencies
  требует отдельного согласования.
- `U-19` — название бренда: пользователь называет проект Hey Dude, а Pen и код
  используют `dudeweb`, при этом Hero содержит `Hey Dude`.
- `U-20` — centered modal не специфицирован: Pen показывает dropdown/mobile
  menu и bottom drawers для `Ещё`/промокода.
- `U-21` — реальные значения дат, email, device counts, referral metrics и
  tickets в Pen являются демонстрационными и должны приходить из контрактов.
- `U-22` — operational SSR: entrypoint существует, но способ запуска SSR в
  целевом окружении не подтверждён.
- `U-23` — client adapter Inertia имеет major 2, Laravel adapter major 3;
  совместимость установлена зависимостями, но терминология stack требует
  фиксации перед version-specific API.

## Ограничения плана

- Не изменять `.pen` и не импортировать в него результаты реализации.
- Не использовать placeholder API или фиктивные успешные ответы.
- Не добавлять зависимости без отдельного обоснования и согласования.
- Не менять Telegram, Remnawave, payment, promocode или referral бизнес-правила
  ради визуального соответствия.
- Не переходить к следующему task-файлу, пока текущий не проверен.
