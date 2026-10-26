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

- [x] Статическая light/dark screenshot comparison public shell и обоих Hero
  на 360/390/768/1440/2560: read-only Pen captures и Sail browser PNG.
  Hero scope — [Hero audit](../../../docs/audit/pen-hero-verification.md),
  public scope — [public audit](../../../docs/audit/pen-public-verification.md).
  360/light и 768/light явно обозначены как inferred theme cases.
- [x] Native ambient/hover/drag/background smoke Service Cloud в видимом
  обычном браузере: владелец подтвердил M-09. Это ручной результат,
  не вывод из hidden-page DOM или lifecycle tests; сбой capture Pen Browser
  сохранён как техническое ограничение инструмента.
- [x] По решению владельца 2026-10-18: light/dark screenshot comparison
  контентных секций landing на 360/390/768/1440/2560. Проверены 51 focused Pen
  и 66 browser PNG (включая header/footer/menu); исправлены D-15-29…33.
  Capture Pen Browser остаётся нестабильным; browser PNG получены через Sail.
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

Ручная physical keyboard/screen reader проверка подтверждена владельцем
в последующем отчёте M-01…M-11 ниже; browser input assertions шага 8
сами по себе не объявляются проверкой AT.

## Конкретные действия

Перенесено из шага 7 по решению владельца 2026-10-18 о commit/закрытии
implementation этапа:

- [x] Native Tab/Shift+Tab/Enter matrix auth forms, visibility controls и submit:
  подтверждено владельцем M-01; отдельно от forced pseudo-state/DOM focus.
- [x] Полная light/dark screenshot comparison auth и обновлённых shared UI
  primitives с актуальным Pen: read-only TakeScreenshot + Sail browser,
  194 полные пары и 102 focused pairs; [auth/account audit](../../../docs/audit/pen-auth-account-visual-verification.md).
- [ ] Реальная доставка reset-письма на тестовый адрес с production-like
  прямым mailer, корректным From и рабочей reset-ссылкой. Dev `log`/fake mail
  не подтверждают доставку; проверка обязательна перед production.
  Владелец 2026-10-22 уточнил: SMTP пока недоступен; M-12 остаётся открытым.

- [x] Составить verification matrix для каждого Pen frame и route/state.
- [x] Снимать Pen screenshots только через read-only `TakeScreenshot`.
- [x] Снимать browser screenshots при 360, 390, 768, 1440 и 2560 px в
  light/dark; 2560 сравнивать с прямыми `j8pJq`/`eM8HW` references.
- [x] Отдельно сравнить Service Cloud/Orbits Hero на всех пяти widths:
  desktop sphere с ambient rotation и hover/drag/inertia, неизменные full-section
  mobile/tablet orbits, 23 logos, theme SVG resources,
  reduced-motion `t=0`, offscreen/background pause и forced colors. Сверить
  [актуальный contract](2026-10-17-service-cloud-hero.md). Static/assets/lifecycle
  evidence дополнена ручным результатом владельца M-09/M-10.
- [x] Проверить сохранённый Signal Orbit при явном выборе и ошибке SVG renderer/ресурсов,
  его pointer response без изменения bounds и статичный SVG при reduced
  motion/touch/coarse pointer; выбранные logo lockups и tablet/desktop overlay
  states. Visual-only boards не считать routes.
  Explicit browser mount — 12 cases, fallback — 34 existing cases;
  выбранные logo paths повторно прочитаны из Pen. Scope и метод — в
  [аудите оставшейся приёмки](../../../docs/audit/pen-remaining-acceptance.md).
- [x] Сравнить десять `Q2 · Referral Terms` frames как одну responsive route в
  двух темах; проверить semantic ordered list, reward table и Q <-> Q2 links.
- [x] Сравнить structure, spacing, typography, colors, radii, borders, content
  hierarchy и responsive rearrangement: public/Hero и auth/account audits,
  source-derived roles и явные intentional deviations. Pixel equality
  всех nodes не заявляется.
- [x] Не подгонять production copy под demo values; сравнивать structure с
  representative real fixtures.
- [x] Проверить промежуточные ширины 320, 414, 600, 1024 и 1280 px.
- [x] Проверить desktop Service Cloud при `1200x800`, `1440x1080`,
  `1920x1080` и `2560x1440`: SVG остаётся в Hero и своей колонке, текст
  центрирован относительно viewport; header + Hero занимают `100dvh`.
- [x] Для запасного Signal Orbit проверить SVG внутри Hero insets, без
  пересечения header/следующей секции; сохранить принятый overlap описания
  и отсутствие перехвата CTA. Уточнено по существующему owner contract в
  README: запрет overlap текстовой колонки противоречил принятому anchor.
- [x] Проверить horizontal overflow, clipping, sticky overlap и safe areas:
  automated matrix + ручные M-07/M-08/M-11 владельца.
- [x] Проверить zoom 200%/400% и text-only enlargement: M-07/M-08.
- [x] Проверить landmarks, heading order, labels, descriptions и status/error
  announcements: automated semantics + M-02/M-04/M-05/M-06 владельца.
- [x] Проверить keyboard order, focus visibility, focus trapping и skip link:
  automated controls + M-01/M-03/M-04 владельца.
- [x] Проверить color contrast для text, controls, status badges и focus rings:
  205 Pen compositions, 96 controls и 20 rendered-contrast cases; unresolved
  text/field chains отсутствуют. Methods/exceptions — в аудите выше.
- [x] Проверить target sizes и отсутствие hover-only actions:
  automated target checks + M-11 владельца.
- [x] Проверить reduced motion, forced colors/high contrast и screen reader
  reading order: automated checks + M-04/M-05/M-09/M-10 владельца.
- [x] Зафиксировать каждое расхождение как defect, intentional deviation или
  `Needs review`; исправить defects и повторить matrix. D-15-01…42 и accepted
  deviations сохранены в audits; открытый M-12 записан как N-15-03.

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

## Продолжение 2026-10-22 — controls и Hero contrast

- [x] Повторить live read-only Pen inventory: 215 frames, 10 components,
  19 variables; прочитать state/control subtrees и Hero text roles.
- [x] Сверить focus/hover/icon/selected/error/loading presentation controls
  и добавить regression для недостаточного selected indicator contrast.
  D-15-17: выбранная тема профиля получила accent border; исходный failure
  воспроизведён в 4/4 cases.
- [x] Проверить текст над обоими Hero и gradient CTA на пяти widths в обеих
  темах. D-15-18: вокруг четырёх Hero text roles добавлен контур цвета фона,
  сохраняющий исходные text colors и декоративную композицию. В Sail
  20/20 cases и 350 text-role instances, включая 40 фиксированных Cloud poses.
- [x] Зафиксировать intentional accessibility deviations и source IDs в
  [control audit](../../../docs/audit/pen-control-verification.md).

Владелец 2026-10-22 подтвердил, что M-01…M-11 пока не проверял; они остаются
открытыми. Контролируемые poses не заменяют видимый ambient/hover/drag smoke.
Полная детальная visual matrix, native/AT/device и внешний SMTP не закрыты.
Шаг 15 продолжается, шаг 16 не начат.

Финальная проверка продолжения: Sail production client/SSR build, frontend
**79/79**, полный browser suite **888/888**, Composer/Laravel **277 tests /
2628 assertions**, `git diff --check`. В 266 Laravel tests сохраняются прежние
PDO deprecations; failures нет. Generated SSR bundles исключены из diff.
Operational SSR в этом продолжении не повторялся; прежние 40/40 остаются
историческим результатом, не новым deployment acceptance.

### Продолжение — surfaces и spacing кабинета

- [x] Сохранить live source snapshot 196 ролей из 84 account references,
  включая mobile/tablet/desktop/Full HD/QHD и More/promo backgrounds.
- [x] Сверить fills/borders, четыре radii/padding, gaps и widths с actual
  components; source snapshot используется прямо в browser assertions.
- [x] Воспроизвести и исправить D-15-19…24: dashboard/subscription/referral
  cards, connection steps, support bubble borders и варианты copy preview.
- [x] Повторить focused `pen-surfaces`: **84/84**, все 196 ролей соответствуют
  source с явным правилом двух вложенных HTML border boxes.

Подробности — [surface audit](../../../docs/audit/pen-surface-verification.md)
и [source snapshot](../../../docs/audit/pen-surface-roles.json).
Высоты с demo values не фиксируются. Оставшиеся auth/status/public spacing
и decoration roles, полная visual comparison и native/manual/SMTP пункты
сохраняются открытыми; шаг 16 не начинается.

Итог surface-продолжения: Sail browser **972/972** за 7 минут, frontend
**79/79**, Composer/Laravel **277 tests / 2628 assertions**, exit 0.
Production client/SSR build и `git diff --check` проходят. Прежние 266 PDO
deprecations сохраняются; generated SSR bundles восстановлены из HEAD.
Report сохранён в `storage/app/pen-step15/surface-final-report/index.html`.

### Продолжение — auth/status/public layouts

- [x] Сохранить live snapshot 543 ролей из 101 reference: auth/status/payment
  header/content, status artwork/actions и public layouts/controls/menu.
- [x] Исправить D-15-25…28: status artwork, secondary payment actions,
  neutral header controls и menu palette/gaps/shadows. Проверить **101/101**
  compositions и дополнительно **3/3** menu shadows.
- [x] Зафиксировать source hug sizing, semantic contrast mappings и
  intentional tablet menu placement под фактическим header.

Source и правила проверки — [shell audit](../../../docs/audit/pen-shell-verification.md)
и [snapshot](../../../docs/audit/pen-shell-roles.json). Эти roles проверены
метриками; полная visual comparison, native ambient/pointer, physical/AT и
SMTP acceptance сохраняются открытыми. Шаг 15 не закрыт; шаг 16 не начат.

Финальная проверка этой части: Sail browser **1073/1073** за 7.8 минуты,
frontend **79/79**, Composer/Laravel **277 tests / 2628 assertions**, exit 0
с прежними PDO deprecations в 266 tests. Production client/SSR build и
`git diff --check` проходят; generated SSR bundles исключены из diff.
Report: `storage/app/pen-step15/shell-final-report/index.html`.
Operational SSR в этой части не повторялся; commit не создавался.

### Review качества проверки

- [x] Сопоставить live inventory, source IDs и действительный состав report:
  215 frames, 205 routes/states, 1073 expected / 0 skipped / 0 flaky;
  все 1605 attachments доступны.
- [x] Воспроизвести и устранить V-15-01…04 — false positives для собственного
  layout fill, inset border geometry, menu minimum height и hidden roles.
  Четыре negative controls меняют pass на fail; hooks удалены.
- [x] Повторить оба затронутых projects: **185/185**, 196 surface + 543 shell
  roles. Production UI не менялся; полный suite заново не запускался.
- [x] Явно сопоставить пункты плана с evidence и ограничениями, включая
  257 `manual` entries computed contrast. Общие visual/native/AT/SMTP
  checkbox остаются открытыми.

Подробности — [verification review](../../../docs/audit/pen-verification-review.md).
Это review проверки внутри шага 15, не закрытие приёмки.

### Продолжение — оставшиеся Hero пункты

- [x] Прочитать восемь live Hero references и сохранить source roles;
  просмотреть 20 static Hero PNG на пяти widths в двух темах. Для 360/light
  и 768/light явно зафиксировать inferred theme cases без прямого frame.
- [x] Проверить 23 local SVG/46 theme resources, source geometry/content
  metrics, resource и renderer fallback, forced colors и SVG envelope.
- [x] Проверить default/explicit variant selection изолированными parent
  tests; повторить existing motion/drag/coarse/geometry/enlargement scenarios.
- [x] Завершить ручной Service Cloud ambient/hover/drag/background smoke:
  владелец подтвердил M-09 в обычном видимом браузере. Предыдущий Pen Browser
  capture timeout остаётся ограничением инструмента, не новым failure UI.

[Hero audit](../../../docs/audit/pen-hero-verification.md): Sail browser
**63/63**, frontend **81/81**, diff check. Production UI/build не менялись;
full browser suite, Composer и operational SSR здесь не повторялись.
Статическая Hero comparison закрыта в указанном scope; общие public shell/
auth/account visual и physical/AT/SMTP пункты остаются открытыми.

### Продолжение — public shell и контентные секции landing

- [x] Сверить 100 сохранённых public roles с live Pen; добавить 44 source
  text alignment roles и точные gradient checks из shell snapshot.
- [x] Воспроизвести и исправить D-15-29…33: theme icon, pricing surfaces/gaps,
  public accent roles, mobile intro alignment и обратный CTA gradient.
- [x] Проверить **13/13** public compositions: 11 direct sources и два
  inferred light cases. Сравнить пять widths в обеих темах и три menu states.
- [x] Снять и просмотреть 51 Pen и 66 browser PNG с явными accepted deviations.
- [x] Завершить ручной Service Cloud ambient/hover/drag/background acceptance:
  владелец подтвердил M-09. Ранее полученные trusted capture/release и
  последующий IPC timeout Pen Browser сохраняются как отдельная evidence.

Подробности и before-failures — [public audit](../../../docs/audit/pen-public-verification.md).
Frontend **81/81**, Laravel **277 tests / 2628 assertions**, production
client/SSR build и focused **13/13** проходят. Итоговый полный browser suite
на окончательном build — **1120/1120 за 8.9 минуты**, 0 skipped/flaky;
17 projects и все 1774 attachments подтверждены по HTML-report.
Промежуточные остановленные прогоны итогом не считаются.
Report: `storage/app/pen-step15/public-review/full-report/index.html`.
Generated SSR files восстановлены до байтов рабочего дерева на начало
продолжения; прежний diff сохранён. Общие auth/account visual и physical/AT/SMTP пункты
остаются открытыми. Шаг 16 не начат; commit не создавался.

### Подтверждение ручных проверок и разбор 11 public failures

Владелец 2026-10-22 явно подтвердил: **M-01…M-11 пройдены; внешний SMTP
не проверялся**. [Ручной протокол](../../../docs/audit/pen-step15-manual.md)
обновлён с этой provenance. ОС/browser/AT/device не указаны и не придуманы.
M-12 остаётся открытым. Этот отчёт supersedes прежние записи «результатов нет»;
он не является отдельным подтверждением visual comparison auth/account или
native pointer response явно выбранного Signal Orbit.

Присланный список `11 failed` с `public-acceptance.spec.js:20:5` совпадает
с сохранённым before-fix regression. На текущем checkout после D-15-29…33
тест начинается на строке 40; новый Sail повтор — **13/13 за 14.6s**, exit 0,
0 skipped/flaky. Все перечисленные 11 direct cases прошли, плюс два inferred
light cases. Production code/build не менялись; полный suite повторно не
запускался, прежний **1120/1120** сохраняется как результат предыдущего прогона.
Report: `storage/app/pen-step15/public-review/owner-followup/report/index.html`.

Шаг 15 остаётся открытым: детальная auth/shared/account visual comparison,
оставшийся explicit Signal Orbit scope, непокрытые quantitative contrast
chains и M-12. Шаг 16 не начат; commit не создавался.

### Продолжение — детальная visual-сверка auth/account

- [x] Повторно прочитать 194 non-public route/state references, 8684 nodes;
  прежние 250 auth/status shell и 196 account surface roles совпали
  с актуальным source без deltas.
- [x] Просмотреть 194 полные пары Pen/браузер и 102 focused pairs в обеих
  темах, включая profile/Q2 и More/promo; переснять transient overlays.
- [x] Воспроизвести и исправить D-15-34…42: glyph geometry/artwork,
  account chrome/navigation, overlay decoration, subscription surfaces,
  support badge/chevron и step-number typography.
- [x] Добавить 1794 detail records для 194 cases: 1744 presentation roles
  и 50 composition captures; шесть дублирующих Theme rows явно исключены
  из matching с сохранением raw source. Intentional deviations перечислены
  в [audit](../../../docs/audit/pen-auth-account-visual-verification.md).
- [x] Итоговая Sail проверка окончательного client build: browser
  **1314/1314 за 11.1 минуты**, frontend **81/81**, Laravel **277 tests /
  2628 assertions**, client/SSR build, `git diff --check`.
  Прежние 266 PDO deprecations сохраняются; failures нет.

HTML-report подтверждает 18 projects и все **2356 attachments**, без
skipped/flaky/unexpected. Включены все 194 detail / 205 Pen / 84 surface /
101 shell / 34 Hero / 13 public cases. Report:
`storage/app/pen-step15/auth-account-review/final-report/index.html`;
summary — `final-summary.json`, gallery — `index.html` в review folder.
Промежуточные остановленные прогоны не являются итоговой acceptance.
Generated SSR восстановлены byte-for-byte до состояния рабочего дерева
на начало продолжения; прежний diff сохранён. Operational SSR не повторялся.

Детальная visual-сверка auth/account закрыта в указанном scope. Шаг 15
остаётся открытым: explicit Signal Orbit scope, оставшиеся quantitative
contrast chains и **M-12 SMTP**. Ручные **M-01…M-11** остаются принятыми от
владельца. Шаг 16 не начат; commit не создавался.

### Продолжение — quantitative contrast и явный Signal Orbit

- [x] Сверить live inventory с matrix: все **215 IDs** совпали, missing/extra нет.
- [x] Проверить существующие quantitative helpers и negative controls:
  focused **308/308** (205 Pen + 96 controls + 7 regression cases), без
  unresolved text/field entries на тех же DOM instances.
- [x] Проверить явный Signal Orbit в отдельной test-only Vite build:
  **12/12** cases с настоящими components, pointer deformation/settling,
  SVG/contour bounds, reduced/coarse gates, CTA/menu и selected logo paths.
- [x] Выполнить финальные Sail проверки: browser **1333/1333 за 13.6 минуты**,
  frontend **81/81**, Laravel **277 tests / 2628 assertions**, client/SSR build
  и diff check. В report **20 projects**, 0 skipped/flaky/unexpected и все
  **2386 attachments**. Прежние PDO deprecations сохраняются.

В итоговых contrast attachments — 4393 computed text / 154 field boundaries /
120 painted measurements / 132 all-sRGB backdrop bounds, плюс 350 ролей
в 60 fixed Hero/gradient scenes. Unresolved text/field chains и failures — 0.
Methods, exceptions и границы browser/manual evidence — в
[аудите](../../../docs/audit/pen-remaining-acceptance.md).
Report: `storage/app/pen-step15/remaining-acceptance/final-report/index.html`;
summary: `final-summary.json` в той же review folder.
Generated SSR восстановлены до исходных байтов рабочего дерева; operational
SSR не повторялся. Pen и production UI в этом продолжении не менялись.

**Открыт только M-12 SMTP**: владелец сообщил, что SMTP пока недоступен.
Шаг 15 остаётся открытым, M-01…M-11 сохраняют owner acceptance; шаг 16
не начинается, commit не создавался.

### Правка владельца — полная ссылка подключения на desktop

- [x] В Dashboard и Connection заменить desktop masked preview на readonly
  input с полным URL и native ручным копированием, сохранив compact mobile/
  tablet presentation и referral variant. Применить существующий field-border
  token к desktop row; зафиксировать intentional deviation.
- [x] Проверить восемь новых manual-copy cases и затронутые dashboard,
  connection, control и surface scenarios: Sail **157/157 за 1.6 минуты**,
  frontend **81/81**, client/SSR build и diff check. Generated SSR восстановлены
  до исходных байтов рабочего дерева. Full 1333-case suite выше относится
  к предыдущему build; Laravel/operational SSR не повторялись.

Details/report — в [аудите](../../../docs/audit/pen-remaining-acceptance.md).
SMTP остаётся единственным открытым пунктом; шаг 16 не начат, commit не создан.

Последующее уточнение владельца распространяет это отображение на mobile/
tablet: subscription URL теперь всегда readonly input, masked preview удалён
из обоих callers. Referral variant сохраняется. Sail **183/183** focused
cases за 1.7 минуты (28 manual-copy + 6 touch-selection и существующие
dashboard/connection/control/surface cases), frontend **81/81**, client/SSR
build и diff check проходят. Проверены widths 320…2560, обе темы, native copy,
tap selection и отсутствие page overflow. Browser touch emulation не выдаётся
за physical device acceptance. Generated SSR восстановлены до исходных байтов
рабочего дерева; полный suite и Laravel/operational SSR не повторялись.
Report: `storage/app/pen-step15/connection-url-responsive/final-report/index.html`.

### Правка владельца — убрать контур при click/tap

- [x] Убрать дополнительную обводку от pointer activation во всех controls;
  сохранить keyboard Tab/arrow focus, selected border/fill и URL selection/copy.
  Общий CSS-first `keyboard-focus` variant и document-scoped input method
  применены ко всем 74 focus class sequences в 47 Vue-файлах.
- [x] Sail: **86/86 pointer/touch** и отдельный чистый **192/192 controls/
  interaction** прогон, без skipped/flaky/unexpected; frontend **84/84**,
  client/SSR build и diff check. Generated SSR восстановлены до исходных байтов
  рабочего дерева. Полный suite, Laravel и operational SSR не повторялись.

Scope и limitations — в [аудите](../../../docs/audit/pen-pointer-focus.md).
Остановленный первый прогон с ошибкой нового обхода disabled labels не
считается итоговым; обе чистые report matrix сохранены отдельно.
M-12 SMTP остаётся открытым; шаг 16 не начат, commit не создан.

### Правка владельца — стрелки select и кнопки инструкции

- [x] Вынести оба native select (Connection app и Referral channel) в общий
  `BaseSelect`: вертикальный центр стрелки, симметричный внутренний отступ,
  резерв для текста и native forced-colors arrow.
- [x] Оформить «Скачать» первого шага и «Добавить подписку» второго основными
  кнопками: interface control height, до 768 px ширина блока, далее по тексту.
  Сохранить server href/import scheme/external target и keyboard focus.
- [x] Sail browser **329/329 за 5.3 минуты**, frontend **86/86**, client/SSR
  build и diff check. Connection/Referral geometry проверена на восьми
  ширинах в двух темах, включая text 2×, native keyboard и forced colors;
  повторены shared controls/interaction/pointer cases. Проверены focused
  screenshots и mobile hit targets. Generated SSR сохранены byte-for-byte.

[Аудит и ограничения](../../../docs/audit/pen-connection-controls.md).
Full suite, Laravel и operational SSR не повторялись. M-12 SMTP остаётся
открытым; шаг 16 не начат, commit не создавался.

### Уточнение владельца — различать варианты скачивания

- [x] В нескольких download buttons показывать вторую строку с архитектурой
  (`amd64`/`arm64`), для Linux — формат и архитектуру (`.deb (x64)` и т. п.).
  Сохранить различия Google Play/APK и App Store RU/Global, server href/target,
  одиночную подпись «Скачать» и import action.
- [x] Sail: **102/102 connection browser** (64 новых multi-download cases
  реального каталога + 38 прежних), frontend **101/101**, client/SSR build
  и diff check. Linux mobile/Windows desktop screenshots просмотрены;
  generated SSR сохранены byte-for-byte. [Подробности](../../../docs/audit/pen-connection-controls.md).

Full suite/Laravel/operational SSR не повторялись. M-12 SMTP остаётся открыт.

### Уточнение владельца — заголовки ссылки и инструкции

- [x] Добавить небольшие h2 «Ваша ссылка для подключения» после платформ и
  «Инструкция для подключения» перед шагами; разделить блоки отступами,
  использовать существующие tokens и именовать sections через заголовки.
- [x] Sail: **38/38 account-connection + 20/20 Connection surface/detail**,
  client/SSR build и diff check. Проверены mobile/desktop screenshots,
  восемь ширин в обеих темах и text 2×; generated SSR сохранены byte-for-byte.
  [Подробности](../../../docs/audit/pen-connection-controls.md).

Frontend unit/full suite/Laravel/operational SSR не повторялись.
M-12 SMTP остаётся открыт, шаг 16 не начат.

### Уточнение владельца — полная ссылка приглашения

- [x] Заменить masked referral preview полным readonly input общего
  `CopyableLink` на всех ширинах: https/path/query, native selection/copy,
  сохранённая copy button и актуальное значение web/Telegram channel.
  Удалить неиспользуемые masked props и старое clipping exception;
  использовать контрастную native field boundary.
- [x] Sail **115/115 URL/referral + 20/20 Referral surface/detail**,
  frontend **101/101**, client/SSR build и diff check. Native Ctrl+C и
  button clipboard copy, touch, resize, contrast и text 2× проверены;
  generated SSR сохранены byte-for-byte. [Аудит](../../../docs/audit/pen-referral-url.md).

Full suite/Laravel/operational SSR и физические устройства не проверялись.
M-12 SMTP остаётся открыт, шаг 16 не начат, commit не создавался.

### Уточнение владельца — курсор и стрелки действий профиля, 2026-10-26

- [x] Сохранить прежние fills, borders, размеры, typography и icon placement
  у «Изменить пароль», «Завершить другие сеансы», «Выйти из аккаунта»;
  добавить cursor pointer при наведении. По уточнению владельца «ссылка»
  означает курсор-палец; первоначальная замена на text links отменена.
- [x] Поворачивать chevron вправо/вниз по expanded state обеих security forms,
  учитывать reduced motion; сохранить keyboard focus, busy/error handling
  и DELETE logout. Pen повторно прочитан read-only, исходный документ не менялся.
- [x] Sail client/SSR build и **138/138 browser за 52.3s**: все 48 account-profile
  cases и 90 Pen profile/password cases из pen-frames, pen-surfaces,
  pen-auth-account-details. Cursor, исходные border/width, раскрытие/сворачивание
  Enter/Space и поворот стрелок проверены; widths 320…2560, обе темы, text ×2.
  Mobile dark и desktop light PNG просмотрены. `git diff --check` проходит;
  generated SSR восстановлены byte-for-byte относительно начала работы.

Report: `playwright-report/index.html`. Full suite, frontend unit, Laravel,
operational SSR и физические устройства в этом уточнении не проверялись.
Правка принята владельцем и фиксируется отдельным коммитом.
M-12 SMTP остаётся открыт, шаг 15 не закрыт, шаг 16 не начат.

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

