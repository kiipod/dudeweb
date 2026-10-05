# Codex Skills проекта

Документация описывает project-level skills из `.agents/skills/` по состоянию
на 5 октября 2026 года. Фактическая инвентаризация, CLI sources и состав
ресурсов находятся в [inventory.md](inventory.md).

Наличие skill означает только установку. Перед применением нужно отдельно
проверить, относится ли он к задаче, доступны ли его обязательные resources и
не конфликтует ли guidance с проектом или установленной версией технологии.

## Installed Skills

| Skill | Source | Область | Когда использовать |
|---|---|---|---|
| [`frontend-design`](frontend-design.md) | `anthropics/skills` | UI/UX и visual direction | Новый или существенно изменяемый UI, design plan, visual critique |
| [`laravel-13-attribute-refactor`](laravel-13-attribute-refactor.md) | `local` | Laravel 13 property-to-attribute migration | Только явная задача на Laravel attributes после проверки framework API |
| [`laravel-best-practices`](laravel-best-practices.md) | `laravel/boost` | Laravel backend architecture и implementation | Любое написание, review или refactor Laravel PHP code |
| [`nuxt-ui`](nuxt-ui.md) | `onmax/nuxt-skills` | Nuxt UI v4 components, layouts и theme | UI на `@nuxt/ui`: component selection, forms, tables, overlays, theming |
| [`tailwind-4-docs`](tailwind-4-docs.md) | `lombiq/tailwind-agent-skills` | Tailwind v4 API, config и migration | Version-specific Tailwind вопрос; требуется актуальный local docs snapshot |
| [`tailwind-css-patterns`](tailwind-css-patterns.md) | `giuseppe-trisciuoglio/developer-kit` | Tailwind implementation patterns | Responsive layout, accessibility, motion и utility composition с проверкой v4 syntax |
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
├── Nuxt UI component / page / theme
│   └── vue-best-practices + nuxt-ui
├── Tailwind
│   ├── Точный v4 API / config / migration
│   │   └── tailwind-4-docs (только с актуальным snapshot)
│   └── Layout / accessibility / motion pattern
│       └── tailwind-css-patterns + version check при необходимости
└── Полная frontend feature
    ├── frontend-design — если есть новый visual/UX scope
    ├── vue-best-practices — architecture и contracts
    ├── nuxt-ui — library components и semantic theme
    └── Tailwind skill — только по фактическому custom styling concern
```

### Наиболее специализированный skill

- UI/UX direction: `frontend-design`.
- Vue architecture, reactivity и component contracts: `vue-best-practices`.
- Nuxt UI component API/selection/theming: `nuxt-ui`.
- Tailwind v4 API и migration: `tailwind-4-docs`, если snapshot доступен.
- Tailwind layout/accessibility patterns: `tailwind-css-patterns`.
- Общая Laravel implementation: `laravel-best-practices`.
- Laravel 13 attribute mapping: `laravel-13-attribute-refactor`, но только для
  classes, подтверждённых установленным framework.

Специализация не создаёт автоматического приоритета над `AGENTS.md`, project
architecture или фактическим API dependency.

## Совместное использование

| Тип задачи | Skills | Ответственность | Необходимость и ограничения |
|---|---|---|---|
| Обычная Laravel feature | `laravel-best-practices` | Architecture, security, queries, tests, verification | Достаточен один skill, если attribute syntax не затронут |
| Laravel attribute refactor | `laravel-best-practices` + `laravel-13-attribute-refactor` | Первый задаёт project/version boundaries; второй — подтверждённый mapping | Оба нужны для code change; 7 заявленных mappings отсутствуют в Laravel 13.34.0 |
| Vue component без Nuxt UI | `vue-best-practices` + optional Tailwind skill | Vue boundaries/data flow; styling concern отдельно | Tailwind skill не нужен без Tailwind/API изменения |
| Nuxt UI form/table/overlay | `vue-best-practices` + `nuxt-ui` | Vue architecture; library component choice/API/theme | Design skill нужен только при новом visual scope; extra dependencies не добавлять автоматически |
| Vue + custom Tailwind layout | `vue-best-practices` + `tailwind-css-patterns` + optional `tailwind-4-docs` | Component/data flow; implementation pattern; v4 API verification | Docs skill сейчас ограничен отсутствующим snapshot |
| Новый публичный UI | `frontend-design` + `vue-best-practices` + `nuxt-ui` + relevant Tailwind skill | Brief/visual system; architecture; components; custom styling | Не загружать Tailwind resources, если Nuxt UI/theme полностью закрывает задачу |
| Visual critique без code | `frontend-design` | Design analysis | Остальные skills не обязательны |

## Конфликты и приоритеты

### Подтверждённые ограничения

- `laravel-13-attribute-refactor` перечисляет 7 classes, отсутствующих в
  Laravel 13.34.0. Установленный framework является проверяемым ограничением;
  такие mappings использовать нельзя.
- `laravel-best-practices` допускает небольшую inline validation, но
  `AGENTS.md` требует FormRequest для controller validation. В этом проекте
  применяется более конкретное project rule.
- `nuxt-ui` требует semantic colors для library UI, тогда как
  `tailwind-css-patterns` часто показывает raw palette classes. В Nuxt UI
  components специализированный semantic vocabulary применим лучше.
- `tailwind-css-patterns` смешивает v4 CSS-first guidance с legacy
  `tailwind.config.js`, `content`, PurgeCSS, JIT и `darkMode` snippets. Текущий
  project setup и `AGENTS.md` требуют CSS-first Tailwind 4.
- `nuxt-ui` installation examples используют pnpm, но проект требует npm.
- `vue-best-practices` по умолчанию предлагает TypeScript, а проект сейчас на
  JavaScript. Используется `<script setup>` без самовольной TS migration.

### Needs review

- `tailwind-4-docs` установлен, но official docs snapshot не инициализирован;
  полный version-specific workflow недоступен.
- Требование `vue-best-practices` всегда использовать `shallowRef()` для
  primitives нетипично и должно быть проверено по official Vue docs и local
  conventions перед массовым применением.
- Rule index `laravel-best-practices` ссылается на шесть `.md` путей, тогда как
  фактические resources имеют расширение `.blade.php`.
- `testing-best-practices`, на который ссылается Laravel skill, не установлен.

Формального общего порядка приоритета между skills их тексты не задают. Если
instructions отвечают за разные concerns, они применяются совместно. Если они
расходятся, решение ограничивают пользовательская задача, `AGENTS.md`,
существующая архитектура и подтверждённый API; неразрешённые случаи остаются
`Needs review`.

## Project Relevance

| Skill | Relevance | Причина |
|---|---|---|
| `frontend-design` | High | В проекте есть пользовательский Vue/Nuxt UI интерфейс; нужен для новых и существенно изменяемых экранов |
| `laravel-13-attribute-refactor` | Low | Runtime подходит, но scope узкий, явной migration-задачи нет, часть mappings ошибочна для Laravel 13.34.0 |
| `laravel-best-practices` | High | Laravel — backend проекта; skill покрывает основные code paths и quality concerns |
| `nuxt-ui` | High | `@nuxt/ui` 4.11.0 реально подключён через Vite/Inertia и используется в SFC |
| `tailwind-4-docs` | Medium | Tailwind 4.3.3 используется, но snapshot отсутствует и полный workflow сейчас заблокирован |
| `tailwind-css-patterns` | Medium | Layout/accessibility полезны, но legacy fragments и raw colors требуют фильтрации |
| `vue-best-practices` | High | Vue 3.5.42 и Inertia Vue формируют frontend; skill обязателен для Vue tasks |

Оценка relevance показывает пользу для текущего стека, а не автоматическое
применение к каждой задаче.
