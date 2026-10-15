# Шаг 4 — Публичный shell, header, footer и навигация

## Цель задачи

Перенести public shell лендинга, включая desktop navigation, mobile menu,
theme switcher, footer и корректные destinations.

## Зависимости

- Завершён шаг 3.
- Утверждены routes/anchors и `U-14`, `U-15`, `U-19`, `U-25`.
- Pen frames `A`, `A2`, `B`, `B2`, `C`, `D`, `D2`, `E`, `F` и board `H`.
- Pen logo boards `ODHOo` и `hc0K9` для утверждённого public lockup.

## Обязательные skills

- `frontend-design` — public shell hierarchy, typography и navigation UX.
- `vue-best-practices` — component boundaries, props/emits и focus-state logic;
  `component-teleport.md` читается только если меню должно выйти из текущего
  stacking context.
- `tailwind-best-practices` — semantic tokens, ordered classes и fixed variants.

## Конкретные действия

- [x] Разделить текущий `AppLayout.vue` на public shell и будущий account shell.
- [x] Реализовать sticky/translucent header с Pen heights, borders и controls.
- [x] Использовать утверждённый horizontal/icon lockup в header/footer с единым
  accessible brand name; не смешивать два logo concepts между breakpoints.
- [x] Подключить desktop links к секциям `Преимущества`, `Устройства`, `Тариф`.
- [x] Подключить login и primary CTA только к утверждённым routes.
- [x] Реализовать mobile menu open/close по dark/light макетам.
- [x] Обеспечить close по кнопке, `Escape`, navigation selection и outside click
  через явный contract локального Vue-компонента.
- [x] Управлять фокусом: trigger -> menu -> возврат на trigger.
- [x] Заблокировать background interaction/scroll только для modal-like mobile
  presentation; не применять это к обычному dropdown без решения `U-20`.
- [x] Реализовать footer groups, реальный support destination и актуальный год;
  terms/privacy links не выводить до появления утверждённого content/routes.
- [x] Добавить skip link к основному контенту.
- [x] Проверить semantic landmarks: `header`, `nav`, `main`, `footer`.
- [x] Удалить demo links только после появления реальных equivalents.

## Критерии готовности

- Public shell соответствует Pen на 360/390/768/1440 и корректно расширяет
  implementation layout на 2560 без неподтверждённого Pen extrapolation.
- Desktop и mobile navigation полностью управляются клавиатурой.
- Ни одна ссылка не ведёт на `#`, если это не утверждённый section anchor.
- Theme control сохраняет выбранное поведение без hydration flash.
- Mobile menu корректно закрывается и возвращает фокус.

## Команды проверки

```bash
rg -n "to=\"#\"|to: '#|href=\"#\"" resources/js
npm run build
./vendor/bin/sail artisan test --filter=Landing
git diff --check
```

## Сценарии проверки

- 360 и 390 px: открыть/закрыть menu, прокрутить к каждой секции.
- 768 px: проверить tablet header и menu-open variant.
- 1440 px: проверить desktop links, login и CTA hierarchy.
- 2560 px: проверить fluid shell, footer distribution и wide content grids.
- Light/dark: переключить тему одним нажатием при открытом меню.
- Keyboard-only: skip link, menu trigger, links, close, focus return.
- Reload на section anchor: header не перекрывает heading.

## Результат выполнения — 2026-10-15

### Component и destination contract

- Generic `AppLayout.vue` удалён после переноса chrome в `PublicLayout.vue`;
  будущий `AccountLayout` остаётся отдельной границей шага 8.
- `PublicLayout` владеет единственным `main`, skip link и `inert` для content /
  footer; `PublicHeader`, `PublicMobileMenu` и `PublicFooter` остаются focused
  компонентами с props вниз и событиями вверх.
- Header/footer используют только выбранный `06 · Razor Loop`: icon lockup на
  mobile и horizontal lockup начиная с tablet. SVG geometry и исходный
  `viewBox` не изменялись.
- Public destinations зафиксированы как `#advantages`, `#devices`, `#pricing`,
  `/login`, `/register`; footer support ведёт на действующий
  `https://t.me/hey_dude_web`. Terms/privacy links отсутствуют по `U-15`.
- Demo page пока сохраняется до шагов 5–6, но её устаревшие `#features`/`#cta`
  links заменены утверждёнными anchors, поэтому shell уже проверяется end-to-end.

### Responsive menu и theme behavior

- Header соответствует Pen contract: `64 px` content height на mobile/tablet и
  `72 px` на desktop, translucent semantic background и border; фактический
  border box в browser равен `65/73 px`.
- Brand visibility исправлена через responsive wrappers: на `360/390 px` виден
  ровно один icon lockup, на `768/1440 px` — ровно один horizontal lockup.
  Desktop navigation центрирована в свободном промежутке между logo и action
  panel; при `1440 px` оба визуальных зазора равны `264.875 px`.
- Wide-screen contract разделяет размеры по назначению: shell расширяется до
  `160rem`, page grids — до `120rem`, а reading/form containers сохраняют
  ограниченную длину строки. `1600 px` является implementation-only breakpoint
  для более плотного использования пространства, а не новым Pen reference.
- `PublicMobileMenu` использует Teleport: `366 x 312` при `390 px` (`12 px`
  inset) и `360 x 312` справа при `768 px`. На `360/390/768/1440` нет
  горизонтального overflow.
- Menu закрывается trigger-кнопкой, `Escape`, anchor/route selection и outside
  click. При открытии focus переходит на первый link, при закрытии возвращается
  на trigger; background content/footer получают `inert`, а body scroll
  блокируется только на время modal-like presentation.
- Theme control одним нажатием переключает `light <-> dark` и сохраняет выбор в
  `localStorage`; переключение при открытом меню не закрывает его. При пустом
  или legacy storage OS preference выбирает и сохраняет только начальный режим.
  Foundation pre-hydration bootstrap остаётся источником flash prevention.

### Accessibility и verification

- Root Blade переведён из browser `QuirksMode` в standards mode через
  `<!DOCTYPE html>` и получил `lang="ru"`.
- Skip link является первым content-focus target: в browser focus-state
  перемещает его с `top: -64 px` на `top: 8 px` и показывает `2 px` outline.
- Landmarks проверены как один `header`, один `main`, один `footer` и отдельные
  labelled `nav`; menu имеет labelled modal dialog semantics.
- Section navigation на `360 px` закрывает menu, возвращает focus и помещает
  target на `72 px` ниже viewport top, поэтому sticky header не перекрывает
  heading. Light/dark, outside click и `Escape` проверены в реальном
  browser.
- Повторная browser-проверка после correction pass подтвердила отсутствие
  horizontal overflow на `360/390/768/1440`, one-click `dark -> light`, смену
  доступного label и migration legacy `system` storage в явный `light` mode.
- Wide-screen browser pass на `2560 x 1440` подтвердил shell/header/footer
  шириной `2545 px` с учётом scrollbar, page grid `1920 px`, шесть колонок
  карточек примерно по `273 px` и отсутствие horizontal overflow. На `1440`
  сохраняются три колонки и прежнее равное центрирование navigation gaps.
- Read-only Pen inspection подтвердил mobile/tablet/desktop header, menu и
  footer geometry; `.pen` документ не изменялся.
- `./vendor/bin/sail npm run build` проходит для client и SSR; generated SSR
  artifacts после проверки не включены в source diff. `git diff --check` и
  placeholder-link searches проходят.
- `./vendor/bin/sail artisan test --filter=Landing` выполнен и сообщил
  `No tests found`: frontend test/a11y toolchain остаётся отложенным `U-18`,
  поэтому interaction verification этого шага выполнена browser-сценариями.
