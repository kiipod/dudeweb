# tailwind-4-docs

## Общая информация

- Путь: `.agents/skills/tailwind-4-docs/SKILL.md`.
- Source: `lombiq/tailwind-agent-skills`.
- Область: Tailwind CSS v4 docs, configuration, migration, implementation,
  refactor и review.
- Статус установки: `Available`; CLI обнаруживает skill. Доступность в Codex и
  контейнерный `Agents: not linked` разграничены в [карте выбора](README.md#codex-availability).
- Статус documentation snapshot: не инициализирован.

Skill рассчитан на локальный snapshot официальной документации Tailwind v4 и
требует останавливать Tailwind-задачу, если snapshot отсутствует или старше
недели. При блокировке разрешён только ограниченный fallback.

## Когда использовать

- Для точного выбора utility/variant/directive Tailwind v4.
- Для CSS-first config, `@theme`, `@utility`, `@source` и compatibility.
- Для migration с v3 на v4.
- При реализации, refactor или review Tailwind code с version-specific API.

Примеры запросов:

- «Проверь правильность `@theme` tokens в Tailwind 4».
- «Мигрируй этот config с Tailwind 3 на 4».
- «Почему Tailwind 4 не обнаруживает динамический class?».

## Когда не использовать

- Для Tailwind v3 или другой major version.
- Для общего visual design без вопроса о Tailwind API.
- Как полноценный docs source, пока snapshot не инициализирован/просрочен.
- Нельзя запускать sync без принятия upstream license и разрешения на network
  и изменение skill resources.

## Возможности

При инициализированном snapshot skill умеет находить официальный MDX doc через
`docs-index.tsx`, читать только relevant topic и дополнять implementation review
engineering playbook. Он отдельно обрабатывает MDX metadata и JSX callouts.

В текущем состоянии доступны:

- quick scan распространённых v4 gotchas;
- engineering guidance по abstraction ladder, tokens, utilities, component
  classes, responsive strategy и review;
- sync script для создания/обновления snapshot после принятия license.

## Основные инструкции

- Проверить `references/docs/` и `references/docs-index.tsx` и возраст snapshot.
- Если snapshot отсутствует или старше недели, остановиться и запросить
  initialization; не отвечать как по полной официальной документации.
- Для implementation/refactor/review дополнительно читать
  `references/engineering-playbook.md`.
- При блокировке использовать `gotchas.md` и playbook только как ограниченный
  fallback, явно направляя пользователя к official docs.
- При v3→v4 migration проверить browsers, tooling packages, import syntax,
  renames/removals, prefix/important syntax, variants и arbitrary values.

## Workflow

1. Проверить наличие и дату snapshot.
2. Если разрешено, инициализировать/обновить snapshot с принятием license.
3. Определить topic и найти doc через index.
4. Прочитать только relevant official MDX; для code tasks добавить playbook.
5. Применить guidance и явно назвать breaking changes/constraints.
6. Если initialization невозможна, ограничиться fallback и отметить неполноту.

## Дополнительные ресурсы

- `references/docs-source.txt` — сейчас содержит `Status: Not initialized` и
  upstream path, без commit/snapshot date.
- `references/gotchas.md` — 22 строки ключевых v4 migration/config pitfalls.
- `references/engineering-playbook.md` — project-first workflow, abstraction
  ladder, refactor heuristics и review checklist.
- `scripts/sync_tailwind_docs.py` — clone/update upstream, копирование docs и
  index, запись commit/date; требует `--accept-docs-license`.
- `references/docs/` и `references/docs-index.tsx` отсутствуют.

## Применимость к проекту

Предметная применимость высокая: фактически установлены Tailwind CSS 4.3.3 и
`@tailwindcss/vite` 4.3.3; CSS entrypoint использует
`@import "tailwindcss"`. CSS-first подход совпадает с `AGENTS.md`.

Операционная доступность сейчас ограничена: snapshot не инициализирован. В
рамках этого плана запуск script запрещён, потому что он изменяет
`.agents/skills/**`. Поэтому skill можно документировать, но нельзя считать
готовым источником полного Tailwind API до отдельной initialization task.

## Пересечения с другими skills

- `frontend-design` определяет визуальную систему, а этот skill проверяет
  корректность её реализации средствами Tailwind.
- `vue-best-practices` определяет Vue component architecture, не CSS API.
- `tailwind-best-practices` отвечает за tokens, короткие и упорядоченные class
  lists, `@apply` policy и component variants, но не подтверждает точный v4 API.

### Специализация и совместное использование

Для Tailwind 4 API, migration и compatibility это наиболее специализированный
skill, но только после initialization snapshot. В текущем состоянии такой
приоритет специализации теоретический: спорный API нельзя объявлять
подтверждённым по отсутствующему snapshot.

- Vue + Tailwind component: `vue-best-practices` для component/data flow,
  `tailwind-best-practices` для maintainability и этот skill для точного
  utility/config API.
- Страница на UI-библиотеке: component/semantic theme API проверяется по
  библиотеке; этот skill нужен только при custom `@theme`, utilities, variants
  или migration.
- Полная frontend feature: design, Vue architecture и Tailwind maintainability
  skills определяют решение, а этот skill проверяет только version-specific
  Tailwind API.

## Приоритет инструкций

Skill не определяет формальный приоритет над `AGENTS.md`. Для текущего проекта
запрет на изменение skills блокирует initialization. При расхождениях с
generic Tailwind examples version-specific official snapshot должен быть
источником истины, но сейчас он отсутствует: `Needs review`.

## Ограничения и риски

- Без snapshot нельзя выполнять обещанный official-doc lookup.
- Initialization требует internet, git, Python 3, принятия source-available
  license и записи внутрь skill.
- Команда в `SKILL.md` использует путь `skills/tailwind-4-docs/...`, тогда как
  фактический project path — `.agents/skills/tailwind-4-docs/...`; точную команду
  нужно адаптировать к cwd. `Needs review`.
- `gotchas` и playbook полезны, но не заменяют полный API/reference.
- Установленный Tailwind 4.3.3 новее минимальной заявленной области, но без
  snapshot неизвестно, насколько bundled fallback отражает именно 4.3.3.
