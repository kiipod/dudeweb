# Шаг 15 — Адаптивность, доступность и визуальное соответствие

## Цель задачи

Провести исчерпывающую проверку всех реализованных экранов против 137 Pen
frames, responsive поведения и WCAG-oriented interaction requirements.

## Зависимости

- Завершён шаг 14.
- Запущенное приложение с тестовыми users/states без production secrets.
- Read-only доступ к `dudeweb.pen`.
- Решение `U-18` по automated browser/a11y tooling либо утверждённый manual
  protocol.

## Обязательные skills

- `frontend-design` — визуальная критика каждого implemented screen против Pen.
- `vue-best-practices` — review component/data-flow/accessibility behavior и
  optional references только для найденных проблем.
- `tailwind-best-practices` — review tokens, variants, class discipline и
  responsive utilities без побочного cleanup вне defects.
- `laravel-best-practices` подключается только если найденный defect требует
  backend PHP change; тогда читаются rules конкретного concern.

## Конкретные действия

- [ ] Составить verification matrix для каждого Pen frame и route/state.
- [ ] Снимать Pen screenshots только через read-only `TakeScreenshot`.
- [ ] Снимать browser screenshots при 360, 390, 768, 1440 и 2560 px в
  light/dark; 2560 сравнивать с прямыми `j8pJq`/`eM8HW` references.
- [ ] Отдельно сравнить встроенный `Static Signal Orbit Hero` на всех пяти
  widths, pointer response без изменения layout bounds и статичный SVG при reduced
  motion/touch/coarse pointer, выбранные logo lockups и
  tablet/desktop overlay states, не считая visual-only boards routes.
- [ ] Сравнить шесть `Q2 · Referral Terms` frames как одну responsive route в
  двух темах; проверить semantic ordered list, reward table и Q <-> Q2 links.
- [ ] Сравнить structure, spacing, typography, colors, radii, borders, content
  hierarchy и responsive rearrangement.
- [ ] Не подгонять production copy под demo values; сравнивать structure с
  representative real fixtures.
- [ ] Проверить промежуточные ширины 320, 414, 600, 1024 и 1280 px.
- [ ] Проверить desktop Signal Orbit при `1200x800`, `1440x1080`,
  `1920x1080` и `2560x1440`: SVG полностью помещается между Hero insets, не
  пересекает header/следующую секцию и не заходит в текстовую колонку.
- [ ] Проверить horizontal overflow, clipping, sticky overlap и safe areas.
- [ ] Проверить zoom 200%/400% и text-only enlargement.
- [ ] Проверить landmarks, heading order, labels, descriptions и status/error
  announcements.
- [ ] Проверить keyboard order, focus visibility, focus trapping и skip link.
- [ ] Проверить color contrast для text, controls, status badges и focus rings.
- [ ] Проверить target sizes и отсутствие hover-only actions.
- [ ] Проверить reduced motion, forced colors/high contrast и screen reader
  reading order.
- [ ] Зафиксировать каждое расхождение как defect, intentional deviation или
  `Needs review`; исправить defects и повторить matrix.

## Критерии готовности

- Все 137 Pen frames имеют запись в verification matrix.
- Нет unexplained visual deviations.
- Нет horizontal overflow на 320+ px и clipping контента.
- Все основные flows доступны клавиатурой и screen reader semantics.
- Reduced motion и light/dark полностью проверены.

## Команды проверки

```bash
npm run build
./vendor/bin/sail composer test
git diff --check
```

Если согласовано automated tooling, добавить и выполнить конкретные команды в
этом файле до начала шага; не предполагать наличие Playwright/Vitest/axe.

## Сценарии проверки

- Landing/specification: 13 landing/spec frames, включая два UHD, и 2
  logo-system boards; удалённые storyboard/J1–J6 не входят в current matrix.
- Account boards: components/states dark/light.
- Mobile: 20 flows x 2 themes, включая `Q2` referral terms.
- Tablet: 20 flows x 2 themes, включая `K2`, `L2` и `Q2`.
- Desktop: 19 flows x 2 themes, включая `L2` promo dialog и `Q2`.
- Auth invalid/loading/success, remote error/retry, payment lifecycle,
  clipboard/share failure и empty/populated data.

