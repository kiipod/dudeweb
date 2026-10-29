# php-per-cs3

## Общая информация

- Путь: `.agents/skills/php-per-cs3/SKILL.md`.
- Source установки: `local`; текст стандарта — PHP-FIG PER Coding Style.
- Базовая версия стандарта проекта: **PER-CS 3.x**.
- Аудит: 19 октября 2026 года.
- Статус: установлен и обнаруживается CLI после исправления frontmatter;
  применим как обязательный первый skill для любого PHP-кода проекта.
- Дополнительных references, scripts, assets или lock-записи нет.

## Содержимое и происхождение

Изначально файл содержал 1868 строк текста Coding Style Guide, без YAML
frontmatter. `./vendor/bin/sail npx skills list` пропускал файл с warning
`missing required frontmatter field(s): name, description`. Добавлены metadata
и краткие project usage instructions; исходный текст стандарта сохранён,
убраны только trailing spaces в одной пустой строке.

Локальная копия включает правила о `clone()` и pipe operator `|>`, которые
присутствуют в [текущей спецификации PER Coding Style 3.1](https://www.php-fig.org/per/coding-style/).
В [тексте релиза 3.0.0](https://github.com/php-fig/per-coding-style/blob/3.0.0/spec.md)
этих дополнений нет. Поэтому называть предоставленный текст точной копией 3.0
некорректно. Upstream commit/tag для локальной копии не зафиксирован;
побайтовое совпадение с конкретным релизом не подтверждено.

[Versioning policy PHP-FIG](https://www.php-fig.org/per/coding-style/meta/#4-versioning)
предполагает фиксацию major версии coding style. В проекте принята ветка 3.x;
новый major не включается автоматически из-за обновления upstream или formatter.

## Когда использовать

Выбирать и читать **первым** при написании любого PHP-кода, включая небольшие
изменения, review и refactor:

- application code, controllers, services, models, jobs, commands и middleware;
- routes, config, migrations, factories и seeders;
- unit/feature tests, PHP tooling и PHP-фрагменты в шаблонах.

Размер изменения и отсутствие Laravel concerns не отменяют этот выбор.
Для документации без PHP-кода, Vue, CSS или прочего frontend-only scope
автоматически подключать PHP skill не требуется. Аудит самого стандарта
использует его как источник проверяемых правил.

## Что определяет стандарт

PER-CS расширяет и заменяет PSR-12 и требует соблюдения PSR-1. Текст покрывает:

- файлы, LF, отступы в четыре пробела, whitespace и переносы строк;
- declare, namespace, imports, classes, traits, properties и modifiers;
- functions, parameters, calls, closures, arrow functions и callable references;
- union/intersection types, trailing commas и control structures;
- operators, anonymous classes, enums, heredoc/nowdoc и arrays;
- property hooks, asymmetric visibility и attributes.

Применять нормативные MUST/SHOULD/MAY с их разной обязательностью. Например,
120 символов — мягкий предел, а не основание для жёсткого запрета длинных строк.
Примеры синтаксиса стандарта не доказывают его доступность в установленном PHP:
перед использованием новой конструкции проверить фактическую поддержку runtime.

## Приоритет и совместное использование

Прямое требование пользователя закреплено в `AGENTS.md`: `php-per-cs3` —
первый и приоритетный источник **PHP coding style**. Generic style guidance
других skills и прежнее форматирование не заменяют PER-CS. Для разных concerns
сохраняется разделение ответственности:

| Concern | Skill / источник |
|---|---|
| PHP coding style, включая оформление attributes | Сначала `php-per-cs3` |
| Laravel architecture, security, validation, queries, quality | Дополнительно `laravel-best-practices` по scope |
| Выбор разрешённых Laravel attributes и проверка framework API | Дополнительно `laravel-13-attribute-refactor` по scope |
| PHPDoc перед каждым методом, FormRequest, Policies, Sail, tests | Дополнительные требования `AGENTS.md` |

PER-CS описывает размещение attributes, но не разрешает неподтверждённые
Laravel classes и не расширяет approved attribute matrix. Обязательный PHPDoc
проекта сохраняется: при наличии attributes docblock располагается перед ними,
без пустых строк между docblock, attributes и declaration.

## Workflow

1. До написания или review PHP-кода прочитать `SKILL.md` и объявить выбор skill.
2. Добавить Laravel skills только для соответствующих concerns; проверить
   поддерживаемый синтаксис и version-specific framework API.
3. Применить PER-CS к затронутому коду, сохраняя scope задачи.
4. Выполнить PHP CS Fixer внутри Sail для затронутых файлов, проверить diff и
   правила, которые formatter не покрывает. Tests для изменения поведения
   запускать через Sail согласно `AGENTS.md`.

Проверка без изменения PHP-файлов:

```bash
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --dry-run --diff --sequential --using-cache=no <files>
```

## Formatter coverage и ограничения

19 октября через Sail подтверждены PHP 8.5.6, Laravel 13.35.0 и PHP CS Fixer
3.95.27. В `.php-cs-fixer.dist.php` явно закреплён `@PER-CS3x0`, risky rules
отключены. Дополнительно включены правила оформления PHPDoc, удаления
неиспользуемых imports, trailing commas в однострочных конструкциях и
`new` expressions без лишних скобок. Прежний `@auto` также включал
`@autoPHPMigration` по PHP constraint; массовая задача форматирования
отделяет coding style от миграции синтаксиса.

Preset 3.0 не является доказательством покрытия дополнений 3.1 в локальном
тексте. Успешный formatter run не заменяет review всех применимых правил.
Finder охватывает application code, bootstrap, config, database, routes,
tests, опубликованные переводы MoonShine, formatter config, `artisan` и
`public/index.php`. Зависимости, skills, сгенерированные IDE helpers,
кеши и SSR output исключены. Blade не передаётся PHP CS Fixer: в текущем
`resources/views/app.blade.php` нет PHP-фрагментов, только Blade directives.

Остаются `Needs review`: upstream revision локальной копии, полное formatter
coverage дополнений 3.1 и автоматическое появление нового skill в каталоге
следующей сессии Codex. В текущем Sail CLI все skills имеют `Agents: not linked`;
это свойство среды discovery, отдельно от фактического чтения skill в сессии.
