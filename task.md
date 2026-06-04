# IMPLEMENTATION_ROADMAP.md

# VPN Access Service — Implementation Roadmap

## Overview

Цель проекта — создать современный публичный сайт и личный кабинет для сервиса доступа к привычным инструментам для работы и общения.

Проект реализуется на существующей кодовой базе Laravel и должен максимально переиспользовать уже существующую бизнес-логику.

Перед началом любой реализации необходимо провести аудит проекта и определить существующие модели, сервисы, API-клиенты, DTO, миграции и бизнес-процессы. Такой подход снижает риск дублирования логики и архитектурного дрейфа. :contentReference[oaicite:0]{index=0}

---

# Global Rules

## Rule 1

Не создавать новые сущности, если аналогичные уже существуют в проекте.

---

## Rule 2

Существующий код является источником истины.

В первую очередь изучить:

- Models
- Services
- DTO
- Enums
- Migrations
- Seeders
- API Clients
- Actions
- Policies

---

## Rule 3

Перед каждой фазой выполнять анализ зависимостей.

Если необходимая логика уже существует:

- переиспользовать;
- расширять;
- не переписывать.

---

## Rule 4

После завершения каждой фазы:

- запуск тестов;
- проверка SSR;
- проверка TypeScript;
- проверка сборки.

---

# Phase 0 — Project Audit

## Goal

Полностью понять текущую архитектуру проекта.

## Tasks

### Backend Audit

Проанализировать:

- User
- Plan
- Product
- Subscription
- Payment
- Promocode
- Referral
- Ticket

---

### Business Logic Audit

Найти:

- регистрацию
- авторизацию
- триалы
- платежи
- промокоды
- рефералы

---

### API Audit

Найти интеграции с Xray API.

Определить:

- существующие клиенты
- DTO
- сервисы
- контракты

---

### Deliverables

Создать:

```text
docs/audit/models.md
docs/audit/services.md
docs/audit/api.md
docs/audit/business-flows.md
```

---

### Success Criteria

- структура проекта полностью описана
- все ключевые сущности найдены
- найден способ получения данных из Xray API

---

# Phase 1 — Frontend Foundation

## Goal

Создать дизайн-систему проекта.

## Tasks

### Layouts

Создать:

```text
layouts/
 ├─ GuestLayout
 ├─ AuthLayout
 └─ DashboardLayout
```

---

### Theme System

Реализовать:

- Light Theme
- Dark Theme

Сохранение темы:

```text
localStorage
```

---

### UI Components

Создать базовые компоненты:

```text
AppContainer
AppSection
AppCard
AppLogo
AppButton
AppHeading
AppStatCard
AppThemeToggle
```

---

### Success Criteria

- работает переключение темы
- существует единый дизайн-кит
- SSR работает корректно

---

# Phase 2 — Public Landing

## Goal

Создать публичный сайт.

## Sections

### Hero

Содержимое:

```text
Быстрый и стабильный доступ
к привычным инструментам
для работы и общения
```

CTA:

```text
Получить доступ
```

---

### Advantages

Карточки преимуществ:

- Быстрое подключение
- До 5 устройств
- Высокая скорость
- Все популярные платформы
- Безопасное подключение
- Удобный личный кабинет

---

### Pricing

Получение тарифов из существующих моделей.

Отображать:

- Лимитный
- Безлимитный

Периоды:

- 1 месяц
- 3 месяца
- 6 месяцев
- 12 месяцев

---

### Final CTA

Повторный призыв к регистрации.

---

### Success Criteria

- лендинг полностью адаптивен
- SSR работает
- все данные берутся из БД

---

# Phase 3 — Authentication

## Goal

Реализовать регистрацию и вход.

## Registration

Поддержать:

- Email + Password
- Telegram Login Widget
- Google OAuth
- Apple OAuth
- VK OAuth

---

## Login

Поддержать все способы входа.

---

## Trial

После первой регистрации:

```text
3 дня Trial
```

Только один раз на аккаунт.

---

### Success Criteria

- все способы входа работают
- триал создается автоматически
- повторный триал невозможен

---

# Phase 4 — User Dashboard

## Goal

Создать основной кабинет пользователя.

## Dashboard Widgets

Отображать:

- Статус подписки
- Текущий тариф
- Осталось дней
- Использованный трафик
- Количество устройств
- Последнее подключение
- Ссылка подключения

---

## Statuses

Поддержать:

```text
trial
active
expired
blocked
```

---

### Success Criteria

- данные отображаются корректно
- информация синхронизируется с API

---

# Phase 5 — Xray API Integration

## Goal

Подключить реальные данные подписки.

## Source Of Truth

### Laravel

Хранит:

- пользователей
- платежи
- подписки
- промокоды

### Xray API

Хранит:

- traffic
- subscriptionUrl
- expireAt
- status
- usage

---

## Tasks

Создать:

```text
Services/Xray
DTO/Xray
Actions/Xray
```

при необходимости.

---

## Dashboard Sync

Получать:

- trafficLimitBytes
- usedTrafficBytes
- expireAt
- status
- subscriptionUrl

---

### Success Criteria

- кабинет использует реальные данные API
- ошибки API обрабатываются корректно

---

# Phase 6 — Subscription Management

## Goal

Создать страницу управления подпиской.

## Page Contents

Отображать:

- тариф
- период
- дата окончания
- стоимость продления
- ссылка подключения

---

## Connection Link

Использовать:

```json
subscriptionUrl
```

из API.

---

### Success Criteria

- пользователь может перейти к инструкции подключения
- отображаются актуальные данные

---

# Phase 7 — YooKassa Integration

## Goal

Подключить оплату подписки.

## Flow

```text
Select Product
↓
Apply Promocode
↓
Create Payment
↓
Redirect YooKassa
↓
Success Page
↓
Webhook
↓
Extend Subscription
```

---

## Webhooks

Обязательно использовать webhook.

---

## Subscription Extension

Если подписка активна:

```text
existing_end_date + purchased_period
```

---

### Success Criteria

- успешная оплата продлевает подписку
- webhook корректно обрабатывается

---

# Phase 8 — Promocodes

## Goal

Подключить промокоды.

## Features

Поддержать:

- ручной ввод
- автоматическое применение

---

## Types

Поддержать:

```text
percent
fixed
```

---

### Success Criteria

- скидка рассчитывается корректно
- используются существующие модели

---

# Phase 9 — Referral System

## Goal

Реализовать реферальную программу.

## Features

Пользователь получает:

```text
/ref/{code}
```

---

При регистрации:

- фиксировать пригласившего пользователя
- применять бонусную механику существующей реализации

---

### Success Criteria

- реферальные связи сохраняются
- бонусы применяются

---

# Phase 10 — Support Tickets

## Goal

Минимальная система поддержки.

## Fields

```text
Subject
Message
Status
```

---

## Statuses

```text
open
closed
```

---

### Success Criteria

- пользователь может создать тикет
- администратор может обработать тикет

---

# Phase 11 — Notifications

## Goal

Отображать предупреждения о подписке.

## Events

За 3 дня до окончания:

```text
Подписка скоро закончится
```

---

После окончания:

```text
Подписка завершилась
```

---

### Success Criteria

- уведомления отображаются корректно

---

# Phase 12 — QA & Production Readiness

## Goal

Подготовка к релизу.

## Validation Checklist

### Backend

- маршруты проверены
- политики проверены
- API обработчики покрыты тестами

---

### Frontend

- mobile responsive
- dark mode
- light mode
- SSR

---

### Performance

- отсутствуют N+1 запросы
- используется eager loading

---

### Final Acceptance Criteria

- пользователь может зарегистрироваться
- пользователь получает триал
- пользователь видит состояние подписки
- пользователь может оплатить продление
- пользователь может применить промокод
- пользователь может использовать реферальную ссылку
- пользователь может открыть ссылку подключения
- пользователь может создать тикет поддержки
- сайт полностью работает через Inertia SSR
