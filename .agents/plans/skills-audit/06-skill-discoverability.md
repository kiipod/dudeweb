# Шаг 6 — Проверка Codex Discoverability и AGENTS.md

На этом шаге исходные skills и `AGENTS.md` не изменяются.

## Codex Discoverability

Выполнить:

    npx skills list

Для каждого project skill проверить:

- [x] каталог существует;
- [x] `SKILL.md` существует;
- [x] metadata корректны;
- [x] skill обнаруживается tooling;
- [x] Codex указан среди Agents, если CLI предоставляет эту информацию.

Разделять понятия:

    installed
    discovered by tooling
    applicable to task
    actually selected during execution

Не утверждать, что skill автоматически применяется Codex только потому,
что он установлен или обнаруживается CLI.

## Статусы

Для каждого skill определить:

- `Available`
- `Missing`
- `Invalid`
- `Needs review`

## AGENTS.md

- [x] Найти применимый `AGENTS.md`
- [x] Прочитать инструкции, относящиеся к skills
- [x] Проверить правила выбора skills
- [x] Проверить требования явного использования skills
- [x] Проверить потенциальные конфликты с отдельными `SKILL.md`
- [x] Проверить дублирование инструкций
- [x] Проверить, достаточно ли текущих инструкций для корректного выбора skill

## Recommendations

`AGENTS.md` не изменять.

Если обнаружены необходимые улучшения, добавить в:

`docs/audit/skills/README.md`

раздел:

`## AGENTS.md Recommendations`

Для каждой рекомендации указать:

- проблему;
- почему она важна;
- предлагаемое изменение;
- связанные skills.

Изменение самого `AGENTS.md` должно выполняться отдельной будущей задачей.

## README

Добавить:

`## Codex Availability`

Для каждого skill указать:

- installation status;
- discovery status;
- Codex availability;
- известные проблемы.

## Проверка

- [x] `npx skills list` повторно выполнен
- [x] Каждый skill проверен
- [x] Installed и discovered не смешиваются
- [x] Applicable и selected не смешиваются
- [x] Статусы определены
- [x] `AGENTS.md` проверен
- [x] Конфликты с `AGENTS.md` зафиксированы
- [x] Recommendations добавлены при необходимости
- [x] `AGENTS.md` не изменён
- [x] `.agents/skills/**` не изменён

## Commit

`docs: document codex skill discoverability`
