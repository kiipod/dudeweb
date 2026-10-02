# AGENTS.md

Инструкции для AI-агентов, работающих с этим репозиторием. Стек: **PHP 8.5, Laravel 13, Inertia 3, Vue 3, Nuxt UI для Vue, Tailwind 4, Vite 8, Composer, npm**.

---

## 1. Обзор проекта

- Монолит на Laravel с Inertia.js — SPA-подобный фронтенд без отдельного REST API для UI.
- Backend: PHP 8.5 (typed properties, enums, readonly properties, fibers где уместно) + Laravel Telegraph для бота + MoonShine админ-панель.
- Frontend: Vue 3 (`<script setup>`, Composition API) + Inertia 3 + Nuxt UI + Tailwind 4 (CSS-first конфиг через `@theme`, без `tailwind.config.js` по умолчанию).
- Сборка: Vite 8 + `laravel-vite-plugin`.
- Пакетные менеджеры: Composer (PHP), npm (JS). Не используй yarn/pnpm, если не указано иное в `packageManager` или README.

## 2. Структура репозитория

```
app/
  Bot/              # бизнес-логика для Laravel Telegraph бота
  Helpers/          # кастомные хелперы для кода
  Http/
    Controllers/    # тонкие контроллеры, только оркестрация
    Requests/       # FormRequest — вся валидация здесь
    Middleware/
  Models/
  Moonshine/        # бизнес-логика админ-панели MoonShine v4
  Policies/
  Services/
  Remnawave/        # API для общения с панелью VPN-сервиса
  Repositories/     # для запросов в БД
database/
  migrations/
  factories/
  seeders/
docker/             # Docker настройки для prod окружения
resources/
  js/
    Pages/          # Inertia-страницы (Vue SFC)
    Components/     # переиспользуемые Vue-компоненты
    Layouts/
    Composables/    # useXxx() — общая реактивная логика
  css/
    app.css         # Tailwind 4 @import + @theme
routes/
  web.php
tests/
  Feature/
  Unit/
```

## 3. Команды окружения

```bash
composer install
npm install
npm run build

cp .env.example .env
php artisan key:generate

make dev-start                      # для запуска Docker dev окружения через Sail
make dev-migrate                    # для запуска миграций
```
Остальные полезные команды находятся в Makefile.

## 4. Стиль кода PHP / Laravel

- **PSR-12** + Laravel-конвенции, форматирование через **Laravel Pint** (`./vendor/bin/pint --dirty` перед коммитом).
- Строгая типизация: `declare(strict_types=1);` в новых файлах, где это принято в проекте.
- Контроллеры — тонкие. Бизнес-логика — в Action-классах или Service-классах, не в моделях и не в контроллерах.
- Валидация — только через `FormRequest`, никогда inline-массивами в контроллере.
- Используй **Eloquent** идиоматично: избегай N+1 (`with()`, `load()`), не используй `DB::raw` без необходимости.
- Авторизация — через **Policies**, не через ручные `if ($user->id !== ...)` в контроллерах.
- Именование: модели — единственное число (`User`), таблицы — множественное (`users`), FormRequest — `StoreXRequest`/`UpdateXRequest`.
- Не добавляй новые зависимости в `composer.json` без явной необходимости — предпочитай возможности фреймворка.
- Миграции — атомарные, обратимые (`down()` реализован), с индексами на внешних ключах.
- Используй enums (PHP native enum) вместо строковых констант для фиксированных наборов значений.

## 5. Стиль кода Vue / Inertia

- Только **Composition API** с `<script setup lang="ts">` (если проект на TS) или `<script setup>` (JS).
- Порядок в SFC: `<script setup>` → `<template>` → `<style>` (если стили вообще нужны — предпочитай Tailwind-утилиты).
- Inertia-страницы (`resources/js/Pages/**`) получают данные только через `props` от контроллера — не делай отдельных fetch-запросов к API там, где достаточно Inertia-запроса.
- Формы — через `useForm()` из Inertia (`@inertiajs/vue3`), с обработкой `processing`, `errors`, `recentlySuccessful`.
- Общая реактивная логика выносится в `Composables/useXxx.js`, а не дублируется по компонентам.
- Пропсы типизируй через `defineProps` (с TS-интерфейсом или `PropType`), не полагайся на неявные типы.
- Не мутируй пропсы напрямую — только через emits/formy.
- Компоненты — маленькие и однонаправленные (single responsibility); переиспользуемые UI-элементы выносятся в `Components/ui/` или аналог.

## 6. Tailwind 4

- Конфигурация — CSS-first: тема описывается в `resources/css/app.css` через `@theme { ... }`, а не в `tailwind.config.js` (если явно не мигрировали на классический конфиг).
- Не пиши произвольный CSS, если задачу решает Tailwind-утилита.
- Кастомные токены (цвета, spacing, breakpoints) — только через `@theme`, не через inline `style` или магические хардкод-значения.
- Используй `dark:` и container queries (`@container`) где это уместно для адаптива, вместо ручных media-query.

## 7. Тестирование

- Feature-тесты — приоритет: тестируй HTTP-маршруты, Inertia-респонсы (`assertInertia`), авторизацию через Policies.
- Unit-тесты — для изолированной бизнес-логики (Actions, Services, value objects).
- Используй фабрики (`Model::factory()`), не создавай данные вручную в тестах.
- Новый функционал обязан сопровождаться тестами; правки багов — регрессионным тестом, воспроизводящим баг.
- Не мокай то, что можно протестировать реальным вызовом (БД в тестах — through `RefreshDatabase`/`DatabaseTransactions`).

## 8. Безопасность

- Никогда не коммить `.env`, ключи, токены, креды к БД/сторонним сервисам.
- Все пользовательские данные — через `FormRequest`-валидацию и Eloquent mass-assignment protection (`$fillable`/`$guarded`).
- CSRF — не отключать; Inertia уже работает с ним из коробки.
- Экранирование вывода — Vue делает это по умолчанию; никогда не используй `v-html` с непроверенным пользовательским вводом.
- Проверяй авторизацию (`Policy`/`Gate`) на каждом мутирующем действии, а не только на уровне маршрута.

## 9. Git / PR-конвенции

- Коммиты — атомарные, с понятным сообщением (imperative mood: `Add`, `Fix`, `Refactor`).
- Не смешивай рефакторинг и функциональные изменения в одном коммите/PR.
- Миграции, меняющие существующие таблицы в проде, — только через новые migration-файлы, не редактируй уже применённые миграции.

## 10. Чего агенту делать нельзя

- Не менять мажорные версии зависимостей (Laravel, Vue, Tailwind, Vite) без явного запроса.
- Не отключать strict-режимы, тесты или линтеры ради "быстрого прохождения" задачи.
- Не создавать отдельный REST API для внутреннего UI, если проект уже использует Inertia для этих же данных.
- Не добавлять глобальные CSS-переопределения в обход Tailwind-темы.
- Не удалять и не переписывать существующие тесты, чтобы "заставить их проходить" — чинить нужно код, а не тест (если тест не был явно ошибочным).
