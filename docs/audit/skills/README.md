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
| [`laravel-13-attribute-refactor`](laravel-13-attribute-refactor.md) | `local` | Laravel 13 property-to-attribute migration | Только явная задача на Laravel attributes после проверки framework API |
| [`laravel-best-practices`](laravel-best-practices.md) | `laravel/boost` | Laravel backend architecture и implementation | Любое написание, review или refactor Laravel PHP code |
| [`tailwind-4-docs`](tailwind-4-docs.md) | `lombiq/tailwind-agent-skills` | Tailwind v4 API, config и migration | Version-specific Tailwind вопрос; требуется актуальный local docs snapshot |
| [`vue-best-practices`](vue-best-practices.md) | `vuejs-ai/skills` | Vue 3 architecture и data flow | Любая Vue/.vue/Vue Router/Vite-with-Vue задача |

## Skill Selection

```text
Тип задачи
├── Laravel backend
│   ├── Обычная feature / bugfix / review
│   │   └── laravel-best-practices
│   └── Явная Laravel 13 attribute migration
│       └── laravel-best-practices + laravel-13-attribute-refactor
├── Frontend visual design
│   └── frontend-design
├── Vue behavior / architecture
│   └── vue-best-practices
├── Tailwind v4 API / config / migration
│   └── tailwind-4-docs (только с актуальным snapshot)
└── Полная frontend feature
    ├── frontend-design — если есть новый visual/UX scope
    ├── vue-best-practices — architecture и contracts
    └── tailwind-4-docs — только по фактическому version-specific concern
```

### Наиболее специализированный установленный skill

- UI/UX direction: `frontend-design`.
- Vue architecture, reactivity и component contracts: `vue-best-practices`.
- Tailwind v4 API и migration: `tailwind-4-docs`, если snapshot доступен.
- Общая Laravel implementation: `laravel-best-practices`.
- Laravel 13 attribute mapping: `laravel-13-attribute-refactor`, только для
  classes, подтверждённых установленным framework.

Для API сторонних UI-библиотек и общих Tailwind implementation patterns
отдельного project skill сейчас нет. Такой API нужно проверять по фактически
установленной dependency и официальной документации; отсутствующий skill нельзя
считать выбранным.

## Совместное использование

| Тип задачи | Skills | Ответственность | Ограничения |
|---|---|---|---|
| Обычная Laravel feature | `laravel-best-practices` | Architecture, security, queries, tests, verification | Достаточен один skill, если attribute syntax не затронут |
| Laravel attribute refactor | `laravel-best-practices` + `laravel-13-attribute-refactor` | Project boundaries и подтверждённый attribute mapping | Часть заявленных mappings отсутствует в установленном Laravel; каждый API проверяется по source |
| Vue behavioral change | `vue-best-practices` | Component boundaries, reactivity, data flow | Не добавлять visual/design scope без необходимости |
| Vue + custom Tailwind API | `vue-best-practices` + `tailwind-4-docs` | Vue contracts и точный Tailwind v4 API | Tailwind skill применим только с актуальным snapshot |
| Новый публичный UI | `frontend-design` + `vue-best-practices` + optional `tailwind-4-docs` | Visual direction, architecture, version-specific styling | Library component API проверяется отдельно по установленным sources |
| Visual critique без code | `frontend-design` | Design analysis | Остальные skills не обязательны |

## Подтверждённые ограничения

- `laravel-13-attribute-refactor` перечисляет classes, отсутствующие в
  установленном Laravel. Version gate недостаточен: каждый mapping нужно
  подтверждать по framework source.
- `laravel-best-practices` допускает inline validation, но `AGENTS.md` требует
  FormRequest для controller validation.
- `vue-best-practices` по умолчанию предлагает TypeScript, а проект сохраняет
  текущий JavaScript stack и `<script setup>`.
- `tailwind-4-docs` не является полным API source без актуального snapshot.

## Needs review

- `tailwind-4-docs` установлен, но official docs snapshot не инициализирован.
- Требование `vue-best-practices` всегда использовать `shallowRef()` для
  primitives нетипично и требует проверки по official Vue docs.
- Rule index `laravel-best-practices` ссылается на шесть `.md` путей, тогда как
  фактические resources имеют расширение `.blade.php`.
- `testing-best-practices`, на который ссылается Laravel skill, не установлен.

## Project Relevance

| Skill | Relevance | Причина |
|---|---|---|
| `frontend-design` | High | В проекте есть пользовательский Vue/Inertia UI; нужен для новых и существенно изменяемых экранов |
| `laravel-13-attribute-refactor` | Low | Scope узкий, явной attribute migration-задачи нет, часть mappings не подтверждается framework |
| `laravel-best-practices` | High | Laravel — backend проекта; skill покрывает основные code paths и quality concerns |
| `tailwind-4-docs` | Medium | Tailwind 4.3.3 используется, но snapshot отсутствует |
| `vue-best-practices` | High | Vue 3.5.42 и Inertia Vue 2.3.27 формируют frontend |

## Codex Availability

Проверка 13 октября 2026 года подтвердила пять установленных и обнаруживаемых
skills. Четыре remote skills записаны в `skills-lock.json`; локальный
`laravel-13-attribute-refactor` обнаруживается по `SKILL.md` без lock-записи.

| Skill | Installed | Discovered | Codex | Audit status | Известные проблемы |
|---|---|---|---|---|---|
| `frontend-design` | Да | Да | Да | Available | Operational blockers не найдены |
| `laravel-13-attribute-refactor` | Да | Да | Да | Needs review | Attribute classes и constructor signatures проверяются по framework source |
| `laravel-best-practices` | Да | Да | Да | Needs review | Resource links и referenced testing skill требуют проверки |
| `tailwind-4-docs` | Да | Да | Да | Needs review | Official docs snapshot не инициализирован |
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

Фактический список всегда перепроверяется через `npx skills list`; старые планы
не являются текущей инвентаризацией.
