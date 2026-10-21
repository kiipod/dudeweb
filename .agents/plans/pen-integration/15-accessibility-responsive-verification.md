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

E2E-часть `U-18` согласована владельцем 2026-10-20: установлен Playwright Test
1.64.1 и Chromium в Sail, добавлены JavaScript config и два smoke-прогона
(desktop/light, mobile/dark) с keyboard navigation и screenshots. Настройка и
команды — [docs/browser-testing.md](../../../docs/browser-testing.md).
Автоматизированный a11y engine не выбран. На 2026-10-21 начата acceptance matrix
этого шага: [verification audit](../../../docs/audit/pen-verification.md),
[215 frame records](../../../docs/audit/pen-verification-frames.json) и
[ручной протокол](../../../docs/audit/pen-step15-manual.md).

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

## Результаты шага 8 и отложенный SSR

CSR/browser scope dashboard проверен 2026-10-20 через Playwright: 76 account
scenarios + два login smoke, keyboard More/skip link, screenshots, responsive
и state matrix, retry/logout/text ×2. Evidence:
[account dashboard audit](../../../docs/audit/pen-account-dashboard.md).

- [x] Operational SSR/hydration `U-22` для локального production build: временно
  запущены Node renderer и отдельный Sail HTTP server с SSR enabled/throw on
  error; 40/40 scenarios подтверждают server markup, сохранение DOM при
  hydration, отсутствие mismatches и рабочий More. Проверены 8 настоящих
  initial HTTP visits и 32 безопасные fixture compositions. Deployment и
  supervision production-процессов не менялись. Источник — audit выше.

Ручная physical keyboard/screen reader проверка всех routes остаётся частью
общей matrix ниже; browser input assertions шага 8 не объявляются проверкой AT.

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

- [x] Составить verification matrix для каждого Pen frame и route/state.
- [x] Снимать Pen screenshots только через read-only `TakeScreenshot`.
- [x] Снимать browser screenshots при 360, 390, 768, 1440 и 2560 px в
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
- [x] Сравнить шесть `Q2 · Referral Terms` frames как одну responsive route в
  двух темах; проверить semantic ordered list, reward table и Q <-> Q2 links.
- [ ] Сравнить structure, spacing, typography, colors, radii, borders, content
  hierarchy и responsive rearrangement.
- [x] Не подгонять production copy под demo values; сравнивать structure с
  representative real fixtures.
- [x] Проверить промежуточные ширины 320, 414, 600, 1024 и 1280 px.
- [x] Проверить desktop Service Cloud при `1200x800`, `1440x1080`,
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

## Прогресс 2026-10-21

- Sail: frontend **79/79**, Laravel **277 tests / 2628 assertions**,
  production client/SSR build и основной browser suite **772/772**.
- После последних visual fixes заново собран production build и повторены
  все **205/205** Pen route/state cases. Обзор всех 36 contact sheets завершён;
  маленький размер Pen thumbnails не подтверждает мелкую типографику.
- Исправлены 9 defects: контраст текста и границ полей, SSR mount/Teleport/
  theme hydration, clipping увеличенного Hero, отсутствующее действие T2 и
  primary возврат O2. Подробности, intentional deviations и evidence — в audit.
- Автоматически проверены semantics, targets, reflow, text ×2, forced colors
  и desktop Hero geometry. Native/AT пункты не закрываются этими assertions.
- Владелец согласился выполнить ручной протокол; результатов пока нет.
  Внешний reset-mail smoke ожидает тестовый адрес и SMTP. Детальная visual
  comparison и native ambient/pointer smoke остаются открытыми.

Шаг 15 не закрыт; шаг 16 не начат.

### Продолжение детальной сверки

Перечитаны 3932 text nodes всех 205 screen references. В matrix сохранены
184 heading, 194 brand и 70 control typography roles с source node IDs.
Исправлены ещё семь defects D-15-10…16; отдельно проверен gradient CTA на пяти
ширинах в обеих темах. Подробности — в
[detail audit](../../../docs/audit/pen-detail-verification.md).

Полный browser suite после tracking/weight fixes: **772/772**. После последних
color/table fixes — **373/373** (205 Pen + 168 responsive/a11y), включая
ранее падавшие пять light conversation references. Q2: все десять references
проверены; последняя строка таблицы доступна после прокрутки без перекрытия nav.

Query capture Hero в Pen Browser один раз прошёл; последующий auth capture
снова завершился timeout. Страница сообщает `document.hidden=true`, поэтому
native ambient/background smoke остаётся открытым. К physical/AT и SMTP
пунктам результаты владельца ещё не поступили.

## Критерии готовности

- Все 215 Pen frames имеют запись в verification matrix.
- Нет unexplained visual deviations.
- Нет horizontal overflow на 320+ px и clipping контента.
- Все основные flows доступны клавиатурой и screen reader semantics.
- Reduced motion и light/dark полностью проверены.

## Команды проверки

```bash
./vendor/bin/sail npm run build
./vendor/bin/sail npm run test:e2e
./vendor/bin/sail composer test
git diff --check
```

Playwright установлен; дополнительные acceptance tests добавляются по scope
шага. Vitest/axe не установлены, их наличие не предполагается.

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

