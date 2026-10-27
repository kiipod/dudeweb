# AGENTS.md

Инструкции для AI-агентов, работающих с этим репозиторием. Стек: **PHP 8.5, Laravel 13, Inertia 3, Vue 3, Tailwind 4, Vite 8, Composer, npm**.

---

## 1. Обзор проекта

- Монолит на Laravel с Inertia.js — SPA-подобный фронтенд без отдельного REST API для UI.
- Backend: PHP 8.5 (typed properties, enums, readonly properties, fibers где уместно) + Laravel Telegraph для бота + MoonShine админ-панель.
- Frontend: Vue 3 (`<script setup>`, Composition API) + Inertia 3 + Tailwind 4 (CSS-first конфиг через `@theme`, без `tailwind.config.js` по умолчанию).
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

- `php-per-cs3` — обязательный первый skill при написании любого PHP-кода в
  проекте, а также при изменении, review или refactor существующего PHP-кода.
  Он задаёт базовый стандарт **PER Coding Style 3.x (PER-CS 3)** вместо PSR-12:
  PHP-файлы приложения, routes, config, migrations, factories, seeders, tests,
  tooling и PHP-фрагменты в шаблонах. Сначала прочитай
  `.agents/skills/php-per-cs3/SKILL.md`, затем добавляй Laravel skills по их
  собственным concerns. PER-CS имеет приоритет в вопросах PHP coding style
  над generic style guidance других skills и прежним форматированием кода.
- `laravel-best-practices` — используй при написании, review или refactor
  Laravel backend PHP code, когда задача затрагивает architecture, security,
  validation, Eloquent/query behavior, error handling или general quality
  practices. Attribute mapping сам по себе не относится к его зоне и не
  является причиной выбирать этот skill.
- `laravel-13-attribute-refactor` — используй при создании, обновлении или
  рефакторинге поддерживаемых Model, Job, Command, Controller, FormRequest,
  HTTP Resource, Factory, test и Container/DI components, если затрагивается
  разрешённая attribute-конфигурация. Явный запрос на attributes не требуется.
  Этот skill и `laravel-best-practices` выбираются независимо: ни один не
  является prerequisite другого; если задача отдельно соответствует обоим
  правилам, используй оба.
- Разрешённая attribute-матрица: Models — `Table`, `ObservedBy`, `UseFactory`,
  `UsePolicy`, `Scope` для методов; Jobs — `Tries`, `Timeout`, `Middleware`,
  `Connection`; Commands — `Aliases`; Controllers — `Middleware`; Form
  Requests — `RedirectTo`, `RedirectToRoute`, `RedirectToAction`; HTTP
  Resources — `Collects`; Factories — `UseModel`; Testing — `Seeder`;
  Container/DI и Container Service Registration — все фактически установленные
  attributes. Другие mappings не применяй без отдельного расширения scope.
- Каждый attribute class, target, constructor signature и framework integration
  сначала проверяй в фактически установленном `laravel/framework`: version gate
  skill сам по себе недостаточен. В проверенном Laravel 13.35.0 отсутствуют Job
  `Middleware` и Form Request `RedirectToAction`; для них сохраняй штатную
  non-attribute реализацию со статусом `Needs review`, не создавай substitutes.
- `vue-best-practices` — обязателен для любых Vue, `.vue`, Vue Router и
  Vite-with-Vue задач.
- `frontend-design` — используй при создании нового UI, заметном редизайне или
  visual/UX critique; точечный behavioral bug без visual scope его не требует.
- `tailwind-best-practices` — обязательно используй при написании, изменении,
  review, cleanup, refactor или аудите Tailwind classes, components и CSS-first
  config. Skill отвечает за semantic design tokens, короткие и единообразно
  упорядоченные class lists, отказ от `@apply` как способа component extraction
  и фиксированные variants shared design-system components.
- `tailwind-4-docs` — используй для точного Tailwind 4 API, configuration и
  migration только при наличии актуального local docs snapshot. Инициализация
  или обновление snapshot изменяет `.agents/skills/**` и выполняется отдельной
  задачей с явным разрешением пользователя.

Не подключай все frontend skills механически. Для обычного Vue component нужен
`vue-best-practices`; если пишутся или меняются Tailwind classes, добавляется
`tailwind-best-practices`; `frontend-design` добавляется при новом visual scope,
а `tailwind-4-docs` — только при точном Tailwind API concern и наличии
актуального local docs snapshot. Для первичного переноса Pen-макета используй
`frontend-design`, `vue-best-practices` и `tailwind-best-practices` совместно;
`tailwind-4-docs` добавляй только по отдельному version-specific concern.

### Конфликты и project-specific ограничения

`AGENTS.md`, фактические версии dependencies и существующая архитектура
ограничивают generic skill guidance. В частности:

- для PHP coding style в первую очередь применяй `php-per-cs3`; Laravel
  architecture и допустимость framework attributes проверяй соответствующими
  skills независимо. Обязательный PHPDoc из раздела 4 дополняет PER-CS;
- используй FormRequest вместо допустимой в generic Laravel guidance inline
  controller validation;
- используй npm, даже если skill приводит installation examples с pnpm;
- сохраняй текущий JavaScript stack и `<script setup>` без самовольной миграции
  на TypeScript;
- для Tailwind сохраняй CSS-first configuration через `@theme`.
- React-примеры `tailwind-best-practices` с `className`, `clsx` и JS config не
  копируй буквально: адаптируй их к Vue contracts и CSS-first `@theme`, а
  variant key явно преобразуй через variant map. Не добавляй `clsx`,
  `tailwind-merge`, Prettier или formatter plugins без отдельного обоснования.

Frontend foundation проверяй по текущему checkout: semantic `@theme` tokens
находятся в `resources/css/app.css`, shared components — в
`resources/js/components/ui/`. Если задача сама создаёт или расширяет
foundation, отсутствие нужных tokens/components её не блокирует. Сначала
выведи из согласованного макета semantic tokens и shared component boundaries,
зафиксируй их в design plan/contracts, затем реализуй screens. Требование skill
остановиться при отсутствии foundation применяется к обычному cleanup поверх
уже существующего бессистемного UI, а не к первичному созданию этой foundation.

Если два skills отвечают за разные concerns, применяй их совместно. Кроме
явного приоритета `php-per-cs3` для PHP coding style, не придумывай общий
приоритет между skills. Неподтверждённый API или неразрешённый
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

- **PER Coding Style 3.x (PER-CS 3)** — основной стандарт PHP coding style;
  перед любым PHP-кодом сначала используй `php-per-cs3`. Laravel-конвенции
  дополняют стандарт в вопросах архитектуры и framework API.
- Форматирование — через **PHP CS Fixer** внутри Sail:
  `./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential <files>`
  перед коммитом. Проверяй покрытие выбранных правил formatter; успешный запуск
  сам по себе не доказывает полное соответствие PER-CS 3.x. В config явно
  закреплён `@PER-CS3x0` с дополнительными правилами оформления PHPDoc и PHP 8.4+
  `new` expressions; PHP migration rules автоматически не включаются.
  Без `<files>` проверяются собственные исходники, опубликованные переводы и
  PHP entrypoints; зависимости, skills, IDE helpers, кеши и Blade исключены из
  finder. PHP-фрагменты Blade проверяй отдельно. В обычной задаче scope
  форматирования ограничивай затронутыми файлами.
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
- Inertia-страницы (`resources/js/pages`) получают данные только через `props` от контроллера — не делай отдельных fetch-запросов к API там, где достаточно Inertia-запроса.
- Формы — через `useForm()` из Inertia (`@inertiajs/vue3`), с обработкой `processing`, `errors`, `recentlySuccessful`.
- Общая реактивная логика выносится в `Composables/useXxx.js`, а не дублируется по компонентам.
- Пропсы типизируй через `defineProps` (с TS-интерфейсом или `PropType`), не полагайся на неявные типы.
- Не мутируй пропсы напрямую — только через emits/formy.
- Компоненты — маленькие и однонаправленные (single responsibility); переиспользуемые UI-элементы выносятся в `Components/ui/` или аналог.

### 5.1. VueUse

- Перед написанием новой или изменением существующей типовой browser/reactive
  логики проверь `@vueuse/core`. Предпочитай подходящий composable ручным
  listeners, media queries, observers, clipboard, storage и timers, если его
  поведение соответствует contract задачи и сокращает lifecycle-код.
- `@vueuse/components` используй для локального template behavior через
  component/directive, когда это упрощает разметку. Для общей логики предпочитай
  `@vueuse/core` внутри project composable. Проверяй DOM-обёртки и `as`:
  renderless component может добавлять элемент. Сохраняй shared UI и tokens.
- Используй явные именованные imports. API, options/defaults и поддержку SSR
  проверяй по установленной версии и официальной документации. Используй
  breakpoints проекта; responsive layout без JS-поведения оставляй CSS.
- Сохраняй JavaScript + `<script setup>`, Inertia props/useForm, cleanup и
  одинаковый initial SSR/client markup. Browser storage и media queries не
  должны создавать hydration mismatch или второй независимый theme store.
- Существующие project composables не заменяй массово. При затрагивании
  concern переноси подходящие primitives с сохранением focus/ARIA, Teleport,
  busy/error/manual-copy, motion/gesture и cancellation contracts. Если VueUse
  не покрывает contract или усложняет решение, сохрани собственную реализацию
  и кратко объясни причину.
- Применение проверяй targeted tests через Sail по затронутому поведению,
  включая SSR/hydration и keyboard/touch, когда они входят в scope.

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
