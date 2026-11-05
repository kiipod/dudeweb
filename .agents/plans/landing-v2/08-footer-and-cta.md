# Шаг 8 — Footer and CTA

## Цель

Перенести Footer и заключительные CTA Landing V2.

## Final CTA

Если предусмотрен в Pen:

- [x] Перенести заголовок.
- [x] Перенести описание.
- [x] Перенести кнопки.
- [x] Перенести изображения — отдельных изображений в source Subscription нет.
- [x] Проверить анимации.
- [x] Подключить реальные маршруты.

## Footer

- [x] Перенести логотип.
- [x] Перенести навигацию.
- [x] Перенести юридические подписи без ссылок — по явному решению пользователя.
- [x] Проверить социальные ссылки — в актуальном Pen отсутствуют, новые не добавлены.
- [x] Перенести подписи.
- [x] Перенести визуальные эффекты.
- [x] Проверить responsive layout.

## Links

- [x] Проверить каждый href.
- [x] Проверить внешние ссылки.
- [x] Проверить anchor links.
- [x] Проверить юридические страницы — в проекте нет; согласованы обычные текстовые подписи.
- [x] Не создавать фиктивные ссылки.

## Animation

Если Pen предусматривает анимированный логотип
или hover effects:

- [x] Реализовать предусмотренное поведение.
- [x] Проверить mouse interaction.
- [x] Проверить keyboard focus.
- [x] Проверить reduced motion.
- [x] Не блокировать взаимодействие на touch devices.

## Проверка

- [x] CTA соответствует Pen.
- [x] Footer соответствует Pen.
- [x] Ссылки корректны.
- [x] Анимации работают.
- [x] Mobile layout корректен.
- [x] Footer существующей главной страницы не изменился.

## Результат — 2026-11-06

Повторно прочитаны live Pen Subscription/Footer на восьми ширинах,
subscription states и footer pointer board. Contracts, component map,
server price mapping и verification evidence:
[Footer and CTA Contract](../../../docs/landing-v2/footer-cta-contract.md).

Subscription использует существующий `LandingPageData` и переход `/register`;
не создаёт платёж при выборе периода и не меняет billing flow. Все реальные
anchors существуют. Юридические строки по ответу пользователя «делаем без
ссылок» оставлены обычным текстом; страницы и фиктивные адреса не создавались.
Social destinations и отдельные изображения source не предусматривает.

Sail: client/SSR build; 139/139 Playwright, затем 24/24 целевых checks после
финального SVG baseline; 13 Laravel tests / 180 assertions; 2 SSR layout tests;
6 width/theme SSR hydration checks; 16 old-home baseline comparisons по шести
областям, включая footer; PER-CS formatter — 0 исправлений. Route list
идентичен до/после. Mouse, keyboard, touch, reduced motion, forced colors и
controlled visibility проверены в Chromium. Физические устройства, реальные
платежи и production acceptance в scope этого этапа не входят.

Этап 09 не начат.

## Commit

feat: implement landing v2 footer and cta
