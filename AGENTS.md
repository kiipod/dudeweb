# AGENTS.md

Инструкции для AI-агентов, работающих с этим репозиторием. Стек: **PHP 8.5, Laravel 13, Inertia 3, Vue 3, Nuxt UI для Vue, Tailwind 4, Vite 8, Composer, npm**.

---

## 1. Обзор проекта

- Монолит на Laravel с Inertia.js — SPA-подобный фронтенд без отдельного REST API для UI.
- Backend: PHP 8.5 (typed properties, enums, readonly properties, fibers где уместно) + Laravel Telegraph для бота + MoonShine админ-панель.
- Frontend: Vue 3 (`<script setup>`, Composition API) + Inertia 3 + Nuxt UI + Tailwind 4 (CSS-first конфиг через `@theme`, без `tailwind.config.js` по умолчанию).
- Сборка: Vite 8 + `laravel-vite-plugin`.
- Пакетные менеджеры: Composer (PHP), npm (JS). Не используй yarn/pnpm, если не указано иное в `packageManager` или README.

## 1.1. Codex Skills

Project-level skills находятся в `.agents/skills/`. Актуальная карта выбора,
ограничения и результаты аудита описаны в `docs/audit/skills/README.md`,
инвентаризация — в `docs/audit/skills/inventory.md`. Фактический список при
необходимости проверяй через `npx skills list`, а не по старым планам.

Различай четыре состояния skill:

- **installed** — каталог и `SKILL.md` существуют в `.agents/skills/`;
- **discovered** — skill присутствует в `npx skills list`;
- **applicable** — назначение, версия и обязательные ресурсы подходят задаче;
- **selected** — агент действительно загрузил и применяет skill в текущей задаче.

Установка, discovery и `Agents: Codex` не означают автоматический выбор skill.
Перед выполнением задачи явно сообщай, какие skills выбраны и почему. Полностью
прочитай `SKILL.md` каждого выбранного skill и только необходимые связанные
references/scripts согласно его routing instructions.

### Правила выбора

- `laravel-best-practices` — обязателен при написании, review или refactor
  Laravel backend PHP code.
- `laravel-13-attribute-refactor` — используй только по явному запросу на
  Laravel 13 attributes и всегда совместно с `laravel-best-practices`.
  Каждый attribute class и constructor signature сначала проверяй в фактически
  установленном `laravel/framework`: version gate skill сам по себе недостаточен.
- `vue-best-practices` — обязателен для любых Vue, `.vue`, Vue Router и
  Vite-with-Vue задач.
- `nuxt-ui` — добавляй для выбора, настройки или реализации компонентов,
  layouts, forms и theme на `@nuxt/ui`.
- `frontend-design` — используй при создании нового UI, заметном редизайне или
  visual/UX critique; точечный behavioral bug без visual scope его не требует.
- `tailwind-4-docs` — используй для точного Tailwind 4 API, configuration и
  migration только при наличии актуального local docs snapshot. Инициализация
  или обновление snapshot изменяет `.agents/skills/**` и выполняется отдельной
  задачей с явным разрешением пользователя.
- `tailwind-css-patterns` — используй для layout, responsive, accessibility,
  motion и utility-composition patterns. Не применяй его legacy
  `tailwind.config.js`, `content`, PurgeCSS, JIT и `darkMode` guidance к текущему
  CSS-first проекту; version-specific syntax перепроверяй.

Не подключай все frontend skills механически. Для обычного Nuxt UI component
обычно нужны `vue-best-practices` и `nuxt-ui`; `frontend-design` добавляется при
новом visual scope, а Tailwind skills — только при соответствующем custom
styling или API concern.

### Конфликты и project-specific ограничения

`AGENTS.md`, фактические версии dependencies и существующая архитектура
ограничивают generic skill guidance. В частности:

- используй FormRequest вместо допустимой в generic Laravel guidance inline
  controller validation;
- используй npm, даже если skill приводит installation examples с pnpm;
- сохраняй текущий JavaScript stack и `<script setup>` без самовольной миграции
  на TypeScript;
- для Nuxt UI используй semantic colors, а не raw Tailwind palette classes;
- для Tailwind сохраняй CSS-first configuration через `@theme`.

Если два skills отвечают за разные concerns, применяй их совместно. Не
придумывай общий приоритет между skills. Неподтверждённый API или неразрешённый
конфликт помечай как `Needs review` и сначала проверяй source/framework docs.

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

### Среда разработки Sail

- Вся разработка и проверка проекта выполняются внутри Laravel Sail. Docker и
  контейнеры Sail считаются постоянно запущенными и доступными во время работы.
- Artisan, Composer, миграции, генераторы, форматтеры, статический анализ,
  npm/Vite и другие команды проекта запускай только через Sail.
- Все тесты без исключений запускай только внутри Sail. Не запускай тесты
  напрямую через хостовые PHP, Composer, PHPUnit или Pest и не используй
  результаты таких запусков как подтверждение проверки.
- Если команда в Sail завершилась ошибкой, диагностируй окружение или причину
  ошибки; не используй запуск на хосте как запасной вариант.
- На хосте разрешены операции, не зависящие от runtime проекта: редактирование
  файлов, Git, поиск по репозиторию и просмотр изменений.

## 4. Стиль кода PHP / Laravel

- **PSR-12** + Laravel-конвенции, форматирование через **Laravel Pint** (`./vendor/bin/pint --dirty` перед коммитом).
- Строгая типизация: `declare(strict_types=1);` в новых файлах, где это принято в проекте.
- Перед каждым методом обязательно добавляй актуальный PHPDoc независимо от его visibility. Указывай `@param`, `@return` и `@throws`, когда соответствующие параметры, возвращаемое значение или исключения присутствуют.
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

## 7. Выполнение задач

Задачи хранятся в директории `.agents/plans/`.

Когда пользователь просит выполнить задачу из файла:

1. Перед внесением изменений полностью прочитать файл задачи.
2. Прочитать все зависимости и связанные файлы, указанные в задаче.
3. Проверить текущее состояние репозитория.
4. Создать отдельную ветку в git с названием верхнего уровня плана, например, `.agetns/plans/audit` - ветка git - `audit`.
5. Начать выполнение с первой незавершённой задачи `[ ]`.
6. Выполнять задачи строго в порядке, указанном в файле.
7. Не выполнять изменения, выходящие за рамки текущей задачи.
8. Перед завершением задачи выполнить все пункты раздела **Проверка**.
9. Если проверка не пройдена, исправить проблему и повторить проверку перед продолжением.
10. Отмечать выполненные задачи в файле, заменяя `[ ]` на `[x]`.
11. Не переходить к другому файлу задачи без явного указания пользователя.

## 8. Тестирование

- Feature-тесты — приоритет: тестируй HTTP-маршруты, Inertia-респонсы (`assertInertia`), авторизацию через Policies.
- Unit-тесты — для изолированной бизнес-логики (Actions, Services, value objects).
- Используй фабрики (`Model::factory()`), не создавай данные вручную в тестах.
- Новый функционал обязан сопровождаться тестами; правки багов — регрессионным тестом, воспроизводящим баг.
- Не мокай то, что можно протестировать реальным вызовом (БД в тестах — through `RefreshDatabase`/`DatabaseTransactions`).

## 9. Безопасность

- Никогда не коммить `.env`, ключи, токены, креды к БД/сторонним сервисам.
- Все пользовательские данные — через `FormRequest`-валидацию и Eloquent mass-assignment protection (`$fillable`/`$guarded`).
- CSRF — не отключать; Inertia уже работает с ним из коробки.
- Экранирование вывода — Vue делает это по умолчанию; никогда не используй `v-html` с непроверенным пользовательским вводом.
- Проверяй авторизацию (`Policy`/`Gate`) на каждом мутирующем действии, а не только на уровне маршрута.

## 10. Git / PR-конвенции

- Коммиты — атомарные, с понятным сообщением (imperative mood: `Add`, `Fix`, `Refactor`).
- Не смешивай рефакторинг и функциональные изменения в одном коммите/PR.
- Миграции, меняющие существующие таблицы в проде, — только через новые migration-файлы, не редактируй уже применённые миграции.

## 11. Чего агенту делать нельзя

- Не менять мажорные версии зависимостей (Laravel, Vue, Tailwind, Vite) без явного запроса.
- Не отключать strict-режимы, тесты или линтеры ради "быстрого прохождения" задачи.
- Не создавать отдельный REST API для внутреннего UI, если проект уже использует Inertia для этих же данных.
- Не добавлять глобальные CSS-переопределения в обход Tailwind-темы.
- Не удалять и не переписывать существующие тесты, чтобы "заставить их проходить" — чинить нужно код, а не тест (если тест не был явно ошибочным).
