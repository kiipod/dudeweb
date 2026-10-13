# vue-best-practices

## Общая информация

- Путь: `.agents/skills/vue-best-practices/SKILL.md`.
- Source: `vuejs-ai/skills`.
- Версия skill: `18.0.0`.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.

Skill объявляет себя обязательным для любых Vue, `.vue`, Vue Router, Pinia и
Vite-with-Vue задач. Default stack — Vue 3, Composition API и
`<script setup lang="ts">`, если проект не требует другой вариант.

## Когда использовать

- При любом написании, review или refactor Vue SFC.
- Для reactivity, component data flow, composables и component boundaries.
- Для Vue Router/Pinia/Vite Vue задач.
- Для optional Vue features: slots, Teleport, Suspense, KeepAlive, transitions,
  directives, async components, render functions, plugins и state management.
- Для performance pass после корректной реализации behavior.

Примеры запросов:

- «Разбей эту Vue страницу на компоненты и composables».
- «Исправь мутацию prop и типизируй emits».
- «Оптимизируй большой список после functional verification».

## Когда не использовать

- Для backend-only Laravel/PHP задач.
- Не подключать optional references без соответствующего requirement.
- Не выполнять performance optimization до корректного behavior.
- Не навязывать TypeScript migration, если проект явно использует JavaScript.
- Не использовать Options API, кроме проекта, который явно его требует; тогда
  skill направляет к отдельному Options API skill, которого здесь нет.

## Возможности

- Выбор reactivity primitives, computed/watch и cleanup side effects.
- SFC structure, template safety, `v-for`/`v-if`, `v-html` и template refs.
- Props down/events up, typed contracts, `defineModel`, provide/inject.
- Разделение UI sections, route views и stateful logic на focused components и
  composables с объективными split triggers.
- Роутинг к optional feature references и performance references.
- Финальный self-check architecture, behavior, data flow и performance.

## Основные инструкции

- До code подтвердить архитектуру; default — Composition API и `<script setup>`.
- Для любой Vue implementation полностью держать в контексте четыре core refs:
  `reactivity.md`, `sfc.md`, `component-data-flow.md`, `composables.md`.
- Для non-trivial feature до реализации создать краткую component map с одной
  responsibility и props/emits contract каждого child.
- Route/root components держать composition surfaces; substantial feature UI и
  state выносить в feature components/composables.
- State делать минимальным, derived values — `computed`, watchers — только для
  side effects с cleanup.
- Props не мутировать; primary flow — props down/events up; `v-model` только для
  реального two-way contract.
- Optional features подключать только по requirement; performance — последним.

## Workflow

1. Подтвердить Vue version, API style, JS/TS и SSR/runtime context.
2. Прочитать четыре core references.
3. Для non-trivial feature составить component map и contracts.
4. Реализовать минимальную reactivity, explicit data flow и focused SFCs.
5. При необходимости загрузить только соответствующие optional references.
6. Проверить behavior; затем отдельно сделать измеримый performance pass.
7. Выполнить финальный self-check из skill.

## Дополнительные ресурсы

Обязательное ядро для Vue implementation:

- `references/reactivity.md`;
- `references/sfc.md`;
- `references/component-data-flow.md`;
- `references/composables.md`.

Опциональные references покрывают slots, fallthrough attrs, KeepAlive,
Teleport, Suspense, Transition/TransitionGroup, class/state-driven animations,
directives, async components, render functions, plugins и state management.
Четыре performance references покрывают virtualization, `v-once`/`v-memo`,
component abstraction в hot lists и дорогой `updated` hook. Всего в
`references/` 22 файла.

## Применимость к проекту

Применимость высокая: фактически установлены Vue 3.5.42, Vue Router 4.6.4,
Inertia Vue 2.3.27 и Vite 8.2.2, а страницы находятся в `.vue` files. Проект
сейчас JavaScript-based; `AGENTS.md` прямо разрешает `<script setup>` без
`lang="ts"` для JS проекта.

`AppLayout.vue` уже использует Composition API, но `Pages/App.vue` использует
Options API. Это существующее состояние не делает Options API default для новых
изменений: `AGENTS.md` требует Composition API. Миграция старого файла должна
быть отдельной задачей, а не побочным refactor.

## Пересечения с другими skills

- `frontend-design` отвечает за UX и визуальную концепцию.
- `tailwind-4-docs` отвечает за точный Tailwind v4 API, но не за Vue data flow.
- UI-library component selection/API/theming проверяются по фактически
  установленному package source и официальной документации.

### Специализация и совместное использование

Для Vue architecture и обычных Vue components это наиболее специализированный
установленный skill. Он нужен отдельно для behavioral/refactor задач без
изменения визуального дизайна или Tailwind API.

- Vue + Tailwind component: этот skill определяет component map, reactivity и
  contracts; `tailwind-4-docs` подключается только для точного
  version-specific styling API при актуальном snapshot.
- Страница на UI-библиотеке: этот skill управляет Vue architecture, а
  component API проверяется непосредственно по установленной библиотеке.
- Полная frontend feature: добавляются `frontend-design` для visual intent и
  `tailwind-4-docs` только по подтверждённому styling/config concern.

Порядок до code согласован между skills: сначала brief/component boundaries и
релевантные references, затем implementation. Формального приоритета между
design и architecture guidance нет, поскольку они отвечают за разные concerns.

## Приоритет инструкций

Skill допускает адаптацию default stack к явному project context. Поэтому в
этом репозитории сохраняется JavaScript, но Composition API и `<script setup>`
остаются обязательными по `AGENTS.md`. UI-library contracts проверяются по
фактической dependency, а пользовательский brief и project architecture
ограничивают split.

## Ограничения и риски

- Core `reactivity.md` требует всегда использовать `shallowRef()` для primitive
  values; это жёсткое и нетипичное правило требует проверки против official Vue
  docs/project conventions перед массовым применением. `Needs review`.
- Skill ссылается на отдельные Options API и JSX skills, но они не установлены.
- Objective split triggers могут привести к лишнему дроблению в маленькой
  существующей feature; сам skill допускает tiny demo exception с обоснованием.
- TypeScript examples нельзя механически переносить в JS codebase.
- Некоторые APIs version-specific (`useTemplateRef` Vue 3.5+, `defineModel`
  Vue 3.4+); текущая Vue 3.5 их поддерживает, но SSR/Inertia context всё равно
  нужно учитывать.
- Предпочтение scoped CSS в `sfc.md` не требует создавать CSS вместо Tailwind:
  `AGENTS.md` для этого проекта сначала требует utilities/theme. Scoped CSS
  остаётся fallback для component-specific behavior, не решаемого utilities.
