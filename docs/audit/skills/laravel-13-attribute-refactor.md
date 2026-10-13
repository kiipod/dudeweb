# laravel-13-attribute-refactor

## Общая информация

- Путь: `.agents/skills/laravel-13-skills/SKILL.md`.
- Source: `local`.
- Версия skill: `2.0.0`.
- Требования: Laravel 13.0+ и PHP 8.3+.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.

Skill задаёт project-specific policy применения современных Laravel 13 PHP
attributes при создании, обновлении и рефакторинге поддерживаемых компонентов.
Он отвечает за выбор разрешённого attribute, проверку API и безопасную замену
legacy-конфигурации без изменения поведения.

## Когда использовать

Skill выбирается автоматически, если задача создаёт, обновляет или рефакторит
поддерживаемый Laravel-компонент и затрагивает одну из разрешённых
attribute-конфигураций. Явное упоминание attributes пользователем не требуется.

Поддерживаемые компоненты:

- Eloquent Models;
- queue Jobs;
- Artisan Commands;
- Controllers и Form Requests;
- HTTP Resources и Factories;
- tests с seeder configuration;
- Container/DI и Container Service Registration.

Skill не выбирается только из-за наличия Laravel в задаче и не разрешает
попутную массовую миграцию unrelated configuration.

## Разрешённая матрица

| Компонент | Разрешённые attributes |
|---|---|
| Models | `Table`, `ObservedBy`, `UseFactory`, `UsePolicy`, method-level `Scope` |
| Jobs | `Tries`, `Timeout`, `Middleware`, `Connection` |
| Commands | `Aliases` |
| Controllers | `Middleware` |
| Form Requests | `RedirectTo`, `RedirectToRoute`, `RedirectToAction` |
| HTTP Resources | `Collects` |
| Factories | `UseModel` |
| Testing | `Seeder` |
| Container/DI | Все фактически установленные contextual injection attributes |
| Container Service Registration | Все фактически установленные registration attributes |

Для Container/DI в Laravel 13.34.0 подтверждены `Auth`, `Authenticated`,
`Cache`, `Config`, `Context`, `CurrentUser`, `DB`, `Database`, `Give`, `Log`,
`RequestAttribute`, `RouteParameter`, `Storage` и `Tag`.

Для Container Service Registration подтверждены `Bind`, `BindWhen`, `Scoped`
и `Singleton`.

Mappings за пределами этой матрицы не применяются без отдельного решения о
расширении scope.

## Основные инструкции

- В новом коде предпочитать разрешённый и подтверждённый attribute legacy
  property или registration form для той же configuration concern.
- При прямом обновлении или рефакторинге разрешённой конфигурации переводить её
  на attribute, если behavior можно сохранить эквивалентно.
- Перед использованием проверять существование class, `Attribute` target,
  constructor signature и фактическую framework integration.
- Удалять legacy configuration только после подтверждения эквивалентности.
- Не менять business logic, method bodies, relationships, visibility, types,
  inheritance и unrelated configuration.
- Не придумывать отсутствующие attribute classes и не создавать локальные
  substitutes.
- Для dynamic values, которые нельзя выразить attribute argument, сохранять
  штатную non-attribute реализацию и ставить `Needs review`.

## Workflow

1. Определить компонент и разрешённую configuration concern.
2. Проверить API в установленном `laravel/framework`.
3. Добавить точный import и attribute.
4. Удалить только заменённую legacy configuration.
5. Запустить focused tests, formatter и проверить diff на изменение поведения.

## Дополнительные ресурсы

Дополнительных references, scripts, examples или templates нет. Актуальная
матрица, version gates и workflow находятся в единственном `SKILL.md`.

## Применимость к проекту

Фактический runtime 13 октября 2026 года — PHP 8.5.11 и Laravel 13.34.0.
Базовые version gates выполнены, а разрешённые classes и signatures проверены
по установленному `vendor/laravel/framework`.

Два разрешённых направления пока не поддерживаются установленной версией:

- `Illuminate\Queue\Attributes\Middleware` для Jobs отсутствует;
- `Illuminate\Foundation\Http\Attributes\RedirectToAction` для Form Requests
  отсутствует.

Они остаются частью желаемой project policy, но имеют статус `Needs review`.
До появления реального framework API используется штатная non-attribute форма.

## Независимость от laravel-best-practices

`laravel-13-attribute-refactor` не является дополнением, подрежимом или
обязательным спутником `laravel-best-practices`. Skills выбираются независимо:

- этот skill — по затронутой разрешённой attribute configuration;
- `laravel-best-practices` — по своей отдельной области Laravel architecture,
  security, validation, queries и quality practices;
- если одна задача независимо соответствует обоим selection rules, можно
  выбрать оба, но один skill не является prerequisite другого.

Изменение metadata, scope или документации этого skill не требует выбора
`laravel-best-practices`. В implementation-задаче он добавляется только при
наличии concerns из его собственной зоны ответственности.

## Приоритет инструкций

Project-specific разрешённая матрица ограничивает более широкий перечень
Laravel attributes. Фактический source установленного framework определяет,
можно ли применить разрешённый mapping прямо сейчас. Version declaration без
проверки class, target и signature недостаточен.

## Ограничения и риски

- Два желаемых mappings отсутствуют в Laravel 13.34.0 и не могут быть
  реализованы до обновления framework API.
- Dynamic configuration может быть несовместима с PHP attribute arguments.
- Сложное inheritance требует проверки того, какой class framework отражает.
- Механическое удаление legacy properties без regression tests может изменить
  runtime behavior.
- Наличие другого Laravel attribute в framework не означает, что он разрешён
  project-specific матрицей этого skill.
