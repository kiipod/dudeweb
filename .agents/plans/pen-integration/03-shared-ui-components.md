# Шаг 3 — Переиспользуемые UI-компоненты и state contracts

## Цель задачи

Создать минимальный набор reusable Vue-компонентов по Pen patterns, сохранив
Nuxt UI primitives и явные props/emits contracts.

## Зависимости

- Завершён шаг 2.
- Подтверждён token/theme contract.
- Pen reusable components `AJ40x`, `c6NUQr`, `sDedj`, `l86vnd`, `Lbab2`,
  `eSkQx`, `e9Cb0`, `k6KWf`.

## Конкретные действия

- [ ] Составить component map с одной ответственностью на компонент.
- [ ] Использовать Nuxt UI напрямую, если wrapper не добавляет устойчивый
  дизайн- или behavior-contract.
- [ ] Реализовать account primitives: top header, bottom navigation, sidebar,
  status badge, copyable link, primary action, inline alert, period selector и
  subscription summary.
- [ ] Реализовать общие patterns: brand link, page heading, empty/service state,
  auth shell и payment result shell только при подтверждённом повторном
  использовании.
- [ ] Для каждого компонента описать props, emits, slots, disabled/loading/
  error behavior и accessible name.
- [ ] Использовать `<script setup>` и текущий JavaScript stack.
- [ ] Не мутировать props; изменения передавать событиями вверх.
- [ ] Для selector/tabs применить семантические button/radio/tab roles в
  соответствии с фактическим поведением.
- [ ] Для CopyableLink реализовать clipboard success/error feedback и fallback.
- [ ] Для async actions единообразно блокировать повторную отправку и показывать
  loading state.
- [ ] Проверить generated Nuxt UI theme files перед slot overrides.
- [ ] Добавить component-level visual/state showcase в application code только
  если он не попадает в production navigation; иначе проверять на страницах.

## Критерии готовности

- Формальные Pen components имеют reusable Vue equivalents либо документированное
  решение использовать Nuxt UI напрямую.
- Все public component contracts явны и не зависят от route/page internals.
- Default, hover, focus-visible, active, disabled и loading состояния доступны
  с клавиатуры и визуально согласованы.
- Нет дублирующихся button/card/input реализаций.
- Build и применимые тесты проходят.

## Команды проверки

```bash
rg -n "<script>|defineProps|defineEmits|defineModel|v-model|disabled|loading" resources/js/Components resources/js/Composables
rg -n "text-(red|blue|gray|zinc|slate)-|bg-(red|blue|gray|zinc|slate)-" resources/js/Components
npm run build
git diff --check
```

## Сценарии проверки

- Пройти все controls клавишами `Tab`, `Shift+Tab`, `Enter`, `Space`.
- Проверить pointer hover только на hover-capable устройстве.
- Проверить disabled action: нет события, submit или route transition.
- Проверить double-click по loading action.
- Проверить successful/failed copy, form error и service error.
- Проверить light/dark/system theme для каждого primitive.

