# Шаг 14 — Состояния, overlays и motion hardening

## Цель задачи

Системно проверить и унифицировать все интерактивные состояния, overlays,
micro-interactions и async feedback после реализации страниц.

## Зависимости

- Завершён шаг 13.
- Pen boards `H`, `U`, `U2`, menu-open frames, promo/more drawers и payment
  result screens.
- Все реализованные routes и components.

## Обязательные skills

- `frontend-design` — self-critique, motion restraint и единая visual language.
- `vue-best-practices` — core references и только применимые Teleport/
  Transition/animation references для фактических overlays и motion.
- `tailwind-best-practices` — state variants, class ordering и token discipline.

## Конкретные действия

- [ ] Создать inventory всех buttons, links, fields, selectors, menus, drawers,
  dropdowns, modals и async actions.
- [ ] Для каждого элемента отметить default/hover/focus/active/disabled/loading/
  error/success coverage.
- [ ] Сверить primary button: default `#8E9BFF`, hover `#A8B1FF`, focus
  two-pixel high-contrast outline из Pen.
- [ ] Проверить selected period/platform/theme/navigation states.
- [ ] Проверить disabled actions: pointer, keyboard и programmatic activation.
- [ ] Проверить async actions на duplicate submit и race conditions.
- [ ] Реализовать только нужные overlays: mobile menu, More drawer, promo
  sheet/dialog и подтверждённые modal flows.
- [ ] Сверить breakpoint presentation: `Ещё` — mobile/tablet bottom sheet;
  промокод — mobile/tablet bottom sheet и desktop centered dialog.
- [ ] Для overlay обеспечить title, accessible description, focus trap,
  `Escape`, outside-click policy, scroll lock и focus return.
- [ ] Унифицировать UI motion в пределах `150-250ms` и использовать transform/
  opacity для enter/leave.
- [ ] Не добавлять одинаковый fade-up каждой секции или новый декоративный
  autoplay; Signal Orbit по решению владельца полностью статичен.
- [ ] Отключить несущественную motion при reduced motion.
- [ ] Проверить toast vs inline alert: actionable errors остаются рядом с
  действием/формой.
- [ ] Проверить slow network и navigation interruption для всех async flows.

## Критерии готовности

- State matrix заполнена для каждого интерактивного элемента.
- Нет control без focus-visible или с hover-only functionality.
- Все overlays корректно управляют фокусом и закрытием.
- Loading state предотвращает повторное действие.
- Motion соответствует Pen и reduced-motion требованиям.

## Команды проверки

```bash
rg -n "hover:|focus:|focus-visible:|active:|disabled:|loading|processing|Transition|prefers-reduced-motion" resources/js resources/css
npm run build
git diff --check
```

## Сценарии проверки

- Keyboard-only walkthrough всех routes.
- Pointer hover и touch device без hover.
- Slow 3G/latency: submit, route visit, remote props, payment pending.
- Open overlay -> nested action -> close/back -> focus return.
- Reduced motion для overlay transitions и статичный Signal Orbit во всех
  motion preferences.
- Service error -> retry -> success без stale error.

