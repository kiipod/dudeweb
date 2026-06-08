# Roadmap Project

## Project Overview

Разработать новый публичный сайт и личный кабинет пользователя для сервиса доступа к привычным инструментам для работы и общения.

Сервис не позиционируется как VPN-сервис в интерфейсе, текстах и маркетинговых материалах.

Основные задачи:

* привлечение пользователей через лаконичный лендинг;
* регистрация и выдача триального периода;
* управление подпиской;
* отображение состояния аккаунта;
* оплата через ЮKassa;
* получение ссылки на подключение;
* минимальная система поддержки.

---

# Technology Stack

## Backend

* Laravel 13
* PHP 8.5+
* InertiaJS 3
* Laravel SSR

## Frontend

* Vue 3
* TypeScript
* TailwindCSS v4
* Nuxt UI Vue

---

# Architecture Rules

## Existing Code First

Перед началом реализации агент обязан провести аудит существующего проекта.

Не создавать новые сущности, если они уже существуют.

В первую очередь анализировать и переиспользовать:

* Models
* Migrations
* Services
* DTO
* Enums
* Remnawave API Clients
* Repositories
* Policies
* Actions
* Seeders

---

## Existing Business Logic Is Source Of Truth

Текущий код проекта является основным источником бизнес-логики.

Любая новая реализация должна расширять существующие механизмы, а не заменять их.

---

## Required Audit Phase

Перед началом реализации необходимо сформировать:

```text
docs/audit/models.md
docs/audit/services.md
docs/audit/api.md
docs/audit/business-flows.md
```

---

# Product Positioning

Основной заголовок:

> Быстрый и стабильный доступ к привычным инструментам для работы и общения

Не использовать:

* VPN
* VPN сервис
* Прокси
* обход блокировок
* анонимайзер

Допустимые формулировки:

* подключение
* доступ
* сервис
* работа
* инструменты
* общение
* стабильное соединение

---

# Design System

## Design Philosophy

Интерфейс должен напоминать современные developer-first SaaS продукты.

### Reference Projects

* Cursor
* JetBrains
* OpenRouter
* LM Studio
* Woaibench
* Qwen Cloud

### Design Principles

* минимализм;
* большое количество воздуха;
* высокая читаемость;
* минимум декоративных элементов;
* быстрый визуальный сканинг интерфейса;
* предсказуемое поведение элементов;
* focus on content.

---

## Theme

Поддерживаются:

* Light Theme
* Dark Theme

Dark Theme является основным режимом.

Light Theme — альтернативным.

По умолчанию использовать системную тему пользователя.

---

## Color Philosophy

Использовать нейтральную палитру.

Основной акцент:

```text
Indigo
Violet
Blue
```

в минимальном количестве.

Избегать:

* ярко-красных поверхностей;
* кислотных цветов;
* большого количества акцентных цветов одновременно.

---

## Typography

### Preferred Combination

```text
Headings: JetBrains Mono
Body: Geist
Technical Elements: JetBrains Mono
```

---

### Allowed UI Fonts

Приоритет:

1. Geist
2. Inter
3. Manrope

---

### JetBrains Mono Usage

Использовать для:

* логотипа;
* тарифов;
* стоимости;
* статистики;
* промокодов;
* реферальных кодов;
* технической информации.

Не использовать JetBrains Mono как основной текстовый шрифт интерфейса.

---

## Icon System

Использовать только встроенные иконки Nuxt UI.

Предпочтение:

```text
Lucide
```

Допустимо:

```text
Heroicons
```

Не подключать сторонние наборы иконок.

---

## Layout System

### Max Width

```text
Landing: 1280px
Dashboard: 1440px
Content: 768px
```

---

### Grid

Использовать:

```text
12-column grid
```

---

### Section Spacing

Desktop:

```text
py-24
py-32
```

Mobile:

```text
py-12
py-16
```

---

## Border Radius

Использовать:

```text
rounded-xl
rounded-2xl
```

Избегать:

```text
rounded-none
rounded-sm
```

---

## Shadows

Минимальные.

Приоритет:

```text
border
contrast
layering
```

вместо тяжёлых теней.

---

## Cards

Карточки должны выглядеть как панели инструментов.

Не использовать:

* маркетинговые баннеры;
* стеклянные эффекты;
* heavy blur;
* excessive glow.

---

## Animations

Разрешены:

* hover
* opacity
* scale
* translateY
* transition

Длительность:

```text
150ms - 250ms
```

Запрещены:

* parallax;
* moving backgrounds;
* heavy motion;
* long animations.

---

## Background System

### Primary

Сплошной фон.

```text
Light: #FFFFFF
Dark: #0A0A0B
```

---

### Secondary

Очень слабые radial gradients.

Только по краям экрана.

---

### Optional

Лёгкий noise слой.

Требования:

```text
opacity < 3%
```

---

## Forbidden Backgrounds

Не использовать:

* изображения;
* иллюстрации на фоне;
* сетки высокой контрастности;
* анимированные паттерны;
* сложные SVG-паттерны.

---

## Visual Goal

Интерфейс должен ощущаться как:

```text
Developer Tool
Modern SaaS
Productivity App
```

а не как маркетинговый лендинг.

---

# Landing

## Sections

### Hero

Содержит:

* заголовок;
* подзаголовок;
* CTA.

CTA:

```text
Получить доступ
```

Переход на регистрацию.

---

### Advantages

Карточки:

* Быстрое подключение
* До 5 устройств
* Высокая скорость
* Все популярные платформы
* Безопасное подключение
* Удобный личный кабинет

---

### Pricing

Использовать существующие Plan и Product модели.

Тарифы:

* Лимитный
* Безлимитный

Периоды:

* 1 месяц
* 3 месяца
* 6 месяцев
* 12 месяцев

---

### Final CTA

Повторный призыв к регистрации.

---

# Authentication

Поддерживаемые способы:

* Email + Password
* Telegram Login Widget
* Google OAuth
* Apple OAuth
* VK OAuth
* Yandex OAuth

Не использовать:

* Email Verification
* 2FA

---

# Trial

После регистрации:

* Trial
* 3 дня

Только один раз на аккаунт.

---

# Dashboard

Отображать:

* Статус подписки
* Текущий тариф
* Дата окончания
* Использованный трафик
* Количество устройств
* Последнее подключение
* Ссылка подключения

Статусы:

* trial
* active
* expired
* blocked

---

# Subscription

Отображать:

* тариф;
* продукт;
* дата окончания;
* стоимость продления;
* промокод;
* кнопка оплаты;
* ссылка подключения.

Использовать subscriptionUrl из Remnawave API.

---

# Payments

Провайдер:

ЮKassa

Flow:

```text
Select Product
→ Apply Promocode
→ Create Payment
→ Redirect YooKassa
→ Success Page
→ Webhook
→ Extend Subscription
```

Продление:

```text
current_expire_at + purchased_period
```

---

# Promocodes

Поддержать:

* manual apply;
* automatic apply.

Типы:

* percent
* fixed

Использовать существующую реализацию.

---

# Referrals

Формат ссылки:

```text
/ref/{code}
```

При регистрации:

* сохранять пригласившего пользователя;
* применять существующую бонусную логику.

---

# Support

Минимальная система тикетов.

Поля:

* subject
* message
* status

Статусы:

* open
* closed

---

# Notifications

Показывать:

* подписка заканчивается через 3 дня;
* подписка закончилась.

Email уведомления не используются.

---

# External API

Используется Remnawave API.

Laravel хранит:

* пользователей;
* подписки;
* платежи;
* промокоды;
* рефералов.

API предоставляет:

* traffic;
* subscriptionUrl;
* status;
* expireAt;
* usage statistics.

---

# SSR

Все страницы должны корректно работать через Laravel SSR.

---

# Non Goals

Не реализовывать:

* блог;
* SEO разделы;
* мультиязычность;
* серверную карту;
* управление серверами;
* автопродление;
* email verification;
* 2FA;
* CRM поддержки.

---

# Implementation Phases

1. Project Audit
2. Frontend Foundation
3. Landing
4. Authentication
5. Trial Flow
6. Dashboard
7. Remnawave Integration
8. Subscription Management
9. YooKassa Integration
10. Promocodes
11. Referrals
12. Support Tickets
13. Notifications
14. SSR Validation
15. Testing
16. Production Readiness
