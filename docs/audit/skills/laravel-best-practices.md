# laravel-best-practices

## Общая информация

- Путь: `.agents/skills/laravel-best-practices/SKILL.md`.
- Source: `laravel/boost`.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.
- Версия skill не указана; точный version-specific API предписано проверять по
  документации или установленному framework.

Это общий Laravel skill для написания, review и refactor backend PHP-кода:
controllers, models, migrations, requests, policies, jobs, services, queries и
архитектурных решений.

## Когда использовать

- При любой задаче, которая пишет, меняет или рецензирует Laravel backend code.
- Для N+1/query performance, caching, authorization/security, validation,
  routing, queues, scheduling, HTTP client и error handling.
- При выборе между framework conventions и новой abstraction.
- При Laravel code review, даже если изменение кода не требуется.

Примеры запросов:

- «Добавь endpoint с FormRequest, Policy и feature tests».
- «Найди N+1 и оптимизируй этот Eloquent query».
- «Проверь job retries, idempotency и queue timeouts».
- «Спроектируй безопасную migration для заполненной таблицы».

## Когда не использовать

- Для frontend-only Vue/Tailwind задач без Laravel-кода.
- Как точный API-источник без проверки версии: сам skill требует verification.
- Для навязывания нового pattern, если проект уже последовательно использует
  другой допустимый Laravel-подход.
- Для speculative abstractions и несвязанных refactors.

## Возможности

Skill маршрутизирует задачу к 19 rule-файлам. Они покрывают:

- architecture, dependency injection, concurrency, locks и conventions;
- Eloquent relationships/scopes/casts, query performance и advanced queries;
- security, validation, routing/controllers и schema migrations;
- caching, queues, HTTP client, exceptions, events, notifications, mail и
  scheduling;
- collections, Blade/views, configuration и code style.

Ключевой принцип — consistency first: изучить соседний код и использовать
существующий project pattern, если нет correctness/security defect.

## Основные инструкции

- До изменения проверить затрагиваемые файлы, соседний код, config и tests.
- Сопоставить concerns с rule index и прочитать только соответствующие rules.
- Делать минимальное связное изменение без второй параллельной архитектуры.
- Version-sensitive API сверять с docs или установленным framework.
- Сначала запускать узкие tests, затем formatter/static analysis по контексту.
- Перед завершением перечитать diff против всех выбранных rules.
- Предпочитать framework features и существующие abstractions новым helpers и
  dependencies; извлекать action/service только при реальной границе или reuse.
- Не скрывать database access во views и предотвращать N+1 на всех слоях.

## Workflow

1. Определить Laravel concerns и существующие conventions проекта.
2. Открыть соответствующие файлы из `rules/`.
3. Проверить version-sensitive API для фактической версии Laravel.
4. Реализовать наименьшее цельное изменение.
5. Запустить узкие tests, затем предусмотренные проектом quality checks.
6. Сверить diff с выбранными rules, security и performance последствиями.

## Дополнительные ресурсы

Каталог `.agents/skills/laravel-best-practices/rules/` содержит 19 файлов:

- `architecture.md`, `style.md`, `routing.md`, `validation.md`;
- `eloquent.md`, `db-performance.md`, `advanced-queries.md`, `collections.md`;
- `caching.md`, `queue-jobs.md`, `http-client.md`, `error-handling.md`;
- `blade-views.md`;
- `security.blade.php`, `migrations.blade.php`, `config.blade.php`,
  `events-notifications.blade.php`, `mail.blade.php`,
  `scheduling.blade.php`.

Rule-файлы обязательны только когда задача затрагивает соответствующий concern;
загружать все rules для каждой задачи skill прямо запрещает.

## Применимость к проекту

Применимость высокая: фактический runtime — PHP 8.5.11 и Laravel 13.34.0;
проект содержит Eloquent, services, queues/integrations, Telegraph и MoonShine.
Большинство общих правил совместимо со структурой, заданной `AGENTS.md`: thin
controllers, FormRequests, Policies, Eloquent и tests.

Есть проектное отличие: `AGENTS.md` требует всю controller validation выносить
в FormRequest, тогда как rule `validation.md` допускает небольшой inline
`$request->validate()`. Для этого репозитория применяется более конкретное
требование `AGENTS.md`.

## Пересечения с другими skills

- `laravel-13-attribute-refactor` пересекается в models, jobs, commands,
  controllers, FormRequests и DI, но решает узкую syntax migration.
- При attribute-refactor общий skill отвечает за conventions, безопасность,
  архитектуру и verification; специализированный — за mapping attributes.
- Frontend skills нужны отдельно, если Laravel feature включает Inertia/Vue UI;
  этот skill не описывает Vue component architecture.

### Сравнение Laravel skills

Общие области — models, jobs, commands, controllers, FormRequests, dependency
injection, code style и verification. Разделение ответственности следующее:

- `laravel-best-practices` определяет project-first architecture, security,
  database/query behavior, validation, tests и минимальный scope изменения;
- `laravel-13-attribute-refactor` предлагает только property-to-attribute
  mappings и требование сохранить бизнес-логику.

Потенциальный конфликт возникает, если специализированный skill предлагает
attribute, которого нет в framework, или если conversion создаёт второй pattern
рядом с устоявшимся property-based code. В обоих случаях общий skill требует
сначала проверить installed version и consistency. Формального правила
приоритета между skills нет; неподдерживаемый API просто нельзя использовать.

### Сценарии выбора

- Только этот skill: любые Laravel изменения/review без явной задачи на
  attribute syntax.
- Только `laravel-13-attribute-refactor`: фактическое Laravel code change не
  подходит, поскольку metadata этого skill требует общий skill для любого
  Laravel backend code; отдельным случаем остаётся аудит metadata skills.
- Оба: явный Laravel 13 attribute refactor или новый attribute-based class.
- Ни один: задача не затрагивает Laravel backend и attribute mapping.

При совместной работе этот skill сначала устанавливает version/context и
quality boundaries, специализированный skill выполняет только подтверждённую
syntax conversion, затем общий workflow завершает tests и diff review.

## Приоритет инструкций

Skill прямо ставит project consistency перед собственными defaults. Поэтому
`AGENTS.md`, существующая архитектура и фактическая версия framework определяют
конкретное решение. Отклонение от project pattern допустимо только ради
correctness/security и должно быть явно объяснено.

## Ограничения и риски

- Шесть ссылок в rule index имеют расширение `.md`, но соответствующие файлы в
  установленном skill называются `*.blade.php`; прямой переход по ссылке может
  не сработать. Файлы существуют и были учтены вручную. `Needs review`.
- Index направляет testing concerns в отдельный `testing-best-practices`, но
  такого project skill в текущей инвентаризации нет. Для tests следует
  использовать `AGENTS.md` и проектные conventions. `Needs review`.
- Blade rule files содержат template placeholders Laravel Boost; команды из
  них нельзя копировать механически без render/проверки.
- Некоторые рекомендации используют новые framework APIs; отсутствие версии
  skill усиливает требование live verification.
- Фактическая проверка Laravel 13.34.0 подтвердила, что локальный attribute
  skill содержит семь отсутствующих classes; общий version check обязателен и
  не может быть заменён заявлением `requires: Laravel 13.0+`.
