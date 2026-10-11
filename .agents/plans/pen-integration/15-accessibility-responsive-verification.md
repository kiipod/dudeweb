# Шаг 15 — Адаптивность, доступность и визуальное соответствие

## Цель задачи

Провести исчерпывающую проверку всех реализованных экранов против 122 Pen
frames, responsive поведения и WCAG-oriented interaction requirements.

## Зависимости

- Завершён шаг 14.
- Запущенное приложение с тестовыми users/states без production secrets.
- Read-only доступ к `dudeweb.pen`.
- Решение `U-18` по automated browser/a11y tooling либо утверждённый manual
  protocol.

## Конкретные действия

- [ ] Составить verification matrix для каждого Pen frame и route/state.
- [ ] Снимать Pen screenshots только через read-only `TakeScreenshot`.
- [ ] Снимать browser screenshots при 360, 390, 768 и 1440 px в light/dark.
- [ ] Сравнить structure, spacing, typography, colors, radii, borders, content
  hierarchy и responsive rearrangement.
- [ ] Не подгонять production copy под demo values; сравнивать structure с
  representative real fixtures.
- [ ] Проверить промежуточные ширины 320, 414, 600, 1024 и 1280 px.
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

- Все 122 Pen frames имеют запись в verification matrix.
- Нет unexplained visual deviations.
- Нет horizontal overflow на 320+ px и clipping контента.
- Все основные flows доступны клавиатурой и screen reader semantics.
- Reduced motion и light/dark/system полностью проверены.

## Команды проверки

```bash
npm run build
docker compose exec -T laravel.test composer test
git diff --check
```

Если согласовано automated tooling, добавить и выполнить конкретные команды в
этом файле до начала шага; не предполагать наличие Playwright/Vitest/axe.

## Сценарии проверки

- Landing: 12 Pen frames, включая menu-open и 360 validation.
- Account boards: components/states dark/light.
- Mobile: 19 flows x 2 themes.
- Tablet: 17 flows x 2 themes.
- Desktop: 17 flows x 2 themes.
- Auth invalid/loading/success, remote error/retry, payment lifecycle,
  clipboard/share failure и empty/populated data.

