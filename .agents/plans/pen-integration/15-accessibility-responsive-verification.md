# Шаг 15 — Адаптивность, доступность и визуальное соответствие

## Цель задачи

Провести исчерпывающую проверку всех реализованных экранов против 215 Pen
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

## Перенесённые проверки шагов 4–6

Владелец принял implementation и разрешил переход к шагу 6. До финальной
приёмки остаются открытыми:

- [ ] Полная light/dark screenshot comparison public shell и обоих Hero на
  360/390/768/1440/2560 после восстановления capture Pen Browser.
- [ ] Native ambient/hover/drag SVG smoke в видимом Browser; hidden-page DOM
  measurements и lifecycle tests не заменяют этот результат.
- [ ] По решению владельца 2026-10-18: полная light/dark screenshot comparison
  контентных секций landing на 360/390/768/1440/2560; capture шага 6 завершался
  timeout даже после restart Browser.
- [x] Live DOM check minimum heights секции платформ после исправления:
  649/649/630/536/649 px на 360/390/768/1440/2560, с возможностью роста
  при увеличении текста. Проверено 2026-10-18 в обеих темах: computed minimum
  совпал, actual height отклоняется не более 0.02 px; overflow нет.

Дополнение UI reconciliation 2026-10-18: auth `64/64` responsive cases,
text-only ×2 `4/4`, shared primitives preview `12/12`, landing `16/16`
без horizontal overflow. Source и ограничения — в
[сверке UI](2026-10-18-ui-reconciliation.md). Screenshot capture вновь
завершился timeout 60s; native keyboard/full visual sign-off не закрыт.

## Конкретные действия

Перенесено из шага 7 по решению владельца 2026-10-18 о commit/закрытии
implementation этапа:

- [ ] Native Tab/Shift+Tab/Enter matrix auth forms, visibility controls и submit;
  forced pseudo-state/DOM focus не заменяют native keyboard проверку.
- [ ] Полная light/dark screenshot comparison auth и обновлённых shared UI
  primitives с актуальным Pen после восстановления Browser capture.
- [ ] Реальная доставка reset-письма на тестовый адрес с production-like
  прямым mailer, корректным From и рабочей reset-ссылкой. Dev `log`/fake mail
  не подтверждают доставку; проверка обязательна перед production.

- [ ] Составить verification matrix для каждого Pen frame и route/state.
- [ ] Снимать Pen screenshots только через read-only `TakeScreenshot`.
- [ ] Снимать browser screenshots при 360, 390, 768, 1440 и 2560 px в
  light/dark; 2560 сравнивать с прямыми `j8pJq`/`eM8HW` references.
- [ ] Отдельно сравнить Service Cloud/Orbits Hero на всех пяти widths:
  desktop sphere с ambient rotation и hover/drag/inertia, неизменные full-section
  mobile/tablet orbits, 23 logos, theme SVG resources,
  reduced-motion `t=0`, offscreen/background pause и forced colors. Сверить
  [актуальный contract](2026-10-17-service-cloud-hero.md).
- [ ] Проверить сохранённый Signal Orbit при явном выборе и ошибке SVG renderer/ресурсов,
  его pointer response без изменения bounds и статичный SVG при reduced
  motion/touch/coarse pointer; выбранные logo lockups и tablet/desktop overlay
  states. Visual-only boards не считать routes.
- [ ] Сравнить шесть `Q2 · Referral Terms` frames как одну responsive route в
  двух темах; проверить semantic ordered list, reward table и Q <-> Q2 links.
- [ ] Сравнить structure, spacing, typography, colors, radii, borders, content
  hierarchy и responsive rearrangement.
- [ ] Не подгонять production copy под demo values; сравнивать structure с
  representative real fixtures.
- [ ] Проверить промежуточные ширины 320, 414, 600, 1024 и 1280 px.
- [ ] Проверить desktop Service Cloud при `1200x800`, `1440x1080`,
  `1920x1080` и `2560x1440`: SVG остаётся в Hero и своей колонке, текст
  центрирован относительно viewport; header + Hero занимают `100dvh`.
- [ ] Для запасного Signal Orbit сохранить SVG внутри Hero insets, без
  пересечения header/следующей секции и текстовой колонки.
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

- Все 215 Pen frames имеют запись в verification matrix.
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
  logo-system boards плюс 2 service-logo atlas boards; удалённые storyboard/J1–J6
  не входят в current matrix.
- Account boards: components/states dark/light.
- Mobile: 20 flows x 2 themes, включая `Q2` referral terms.
- Tablet: 20 flows x 2 themes, включая `K2`, `L2` и `Q2`.
- Desktop: 19 flows x 2 themes, включая `L2` promo dialog и `Q2`.
- Full HD/QHD: 76 дополнительных references на 1920×1080/2560×1440, включая
  24 auth и 52 account/payment states. Это существующие routes, не новые flows.
- Auth invalid/loading/success, remote error/retry, payment lifecycle,
  clipboard/share failure и empty/populated data.

