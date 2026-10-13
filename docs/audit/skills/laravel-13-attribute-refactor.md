# laravel-13-attribute-refactor

## Общая информация

- Путь: `.agents/skills/laravel-13-skills/SKILL.md`.
- Source: `local`.
- Версия skill: `1.0.1`.
- Заявленные требования: Laravel 13.0+ и PHP 8.3+.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.

Skill специализируется на создании Laravel 13 кода с PHP attributes и на
переносе поддерживаемой property-based конфигурации в attributes без изменения
бизнес-логики.

## Когда использовать

- Пользователь явно просит преобразовать модель, job, command, controller,
  FormRequest, resource, factory или test configuration в Laravel attributes.
- Новый Laravel 13 код по требованиям должен использовать attribute syntax.
- Нужно провести узкий аудит возможной property-to-attribute миграции.

Примеры запросов:

- «Переведи `$fillable` и `$casts` этой модели на Laravel 13 attributes».
- «Преобразуй queue job: tries, timeout и backoff должны быть attributes».
- «Создай Laravel 13 command с attribute-based signature и description».

## Когда не использовать

- Для обычной Laravel feature, где attribute-refactor не запрошен.
- На Laravel ниже 13 или PHP ниже 8.3.
- Для custom/dynamic properties без подтверждённого attribute-эквивалента.
- Если точный API attribute не подтверждён установленной версией framework.
- Для массового механического рефакторинга без тестов и review inheritance.

## Возможности

Skill содержит таблицы заявленных преобразований для:

- Eloquent models и уже существующих model attributes;
- queue jobs;
- Artisan commands;
- controller middleware/authorization;
- Form Requests, HTTP resources, factories и tests;
- container injection и service registration.

Также приведены полные примеры преобразования model, job, command, controller,
FormRequest и dependency injection.

## Основные инструкции

- Определить тип компонента и извлечь только конфигурационные свойства.
- Конвертировать только известные соответствия и добавить корректные imports.
- После подтверждённой конверсии удалить исходное property.
- Не менять method bodies, constructors, relationships и бизнес-логику.
- Сохранять локальный стиль кода; для repeatable attributes использовать
  требуемое число объявлений.
- После рефакторинга запускать tests; изменять по одному файлу и начинать с
  models, затем jobs и commands — это рекомендации безопасности skill.

## Workflow

1. Подтвердить Laravel/PHP версии и компонент.
2. Найти поддерживаемые configuration properties.
3. Сверить каждый attribute и его signature с установленным Laravel.
4. Добавить imports и attributes, удалить только заменённые properties.
5. Сохранить остальной класс без изменений.
6. Запустить узкие tests и formatter, проверить diff.
7. Кратко перечислить сделанные преобразования.

## Дополнительные ресурсы

Дополнительных references, scripts, examples или templates нет. Все таблицы,
примеры и ограничения находятся в единственном `SKILL.md`.

## Применимость к проекту

Фактический runtime после повторной проверки 13 октября 2026 года — PHP 8.5.11
и Laravel 13.35.0, поэтому базовые version gates skill выполнены. В коде уже
встречаются PHP attributes,
однако это само по себе не является основанием переписывать существующие
properties. Skill применим только к отдельной задаче на создание или refactor
attribute-based config.

Проверка установленного `vendor/laravel/framework` показала частичную
совместимость таблиц skill. Многие classes существуют, включая `Table`,
`Fillable`, `Guarded`, `Unguarded`, `Hidden`, `Visible`, `Appends`, `Touches`,
queue attributes, console attributes, controller attributes, FormRequest
attributes, resource/factory/test и container attributes.

В Laravel 13.35.0 отсутствуют следующие заявленные skill classes:

- `Illuminate\Database\Eloquent\Attributes\With`;
- `Illuminate\Database\Eloquent\Attributes\WithRelations`;
- `Illuminate\Database\Eloquent\Attributes\Cast`;
- `Illuminate\Database\Eloquent\Attributes\DispatchesEvents`;
- `Illuminate\Database\Eloquent\Attributes\Observers`;
- `Illuminate\Queue\Attributes\Middleware`;
- `Illuminate\Foundation\Http\Attributes\RedirectToAction`.

Эти mappings неприменимы к текущему проекту. Каждый оставшийся mapping всё
равно требует проверки constructor signature и framework integration до
изменения кода.

## Пересечения с другими skills

- `laravel-best-practices` покрывает архитектуру, безопасность, Eloquent,
  queues, controllers, validation и verification в целом.
- Этот skill уже и специализированнее: он отвечает только за attribute syntax
  и preservation бизнес-логики.
- При attribute-refactor нужны оба: специализированный skill задаёт mapping, а
  общий — проверяет архитектурный контекст, tests и проектные conventions.

### Сценарии выбора

- Только `laravel-best-practices`: обычная Laravel feature, bugfix, review,
  migration, query/security/queue task без требования attribute syntax.
- Только `laravel-13-attribute-refactor`: для изменения Laravel PHP-кода такой
  сценарий не подтверждён, потому что общий skill требует применяться ко всему
  Laravel backend code. Изолированное изучение metadata самого skill, как в
  этом документальном аудите, не является Laravel implementation task.
- Оба: пользователь явно просит создать или преобразовать Laravel 13 class с
  attributes; общий skill проверяет project context и verification, этот skill
  — только подтверждённые mappings.
- Ни один: frontend-only, инфраструктурная или документальная задача без
  Laravel backend concerns и без анализа attributes.

При совместном использовании сначала проверяется проект и фактический
framework API, затем выполняется attribute conversion как часть минимального
Laravel change, после чего применяются tests/formatting общего workflow. Это
следует из обязательной version verification общего skill, а не является
дополнительным правилом приоритета.

## Приоритет инструкций

`SKILL.md` не задаёт собственного правила приоритета над `AGENTS.md` или
проектной архитектурой. Требования проекта к минимальному diff, тестам,
форматированию и архитектурным границам остаются обязательными. Точный API
установленного Laravel важнее непроверенного примера из skill.

## Ограничения и риски

- Документ version-specific и содержит большой перечень API, который нельзя
  считать подтверждённым без проверки framework source/docs.
- Семь заявленных classes отсутствуют в Laravel 13.35.0; их использование
  приведёт к ошибке загрузки class. Для них skill фактически несовместим.
- Проверка `Backoff::__construct(array|int ...$backoff)` подтвердила, что обе
  показанные формы — `#[Backoff(10, 30, 60)]` и
  `#[Backoff([10, 30, 60])]` — принимаются текущей сигнатурой; это не конфликт.
- Сложное наследование и dynamic properties требуют ручного анализа.
- Attributes объявлены optional alternatives, поэтому рефакторинг не является
  обязательным только из-за версии Laravel.
- Массовое удаление properties без regression tests может изменить framework
  configuration и нарушить backward compatibility.
