# Инвентаризация Codex Skills

Инвентаризация обновлена 13 октября 2026 года по фактическому содержимому
`.agents/skills/`, `skills-lock.json` и выводу `npx skills list`.

`Available` означает, что каталог и `SKILL.md` существуют, CLI обнаруживает
skill и указывает Codex среди Agents. Это не доказывает применимость или выбор
skill в конкретной задаче.

## Установленные skills

| Skill | Path | Source | Lock | Resources | Status |
|---|---|---|---|---|---|
| `frontend-design` | `.agents/skills/frontend-design/` | `anthropics/skills` | Да | `LICENSE.txt` | Available |
| `laravel-13-attribute-refactor` | `.agents/skills/laravel-13-skills/` | `local` | Нет, local skill | Дополнительных ресурсов нет | Available |
| `laravel-best-practices` | `.agents/skills/laravel-best-practices/` | `laravel/boost` | Да | `rules/` (19 файлов) | Available |
| `tailwind-4-docs` | `.agents/skills/tailwind-4-docs/` | `lombiq/tailwind-agent-skills` | Да | `references/` (3 файла), `scripts/` (1 файл) | Available, snapshot not initialized |
| `vue-best-practices` | `.agents/skills/vue-best-practices/` | `vuejs-ai/skills` | Да | `references/` (22 файла) | Available |

## Дополнительные ресурсы установленных skills

### `frontend-design`

- `LICENSE.txt` — Apache License 2.0.
- References, scripts, examples и templates отсутствуют.

### `laravel-13-attribute-refactor`

- Дополнительные файлы и каталоги отсутствуют.
- Skill локальный, поэтому отсутствие записи в `skills-lock.json` ожидаемо.

### `laravel-best-practices`

- `rules/` содержит 19 тематических файлов.
- Часть ссылок index использует расширение `.md`, тогда как реальные файлы
  имеют расширение `.blade.php`; routing требует проверки.

### `tailwind-4-docs`

- `references/docs-source.txt` сообщает `Status: Not initialized`.
- `references/gotchas.md` и `references/engineering-playbook.md` доступны как
  ограниченный fallback.
- `scripts/sync_tailwind_docs.py` требует явного принятия upstream license и
  отдельного разрешения на network/write operation.

### `vue-best-practices`

- `references/` содержит 22 файла.
- Core routing требует читать reactivity, SFC, component data flow и composables
  для Vue implementation; optional references выбираются по scope.

## Проверка

- В `.agents/skills/` находятся 5 файлов `SKILL.md`.
- `npx skills list` обнаруживает те же 5 skills и указывает `Agents: Codex`.
- `skills-lock.json` содержит 4 remote skills; local Laravel attribute skill
  обнаруживается без lock-записи.

## Расхождения и Needs review

- Между текущей filesystem-инвентаризацией и `npx skills list` расхождений нет.
- Старые планы не должны использоваться вместо этой инвентаризации.
