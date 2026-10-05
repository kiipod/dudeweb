# tailwind-css-patterns

## Общая информация

- Путь: `.agents/skills/tailwind-css-patterns/SKILL.md`.
- Source: `giuseppe-trisciuoglio/developer-kit`.
- Заявленная область: Tailwind CSS v4.1+ utility-first patterns.
- Статус: `Available`; CLI обнаруживает skill и указывает Codex.

Skill предоставляет готовые patterns для layout, responsive design, components,
dark mode, animations, accessibility, configuration и performance.

## Когда использовать

- При реализации responsive layout и utility composition.
- Для styling Vue/React/Svelte components и повторяемых UI patterns.
- Для accessibility/focus/reduced-motion checklist.
- Для выбора между design tokens, arbitrary values и component extraction.

Примеры запросов:

- «Сделай этот Vue component адаптивным через Tailwind».
- «Добавь accessible focus states и reduced motion».
- «Собери mobile-first grid без custom CSS».

## Когда не использовать

- Как безусловный источник Tailwind v4 API: часть материалов устарела.
- Для Nuxt UI component-specific styling, где semantic tokens и components из
  `nuxt-ui` более специализированы.
- Для визуального направления продукта — это область `frontend-design`.
- Для migration/config решения без проверки `tailwind-4-docs` или official docs.

## Возможности

- Mobile-first flex/grid/container и spacing/typography patterns.
- Responsive breakpoints, container queries и dark-mode examples.
- Cards, navigation, forms, modals и React component variants.
- Transitions, custom animations и motion preferences.
- Focus, screen-reader, contrast, ARIA и accessibility checklist.
- CSS-first `@theme`, `@utility`, Vite integration и arbitrary values.
- Performance guidance и общий Tailwind v4.1 reference.

## Основные инструкции

- Начинать с mobile base styles и добавлять larger breakpoint variants.
- Использовать design tokens и utility composition; repeated markup выносить в
  framework components.
- Предпочитать utilities перед `@apply`, arbitrary values использовать редко.
- Проверять каждую breakpoint size, visual regressions и accessibility.
- Использовать semantic HTML, focus styles, ARIA where needed и
  `motion-reduce`/`motion-safe`.
- Перед применением configuration/performance advice отделять v4 CSS-first
  guidance от legacy v3 snippets.

## Workflow

1. Определить layout/component/accessibility concern.
2. Проверить фактическую Tailwind version и project CSS entrypoint.
3. Выбрать relevant reference и сверить syntax с v4 docs.
4. Реализовать mobile-first через существующие tokens и utilities.
5. Проверить breakpoints, dark mode, keyboard/focus, contrast и reduced motion.
6. Запустить project build и visual regression review.

## Дополнительные ресурсы

- `layout-patterns.md` — flex/grid/spacing/typography/color basics.
- `component-patterns.md` — card/nav/form/modal и React patterns.
- `responsive-design.md` — mobile-first, dark mode, container queries.
- `animations.md` — transitions, built-ins, custom animation и motion prefs.
- `accessibility.md` — focus, screen readers, contrast, ARIA checklist.
- `performance.md` — build/content/CSS optimization; содержит legacy advice.
- `configuration.md` — CSS-first v4.1 и legacy JS config.
- `reference.md` — расширенный v4.1 обзор directives/utilities/variants.

Resources тематические: нужно читать только относящиеся к задаче, а
version-sensitive fragments перепроверять.

## Применимость к проекту

Применимость средняя–высокая для layout и accessibility: проект использует
Tailwind v4, Vite и Vue. CSS-first section совпадает с `resources/css/app.css`
и `AGENTS.md`.

Raw palette examples (`text-gray-*`, `bg-blue-*`) не подходят внутри Nuxt UI
components, где `nuxt-ui` требует semantic colors. JavaScript config,
`content`, PurgeCSS, JIT и `darkMode` snippets не должны применяться к текущему
CSS-first setup без отдельного подтверждения.

## Пересечения с другими skills

- `tailwind-4-docs` — более специализированный источник version-specific API;
  этот skill — библиотека implementation patterns.
- `nuxt-ui` имеет приоритет специализации для Nuxt UI components, semantic
  colors, form/layout components и theme slots.
- `frontend-design` определяет, что строить визуально; patterns помогают это
  реализовать, но не должны подменять дизайн generic cards.
- `vue-best-practices` определяет component boundaries и reactive behavior.

## Приоритет инструкций

Skill не задаёт формального приоритета. В текущем проекте `AGENTS.md` требует
Tailwind 4 CSS-first config и запрещает глобальные overrides в обход theme.
Эти правила исключают legacy fragments. Для точного API нужен
`tailwind-4-docs`; пока его snapshot отсутствует, спорные места имеют статус
`Needs review`.

## Ограничения и риски

- `SKILL.md` заявляет v4.1+, но одновременно советует `tailwind.config.js`,
  `content` paths и `darkMode`; `performance.md` содержит PurgeCSS и JIT config.
  Это legacy v3 guidance и конфликтует с текущим проектом.
- В troubleshooting есть сомнительная формулировка о порядке responsive
  prefixes; syntax нужно проверять, а не применять буквально.
- Generic component examples используют raw colors и стилизованный вручную
  modal, что уступает Nuxt UI semantic/accessibility implementation.
- В `reference.md` часть HTML examples потеряла markup, поэтому он полезен как
  обзор, но не как готовый copy-paste source.
