# Инвентаризация Codex Skills

Инвентаризация обновлена 19 октября 2026 года по фактическому содержимому
`.agents/skills/`, `skills-lock.json` и выводу `./vendor/bin/sail npx skills list`.

`Available` здесь означает, что каталог и `SKILL.md` существуют и CLI обнаруживает
skill. В контейнере Sail CLI указывает `Agents: not linked` для всех skills;
каталог текущей сессии Codex описан отдельно в `README.md`. Discovery не
доказывает применимость, автоматическую загрузку или выбор skill в задаче.

## Установленные skills

| Skill | Path | Source | Lock | Resources | Status |
|---|---|---|---|---|---|
| `php-per-cs3` | `.agents/skills/php-per-cs3/` | `local`, текст PHP-FIG PER-CS 3.x | Нет, local skill | Текст стандарта в `SKILL.md`, дополнительных ресурсов нет | Available после исправления frontmatter; обязательный первый для PHP |
| `frontend-design` | `.agents/skills/frontend-design/` | `anthropics/skills` | Да | `LICENSE.txt` | Available |
| `laravel-13-attribute-refactor` | `.agents/skills/laravel-13-skills/` | `local` | Нет, local skill | Дополнительных ресурсов нет | Available |
| `laravel-best-practices` | `.agents/skills/laravel-best-practices/` | `laravel/boost` | Да | `rules/` (19 файлов) | Available |
| `tailwind-4-docs` | `.agents/skills/tailwind-4-docs/` | `lombiq/tailwind-agent-skills` | Да | `references/` (3 файла), `scripts/` (1 файл) | Available, snapshot not initialized |
| `tailwind-best-practices` | `.agents/skills/tailwind-best-practices/` | `evilmartians.com` | Да, `well-known` | Дополнительных ресурсов нет | Available, conditional applicability |
| `vue-best-practices` | `.agents/skills/vue-best-practices/` | `vuejs-ai/skills` | Да | `references/` (22 файла) | Available |

## Дополнительные ресурсы установленных skills

### `php-per-cs3`

- Локальный skill; в `skills-lock.json` записи нет, remote source/hash не выдумываются.
- Изначально `SKILL.md` содержал только текст стандарта без YAML frontmatter;
  CLI пропускал его с сообщением `missing required frontmatter field(s): name, description`.
- Добавлены `name`, `description` и краткие project usage instructions;
  предоставленный пользователем текст стандарта сохранён, убраны только
  trailing spaces в одной пустой строке.
- Текст включает дополнения PER-CS 3.1 (`clone()`, pipe operator), поэтому
  базовый стандарт обозначен как PER-CS 3.x, без неверного ограничения 3.0.
- Upstream commit/tag локальной копии не указан. Сопоставление с первичными
  источниками, scope, приоритет и formatter coverage — в [карточке](php-per-cs3.md).

### `frontend-design`

- `LICENSE.txt` — Apache License 2.0.
- References, scripts, examples и templates отсутствуют.

### `laravel-13-attribute-refactor`

- Дополнительные файлы и каталоги отсутствуют.
- Skill локальный, поэтому отсутствие записи в `skills-lock.json` ожидаемо.
- Версия `2.0.0`; selection rule применяется к разрешённой attribute-матрице
  при создании, обновлении и refactor поддерживаемых Laravel components.

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

### `tailwind-best-practices`

- Дополнительные файлы и каталоги отсутствуют.
- Source зарегистрирован в `skills-lock.json` как `well-known` и содержит
  computed hash и digest.
- Skill ссылается на статью Evil Martians; его project applicability и
  расхождения примеров описаны в `tailwind-best-practices.md`.

### `vue-best-practices`

- `references/` содержит 22 файла.
- Core routing требует читать reactivity, SFC, component data flow и composables
  для Vue implementation; optional references выбираются по scope.

## Проверка

- В `.agents/skills/` находятся 7 каталогов с `SKILL.md`; все entrypoints
  прочитаны для аудита, подсчитаны дополнительные ресурсы.
- После исправления metadata `./vendor/bin/sail npx skills list` обнаруживает
  те же 7 skills без warning о пропущенном `php-per-cs3`.
- CLI в Sail выводит `Agents: not linked`, поэтому подтверждение discovery
  отдельно от доступности в каталоге хостовой сессии.
- `skills-lock.json` содержит 5 remote skills; local Laravel attribute и
  PHP PER-CS skills обнаруживаются без lock-записей.
- Через Sail подтверждены PHP 8.5.6, Laravel 13.35.0 и PHP CS Fixer 3.95.27;
  formatter config явно использует `@PER-CS3x0` с дополнительными правилами
  PHPDoc и форматирования; PHP migration rules автоматически не включаются.
- Tailwind docs snapshot по-прежнему `Not initialized`; его содержимое не загружалось.

## Расхождения и Needs review

- Между текущей filesystem-инвентаризацией и `npx skills list` расхождений нет.
- Первоначальное расхождение (7 файлов, 6 обнаруженных skills) устранено
  добавлением frontmatter к `php-per-cs3`.
- Автоматическая доступность нового skill в каталоге следующей сессии Codex
  и покрытие дополнений PER-CS 3.1 formatter остаются `Needs review`.
- Старые планы не должны использоваться вместо этой инвентаризации.
