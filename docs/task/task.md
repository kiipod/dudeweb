# TASK.md — VPN Access Service

> Каждый шаг заканчивается коммитом. Коммит делается только после того, как шаг полностью выполнен и проверен (`npm run build`).

---

## Phase 0 — Project Audit

### Step 0.1 — Audit: Models & Migrations

Проанализировать все существующие модели и миграции.

Найти и описать:
- `User` — поля, трейты, отношения
- `ChatMessage` — сообщения для чатбота в телеграм
- `Plan` / `Product` / `PlanAdvantage` / `Advantage` — тарифы, периоды, цены
- `Subscription` — статусы, даты, связи
- `Payment` — статусы, суммы, провайдер
- `Promocode` / `UserPromocode` — типы, ограничения
- `Referral` / `ReferralReward` — связи пользователей, бонусная механика
- `Ticket` / `TicketMessage` — поля, статусы

Создать файл:
```
docs/audit/models.md
```

**Commit:** `docs: audit models and migrations`

---

### Step 0.2 — Audit: Services, Actions, DTO, Enums

Найти и описать:
- все Service-классы (регистрация, оплата, промокоды, рефералы)
- все Action-классы
- все DTO
- все Enum (статусы подписок, платежей, тикетов)

Создать файл:
```
docs/audit/services.md
```

**Commit:** `docs: audit services, actions, dto, enums`

---

### Step 0.3 — Audit: Remnawave API Integration

Найти существующие интеграции с Remnawave API.

Все классы интеграции расположены в директории `app/Remnawave/`.

Найти и описать:
- HTTP-клиенты / Guzzle-обёртки в `app/Remnawave/`
- DTO запросов и ответов в `app/Remnawave/DTO/`
- Handler-классы в `app/Remnawave/Handlers/`
- какие endpoint'ы используются
- как хранится `subscriptionUrl`, `expireAt`, `status`, трафик

Создать файл:
```
docs/audit/api.md
```

**Commit:** `docs: audit remnawave api integration`

---

### Step 0.4 — Audit: Business Flows

Задокументировать существующие бизнес-процессы:
- регистрация (email, OAuth)
- активация триала
- создание платежа
- обработка webhook
- применение промокода
- реферальная цепочка

Создать файл:
```
docs/audit/business-flows.md
```

**Commit:** `docs: audit business flows`

---

## Phase 1 — Frontend Foundation

### Step 1.1 — Inertia + Vue 3 + Nuxt UI: базовая конфигурация

Проверить и зафиксировать конфигурацию стека:
- `vite.config.js` — плагины: `@vitejs/plugin-vue`, `unplugin-auto-import`, `unplugin-vue-components`
- `tailwind.config.js` / CSS-файл — подключение Nuxt UI
- `app.js` — подключение `@nuxt/ui` как Vue-плагина
- `ssr.js` — корректная SSR-конфигурация

Убедиться, что `useColorMode` авто-импортируется.

**Commit:** `chore: configure vite, nuxt-ui, auto-imports for ssr`

---

### Step 1.2 — Theme System (Light / Dark)

Реализовать переключение темы:
- провайдер `useColorMode` из `@nuxt/ui`
- сохранение в `localStorage`
- компонент `AppThemeToggle` (кнопка переключения)
- корректная инициализация без flash при SSR

**Commit:** `feat: theme system with light/dark toggle`

---

### Step 1.3 — Layouts

Создать три layout-компонента:

```
resources/js/Layouts/
 ├─ GuestLayout.vue       — публичный сайт (навигация + футер)
 ├─ AuthLayout.vue        — страницы входа/регистрации (центрированная форма)
 └─ DashboardLayout.vue   — кабинет (сайдбар + header + контент)
```

Каждый layout:
- адаптивный (mobile first)
- поддерживает оба цветовых режима
- использует `AppLogo`

**Commit:** `feat: guest, auth, dashboard layouts`

---

### Step 1.4 — Base UI Components

Создать компоненты дизайн-системы:

```
resources/js/Components/App/
 ├─ AppContainer.vue      — ограничение ширины, отступы
 ├─ AppSection.vue        — секция страницы (padding, заголовок)
 ├─ AppCard.vue           — карточка (обёртка UCard)
 ├─ AppLogo.vue           — логотип (SVG или текст)
 ├─ AppButton.vue         — обёртка UButton с вариантами
 ├─ AppHeading.vue        — заголовок (h1–h4 + subtitle)
 └─ AppStatCard.vue       — виджет статистики (иконка + число + подпись)
```

**Commit:** `feat: base ui component library`

---

## Phase 2 — Public Landing

### Step 2.1 — Landing: Hero Section

Страница `Welcome.vue` с секцией Hero:
- заголовок: «Быстрый и стабильный доступ к привычным инструментам для работы и общения»
- подзаголовок
- CTA-кнопка «Получить доступ» → `/register`
- адаптивная вёрстка

**Commit:** `feat: landing hero section`

---

### Step 2.2 — Landing: Advantages Section

Секция с карточками преимуществ (6 штук):
- Быстрое подключение
- До 5 устройств
- Высокая скорость
- Все популярные платформы
- Безопасное подключение
- Удобный личный кабинет

Использовать `AppCard` + `UIcon`.

**Commit:** `feat: landing advantages section`

---

### Step 2.3 — Landing: Pricing Section

Получать тарифы из БД через Inertia props (контроллер `WelcomeController`).

Отображать:
- тип тарифа (лимитный / безлимитный)
- переключатель периода (1 / 3 / 6 / 12 месяцев)
- цену для выбранного периода
- CTA «Подключить»

Данные берутся из существующих моделей `Plan` / `Product`.

**Commit:** `feat: landing pricing section with db-driven plans`

---

### Step 2.4 — Landing: Final CTA + Footer

- секция повторного призыва к регистрации
- футер: логотип, навигация, копирайт

**Commit:** `feat: landing final cta and footer`

---

## Phase 3 — Authentication

### Step 3.1 — Email Registration & Login

Использовать существующую логику аутентификации.

Создать Inertia-страницы:
- `Auth/Register.vue` — имя, email, пароль
- `Auth/Login.vue` — email, пароль

Переиспользовать существующие контроллеры / actions.

**Commit:** `feat: email registration and login pages`

---

### Step 3.2 — Trial Activation on Registration

После первой регистрации автоматически создавать 3-дневный триал.

Использовать существующую логику (найденную в Phase 0).

Убедиться:
- триал создаётся один раз
- повторный триал невозможен

**Commit:** `feat: auto trial activation on first registration`

---

### Step 3.3 — OAuth: Google, VK, Apple, Yandex

Подключить Socialite (или существующую реализацию):
- `Auth/SocialCallback.vue` (если нужна страница)
- маршруты `/auth/{provider}/redirect` и `/auth/{provider}/callback`
- провайдеры: `google`, `vk`, `apple`, `yandex`

**Commit:** `feat: oauth google, vk, apple, yandex`

---

### Step 3.4 — Telegram Login Widget

Добавить Telegram Login Widget на страницу регистрации/входа:
- скрипт виджета
- callback-маршрут `/auth/telegram/callback`
- верификация данных (HMAC-SHA256)

**Commit:** `feat: telegram login widget`

---

## Phase 4 — User Dashboard

### Step 4.1 — Dashboard: Main Page (Static Structure)

Создать `Dashboard/Index.vue` с виджетами (данные-заглушки):
- Статус подписки
- Текущий тариф
- Осталось дней
- Использованный трафик
- Количество устройств
- Последнее подключение
- Ссылка подключения (копировать в буфер)

Использовать `AppStatCard`.

**Commit:** `feat: dashboard main page layout with widgets`

---

### Step 4.2 — Dashboard: Subscription Status Logic

Подключить реальные данные из Laravel:
- определять статус (`trial` / `active` / `expired` / `inactive`)
- передавать через Inertia props
- показывать соответствующий UI для каждого статуса

**Commit:** `feat: dashboard subscription status from db`

---

## Phase 5 — Remnawave API Integration

### Step 5.1 — Remnawave API Service

На основе аудита (Step 0.3) создать или дополнить классы в директории `app/Remnawave/`:

```
app/Remnawave/DTO/          — объекты передачи данных
app/Remnawave/Handlers/     — обработчики запросов к API
```

Реализовать получение данных подписки пользователя.

Поля результирующего DTO:
- `trafficLimitBytes`
- `usedTrafficBytes`
- `expireAt`
- `status`
- `subscriptionUrl`

**Commit:** `feat: remnawave api service and dto`

---

### Step 5.2 — Dashboard: Real Remnawave Data

Обновить `DashboardController`:
- получать данные через `app/Remnawave/Handlers/`
- обрабатывать ошибки API (fallback на данные из БД)
- передавать в Inertia props

Обновить виджеты дашборда для отображения реальных данных.

**Commit:** `feat: dashboard synced with remnawave api`

---

## Phase 6 — Subscription Management

### Step 6.1 — Subscription Page

Создать `Dashboard/Subscription.vue`:
- текущий тариф и период
- дата окончания
- стоимость продления
- `subscriptionUrl` из Remnawave API (кнопка «Открыть инструкцию подключения»)
- ссылка «Продлить подписку» → страница оплаты

**Commit:** `feat: subscription management page`

---

## Phase 7 — YooKassa Payment

> Интеграция реализуется на основе официальной библиотеки **`yoomoney/yookassa-sdk-php`** версии **3.13.2**.
>
> Актуальная документация расположена в репозитории библиотеки:
> `https://git.yoomoney.ru/projects/sdk/repos/yookassa-sdk-php/browse`
>
> Перед реализацией изучить документацию из репозитория — она является источником истины для всех методов SDK.

### Step 7.1 — YooKassa SDK: установка и конфигурация

Установить библиотеку:

```bash
composer require yoomoney/yookassa-sdk-php:3.13.2
```

Создать конфигурацию:
- `config/yookassa.php` — `shop_id`, `secret_key`, `return_url`, `webhook_url`
- значения берутся из `.env`: `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`

Создать сервис-провайдер или binding в `AppServiceProvider`:

```php
// Инициализация клиента согласно документации SDK
$client = new \YooKassa\Client();
$client->setAuth(config('yookassa.shop_id'), config('yookassa.secret_key'));
```

**Commit:** `chore: install and configure yookassa sdk 3.13.2`

---

### Step 7.2 — Payment Flow: Select Plan & Create Payment

Страница `Dashboard/Payment/Create.vue`:
- выбор тарифа и периода
- применение промокода (поле ввода)
- отображение итоговой суммы
- кнопка «Оплатить» → создание платежа и редирект на YooKassa

Реализовать `CreatePaymentAction` / `PaymentService` с использованием SDK:
- метод `createPayment()` через `\YooKassa\Request\Payments\CreatePaymentRequest::builder()`
- тип подтверждения: `ConfirmationType::REDIRECT`
- `returnUrl` из конфига
- сохранение `payment_id` (YooKassa) в модель `Payment`
- идемпотентный ключ: `uniqid('', true)`

Переиспользовать существующий `PaymentService` / `CreatePaymentAction` если найден в Phase 0.

**Commit:** `feat: payment creation flow with yookassa redirect`

---

### Step 7.3 — Payment: Success & Cancel Pages

Создать:
- `Dashboard/Payment/Success.vue` — подтверждение оплаты
- `Dashboard/Payment/Cancel.vue` — отмена оплаты

**Commit:** `feat: payment success and cancel pages`

---

### Step 7.4 — YooKassa Webhook

Реализовать webhook-обработчик:
- маршрут `POST /webhooks/yookassa` — исключить из CSRF-защиты
- получить тело запроса и обработать уведомление согласно документации SDK
- обрабатывать события:
    - `payment.succeeded` → продление подписки
    - `payment.canceled` → обновление статуса платежа
- продление подписки: `existing_end_date + purchased_period`
- ответить HTTP 200 (YooKassa игнорирует тело ответа)
- IP-фильтрация: принимать запросы только с IP-адресов YooKassa (актуальный список в документации SDK)

Переиспользовать существующую логику если найдена в Phase 0.

**Commit:** `feat: yookassa webhook handler`

---

## Phase 8 — Promocodes

### Step 8.1 — Promocode Application

На странице оплаты:
- ручной ввод промокода
- AJAX-валидация (Inertia или axios)
- отображение скидки (`percent` / `fixed`)
- расчёт итоговой суммы

Использовать существующие модели `Promocode` / `UserPromocode`.

**Commit:** `feat: promocode validation and discount calculation`

---

### Step 8.2 — Auto-apply Promocode from URL

- параметр `?promo=CODE` в URL лендинга/регистрации
- сохранение в сессию
- автоматическое применение при оплате

**Commit:** `feat: auto-apply promocode from url param`

---

## Phase 9 — Referral System

### Step 9.1 — Referral Link & Registration Tracking

- маршрут `/ref/{code}` → сохранить реферера в сессию, редирект на `/register`
- при регистрации фиксировать `referrer_id`
- переиспользовать существующую реферальную механику

**Commit:** `feat: referral link tracking and registration binding`

---

### Step 9.2 — Referral Dashboard Widget

Добавить в кабинет:
- личная реферальная ссылка (копировать)
- количество приглашённых
- начисленные бонусы

**Commit:** `feat: referral dashboard widget`

---

## Phase 10 — Support Tickets

### Step 10.1 — Ticket List & Create

Создать:
- `Dashboard/Tickets/Index.vue` — список тикетов (тема, статус, дата)
- `Dashboard/Tickets/Create.vue` — форма (тема + сообщение)

**Commit:** `feat: support tickets list and create`

---

### Step 10.2 — Ticket Detail & Close

Создать:
- `Dashboard/Tickets/Show.vue` — переписка, статус (`open` / `closed`)
- кнопка «Закрыть тикет»

**Commit:** `feat: ticket detail view and close action`

---

## Phase 11 — Notifications

### Step 11.1 — Subscription Expiry Notifications

Отображать баннер/уведомление в кабинете:
- за 3 дня до окончания: «Подписка скоро закончится»
- после окончания: «Подписка завершилась»

Логика на основе `expireAt` из Remnawave DTO.

**Commit:** `feat: subscription expiry notification banners`

---

## Phase 12 — QA & Production Readiness

### Step 12.1 — Backend: Routes, Policies, Tests

- проверить все маршруты (`php artisan route:list`)
- проверить Policy для каждого ресурса (Subscription, Ticket, Payment)
- написать базовые feature-тесты критических flows:
    - регистрация + триал
    - создание платежа
    - webhook → продление
    - промокод → скидка

**Commit:** `test: backend routes, policies, feature tests`

---

### Step 12.2 — Frontend: Responsive & Dark Mode Audit

Пройти по всем страницам:
- мобильная адаптивность (320px, 375px, 768px)
- светлая тема
- тёмная тема
- отсутствие визуальных багов

**Commit:** `fix: responsive and dark mode audit fixes`

---

### Step 12.3 — Performance: N+1 & Eager Loading

- проверить все контроллеры с Eloquent-запросами
- добавить `with()` там, где необходимо
- убедиться в отсутствии N+1 (Laravel Debugbar / Telescope)

**Commit:** `perf: fix n+1 queries, add eager loading`

---

### Step 12.4 — SSR Final Check

- запустить `php artisan inertia:ssr` (или аналог)
- убедиться, что все страницы рендерятся без ошибок
- проверить гидратацию на клиенте

**Commit:** `chore: ssr final verification and fixes`

---

### Step 12.5 — Production Checklist

- `APP_ENV=production`, `APP_DEBUG=false`
- `npm run build` без ошибок и предупреждений
- `php artisan optimize`
- `php artisan migrate --force` (staging)
- переменные окружения: `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`, Remnawave API, OAuth keys

**Commit:** `chore: production build and env verification`

---

## Commit Convention

```
feat:     новая функциональность
fix:      исправление бага
chore:    конфигурация, зависимости, инфраструктура
docs:     документация
test:     тесты
perf:     оптимизация производительности
refactor: рефакторинг без изменения поведения
```
