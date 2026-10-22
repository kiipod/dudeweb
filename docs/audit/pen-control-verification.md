# Шаг 15 — controls и текст поверх декора

Дата: 2026-10-22. Ветка `pen-integration`, исходный commit `7d9698c`.
Live read-only Pen inventory повторён: **215 frames / 10 components / 19 variables**.
Pen не изменялся. Physical/AT пункты владелец пока не проверял.

## Source и границы

Прочитаны focused subtrees boards `QJZCf`, `vbwL9`, `nNqCV`, `udMVl`,
`eg9Ml`: размеры, fills/strokes, radii и state roles. Получены read-only
`TakeScreenshot` для `IllrB` (buttons/theme/pricing), `L0Pi9` (profile theme),
`tVDom` (loading), `LI7B7` (promo), `UQZi9/QfhD2` (light/dark mobile Hero).
Компоненты сравниваются с их screen roles и принятой responsive шкалой,
а не с произвольным размером превью на component board.

Подтверждены primary default/hover/focus, promo field/action/close/handle,
selected period/platform/theme, доступность actions при error/loading и
disabled appearance. Известные owner exceptions (две темы без system,
main-area promo dialog, реальные данные/copy) сохраняются. Затенённые либо
disabled controls не объявляются defects только из-за низкого контраста.

Для текста и индикаторов использованы критерии
[W3C 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
и [W3C 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
Текстовая окантовка соответствует подходу
[G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18): контраст букв
проверяется с непосредственно окружающим фоном/halo.

## Исправленные defects

| ID | Наблюдение и evidence | Исправление |
| --- | --- | --- |
| D-15-17 | Выбранная тема профиля обозначалась слабой заливкой: 1.0059:1 light / 1.2293:1 dark. Source `L0Pi9`, selected `RhDSf`; text `rkW5Y`. Новая regression воспроизвела 4/4 failures на 390/1440 в обеих темах. | У labels постоянная border geometry; выбранный вариант получает `border-accent`, остальные — transparent. Сохранены palette, layout, native radios и keyboard contract. Selected boundary имеет >=3:1, включая forced colors. Intentional accessibility deviation от Pen. |
| D-15-18 | Текст Hero перекрывается контрастными частями логотипов и запасного Signal Orbit. На `t=0` описание давало до 2.73:1, meta — 3.88:1; в orbit pose `t=15` heading — около 1.52:1 dark / 1.79:1 light. Усиление только цветов copy не устраняет пересечение заголовка. | Четыре роли обоих Hero (eyebrow, heading, description, trial) получили semantic `text-hero-contrast`: 2px centered stroke цвета background, fill рисуется последним. Получается внешний контур 1px без уменьшения тела букв. Исходные цвета, layout, logos, mask и motion сохранены. Intentional accessibility deviation от Pen. |

Hero source colors перечитаны в восьми актуальных subtrees:
`QfhD2/UQZi9/o6Ccn/XwYYP/wmAK2/BcmBV/NaUwK/v2heM`. Например, mobile
description `xrKV7/riPJI`, trial `IufvW/a31quL`, heading `aJBkP/X2nUc`,
eyebrow `Cu8W3/uW5I9`. Эти Pen colors сохранены; сам Pen не исправлялся.

Component boundaries прежние: `ProfileTheme` владеет выбором через `useTheme`;
`ServiceCloudHero` и `SignalOrbitHero` — текстом/layout; SVG renderer и
composables движения не менялись. Новых dependencies нет.

## Проверки

`control-presentation`: 96 scenarios. Все 16 page compositions на 390/1440,
обе темы: полный Tab-cycle, painted focus >=2px и >=3:1 на поддерживаемом
однотонном фоне, попадание фокуса в видимую область, icon-only controls,
hover text/icons. Public menu/More/promo дополнительно проверяются на 390/768.
Radio groups проверяются до/после ArrowRight, после смены темы и в forced colors.
Auth: validation error, loading, disabled fields/visibility/submit, стабильная
высота action. Проверка границы selected state добавлена к существующим cases.

`rendered-contrast`: **20/20** — два Hero × пять widths × две темы.
Service Cloud проверяется в production projection при `t=0/15/30/60`;
desktop rotation для этих poses — `[t*0.03, t*0.105]`. Runtime остаётся
reduced-motion/paused, test context меняет только SVG attributes. Это проверка
фиксированных сцен, не native ambient/hover/drag smoke. Signal Orbit —
статичный fallback после отказа SVG assets. Final CTA добавляется в десять
Service Cloud contexts.

Для текста без контура сохраняется screenshot фона с временно прозрачным
текстом и прежней geometry/decor. Interior line boxes сканируются сеткой
2 CSS px: это консервативная выборка, включая пробелы. Для четырёх Hero roles
проверяются opaque stroke >=2px, `paint-order: stroke fill`, CSS foreground
и stroke color. Antialiasing не используется как исходный цвет. Opacity groups
не приближаются произведением foreground alpha: тест явно требует opacity=1.
CTA/disabled/transition opacity и полупрозрачный SVG decor не смешиваются.

Результаты последнего focused прогона:

| Метод | Light minimum | Dark minimum | Роли |
| --- | ---: | ---: | ---: |
| Текст / opaque контур | 5.223:1 | 5.884:1 | 100 в каждой теме |
| Текст / sampled painted pixels | 4.659:1 | 5.060:1 | 75 в каждой теме |

Проверены 350 text-role instances: 240 Service Cloud, 60 Signal Orbit,
50 final CTA. Контур просмотрен на browser screenshot движущейся pose:
буквы читаются, фон/логотипы видны между ними, геометрия не меняется.
Полная детальная visual matrix остальных страниц этими результатами не закрыта.

Artifacts: `painted-background-contrast.json`, `hero-pose-*.png`, keyboard/icon
attachments и selected/error/loading screenshots внутри Playwright report.
Финальные команды и результаты общего набора фиксируются в
[verification audit](pen-verification.md).

## Открытая приёмка

Полная детальная сверка остальных spacing/radii/content/decor roles,
видимый ambient/hover/drag/background lifecycle, physical keyboard/AT,
native zoom, touch/safe areas и внешний SMTP остаются открытыми.
Следующее продолжение: [surfaces кабинета](pen-surface-verification.md) —
196 ролей в 84 references, D-15-19…24.
Источник ручных результатов — [протокол M-01…M-12](pen-step15-manual.md).
Шаг 15 не закрыт, шаг 16 не начат.
