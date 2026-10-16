# Шаг 6 — Контентные секции лендинга

## Цель задачи

Перенести преимущества, платформы, тариф, финальный CTA и footer-content из
Pen, завершив responsive public landing page.

## Зависимости

- Завершён шаг 5.
- Утверждены `U-06`, `U-10`, `U-15`, `U-19`.
- Pen landing frames `A`–`F`, включая 360 validation frame, и UHD dark/light
  `M`/`N` (`j8pJq`/`eM8HW`).

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — visual
  fidelity, component map/data flow и maintainable Tailwind implementation.
- `laravel-best-practices` — только для route/controller, Inertia props,
  Eloquent queries и Feature test concerns этого шага.
- `laravel-13-attribute-refactor` — условно, только при затронутой approved
  attribute-конфигурации и после проверки installed framework source.

## Конкретные действия

- [ ] Переписать route page на `<script setup>` и оставить её composition
  surface.
- [ ] Вынести feature UI в `LandingAdvantages`, `LandingPlatforms`,
  `LandingPricing`, `LandingFinalCta` и только реально повторяемые child
  components.
- [ ] Сохранить Pen copy, порядок секций и visual hierarchy.
- [ ] Использовать актуальный section direction: centered editorial intro для
  advantages/platforms, split story/configuration для pricing и `Modern Split`
  final CTA с одним Signal Orbit visual; не возвращаться к demo SaaS grid.
- [ ] Реализовать шесть преимуществ без превращения каждой мелкой части в
  лишнюю generic card abstraction.
- [ ] Реализовать platform grid для Windows, macOS, Linux, Android и iOS.
- [ ] Подключить platform actions к app/download URLs из backend-каталога,
  скопированного из общего content Remnawave subscription page; не хардкодить
  URLs или инструкции во Vue и не передавать на landing персональный
  `subscriptionUrl`.
- [ ] Передавать тариф, периоды, преимущества и цены из Inertia props, если они
  динамические по контракту шага 1.
- [ ] Не оставлять `— ₽` как production price; показывать утверждённый
  unavailable/loading state при отсутствии данных.
- [ ] Реализовать mobile-first layout по конкретным references: один столбец на
  mobile, responsive rows на tablet/desktop, UHD content width `1840 px`; не
  превращать wide advantages в один случайный six-column ряд, если Pen задаёт
  две строки по три cards.
- [ ] Сохранить section anchors и scroll-margin под header.
- [ ] Подключить CTA destinations без placeholder links.
- [ ] Не добавлять footer agreement/privacy links до решения `U-28`; после
  утверждения реализовать routes/content отдельным согласованным scope.
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
./vendor/bin/sail artisan test --filter=Landing
npm run build
rg -n "— ₽|to=\"#\"|href=\"#\"" resources/js
git diff --check
```

## Сценарии проверки

- Viewport: 320, 360, 390, 768, 1024, 1440 и 2560; 2560 сравнивается напрямую
  с `j8pJq`/`eM8HW`.
- Light/dark theme и hard reload.
- Pricing data: success, empty, unavailable.
- Long translated/server text: wrapping без обрезки.
- Anchor navigation с клавиатуры и back/forward history.

