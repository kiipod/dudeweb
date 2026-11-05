# Шаг 9 — Animations and Interactions

## Цель

Проверить и реализовать все предусмотренные Pen
интерактивные состояния Landing V2.

Не добавлять анимации ради декоративности,
если они отсутствуют в макете.

## Inventory

Получить из design-inventory.md список:

- [ ] Hover effects.
- [ ] Scroll effects.
- [ ] Reveal animations.
- [ ] Transitions.
- [ ] Interactive cards.
- [ ] Dropdown.
- [ ] Mobile menu.
- [ ] CTA interactions.
- [ ] Sliders, если есть.

## Implementation

- [ ] Переиспользовать существующие решения.
- [ ] Предпочитать CSS для простых transitions.
- [ ] Не добавлять тяжёлые библиотеки без необходимости.
- [ ] Корректно очищать event listeners.
- [ ] Корректно очищать observers.
- [ ] Не создавать постоянные лишние вычисления при scroll.
- [ ] Избегать forced synchronous layouts.

## Scroll

- [ ] Проверить scroll-based interactions.
- [ ] Проверить sticky elements.
- [ ] Проверить anchor navigation.
- [ ] Проверить scroll restoration.
- [ ] Проверить отсутствие scroll locking bugs.

## Accessibility

- [ ] Проверить prefers-reduced-motion.
- [ ] Проверить keyboard navigation.
- [ ] Проверить focus states.
- [ ] Проверить touch behavior.
- [ ] Проверить отсутствие обязательного hover для доступа к функциям.

## Проверка

- [ ] Все предусмотренные интерактивные состояния работают.
- [ ] Анимации соответствуют Pen.
- [ ] Нет console errors.
- [ ] Нет утечек listeners/observers в проверенных сценариях.
- [ ] Нет заметных scroll regressions.
- [ ] Reduced motion поддерживается.
- [ ] Build проходит.

## Commit

feat: implement landing v2 interactions
