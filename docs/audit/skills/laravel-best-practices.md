# laravel-best-practices

## Общая информация

- Путь: `.agents/skills/laravel-best-practices/SKILL.md`.
- Source: `laravel/boost`.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.
- Версия skill не указана; точный version-specific API предписано проверять по
  документации или установленному framework.

Это общий Laravel skill для architecture, security, validation,
Eloquent/query behavior, error handling и general implementation quality в
backend PHP-коде.

## Когда использовать

- При Laravel backend-задаче, затрагивающей architecture, security, validation,
  Eloquent/query behavior, error handling или general quality practices.
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
- Для узкого attribute mapping без concerns из собственной зоны; такой mapping
  самостоятельно покрывает `laravel-13-attribute-refactor`.
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

Применимость высокая: фактический runtime после повторной проверки 13 октября
2026 года — PHP 8.5.11 и Laravel 13.34.0; проект содержит Eloquent, services,
queues/integrations, Telegraph и MoonShine.
Большинство общих правил совместимо со структурой, заданной `AGENTS.md`: thin
controllers, FormRequests, Policies, Eloquent и tests.

Есть проектное отличие: `AGENTS.md` требует всю controller validation выносить
в FormRequest, тогда как rule `validation.md` допускает небольшой inline
`$request->validate()`. Для этого репозитория применяется более конкретное
требование `AGENTS.md`.

## Пересечения с другими skills

- `laravel-13-attribute-refactor` может затрагивать те же models, jobs,
  commands, controllers, FormRequests и DI, но отвечает только за разрешённую
  project-specific attribute policy.
- Skills выбираются независимо. Выбор attribute skill не требует этого skill,
  а выбор этого skill не включает attribute skill автоматически.
- Frontend skills нужны отдельно, если Laravel feature включает Inertia/Vue UI;
  этот skill не описывает Vue component architecture.

### Сравнение Laravel skills

Общие типы файлов — models, jobs, commands, controllers, FormRequests и
dependency injection. Разделение ответственности следующее:

- `laravel-best-practices` определяет project-first architecture, security,
  database/query behavior, validation, tests и минимальный scope изменения;
- `laravel-13-attribute-refactor` определяет разрешённую attribute-матрицу,
  проверку framework API и safe conversion соответствующей конфигурации.

Потенциальный конфликт возникает, если специализированный skill предлагает
attribute, которого нет в framework, или если conversion создаёт второй pattern
рядом с устоявшимся property-based code. Attribute skill самостоятельно требует
проверять installed version и не применять неподдерживаемый API. Формального
правила приоритета или зависимости между skills нет.

### Сценарии выбора

- Только этот skill: любые Laravel изменения/review без явной задачи на
  разрешённую attribute configuration.
- Только `laravel-13-attribute-refactor`: изменение scope/metadata самого skill
  или узкая attribute-задача без concerns этого skill.
- Оба: задача независимо затрагивает разрешённую attribute configuration и
  general Laravel architecture/security/quality concerns.
- Ни один: задача не затрагивает Laravel backend и attribute mapping.

При совместной работе нет заданного порядка или prerequisite: каждый skill
применяется к собственной части задачи, а общие tests и diff review выполняются
один раз для итогового изменения.

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
- Фактическая проверка Laravel 13.34.0 подтвердила, что в разрешённой матрице
  attribute skill пока отсутствуют Job `Middleware` и Form Request
  `RedirectToAction`; их нельзя использовать до появления framework API.
