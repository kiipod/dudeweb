# Инвентаризация Codex Skills

Инвентаризация выполнена по фактическому содержимому `.agents/skills/` и
выводу `npx skills list` 5 октября 2026 года. Термин `Available` здесь означает,
что каталог и `SKILL.md` существуют, CLI обнаруживает skill и указывает Codex
среди Agents. Это не означает, что skill применим к любой задаче или был
автоматически выбран при её выполнении.

| Skill | Path | Source | SKILL.md | Codex | Resources | Status |
|---|---|---|---|---|---|---|
| `frontend-design` | `.agents/skills/frontend-design/` | `anthropics/skills` | Есть | Да | `LICENSE.txt` | Available |
| `laravel-13-attribute-refactor` | `.agents/skills/laravel-13-skills/` | `local` | Есть | Да | Дополнительных ресурсов нет | Available |
| `laravel-best-practices` | `.agents/skills/laravel-best-practices/` | `laravel/boost` | Есть | Да | `rules/` (19 файлов) | Available |
| `nuxt-ui` | `.agents/skills/nuxt-ui/` | `onmax/nuxt-skills` | Есть | Да | `references/` (14 файлов) | Available |
| `tailwind-4-docs` | `.agents/skills/tailwind-4-docs/` | `lombiq/tailwind-agent-skills` | Есть | Да | `references/` (3 файла), `scripts/` (1 файл) | Available |
| `tailwind-css-patterns` | `.agents/skills/tailwind-css-patterns/` | `giuseppe-trisciuoglio/developer-kit` | Есть | Да | `references/` (8 файлов) | Available |
| `vue-best-practices` | `.agents/skills/vue-best-practices/` | `vuejs-ai/skills` | Есть | Да | `references/` (22 файла) | Available |

## Дополнительные ресурсы

### `frontend-design`

- `LICENSE.txt` — отдельный файл лицензии.
- Каталоги `references/`, `examples/`, `scripts/` и templates отсутствуют.

### `laravel-13-attribute-refactor`

- Дополнительные файлы и каталоги отсутствуют.

### `laravel-best-practices`

- `rules/` содержит 19 тематических файлов: архитектура, Eloquent и запросы,
  производительность БД, кеширование, коллекции, маршрутизация, валидация,
  безопасность, обработка ошибок, HTTP client, очереди, стиль и Blade-шаблоны
  правил для views, config, events/notifications, mail, migrations и scheduling.
- Отдельных каталогов `references/`, `examples/`, `scripts/` и templates нет.
  Файлы `*.blade.php` находятся внутри `rules/` и учитываются как ресурсы skill.

### `nuxt-ui`

- `references/components.md` — индекс компонентов.
- `references/guidelines/` — 4 файла с рекомендациями по выбору компонентов,
  соглашениям, design system и формам.
- `references/layouts/` — 5 файлов для chat, dashboard, docs, editor и landing.
- `references/recipes/` — 4 файла для auth, data tables, navigation и overlays.
- Каталоги `examples/`, `scripts/` и templates отсутствуют.

### `tailwind-4-docs`

- `references/docs-source.txt`, `references/engineering-playbook.md` и
  `references/gotchas.md`.
- `scripts/sync_tailwind_docs.py`.
- Каталоги `examples/` и templates отсутствуют.

### `tailwind-css-patterns`

- `references/` содержит 8 файлов: accessibility, animations,
  component patterns, configuration, layout patterns, performance, общий
  reference и responsive design.
- Каталоги `examples/`, `scripts/` и templates отсутствуют.

### `vue-best-practices`

- `references/` содержит 22 файла о SFC, реактивности, data flow, composables,
  slots, directives, plugins, state management, async components, transitions,
  animations, Teleport, Suspense, KeepAlive, render functions и performance.
- Каталоги `examples/`, `scripts/` и templates отсутствуют.

## Сопоставление файловой системы и CLI

- В `.agents/skills/` находятся 7 каталогов skills и 7 файлов `SKILL.md`.
- `npx skills list` обнаруживает те же 7 skills.
- Имена каталогов совпадают с именами skills, кроме ожидаемого отображения
  `laravel-13-attribute-refactor` из каталога `laravel-13-skills`; имя берётся
  из metadata `SKILL.md`, а CLI показывает фактический путь каталога.
- Для всех skills CLI указывает `Agents: Codex` и предоставляет source.
- У каждого `SKILL.md` есть frontmatter с `name` и `description`.

## Расхождения

Расхождений между `.agents/skills/` и `npx skills list` не обнаружено.
Отсутствующих `SKILL.md`, недоступных Codex skills и skills с неизвестным
source нет.
