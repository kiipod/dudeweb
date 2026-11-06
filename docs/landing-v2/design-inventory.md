# Landing V2 — Design Inventory

Дата живого чтения: **5 ноября 2026**. Этап: только
[01 — Pen Design Analysis](../../.agents/plans/landing-v2/01-pen-design-analysis.md),
в рамках [overview](../../.agents/plans/landing-v2/00-overview.md).

Источник: подключённый **Pen MCP**, активный документ
`/C:/Users/kiipod/.pencil/documents/d241f6ea-c3a7-4b71-9981-19aef7200bef/dudeweb.pen`.
Файл `.pen` через filesystem не читался и не изменялся. Использованы только
`get_app_state`, `Get`, `GetVariables`, `Print`, `TakeScreenshot` и чтение
документации MCP. Исторические аудиты не подменяют эти наблюдения.

Выбраны `frontend-design` (структура, типографика, визуальные contracts) и Pen
`pen-dev` (schema, read-only execute). Реализация Vue, Tailwind и PHP в scope
этого этапа не входит. Названия будущих компонентных границ ниже — карта
декомпозиции по макету, а не созданные компоненты или решение шага 02.

## 1. Pen Pages

Получен полный список **226 top-level узлов** документа: это экраны,
компоненты и вспомогательные boards, а не 226 маршрутов. По всему списку
найдены ровно **9 Landing V2 frames**: восемь адаптивов и один стенд состояний.
Других top-level V2-вариантов в текущем документе нет.

Полное название восьми экранов: `dudeweb — Landing V2 / Light · {ширина}`.
Название стенда: `dudeweb — Landing V2 / Light · Motion states`.

| ID | Вариант | Ширина × вычисленная высота, px | Узлов прочитано | Роль |
|---|---|---:|---:|---|
| `EEoTi` | Light · 360 | 360 × 5639.911 | 253 | Small mobile |
| `w2gR3o` | Light · 390 | 390 × 5642.778 | 253 | Mobile |
| `zZWPT` | Light · 430 | 430 × 5765.267 | 253 | Large mobile |
| `UqgaH` | Light · 768 | 768 × 5117.760 | 293 | Tablet |
| `m84VdT` | Light · 1024 | 1024 × 4599 | 290 | Tablet |
| `LNadH` | Light · 1440 | 1440 × 4160 | 287 | Desktop, первый экран 900px |
| `j7e7wh` | Light · 1920 | 1920 × 4732 | 287 | Desktop, первый экран 1080px |
| `KwQuD` | Light · 2560 | 2560 × 6027.5 | 539 | WQHD master, первый экран 1440px |
| `q35PVH` | Light · Motion states | 1600 × 10124 | 390 | Текущие визуальные и motion contracts |

Высоты получены из `ctx.bounds`, в корнях явно задана только ширина.
Обозначение `2560×1440` в стенде относится к первому viewport, а не к высоте
всего лендинга. Все экраны имеют `clip: true`, вертикальный layout и белый фон;
восемь адаптивов явно используют `theme.mode = light`. Отдельного V2 Dark нет.

Актуальность однозначна: `q35PVH` / `UPMoB` прямо называет эталоном **KwQuD**;
`XjXCl` фиксирует общий контент и порядок всех адаптивов. Context стенда
отменяет прежние Clerk grids, hero waves и letter-lift footer examples.
Старые `A/B/C/D/E/F`, UHD `j8pJq/eM8HW`, account boards, `H · Component States`,
`I · Mini Design System`, `fkFO6 · Advantages` не являются новыми Landing V2.
Упоминания старых источников в context отдельных V2-узлов не меняют master.

Стенд `q35PVH` прочитан полностью, включая все 12 разделов:

| ID | Раздел |
|---|---|
| `kNoOW` | Master and implementation status |
| `WkEIA` | Current visual language and responsive scale |
| `Vvmix` | Current header and menu states |
| `X41iV` | Button and link state styling |
| `m6JVjz` | Desktop benefit accordion |
| `EUniL` | Tablet benefit accordion |
| `iFKqa` | Framer mobile stacking |
| `wgSpy` | Synchronized brands, connections and waves |
| `nmCRU` | News presentation and link states |
| `C6Rzp` | Subscription period selection states |
| `wrNMh` | Footer wordmark interaction |
| `Rqi5w` | Reduced motion and verification checklist |

## 2. Section Inventory

Общий видимый порядок: **Header → Hero с шестью преимуществами → Platforms →
Connection / waves → News → Subscription / CTA → Footer**. Самостоятельной
секции `03` нет: преимущества включены в Hero. Нумерация `01, 02, 04…08`
сохранена из Pen, пропуск не является отсутствующей секцией.

| Pen section | Master ID | Состав и повторяемые части |
|---|---|---|
| 01 · Navigation | `P4tz1` | Razor Loop mark + dudeweb, три nav links, login, trial CTA; компактный hamburger-вариант |
| 02 · Hero + animated benefit accordion | `uBSEr` | Greeting с rule, двухстрочный title, copy + CTA, trial caption, шесть benefit faces и compact faces |
| 04 · Platforms | `JbOmk` | Пять равных logo cells; ниже access facts слева и platform story справа; тонкая табличная сетка |
| 05 · One connection | `k4oz2` | 23 бренда, соединения к dudeweb, исходящие волны, heading и copy справа; компактный stacked вариант |
| 06 · News | `iTg4q` | Heading с marker, «Все новости», три editorial cards: cover, category/date, headline |
| 07 · Subscription | `yRrOg` | Editorial intro, четыре supporting points 2×2, один тариф, четыре period tabs, summary, CTA, trial condition |
| 08 · Footer | `Hir0F` | Small brand, три группы ссылок, широкий outlined wordmark, description + copyright |

В деревьях V2 нет `reusable: true` и `ref`-инстансов. Повторение реализовано
обычными frames. Возможные границы переиспользования внутри V2: brand lockup,
primary/login actions, nav links, heading marker / eyebrow rule, benefit
face + compact face, platform cell, news card, period selector, footer group.
Это не основание менять существующие shared components без анализа влияния.

### 2.1. Тексты Header и Hero

Здесь и далее `↵` обозначает явный перевод строки в Pen; обычные переносы
при рендере зависят от ширины. Кавычки вокруг цитат не входят в UI-copy.

| Роль | Точный текст | Master source |
|---|---|---|
| Brand | dudeweb | `QbMKa` |
| Navigation | Преимущества; Устройства; Тарифы | `xo8y3`, `LJQDx`, `DDtcq` |
| Login | Войти | `TjSVS` |
| Header CTA | Попробовать бесплатно | `IXsol` |
| Greeting | Hey, Dude! | `rW0BH` |
| Headline line 1 | Любимые сервисы | `G8BcUg` |
| Headline line 2 | снова рядом. | `uux1m` |
| Description | dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. | `iOQ5T` |
| Hero CTA | Попробовать бесплатно | `M5Eph` |
| Trial caption | 3 дня бесплатно · До 5 устройств | `Ost0i` |

`Hey, Dude!` — приветствие, название сервиса остаётся `dudeweb`.

### 2.2. Шесть преимуществ

Источник актуальных full faces — `TW7Q6`, внутри master Hero.
Во всех восьми адаптивах заголовки и описания совпадают, в том числе
шестой заголовок **«Мы рядом»**.

| № / panel label | Face ID | Headline ID / точный текст | Description ID / точный текст |
|---|---|---|---|
| 01 / Старт | `RuFOA` | `W0WXap` / Подключился — и погнали | `BtR2g` / Никаких сложных настроек. Пара простых действий — и любимые сервисы снова под рукой. |
| 02 / Скорость | `LEtj1` | `vaUvq` / Скорость без компромиссов | `t57o0p` / Смотри видео, созванивайся, работай и переключайся между задачами с комфортом. |
| 03 / Устройства | `fd5mP` | `DIDg8` / Один доступ. До 5 устройств | `ZhaW4` / Пользуйся сервисом на смартфоне, ноутбуке или планшете и делись подпиской с близкими. |
| 04 / Защита | `PD4oS` | `P1PBn` / Твоё соединение под защитой | `qegrx` / Защищённое подключение для работы, общения и повседневных задач. |
| 05 / Свобода | `lb5fj` | `F6OtKK` / Больше свободы каждый день | `lIuwO` / Любимые инструменты для творчества, развлечений и общения — в одном подключении. |
| 06 / Поддержка | `ZmtaD` | `CiJjI` / Мы рядом | `Xmr5E` / Возникли вопросы? Поможем разобраться с подключением и использованием сервиса. |

В master также лежат отключённые прежние rows `Nk0yj`, `qBR6n`, включая
«Мы рядом, если что» (`slsJf`). Они не являются видимым bento или альтернативой
актуальному аккордеону. В compact atlas `JQIeV` сохранены номера, panel labels,
иконки и полные заголовки, без уменьшенных иллюстраций.

### 2.3. Platforms и Connection

| Роль | Точный текст | Master source |
|---|---|---|
| Platforms | Windows; macOS; Linux; Android; iOS | `gVBJ4`, `Vr7WB`, `p6Pfw`, `P5J57A`, `Qu1Ou` |
| Fact 1 | До 5 / устройств одновременно | `S6C36`, `kV35e` |
| Fact 2 | Один доступ / для привычных платформ | `QqWl5`, `IfqTL` |
| Supporting copy | Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках. | `ywitn` |
| Platforms heading | Где ты — там и dudeweb | `KYXW1` |
| Platforms description | Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой. | `RI4bS` |
| Connection heading | Одно подключение.↵Больше свободы. | `cPAFO` |
| Connection description | Любимые инструменты для творчества, развлечений и общения — в одном подключении. | `A4iG4E` |
| Signal caption | dudeweb | `lo8jk` |

На 360–1024 Platforms heading содержит явный перенос:
`Где ты — там↵и dudeweb`; содержание не меняется. Таблица платформ не
показывает download buttons или раскрывающиеся инструкции.

### 2.4. Subscription и Footer

| Роль | Точный текст | Master source |
|---|---|---|
| Eyebrow | ПОДПИСКА DUDEWEB | `A6B1oJ` |
| Headline | Ну что, / погнали? | `Y5Ilcd`, `NlgaC` — два text nodes |
| Description | Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами. | `m1DD6` |
| Supporting point 1 | Безлимитный трафик / Любимые сервисы для работы, развлечений и общения. | `nNFC2`, `VuNfd` |
| Supporting point 2 | До 5 устройств / Смартфон, ноутбук и планшет — в одном доступе. | `MVRvz`, `u1lVeR` |
| Supporting point 3 | Все популярные платформы / Windows, macOS, Linux, Android и iOS. | `JmGdV`, `dkopY` |
| Supporting point 4 | Защищённое подключение / Для работы, общения и повседневных задач. | `UI3oo`, `GtrLP` |
| Period tabs | 1 месяц; 3 месяца; 6 месяцев; 12 месяцев | `L4ZgB`, `LhqPN`, `x56qPd`, `rIBhZ` |
| Plan | Безлимитный | `S8SvA` |
| Monthly price / unit | — ₽ / / мес. | `vYKd6`, `qGhE6` |
| Summary | Период / 1 месяц; Итого к оплате / — ₽ | `iqvzW`, `X4iGV`, `NcKBW`, `dIMqd` |
| CTA | Выбрать подписку | `sSI0e` |
| Condition | 3 дня бесплатно для новых пользователей | `N7ZEU` |
| Footer brand | dudeweb | `WaYl3`, outline `A63ZRf` |
| Group 1 | Навигация / Преимущества; Устройства; Тарифы | `SqmEa` |
| Group 2 | Аккаунт / Войти; Регистрация | `p07mA` |
| Group 3 | Информация / Поддержка; Пользовательское соглашение; Политика конфиденциальности | `P2wq2a` |
| Footer description | Простая подписка, быстрая настройка и поддержка без долгого ожидания. | `X2frg` |
| Copyright placeholder | © 20— dudeweb | `sBdS5` |

В UI нет форм ввода, newsletter, FAQ, testimonials, дополнительных тарифов
или отдельной CTA-секции после подписки. Селектор подписки — единственный
выбор значений на странице, без полей платёжной формы.

## 3. Design Tokens

### 3.1. Colors

`GetVariables()` возвращает 30 document variables и темы `mode: dark/light`.
Из них V2 использует `$font-ui`, `$font-mono`, `$accent`, `$sync-accent-text`.
Отдельного полного V2 token namespace в Pen нет; большинство значений literal.
Таблица ниже фиксирует фактические роли, не создаёт CSS tokens.

| Роль | Значение | Источник / уточнение |
|---|---|---|
| Page background | `#FFFFFF` | Все секции всех V2 страниц, `slXGq` |
| Primary text | `#202126` | Стенд `o6CBG`, Hero/CTA/brand |
| Secondary text | `#697386` | Стенд `cvICF`, platform explanations |
| Border | `#E3E6EE` | Стенд `Lo9Xd`, platform grid |
| CTA / brand | `#8E9BFF` | `$accent`, `KED4n` |
| Hero accent headline | `#7480D5` | `uux1m`, `hKT49` |
| Link hover / focus | `#4F55D8` | `$sync-accent-text` light, `lP0QU`, `m0VxvA` |
| Primary hover | `#A4AEFF` | `kAOjn` |
| Primary pressed | `#7D89EF` | `kjYAg` |
| Login / benefit surface | `#F8F9FC` | `C7WOa`, `RuFOA` |
| Login hover | `#EEF1F8` | `KxZzQ` |
| Login / price border | `#E1E5ED` | `C7WOa`, `v2nwK` |
| Section separator | `#E8E9ED` | Header bottom, subscription/footer top |
| Hero field border | `#DEE2ED` | `lw9Uf` |
| Hero copy | `#686B75` | `iOQ5T` |
| Greeting | `#7B83A2` | `rW0BH` |
| Small rule | `#BDC4D4` | `Q5G3A7` |
| Section titles | `#242A34` | `kg5b6`, `cPAFO` |
| Platform title | `#262B34` | `KYXW1` |
| News title | `#303745` | `O5pBAW` |
| News category surface / text | `#F1F3F8` / `#657086` | `x5vwJL`, `U6a3LD` |
| News date | `#6D778B` | `rhsx1` |
| News cover border | `#E5E9F1` | `yRmbs` |
| Price panel | `#FDFDFF` | `Nb1g0` |
| Quiet divider | `#E7EAF1` | Price action / footer legal |
| Razor Loop small accent | `#E87968` | `rYDPv`, existing brand geometry |

Основные цвета стенда не заменяют более точные значения конкретных nodes.
Тёмная тема старого лендинга и account palette не являются V2 variants.
Стенд задаёт единый белый фон, без чередования цветных секций. Яркие editorial
изображения относятся к новостям; benefit illustrations — спокойные micro-UI.

### 3.2. Container widths, spacing и grid

| Width | Content width | Side padding | Header height | Hero field | Full face / compact width |
|---:|---:|---:|---:|---|---|
| 360 | 320 | 20 | 72 | Stack 320×620 | 320×500 / — |
| 390 | 350 | 20 | 76 | Stack 350×620 | 350×500 / — |
| 430 | 390 | 20 | 76 | Stack 390×620 | 390×500 / — |
| 768 | 688 | 40 | 80 | Accordion 688×520 | 335 / 71 |
| 1024 | 928 | 48 | 88 | Accordion 928×540 | 452 / 95 |
| 1440 | 1280 | 80 | 88 | Accordion 1280×438 | 624 / 131 |
| 1920 | 1600 | 160 | 96 | Accordion 1600×531 | 779 / 164 |
| 2560 | 2000 | 280 | 112 | Accordion 2000×797 | 974 / 205 |

Face / compact widths — значения uniforms текстур, округлённые в Pen;
runtime proportion в стенде — **4.75 : 1 : 1 : 1 : 1 : 1**.
Не выводить из округлений дополнительный обязательный gap. Преимущества
представлены одним field, а не шестью равными колонками.

Общая grid: единые края контента, пять равных platform columns; далее две
информационные области. News — три columns на 1024+, editorial list на 768,
одна колонка на mobile. Subscription — две равные колонки на 1440+ с gap
64 / 96 / 144px соответственно; внутри points — 2×2. На 360–1024 intro и
selector идут вертикально. Footer — три link groups; на mobile они stacked.

Типичные внутренние интервалы: 8/12/16px для labels и copy, 20/24/28/32px
для controls/cards, 36px между subscription points в master. Это наблюдаемая
шкала, не объявленные числовые variables V2. Точные section paddings по всем
экранам приведены в §6.

Master: Hero intro gap 12px, title/copy row gap 96px; headline column 1264px,
support column 640px. Hero field отстоит от intro на 64px. Full face padding
`[24,32,32,32]`, gap 24px; heading/description gap 12px; illustration
910×522 внутри 974×797 face. Compact atlas cell 205×797: padding
`[24,18,32,18]`, icon/title gap 28px. Не растягивать текст вместе с texture.

### 3.3. Radius, strokes, shadows

| Элемент | Наблюдаемое значение |
|---|---|
| Master Header login / CTA | 13px; heights 58px |
| Header 1440/1920, tablet | 12px; mobile login / hamburger 10px |
| Hero CTA | 12px в эталоне по стенду `k0Xc4T` |
| Accordion field / platform table / price panel | 4px |
| Subscription CTA | 8px |
| «Все новости» | 4px |
| News covers | 12px в master |
| News category tag | 3px; padding 6×10px в master |
| Micro-UI panels | 8px, маленькие badges 5–7px |
| Standard fine stroke | 1px там, где явно задан; отдельные стороны через strokeWidth |
| Active period underline | 2px `#8E9BFF` |
| Focus | 2px `#4F55D8`, offset 3px по стенду |
| Connection origin shadow | outer, x0/y4, blur18, `#4F5C8A0A` (`WmNqt`) |
| Six micro-UI shadows | outer, x0/y4, blur16, `#2632530A` |
| Fingerprint medallion shadow | outer, x0/y5, blur16, `#29365212` (`GlfH2`) |

Единой обязательной тени для секций/новостей нет. Не превращать эти локальные
shadows в глобальный card effect.

## 4. Assets

Пути в этом разделе **относительны Pen-документу на стороне Pen**. Они не
подтверждают наличие файлов в Laravel `public/` или доступность из браузера.
Экспорт, перенос и оптимизация в рамках шага 01 не выполнялись.

### 4.1. Brand и icons

Razor Loop — существующие vector paths `gvtXH` + `rYDPv` в `vdwZm`;
геометрию брать из Pen, не перерисовывать по впечатлению. Small wordmarks —
IBM Plex Sans; footer wordmark `A63ZRf` рисуется shader-effect поверх text
`MP0tZ`, поэтому его raw `fill: #8E9BFF` не означает залитые буквы в финале.

Platform icons: `phosphor` — `windows-logo`, `apple-logo`, `linux-logo`,
`android-logo`; apple-logo используется и для iOS. Compact benefits:
`lucide` — `plug-zap`, `zap`, `monitor-smartphone`, `shield-check`,
`layout-grid`, `headphones`. Controls: `lucide:menu`, `lucide:x`,
`lucide:arrow-right`. В micro-UI также `check`, `smartphone`, `video`, `phone`,
`briefcase-business`, `monitor`, `laptop`, `tablet`, `key-round`,
`lock-keyhole`, `phosphor:fingerprint`. Наличие этих библиотек в Pen не требует
установки новых JS-пакетов.

23 source logos в `SkTTd` (hidden editable atlas), каждый
`assets/hero/brands/{name}-light.png`, mode `contain`:

```text
instagram, facebook, threads, x, linkedin, youtube, telegram, discord,
patreon, onlyfans, soundcloud, spotify, openai, anthropic, googlegemini,
steam, tiktok, signal, airbnb, bookingdotcom, ubisoft, ea, netflix
```

В поле они объединены в `assets/hero/synchronized-brand-field/SkTTd.png`.
Часть этих же логотипов используется в micro-UI «Свобода» (12 endpoints),
это не дополнительные сервисы или отдельные интерактивные links.

### 4.2. Benefit artwork и shader sources

| Benefit | Editable micro-UI source | Актуальная illustration texture | Master face |
|---|---|---|---|
| Старт | `ZRsOc` / Connection control | `assets/hero/wqhd-source-art/ZRsOc.png` | `RuFOA` |
| Скорость | `OAPdq` / Activity stream | `assets/hero/wqhd-source-art/OAPdq.png` | `LEtj1` |
| Устройства | `jjhvO` / Device list | `assets/hero/wqhd-source-art/jjhvO.png` | `fd5mP` |
| Защита | `h1J7X` / Protection panel | `assets/hero/wqhd-source-art/h1J7X.png` | `PD4oS` |
| Свобода | `iFqY4` / Service graph | `assets/hero/wqhd-source-art/iFqY4.png` | `lb5fj` |
| Поддержка | `BU7Kz` / Support conversation | `assets/hero/wqhd-source-art/BU7Kz.png` | `ZmtaD` |

Все шесть illustration textures — `contain`. Editable originals хранятся в
отключённом `hSSKZ`. Тексты внутри illustrations: «dudeweb», «Подключение»,
«Видео», «Звонки», «Работа», «Твои устройства», названия пяти платформ,
«Защищённое подключение», «Поддержка dudeweb», «Возникли вопросы?»,
«Поможем разобраться.». Это содержимое illustration, не реальные toggle,
device list, chat или форма поддержки.

Активные full-face textures master:
`assets/hero/original-headings-2560/{RuFOA,LEtj1,fd5mP,PD4oS,lb5fj,ZmtaD}.png`.
Compact texture: `assets/hero/original-headings-compact-2560/JQIeV.png`.
Responsive texture references зафиксированы в §6 по каждому shader field.

| Shader URL | Роль | Статус |
|---|---|---|
| `assets/hero/dudeweb-rabbit-accordion.glsl` | Desktop/tablet expanding benefits | Актуальный live prototype |
| `assets/hero/dudeweb-mobile-stacking.glsl` | Mobile stack | Актуальная автодемонстрация целевого scroll UX |
| `assets/hero/dudeweb-platform-signal.glsl` | Синхронные brands, линии и waves | Актуальный live prototype |
| `assets/hero/dudeweb-graphite-wordmark.glsl` | Outline и pointer echoes Footer | Актуальный effect |
| `assets/hero/dudeweb-artwork-ambient.glsl` | Старые illustrations | Только в отключённых старых benefit rows master |

В отключённых старых rows остались `images/generated-4.png`,
`generated-3.png`, `generated.png`, `generated-5.png`, `generated-1.png`,
`generated-2.png`. Не выбирать их вместо текущих micro-UI illustrations.

### 4.3. News covers

| Source ID | URL | Сюжет |
|---|---|---|
| `yRmbs` | `images/generated-6.png` | Amsterdam houses, canal, location pin |
| `OULo2` | `images/generated-8.png` | Server hardware, maintenance tools |
| `pAjWc` | `images/generated-7.png` | Connection restored, success symbol |

Все mode `cover`, в master frame примерно 629.333×600px. Это готовые
изображения из источника; создавать новые illustrations на этом шаге не нужно.

## 5. Typography

`$font-ui = IBM Plex Sans`; `$font-mono = IBM Plex Mono`.
Sans — headlines, body, actions, navigation. Mono — greeting, small eyebrow,
panel numbers и subscription tabs. `normal` трактуется как обычное начертание;
в source явно встречаются веса **500, 600, 650, 700**, включая Hero CTA 650 и
Header CTA 700. Наличие нужных webfont-файлов ещё не проверялось.

| Width | Hero / body | Full benefit title / body | Platforms heading | Connection heading | News heading / article title | Final heading |
|---:|---|---|---:|---:|---|---:|
| 360 | 38 / 16 | 24 / 15 | 30 | 30 | 24 / 22 | 48 |
| 390 | 40 / 16 | 24 / 15 | 30 | 32 | 26 / 22 | 48 |
| 430 | 44 / 16 | 24 / 15 | 30 | 34 | 26 / 22 | 48 |
| 768 | 52 / 18 | 24 / 16 | 36 | 40 | 36 / 24 | 56 |
| 1024 | 60 / 18 | 26 / 17 | 36 | 44 | 36 / 24 | 56 |
| 1440 | 72 / 18 | 24 / 17 | 44 | 44 | 44 / 24 | 60 |
| 1920 | 92 / 22 | 28 / 19 | 52 | 52 | 52 / 28 | 72 |
| 2560 | 108 / 24 | 32 / 21 | 60 | 64 | 64 / 32 | 80 |

Размеры в px. Все крупные headings и benefit titles — 500, body — normal.
На 1440 benefit title меньше, чем на 1024: это фактические значения source,
а не опечатка таблицы.

| Роль | Line height multiplier | Letter spacing |
|---|---:|---|
| Hero title | 1.04 | mobile −1.5px; tablet −2.2px; desktop −3.2px |
| Hero body | 1.5 | Явный tracking не задан |
| Greeting | 1.3 | master 1.2px, font 22px |
| Full benefit title | master 1.15; responsive 1.18 | responsive −0.45px; master не задан |
| Benefit body | 1.5 | Не задан |
| Platforms / Connection heading | 1.08 | Platforms master −1.5px, прочие −1px; Connection desktop −1.7px, compact −1.2px |
| News section heading | 1.1 | master −1.8px |
| News article title | 1.25 | −0.4px |
| Subscription heading | 1.06 | −2.4px |
| Subscription description | 1.55 | Не задан |
| Subscription point title / body | 1.3 / 1.5 | Не задан |
| Footer link / description | 1.5 | Не задан |
| Trial/legal | 1.45 | Не задан |

Pen `lineHeight` — множитель размера шрифта, не px. Если property отсутствует,
используется встроенный line height шрифта; не выдавать его за заданные 1.5.

Master small roles: navigation 20px normal, logo 26px/600 tracking −0.7,
login 19px/600, Header CTA 19px/700, Hero CTA 18px/650, trial 18px normal;
panel numbers 16px Mono, labels 18px/500. News category/date 16px,
subscription tabs 18px Mono, plan 22px, price 52px/500 with lineHeight 1 and
tracking −2px, unit 20px, summary labels 18px and values 20px/500.
Footer group headings 12px/500, links 18px, description 17px, copyright 14px.

Footer large wordmark uses native font sizing to fit menu width (not stretched
bitmap): font sizes approximately 75.474 / 82.639 / 92.192 / 163.367 / 220.689 /
304.760 / 381.189 / 476.725px at the eight widths above; Sans 600,
lineHeight 1, negative tracking (master −8.548px). Final appearance is outline.

## 6. Responsive Variants

Frame widths are concrete **reference viewports**, not declared CSS media
breakpoints. `GetVariables()` has no V2 breakpoint variables. Observed changes:
stack on 360–430, accordion from the 768 reference; compact header through
1024, full header at 1440; news list at 768, three columns from 1024.
Точные пороги между reference widths и поведение ниже 360 требуют отдельного
решения при реализации, без объявления этих предположений фактом Pen.

На 1440 Header + Hero = 88 + 812 = 900px; на 1920 — 96 + 984 = 1080px;
на 2560 — 112 + 1328 = 1440px. Mobile/tablet используют естественный вертикальный
поток, не обязаны помещаться в первый viewport.

Header 360–430: brand, «Войти», hamburger 44×44; Header CTA отключена,
«Попробовать бесплатно» доступна в Hero и open-menu state. Header 768–1024:
brand, «Войти», hamburger и CTA; полные navigation links отключены.
На 1440–2560 видны все три navigation links, login и CTA; hamburger отключён.
На tablet высота controls 44px, на desktop 1440/1920/2560 — 48/54/58px.

Mobile: title, copy, CTA, trial и stack идут сверху вниз. Пять platform cells
остаются в одном ряду с compact icons/labels, нижняя information area stacked.
Connection copy вынесена над графикой. Subscription vertically stacked;
supporting points сохраняют пары. Footer link groups идут вертикально,
legal strip stacked. Outline статичен.

768: тот же шестикарточный аккордеон, не полоса tabs; Platforms нижняя area
stacked; news — три горизонтальные карточки в вертикальном списке: cover
216×216 слева, copy справа (448px), gap 24px. Subscription stacked. Footer
три link groups в ряд. На 1024 Platforms нижняя area уже горизонтальна, news
три колонки; Connection copy всё ещё над графикой, subscription stacked.

1440–2560: Hero intro и CTA в двух колонках, horizontal benefit accordion;
Connection title/copy внутри правой части поля. Subscription две колонки;
Footer links горизонтальны, wordmark по всей ширине меню, description слева
и copyright справа.

### 6.1. IDs секций каждого адаптива

Порядок колонок соответствует семи видимым секциям из §2. Отключённые asset
sources не входят в visible section flow.

| Width | Header | Hero | Platforms | Connection | News | Subscription | Footer |
|---:|---|---|---|---|---|---|---|
| 360 | `xVMUB` | `w3Ep7t` | `KFFoB` | `d9wgOc` | `YqL4d` | `zuuqg` | `oOCeo` |
| 390 | `x49MT5` | `J3MWzu` | `sET7h` | `Ben8n` | `C6g9M` | `Ajwz3` | `j5XVj7` |
| 430 | `oV5dz` | `hYjoB` | `fzLQE` | `DRcDW` | `O1qrS` | `tFhlG` | `r5eqMP` |
| 768 | `cj5PZ` | `E50jAU` | `Z6PyI` | `F4DCLq` | `qrvHT` | `mfShe` | `o0eQV0` |
| 1024 | `oaNIL` | `zt5zH` | `hQc5y` | `v0TkK` | `X82gR` | `rVUaC` | `FOY8e` |
| 1440 | `mE6z3` | `Fa2Bi` | `Jo3X3` | `rzvHm` | `yND8U` | `U97Nl` | `WNq1A` |
| 1920 | `tolCA` | `PKnR6` | `A2Ou9` | `nd9Zu` | `metHE` | `pnAQm` | `DiZKv` |
| 2560 | `P4tz1` | `uBSEr` | `JbOmk` | `k4oz2` | `iTg4q` | `yRrOg` | `Hir0F` |

### 6.2. Section spacing

В ячейках — **top / bottom padding**, px; боковые поля из §3.2.
Header: vertical padding 0, высота задана отдельно.

| Width | Hero | Platforms | Connection | News | Subscription | Footer |
|---:|---|---|---|---|---|---|
| 360/390/430 | 32 / 56 | 32 / 48 | 56 / 64 | 40 / 56 | 56 / 56 | 48 / 24 |
| 768/1024 | 48 / 72 | 40 / 56 | 72 / 80 | 48 / 72 | 80 / 80 | 64 / 40 |
| 1440 | 60 / 48 | 40 / 56 | 72 / 80 | 48 / 72 | 80 / 80 | 64 / 40 |
| 1920 | 72 / 56 | 40 / 56 | 72 / 80 | 48 / 72 | 80 / 80 | 64 / 40 |
| 2560 | 84 / 68 | 48 / 56 | 104 / 120 | 64 / 96 | 120 / 120 | 80 / 56 |

Hero gap: 32px на mobile/tablet, 40 / 48 / 64px на desktop.
Connection compact gap 28px. Subscription stacked gap 40px.
Footer gap 32px mobile, 40px tablet/1440/1920, 56px master.

### 6.3. Benefit fields и texture references

Префикс URL в таблице — `assets/hero/`; фигурные списки перечислены строго
в порядке benefit 1…5, шестая texture указана отдельно. Это ссылки из
актуальных shader uniforms, не filesystem glob и не команда экспорта.

| Width / field ID | Faces 1…5 prefix + names `.png` | Face 6 | Compact texture |
|---|---|---|---|
| 360 / `x9mW6` | `responsive-360-faces/{v9jf7r,f6aOR1,kSNZq,N0tt8,AXpah}` | `original-headings-360/ytzdA.png` | — |
| 390 / `lDzD7` | `responsive-390-faces/{I6U9dy,V3hi7,vBR2o,dWhi9,Rz4dr}` | `original-headings-390/TAI7T.png` | — |
| 430 / `eHuF5` | `responsive-430-faces/{QMkfh,Xt8Iq,UWDRP,mnkZL,nxWH8}` | `original-headings-430/V4msR.png` | — |
| 768 / `rUhbA` | `responsive-768-accordion-faces/{E5Rcn0,hBpDX,lZM18,ThAyx,c5jaTI}` | `original-headings-768/R0nnZ.png` | `original-headings-compact-768/oPQI9.png` |
| 1024 / `L3MRn` | `responsive-1024-accordion-faces/{n1pDtb,uAWh1,dwg2O,V0Jcc,lziHb}` | `original-headings-1024/HMjZW.png` | `original-headings-compact-1024/lfcYI.png` |
| 1440 / `vvxXs` | `responsive-1440-faces/{W7j82j,wF42x,Q2tLYn,qRp5V,D6yHwn}` | `original-headings-1440/Zu3N9.png` | `original-headings-compact-1440/clIrX.png` |
| 1920 / `EdB33` | `responsive-1920-faces/{isDCX,O6ClaW,JCqdz,s1NnpX,M1pdw}` | `original-headings-1920/mNcvm.png` | `original-headings-compact-1920/w5vI1r.png` |
| 2560 / `lw9Uf` | `original-headings-2560/{RuFOA,LEtj1,fd5mP,PD4oS,lb5fj}` | `original-headings-2560/ZmtaD.png` | `original-headings-compact-2560/JQIeV.png` |

Hidden reduced-motion flow: `v13op1` (360), `F36dq` (390), `vDiOo` (430);
семантическое имя во всех трёх —
`Mobile benefits · Reduced-motion full reading flow`. Содержит шесть frames
с image fills 500px высотой и gap 16px, суммарно 3080px. Это чтение всех
карточек без анимации в Pen; для сайта нужно доступное текстовое представление,
а не только картинка с текстом.

## 7. Interactions

Статусы из `q35PVH`: **live canvas** — эффект реально представлен shader в
документе; **design states** — варианты нарисованы; **unbound** — клики,
keyboard, focus trap, scroll и автоматическое OS preference ещё не связаны.
Screenshots подтверждают визуальную композицию в момент снимка, не полный
цикл анимации или browser interaction acceptance.

| Concern | Наличие / точный contract | Источник / статус |
|---|---|---|
| Hover CTA | Lavender `#8E9BFF` → `#A4AEFF`; без изменения размеров | `X41iV`, design states |
| Pressed CTA | `#7D89EF` | `kjYAg`, design state |
| Focus CTA/link | 2px `#4F55D8`, offset 3px; переход 160–180ms; ссылка не зависит только от цвета | `l0Bu7`, design specification |
| Login hover | `#F8F9FC` → `#EEF1F8`, fine border | `vL2ko`, `KxZzQ`, design states |
| Nav hover/active | Text `#4F55D8` | `fgSXP`; назначения ссылок не подключены |
| Dropdown | Отдельный dropdown в V2 не найден | Не добавлять |
| Mobile menu | Open state 390×720, white panel, три links, нижний full-width trial CTA, close icon | `WdCEY`, design state |
| Menu transition | Open 280ms, opacity 0→1, links offset 8→0px; close 200ms; stagger до 35ms; без page dimming | `xx0I9`, implementation spec |
| Menu keyboard | Visible focus 2px, логичный Tab; focus trap внутри панели, возврат на trigger при закрытии | `xGGdU`, unbound |
| Desktop/tablet benefits | Последовательный autoplay шести карточек; 42s цикл, 7s/карточка = 6.45s hold + 550ms transition; ratio 4.75/1 | `w90tML`, `fDcJ7`, live prototype |
| Manual benefit controls | Click, hover-pause, keyboard selection, pause button пока не подключены; точный вид/правила ручного управления не показаны полностью | `YBTZ2`, unbound |
| Benefit static frame | `u_static=1`, `u_active=0…5`; показываются состояния 01 и 05 | `MEUJI`, `F0wnzJ`, design keyframes |
| Mobile stack | Целевой UX зависит от обычного scroll, без scroll-jacking; сейчас time demo | `Oq43V`, unbound scroll |
| Other scroll reveals | Не специфицированы | Не придумывать section entrance/parallax |
| Brands / lines / waves | 23 пары logo + line синхронны; независимые периоды 7–13s, fade-in ≥1.1s, hold/fade-out/hidden; pulses к dudeweb, waves наружу | `ZARTD`, `xOc4I`, live prototype |
| News hover/focus | Underline headline + arrow reveal 160ms, без resize и обязательного cover scale; focus 2px | `VsWul`, design spec, links unbound |
| Subscription selection | 1/3/6/12 месяцев, один active underline; line 160ms, amount crossfade 180ms, стабильная высота | `v2nwK`, `Pf0HH`, design states |
| Subscription CTA | «Выбрать подписку», реальный billing event отсутствует | `sCAiW`, unbound |
| Hero/Header trial CTA | «Попробовать бесплатно», отдельное действие от покупки | `sCAiW`, unbound |
| Footer pointer | Local glow и три lavender echoes вокруг pointer, область около 260px; буквы без translate/scale, внутренние области прозрачны | `eiOPu`, live effect |
| Footer touch | Static outline на 360–1024; desktop preview использует настоящий pointer | `RbeLk` |
| Forms | Не предусмотрены; иллюстрации не функциональные формы | Прочитаны все V2 trees |

Mobile stack geometry: face height 500px, canvas height 620px, следующие cards
поднимаются снизу, top edges offset 14px/step; предыдущие уменьшаются на 3.5%
за шаг до 82.5%. Copy над illustration, без горизонтального overflow.
Canvas auto demo — 70s forward/back cycle, 7s/step, 5.6s hold + 1.4s movement.
Целевой website progress **0…5 от scroll**, не от таймера. Остановленные кадры:
`u_auto=0`, `u_static=1`, `u_progress=0…5`; live demo `u_auto=1`.
Механика длительности scroll track / sticky bounds в источнике не определена.

Footer softness создаётся spatial mask, а не spring/инерцией; выдуманного
возврата 600ms нет. `u_demo=1` предназначен для остановленного hover sample,
`u_static=1` — без pointer effect. Master `u_radius=1.8`, desktop 1440/1920
`1.3`, compact `1/1.3`; это shader units, не CSS px.

### 7.1. Reduced motion

| Concern | Source contract |
|---|---|
| Desktop/tablet benefits | Остановить autoplay (`u_static=1`); доступные manual controls нужны для сайта |
| Mobile benefits | Выключить animated stack, показать шесть cards обычным вертикальным потоком |
| Brands/lines | Все 23 пары видимы постоянно, pulses/waves заморожены |
| Footer | Статичный outline, без cursor echoes |
| Buttons/menu/news | Без transforms, blur, задержек появления; видимый focus обязателен, hover на touch не требуется |

`MZ7HT` прямо предупреждает: canvas сам не читает `prefers-reduced-motion`.
Адаптация к ОС, реальные клики, keyboard и оплата остаются будущей реализацией.

## 8. News Block

**Три статические frontend-заглушки**, одинаковое содержание во всех восьми
размерах. Section title «Новости сервиса»; CTA «Все новости» с arrow-right.
Порядок карточек соответствует Pen, не пересортирован по датам:

| № / master ID | Категория | Заголовок (`↵` — явный перенос) | Дата | Cover |
|---|---|---|---|---|
| 1 / `dXfiR` | Локации | Новая локация —↵Нидерланды | 4 ноября 2026 | `images/generated-6.png` |
| 2 / `YkFUs` | Обслуживание | Техническое обслуживание↵серверов | 2 ноября 2026 | `images/generated-8.png` |
| 3 / `NQIAl` | Статус | Сервис снова↵работает | 3 ноября 2026 | `images/generated-7.png` |

Структура: **cover → category tag + publication date → headline**. Описаний,
excerpts, авторов и отдельных «Читать далее» в деревьях нет. Действие карточки
обозначено spec hover/focus и упоминанием перехода к статье, но `href` и article
pages не предоставлены. «Все новости» тоже без URL и подключённого действия.
Автопрокрутки, пульсации cover и анимации дат нет (`vJD7f`).

| Width | Layout | Cover frame | Между cards |
|---:|---|---|---:|
| 360 | Одна вертикальная колонка | 320×313.6 | 32 |
| 390 | Одна вертикальная колонка | 350×343 | 32 |
| 430 | Одна вертикальная колонка | 390×382.2 | 32 |
| 768 | Вертикальный список, cover слева / copy справа | 216×216 | 24 |
| 1024 | Три равные колонки | 293.333×280 | 24 |
| 1440 | Три равные колонки | 410.667×390 | 24 |
| 1920 | Три равные колонки | 517.333×496 | 24 |
| 2560 | Три равные колонки | 629.333×600 | 32 |

Mobile card gap cover/metadata/title 16px, master 24px. В master news cards
row padding `[32,24,48,24]`, heading row padding 32px. В остальных reference
frames внутренние horizontal paddings news row сняты: content edges общие.
В source `xSg7D` есть цвет stroke, но не задана явная `strokeWidth`; current
state board требует заголовок без внешней рамки. Не добавлять замкнутую рамку
по одному наличию stroke color.

Видимые даты и annotations (`T3Ceju`, context секции) явно 2026. При этом
metadata всех news articles во всех адаптивах всё ещё
`{type: editorial-draft, status: draft, publicationDate: null}`. Слово
«Черновик» в UI не используется. Это расхождение источника зарегистрировано
в §9, а не интерпретировано как требование скрыть даты.

По overview данные должны храниться локально во frontend. Для блока нельзя
создавать DB tables, migrations, Eloquent models, repositories, API,
admin CRUD, CMS, scheduler или внешние news feeds. На шаге 01 данные и код
ещё не создаются.

## 9. Open Questions

Нет неоднозначности выбора актуального V2 master. Ниже — недостающие contracts
и локальные расхождения source; они фиксируются для следующих этапов,
без расширения текущей задачи и без изменения Pen.

| ID | Вопрос / расхождение | Что подтверждено сейчас |
|---|---|---|
| V2-Q01 | Куда ведут trial CTA, brand, login/register/support/legal links; как вести себя для authenticated user? | Labels известны, `href` в прочитанных V2 nodes отсутствует. Сопоставить с существующими маршрутами на следующем архитектурном этапе |
| V2-Q02 | Что делают карточки новостей и «Все новости» при статических заглушках? | Есть hover/focus spec, article/list URLs и article bodies не определены; backend создавать запрещено |
| V2-Q03 | Какие утверждённые цены и источник billing для периодов? | Один «Безлимитный», 1/3/6/12, `approvedPrice: null`, «— ₽». Не выдумывать цены, скидки и тарифы |
| V2-Q04 | Точные CSS breakpoints, поведение между reference widths и ниже 360? | Есть восемь canvas widths, нет breakpoint variables. Не считать widths готовым media-query contract |
| V2-Q05 | Manual accordion controls: вид, keyboard keys, pause/resume rules? | Стенд требует доступного ручного выбора и паузы; конкретные bindings не подключены. На tablet — тот же accordion |
| V2-Q06 | Какова длина mobile scroll track и точная sticky-механика? | Progress 0…5 от обычной прокрутки, geometry и keyframes заданы; реальный scroll не подключён |
| V2-Q07 | Подтвердить news metadata после visible dates | Во всех news cards остались `draft/null`, при этом visible copy и current board задают 2026 dates; в UI нет «Черновик» |
| V2-Q08 | Исправить ли stale source annotations при будущем уточнении макета? | Field metadata говорит о пяти platform traces, current board и source atlas — о 23 service-logo pairs. `lDzD7` context описывает WQHD accordion, фактические uniforms — mobile stack. Текущие properties и актуальный state board дают более точную карту |
| V2-Q09 | Совпадает ли шестая texture reduced-motion mobile с актуальным заголовком? | Например child `GoxAE` в `F36dq`: static flow ссылается на `responsive-390-faces/TAI7T.png`, а live stack на `original-headings-390/TAI7T.png`. Native text «Мы рядом» прочитан; идентичность разных raster URLs не доказана |
| V2-Q10 | Доставка/экспорт assets и нужных font weights в repo | Пути Pen-side, export на этом этапе не выполнялся; native texts/illustrations есть. Не считать наличие ссылок доказательством browser-ready assets |
| V2-Q11 | Copyright и V2 Dark | В source «© 20— dudeweb», отдельного V2 Dark нет. Автоматически подставлять год или придумывать dark palette по старому лендингу нельзя |
| V2-Q12 | Как показать mobile reduced-motion flow без clipping и с доступным текстом? | Hidden flow 3080px больше текущего Hero; нельзя просто включить картинки внутри существующего clipped field. Нужны обычный document flow и текстовый эквивалент в реализации |

### Проверка этапа 01

- Живым MCP получен полный top-level список; выбраны 8 V2 reference pages +
  current state board. Прочитаны все **2845 nodes**, включая hidden editable
  sources и state samples, со свойствами, bounds, resolved variables/instances.
- Сопоставлены дерево, порядок семи видимых секций, все пользовательские copy,
  assets, типографика и responsive значения всех восьми экранов. Native source
  copy отделён от неинтерактивных micro-UI illustrations и старых hidden rows.
- Получены snapshots всех восьми страниц; дополнительно просмотрены open menu,
  button/link states, period states, master/mobile benefit face, News и Connection.
- В `ctx.problems` нет записей у включённых узлов с включённой цепочкой предков
  во всех девяти frames. У hidden sources / отключённого reduced-motion flow
  есть clipping diagnostics; это не clean audit скрытых альтернатив. Включение
  альтернатив требует перерасчёта flow. Screenshots не доказывают browser,
  keyboard, physical-device, accessibility или production acceptance.
- Описаны hover, active/pressed, menu, CTA, accordion, mobile scroll target,
  signal/footer motion, transitions и reduced-motion. Отсутствующие dropdown,
  формы и scroll reveals отмечены как отсутствующие.
- News block разобран отдельно: три cards, точные headlines/categories/dates,
  covers, отсутствие descriptions, все layouts, незаданные destinations.
- Изменения этапа ограничены этим документом и чекбоксами 01/overview.
  Production-код, `routes/`, текущая главная `/`, dependencies и Pen не менялись.
  Build/runtime tests для документационного diff не запускались; проверка
  неизменности кода выполняется по полному Git diff и staged allowlist.
- Шаги 02–12 и весь implementation Definition of Done overview остаются
  незавершёнными. Наличие `/landing` этим анализом не заявляется.
