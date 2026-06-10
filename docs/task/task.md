# TASK.md — VPN Access Service

> **Формат задачи:**
> - `[ ]` — микрозадача (один файл / один метод / одна команда)
> - каждый шаг заканчивается блоком **Проверка** и **Commit**
> - коммит делается только после проверки человеком
> - перед началом каждого шага задачи сверяемся с существующим фунционалом проекта в `docs/audit`

---

## Phase 0 — Project Audit

### Step 0.1 — Audit: Models & Migrations

- [ ] Открыть `app/Models/` и составить полный список файлов
- [ ] Описать модель `User`: поля из миграции, трейты, отношения
- [ ] Описать модель `ChatMessage`: поля, связь с User
- [ ] Описать модель `Plan`: поля, отношения с Product / PlanAdvantage
- [ ] Описать модель `Product`: поля, периоды, цены
- [ ] Описать модель `PlanAdvantage` и `Advantage`: поля, связи
- [ ] Описать модель `Subscription`: статусы (enum), даты, связь с User / Plan
- [ ] Описать модель `Payment`: статусы, суммы, провайдер, связь с User / Subscription
- [ ] Описать модель `Promocode`: тип (`percent` / `fixed`), ограничения
- [ ] Описать модель `UserPromocode`: связь с User / Promocode, дата использования
- [ ] Описать модель `Referral`: поля, связь пригласивший → приглашённый
- [ ] Описать модель `ReferralReward`: поля, тип бонуса, статус начисления
- [ ] Описать модель `Ticket`: поля, статус (`open` / `closed`), связь с User
- [ ] Описать модель `TicketMessage`: поля, связь с Ticket / User
- [ ] Создать файл `docs/audit/models.md` с результатами

**Проверка:**
- [ ] Файл `docs/audit/models.md` создан
- [ ] Все модели из `app/Models/` описаны
- [ ] Для каждой модели указаны: поля, отношения, используемые enum/статусы

**Commit:** `docs: audit models and migrations`

---

### Step 0.2 — Audit: Services, Actions, DTO, Enums

- [ ] Найти все файлы в `app/Services/` и составить список
- [ ] Для каждого Service описать: назначение, публичные методы, зависимости
- [ ] Найти все файлы в `app/Actions/` (или аналог) и составить список
- [ ] Для каждого Action описать: входные данные, результат, побочные эффекты
- [ ] Найти все файлы в `app/DTO/` и составить список
- [ ] Для каждого DTO описать: поля, откуда создаётся, куда передаётся
- [ ] Найти все файлы в `app/Enums/` и составить список
- [ ] Для каждого Enum описать: значения, где используется
- [ ] Создать файл `docs/audit/services.md` с результатами

**Проверка:**
- [ ] Файл `docs/audit/services.md` создан
- [ ] Каждый Service / Action / DTO / Enum задокументирован

**Commit:** `docs: audit services, actions, dto, enums`

---

### Step 0.3 — Audit: Remnawave API Integration

- [ ] Найти все файлы в `app/Remnawave/` и составить дерево директорий
- [ ] Описать каждый файл в `app/Remnawave/DTO/`: поля запроса и ответа
- [ ] Описать каждый файл в `app/Remnawave/Handlers/`: endpoint, HTTP-метод, параметры
- [ ] Найти HTTP-клиент (Guzzle или обёртка): как инициализируется, base URL, auth
- [ ] Найти где хранится / как передаётся `subscriptionUrl`
- [ ] Найти где хранится / как передаётся `expireAt`
- [ ] Найти где хранится / как передаётся `status`
- [ ] Найти где хранится / как передаётся трафик (`usedTrafficBytes`, `trafficLimitBytes`)
- [ ] Создать файл `docs/audit/api.md` с результатами

**Проверка:**
- [ ] Файл `docs/audit/api.md` создан
- [ ] Все файлы из `app/Remnawave/` описаны
- [ ] Задокументированы все поля, которые будут нужны дашборду

**Commit:** `docs: audit remnawave api integration`

---

### Step 0.4 — Audit: Business Flows

- [ ] Найти и описать flow регистрации через email: контроллер → action → модели
- [ ] Найти и описать flow OAuth-регистрации: callback → action → модели
- [ ] Найти и описать flow активации триала: где создаётся, условия, ограничения
- [ ] Найти и описать flow создания платежа: от запроса до записи в БД
- [ ] Найти и описать flow обработки webhook: маршрут → handler → обновление подписки
- [ ] Найти и описать flow применения промокода: валидация → расчёт скидки → фиксация
- [ ] Найти и описать flow реферальной цепочки: ссылка → регистрация → бонус
- [ ] Создать файл `docs/audit/business-flows.md` с результатами

**Проверка:**
- [ ] Файл `docs/audit/business-flows.md` создан
- [ ] Каждый flow описан в виде последовательности: запрос → обработка → результат
- [ ] Указаны конкретные классы и методы для каждого flow

**Commit:** `docs: audit business flows`

---

## Phase 1 — Frontend Foundation

### Step 1.1 — Vite & Nuxt UI: конфигурация

- [ ] Проверить `vite.config.js`: наличие `@vitejs/plugin-vue`
- [ ] Проверить `vite.config.js`: наличие плагина `ui({ router: 'inertia' })` из `@nuxt/ui/vite`
- [ ] Проверить `vite.config.js`: наличие `unplugin-auto-import` с пресетами Vue + VueUse
- [ ] Проверить `vite.config.js`: наличие `unplugin-vue-components` с резолвером Nuxt UI
- [ ] Проверить CSS-файл: наличие `@import "@nuxt/ui"`
- [ ] Проверить `resources/js/app.js`: `.use(ui)` подключён
- [ ] Проверить `resources/js/ssr.js`: `.use(ui)` подключён
- [ ] Проверить `resources/js/app.js`: корневой элемент обёрнут в `class="isolate"`
- [ ] Убедиться, что `useColorMode` доступен без ручного импорта (авто-импорт)

**Проверка:**
- [ ] `npm run build` завершается без ошибок
- [ ] `npm run dev` запускается без ошибок в консоли
- [ ] `UButton` рендерится на любой тестовой странице без ошибок

**Commit:** `chore: configure vite, nuxt-ui, auto-imports for ssr`

---

### Step 1.2 — Theme System

- [ ] Создать компонент `resources/js/Components/App/AppThemeToggle.vue`
    - использует `useColorMode()` из `@nuxt/ui`
    - переключает между `light` и `dark`
    - иконка меняется в зависимости от текущей темы (`UIcon`)
- [ ] Убедиться что тема сохраняется в `localStorage` (поведение `useColorMode` по умолчанию)
- [ ] Добавить в `<head>` inline-скрипт предотвращения flash (или убедиться что Nuxt UI делает это сам)

**Проверка:**
- [ ] Переключение темы работает на тестовой странице
- [ ] После перезагрузки страницы тема восстанавливается
- [ ] При SSR нет гидратационных ошибок в консоли браузера

**Commit:** `feat: theme system with light/dark toggle`

---

### Step 1.3 — GuestLayout

- [ ] Создать `resources/js/Layouts/GuestLayout.vue`
- [ ] Добавить навигационную шапку: логотип + ссылки + `AppThemeToggle` + кнопки «Войти» / «Регистрация»
- [ ] Добавить `<slot />` для контента
- [ ] Добавить футер: логотип, навигация, копирайт
- [ ] Вёрстка адаптивна: мобильное меню (бургер) на `< 768px`

**Проверка:**
- [ ] Layout отображается корректно на 375px и 1280px
- [ ] Светлая и тёмная тема применяются без артефактов
- [ ] `npm run build` без ошибок

**Commit:** `feat: guest layout`

---

### Step 1.4 — AuthLayout

- [ ] Создать `resources/js/Layouts/AuthLayout.vue`
- [ ] Центрированная карточка с логотипом сверху
- [ ] `<slot />` для формы
- [ ] `AppThemeToggle` в углу

**Проверка:**
- [ ] Layout отображается корректно на 375px и 1280px
- [ ] Светлая и тёмная тема без артефактов
- [ ] `npm run build` без ошибок

**Commit:** `feat: auth layout`

---

### Step 1.5 — DashboardLayout

- [ ] Создать `resources/js/Layouts/DashboardLayout.vue`
- [ ] Боковое меню (sidebar): навигация по разделам кабинета
- [ ] Шапка: имя пользователя, `AppThemeToggle`, кнопка «Выйти»
- [ ] `<slot />` для контента
- [ ] На мобильном sidebar скрывается, открывается по кнопке

**Проверка:**
- [ ] Layout отображается корректно на 375px и 1280px
- [ ] Светлая и тёмная тема без артефактов
- [ ] `npm run build` без ошибок

**Commit:** `feat: dashboard layout`

---

### Step 1.6 — Base UI Components

- [ ] Создать `AppContainer.vue` — `max-w-*` обёртка с горизонтальными отступами
- [ ] Создать `AppSection.vue` — секция с `padding-y` и опциональным заголовком через `AppHeading`
- [ ] Создать `AppCard.vue` — обёртка над `UCard` с унифицированными отступами
- [ ] Создать `AppLogo.vue` — SVG или текст логотипа, принимает prop `size`
- [ ] Создать `AppButton.vue` — обёртка над `UButton`, prop `variant`: `primary` / `outline` / `ghost`
- [ ] Создать `AppHeading.vue` — теги `h1`–`h4` через prop `as`, опциональный `subtitle`
- [ ] Создать `AppStatCard.vue` — иконка + числовое значение + подпись, prop `icon`, `value`, `label`

**Проверка:**
- [ ] Каждый компонент отображается без ошибок в изоляции
- [ ] Все компоненты корректно применяют светлую и тёмную тему
- [ ] `npm run build` без ошибок

**Commit:** `feat: base ui component library`

---

## Phase 2 — Public Landing

### Step 2.1 — Hero Section

- [ ] Создать (или обновить) страницу `resources/js/Pages/Welcome.vue`
- [ ] Использовать `GuestLayout`
- [ ] Добавить секцию Hero: заголовок, подзаголовок, CTA-кнопка «Получить доступ» → `/register`
- [ ] Вёрстка адаптивна

**Проверка:**
- [ ] Страница `/` открывается без ошибок
- [ ] CTA-кнопка ведёт на `/register`
- [ ] Светлая / тёмная тема без артефактов
- [ ] `npm run build` без ошибок

**Commit:** `feat: landing hero section`

---

### Step 2.2 — Advantages Section

- [ ] Добавить секцию Advantages в `Welcome.vue`
- [ ] 6 карточек через `AppCard` + `UIcon`: «Быстрое подключение», «До 5 устройств», «Высокая скорость», «Все популярные платформы», «Безопасное подключение», «Удобный личный кабинет»
- [ ] Grid-вёрстка: 1 колонка на мобильном, 2 на планшете, 3 на десктопе

**Проверка:**
- [ ] Все 6 карточек отображаются корректно
- [ ] Адаптивность на 375px / 768px / 1280px
- [ ] `npm run build` без ошибок

**Commit:** `feat: landing advantages section`

---

### Step 2.3 — WelcomeController: передача тарифов

- [ ] Найти или создать `app/Http/Controllers/WelcomeController.php`
- [ ] В методе `index()` получить все активные `Plan` с отношением `products` (eager load)
- [ ] Передать данные в Inertia: `Inertia::render('Welcome', ['plans' => ...])`

**Проверка:**
- [ ] `php artisan route:list` показывает маршрут `/` → `WelcomeController@index`
- [ ] В Vue Devtools prop `plans` содержит данные из БД
- [ ] Нет N+1 запросов (проверить через Debugbar)

**Commit:** `feat: welcome controller with plans data`

---

### Step 2.4 — Pricing Section

- [ ] Добавить секцию Pricing в `Welcome.vue`
- [ ] Получить prop `plans` через `defineProps`
- [ ] Реализовать переключатель периода: `1 / 3 / 6 / 12 месяцев` (реактивный `ref`)
- [ ] Для каждого плана отображать: название, цену выбранного периода, CTA «Подключить»
- [ ] CTA «Подключить» ведёт на `/register` (или `/dashboard/payment/create` если авторизован)

**Проверка:**
- [ ] Переключение периода меняет цены без перезагрузки
- [ ] Данные берутся из props, не захардкожены
- [ ] `npm run build` без ошибок

**Commit:** `feat: landing pricing section with db-driven plans`

---

### Step 2.5 — Final CTA + Footer

- [ ] Добавить секцию Final CTA в `Welcome.vue`: повторный призыв к регистрации
- [ ] Вынести футер из `GuestLayout` в отдельный компонент `AppFooter.vue` (если не сделан в 1.3)
- [ ] Футер содержит: `AppLogo`, навигационные ссылки, копирайт

**Проверка:**
- [ ] Секция CTA и футер отображаются корректно на всех breakpoint'ах
- [ ] `npm run build` без ошибок

**Commit:** `feat: landing final cta and footer`

---

## Phase 3 — Authentication

### Step 3.1 — Register Page

- [ ] Создать `resources/js/Pages/Auth/Register.vue`
- [ ] Использовать `AuthLayout`
- [ ] Форма: имя, email, пароль, подтверждение пароля
- [ ] Подключить к существующему `RegisteredUserController` (или аналогу из аудита)
- [ ] Использовать `useForm` из `@inertiajs/vue3`
- [ ] Отображать ошибки валидации под полями

**Проверка:**
- [ ] Регистрация с валидными данными создаёт пользователя в БД
- [ ] Ошибки валидации отображаются корректно
- [ ] После регистрации редирект на dashboard
- [ ] `npm run build` без ошибок

**Commit:** `feat: register page`

---

### Step 3.2 — Login Page

- [ ] Создать `resources/js/Pages/Auth/Login.vue`
- [ ] Использовать `AuthLayout`
- [ ] Форма: email, пароль, «Запомнить меня»
- [ ] Подключить к существующему `AuthenticatedSessionController`
- [ ] Ссылки на регистрацию и восстановление пароля

**Проверка:**
- [ ] Вход с верными данными → редирект на dashboard
- [ ] Неверные данные → ошибка под формой
- [ ] `npm run build` без ошибок

**Commit:** `feat: login page`

---

### Step 3.3 — Trial Activation

- [ ] Найти место в коде где срабатывает создание триала (из аудита 0.4)
- [ ] Убедиться что после `RegisteredUserController` вызывается logic создания триала
- [ ] Убедиться что повторный вызов не создаёт второй триал (проверить условие)
- [ ] Если логики нет — создать `app/Actions/CreateTrialSubscriptionAction.php`
    - принимает `User`
    - проверяет: у пользователя нет ни одной подписки
    - создаёт `Subscription` со статусом `trial`, `ends_at = now()->addDays(3)`

**Проверка:**
- [ ] После регистрации нового пользователя в таблице `subscriptions` появляется запись со статусом `trial`
- [ ] Повторная регистрация / вызов action не создаёт вторую запись

**Commit:** `feat: auto trial activation on first registration`

---

### Step 3.4 — OAuth: VK, Yandex

- [ ] Добавить конфиг `vk`, `yandex` в `config/services.php`
- [ ] Добавить соответствующие переменные в `.env.example`
- [ ] Убедиться что `SocialiteController::callback` обрабатывает все четыре провайдера
- [ ] Добавить кнопки «Войти через VK», «Войти через Apple», «Войти через Yandex» на `Login.vue` и `Register.vue`

**Проверка:**
- [ ] Все 4 кнопки OAuth присутствуют на странице
- [ ] `php artisan route:list` показывает маршруты для всех провайдеров
- [ ] `npm run build` без ошибок

**Commit:** `feat: oauth vk, apple, yandex`

---

### Step 3.5 — Telegram Login Widget

- [ ] Добавить скрипт Telegram Login Widget на `Login.vue` и `Register.vue`
- [ ] Создать маршрут `GET /auth/telegram/callback`
- [ ] Создать метод `telegramCallback(Request $request)` в `SocialiteController`
    - верификация данных: HMAC-SHA256 по `BOT_TOKEN`
    - найти или создать пользователя в БД
    - авторизовать и редиректить на dashboard
- [ ] Добавить `TELEGRAM_BOT_TOKEN` в `.env.example`

**Проверка:**
- [ ] Виджет отображается на странице входа
- [ ] Авторизация через Telegram создаёт / находит пользователя в БД
- [ ] Невалидные данные от Telegram → ошибка 403
- [ ] `npm run build` без ошибок

**Commit:** `feat: telegram login widget`

---

## Phase 4 — User Dashboard

### Step 4.1 — DashboardController: структура данных

- [ ] Найти или создать `app/Http/Controllers/DashboardController.php`
- [ ] Метод `index()`: получить текущего пользователя с отношением `subscription`
- [ ] Подготовить массив данных для передачи в Inertia (пока из БД, без Remnawave):
    - `subscription.status`
    - `subscription.plan_name`
    - `subscription.ends_at`
    - заглушки для трафика и устройств
- [ ] Передать через `Inertia::render('Dashboard/Index', [...])`

**Проверка:**
- [ ] `php artisan route:list` показывает маршрут `/dashboard` → `DashboardController@index`
- [ ] Маршрут защищён middleware `auth`
- [ ] В Vue Devtools prop содержит ожидаемую структуру

**Commit:** `feat: dashboard controller with subscription data`

---

### Step 4.2 — Dashboard Index Page

- [ ] Создать `resources/js/Pages/Dashboard/Index.vue`
- [ ] Использовать `DashboardLayout`
- [ ] Получить props через `defineProps`
- [ ] Виджет «Статус подписки» через `AppStatCard`
- [ ] Виджет «Текущий тариф» через `AppStatCard`
- [ ] Виджет «Осталось дней» через `AppStatCard`
- [ ] Виджет «Использованный трафик» через `AppStatCard`
- [ ] Виджет «Количество устройств» через `AppStatCard`
- [ ] Виджет «Последнее подключение» через `AppStatCard`
- [ ] Виджет «Ссылка подключения»: текстовое поле + кнопка «Скопировать» (Clipboard API)

**Проверка:**
- [ ] Все виджеты отображаются на странице `/dashboard`
- [ ] Кнопка «Скопировать» копирует ссылку в буфер
- [ ] Светлая / тёмная тема без артефактов
- [ ] `npm run build` без ошибок

**Commit:** `feat: dashboard index page with widgets`

---

### Step 4.3 — Subscription Status UI

- [ ] В `Dashboard/Index.vue` добавить условный рендеринг по `subscription.status`:
    - `trial` → синий бейдж «Пробный период», кол-во оставшихся дней
    - `active` → зелёный бейдж «Активна»
    - `expired` → красный бейдж «Истекла», кнопка «Продлить»
    - `inactive` → серый бейдж «Неактивна», кнопка «Активировать»

**Проверка:**
- [ ] Каждый статус отображает нужный цвет и текст
- [ ] Кнопка «Продлить» / «Активировать» ведёт на страницу оплаты
- [ ] `npm run build` без ошибок

**Commit:** `feat: dashboard subscription status ui`

---

## Phase 5 — Remnawave API Integration

### Step 5.1 — Remnawave DTO

- [ ] Создать `app/Remnawave/DTO/SubscriptionData.php` или найти аналог DTO
    - публичные readonly-поля: `trafficLimitBytes`, `usedTrafficBytes`, `expireAt`, `status`, `subscriptionUrl`
    - статический конструктор `fromArray(array $data): self`

**Проверка:**
- [ ] Класс создаётся из тестового массива без ошибок
- [ ] `php artisan tinker`: `\App\Remnawave\DTO\SubscriptionData::fromArray([...])` возвращает объект

**Commit:** `feat: remnawave subscription dto`

---

### Step 5.2 — Remnawave Handler

- [ ] Создать (или дополнить) `app/Remnawave/Handlers/GetSubscriptionHandler.php` или найти аналог `Handler`
    - принимает `string $userId`
    - выполняет HTTP-запрос к Remnawave API
    - возвращает `SubscriptionData`
    - бросает исключение при ошибке API
- [ ] Зарегистрировать HTTP-клиент в `AppServiceProvider` (или в Handler через конструктор) - при необходимости
- [ ] Найти `REMNAWAVE_API_URL`, `REMNAWAVE_API_TOKEN` в `.env.example`

**Проверка:**
- [ ] `php artisan tinker`: вызов handler'а с реальным `userId` возвращает `SubscriptionData` или найденный аналог
- [ ] При недоступности API бросается понятное исключение
- [ ] `php artisan config:cache` без ошибок

**Commit:** `feat: remnawave get subscription handler`

---

### Step 5.3 — Dashboard: интеграция Remnawave данных

- [ ] Обновить `DashboardController::index()`:
    - вызвать `GetSubscriptionHandler` или его найденный аналог
    - при успехе — использовать данные из `SubscriptionData` или его аналога
    - при исключении — fallback на данные из модели `Subscription` в БД
- [ ] Обновить структуру Inertia props: добавить `traffic`, `subscriptionUrl`, реальный `expireAt`
- [ ] Обновить виджеты в `Dashboard/Index.vue` для отображения реальных данных трафика

**Проверка:**
- [ ] Дашборд отображает реальные данные из Remnawave API
- [ ] При отключённом API дашборд работает на fallback-данных без белого экрана
- [ ] `npm run build` без ошибок

**Commit:** `feat: dashboard synced with remnawave api`

---

## Phase 6 — Subscription Management

### Step 6.1 — SubscriptionController

- [ ] Создать `app/Http/Controllers/SubscriptionController.php`
- [ ] Метод `show()`: получить подписку текущего пользователя + данные из Remnawave
- [ ] Передать в Inertia: тариф, период, `ends_at`, стоимость продления, `subscriptionUrl`

**Проверка:**
- [ ] Маршрут `/dashboard/subscription` защищён middleware `auth`
- [ ] Данные корректно передаются в Inertia props

**Commit:** `feat: subscription controller`

---

### Step 6.2 — Subscription Page

- [ ] Создать `resources/js/Pages/Dashboard/Subscription.vue`
- [ ] Использовать `DashboardLayout`
- [ ] Отображать: тариф, период, дата окончания, стоимость продления
- [ ] Кнопка «Открыть инструкцию подключения» — ссылка на `subscriptionUrl` (открывать в новой вкладке)
- [ ] Кнопка «Продлить подписку» → `/dashboard/payment/create`

**Проверка:**
- [ ] Страница `/dashboard/subscription` отображается корректно
- [ ] Все данные берутся из props
- [ ] Светлая / тёмная тема без артефактов
- [ ] `npm run build` без ошибок

**Commit:** `feat: subscription management page`

---

## Phase 7 — YooKassa Payment

> Реализация строго по документации из репозитория библиотеки:
> `https://git.yoomoney.ru/projects/sdk/repos/yookassa-sdk-php/browse`
> Версия: `yoomoney/yookassa-sdk-php:3.13.2`

### Step 7.1 — Установка SDK

- [ ] Выполнить: `composer require yoomoney/yookassa-sdk-php:3.13.2`
- [ ] Убедиться что пакет появился в `composer.json` и `composer.lock`

**Проверка:**
- [ ] `composer show yoomoney/yookassa-sdk-php` показывает версию `3.13.2`
- [ ] `php artisan about` запускается без ошибок

**Commit:** `chore: install yookassa sdk 3.13.2`

---

### Step 7.2 — YooKassa конфигурация

- [ ] Создать `config/yookassa.php`:
  ```php
  return [
      'shop_id'     => env('YOOKASSA_SHOP_ID'),
      'secret_key'  => env('YOOKASSA_SECRET_KEY'),
      'return_url'  => env('YOOKASSA_RETURN_URL', '/dashboard/payment/success'),
      'webhook_url' => env('YOOKASSA_WEBHOOK_URL', '/webhooks/yookassa'),
  ];
  ```
- [ ] Добавить `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`, `YOOKASSA_RETURN_URL`, `YOOKASSA_WEBHOOK_URL` в `.env.example`
- [ ] Добавить binding в `AppServiceProvider`:
  ```php
  $this->app->singleton(\YooKassa\Client::class, function () {
      $client = new \YooKassa\Client();
      $client->setAuth(config('yookassa.shop_id'), config('yookassa.secret_key'));
      return $client;
  });
  ```

**Проверка:**
- [ ] `php artisan config:cache` без ошибок
- [ ] `php artisan tinker`: `app(\YooKassa\Client::class)` возвращает объект клиента

**Commit:** `chore: yookassa config and service provider binding`

---

### Step 7.3 — CreatePaymentAction

- [ ] Создать (или обновить) `app/Actions/Payment/CreateYooKassaPaymentAction.php`
- [ ] Конструктор принимает `\YooKassa\Client $client` (через DI)
- [ ] Метод `execute(User $user, Product $product, ?Promocode $promocode): Payment`:
    - рассчитать итоговую сумму с учётом промокода
    - сформировать `CreatePaymentRequest` через builder из документации SDK:
        - `setAmount()`, `setCurrency(CurrencyCode::RUB)`, `setCapture(true)`
        - `setDescription()`
        - `setConfirmation(['type' => ConfirmationType::REDIRECT, 'returnUrl' => ...])`
        - `setMetadata(['order_id' => ..., 'user_id' => ...])`
    - вызвать `$client->createPayment($request, uniqid('', true))`
    - создать запись в модели `Payment` с `yookassa_payment_id` и статусом `pending`
    - вернуть модель `Payment`

**Проверка:**
- [ ] `php artisan tinker`: action создаёт запись в таблице `payments`
- [ ] Возвращаемый объект содержит `confirmation.confirmation_url`

**Commit:** `feat: create yookassa payment action`

---

### Step 7.4 — PaymentController: create

- [ ] Найти или создать `app/Http/Controllers/PaymentController.php`
- [ ] Метод `create()`: передать в Inertia планы и текущую подписку
- [ ] Метод `store(Request $request)`:
    - валидировать `product_id`, опциональный `promocode`
    - вызвать `CreateYooKassaPaymentAction`
    - редиректить на `$payment->confirmation_url`

**Проверка:**
- [ ] Маршруты `GET /dashboard/payment/create` и `POST /dashboard/payment` защищены `auth`
- [ ] POST с валидными данными возвращает редирект на URL YooKassa

**Commit:** `feat: payment controller create and store`

---

### Step 7.5 — Payment Create Page

- [ ] Создать `resources/js/Pages/Dashboard/Payment/Create.vue`
- [ ] Использовать `DashboardLayout`
- [ ] Выбор тарифа и периода (если не передан из предыдущей страницы)
- [ ] Поле ввода промокода + кнопка «Применить» (AJAX-запрос)
- [ ] Отображение итоговой суммы (реактивно обновляется)
- [ ] Кнопка «Оплатить» → `useForm` POST на `/dashboard/payment`

**Проверка:**
- [ ] Страница отображается корректно
- [ ] Ввод промокода обновляет сумму
- [ ] Кнопка «Оплатить» редиректит на страницу YooKassa
- [ ] `npm run build` без ошибок

**Commit:** `feat: payment create page`

---

### Step 7.6 — Payment Success & Cancel Pages

- [ ] Создать `resources/js/Pages/Dashboard/Payment/Success.vue`
    - сообщение об успешной оплате
    - кнопка «Перейти в кабинет»
- [ ] Создать `resources/js/Pages/Dashboard/Payment/Cancel.vue`
    - сообщение об отмене
    - кнопка «Попробовать снова»
- [ ] Добавить маршруты `GET /dashboard/payment/success` и `GET /dashboard/payment/cancel`

**Проверка:**
- [ ] Обе страницы открываются без ошибок
- [ ] `npm run build` без ошибок

**Commit:** `feat: payment success and cancel pages`

---

### Step 7.7 — YooKassa Webhook: маршрут и middleware

- [ ] Добавить маршрут `POST /webhooks/yookassa` → `WebhookController@yookassa`
- [ ] Исключить маршрут из CSRF-защиты в `bootstrap/app.php` (или `VerifyCsrfToken`)
- [ ] Создать `app/Http/Controllers/WebhookController.php`

**Проверка:**
- [ ] `php artisan route:list` показывает маршрут `/webhooks/yookassa`
- [ ] POST-запрос без CSRF-токена возвращает не 419

**Commit:** `feat: yookassa webhook route and controller skeleton`

---

### Step 7.8 — YooKassa Webhook: обработка событий

- [ ] В `WebhookController::yookassa(Request $request)`:
    - получить и проверить IP-адрес источника (список IP YooKassa из документации SDK)
    - получить тело запроса: `$request->getContent()`
    - распарсить уведомление согласно документации SDK
    - обработать событие `payment.succeeded`:
        - найти `Payment` по `yookassa_payment_id`
        - обновить статус `Payment` на `succeeded`
        - продлить `Subscription`: `ends_at = max(ends_at, now()) + purchased_period`
    - обработать событие `payment.canceled`:
        - найти `Payment` по `yookassa_payment_id`
        - обновить статус `Payment` на `canceled`
    - вернуть HTTP 200

**Проверка:**
- [ ] Симуляция webhook `payment.succeeded` → подписка продлевается в БД
- [ ] Симуляция webhook `payment.canceled` → статус платежа обновляется
- [ ] Запрос с неизвестного IP → 403
- [ ] `php artisan test` для webhook-handler без ошибок

**Commit:** `feat: yookassa webhook handler`

---

## Phase 8 — Promocodes

### Step 8.1 — PromoValidationAction

- [ ] Создать (или воспользоваться найденным сервисом и дополнить) `app/Actions/Promocode/ValidatePromocodeAction.php`
    - принимает `string $code`, `User $user`, `Product $product`
    - проверяет: промокод существует, активен, не использован этим пользователем, не истёк
    - возвращает `Promocode` или бросает `InvalidPromocodeException`

**Проверка:**
- [ ] `php artisan tinker`: валидный промокод возвращает объект `Promocode`
- [ ] Невалидный / использованный → исключение

**Commit:** `feat: validate promocode action`

---

### Step 8.2 — PromoController: валидация через AJAX

- [ ] Найти или создать метод `validate` в `PaymentController` (или отдельный `PromocodeController`)
- [ ] Маршрут `POST /promocode/validate`: принимает `code` и `product_id`, возвращает JSON с `discount` и `final_price`

**Проверка:**
- [ ] Валидный промокод → JSON `{ discount, final_price }`
- [ ] Невалидный → JSON с ошибкой и HTTP 422

**Commit:** `feat: promocode validation api endpoint`

---

### Step 8.3 — Promocode UI на странице оплаты

- [ ] В `Payment/Create.vue`: поле ввода промокода + кнопка «Применить»
- [ ] Кнопка делает `axios.post('/promocode/validate', { code, product_id })`
- [ ] При успехе: показать скидку, обновить итоговую сумму реактивно
- [ ] При ошибке: показать сообщение под полем

**Проверка:**
- [ ] Валидный промокод → отображается скидка и новая сумма
- [ ] Невалидный → ошибка под полем
- [ ] `npm run build` без ошибок

**Commit:** `feat: promocode ui on payment page`

---

### Step 8.4 — Auto-apply промокода из URL

- [ ] Создать middleware `app/Http/Middleware/CapturePromocode.php`:
    - если в запросе есть `?promo=CODE`, сохранить в `session('promo_code', $code)`
- [ ] Зарегистрировать middleware на маршрутах `/` и `/register`
- [ ] В `Payment/Create.vue`: при загрузке страницы читать `promo_code` из Inertia shared props
- [ ] В `DashboardController` (или отдельном middleware) передавать `promo_code` из сессии в shared props

**Проверка:**
- [ ] Переход на `/?promo=TEST` сохраняет промокод в сессии
- [ ] На странице оплаты поле промокода автоматически заполняется
- [ ] `npm run build` без ошибок

**Commit:** `feat: auto-apply promocode from url param`

---

## Phase 9 — Referral System

### Step 9.1 — Referral маршрут и сохранение в сессию

- [ ] Добавить маршрут `GET /ref/{code}` → `ReferralController@redirect`
- [ ] Создать `app/Http/Controllers/ReferralController.php`
- [ ] Метод `redirect(string $code)`:
    - найти пользователя по реферальному коду
    - если найден — сохранить `session('referrer_id', $user->id)` или в БД в существующую таблицу
    - редирект на `/register`

**Проверка:**
- [ ] Переход на `/ref/VALIDCODE` сохраняет `referrer_id` в сессии или в БД в существующую таблицу и редиректит на `/register`
- [ ] Невалидный код → редирект на `/register` без записи в сессию

**Commit:** `feat: referral redirect and session capture`

---

### Step 9.2 — Привязка реферала при регистрации

- [ ] В `RegisteredUserController` (или `RegisterAction`) после создания пользователя:
    - прочитать `session('referrer_id')`
    - если есть — вызвать существующую реферальную механику (из аудита 0.4)
    - очистить `session('referrer_id')`

**Проверка:**
- [ ] Регистрация после перехода по реф. ссылке создаёт запись в таблице `referrals`
- [ ] Повторная регистрация без реф. ссылки не создаёт запись

**Commit:** `feat: referral binding on registration`

---

### Step 9.3 — Referral Dashboard Widget

- [ ] Обновить `DashboardController::index()`: добавить в props `referral_link`, `referrals_count`, `referral_bonus`
- [ ] Добавить в `Dashboard/Index.vue` виджет реферальной программы:
    - личная ссылка + кнопка «Скопировать»
    - количество приглашённых
    - начисленные бонусы

**Проверка:**
- [ ] Реферальная ссылка корректно формируется и копируется
- [ ] Данные берутся из БД через props
- [ ] `npm run build` без ошибок

**Commit:** `feat: referral dashboard widget`

---

## Phase 10 — Support Tickets

### Step 10.1 — TicketController: index и create

- [ ] Создать `app/Http/Controllers/TicketController.php`
- [ ] Метод `index()`: получить тикеты текущего пользователя (с пагинацией), передать в Inertia
- [ ] Метод `create()`: передать пустую форму в Inertia
- [ ] Метод `store(Request $request)`: валидировать `subject` и `message`, создать `Ticket` + первый `TicketMessage`
- [ ] Добавить маршруты: `GET /dashboard/tickets`, `GET /dashboard/tickets/create`, `POST /dashboard/tickets`

**Проверка:**
- [ ] `php artisan route:list` показывает три маршрута
- [ ] POST создаёт `Ticket` и `TicketMessage` в БД

**Commit:** `feat: ticket controller index, create, store`

---

### Step 10.2 — Tickets List & Create Pages

- [ ] Создать `resources/js/Pages/Dashboard/Tickets/Index.vue`
    - список тикетов: тема, статус (`open` / `closed`), дата, ссылка на тикет
    - кнопка «Создать тикет»
- [ ] Создать `resources/js/Pages/Dashboard/Tickets/Create.vue`
    - форма: `subject` + `message` (textarea)
    - `useForm` POST на `/dashboard/tickets`

**Проверка:**
- [ ] Список тикетов отображается с пагинацией
- [ ] Создание тикета → редирект на список
- [ ] `npm run build` без ошибок

**Commit:** `feat: tickets list and create pages`

---

### Step 10.3 — TicketController: show и close

- [ ] Метод `show(Ticket $ticket)`: проверить Policy (пользователь — владелец), передать тикет с сообщениями в Inertia
- [ ] Метод `close(Ticket $ticket)`: обновить статус на `closed`
- [ ] Добавить `TicketPolicy`: только владелец может просматривать и закрывать
- [ ] Добавить маршруты: `GET /dashboard/tickets/{ticket}`, `PATCH /dashboard/tickets/{ticket}/close`

**Проверка:**
- [ ] Чужой тикет → 403
- [ ] Закрытие тикета меняет статус в БД

**Commit:** `feat: ticket controller show and close`

---

### Step 10.4 — Ticket Detail Page

- [ ] Создать `resources/js/Pages/Dashboard/Tickets/Show.vue`
    - заголовок тикета, статус
    - список сообщений в хронологическом порядке
    - кнопка «Закрыть тикет» (показывать только если статус `open`)

**Проверка:**
- [ ] Страница тикета отображает все сообщения
- [ ] Кнопка «Закрыть» меняет статус без перезагрузки
- [ ] `npm run build` без ошибок

**Commit:** `feat: ticket detail page`

---

## Phase 11 — Notifications

### Step 11.1 — Subscription expiry: shared prop

- [ ] В `DashboardLayout` или через Inertia middleware добавить в shared props:
    - `subscription_expires_soon: bool` — `true` если `expireAt <= now()->addDays(3)`
    - `subscription_expired: bool` — `true` если `expireAt < now()`
- [ ] Данные брать из Remnawave DTO (с fallback на модель `Subscription`)

**Проверка:**
- [ ] При `expireAt = now()->addDays(2)` prop `subscription_expires_soon = true`
- [ ] При `expireAt = now()->subDay()` prop `subscription_expired = true`

**Commit:** `feat: subscription expiry shared props`

---

### Step 11.2 — Notification Banners

- [ ] Создать `resources/js/Components/App/AppSubscriptionBanner.vue`
    - принимает props `expiresSoon` и `expired`
    - если `expiresSoon && !expired` → жёлтый баннер «Подписка заканчивается через N дней. Продлить →»
    - если `expired` → красный баннер «Подписка завершилась. Продлить →»
    - ссылка «Продлить» → `/dashboard/payment/create`
- [ ] Добавить `AppSubscriptionBanner` в `DashboardLayout.vue` над `<slot />`

**Проверка:**
- [ ] При `expiresSoon = true` отображается жёлтый баннер
- [ ] При `expired = true` отображается красный баннер
- [ ] При активной подписке баннеры не отображаются
- [ ] `npm run build` без ошибок

**Commit:** `feat: subscription expiry notification banners`

---

## Phase 12 — QA & Production Readiness

### Step 12.1 — Route audit

- [ ] Запустить `php artisan route:list` и проверить все маршруты:
    - все dashboard-маршруты защищены middleware `auth`
    - `/webhooks/yookassa` исключён из `auth` и CSRF
    - публичные маршруты (`/`, `/auth/*`, `/ref/*`) доступны без авторизации

**Проверка:**
- [ ] Нет маршрутов без нужных middleware

**Commit:** `chore: route audit and middleware fixes`

---

### Step 12.2 — Policy audit

- [ ] Проверить `TicketPolicy`: только владелец
- [ ] Проверить `SubscriptionPolicy`: только владелец
- [ ] Проверить `PaymentPolicy`: только владелец
- [ ] Убедиться что все Policy зарегистрированы в `AuthServiceProvider`

**Проверка:**
- [ ] Обращение к чужому ресурсу возвращает 403

**Commit:** `chore: policy audit and registration fixes`

---

### Step 12.3 — N+1 audit

- [ ] Включить Laravel Debugbar в dev-окружении
- [ ] Пройти по страницам: `/`, `/dashboard`, `/dashboard/subscription`, `/dashboard/tickets`
- [ ] Найти и устранить все N+1 запросы через eager loading (`with()`)

**Проверка:**
- [ ] Каждая страница делает фиксированное число запросов независимо от кол-ва записей

**Commit:** `perf: fix n+1 queries with eager loading`

---

### Step 12.4 — Responsive & Dark Mode audit

- [ ] Проверить каждую страницу в светлой теме на 375px, 768px, 1280px:
    - `/` (лендинг)
    - `/login`, `/register`
    - `/dashboard`
    - `/dashboard/subscription`
    - `/dashboard/payment/create`
    - `/dashboard/tickets`
- [ ] Повторить в тёмной теме
- [ ] Исправить все найденные визуальные баги

**Проверка:**
- [ ] Нет горизонтального скролла на мобильном
- [ ] Нет текста / элементов выходящих за пределы контейнера
- [ ] `npm run build` без ошибок

**Commit:** `fix: responsive and dark mode fixes`

---

### Step 12.5 — SSR Final Check

- [ ] Запустить SSR-сборку: `npm run build`
- [ ] Запустить SSR-сервер: `node bootstrap/ssr/ssr.js` (или аналог)
- [ ] Проверить каждую публичную страницу на наличие гидратационных ошибок в консоли
- [ ] Исправить все `window is not defined` и аналогичные SSR-ошибки

**Проверка:**
- [ ] В консоли браузера нет `[Vue warn]: Hydration mismatch`
- [ ] `npm run build` без ошибок и предупреждений

**Commit:** `chore: ssr final fixes`

---

### Step 12.6 — Production Checklist

- [ ] Установить `APP_ENV=production`, `APP_DEBUG=false` в `.env`
- [ ] Запустить `npm run build` — нет ошибок
- [ ] Запустить `php artisan optimize` — нет ошибок
- [ ] Запустить `php artisan migrate --force` на staging-окружении
- [ ] Проверить все переменные окружения: `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`, `REMNAWAVE_API_URL`, `REMNAWAVE_API_TOKEN`, OAuth-ключи, `TELEGRAM_BOT_TOKEN`
- [ ] Убедиться что webhook-URL зарегистрирован в личном кабинете YooKassa

**Проверка:**
- [ ] Приложение запускается в production-режиме без ошибок
- [ ] Все критические flow работают на staging

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
