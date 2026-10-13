# Codex Skills проекта

Первичный аудит выполнен 5 октября 2026 года. Состояние установки и карта
выбора актуализированы 13 октября 2026 года по фактическому содержимому
`.agents/skills/`, `skills-lock.json` и выводу `npx skills list`.

Наличие skill означает только установку. Перед применением нужно отдельно
проверить, относится ли он к задаче, доступны ли обязательные resources и не
конфликтует ли guidance с проектом или установленной версией технологии.

## Installed Skills

| Skill | Source | Область | Когда использовать |
|---|---|---|---|
| [`frontend-design`](frontend-design.md) | `anthropics/skills` | UI/UX и visual direction | Новый или существенно изменяемый UI, design plan, visual critique |
| [`laravel-13-attribute-refactor`](laravel-13-attribute-refactor.md) | `local` | Project-specific Laravel 13 attribute policy | Создание, обновление или refactor поддерживаемого компонента с разрешённой attribute-конфигурацией |
| [`laravel-best-practices`](laravel-best-practices.md) | `laravel/boost` | Laravel backend architecture и implementation quality | Architecture, security, validation, Eloquent/query behavior, error handling или general quality concerns |
| [`tailwind-4-docs`](tailwind-4-docs.md) | `lombiq/tailwind-agent-skills` | Tailwind v4 API, config и migration | Version-specific Tailwind вопрос; требуется актуальный local docs snapshot |
| [`tailwind-best-practices`](tailwind-best-practices.md) | `evilmartians.com` | Tailwind maintainability и design-system discipline | Написание, review или refactor Tailwind classes, tokens и component variants |
| [`vue-best-practices`](vue-best-practices.md) | `vuejs-ai/skills` | Vue 3 architecture и data flow | Любая Vue/.vue/Vue Router/Vite-with-Vue задача |

## Skill Selection

```text
Тип задачи
├── Laravel backend
│   ├── Architecture / security / queries / validation / general review
│   │   └── laravel-best-practices
│   ├── Разрешённая Laravel 13 attribute-конфигурация
│   │   └── laravel-13-attribute-refactor
│   └── Обе области в одной задаче
│       └── оба skills, выбранные независимо
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
| Обычная Laravel feature | `laravel-best-practices` | Architecture, security, queries, tests, verification | Достаточен один skill, если разрешённая attribute-конфигурация не затронута |
| Создание или refactor разрешённой attribute-конфигурации | `laravel-13-attribute-refactor` | Attribute selection, framework API verification и safe conversion | Явный attribute-запрос не нужен; Job `Middleware` и Form Request `RedirectToAction` пока недоступны |
| Laravel feature с attribute и general backend concerns | Оба skills, выбранные независимо | Каждый skill отвечает только за собственный concern | Ни один skill не является prerequisite другого |
| Vue behavioral change | `vue-best-practices` | Component boundaries, reactivity, data flow | Не добавлять visual/design scope без необходимости |
| Tailwind component без спорного API | `tailwind-best-practices` + `vue-best-practices` для `.vue` | Maintainability styling и Vue contracts | Сначала проверить tokens/component foundation; не выполнять побочный cleanup |
| Vue + custom Tailwind API | `vue-best-practices` + `tailwind-best-practices` + `tailwind-4-docs` | Vue contracts, maintainability и точный Tailwind v4 API | Docs skill применим только с актуальным snapshot |
| Новый публичный UI | `frontend-design` + `vue-best-practices` + `tailwind-best-practices` + optional `tailwind-4-docs` | Visual direction, architecture, maintainable styling, version-specific API | Library component API проверяется отдельно по установленным sources |
| Visual critique без code | `frontend-design` | Design analysis | Остальные skills не обязательны |

## Подтверждённые ограничения

- `laravel-13-attribute-refactor` ограничен project-specific матрицей. В
  Laravel 13.34.0 отсутствуют Job `Middleware` и Form Request
  `RedirectToAction`; остальные mappings всё равно проверяются по source.
- `laravel-best-practices` допускает inline validation, но `AGENTS.md` требует
  FormRequest для controller validation.
- `vue-best-practices` по умолчанию предлагает TypeScript, а проект сохраняет
  текущий JavaScript stack и `<script setup>`.
- `tailwind-best-practices` показывает React `className` и JS-like token config;
  проект требует Vue contracts и CSS-first `@theme`.
- `tailwind-4-docs` не является полным API source без актуального snapshot.

## Needs review

- `tailwind-4-docs` установлен, но official docs snapshot не инициализирован.
- В проекте пока нет semantic `@theme` tokens и shared design-system component
  layer, которые `tailwind-best-practices` называет обязательной foundation.
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
| `frontend-design` | High | В проекте есть пользовательский Vue/Inertia UI; нужен для новых и существенно изменяемых экранов |
| `laravel-13-attribute-refactor` | High | Автоматически применяется к разрешённой attribute-конфигурации при создании и refactor распространённых Laravel components |
| `laravel-best-practices` | High | Laravel — backend проекта; skill покрывает основные code paths и quality concerns |
| `tailwind-4-docs` | Medium | Tailwind 4.3.3 используется, но snapshot отсутствует |
| `tailwind-best-practices` | High, conditional | Tailwind используется во Vue UI; полный workflow требует сначала создать semantic tokens и shared component layer |
| `vue-best-practices` | High | Vue 3.5.44 и Inertia Vue 3.9.1 формируют frontend |

## Codex Availability

Проверка 13 октября 2026 года подтвердила шесть установленных и обнаруживаемых
skills. Пять remote skills записаны в `skills-lock.json`; локальный
`laravel-13-attribute-refactor` обнаруживается по `SKILL.md` без lock-записи.

| Skill | Installed | Discovered | Codex | Audit status | Известные проблемы |
|---|---|---|---|---|---|
| `frontend-design` | Да | Да | Да | Available | Operational blockers не найдены |
| `laravel-13-attribute-refactor` | Да | Да | Да | Available | Два разрешённых будущих mappings имеют статус `Needs review` в Laravel 13.34.0 |
| `laravel-best-practices` | Да | Да | Да | Needs review | Resource links и referenced testing skill требуют проверки |
| `tailwind-4-docs` | Да | Да | Да | Needs review | Official docs snapshot не инициализирован |
| `tailwind-best-practices` | Да | Да | Да | Conditional | Project foundation неполна; variant example требует исправления при переносе |
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

Project-level selection map явно требует `tailwind-best-practices` при
написании, изменении, review, cleanup, refactor или аудите Tailwind code. Для
первичного переноса Pen-макета отсутствие готовых tokens/components считается
начальным условием: сначала создаётся foundation, затем screens. Это правило не
заменяет `tailwind-4-docs` для точного v4 API.

Фактический список всегда перепроверяется через `npx skills list`; старые планы
не являются текущей инвентаризацией.
