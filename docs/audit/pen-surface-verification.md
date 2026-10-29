# Шаг 15 — surfaces, radii и внутренние отступы кабинета

Дата: 2026-10-22. Продолжение после D-15-17/18. Pen остаётся read-only,
ветка — `pen-integration`; изменения предыдущего продолжения сохранены.

## Source и coverage

Live inventory снова содержит **215** top-level frames. Из него через `Get`
с `resolveVariables/resolveInstances` собраны **196 surface roles в 84
route/state references**. Точный snapshot с source node IDs, width, padding,
gap, radius, fill, stroke и strokeWidth —
[pen-surface-roles.json](pen-surface-roles.json).

| Flow | References | Surface roles |
| --- | ---: | ---: |
| Dashboard, включая More open | 14 | 56 |
| Subscription, включая promo open | 20 | 40 |
| Connection | 10 | 20 |
| Referral | 10 | 40 |
| Profile | 10 | 10 |
| Support list | 10 | 10 |
| Support conversation | 10 | 20 |

Проверены 390/768/1440/1920/2560, обе темы. Эти account references не содержат
отдельного 360px варианта; reflow на 320/360 и промежуточных widths остаётся
в общем responsive suite. Overlays не превращаются в новые routes.

Focused read-only `TakeScreenshot`: `AZLLw`, `U1wGbE`, `DedIE`, `fQmsq`,
`aqtDT`. Дополнительно прочитаны `RlzsU`, `mBXqU`, `QkEOF`, `bjGWu` и
все соответствующие responsive экземпляры. В отличие от generic component
board здесь используются актуальные screen roles.

## Исправленные defects

| ID | Подтверждённое расхождение | Исправление и source examples |
| --- | --- | --- |
| D-15-19 | Dashboard: subscription/connection radius 14 вместо 16; devices 10 вместо 14 и лишний vertical padding 12; subscription использовала усиленную field boundary | `rounded-panel` для двух карточек, `rounded-card` для devices, source padding 0 по вертикали. Decorative `account-card-border` вместо input border. `AZLLw/XizkL/LHwVl`, `L7PXmb/e5KGCY/w0fFfO`, QHD `olP4O/SZ4BV/wS4ua`. |
| D-15-20 | Subscription overview radius 14 вместо 15 и generic border; payment summary имела фон surface вместо input | Semantic `subscription-overview` radius 15 и shared card border; summary — `interface-input`. `U1wGbE/DedIE`, `v2LXO/fRMeR`, QHD `Zxsrr/S3DQb`. |
| D-15-21 | Referral link card radius 14 вместо 16 и generic border; stat tiles radius 14 вместо 13 | Card — `rounded-panel` / shared card border, statistics — `rounded-referral-stat`. Padding 16/13 и gaps 11/4/10 сохранены. `fQmsq`, `ZJGXz/d6xxG` и их mobile/tablet/QHD counterparts. |
| D-15-22 | Connection steps имели surface fill `#14151B/#F8F5EE` вместо `#111218/#F5F1EA` | `bg-interface-input` у step details. Radius 12, responsive padding 14/20/24 и остальные controls сохранены. `Mf7go/LdgWb/QBOTQ`; mobile `DLGKW`. |
| D-15-23 | У обеих support bubbles отсутствовал source border | Border 1px; customer — `#5864A0` в обеих темах, operator — `#34384A/#DED8CC`. `wZakN/IwGWa`, `aqtDT/WOqoI`, light `erMKz/qU2Zp`. Width, fills и author colors сохранены. |
| D-15-24 | Shared copy preview использовал generic surface/border, gap 12 и vertical padding 4; referral получал тот же radius/fill, что subscription | Fixed `CopyableLink` variants: subscription — radius 12, gap 10, dark fill `#11131A`; referral — radius 11, gap 8, dark fill `#111218`. Light fill — `#F5F1EA`, border — `#3A3F55/#D8D0C4`; vertical padding 0, horizontal 18/24 и 8. `P5kWVT/PpuqN/kxEpN` и все 34 экземпляра. |

Новые tokens выведены из source: card border, subscription overview radius,
referral stat radius, copy fill/border/gap и customer bubble border.
`profile-border` теперь использует shared account card color, поскольку Pen
задаёт одинаковую роль; внешняя API class сохранена. Shared component получает
фиксированный `variant=subscription|referral`, без произвольных class props.
Manual-copy input остаётся настоящим полем с усиленной field boundary.

Component map: account/subscription/referral components владеют собственными
surface roles; `CopyableLink` — preview geometry и прежней copy logic;
`SupportConversation` — bubble presentation. Composables, props данных,
backend, dependencies и business rules не менялись.

## Проверка и правило сопоставления

Добавлен project `pen-surfaces`, использующий 84 существующих fixtures.
В каждом case сверяются все четыре radius и padding, background, border color
и width, gap и surface width. Сравнение с raw Pen не подменяется тестом по
значениям CSS tokens: ожидаемые значения берутся непосредственно из snapshot.

Исходный прогон 162 ролей: **64 failures / 20 passed**. Profile identity и
support list уже соответствовали source. После добавления 34 copy rows
три focused mobile cases воспроизвели различия их backgrounds, borders,
padding и gaps. После fixes: **84/84**, все **196** ролей проходят.

Погрешность измерения width — до 1px. Для `Dashboard Connection Link` и
`Referral Link Field` expected width явно уменьшена на 2px: border 1px
родительской HTML-карточки участвует в box model; Pen stroke накладывается
поверх layout. Это конкретное правило вложенности, а не расширение tolerance.
Для `Step 1` source gap относится к horizontal summary, поэтому gap details
не сравнивается с ним; surface padding/radius/color/border проверяются.

Fixed heights с demo text и абсолютные вертикальные координаты не приравниваются
к реальным данным. Новые строки имени, дат, provider instructions и статистики
вправе увеличивать карточку. Фактические reflow/clipping/focus/contrast проверяются
общим browser suite. Это не pixel equality и не physical/AT sign-off.

Финальные команды и результаты — в
[verification audit](pen-verification.md). Measurements прикреплены к каждому
case в `surface-measurements`; browser PNG остальных страниц сохраняет общий
Pen suite. Шаг 15 открыт; auth/status/public spacing, оставшиеся decoration
roles и ручная приёмка требуют своего результата.

Финальный Sail прогон: browser **972/972**, frontend **79/79**,
Composer/Laravel **277 tests / 2628 assertions** (exit 0, прежние PDO
deprecations в 266 tests), production client/SSR build и diff check.
Локальная копия report: `storage/app/pen-step15/surface-final-report/index.html`.
Generated SSR files восстановлены из HEAD, commit не создавался.

Следующее продолжение auth/status/public roles записано в
[shell audit](pen-shell-verification.md); оно не закрывает полную visual
comparison и ручную приёмку.

[Review проверки](pen-verification-review.md) усилил presence assertion до
`toBeVisible()` для всех source roles. Повтор двух source projects —
**185/185**; production presentation не менялась.
