# Шаг 6 — Проверка Codex Discoverability и AGENTS.md

На этом шаге исходные skills и `AGENTS.md` не изменяются.

## Codex Discoverability

Выполнить:

    npx skills list

Для каждого project skill проверить:

- [ ] каталог существует;
- [ ] `SKILL.md` существует;
- [ ] metadata корректны;
- [ ] skill обнаруживается tooling;
- [ ] Codex указан среди Agents, если CLI предоставляет эту информацию.

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

- [ ] Найти применимый `AGENTS.md`
- [ ] Прочитать инструкции, относящиеся к skills
- [ ] Проверить правила выбора skills
- [ ] Проверить требования явного использования skills
- [ ] Проверить потенциальные конфликты с отдельными `SKILL.md`
- [ ] Проверить дублирование инструкций
- [ ] Проверить, достаточно ли текущих инструкций для корректного выбора skill

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

- [ ] `npx skills list` повторно выполнен
- [ ] Каждый skill проверен
- [ ] Installed и discovered не смешиваются
- [ ] Applicable и selected не смешиваются
- [ ] Статусы определены
- [ ] `AGENTS.md` проверен
- [ ] Конфликты с `AGENTS.md` зафиксированы
- [ ] Recommendations добавлены при необходимости
- [ ] `AGENTS.md` не изменён
- [ ] `.agents/skills/**` не изменён

## Commit

`docs: document codex skill discoverability`
