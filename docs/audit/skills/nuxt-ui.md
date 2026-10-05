# nuxt-ui

## Общая информация

- Путь: `.agents/skills/nuxt-ui/SKILL.md`.
- Source: `onmax/nuxt-skills`.
- Заявленная версия библиотеки: `@nuxt/ui` v4.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.

Skill описывает выбор, композицию и theming компонентов Nuxt UI для Nuxt,
обычного Vue/Vite, Laravel Inertia и AdonisJS приложений. Он отвечает прежде
всего за библиотечные patterns, а не за общую Vue-архитектуру.

## Когда использовать

- При создании или изменении UI на `@nuxt/ui` v4.
- Для выбора между Modal/Slideover/Drawer, Select/SelectMenu/InputMenu и другими
  близкими компонентами.
- Для forms, tables, navigation, overlays, dashboards, landing/docs/chat/editor
  layouts и semantic theming.
- Когда нужно проверить props, slots, events или theme slots Nuxt UI.

Примеры запросов:

- «Собери settings page на Nuxt UI v4».
- «Какой overlay выбрать для редактирования профиля?».
- «Добавь UTable с фильтрацией, selection и pagination».
- «Настрой brand colors через semantic Nuxt UI theme».

## Когда не использовать

- Если проект или конкретный экран не использует Nuxt UI.
- Для общей Vue reactivity/component architecture — это область
  `vue-best-practices`.
- Как замену продуктового visual design — это область `frontend-design`.
- Для точного component API по памяти: skill требует MCP или generated theme
  files, когда нужны props/slots/events.
- Не добавлять MCP config или dependencies без отдельного разрешения задачи.

## Возможности

- Decision matrices по components, overlays, navigation, inputs и feedback.
- Semantic colors и utilities, variants, `ui`/`class` overrides, global config,
  `UTheme`, CSS `@theme` и Nuxt UI variables.
- Patterns для `UForm`, `UFormField`, Standard Schema и server errors.
- Полные композиции landing, dashboard, docs, chat и editor layouts.
- Recipes для auth, data tables, navigation и overlays.
- Индекс 125+ компонентов, включая Prose, Content, Chat и Editor families.

## Основные инструкции

- Всегда оборачивать приложение в `UApp` для toast, tooltip, overlays и locale.
- Использовать semantic colors/classes (`text-default`, `bg-elevated`,
  `border-muted`), а не raw palette colors.
- Перед code читать только относящиеся к задаче references по routing table.
- Для slot names читать generated theme file: `.nuxt/ui/<component>.ts` в Nuxt
  или `node_modules/.nuxt-ui/ui/<component>.ts` в Vue.
- Порядок override: instance `ui`/`class`, global config, theme defaults.
- Icons имеют вид `i-{collection}-{name}`; default collection — Lucide.
- Все form inputs оборачивать в `UFormField`, а `name` синхронизировать со
  schema; для стандартной auth формы предпочитать `UAuthForm`.
- Не превращать каждый блок в `UCard`; использовать специализированный
  component или обычную структуру, когда container не нужен.

## Workflow

1. Определить тип UI-задачи и соответствующие references по routing table.
2. Выбрать component/layout pattern до написания markup.
3. Для точного API запросить MCP или проверить generated theme/component files.
4. Реализовать через semantic colors, Nuxt UI variants и существующий theme.
5. Проверить `UApp`, accessibility, responsive/mobile pattern и component slots.
6. Сверить решение с Vue architecture и Tailwind version constraints.

## Дополнительные ресурсы

- `references/components.md` — быстрый индекс 125+ components; для полного API
  он отправляет к MCP.
- `references/guidelines/`: `design-system.md`, `component-selection.md`,
  `conventions.md`, `forms.md` — основные decision rules.
- `references/layouts/`: `landing.md`, `dashboard.md`, `docs.md`, `chat.md`,
  `editor.md` — структуры полных экранов и их зависимости.
- `references/recipes/`: `auth.md`, `data-tables.md`, `navigation.md`,
  `overlays.md` — законченные patterns.

Использование resources обязательно выборочно по типу задачи; сам skill
предписывает не загружать всё сразу.

## Применимость к проекту

Применимость высокая. В `package.json` установлен `@nuxt/ui` `^4.1.0`, Vite
подключает `ui({ router: 'inertia' })`, Vue plugin зарегистрирован, а
`AppLayout.vue` использует `UApp` и Nuxt UI components. Проект — поддерживаемый
skill сценарий Laravel + Vite + Inertia.

Проект использует JavaScript SFC, поэтому TypeScript examples нужно адаптировать
без самовольной миграции. Zod/Valibot/Yup/Joi в dependencies не обнаружены;
form recipes с ними неприменимы без отдельного решения о dependency.

## Пересечения с другими skills

- `vue-best-practices`: component boundaries, reactivity, props/emits и
  composables; обязателен для Vue-кода вместе с этим skill.
- `frontend-design`: визуальная концепция и UX; Nuxt UI реализует её готовыми
  accessible components и semantic theme.
- `tailwind-4-docs`: точный Tailwind v4 API для theming/utilities.
- `tailwind-css-patterns`: общие layout patterns, но Nuxt UI components и
  semantic colors более специализированы для этого проекта.

## Приоритет инструкций

Skill не объявляет приоритет над `AGENTS.md`. Его installation snippets
используют `pnpm`, но проект требует npm; менять package manager нельзя. Для
Vue architecture применяются инструкции `AGENTS.md` и `vue-best-practices`, а
для Nuxt UI component semantics — этот skill.

## Ограничения и риски

- MCP server, указанный skill, не является установленным project resource в
  рамках этого аудита; его добавление изменило бы config и требует отдельной
  задачи.
- Exact component API может меняться внутри v4; без MCP/generated files примеры
  нельзя считать полной сигнатурой.
- Nuxt-specific APIs (`definePageMeta`, Nuxt Content, auto-imports) нельзя
  переносить в Laravel Inertia приложение механически.
- Некоторые layouts требуют отсутствующие dependencies: Nuxt Content, Comark,
  Vercel AI SDK, Tiptap или validation library.
