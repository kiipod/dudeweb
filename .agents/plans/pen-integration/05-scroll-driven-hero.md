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

- [x] Создать focused `LandingHero.vue` как presentational component.
- [x] Создать `useScrollDrivenHero.js` для scroll progress, active state и
  lifecycle cleanup.
- [x] Хранить последовательность состояний в одной immutable-конфигурации.
- [x] Держать source state минимальным, вычислять active/derived presentation
  через pure `computed`, а watchers использовать только для side effects.
- [x] Реализовать состояния 1-5 для слов, состояние 6 для conversion CTA и
  состояние 7 для release следующего раздела.
- [x] Обеспечить одинаково корректную прокрутку вперёд и назад.
- [x] Использовать один viewport scroll progress на состояние и pinned layout
  на утверждённых reference layouts.
- [x] Обновлять высокочастотное состояние через passive listener и
  `requestAnimationFrame` либо подтверждённый native observer pattern.
- [x] Не добавлять animation dependency по умолчанию.
- [x] Анимировать визуальное слово через `opacity` и `transform:
  translateY(12px)` в пределах `200-350ms`.
- [x] Не применять easing/blur/scale, которых нет в Pen.
- [x] Не запускать autoplay и timers после прекращения scroll interaction.
- [x] Для screen reader предоставить стабильный полный heading; визуально
  меняющиеся слова не должны создавать шумный live region.
- [x] Для `prefers-reduced-motion: reduce` отключить pinning и transitions,
  сразу показать полный смысловой заголовок и CTA.
- [x] Реализовать safety fallback по `J1`–`J6` на 360/390/768/1440 с точным
  началом `Hey, dude!`, сохранив CTA hierarchy, trial line и responsive
  typography; использовать его для reduced motion и недоступного/отключённого
  pinning, но не выбирать по breakpoint.
- [x] Использовать единый content/action contract для motion и static modes,
  чтобы destinations, описание и CTA labels не расходились.
- [x] Проверить resize/orientation change, history restore и direct anchor jump.
- [x] Освобождать listeners/RAF при unmount или page navigation.

## Результат выполнения — 2026-10-15

### Component и motion contract

- `App.vue` остаётся composition surface и подключает focused
  `LandingHero.vue`; scroll measurement, media-query capability и lifecycle
  cleanup изолированы в `useScrollDrivenHero.js`.
- Семь состояний хранятся в едином immutable `HERO_STATES`: утверждённая
  scroll-последовательность начинается с точного `Hey Dude`, состояние 6
  показывает conversion block, состояние 7 освобождает Hero.
- Progress считается по одному viewport на состояние, ограничивается диапазоном
  `0...6` и обновляется одним passive scroll listener через
  `requestAnimationFrame`. Resize, orientation, `pageshow` и hash navigation
  повторно синхронизируют измерение; все listeners и оба возможных RAF
  освобождаются при unmount.
- Визуальное слово меняется через keyed Vue `Transition` только по `opacity` и
  `translateY(12px)` за `275ms`; animation dependency, autoplay и timers не
  добавлены. Fixed word stage предотвращает layout shift при появлении CTA.
- Screen reader получает один стабильный полный `h1`; меняющееся слово и
  декоративный blob скрыты от accessibility tree и не являются live region.

### Static fallback и visual contract

- `prefers-reduced-motion: reduce`, unsupported sticky и явный
  `enablePinning=false` используют один static mode без pinning/transitions.
  Fallback начинается с точного `Hey, dude!` и сразу показывает описание, оба
  CTA и строку `3 дня бесплатно · До 5 устройств`.
- Motion/static используют единые destinations `/register` и `#pricing`, labels
  и описание. Breakpoint не выбирает режим: он меняет только Pen-геометрию.
- SVG сохраняет точный Pen blob path/viewBox, theme-aware light/dark palette,
  blur и rotation из source metadata. Responsive tokens фиксируют размеры
  blob, display typography `62/84/124`, word/static stages и CTA containers.
- Static reference geometry подтверждена в browser относительно Hero:
  `360` — stage `82/320`, conversion `424/255`; `390` — `103/320` и
  `445/232`; `768` — `133/350` и `513/153`; `1440` — `123/390` и
  `543/153`. Расхождения с Pen находятся в пределах округления `1 px`.
- Motion reference geometry: mobile stage `44/330`, blob top `84`, word top
  `169`; tablet conversion `516/208`; desktop stage `96/420` и conversion
  `646/158`. На reference viewport отсутствует horizontal overflow.

### Verification

- Browser scroll matrix подтвердила порядок `Hey Dude -> любимые -> сервисы ->
  снова -> рядом -> conversion -> release` и обратный порядок; fast scroll не
  выводит state за диапазон.
- Light/dark и reduced-motion проверены до загрузки и при переключении media
  query. Static mode не получает scroll height `700svh`, остаётся `position:
  static` и сохраняет весь conversion content.
- Direct load с `#pricing` после hydration повторно выравнивает target на
  `72 px` ниже viewport top без перекрытия sticky header. Resize/orientation и
  history/pageshow повторно измеряют progress без дополнительного listener или
  timer.
- `./vendor/bin/sail npm run build` проходит для client и SSR. Generated SSR
  artifacts после проверки не включены в source diff; обязательный `rg` и
  `git diff --check` проходят.

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

