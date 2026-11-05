# Шаг 5 — Hero Section

## Цель

Реализовать Hero Landing V2 согласно Pen.

## Content

- [x] Перенести заголовок.
- [x] Перенести подзаголовок.
- [x] Перенести описания.
- [x] Перенести CTA.
- [x] Перенести графические элементы.
- [x] Сохранить порядок элементов.

Использовать именно тексты V2.

Не переносить автоматически тексты и анимации старого лендинга.

## Visual

- [x] Проверить типографику.
- [x] Проверить размеры.
- [x] Проверить отступы.
- [x] Проверить композицию.
- [x] Проверить изображения.
- [x] Проверить responsive layout.

## Interactions

- [x] Найти предусмотренные Hero animations.
- [x] Реализовать их согласно макету.
- [x] Проверить начало и завершение анимаций.
- [x] Проверить scroll behavior.
- [x] Проверить touch behavior.
- [x] Проверить reduced-motion fallback.

Если анимация отсутствует в V2, не добавлять её
только потому, что она была в предыдущем лендинге.

## CTA

- [x] Проверить назначение CTA.
- [x] Подключить существующий функциональный маршрут.
- [x] Проверить авторизованного пользователя.
- [x] Проверить неавторизованного пользователя, если применимо.

## Проверка

- [x] Hero соответствует Pen.
- [x] Тексты совпадают.
- [x] Анимации работают.
- [x] CTA работает.
- [x] Mobile layout корректен.
- [x] Нет layout shift, вызванного реализацией.
- [x] Старая главная страница не изменена.

## Результаты проверки — 2026-11-06

Контракт и evidence: [hero-contract.md](../../../docs/landing-v2/hero-contract.md).
Hero повторно сверен живым Pen MCP во всех восьми адаптивах и с current motion
board; исходный документ не менялся. Перенесены точные тексты V2, CTA, trial
caption и шесть micro-UI illustrations. Copy — HTML, illustrations — исходные
assets шага 03. Каркасный brand heading заменён одним semantic h1.

Desktop/tablet: единый аккордеон, ratio 4.75:1, hold 6450ms + transition 550ms,
цикл 42s, native manual buttons и pause/resume. Mobile: обычный scroll управляет
progress 0…5, sticky stage 620px, cards 500px/offset 14px/scale до 82.5%.
Недостающие bindings V2-Q05/Q06 сопоставлены в Hero contract как implementation
решения. Reduced motion/forced colors/short viewport дают читаемую колонку на
mobile; desktop сохраняет manual selection без autoplay. Старые Hero effects
не переносились. Offscreen/hidden/inert останавливают timer; SSR/client старт
одинаков. Никаких scroll lock или wheel/touch interception.

Проверки через Sail:

- **78 Playwright passed**: 23 Hero + 55 regression checks предыдущих этапов.
  Восемь widths × light/dark site preference, source copy/type/CTA/field geometry,
  полный autoplay cycle, CSS transition end, keyboard/touch, mobile forward/back
  scroll, reduced motion, forced colors, intermediate/3840px и actual #advantages.
- **10 Laravel tests / 105 assertions**, включая guest/auth CTA destination:
  `/register` либо существующий redirect на `account.dashboard`.
- **2 SSR unit tests**, successful client + SSR `npm run build`.
- **6/6 controlled built-bundle hydration**: header/h1/card DOM сохранены,
  все шесть native cards в SSR, initial progress 0, без JS/hydration errors.
- **16/16 baseline comparisons старой `/`** без различий; его source и behavior
  не менялись. PHP CS Fixer: 0 исправлений / 1 targeted test file.
- Delayed artwork loading не меняет Hero/field/cards geometry; illustrations
  имеют intrinsic dimensions. Field bounds и copy width не меняются при смене
  карточек. Это локальная проверка implementation layout shift, не field CWV.
- Browser snapshots 390/768/1440/2560 и mobile stack просмотрены рядом с Pen;
  source/native text metrics допускают до 2px различий положения поля.
- `git diff --check`; generated `bootstrap/ssr/*` восстановлены и исключены из commit.

Все отметки выше — локальная приёмка Hero. Physical devices, полная финальная
accessibility/visual acceptance и production deployment не заявляются.
Шаг 06 и дальнейшие этапы не выполнялись. Overview DoD остаётся финальному этапу.

## Commit

feat: implement landing v2 hero
