# Шаг 2 — Design foundation, tokens и theme contract

## Цель задачи

Перенести подтверждённые Pen tokens в CSS-first Tailwind foundation и
подготовить светлую/тёмную темы без реализации отдельных страниц.

## Зависимости

- Завершён шаг 1.
- Утверждены `U-12`, `U-13`, `U-14`, `U-19`, `U-25` и light semantic palette.
- Pen boards `I · Mini Design System`, `H · Component States`, `J`, `V`, `U`,
  `U2`, `ODHOo` (`K · Logo Concepts · SVG`) и `hc0K9`
  (`L · Logo Lockup Variants`).

## Обязательные skills

- `frontend-design` — token system, typography, layout principles и проверка
  визуальной специфичности против Pen.
- `tailwind-best-practices` — semantic tokens и CSS-first foundation.
- `vue-best-practices` — только если theme bootstrap затрагивает Vue/Vite code;
  тогда обязательны его core references.
- `tailwind-4-docs` — только для точного v4 API при заранее и отдельно
  инициализированном актуальном snapshot.

## Конкретные действия

- [ ] Составить полную token map: Pen variable/raw value -> semantic purpose ->
  Tailwind `@theme` variable.
- [ ] Добавить IBM Plex Sans и IBM Plex Mono утверждённым способом; определить
  fallback stack и font-display policy.
- [ ] Зафиксировать выбранное logo direction и icon/horizontal/stacked lockup;
  разрешить расхождение `Inter` в Razor Loop с утверждённой typography до
  извлечения asset.
- [ ] Описать в `resources/css/app.css` цвета, font families, type scale,
  spacing, radius, container и breakpoint tokens через CSS-first `@theme`.
- [ ] Настроить semantic design tokens и использовать их вместо случайных raw
  palette classes в компонентах.
- [ ] Зафиксировать компактный design contract: 4–6 core colors, роли IBM Plex
  Sans/Mono, type scale, layout/alignment principles и единственный основной
  выразительный приём; сверить его с Pen до реализации screens.
- [ ] Настроить `--ui-radius`, container и light/dark semantic surface/text/
  border variables.
- [ ] Сохранить `@import "tailwindcss"` единственным framework CSS import.
- [ ] Проверить, что Tailwind v4 source detection видит все статические class
  strings; не строить классы конкатенацией.
- [ ] Проверить существующий class-order tooling; при его отсутствии сохранять
  единый Tailwind order вручную и не добавлять formatter plugin без отдельного
  решения.
- [ ] Определить project utilities только для реально повторяющихся primitives,
  например focus ring или visually-hidden motion text.
- [ ] Не создавать page-specific component classes и не использовать `@apply`
  как основную архитектуру.
- [ ] Зафиксировать contrast review для всех text/surface/status пар.
- [ ] Настроить theme bootstrap без flash и hydration mismatch согласно
  подтверждённому SSR contract.

## Критерии готовности

- Все подтверждённые Pen tokens имеют единственное semantic представление.
- Выбранный logo contract однозначен; невыбранные concepts не попадают в UI.
- Light и dark palette воспроизводят Pen и не зависят от случайных raw classes.
- Шрифты загружаются без layout-breaking fallback.
- Vue-компоненты получают корректные semantic colors и radius через Tailwind
  design tokens.
- Сборка проходит; landing/account страницы ещё не реализуются.

## Команды проверки

```bash
rg -n "@theme|--color-|--font-|--radius-|--breakpoint-" resources/css vite.config.js
npm run build
git diff --check
```

Если меняется PHP-конфигурация:

```bash
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential <paths>
```

## Сценарии проверки

- Открыть пустой theme specimen в light, dark и system modes.
- Проверить background/surface/elevated/text/border/accent/success/error/warning.
- Проверить IBM Plex Sans и Mono при медленной загрузке шрифтов.
- Проверить отсутствие theme flash при hard reload и SSR hydration.
- Проверить 200% zoom и системный high-contrast режим.

## Needs review

До инициализации локального `tailwind-4-docs` snapshot любые новые или
version-sensitive Tailwind API сверяются с установленным package source и
помечаются `Needs review`.

