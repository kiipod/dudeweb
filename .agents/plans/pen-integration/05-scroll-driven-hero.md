# Шаг 5 — Scroll-driven Hero

## Цель задачи

Реализовать mobile-first pinned Hero с детерминированной сменой слов
`Hey Dude -> любимые -> сервисы -> снова -> рядом`, CTA/release states и
полноценным reduced-motion fallback.

## Зависимости

- Завершён шаг 4.
- Утверждены `U-16`, `U-26` и точная пунктуация первого состояния.
- Pen frame `G · Hero Motion Storyboard` и Hero sections в `A`–`F`.
- Pen static references `J1`–`J6`: `blWdJ`, `HbqLE`, `Y7YcIU`, `AUHPH`,
  `IPo8p`, `C2C5YY`.

## Обязательные skills

- `frontend-design` — Hero как главный выразительный приём и motion restraint.
- `vue-best-practices` — core references плюс
  `animation-state-driven-technique.md`; `component-transition.md` или
  `animation-class-based-technique.md` читаются только при выбранной технике.
- `tailwind-best-practices` — tokenized responsive layout и упорядоченные
  статические utility classes.

## Конкретные действия

- [ ] Создать focused `LandingHero.vue` как presentational component.
- [ ] Создать `useScrollDrivenHero.js` для scroll progress, active state и
  lifecycle cleanup.
- [ ] Хранить последовательность состояний в одной immutable-конфигурации.
- [ ] Держать source state минимальным, вычислять active/derived presentation
  через pure `computed`, а watchers использовать только для side effects.
- [ ] Реализовать состояния 1-5 для слов, состояние 6 для conversion CTA и
  состояние 7 для release следующего раздела.
- [ ] Обеспечить одинаково корректную прокрутку вперёд и назад.
- [ ] Использовать один viewport scroll progress на состояние и pinned layout
  на утверждённых reference layouts.
- [ ] Обновлять высокочастотное состояние через passive listener и
  `requestAnimationFrame` либо подтверждённый native observer pattern.
- [ ] Не добавлять animation dependency по умолчанию.
- [ ] Анимировать визуальное слово через `opacity` и `transform:
  translateY(12px)` в пределах `200-350ms`.
- [ ] Не применять easing/blur/scale, которых нет в Pen.
- [ ] Не запускать autoplay и timers после прекращения scroll interaction.
- [ ] Для screen reader предоставить стабильный полный heading; визуально
  меняющиеся слова не должны создавать шумный live region.
- [ ] Для `prefers-reduced-motion: reduce` отключить pinning и transitions,
  сразу показать полный смысловой заголовок и CTA.
- [ ] Реализовать safety fallback по `J1`–`J6` на 360/390/768/1440 с точным
  началом `Hey, dude!`, сохранив CTA hierarchy, trial line и responsive
  typography; использовать его для reduced motion и недоступного/отключённого
  pinning, но не выбирать по breakpoint.
- [ ] Использовать единый content/action contract для motion и static modes,
  чтобы destinations, описание и CTA labels не расходились.
- [ ] Проверить resize/orientation change, history restore и direct anchor jump.
- [ ] Освобождать listeners/RAF при unmount или page navigation.

## Критерии готовности

- Пять слов появляются строго в заданном порядке и обратном порядке при scroll
  up.
- CTA появляется в шестом состоянии; следующий раздел доступен в седьмом.
- Нет скачка layout, scroll trap или потери управления на touch devices.
- Reduced-motion режим не использует pinning и сохраняет весь контент.
- Static mode соответствует соответствующему `J1`–`J6` reference и остаётся
  запасным, не меняя default scroll-driven sequence.
- Hero соответствует Pen на четырёх reference viewport.

## Команды проверки

```bash
rg -n "addEventListener|removeEventListener|requestAnimationFrame|cancelAnimationFrame|prefers-reduced-motion" resources/js resources/css
npm run build
git diff --check
```

## Сценарии проверки

- Медленно прокрутить вниз через все 7 состояний.
- Быстро прокрутить вниз и убедиться, что state не выходит за диапазон.
- Прокрутить обратно до state 1.
- Перезагрузить страницу в середине Hero.
- Изменить ориентацию/ширину во время pinned state.
- Включить reduced motion до загрузки и во время открытой страницы.
- Сравнить static mode с J1/J2/J3/J4/J5/J6 в соответствующих theme/viewport.
- Проверить touch scrolling на 360/390 и wheel/trackpad на 768/1440.

