# Шаг 6 — Контентные секции лендинга

## Цель задачи

Перенести преимущества, платформы, тариф, финальный CTA и footer-content из
Pen, завершив responsive public landing page.

## Зависимости

- Завершён шаг 5.
- Утверждены `U-06`, `U-10`, `U-15`, `U-19`.
- Pen landing frames `A`–`F`, включая 360 validation frame.

## Конкретные действия

- [ ] Переписать route page на `<script setup>` и оставить её composition
  surface.
- [ ] Вынести feature UI в `LandingAdvantages`, `LandingPlatforms`,
  `LandingPricing`, `LandingFinalCta` и только реально повторяемые child
  components.
- [ ] Сохранить Pen copy, порядок секций и visual hierarchy.
- [ ] Реализовать шесть преимуществ без превращения каждой мелкой части в
  лишнюю generic card abstraction.
- [ ] Реализовать platform grid для Windows, macOS, Linux, Android и iOS.
- [ ] Подключить platform actions только при наличии подтверждённых URLs.
- [ ] Передавать тариф, периоды, преимущества и цены из Inertia props, если они
  динамические по контракту шага 1.
- [ ] Не оставлять `— ₽` как production price; показывать утверждённый
  unavailable/loading state при отсутствии данных.
- [ ] Реализовать mobile-first layout: один столбец -> tablet grid -> desktop
  grid по утверждённым breakpoints.
- [ ] Сохранить section anchors и scroll-margin под header.
- [ ] Подключить CTA destinations без placeholder links.
- [ ] Обеспечить корректное text wrapping на 320/360 px и 200% zoom.
- [ ] Добавить Inertia Feature test для `/`, props и public availability.

## Критерии готовности

- Лендинг визуально соответствует dark/light Pen frames.
- 360 validation layout не имеет horizontal overflow или clipping.
- Pricing отображает реальные server-provided данные или честный error state.
- CTA и links выполняют подтверждённые действия.
- Page component не содержит самостоятельную сложную business/state logic.

## Команды проверки

```bash
docker compose exec -T laravel.test php artisan test --filter=Landing
npm run build
rg -n "— ₽|to=\"#\"|href=\"#\"" resources/js
git diff --check
```

## Сценарии проверки

- Viewport: 320, 360, 390, 768, 1024, 1440 и шире 1440.
- Light/dark/system theme и hard reload.
- Pricing data: success, empty, unavailable.
- Long translated/server text: wrapping без обрезки.
- Anchor navigation с клавиатуры и back/forward history.

