# Шаг 4 — Header and Navigation

## Цель

Перенести Header и навигацию Landing V2 из Pen.

## Header

- [x] Перенести логотип.
- [x] Перенести пункты меню.
- [x] Перенести CTA-кнопки.
- [x] Настроить размеры и отступы.
- [x] Настроить позиционирование.
- [x] Реализовать предусмотренное sticky/fixed поведение.

## Desktop

- [x] Проверить структуру меню.
- [x] Проверить ссылки.
- [x] Проверить hover/focus.
- [x] Проверить active states.
- [x] Проверить dropdown, если предусмотрен.

## Mobile / Tablet

- [x] Перенести mobile navigation.
- [x] Реализовать открытие/закрытие меню.
- [x] Реализовать предусмотренные переходы.
- [x] Проверить touch.
- [x] Проверить закрытие через Escape, если применимо.
- [x] Проверить доступность с клавиатуры.
- [x] Проверить блокировку фонового scroll, если необходима.

## Links

- [x] Сверить ссылки с Pen.
- [x] Проверить anchor navigation.
- [x] Проверить переходы на существующие страницы.
- [x] Не создавать фиктивные маршруты.

## Проверка

- [x] Desktop Header соответствует Pen.
- [x] Tablet Header соответствует Pen.
- [x] Mobile Header соответствует Pen.
- [x] Меню работает.
- [x] Ссылки корректны.
- [x] Keyboard navigation работает.
- [x] Существующий Header главной страницы не изменился.

## Результаты проверки — 2026-11-05

Контракт и полные результаты:
[navigation-contract.md](../../../docs/landing-v2/navigation-contract.md).
Выбраны `frontend-design`, `vue-best-practices`, `tailwind-best-practices`.
Повторно живым MCP прочитаны восемь V2 header frames, `Vvmix`, `TPQzW`,
button/link states; Pen не изменялся.

Добавлены V2 Header, общая toolbar для closed/open states, mobile dialog,
fixed action/nav variants и локальный список destinations. Header использует
существующий layout slot; единственный main сохранён. Все additions оформлены
V2 tokens/scoped CSS, новые dependencies и PHP/backend changes отсутствуют.

В source нет sticky/fixed contract закрытой шапки и dropdown: отметки этих
пунктов означают проверенное отсутствие, а не добавленную функциональность.
Closed header остаётся в потоке, full-screen open menu фиксирован на viewport.
Без dimming, с source переходами 280/200ms, links offset 8px и stagger до35ms.
Reduced motion убирает анимацию и задержки. Существующий `useOverlay` даёт
focus trap/restore, Escape, inert background и scroll lock; VueUse 15
`useMediaQuery`/`useEventListener` проверены по installed source.

Brand ведёт на `/landing`, login — `/login`, trial — `/register`.
Labels совпадают с Pen, href сопоставлены с существующей архитектурой,
новые маршруты не создавались. Anchors — `#advantages/#devices/#pricing`.
**На этапе 04 проверена anchor mechanics с test-only targets; actual content
targets появятся в шагах 05/06/08.** Пустые production sections ради закрытия
проверки не добавлены. Полный переход к реальным sections и весь overview DoD
остаются финальной проверке лендинга.

Проверки через Sail:

- **55 Playwright passed**: 30 navigation + 19 foundation + 6 routing;
  все восемь reference widths × light/dark, mobile/tablet keyboard, touch,
  hover/pressed/focus/active, auth transitions, resize/reopen, reduced motion,
  forced colors, short viewport 320×280 и anchor fixture navigation.
- **2 SSR unit tests passed**, **8 Laravel tests / 95 assertions passed**.
- `npm run build`: успешны client и SSR.
- Controlled built-bundle SSR: **6/6** width/theme cases, header/h1 DOM
  сохранены, menu после hydration работает, без JS/hydration errors.
- Старый `/`: **16/16** baseline comparisons без различий; source старого
  Header, shared components/composables и theme preference не менялись.
- Browser screenshots header 390/768/2560 и open menu 390×720 просмотрены;
  геометрия и typography сверены с Pen. На WQHD native/browser text metrics
  дают nav x delta 3.44px; сохраняется точный `space-between` contract.
- `git diff --check`; перед commit `git diff --cached --check`;
  generated `bootstrap/ssr/*` исключены из commit.

Это локальная приёмка Header/navigation, не physical-device, full-page pixel
или production acceptance. Шаг 05 и дальнейшие этапы не выполнялись.

## Commit

feat: implement landing v2 navigation
