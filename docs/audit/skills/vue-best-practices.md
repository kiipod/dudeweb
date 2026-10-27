# vue-best-practices

## Общая информация

- Путь: `.agents/skills/vue-best-practices/SKILL.md`.
- Source: `vuejs-ai/skills`.
- Версия skill: `18.0.0`.
- Статус: `Available`; CLI обнаруживает skill. Доступность в Codex и
  контейнерный `Agents: not linked` разграничены в [карте выбора](README.md#codex-availability).

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

Применимость высокая: проверка в Sail 2026-10-27 подтвердила Vue 3.5.44,
Inertia Vue 3.9.1 и Vite 8.3.4, а страницы находятся в `.vue` files.
Vue Router больше не указан
как top-level dependency. Проект сейчас JavaScript-based; `AGENTS.md` прямо
разрешает `<script setup>` без `lang="ts"` для JS проекта.

Текущие страницы и layouts находятся в `resources/js/pages/` и
`resources/js/layouts/`; прежние `Pages/App.vue` и `AppLayout.vue` больше не
описывают текущий frontend. Используются Composition API и JavaScript
`<script setup>`, без перехода на TypeScript.

## VueUse

### Фактическое состояние — 2026-10-27

| Пакет | В `package.json` | Lock и installed в Sail | Назначение |
| --- | --- | --- | --- |
| `@vueuse/core` | `^15.0.0` | `15.0.0` | Composables для browser APIs, DOM, sensors, timers и реактивных утилит |
| `@vueuse/components` | `^15.0.0` | `15.0.0` | Поведенческие Vue components и directives поверх composables |

Оба пакета требуют peer Vue `^3.5.0`; установленная Vue `3.5.44` подходит.
Именованные exports из таблиц ниже проверены в Sail. Импорт обоих пакетов
в Node без browser globals прошёл; это не отдельная SSR/hydration приёмка
каждого composable или component.

Поиск `@vueuse/` в `resources/js` не нашёл импортов. Поэтому ниже описаны
рекомендуемые применения и кандидаты при будущих изменениях, а не уже
выполненная интеграция. Наличие зависимости не требует массовой миграции.
VueUse — runtime-библиотека, не Codex skill и не готовый UI kit; её не следует
добавлять в inventory установленных skills.

### Когда выбирать `@vueuse/core`

Для новой или изменяемой типовой browser/reactive логики сначала проверять
подходящий composable. Использовать его, если он сокращает ручной lifecycle
код и сохраняет contract задачи. Для общей логики предпочтителен именованный
импорт в существующий project composable, а не повторение подписок в pages.

| Сценарий | Подходящие API | Условие применения в проекте |
| --- | --- | --- |
| Подписки на DOM/window/document events | `useEventListener`, `onKeyStroke` | Сохранить target, capture/passive, область действия клавиш и освобождение listeners |
| JS-поведение по media query | `useMediaQuery`, `useBreakpoints` | Только если нужна JS-реакция; обычный responsive layout остаётся в CSS. Использовать project breakpoints, не готовый `breakpointsTailwind` |
| Размеры и видимость элемента | `useResizeObserver`, `useElementSize`, `useIntersectionObserver` | Нужны реактивные измерения/visibility; учитывать initial values и момент первого измерения |
| Состояние вкладки и motion preference | `useDocumentVisibility`, `useWindowFocus`, `usePreferredReducedMotion` | Связать с существующим lifecycle, не запускать второй источник состояния или RAF |
| Закрытие простого popup при внешнем действии | `onClickOutside`, `onKeyStroke` | Учесть trigger, Teleport, вложенные панели и busy guard; modal focus trap не появляется автоматически |
| Копирование по действию пользователя | `useClipboard` | Обработать поддержку API и результат операции, сохранить manual-copy fallback и feedback |
| Несекретные UI preferences в storage | `useStorage`, `useLocalStorage` | Согласовать key, default, serializer, ошибки доступа и SSR initial state; storage не источник серверной business truth |
| Debounce и управляемые timers | `useDebounceFn`, `watchDebounced`, `useTimeoutFn`, `useIntervalFn` | Для локального ввода/таймеров; не менять server validation, Inertia transport, deadlines и duplicate-submit guards |
| Управляемый animation frame | `useRafFn` | Только при сохранении единственного loop, pause/resume, reduced motion и cleanup; сам hook не реализует Hero motion contract |

### Когда выбирать `@vueuse/components`

Пакет удобен, когда поведение принадлежит одному фрагменту template и
component/directive делает связь с DOM понятнее, чем отдельный ref/composable.
Для переиспользуемой оркестрации и нескольких связанных элементов сначала
рассматривать `@vueuse/core` внутри project composable.

| Сценарий | Component/directive | Граница ответственности |
| --- | --- | --- |
| Внешний click для локального popup | `OnClickOutside`, `vOnClickOutside` | Только outside detection; close guard, keyboard/focus и ARIA остаются в проекте |
| Размер локального блока нужен slot-содержимому | `UseElementSize`, `vElementSize` | Измерение DOM; layout и presentation определяет существующий component |
| Локальное представление зависит от видимости | `UseElementVisibility`, `UseDocumentVisibility` | Сигнал видимости, без самостоятельного выбора business state или autoplay |
| Простой локальный copy control | `UseClipboard` | Подходит при достаточном slot contract; общий `CopyableLink` и его feedback не дублировать |

Официальный guide называет такие компоненты renderless, но это не означает
отсутствие DOM-обёртки. В установленной `15.0.0` `OnClickOutside` и
`UseElementSize` возвращают `h(props.as || 'div', ...)`: по умолчанию
добавляется `div`. До применения проверить semantics, layout и допустимый
`as`; для существующего элемента directive или composable может быть точнее.
VueUse не заменяет локальные `BaseButton`, `BaseField`, `BaseSelect` и tokens.

### Кандидаты и принятые contracts текущего проекта

Это рекомендации для следующего изменения соответствующего concern;
перечисленные исходники в рамках аудита не менялись.

- `PublicHeader.vue` и `AccountLayout.vue`: `useMediaQuery` вместо ручной
  подписки на desktop query; `useResizeObserver` для chrome measurements.
  Сохранить границы 768/1200 px из текущей responsive системы и синхронный
  `measureChrome()` перед открытием More: асинхронный observer его не заменяет.
- `useSelect.js` и `useOverlay.js`: `useEventListener` может убрать парные
  add/remove. Outside detection выбирается отдельно: текущий select слушает
  `pointerdown` в capture, а default `onClickOutside` завершает действие по
  click; нужно проверить порядок событий. Сохранить Teleport, typeahead,
  focus trap/restore, inert, scroll lock, nested controls и busy semantics.
- `useCopyableLink.js`: `useClipboard` — кандидат для технического копирования,
  но project wrapper сохраняет revision guard при смене URL, busy/error/manual
  states, native selection и feedback 2500 ms. Нельзя объявлять success только
  потому, что `copy()` завершил Promise: проверить поддержку и подтверждённый
  результат. В VueUse `legacy` по умолчанию `false`, `copiedDuring` — 1500 ms;
  существующий contract отличается и требует явных options/adapter logic.
- `useTheme.js` и head bootstrap в `resources/views/app.blade.php`: не заменять
  вслепую на `useDark`/`useColorMode`. Сохранить key `dudeweb-theme`, только
  light/dark, раннее применение palette, `data-theme`/dark class/colorScheme
  и одинаковый начальный SSR/client markup. Второй независимый theme store
  не добавлять.
- `useServiceCloud.js`, `useSignalOrbitPointer.js`, `useSwipeDismiss.js`:
  VueUse может обслуживать отдельные sensors/listeners, но не заменяет
  projection/inertia, pointer capture, единственный RAF, background/offscreen
  pause, swipe threshold, nested-scroll и editable/busy exclusions.
- `usePaymentStatus.js`: timer helper не должен менять server-confirmed
  payment status, Inertia partial reload, последовательность запросов,
  двухсекундный интервал, deadline 60 секунд и отмену при unmount/terminal state.

### SSR и проверка применения

- Вызывать composables в активном setup/effect scope, если требуется их
  автоматический cleanup. Для отдельно созданных scopes/listeners явно
  предусмотреть disposal. Не передавать `window`/`document` через
  незащищённое обращение во время SSR.
- Не строить несовместимое initial markup по browser-only storage, viewport
  или размерам DOM. Для width queries при необходимости проверить `ssrWidth`
  или `provideSSRWidth`; для storage — `initOnMounted`, defaults и `onError`.
  Эти options не заменяют согласованную стратегию SSR и существующий theme
  bootstrap; сама возможность SSR import не доказывает hydration safety.
- Сохранять Inertia props и `useForm`/project form wrappers. Наличие `useFetch`
  не является причиной добавлять отдельные UI API-запросы.
- При implementation проверить затронутые success/error/unsupported states,
  unmount/повторный mount, keyboard/touch и SSR/hydration по фактическому scope.
  Запускать необходимые runtime checks через Sail. Изменение только этого
  audit не требует нового полного browser/Laravel suite.

### Правило `AGENTS.md`

По согласованию владельца 2026-10-27 правило добавлено после раздела 5 как
подраздел `5.1. VueUse` в [AGENTS.md](../../../AGENTS.md#51-vueuse).
Ниже сохранён согласованный текст; это действующее project правило.

```markdown
### 5.1. VueUse

- Перед написанием новой или изменением существующей типовой browser/reactive
  логики проверь `@vueuse/core`. Предпочитай подходящий composable ручным
  listeners, media queries, observers, clipboard, storage и timers, если его
  поведение соответствует contract задачи и сокращает lifecycle-код.
- `@vueuse/components` используй для локального template behavior через
  component/directive, когда это упрощает разметку. Для общей логики предпочитай
  `@vueuse/core` внутри project composable. Проверяй DOM-обёртки и `as`:
  renderless component может добавлять элемент. Сохраняй shared UI и tokens.
- Используй явные именованные imports. API, options/defaults и поддержку SSR
  проверяй по установленной версии и официальной документации. Используй
  breakpoints проекта; responsive layout без JS-поведения оставляй CSS.
- Сохраняй JavaScript + `<script setup>`, Inertia props/useForm, cleanup и
  одинаковый initial SSR/client markup. Browser storage и media queries не
  должны создавать hydration mismatch или второй независимый theme store.
- Существующие project composables не заменяй массово. При затрагивании
  concern переноси подходящие primitives с сохранением focus/ARIA, Teleport,
  busy/error/manual-copy, motion/gesture и cancellation contracts. Если VueUse
  не покрывает contract или усложняет решение, сохрани собственную реализацию
  и кратко объясни причину.
- Применение проверяй targeted tests через Sail по затронутому поведению,
  включая SSR/hydration и keyboard/touch, когда они входят в scope.
```

### Источники и выполненная проверка

- `package.json`, `package-lock.json`, installed `node_modules/@vueuse/{core,components}/package.json`
  и `dist/index.js` прочитаны; версии и перечисленные exports проверены в Sail.
- [VueUse Get Started](https://vueuse.org/guide/),
  [Guidelines](https://vueuse.org/guidelines.html),
  [Components](https://vueuse.org/guide/components.html).
- [useEventListener](https://vueuse.org/core/useEventListener/),
  [useElementSize](https://vueuse.org/core/useElementSize/),
  [onClickOutside](https://vueuse.org/core/onClickOutside/),
  [useMediaQuery и SSR width](https://vueuse.org/core/useMediaQuery/).
- [useClipboard: support, legacy и copiedDuring](https://vueuse.org/core/useClipboard/),
  [useStorage: defaults, errors и initOnMounted](https://vueuse.org/core/useStorage/),
  [useRafFn](https://vueuse.org/core/useRafFn/).
- Поиск импортов и сопоставление с текущими project composables выполнены.
  Исходники приложения, зависимости и skills не менялись; интеграция VueUse
  и повторная runtime acceptance приложения в эту задачу не входили.

## Пересечения с другими skills

- `frontend-design` отвечает за UX и визуальную концепцию.
- `tailwind-best-practices` отвечает за maintainability Tailwind classes,
  tokens и styling API shared components.
- `tailwind-4-docs` отвечает за точный Tailwind v4 API, но не за Vue data flow.
- UI-library component selection/API/theming проверяются по фактически
  установленному package source и официальной документации.

### Специализация и совместное использование

Для Vue architecture и обычных Vue components это наиболее специализированный
установленный skill. Он нужен отдельно для behavioral/refactor задач без
изменения визуального дизайна или Tailwind API.

- Vue + Tailwind component: этот skill определяет component map, reactivity и
  contracts; `tailwind-best-practices` проверяет styling maintainability;
  `tailwind-4-docs` подключается только для точного version-specific styling API
  при актуальном snapshot.
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
