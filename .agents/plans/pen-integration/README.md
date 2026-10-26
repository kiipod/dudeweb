# Перенос дизайна dudeweb из Pen

## Статус

**Текущий этап — шаг 15, 2026-10-22. Открыт только M-12 SMTP:** владелец
подтвердил, что SMTP пока недоступен. Quantitative contrast chains закрыты
в описанной acceptance matrix; явный Signal Orbit проверен 12 browser cases
с настоящими components, pointer/static gates и selected logo paths из Pen.
Live inventory: все 215 IDs совпадают с matrix. Итоговый Sail browser
**1333/1333 за 13.6 минуты**, 20 projects, без skipped/flaky/unexpected,
все 2386 attachments доступны. Frontend **81/81**, Laravel **277 tests /
2628 assertions**, client/SSR build и diff check проходят. Generated SSR
сохранены byte-for-byte относительно начала продолжения; operational SSR
не повторялся. [Аудит оставшейся приёмки](../../../docs/audit/pen-remaining-acceptance.md).
M-01…M-11 приняты ранее; шаг 15 не закрыт, шаг 16 не начинается.

По уточнению владельца Dashboard/Connection показывает полный
URL в readonly field с native ручным копированием **на всех ширинах**, включая
mobile/tablet. Sail focused **183/183**, включая 28 manual-copy и 6 touch cases,
frontend **81/81**, client/SSR build и diff check проходят. Полный **1333/1333**
выше относится к build до этой правки; Laravel/operational SSR не повторялись.

Следующая правка владельца убирает дополнительный outline от click/tap во
всех controls, сохраняя keyboard focus и selected/URL states. Общий variant
проверен в Sail: **86/86 pointer/touch + 192/192 controls/interaction**,
frontend **84/84**, client/SSR build и diff check. Полный suite и Laravel/
operational SSR не повторялись; прежние full-suite результаты исторические.
[Pointer focus audit](../../../docs/audit/pen-pointer-focus.md).

Следующая правка владельца: общий select с центрированной стрелкой и
внутренним отступом в Connection/Referral; «Скачать» и «Добавить подписку»
оформлены основными кнопками по масштабу блока. Sail browser **329/329**
за 5.3 минуты, frontend **86/86**, client/SSR build и diff check проходят.
Full suite, Laravel/operational SSR не повторялись; generated SSR сохранены
byte-for-byte. [Аудит селекторов и CTA](../../../docs/audit/pen-connection-controls.md).
M-12 SMTP остаётся открыт; шаг 16 не начат, commit не создавался.

Дополнение владельца: при нескольких download actions на кнопках показана
архитектура, у Linux — также формат пакета; магазины/APK различимы.
Sail **102/102 account-connection**, frontend **101/101**, client/SSR build
и diff check. 64 новых browser cases используют все multi-download варианты
текущего каталога в обеих темах на mobile/tablet/desktop/QHD; предыдущие
329/329 относятся к build до этого дополнения. Generated SSR сохранены.

Следующее уточнение: добавлены небольшие заголовки «Ваша ссылка для
подключения» и «Инструкция для подключения» с отступами перед блоками.
Sail **38/38 account-connection + 20/20 Connection surface/detail**,
client/SSR build и diff check; generated SSR сохранены byte-for-byte.
Frontend unit/full suite/Laravel/operational SSR не повторялись.

Следующая правка: Referral показывает полный web/Telegram URL в том же
readonly input, что Dashboard/Connection, с native ручным копированием и
copy button. Masked preview удалён. Sail **115/115 URL/referral + 20/20
Referral surface/detail**, frontend **101/101**, client/SSR build и diff
check; generated SSR сохранены byte-for-byte. [Аудит](../../../docs/audit/pen-referral-url.md).
Full suite/Laravel/operational SSR не повторялись; M-12 SMTP остаётся открыт.

Уточнение владельца 2026-10-26: три действия профиля сохраняют прежний
вид кнопок из Pen; при наведении показывается cursor pointer. Стрелки смены
пароля и завершения других сеансов поворачиваются вниз при раскрытии формы.
Sail **138/138 browser** (48 profile + 90 Pen profile/password cases),
client/SSR build и diff check проходят. Generated SSR сохранены byte-for-byte;
full suite/Laravel/operational SSR не повторялись. Шаг 15 остаётся открытым.

Правило cursor pointer распространено на все кнопки кабинета, включая
копирование, header theme toggle и оба варианта меню «Выйти», а также theme/
menu controls header лендинга. Прежний внешний вид сохранён. Sail **280/280
browser** (118 cursor/pointer + 162 copy/select/interactive), frontend
**103/103**, client/SSR build и diff check проходят. Generated SSR сохранены;
full suite/Laravel/operational SSR не повторялись. Результат — в шаге 15;
правка принята владельцем и фиксируется отдельным коммитом. M-12 SMTP
остаётся открыт, шаг 16 не начат.

Расширение владельца 2026-10-26: в профиле оставлены Username + Email;
ник сервиса хранится отдельно от Telegram username. Добавлены привязка
через private bot consent и durable объединение web/bot accounts: ссылка
старейшего аккаунта сохраняется, оплаченные остатки суммируются, trial — нет.
Web credentials и вся ownership history переносятся в survivor. Sail Laravel
**300 tests / 2934 assertions**, frontend **103/103**, browser **393/393**,
client/SSR build, scoped PER-CS3 formatter и diff check проходят. Четыре новые
миграции применены в local PostgreSQL, batch 8, повторный status — все Ran.
Generated SSR восстановлены. Реальный Telegram/Remnawave smoke и deployment
не выполнялись. По запросу владельца правка фиксируется отдельным коммитом.
M-12 SMTP и граница шага 16 сохраняются.
[Контракт и проверка](../../../docs/audit/pen-profile-telegram-linking.md).

**История предыдущих продолжений шага 15:** read-only inventory текущих 215 Pen
frames сохранён; детальная сверка public/auth/account выполнена в описанном
scope. Открыты explicit Signal Orbit, quantitative contrast chains и внешний
SMTP. Ручные **M-01…M-11 пройдены владельцем**,
**M-12 не проверялся**; последующее подтверждение supersedes старые manual
статусы ниже. Исправлены 42 defects: контраст текста/полей,
SSR hydration/bootstrap/Teleport/theme-controls, clipping увеличенного Hero
и действия в payment success/reset-link sent. Sail: frontend 79/79, Laravel
277 tests / 2628 assertions, browser 772/772; после последних visual fixes
повторены 205/205 Pen cases. Локальный operational SSR подтверждён 40/40
browser scenarios на проверенном production build; deployment не менялся.
Продолжение: перечитаны 3932 text nodes; в matrix добавлены typography roles
с source IDs. Исправлены tracking, начертания labels, таблица Q2, author colors
и подпись тарифа; gradient CTA прошёл sampling в 10 width/theme contexts.
Продолжение 2026-10-22: у выбранной темы профиля усилен индикатор;
у обоих Hero добавлен текстовый контур для читаемости поверх декора.
20/20 fixed-pose/gradient cases проходят. Подробнее —
[controls и Hero contrast](../../../docs/audit/pen-control-verification.md).
На момент controls-продолжения владелец ещё не проверял ручной протокол;
последующее подтверждение M-01…M-11 принято ниже.
Итог продолжения в Sail: browser **888/888**, frontend **79/79**, Laravel
**277 tests / 2628 assertions**, production client/SSR build и diff check.
Следующая часть сверки: 196 surface roles из 84 account references;
исправлены D-15-19…24 — radii, padding, card/copy fills и borders,
включая customer/operator bubbles. Focused matrix **84/84**; source IDs и
правило HTML/Pen border model — в
[surface audit](../../../docs/audit/pen-surface-verification.md).
Финальная проверка этой части: browser **972/972**, frontend **79/79**,
Laravel **277 tests / 2628 assertions**, production client/SSR build и diff check.
Продолжение auth/status/public: 543 роли из 101 reference; D-15-25…28
исправляют status artwork, secondary payment actions, header controls и menu
palette/gaps/shadows. Focused matrix **101/101**, shadows **3/3**; source,
hug sizing и сохранённое положение tablet menu описаны в
[shell audit](../../../docs/audit/pen-shell-verification.md).
Финальный Sail прогон этой части: browser **1073/1073**, frontend **79/79**,
Laravel **277 tests / 2628 assertions**, production client/SSR build и diff check.
Результаты — в [шаге 15](15-accessibility-responsive-verification.md),
[verification matrix](../../../docs/audit/pen-verification.md) и
[ручном протоколе](../../../docs/audit/pen-step15-manual.md).
Review самой проверки подтвердил состав report 1073/1073 и live inventory,
но выявил четыре false positives V-15-01…04. Assertions усилены; четыре
negative controls теперь падают, реальные source cases проходят **185/185**.
Ограничения и сопоставление с требованиями — в
[verification review](../../../docs/audit/pen-verification-review.md).
Оставшиеся Hero пункты: повторная статическая сверка 20 PNG и 8 live source
references, проверка local SVG, renderer/resource fallback и SVG envelope;
уточнён принятый overlap Signal Orbit. Sail browser **63/63**, frontend
**81/81**. [Hero audit](../../../docs/audit/pen-hero-verification.md).
На момент Hero-продолжения visible native smoke оставался открытым: Pen Browser capture снова timeout,
последующий context hidden. Production UI в этом продолжении не менялся.
Следующее продолжение: public shell и контентные секции landing сверены на
пяти widths в обеих темах. Исправлены D-15-29…33: theme icon, pricing
surfaces/gaps, accent roles, mobile intro alignment и CTA gradient direction.
**13/13** public cases: 144 direct source roles и два inferred theme cases;
просмотрены 51 Pen и 66 browser PNG. Статическая public comparison закрыта
в указанном scope; [public audit](../../../docs/audit/pen-public-verification.md).
До capture получены visible ambient и trusted native drag/capture/release;
после IPC timeout Browser снова hidden. Позже владелец подтвердил ручной
Service Cloud smoke M-09; ограничения Pen Browser не выданы за успешный capture.
Итог этого продолжения в Sail: browser **1120/1120**, frontend **81/81**,
Laravel **277 tests / 2628 assertions**, production client/SSR build и
diff check. HTML-report подтверждает 17 projects, без skipped/flaky,
и наличие всех 1774 attachments. Generated SSR сохранены в исходном состоянии
рабочего дерева; operational SSR заново не запускался.
По сообщению владельца разобран список **11 public failures**: он совпал с
before-fix логом `:20:5`. Новый focused Sail прогон текущего `:40:5` —
**13/13**, все 11 перечисленных cases проходят. Ручной протокол обновлён:
M-01…M-11 пройдены, M-12 SMTP не проверялся. Открыты detailed auth/account
visual, оставшийся explicit Signal Orbit scope, quantitative contrast chains
и M-12; этот повтор не является новым полным suite/build.
Детальная auth/account сверка завершена: live Get 194 references /
8684 nodes, 194 полные пары и 102 focused pairs. Исправлены D-15-34…42;
1794 records дополняют shell/surface/typography checks. Итоговый Sail
browser **1314/1314 за 11.1 минуты**, frontend **81/81**, Laravel **277 tests /
2628 assertions**, client/SSR build и diff check проходят. Report подтверждает
18 projects и все 2356 attachments; generated SSR восстановлены до исходных
байтов рабочего дерева. [Auth/account audit](../../../docs/audit/pen-auth-account-visual-verification.md)
фиксирует scope и intentional deviations. Открыты explicit Signal Orbit,
оставшиеся quantitative contrast chains и M-12; operational SSR не повторялся.
Шаг 14 закрыт `54113c9`; шаг 15 остаётся открытым до полной приёмки,
шаг 16 не начинается.

**Актуальная редакция Hero — 2026-10-17:** по новому запросу владельца основным
становится Service Cloud из Pen: desktop Fibonacci sphere с hover/drag по
hero236, mobile/tablet concentric orbits и локальные theme SVG logos. Исходный
Pen shader сохранён, desktop rotation адаптирована к указателю. Предыдущий
Signal Orbit сохранён целиком как запасной вариант. Текущий contract и проверки
находятся в [Service Cloud Hero](2026-10-17-service-cloud-hero.md); прежние
pointer-only/без autoplay ограничения ниже относятся к сохранённому Signal Orbit.
Шаг 6 принят владельцем 2026-10-18; оставшаяся визуальная сверка перенесена в шаг 15;
исходные макеты Pen не изменяются.

План подготовлен по результатам read-only аудита Pen-документа 2026-10-11,
актуализирован по Pen и checkout 2026-10-13 и закрыт по frontend/backend
контрактам шага 1 решениями владельца 2026-10-14. Повторный read-only аудит
2026-10-15 зафиксировал новую landing-редакцию: Signal Orbit Hero,
два самостоятельных Pen reference на `2560×1440`, новые responsive shell
метрики и удаление scroll-storyboard/отдельных fallback boards. Design
foundation шага 2 и shared UI components шага 3 актуализированы; public shell
шага 4 и Hero шага 5 реализованы и собраны. По решению владельца 2026-10-16
ambient-анимация заменена усиленным откликом исходного SVG на движение мыши;
после остановки восстанавливается исходный path. WQHD geometry — по
light frame `N`.
Pen Browser WQHD live check подтверждает geometry; полная five-width/light-dark
matrix остаётся открытой в шаге 15. Шаг 6 принят владельцем. Исходные макеты Pen не изменялись.

Повторная сверка 2026-10-17 подтвердила прежний состав `137/10/19` и текущие
размеры Pen. Исправлены расхождения типографики/spacing в public shell, menu и
Hero CTA; подробная таблица и сохранённые owner exceptions находятся в
[сверке Pen](2026-10-17-pen-reconciliation.md). Sail build и девять Hero tests
проходят. После перезапуска Browser пройдена light/dark DOM matrix на пяти
ширинах; live screenshot capture снова завершился timeout, pixel comparison
остаётся открытой. Inter для wordmark отдельно согласован и подключён.

## Закрытие текущего этапа — 2026-10-17

Владелец явно запросил commit, закрытие текущего шага и переход дальше.
Шаги 4–5 приняты с имеющимися Sail/DOM результатами. Ограничения Pen Browser
не считаются пройденными проверками: native SVG motion smoke и полная
five-width/light-dark screenshot comparison перенесены в шаги 14–15 и
остаются открытыми до фактической проверки. Шаг 6 разрешён владельцем.
В текущий commit входят связанные public shell/font corrections, Service
Cloud SVG и согласованные contracts; generated SSR artifacts исключаются.

## Продолжение шага 6 — 2026-10-18

Implementation шага 6 уже находится в commit `f9baf93`; screenshot sign-off
в нём не закрыт. Повторная read-only сверка Pen выявила заниженные minimum
height tokens секции платформ: исправлены на `649/649/630/536/649 px` для
`360/390/768/1440/2560`, с fluid desktop-to-UHD interpolation. Feature tests
`5/77`, pricing component tests `5/5` и client/SSR build проходят в Sail;
существующий PDO deprecation сохраняется. После restart Browser capture снова
завершился timeout и заблокировал дальнейшие команды. Полная screenshot
comparison и live DOM проверка новых minimum heights остаются открытыми;
По следующему решению владельца implementation принят, разрешены commit и
переход к шагу 7; оставшиеся проверки перенесены в шаг 15 без объявления их
пройденными. Подробности в [шаге 6](06-landing-content.md).

## Продолжение шага 7 — 2026-10-19

По запросу владельца шаг 7 повторно открыт для обязательного подтверждения
email перед бесплатным доступом и настройки SMTP. Local account/session
создаются сразу; Remnawave provisioning выполняется только после signed email
verification. Trial — три дня от persisted `email_verified_at`, без продления
при retries. Dev использует Mailpit; production SMTP настраивается отдельно
по [docs/mail.md](../../../docs/mail.md). Проверены 163 Laravel tests / 1022
assertions, 35 frontend tests, build, formatter, реальный dev SMTP и 16-case
responsive/light-dark matrix. Native keyboard, screenshot review и production
deliverability остаются открытыми; implementation готов к review/commit.
Прежний contract без verification
superseded; шаг 8 не начинается. Проверки дополнения ведутся в
[шаге 7](07-authentication-flows.md).

## Цель

Дополнение 2026-10-18 по запросу владельца: выполнена новая
[сверка токенов и размеров UI](2026-10-18-ui-reconciliation.md) с live Pen.
Auth и существующие shared account/payment primitives используют общую
responsive шкалу; landing повторно сверен. Sail build и 35 frontend tests,
auth matrix 64/64, shared preview 12/12 и text-only enlargement 4/4 проходят.
Подтверждены platform minimum heights в Browser. По явному решению владельца
шаг 7 и UI reconciliation приняты и закрыты как implementation этап;
native keyboard/visual/operational mail checks перенесены в шаг 15 без
объявления пройденными. Шаг 8 не начат; дальнейшая работа остановлена.

Последовательно перенести дизайн из открытого документа `dudeweb.pen` в
существующий Laravel + Inertia + Vue проект, сохранив текущую архитектуру,
mobile-first подход и существующие бизнес-контракты.

План охватывает:

- публичный лендинг;
- Service Cloud Hero с 3D sphere на desktop и concentric orbits на mobile/tablet;
- сохранённый Signal Orbit Hero с pointer response как запасной вариант;
- выбранный logo/lockup contract из Pen logo-system boards;
- светлую и тёмную темы;
- аутентификацию и восстановление доступа;
- личный кабинет, подписку и оплату;
- подключение устройств, реферальный раздел с отдельной страницей условий,
  поддержку и профиль;
- адаптивные Pen-варианты 360, 390, 768, 1440 и 2560 px;
- состояния `default`, `hover`, `focus`, `active`, `disabled`, `loading`,
  `error` и `success`;
- доступность, reduced motion и визуальную сверку с Pen.

## Источники истины и приоритеты

1. Открытый Pen-документ `dudeweb.pen` — визуальная композиция, тексты,
   размеры референсных viewport, компоненты, цвета, типографика и motion spec.
2. Фактический код, schema и установленные версии зависимостей — доступная
   бизнес-логика, маршруты, данные и технические ограничения.
3. `AGENTS.md` — архитектурные и процессные правила проекта.
4. `docs/audit/skills/README.md` и `docs/audit/skills/inventory.md` — текущая
   карта выбора и применимости project-level skills.
5. Неподтверждённые детали не реализуются предположительно: они фиксируются как
   `Needs review` в разделе «Неопределённости».

Последнее явно принятое владельцем решение имеет приоритет над прежним motion
contract. Hero не использует scroll-driven последовательность: весь заголовок
`Любимые сервисы снова рядом` виден сразу. Новое решение 2026-10-17 разрешает
автономное движение mobile/tablet Orbits по текущему Pen shader. Следующее
уточнение владельца добавляет desktop mouse hover/drag и затухающую инерцию
поверх спокойного ambient rotation: до hover и после ухода мыши sphere движется.
Reduced motion фиксирует исходную
композицию, background/offscreen останавливает RAF. Прежний
pointer-driven Signal Orbit сохраняется отдельно, выбирается через
`<LandingHero variant="signal-orbit" />` и служит fallback при отказе SVG
renderer или загрузки логотипов.

## Результат аудита Pen

### Документ и состав

- Документ: `dudeweb.pen`.
- Верхнеуровневых фреймов: 215. Сверка 2026-10-18 добавила к прежним 139
  ещё 76 responsive Full HD/QHD references; Pen агентом не изменялся.
- Формальных reusable-компонентов: 10.
- Variables: 19.
- Предыдущий layout audit: 0 структурных проблем и пять `partially clipped`
  diagnostics у декоративного `Morphing Color Blob`. В новой редакции этот
  слой архивирован/disabled; текущий Service Cloud проверяется отдельно по
  [актуальному contract](2026-10-17-service-cloud-hero.md).

Группы фреймов:

| Группа | Количество | Содержание |
| --- | ---: | --- |
| Лендинг и спецификации | 13 | mobile/light/dark, 360 validation, tablet, desktop, 2560 dark/light, menu-open, states, design system |
| Logo-system boards | 2 | SVG concepts и icon/horizontal/stacked lockups |
| Hero logo atlases | 2 | `SLuGe` / `LraS6`, 23 сервиса в light/dark |
| Account boards | 4 | dark/light components и account/checkout states |
| Mobile account | 40 | 20 экранов в dark и light, включая условия реферальной программы |
| Tablet account | 40 | 20 экранов в dark и light, включая открытые `Ещё`, промокод и условия реферальной программы |
| Desktop account | 38 | 19 экранов в dark и light, включая promo dialog и условия реферальной программы |
| Full HD/QHD account/auth | 76 | существующие desktop routes/states на 1920×1080 и 2560×1440 в двух темах; 24 auth и 52 account/payment references |

Повторный аудит зафиксировал дельту `122 -> 136` без Pencil mutations:

| Новые фреймы | ID | Роль в реализации |
| --- | --- | --- |
| `J1`–`J6 · Static Hero` | `blWdJ`, `HbqLE`, `Y7YcIU`, `AUHPH`, `IPo8p`, `C2C5YY` | visual-only reference для статического Hero на 360/390/768/1440 |
| `K · Logo Concepts · SVG` | `ODHOo` | visual-only выбор направления logo |
| `L · Logo Lockup Variants` | `hc0K9` | visual-only выбор icon/horizontal/stacked lockup |
| `K2 · Account Dashboard · Tablet · More Open` | `VcLN4`, `mlxDX` | route-state dashboard, dark/light |
| `L2 · Subscription · Promo Open · Tablet` | `n9UuR`, `Nn7dT` | route-state subscription, dark/light |
| `L2 · Subscription · Promo Open · Desktop` | `jodkF`, `k4r5Hy` | route-state subscription, dark/light |

Logo boards и Static Hero не создают самостоятельные routes. `K2`/`L2` —
визуальные состояния существующих account routes, а не отдельные страницы.

Предыдущий read-only аудит зафиксировал дельту `136 -> 142` без Pencil
mutations:

| Новые фреймы | ID | Роль в реализации |
| --- | --- | --- |
| `Q2 · Referral Terms · Mobile` | `paZk6`, `LNwLW` | самостоятельная read-only account page, dark/light |
| `Q2 · Referral Terms · Tablet` | `BYL5v`, `hhNkq` | та же page в tablet shell, dark/light |
| `Q2 · Referral Terms · Desktop` | `jSIgm`, `Uel2T` | та же page в desktop shell, dark/light |

`Q2` связан с основным `Q · Referral` явной ссылкой «Условия партнёрской
программы» и обратным действием «Назад к приглашениям». Поэтому это новый
route/page внутри referral flow, а не visual-only state. Утверждены path
`/account/referral/terms` и route name `account.referral.terms`.

Повторный read-only аудит 2026-10-15 зафиксировал дельту `142 -> 137`:

| Изменение | ID | Роль в реализации |
| --- | --- | --- |
| Удалён `G · Hero Motion Storyboard` | прежний storyboard | scroll/pinning contract отменён |
| Удалены `J1`–`J6 · Static Hero` | `blWdJ`, `HbqLE`, `Y7YcIU`, `AUHPH`, `IPo8p`, `C2C5YY` | отдельные fallback references больше не являются source |
| Добавлен `M · Desktop UHD Dark · 2560×1440` | `j8pJq` | полноценный dark landing reference |
| Добавлен `N · Desktop UHD Light · 2560×1440` | `eM8HW` | полноценный light landing reference |

Hero теперь встроен как `2 · Static Hero · Signal Orbit` во все landing frames.
Reusable count и variables не изменились. Pencil mutations не выполнялись.

Референсные размеры:

- small mobile: `360 px`;
- mobile: `390 px`;
- tablet: `768 px`;
- desktop: `1440 px`.
- UHD desktop: `2560 px` (`j8pJq`/`eM8HW`).

Это контрольные viewport, а не отдельные CSS breakpoint сами по себе. CSS
boundaries остаются mobile `<768`, tablet `768–1199`, desktop `>=1200`, wide
`>=1600`; reading/form/account containers не растягиваются вместе с public
landing grid.

### Уникальные пользовательские потоки

- Лендинг: header, Hero, преимущества, платформы, тариф, финальный CTA, footer.
- Mobile menu: dark/light и открытое состояние.
- Account dashboard: default и открытый `Ещё` на mobile/tablet.
- Подписка: default, mobile/tablet promo sheet и desktop promo dialog.
- Auth: login, registration, recovery, reset-link-sent, new password,
  password-changed.
- Подключение: Windows, macOS, Linux, Android, iOS и три шага настройки.
- Referral: ссылка, share/copy, показатели, empty state и отдельная страница
  условий программы.
- Support: список обращений, новое обращение, диалог.
- Profile: данные аккаунта, безопасность, theme selector, logout.
- Payment: pending, success, failure.
- Account states: trial, active, expiring, expired, limited, loading,
  service error, discount applied.

### Запасной Static Signal Orbit Hero

Этот раздел описывает сохранённый backup. Основной Hero с 2026-10-17
определяется [новым Service Cloud contract](2026-10-17-service-cloud-hero.md).

Новая редакция удаляет storyboard и fallback-разделение. Основным и
единственным Hero является `2 · Static Hero · Signal Orbit`:

- eyebrow `HEY, DUDE!`;
- заголовок `Любимые сервисы\nснова рядом` виден сразу;
- описание `dudeweb помогает пользоваться любимыми сервисами для работы,
  развлечений и общения — просто и без лишних сложностей.`;
- CTA `Попробовать бесплатно` и `Посмотреть тариф`;
- строка `3 дня бесплатно · До 5 устройств`;
- точная path geometry Signal Orbit:
  `M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z`
  с `viewBox 0 0 300 300`;
- dark mesh palette `#665BE8/#B441B0/#E87950/#566ED8` при opacity `0.48`,
  light palette `#858FF3/#D982C9/#F09A6F/#8EA3F4` при opacity
  Pen opacity `0.38/0.42/0.44` на mobile/desktop/UHD (повторная сверка Pen
  2026-10-16). После замечания владельца о блеклой форме implementation opacity
  повышена до `0.46/0.50/0.52`; это визуальная корректировка поверх исходных
  значений, оттенки сохранены;
- heading scale `38/42/54/76/108 px` на `360/390/768/1440/2560`;
- Hero heights `560/560/800/984/1328 px` на тех же references. На desktop
  `Header + Hero` занимают один reference viewport: `96 + 984 = 1080 px` и
  `112 + 1328 = 1440 px`. Последнее решение владельца: header и Hero должны
  целиком помещаться в один экран. Поэтому desktop Hero имеет точную высоту
  `100dvh - header`, без fixed/min-height от Pen. Учитывается фактическая
  область браузера, которая может быть ниже физического разрешения монитора.
- На desktop/WQHD/UHD текстово-кнопочная Hero-группа центрируется относительно
  полного viewport, а не только области под header: fluid offset равен половине
  текущей высоты header (`48 px` на `1440`, `56 px` на `2560`). Это принятое
  owner correction к буквальному вертикальному положению группы в Pen. Content
  вертикально позиционируется независимо от grid-row декоративного Signal Orbit:
  увеличение SVG на WQHD не должно влиять на центр текста и actions.
- Pen geometry Signal Orbit `861×830 px` на desktop / `1536×1246 px` на
  WQHD служит исходной геометрией и верхней границей размера. Последнее решение
  владельца требует вписать SVG внутрь Hero, сохраняя его пропорции и overlap
  описания. После удаления анимации используется статичный reference `N`:
  при `2560×1440` SVG `1536×1246 px`, top `38 px`, bottom `44 px` внутри Hero.
  Эти отступы ограничивают доступную высоту; в низком окне обе стороны SVG
  масштабируются одним aspect ratio. Запас под morph удалён.
  Горизонтальный anchor под текстовой колонкой сохраняется.
  SVG не участвует в flow и не перехватывает pointer events. Секция использует
  `overflow: hidden` как защиту. Прежние fixed-height / overflow-visible
  corrections отменены.

Hero не pinned и не зависит от scroll progress. В покое SVG использует исходный
path из Pen. Последний запрос владельца добавляет отклик на направление мыши
по аналогии со звёздами на [лендинге OpenAI](https://openai.com/ru-RU/index/introducing-gpt-6-1-sol/).
По последнему уточнению `useSignalOrbitPointer` снова учитывает направление и
импульс движения по всей Hero. Амплитуда деформации увеличена с `18` до `48`
SVG units; поперечное сжатие до `20%` делает изменение размера заметным.
Более быстрый отклик `60ms`, impulse distance `55px` и decay `200ms` дают
выразительную, плавно затухающую реакцию. После остановки/ухода мыши возвращается
точный Pen path, RAF прекращается. Оба fill-слоя используют один path; контур
остаётся в исходном Pen envelope. SVG viewport, insets и content не двигаются.
Отдельные canvas/кисть и захват фигуры с вытягиванием к краям отменены.
Смена темы, scroll/resize/blur немедленно сбрасывают эффект;
observer/listeners снимаются при unmount.
Reduced motion, touch/coarse pointer и фон остаются статичными. CSS keyframes,
scale/rotation и ambient autoplay не возвращаются. Pen задаёт geometry и palette,
внешний сайт — только принцип взаимодействия.

Desktop geometry между `1440` и `2560` интерполируется плавно. Wide breakpoint
не должен скачком включать `1800 px` grid внутри viewport около `1600 px`:
container, обе колонки, typography и shell gutter остаются fluid и достигают
точных Pen-значений только на reference endpoints; ширина, высота и смещение
signal также плавно интерполируются между Pen references. Четыре угловых mesh
цвета смешиваются двумя horizontal gradients и vertical alpha mask.

### Токены и типографика

Pen предоставляет 19 variables:

- dark: `bg #0A0A0B`, `surface #14151B`, `elevated #1B1D27`,
  `text #F5F5F6`, `secondary #A1A1AA`, `muted #8B8B98`,
  `border #34384A`;
- semantic: `accent #8E9BFF`, `success #56D6AE`;
- account light: `bg #FBF9F4`, `surface #F8F5EE`, `elevated #F4F0E8`,
  `text #24211D`, `secondary #625C54`, `muted #7A7268`,
  `border #DED8CC`;
- fonts: `IBM Plex Sans` и `IBM Plex Mono`.

В Mini Design System также зафиксированы:

- spacing scale: `4, 8, 12, 16, 24, 32, 48, 64`;
- частые radius: `8, 10, 11, 12, 14, 16, 18`;
- UI motion: `150-250ms`;
- основной Hero использует pointer-driven desktop sphere и автономные
  mobile/tablet Orbits; запасной Signal Orbit сохраняет свой pointer contract;
- карточки: нейтральная поверхность, тонкая граница, без тяжёлой тени.

Часть light-цветов и state-цветов записана в Pen напрямую, а не variables.
Шаг 2 должен составить полную semantic token map без потери значений.

### Reusable-компоненты Pen

| ID | Название |
| --- | --- |
| `AJ40x` | Account Top Header |
| `c6NUQr` | Account Bottom Navigation |
| `sDedj` | Status Badge · Active |
| `l86vnd` | Copyable Link |
| `Lbab2` | Primary Action |
| `eSkQx` | Inline Alert |
| `e9Cb0` | Subscription Period Selector |
| `k6KWf` | Subscription Summary |
| `Vxu7B` | Account More Navigation Sheet |
| `LI7B7` | Account Promo Code Sheet |

`Vxu7B` и `LI7B7` добавлены после первого аудита. `Vxu7B` пока не используется
как `ref`, а `LI7B7` используется двумя dark responsive instances; часть light
и responsive variants собрана обычными frames. Поэтому implementation contract
выводится из всех instances/states, а не только из formal component.

### Responsive overlay contract

- mobile `Ещё`: bottom sheet `390 x 372`, на всю ширину viewport;
- tablet `Ещё`: bottom sheet `520 x 372`, центрированный по горизонтали;
- mobile promo: bottom sheet `390 x 354`;
- tablet promo: bottom sheet `520 x 354`, центрированный по горизонтали;
- desktop promo: dialog `500 x 354` с radius `24`, центрированный в main area;
- tablet/mobile backdrops начинаются под account header, desktop promo backdrop
  визуально покрывает main area после sidebar.

Focus/inert/scroll-lock semantics не выводятся только из визуальной геометрии;
они подтверждаются в `U-20` и реализуются доступным modal contract.

### Referral terms contract

Новые `Q2` frames задают одинаковый content contract для 390/768/1440 и обеих
тем:

- заголовок `Партнёрская программа` и описание
  `Условия для участия простые.`;
- бонус другу: `30% на первую покупку подписки`;
- четыре последовательных шага: приглашение, оформление подписки, успешная
  оплата и начисление бонуса пригласившему;
- reward matrix: `1 месяц -> +7 дней`, `3 месяца -> +14 дней`,
  `6 месяцев -> +21 день`, `12 месяцев -> +30 дней`;
- mobile/tablet сохраняют active section `Ещё`, desktop — active sidebar item
  `Пригласить друга`.

Эти значения совпадают с текущими `PromocodeService`, `ReferralService`,
`ReferralBonus` seed data и durable reward flow: приглашённый получает
одноразовую скидку на первую успешную оплату, а referrer — отдельный reward за
каждую успешную оплату. Однако Vue не должен копировать проценты и матрицу как
самостоятельные бизнес-правила. Page получает live server-confirmed values и
явную content version по утверждённому `U-27`.

Не каждый повторяющийся паттерн оформлен в Pen как formal component. При
реализации повторяемые shell, auth, state и navigation patterns должны стать
небольшими focused Vue-компонентами с явными props/emits contracts.

## Результат аудита репозитория

### Фактический стек

- PHP `8.5`, Laravel `13.35.0` (текущий `composer.lock`).
- `inertiajs/inertia-laravel 3.5.1`.
- `@inertiajs/vue3 3.9.1` и `@inertiajs/vite 3.9.1`.
- Vue `3.5.44`.
- Tailwind CSS и `@tailwindcss/vite 4.3.3`.
- Vite `8.3.4`.
- JavaScript stack; TypeScript в текущем frontend не настроен.

### Текущее frontend-состояние

- Единственная Inertia page: `resources/js/pages/App.vue`, `<script setup>`.
- Страница содержит реализованный `LandingHero`; остальные секции остаются
  demo-заглушками до шага 6.
- `PublicLayout.vue` содержит public header/menu/footer, landmarks и skip link;
  прежний `AppLayout.vue` удалён.
- `app.css` содержит CSS-first semantic tokens, fonts, breakpoints и light/dark
  palette. Shared UI primitives и focused public components реализованы.
- Отдельная UI component library, включая Nuxt UI, не установлена; UI
  primitives должны быть локальными Vue-компонентами или семантическим HTML.
- SSR dependencies и build script присутствуют, но operational entrypoint и
  способ запуска должны быть подтверждены в `U-22`.
- IBM Plex Sans Variable и Mono self-hosted из установленных npm packages;
  Mono weights `400/500/600/700`. По отдельному подтверждению владельца
  2026-10-17 wordmark использует self-hosted Inter `700`.
- Frontend Node tests запускаются через Sail. По запросу владельца 2026-10-20
  установлен Playwright Test 1.64.1 с Chromium в Sail, JavaScript config и
  `npm run test:e2e`; desktop/mobile keyboard/screenshot smoke проходит.
  Инструкция: [browser testing](../../../docs/browser-testing.md).

### Текущие HTTP-контракты

Доступно пять application routes:

- `GET /` — Inertia `App`;
- `POST /payments` — JSON creation endpoint, `auth:web`;
- `GET /payments/return` — проверяет подписанный token, сейчас возвращает
  plain response для web payment;
- `POST /webhooks/yookassa` — provider webhook.
- `GET /test` — незакрытый диагностический Remnawave route с `dd()`; он не
  является частью целевого web UI contract и должен быть отдельно удалён либо
  ограничен до публикации account routes.

Web login/register/logout/password routes и Inertia routes личного кабинета
отсутствуют.

### Доступная доменная база

- `Plan`, `Product`, `Advantage` и связи могут дать тариф и преимущества.
- `Payment` и существующий payment service покрывают создание и lifecycle
  YooKassa payment.
- `User`, `ReferralReward`, `ReferralBonus` и referrals relation дают часть
  referral-данных.
- Remnawave handlers дают subscription URL, remote expiration/status и HWID
  devices, но web-facing orchestration отсутствует.
- Support ticket model/service/routes отсутствуют; текущая Telegram-поддержка
  ведёт на внешний Telegram URL.

### Критические расхождения

- Pen auth/profile используют email и password, а таблица `users` хранит
  обязательные Telegram `username`/`chat_id` и не содержит email/password;
  standalone web user при текущей schema создать нельзя.
- `web` guard объявлен, но web-auth flow не реализован.
- Remnawave lookup/lifecycle сейчас связывает local и remote user по Telegram
  `chat_id` либо `username`. Для web-only users отсутствуют stable remote key и
  provisioning flow.
- Pen содержит support tickets и conversation, которых нет в домене.
- Pen показывает web referral URL, текущая логика генерирует Telegram bot link.
- Pen referral terms содержат точные discount/reward значения; они совпадают с
  текущими seed/service rules, но в backend пока нет единого versioned contract
  для публикации условий в web UI.
- Pen payment pages предполагают live status UI; текущий return endpoint
  возвращает текст и не предоставляет Inertia status props.
- Local snapshot `tailwind-4-docs` не инициализирован; точный Tailwind API,
  выходящий за уже используемые возможности, отмечается `Needs review`.

## Обязательный skill contract

Перед началом каждого шага агент повторно определяет применимые skills по
фактическому scope этого шага. Наличие каталога или вывод `npx skills list` не
означают, что skill выбран автоматически.

Порядок работы со skills:

1. Проверить актуальные `AGENTS.md`, `docs/audit/skills/README.md`, inventory и
   при необходимости `npx skills list`.
2. До изменений явно объявить выбранные skills и причину выбора каждого.
3. Полностью прочитать `SKILL.md` каждого выбранного skill и только необходимые
   references/scripts по его routing instructions.
4. Применять project-specific ограничения поверх generic guidance: npm,
   JavaScript + `<script setup>`, FormRequest, CSS-first `@theme`.
5. Неподтверждённый API или конфликт фиксировать как `Needs review`, а не
   заменять предположительной реализацией.

Матрица выбора:

| Concern шага | Обязательные skills | Что они контролируют |
| --- | --- | --- |
| Любое написание, изменение, review или refactor PHP-кода | `php-per-cs3` первым | PER-CS 3.x как основной coding style; Laravel skills добавляются независимо по concerns |
| Новый UI, перенос или заметная visual/UX правка | `frontend-design` | Design intent, типографика, layout, motion restraint и визуальная критика против Pen |
| Любые Vue, `.vue`, Vue Router или Vite-with-Vue изменения | `vue-best-practices` | Component map, `<script setup>`, data flow, reactivity, composables и optional references по фактическому поведению |
| Tailwind classes, tokens, CSS-first config, review или cleanup | `tailwind-best-practices` | Semantic tokens, короткие упорядоченные class lists, fixed variant maps и отказ от `@apply` как component architecture |
| Laravel backend architecture, routes, validation, security, queries или errors | `laravel-best-practices` | Thin controllers, FormRequests, policies, services/actions, Eloquent/query behavior, external boundaries и error handling |
| Разрешённая Laravel 13 attribute-конфигурация в затронутом component | `laravel-13-attribute-refactor` | Только approved attribute matrix после проверки class, target, constructor и framework integration в установленном source |
| Точный Tailwind v4 API/config/migration | `tailwind-4-docs` только с актуальным snapshot | Version-specific API; инициализация snapshot — отдельная задача с явным разрешением |

Для `vue-best-practices` перед Vue implementation всегда читаются core
references `reactivity.md`, `sfc.md`, `component-data-flow.md` и
`composables.md`. Slots, fallthrough attrs, Teleport, Transition и animation
references читаются только в шагах, где соответствующее поведение реально
нужно. Проект остаётся на JavaScript: TypeScript-примеры skill адаптируются к
явным runtime `defineProps`/`defineEmits` contracts.

Для `laravel-best-practices` перед backend implementation выбираются и читаются
только rule-файлы, соответствующие затронутым concerns. Проектное требование
FormRequest имеет приоритет над допустимой в generic guidance inline
validation. `laravel-13-attribute-refactor` выбирается независимо и не является
причиной расширять scope до несвязанной attribute-миграции.

Отсутствие готовых semantic `@theme` tokens и shared component layer не
блокирует этот первичный перенос: шаг 2 создаёт token foundation, шаг 3 —
component foundation, и только затем реализуются screens. React-примеры из
`tailwind-best-practices` не копируются: не добавляются `clsx`,
`tailwind-merge`, JS config или formatter plugins; variants реализуются явной
Vue map со статическими Tailwind class strings.

## Целевая архитектура

```text
Laravel route/controller/FormRequest
        |
        v
Inertia page props + redirects/errors
        |
        v
Thin route page (composition surface)
        |
        +--> feature components
        +--> shared UI components
        +--> focused composables for local interaction/motion
        |
        v
Semantic Vue components + Tailwind 4 design tokens
```

Правила:

- не создавать отдельный REST API для данных, которые естественно передать
  через Inertia props;
- сохранить существующий JSON payment endpoint до отдельного решения о его
  контракте;
- `Request`/`FormRequest` остаются action-scoped, сервисы поведения controller
  внедряются через constructor;
- страницы остаются composition surfaces;
- props идут вниз, события вверх;
- локальные interaction/motion concerns выносятся в `useXxx()` composables;
- JavaScript stack сохраняется, самовольной миграции на TypeScript нет;
- интерактивные primitives реализуются через семантический HTML и focused
  Vue-компоненты без скрытых library contracts;
- Tailwind остаётся CSS-first через `@theme`.

## Порядок выполнения

Шаги выполняются последовательно:

1. [x] [Контракты и фиксация источников](01-source-and-contract-audit.md)
2. [x] [Design foundation и tokens](02-design-foundation.md)
3. [x] [Переиспользуемые UI-компоненты](03-shared-ui-components.md)
4. [x] [Публичный shell и навигация](04-public-shell-navigation.md) — принят
   владельцем; оставшаяся screenshot comparison перенесена в шаг 15
5. [x] [Service Cloud Hero и запасной Signal Orbit](05-static-hero.md) — принят
   владельцем; SVG, 25 tests, client/SSR build и DOM matrix готовы; native
   motion smoke и screenshot comparison перенесены в шаги 14–15
6. [x] [Остальные секции лендинга](06-landing-content.md) — принят владельцем;
   оставшиеся screenshot comparison и live DOM check перенесены в шаг 15;
   server pricing, статичные платформы, Feature tests, build и light/dark DOM matrix готовы;
   keyboard/anchor/text enlargement и effective zoom проверены после restart;
   полная visual comparison открыта из-за capture artifacts/timeouts
7. [x] [Auth и password flows](07-authentication-flows.md) — implementation
   принят владельцем; backend/UI, automated checks и UI reconciliation готовы;
   native keyboard, screenshot comparison и operational mail delivery перенесены
   в шаг 15; дополнение verification/SMTP от 2026-10-19 закоммичено в `c77396f`
8. [x] [Account shell и dashboard](08-account-shell-dashboard.md) — CSR/Inertia
   implementation и browser acceptance проверены: Playwright 78/78, screenshot
   review с live Pen, keyboard/More/retry/logout/text ×2. Исправлены два visual
   defects. Этап закрыт текущим commit; operational SSR остаётся отложенным
   `U-22` / шаг 15; commit `105c1c1`
9. [x] [Подписка и оплата](09-subscription-payment.md) — implementation и
   CSR/browser verification завершены 2026-10-20: Laravel 213 tests / 1846
   assertions, frontend 49/49, Playwright 139/139, build и formatter. Live Pen
   promo heights актуализированы. По запросу владельца этап принят и закрыт
   текущим коммитом; шаг 10 не начат. Operational SSR и ручная accessibility
   matrix остаются в шаге 15
10. [x] [Подключение устройств](10-connection.md) — implementation и
   CSR/browser verification завершены 2026-10-20: server catalogue из общего
   app config владельца, owner-only URL/devices и revoke, clipboard fallback,
   auto OS selection с повторным определением после page reload;
   Laravel 229 tests / 2136 assertions, frontend 69/69, основной Playwright
   167/167 и повторный connection 37/37 после OS detection, build и formatter.
   По запросу владельца этап принят и закрыт коммитом `83a0ef2`
11. [x] [Реферальный раздел](11-referral.md) — implementation и CSR/browser
   verification завершены 2026-10-20: opaque web/Telegram invites, общий
   attribution resolver, APPLIED aggregates, live/versioned terms Q2,
   copy/share fallback. Laravel 239 tests, финальный AccountReferral 10/108,
   frontend 70/70, Playwright 223/223, client/SSR build и formatter.
   По запросу владельца этап принят и закрыт коммитом `c093eb8`.
   Native Share/SSR/a11y — шаг 15
12. [x] [Поддержка](12-support.md) — implementation и CSR/browser verification
   завершены 2026-10-20: persisted owner-only tickets и
   messages, MoonShine reply/close/reopen, atomic/idempotent operations,
   pagination и safe errors. Laravel 260 tests / 2454 assertions, frontend
   70/70, Playwright 291/291, client/SSR build и formatter. Новая миграция
   применена в dev PostgreSQL. По запросу владельца этап принят и закрыт
   коммитом `1d83bd9`. Operational SSR и физическая
   keyboard/screen-reader matrix — шаг 15
13. [x] [Профиль](13-profile.md) — implementation и CSR/browser verification
   завершены 2026-10-20: owner-only names/email,
   renewed email verification, password и отзыв других сеансов, local-only
   light/dark, read-only Telegram status и активная profile navigation.
   Laravel 277 tests / 2628 assertions, frontend 70/70, Playwright 337/337,
   client/SSR build и formatter. По запросу владельца этап принят и закрыт
   коммитом `31a61fb`. Operational SSR,
   физическая keyboard/screen-reader matrix и production SMTP — шаг 15
14. [x] [Состояния, overlays и motion hardening](14-cross-cutting-states-motion.md)
   — implementation и CSR/browser verification завершены 2026-10-20;
   frontend 79/79, Playwright 399/399 (62 новых cross-cutting scenarios),
   Laravel 277 tests / 2628 assertions, client/SSR build и diff checks.
   По запросу владельца этап принят и закрывается этим коммитом;
   native device/AT и operational SSR — шаг 15
15. [ ] [Адаптивность и доступность](15-accessibility-responsive-verification.md)
16. [ ] [Финальная проверка](16-final-verification.md)

После каждого шага:

1. выполнить блок **Проверка**;
2. отметить выполненные микрозадачи;
3. обновить статус шага в этом файле;
4. выполнить указанный Commit.

Не переходить к следующему шагу, пока текущий не прошёл проверку.

Зависимость линейная: шаг `N` начинается только после успешной проверки,
фиксации результатов и Commit шага `N-1`. Если шаг упирается в `Needs review`,
работа останавливается на этом boundary без подстановки фиктивной логики.

## Общая матрица состояний

Каждый интерактивный компонент проверяется минимум в состояниях:

- default;
- hover только на устройствах с hover capability;
- keyboard focus-visible;
- active/selected/open;
- disabled;
- loading/pending;
- validation/service error;
- success/confirmation.

Pen явно задаёт default/hover/focus для primary button, active selector,
mobile menu, promo/more drawers и account/payment states. Для состояний, не
отрисованных в Pen, нельзя вводить новую визуальную систему: используется
семантическое browser/Vue behavior, оформленное подтверждёнными design tokens,
а результат помечается для визуального review.

## Общие команды проверки

```bash
./vendor/bin/sail npm run build
./vendor/bin/sail artisan route:list --except-vendor
./vendor/bin/sail composer test
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential <paths>
git diff --check
```

PHP-CS-Fixer соответствует текущему `AGENTS.md` и фактически установленному
toolchain. Pint не используется и не добавляется без отдельной задачи.

## Decision log и отложенные границы

### Решения шага 1 — 2026-10-13/14

- Первоначальная read-only проверка `dudeweb.pen` подтвердила historical
  baseline `142` top-level frames. Повторный аудит после новой редакции
  подтвердил current baseline `137` top-level frames, `10` reusable components,
  `19` variables, `0` structural problems и `5` намеренных decorative clipping
  diagnostics внутри Signal Orbit. Pen не изменялся агентом.
- Утверждён route/data/action contract из
  [01-source-and-contract-audit.md](01-source-and-contract-audit.md). Web и
  Telegram регистрации создают независимые local/Remnawave accounts; linking и
  destructive merge вынесены за рамки этого плана.
- Историческое решение о регистрации без verification отменено владельцем
  2026-10-19. Web-регистрация сразу создаёт и аутентифицирует email/password
  пользователя, а idempotent Remnawave provisioning выполняется только после
  подтверждения email с сохранённым non-PII key; numeric `remnawave_user_id` становится
  устойчивой связью. Ошибка remote не откатывает local account и отображается
  как retryable `service_error`, без stale local subscription truth.
- `Product` получает явный период `1/3/6/12` месяцев. Payment return открывает
  owned status page с polling каждые две секунды до 60 секунд; terminal truth
  приходит только из webhook-processed local payment, retry создаёт новый
  payment attempt.
- Реализуется полный local support domain: ticket/message persistence,
  пользовательские list/create/conversation pages, ownership policies и
  операторские reply/close/reopen actions в MoonShine.
- Web и Telegram referral links работают параллельно. Оба используют opaque
  public token и атрибутируют inviter через `remnawave_user_id`; первая валидная
  атрибуция побеждает. При будущем merge ownership/rewards переходят local
  survivor соответствующего surviving remote ID без повторного начисления.
- Responsive boundaries: mobile `<768`, tablet `768–1199`, desktop `>=1200`;
  public wide layout starts at `1600`; `2560 x 1440` теперь имеет собственные
  dark/light Pen references `j8pJq`/`eM8HW`.
  IBM Plex Sans/Mono self-hosted через одобренные npm font packages. Theme:
  только `light/dark`, pre-hydration bootstrap и `localStorage` без server
  preference; OS preference выбирает первый сохранённый режим только при
  пустом или legacy storage.
- Public brand — `dudeweb`. Утверждён logo direction `06 · Razor Loop`: icon
  для favicon, horizontal/stacked lockups по назначению. Новая редакция Pen
  отменяет scroll-driven sequence и делает Signal Orbit единственным Hero
  contract на всех reference viewport; последнее owner decision сохраняет
  статичную базовую geometry и добавляет pointer response без ambient motion.
- CTA ведут на `/register`, `/login`, `#pricing`. Terms/privacy routes и links
  отсутствуют до утверждённого content. По уточнению владельца 2026-10-17
  платформы на landing — пять статичных некликабельных карточек без app/download
  links, инструкций и server catalogue props. Backend-каталог общего content
  Remnawave subscription page предназначен для authenticated connection flow
  в личном кабинете (шаг 10); персональный `subscriptionUrl` доступен только
  его владельцу.
- Referral Terms — protected read-only page; проценты и reward matrix приходят
  из live server rules вместе с явной content version.
- Pen показывает в footer `Пользовательское соглашение` и `Политика
  конфиденциальности`, но не содержит их content pages или route contract.
  Ссылки остаются `Needs review` и не выводятся как неработающие placeholders.
- `U-17`, `U-20`, `U-21`, `U-23`, `U-24` остаются закрытыми ранее принятыми
  tooling/accessibility/data/directory решениями.

### Явно отложено

- `U-04`: Telegram linking/merge mutation UI не входит в этот план. До отдельного
  решения допустим только read-only connection status.
- `U-18`: E2E tooling согласован владельцем и установлен 2026-10-20:
  Playwright Test + Chromium в Sail. Automated a11y tooling остаётся отложенным;
  установка и smoke не закрывают acceptance matrix шагов 8/15.
- `U-22`: локальная operational SSR/hydration проверка production build пройдена
  2026-10-21 в Sail (40 browser cases, включая все page compositions).
  Production deployment/supervision остаются вне этой проверки; обычное
  окружение продолжает использовать CSR/Inertia без изменения `.env`.

## Ограничения плана

- Не изменять `.pen` и не импортировать в него результаты реализации.
- Не использовать placeholder API или фиктивные успешные ответы.
- Не добавлять зависимости без отдельного обоснования и согласования.
- Не менять Telegram, Remnawave, payment, promocode или referral бизнес-правила
  ради визуального соответствия.
- Не переходить к следующему task-файлу, пока текущий не проверен.
