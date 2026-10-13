# tailwind-best-practices

## Общая информация

- Путь: `.agents/skills/tailwind-best-practices/SKILL.md`.
- Source: `evilmartians.com`, запись `well-known` в `skills-lock.json`.
- Область: maintainability Tailwind code, design tokens, utility lists,
  class ordering и variants shared-компонентов.
- Статус установки: `Available`; CLI обнаруживает skill и указывает Codex.
- Дополнительные references, scripts, examples и templates отсутствуют.

Skill основан на статье Evil Martians
[«5 best practices for preventing chaos in Tailwind CSS»](https://evilmartians.com/chronicles/5-best-practices-for-preventing-chaos-in-tailwind-css).
Актуальная версия статьи охватывает Tailwind v3 и v4; для v4 она использует
CSS-first tokens через `@theme` и считает production minification встроенной.

## Анализ источника и skill

Локальный `SKILL.md` сохраняет две исходные предпосылки статьи: в проекте
должны существовать design system с повторно используемыми tokens и
component-based approach. После этого он переводит рекомендации статьи в пять
проверок:

1. сокращать эквивалентные utility lists;
2. группировать tokens и давать им семантические имена;
3. поддерживать единый порядок классов и автоматизировать его;
4. не использовать `@apply` как замену компонентной абстракции;
5. ограничивать внешний styling API shared design-system components
   фиксированными variants.

Отдельная пятая рекомендация статьи про размер production bundle перенесена в
anti-pattern check с развилкой по major version: Tailwind v4 не требует
дополнительного minifier, для v3 build pipeline нужно проверять отдельно.

Skill добавляет полезные ограничения, которых статья формулирует менее явно:

- не выполнять opportunistic cleanup несвязанных class lists;
- не удалять якобы неиспользуемые tokens без проверки dynamic class generation;
- не начинать mass rewrite существующего `@apply`-heavy code;
- различать shared design-system components и one-off components;
- не предлагать `tailwind-merge` как default из-за дополнительного runtime и
  bundle cost.

## Когда использовать

- При написании или изменении Tailwind utility classes.
- При review/refactor Tailwind components и CSS-first theme.
- Для аудита magic values, повторяющихся class lists, порядка классов,
  семантики tokens и component variants.
- При проектировании styling contract shared buttons, badges, inputs и других
  design-system primitives.

Примеры запросов:

- «Проверь Tailwind-классы компонента на повторы и magic values».
- «Вынеси палитру экрана в семантические `@theme` tokens».
- «Сделай варианты shared button контролируемыми и единообразными».

## Когда не использовать

- Для общего CSS, не использующего Tailwind.
- Для Vite/npm/build-tooling задач, не меняющих CSS output.
- Как источник точного Tailwind v4 API: это область `tailwind-4-docs` с
  актуальным snapshot или official docs.
- Для выбора визуальной концепции: это область `frontend-design`.
- Для Vue architecture, reactivity и data flow: это область
  `vue-best-practices`.

## Проверка предпосылок в проекте

| Проверка | Фактическое состояние | Вывод |
|---|---|---|
| Design system и semantic tokens | `resources/css/app.css` содержит только `@import "tailwindcss"`; UI использует palette utilities `indigo-*` и `zinc-*`, project-specific `@theme` tokens отсутствуют | Предпосылка выполнена не полностью |
| Component-based approach | Vue поддерживает компоненты, но текущий UI состоит из page/layout; повторяющиеся button class lists не вынесены в shared design-system component | Техническая возможность есть, реализованная design-system layer отсутствует |
| `@apply` | В `resources/` не найден | Текущего долга по этому правилу нет |
| Magic pixel values | Явные arbitrary values вида `[Npx]` в текущих JS/Vue/CSS sources не найдены | Текущего нарушения по этой проверке не найдено |
| Class ordering automation | Prettier config и `prettier-plugin-tailwindcss` не установлены | Порядок не автоматизирован; dependency можно только рекомендовать, не добавлять без отдельного решения |
| Component variants | Shared variant map/component не найден; встречаются повторяющиеся inline button utilities | Кандидат для отдельного component/design-system refactor, не для побочной правки |
| Production minification | Установлен Tailwind 4.3.3 с `@tailwindcss/vite`, production build выполняется через Vite | По статье дополнительный Tailwind minifier не требуется |

Поэтому operational status skill для текущего checkout условный. Его нужно
выбирать для Tailwind implementation/review, но сначала он должен сообщить о
неполной foundation. Последующие cleanup-рекомендации нельзя применять как
массовый refactor, пока отдельная задача не определит semantic tokens и shared
component boundaries.

Текущее отсутствие foundation ожидаемо: frontend ещё не реализован, а его
первичное наполнение запланировано через перенос Pen-макета. Для этой задачи
отсутствие tokens/components не является blocker. Сначала из согласованного
design plan создаются semantic `@theme` tokens и shared component contracts,
после чего применяются остальные проверки skill к реализации screens.

## Workflow

1. Проверить `package.json`, CSS entrypoint и существующие UI components.
2. Подтвердить наличие semantic token system и component-based styling layer.
3. Если foundation отсутствует, зафиксировать это и не маскировать проблему
   локальной перестановкой utilities.
4. Если foundation есть или задача явно создаёт её, проверить class lists,
   token naming/grouping, ordering, `@apply` и variants.
5. Проверить dynamic usage перед выводом, что token не используется.
6. Для exact v4 syntax отдельно проверить official Tailwind source; для Vue
   implementation применить `vue-best-practices`.
7. Не менять несвязанные class lists и не добавлять formatter/runtime
   dependencies без согласованного scope.

## Пересечения с другими skills

- `frontend-design` определяет визуальную систему и смысл tokens; этот skill
  поддерживает её целостность в Tailwind implementation.
- `vue-best-practices` определяет component boundaries и contracts; этот skill
  ограничивает styling API shared components.
- `tailwind-4-docs` проверяет точный v4 API и migration behavior; этот skill
  отвечает за version-agnostic maintainability practices.

Для новой Vue/Tailwind feature обоснована комбинация:

1. `frontend-design` — только если есть новый или существенно изменяемый
   visual/UX scope;
2. `vue-best-practices` — component architecture и data flow;
3. `tailwind-best-practices` — tokens, utility lists, ordering и variants;
4. `tailwind-4-docs` — только для точного version-specific API и только с
   актуальным snapshot.

## Project-specific ограничения

- Примеры статьи и skill с `className` написаны для React. В Vue их нельзя
  копировать буквально: используются `class`, props/computed maps и обычные
  Vue contracts.
- Tokens должны объявляться CSS-first через `@theme` в
  `resources/css/app.css`, а не через показанный в skill JS-like config.
- `tailwind-merge`, `clsx`, Prettier и formatter plugin нельзя добавлять только
  потому, что они упомянуты в source; новые dependencies требуют отдельного
  обоснования и scope.
- Точный Tailwind API не подтверждается этим skill. Текущий
  `tailwind-4-docs` snapshot не инициализирован, поэтому спорный syntax имеет
  статус `Needs review` до проверки official docs/source.

## Ограничения и Needs review

- Variant example логически противоречив: default prop содержит строку классов,
  но дальнейшее использование передаёт `variant="secondary"`, не выполняя
  lookup `BUTTON_VARIANTS[variant]`. Пример нельзя переносить в production без
  исправления contract.
- Правило запрещает arbitrary class props для shared components, но пример всё
  равно принимает и объединяет `className`. Намерение — ограничить styling API;
  допустимость escape hatch должна решаться явно для конкретного component.
- Указание «остановиться», если foundation отсутствует, слишком широко для
  задачи, которая как раз создаёт design system или component layer. В такой
  задаче отсутствие foundation является входным условием, а не причиной
  отказаться от работы.
- Рекомендация class sorting operationally неполна без formatter integration.
  Сейчас plugin отсутствует, а ручной порядок не гарантирует единообразие.
- Утверждения о Tailwind v4 minification и `@apply` behavior относятся к
  version-specific implementation; при изменении toolchain их нужно
  перепроверять, а не переносить из статьи как постоянный project fact.
