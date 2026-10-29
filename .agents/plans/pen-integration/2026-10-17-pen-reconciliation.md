# Повторная сверка Pen — 2026-10-17

Историческая сверка до новой редакции Hero. Последующий owner request и Pen
Service Cloud/Orbits меняют Hero, tablet composition и число frames на `139`;
актуальный delta contract — [Service Cloud Hero](2026-10-17-service-cloud-hero.md).
Остальные typography/header/footer corrections ниже сохраняются.

Синхронизация checklist в шаге 16, 2026-10-27: перенесённая screenshot
comparison завершена в шаге 15 — [public audit](../../../docs/audit/pen-public-verification.md)
и [Hero audit](../../../docs/audit/pen-hero-verification.md). Прежние capture
failures ниже остаются историческими записями, не текущим acceptance статусом.

## Источник и границы

Read-only аудит открытого `dudeweb.pen`: `137` top-level frames, `10`
reusable components, `19` variables. Пять diagnostics `partially clipped`
относятся только к декоративному Morphing Color Blob; новых экранов нет.
Проверены landing references A–F/M/N, menu-open copies, Mini Design System,
Component States, logo boards и десять reusable components. Pen не изменялся.

Синхронизация реализации относится к foundation/shared brand и публичным
shell/Hero (шаги 2–5). Шаг 6 остаётся не начатым до закрытия проверок 4–5.
Ниже зафиксирован текущий source, а не предположение о том, когда каждое
значение было изменено дизайнером.

## Размеры и типографика Hero

| Параметр | 360 | 390 | 768 | 1440 | 2560 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Header height, px | 64 | 64 | 88 | 96 | 112 |
| Hero height в Pen, px | 560 | 560 | 800 | 984 | 1328 |
| Content width, px | 320 | 350 | 350 | 580 | 820 |
| Content gap, px | 14 | 14 | 18 | 18 | 24 |
| Eyebrow size, px | 14 | 14 | 16 | 18 | 22 |
| Heading size, px | 38 | 42 | 54 | 76 | 108 |
| Heading line height, px | 36 | 40 | 52 | 73 | 104 |
| Heading letter spacing, px | -1.4 | -1.4 | -2.6 | -2.6 | -4 |
| Description size, px | 16 | 16 | 17 | 20 | 24 |
| CTA label size, px | 15 | 15 | 14 | 16 | 18 |
| CTA label line height, px | 20 | 20 | 18 | 21 | 23 |
| CTA height, px | 52 | 52 | 56 | 56 | 64 |
| CTA gap, px | 10 | 10 | 12 | 12 | 12 |
| Trial size, px | 11 | 11 | 12 | 12 | 14 |
| Signal width × height, px | 250×250 | 270×270 | 465×468 | 861×830 | 1536×1246 |

В свойствах Pen heading и CTA labels используют IBM Plex Sans с weight `650`,
menu labels — `550`. Их фактическая отрисовка и ширина совпадают с браузерным
`400`: при `42 px` и tracking `-1.4 px` строка «Любимые сервисы» занимает
`349.69 px` с `400` и `365.51 px` с `650`. Первый вариант соответствует
двум строкам в Pen, второй создавал третью строку на mobile. Primary CTA при
`14 px`: Pen `158 px`, browser `400` — `157.92 px`, `650` — `162.45 px`.
Это свидетельствует о fallback промежуточных weights в отрисовке Pen; точная
внутренняя причина renderer не проверялась. Реализация воспроизводит визуальный
source через `400` для public heading/Hero actions и обычных menu items,
сохраняя стандартные `600/700` для остальных controls. Eyebrow — Mono `700`.

Pen округляет line heights по строкам: heading `0.96` даёт приведённые выше
`36/40/52/73/104 px`, description на tablet — `26 px` вместо browser `25.5`.
В tokens внесены фактические значения bounds; desktop-to-UHD остаётся fluid.
Content positions в Pen центрированы внутри Hero; принятое владельцем
viewport-centered положение desktop content сохраняется.

Tablet CTA шириной `169 px` требуют места для primary label шириной `158 px`.
Прежние `24 px` padding с каждой стороны переносили текст. Реализация использует
нулевой horizontal padding на tablet (как в Pen) и возвращает `24 px` на
desktop. На всех пяти references оба CTA теперь занимают одну строку.

## Public shell

| Параметр | Mobile | Tablet | Desktop 1440 | UHD 2560 |
| --- | ---: | ---: | ---: | ---: |
| Shell gutter, px | 20 | 32 | 80 | 280 |
| Header nav size / line height, px | — | — | 18 / 23 | 20 / 26 |
| Header login size / line height, px | 14 / 18 | 17 / 22 | 17 / 22 | 19 / 25 |
| Header login weight | 600 | 600 | 600 | 600 |
| Header login radius, px | 11 | 14 | 13 | 13 |
| Footer top / bottom padding, px | 48 / 24 | 48 / 24 | 40 / 24 | 52 / 32 |
| Footer brand gap, px | 14 | 14 | 10 | 14 |
| Footer description size / line height, px | 15 / 23 | 15 / 23 | 15 / 21 | 17 / 24 |
| Footer link size / line height, px | 15 / 20 | 16 / 21 | 16 / 21 | 18 / 23 |
| Footer label size / line height, px | 11 / 14 | 11 / 14 | 11 / 14 | 12 / 16 |
| Copyright size / line height, px | 12 / 16 | 12 / 16 | 12 / 16 | 14 / 18 |
| Footer wordmark size, px | 20 | 22 | 22 | 26 |

Footer labels — Mono `500`, letter spacing `1.2 px`. Header nav — Sans `600`.
Footer description и links — Sans `400`. Между `1440` и `2560` размеры,
line heights и footer padding интерполируются плавно; на `1600` нет скачка к
конечным UHD-значениям. Ранее реализация занижала footer links до `12/14 px`,
description до `13/15 px`, labels до `10 px`; для support действовал ещё один
отличающийся размер. Все footer links теперь используют один static class map.

Повторная сверка цветов footer по замечанию владельца:

| Роль | Dark | Light | Semantic token |
| --- | --- | --- | --- |
| Заголовки групп меню | `#F5F5F6` | `#24211D` | `text-foreground` |
| Описание и ссылки | `#A1A1AA` | `#5F5A52` | `text-footer-secondary` |
| Copyright | `#8B8B98` | `#6F685F` | `text-footer-muted` |

Цвета подтверждены на A/B/C/D/E/F/M/N. Прежний `text-muted` у заголовков
не соответствовал Pen. Отдельные footer tokens сохраняют общую account palette;
forced colors использует `CanvasText` для основного/secondary и `GrayText` для meta.
После Sail client/SSR build браузерные computed colors всех трёх заголовков,
шести ссылок, описания и copyright совпали с этой таблицей в обеих темах.
При измерении конечных цветов CSS transitions ссылок завершены через
`Animation.finish()`, поскольку скрытый Browser не продвигал их по времени.

Menu rows в Pen имеют height `50/52 px` на mobile/tablet, label `16/21 px`
с raw weight `550`; CTA `15/20 px`, raw weight `650`, height `52 px`; note `10/13 px`.
Content height menu — `309/317 px` без дополнительного browser border-box.
Положение tablet menu в source (`y=76`) пересекается с header `88 px`;
реализация сохраняет принятый inset `12 px` под фактическим header (`y=100`).

Уточнённое решение владельца 2026-10-17: только кнопка «Войти» в header на всех
экранах полужирная, browser weight `600` (`font-semibold`). Повторный read-only
Pen audit подтвердил `600` у header login на mobile/tablet/desktop/UHD и у
auth action «Войти». Это supersedes прежнее сопоставление header login с
промежуточным `650` и browser `400`. Уточнение отменяет расширение этого
требования на ссылки: «Войти» в footer и раскрытом mobile/tablet menu сохраняет
прежнее обычное начертание `400`, как остальные ссылки. Требование к header
не изменяет contracts будущих auth screens.

## Сохранённые решения и открытые расхождения

- Header + Hero на desktop равны `100dvh`, а content центрируется по полному
  viewport согласно owner correction от 2026-10-16.
- Light opacity остаётся усиленной до `0.46/0.50/0.52`; Pen задаёт
  `0.38/0.42/0.44`. Это ранее принятое исключение, а не ошибка токенов.
- Pointer momentum, squash до `20%`, точный исходный path в покое и reduced
  motion contract сохраняются. Ambient autoplay отсутствует.
- Footer agreement/privacy links остаются скрытыми по `U-28`; поэтому его
  content height не должен искусственно повторять высоту Pen с этими links.
- По явному подтверждению владельца 2026-10-17 установлен `@fontsource/inter`
  `5.3.0`. Только wordmark использует self-hosted Inter `700`; остальной UI
  сохраняет IBM Plex Sans/Mono. Header icon frames `44×36 / 48×37 / 54×43 px`
  и marks `42/46/52 px`, footer frame `34×24 px` и mark `32 px` соответствуют
  Pen. Exact SVG paths и viewBox сохранены. Browser подтвердил загрузку Inter.
- Existing component boundaries сохраняются: `BrandLogo`/`BrandLink` — fixed
  scale/variant; `PublicHeader` — controls; `PublicMobileMenu` — presentation и
  focus lifecycle; `PublicFooter` — destinations/copy; `LandingHero` — Hero
  presentation, `useSignalOrbitPointer` — pointer lifecycle. Новые props/emits
  и UI primitives не добавлены; единственная новая dependency — согласованный
  font package Inter.

## Проверка

- [x] Read-only source extraction и Pen screenshots desktop Hero, UHD Hero и
  desktop footer; структура проверена на всех пяти reference widths.
- [x] Sail client/SSR production build.
- [x] Девять существующих geometry/pointer Node tests через Sail.
- [x] `artisan test --filter=Landing` запущен в Sail: `No tests found`.
  Это отсутствие подходящих тестов, не зелёный test suite.
- [x] Live DOM/responsive checks после правок и menu handler/focus checks.
- [x] Полная live screenshot comparison в dark/light на пяти widths:
  завершена в шаге 15, source/captures и inferred cases — в audits выше.
- [x] Решение по Inter wordmark: подключить Inter; font package установлен.

После перезапуска Browser владельцем прошла dark/light DOM matrix:

| Viewport | Heading height | Content height | Header + Hero | Overflow |
| --- | ---: | ---: | ---: | ---: |
| 360×800 | 72 | 381.97 | 64 + 560 | 0 |
| 390×844 | 80 | 365.97 | 64 + 560 | 0 |
| 768×1024 | 156 | 424.98 | 88 + 800 | 0 |
| 1440×1080 | 219 | 476 | 96 + 983.98 | 0 |
| 2560×1440 | 312 | 590.92 | 112 + 1328 | 0 |

Mobile/tablet проверены с mobile emulation (без desktop scrollbar).
Desktop browser имеет `15 px` scrollbar, поэтому центрированные контейнеры
смещены на `7.5 px` относительно Pen canvas. Все content groups внутри Hero;
в header виден ровно один logo. Footer размеры, line heights и padding
совпадают с таблицей. Дополнительно `320/1024/1200/1920` и `2560×1280`
прошли overflow/containment checks. Desktop header + Hero равны viewport с
погрешностью до `0.02 px`.

Menu DOM: mobile `366×311 px` в `(12,76)`, tablet `360×319 px` в `(376,100)`;
разница `2 px` с Pen content height — border-box. Focus переходит на первую
ссылку; Escape handler, anchor selection и outside click закрывают menu,
возвращают trigger focus и снимают inert/body lock. Theme toggle сохраняет
выбор и не закрывает menu. Keyboard handler проверен через DOM KeyboardEvent:
native CDP key input не доставлялся в скрытый Browser. По той же причине новый
native pointer smoke не заявляется выполненным; pointer lifecycle покрыт
девятью существующими Sail tests. Forced colors скрывает декоративный SVG,
heading/CTA остаются в DOM, overflow равен нулю.

Снимки source Pen получены. Live capture после восстановления снова завершился
timeout: прямой `Page.captureScreenshot` для crop `390×560` вернул
`Request 'browser-node:agent-tool' timed out after 30000ms`. Полная screenshot
matrix остаётся открытой и не заменяется DOM measurements или unit-тестами.
Шаги 4–5 не объявляются завершёнными; переход к шагу 6 и commit не выполнены.
