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

Проект заявляет Laravel `^13.13` и PHP `^8.5`, поэтому базовые version gates
skill выполнены. В коде уже встречаются PHP attributes, однако это само по себе
не является основанием переписывать существующие properties. Skill применим
только к отдельной задаче на создание или refactor attribute-based config.

Фактическое наличие конкретного класса attribute нужно проверять в установленном
`laravel/framework`: документ skill охватывает также изменения Laravel 13.2+ и
может дрейфовать относительно framework.

## Пересечения с другими skills

- `laravel-best-practices` покрывает архитектуру, безопасность, Eloquent,
  queues, controllers, validation и verification в целом.
- Этот skill уже и специализированнее: он отвечает только за attribute syntax
  и preservation бизнес-логики.
- При attribute-refactor нужны оба: специализированный skill задаёт mapping, а
  общий — проверяет архитектурный контекст, tests и проектные conventions.

## Приоритет инструкций

`SKILL.md` не задаёт собственного правила приоритета над `AGENTS.md` или
проектной архитектурой. Требования проекта к минимальному diff, тестам,
форматированию и архитектурным границам остаются обязательными. Точный API
установленного Laravel важнее непроверенного примера из skill.

## Ограничения и риски

- Документ version-specific и содержит большой перечень API, который нельзя
  считать подтверждённым без проверки framework source/docs.
- Внутри skill есть неоднозначность `Needs review`: таблица описывает variadic
  `#[Backoff(10, 30, 60)]`, а пример использует `#[Backoff([10, 30, 60])]`.
- Сложное наследование и dynamic properties требуют ручного анализа.
- Attributes объявлены optional alternatives, поэтому рефакторинг не является
  обязательным только из-за версии Laravel.
- Массовое удаление properties без regression tests может изменить framework
  configuration и нарушить backward compatibility.
