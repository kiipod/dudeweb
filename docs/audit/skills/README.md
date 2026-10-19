# Codex Skills проекта

Первичный аудит выполнен 5 октября 2026 года. Состояние установки и карта
выбора актуализированы 19 октября 2026 года по фактическому содержимому
`.agents/skills/`, `skills-lock.json` и выводу `./vendor/bin/sail npx skills list`.

Наличие skill означает только установку. Перед применением нужно отдельно
проверить, относится ли он к задаче, доступны ли обязательные resources и не
конфликтует ли guidance с проектом или установленной версией технологии.

## Installed Skills

| Skill | Source | Область | Когда использовать |
|---|---|---|---|
| [`php-per-cs3`](php-per-cs3.md) | `local`, текст PHP-FIG | Базовый PHP coding style: PER-CS 3.x | Первым при любом написании, изменении, review или refactor PHP-кода проекта |
| [`frontend-design`](frontend-design.md) | `anthropics/skills` | UI/UX и visual direction | Новый или существенно изменяемый UI, design plan, visual critique |
| [`laravel-13-attribute-refactor`](laravel-13-attribute-refactor.md) | `local` | Project-specific Laravel 13 attribute policy | Создание, обновление или refactor поддерживаемого компонента с разрешённой attribute-конфигурацией |
| [`laravel-best-practices`](laravel-best-practices.md) | `laravel/boost` | Laravel backend architecture и implementation quality | Architecture, security, validation, Eloquent/query behavior, error handling или general quality concerns |
| [`tailwind-4-docs`](tailwind-4-docs.md) | `lombiq/tailwind-agent-skills` | Tailwind v4 API, config и migration | Version-specific Tailwind вопрос; требуется актуальный local docs snapshot |
| [`tailwind-best-practices`](tailwind-best-practices.md) | `evilmartians.com` | Tailwind maintainability и design-system discipline | Написание, review или refactor Tailwind classes, tokens и component variants |
| [`vue-best-practices`](vue-best-practices.md) | `vuejs-ai/skills` | Vue 3 architecture и data flow | Любая Vue/.vue/Vue Router/Vite-with-Vue задача |

## Skill Selection

```text
Тип задачи
├── Любой PHP-код (включая tests / routes / config / tooling)
│   ├── Сначала php-per-cs3 — обязательный базовый coding style
│   └── Если затронут Laravel backend, дополнительно по concerns
│       ├── Architecture / security / queries / validation / general review
│       │   └── laravel-best-practices
│       └── Разрешённая Laravel 13 attribute-конфигурация
│           └── laravel-13-attribute-refactor
├── Frontend visual design
│   └── frontend-design
├── Vue behavior / architecture
│   └── vue-best-practices
├── Tailwind
│   ├── Classes / tokens / ordering / component variants
│   │   └── tailwind-best-practices
│   └── v4 API / config / migration
│       └── tailwind-4-docs (только с актуальным snapshot)
└── Полная frontend feature
    ├── frontend-design — если есть новый visual/UX scope
    ├── vue-best-practices — architecture и contracts
    ├── tailwind-best-practices — если пишутся или меняются Tailwind classes
    └── tailwind-4-docs — только по фактическому version-specific concern
```

### Наиболее специализированный установленный skill

- PHP coding style: `php-per-cs3`, обязательный первый skill для PHP-кода.
- UI/UX direction: `frontend-design`.
- Vue architecture, reactivity и component contracts: `vue-best-practices`.
- Tailwind maintainability, tokens и component variants:
  `tailwind-best-practices`.
- Tailwind v4 API и migration: `tailwind-4-docs`, если snapshot доступен.
- Общая Laravel implementation: `laravel-best-practices`.
- Laravel 13 attribute policy: `laravel-13-attribute-refactor`, для разрешённой
  матрицы и только после проверки установленного framework.

Для API сторонних UI-библиотек отдельного project skill нет. Такой API нужно
проверять по фактически установленной dependency и официальной документации.
`tailwind-best-practices` не является API source и не заменяет эту проверку.

## Совместное использование

| Тип задачи | Skills | Ответственность | Ограничения |
|---|---|---|---|
| PHP helper, config, route, test или tooling | Сначала `php-per-cs3`; Laravel skills по concerns | PER-CS 3.x для любого PHP-кода | Даже небольшое PHP-изменение требует базовый skill; массовое форматирование не подразумевается |
| Обычная Laravel feature | Сначала `php-per-cs3`, затем `laravel-best-practices` | PHP style; architecture, security, queries, tests, verification | Attribute skill добавляется при затронутой разрешённой configuration |
| Создание или refactor разрешённой attribute-конфигурации в PHP | Сначала `php-per-cs3`, затем `laravel-13-attribute-refactor` | PHP style и размещение attributes; attribute selection, framework API verification и safe conversion | Явный attribute-запрос не нужен; Job `Middleware` и Form Request `RedirectToAction` пока недоступны |
| Laravel feature с attribute и general backend concerns | Сначала `php-per-cs3`, затем оба Laravel skills по их concerns | Каждый skill отвечает за собственную область | Laravel skills независимы друг от друга; PER-CS приоритетен для PHP style |
| Vue behavioral change | `vue-best-practices` | Component boundaries, reactivity, data flow | Не добавлять visual/design scope без необходимости |
| Tailwind component без спорного API | `tailwind-best-practices` + `vue-best-practices` для `.vue` | Maintainability styling и Vue contracts | Сначала проверить tokens/component foundation; не выполнять побочный cleanup |
| Vue + custom Tailwind API | `vue-best-practices` + `tailwind-best-practices` + `tailwind-4-docs` | Vue contracts, maintainability и точный Tailwind v4 API | Docs skill применим только с актуальным snapshot |
| Новый публичный UI | `frontend-design` + `vue-best-practices` + `tailwind-best-practices` + optional `tailwind-4-docs` | Visual direction, architecture, maintainable styling, version-specific API | Library component API проверяется отдельно по установленным sources |
| Visual critique без code | `frontend-design` | Design analysis | Остальные skills не обязательны |

## Подтверждённые ограничения

- `laravel-13-attribute-refactor` ограничен project-specific матрицей. В
  Laravel 13.35.0 по повторной проверке 19 октября отсутствуют Job `Middleware` и Form Request
  `RedirectToAction`; остальные mappings всё равно проверяются по source.
- `php-per-cs3` заменяет прежний PSR-12 как базовый PHP coding style и
  применяется раньше Laravel skills. Сохранены проектные требования PHPDoc,
  FormRequest, Policies, approved attributes и проверки через Sail.
- Добавленный текст включает правила PER-CS 3.1, а не только 3.0; upstream
  commit/tag для локальной копии не зафиксирован. Подробности — в карточке skill.
- PHP CS Fixer 3.95.27 использует явно закреплённый `@PER-CS3x0` с
  дополнительными правилами PHPDoc, imports, trailing commas и `new`
  expressions. Автоматические PHP migration rules отключены. Покрытие
  дополнений 3.1 проверяется отдельно от успешного formatter run.
- `laravel-best-practices` допускает inline validation, но `AGENTS.md` требует
  FormRequest для controller validation.
- `vue-best-practices` по умолчанию предлагает TypeScript, а проект сохраняет
  текущий JavaScript stack и `<script setup>`.
- `tailwind-best-practices` показывает React `className` и JS-like token config;
  проект требует Vue contracts и CSS-first `@theme`.
- `tailwind-4-docs` не является полным API source без актуального snapshot.

## Needs review

- Полное покрытие локального PER-CS 3.x текста установленным PHP CS Fixer и
  фиксация upstream revision; это не препятствует применению стандарта вручную.
- `tailwind-4-docs` установлен, но official docs snapshot не инициализирован.
- Semantic `@theme` tokens и shared components уже существуют в
  `resources/css/app.css` и `resources/js/components/ui/`; достаточность
  foundation проверяется для конкретной feature, а не по старому аудиту.
- Variant example в `tailwind-best-practices` не выполняет lookup по variant key
  и одновременно сохраняет произвольный `className`; production contract нужно
  проектировать отдельно.
- Требование `vue-best-practices` всегда использовать `shallowRef()` для
  primitives нетипично и требует проверки по official Vue docs.
- Rule index `laravel-best-practices` ссылается на шесть `.md` путей, тогда как
  фактические resources имеют расширение `.blade.php`.
- `testing-best-practices`, на который ссылается Laravel skill, не установлен.

## Project Relevance

| Skill | Relevance | Причина |
|---|---|---|
| `php-per-cs3` | High, mandatory for PHP | Основной стандарт всего PHP-кода проекта; первым выбирается для написания, изменения, review и refactor |
| `frontend-design` | High | В проекте есть пользовательский Vue/Inertia UI; нужен для новых и существенно изменяемых экранов |
| `laravel-13-attribute-refactor` | High | Автоматически применяется к разрешённой attribute-конфигурации при создании и refactor распространённых Laravel components |
| `laravel-best-practices` | High | Laravel — backend проекта; skill покрывает основные code paths и quality concerns |
| `tailwind-4-docs` | Medium | Tailwind 4.3.3 используется, но snapshot отсутствует |
| `tailwind-best-practices` | High | Tailwind используется во Vue UI; semantic tokens и shared component layer уже существуют, их достаточность проверяется по scope |
| `vue-best-practices` | High | Vue 3.5.44 и Inertia Vue 3.9.1 формируют frontend |

## Codex Availability

Проверка 19 октября 2026 года: семь установленных skills. До исправления
frontmatter CLI пропускал `php-per-cs3` из-за отсутствующих `name` и `description`;
после исправления обнаруживает все семь. Пять remote skills записаны в
`skills-lock.json`; два local skills обнаруживаются без lock-записей.

В Sail CLI выводит `Agents: not linked` для всех skills. Это результат проверки
в контейнере, где нет обнаруженной привязки к агенту; он не доказывает отсутствие
skills в хостовой сессии Codex. В каталоге текущей сессии присутствуют шесть
прежних project skills, новый прочитан напрямую по пути. Автоматическое появление
`php-per-cs3` в каталоге следующей сессии нужно проверить отдельно. Discovery,
session availability и фактический выбор не следует смешивать.

| Skill | Installed | Discovered (Sail CLI) | Каталог текущей сессии Codex | Audit status | Известные проблемы |
|---|---|---|---|---|---|
| `php-per-cs3` | Да | Да, после исправления | Нет, прочитан напрямую | Applicable; discovery исправлен | Полное покрытие formatter и upstream revision требуют проверки |
| `frontend-design` | Да | Да | Да | Available | Operational blockers не найдены |
| `laravel-13-attribute-refactor` | Да | Да | Да | Available | Два разрешённых будущих mappings имеют статус `Needs review` в Laravel 13.35.0 |
| `laravel-best-practices` | Да | Да | Да | Needs review | Resource links и referenced testing skill требуют проверки |
| `tailwind-4-docs` | Да | Да | Да | Needs review | Official docs snapshot не инициализирован |
| `tailwind-best-practices` | Да | Да | Да | Available with project constraints | Foundation существует; variant example требует исправления при переносе |
| `vue-best-practices` | Да | Да | Да | Needs review | Правило `shallowRef` для primitives требует дополнительной проверки |

### Четыре разных состояния

- **Installed** — каталог находится в `.agents/skills/`, а `SKILL.md` существует.
- **Discovered by tooling** — skill присутствует в `npx skills list`.
- **Applicable to task** — scope задачи совпадает с назначением и resource
  constraints skill.
- **Actually selected during execution** — агент загрузил и применяет skill в
  текущем turn.

Первые три состояния не доказывают четвёртое. `Agents: Codex` означает только,
что tooling предоставляет skill Codex.

## Синхронизация с AGENTS.md

`AGENTS.md` уже различает installed/discovered/applicable/selected и требует
явно объявлять выбранные skills.

Для любого PHP-кода первым обязателен `php-per-cs3`; дополнительные Laravel
skills выбираются по своим concerns. Приоритет относится к coding style и не
меняет architecture, framework API или разрешённую attribute-матрицу. Прежнее
требование PSR-12 заменено PER-CS 3.x; PHPDoc остаётся проектным дополнением.

Project-level selection map явно требует `tailwind-best-practices` при
написании, изменении, review, cleanup, refactor или аудите Tailwind code. Для
первичного переноса Pen-макета отсутствие готовых tokens/components считается
начальным условием: сначала создаётся foundation, затем screens. Это правило не
заменяет `tailwind-4-docs` для точного v4 API.

Фактический список всегда перепроверяется через `npx skills list`; старые планы
не являются текущей инвентаризацией.
