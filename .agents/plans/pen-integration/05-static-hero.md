# Шаг 5 — Service Cloud Hero и запасной Signal Orbit

## Статус

Шаг принят владельцем 2026-10-17 с разрешением commit и перехода к шагу 6.
Оставшаяся визуальная проверка перенесена в шаг 15 без объявления её пройденной.

## Цель задачи

Реализовать новую редакцию Hero из актуального Pen: 3D Service Cloud на desktop
и Service Orbits на mobile/tablet. По прямому запросу владельца прежний Hero и
pointer animation сохраняются в проекте как запасной вариант. Текущие visual,
asset, motion и fallback contracts и checklist находятся в
[Service Cloud Hero](2026-10-17-service-cloud-hero.md). Исходный GLSL и все
логотипы берутся из Pen; scroll-driven state machine/pinning не возвращаются.

## Зависимости

- Завершён шаг 4.
- Повторный read-only аудит Pen 2026-10-15 подтвердил удаление `G · Hero
  Motion Storyboard` и `J1`–`J6`.
- Актуальные Hero sections: `QfhD2`, `UQZi9`, `o6Ccn`, `XwYYP`, `wmAK2`,
  `BcmBV`, `NaUwK`, `v2heM` и их menu-open copies.
- Wide landing references: `j8pJq` и `eM8HW`.

## Обязательные skills

- `frontend-design` — Hero как главный выразительный приём, точная иерархия и
  visual self-critique.
- `vue-best-practices` — core, composables и state-driven animation references;
  focused presentation, shader lifecycle и сохранённый pointer lifecycle.
- `tailwind-best-practices` — semantic tokens, фиксированные responsive
  variants и отсутствие случайных magic utilities.

## Прежняя реализация Signal Orbit — сохранённый backup

Checklist и история ниже относятся к предыдущей реализации; они не определяют
поведение нового Service Cloud. Состояние новой реализации ведётся в связанном
Service Cloud checklist выше. Непройденные screenshot проверки не закрываются
результатами unit tests или одними DOM measurements.

- [x] Сохранить `LandingHero.vue` focused presentational component без
  route/business state.
- [x] Удалить `useScrollDrivenHero.js`, scroll-driven RAF/listeners, seven-state
  configuration, pinning и keyed Hero transitions.
- [x] Показать сразу eyebrow `HEY, DUDE!`, heading `Любимые сервисы\nснова
  рядом`, описание, оба CTA и trial line.
- [x] Сохранить destinations `/register` и `#pricing`.
- [x] Использовать точную Signal Orbit path geometry как начальное/fallback
  состояние и `viewBox 0 0 300 300`.
- [x] Перенести theme-aware dark/light blob palettes, opacity, radial canvas и
  Hero-specific action/text colors в semantic foundation tokens.
- [x] Реализовать mobile centered composition и tablet/desktop/UHD split
  composition без horizontal overflow.
- [x] Сопоставить heading sizes `38/42/54/76/108 px` и Hero heights
  `560/560/800/984/1328 px` с `360/390/768/1440/2560` references; на desktop
  сохранять `header + Hero = 100dvh` без fixed/min-height от Pen; SVG
  пропорционально вписывается в фактическую высоту секции.
- [x] На desktop/WQHD/UHD компенсировать половину fluid header height для всей
  text/action group, чтобы её центр совпадал с центром полного viewport, а не
  был смещён вниз центровкой внутри Hero после header.
- [x] На desktop/WQHD/UHD отделить Signal Orbit от grid flow и перенести
  размеры `861×830` / `1536×1246 px` и смещение из Pen; по решению владельца
  2026-10-16 крупный SVG проходит под content и пересекается с описанием,
  сохраняя независимое положение text/action group. Последнее уточнение
  владельца сохраняет базовый SVG с отступами из `N`, без запаса под morph;
  исходные Pen dimensions задают пропорции и верхнюю границу размера.
- [x] Интерполировать desktop-to-UHD geometry между `1440` и `2560`, не
  включать фиксированную `1800 px` grid скачком на wide breakpoint и не
  допускать clipping текста на промежуточных viewport.
- [x] Сохранить mobile stacked CTA и horizontal CTA начиная с tablet.
- [x] Удалить автономный CSS morph, keyframes, animation transform и
  duration/easing tokens; в покое оба fill-слоя используют точный path из Pen.
- [x] Добавить отклик на направление мыши через `useSignalOrbitPointer`,
  более смелую деформацию/сжатие и возврат к исходному path; SVG layout bounds
  и исходный Pen envelope сохраняются.
- [x] Вернуть momentum-вариант до кисти; удалить захват/вытягивание к краям
  и отдельный canvas-эффект.
- [x] Оставить точный статичный Pen path при reduced motion, coarse pointer,
  touch и в фоне; снимать listeners и RAF при unmount.
- [x] Сохранить один доступный `h1`, нормальный reading order и decorative
  `aria-hidden` для Signal Orbit.
- [x] Скрывать purely decorative signal в forced-colors mode.
- [x] Выполнить client/SSR production build в Sail и `git diff --check`.
- [x] По сверке 2026-10-17 сопоставить raw CTA weight `650` с rendered Pen,
  воспроизвести его browser weight `400`, исправить tablet padding и
  responsive label size/line height `15/20`, `14/18`, `16/21`, `18/23 px`.
- [x] Проверить live layout после коррекции 2026-10-17.
- [x] Повторить native pointer smoke в видимом Browser; 2026-10-17 на
  `1440×1080` подтверждены синхронная деформация и точный возврат после покоя.
  Девять существующих Sail tests также проходят.
- [x] По решению владельца передать оставшуюся browser visual matrix на
  `360/390/768/1440/2560`, light/dark, в шаг 15; проверка ещё не выполнена.

## История: результат актуализации — 2026-10-15

### Source delta

- Current Pen baseline: `137` top-level frames, `10` reusable components,
  `19` variables.
- Старые storyboard и шесть fallback boards отсутствуют; два UHD landing
  frames являются полноценными visual references.
- Пять `partially clipped` diagnostics принадлежат oversized decorative blob в
  tablet/desktop/UHD Hero. Остальных structural layout problems нет.

### Component и visual contract

- `LandingHero.vue` не имеет props/emits/reactive source state: компонент
  отвечает только за Hero presentation.
- `useScrollDrivenHero.js` удалён; scroll/history/orientation lifecycle больше
  не относится к Hero contract.
- Signal Orbit сохраняет точный статичный path из Pen. Mesh gradient
  представлен четырьмя угловыми theme colors через два
  horizontal gradients и vertical alpha mask; opacity и blur соответствуют
  reference viewport. Ambient animation отсутствует.
- Mobile content центрирован поверх signal; начиная с `768 px` content и signal
  образуют split layout с декоративным overlap. На desktop signal повторяет
  Pen dimensions как исходную геометрию и смещение под текстовую колонку.
  Итоговый SVG пропорционально ограничен высотой Hero с исходными Pen insets.
  Размеры между desktop
  и UHD reference интерполируются fluid; `1600 px` не является переключателем
  на конечную UHD grid. `preserveAspectRatio="none"` сохраняет разные width и
  height из Pen, а `pointer-events: none` оставляет content интерактивным.
- Light palette после сверки 2026-10-16: `#858FF3/#D982C9/#F09A6F/#8EA3F4`,
  opacity `0.38/0.42/0.44` на mobile/desktop/UHD. Dark palette остаётся
  `#665BE8/#B441B0/#E87950/#566ED8`, opacity `0.48`.
- Primary/secondary actions используют отдельные semantic Hero tokens, включая
  light secondary `#ECEEFC/#3036A8/#666DE8` и dark secondary
  `#292E49/#F1F2FF/#8E9BFF`.

### Verification

- `./vendor/bin/sail npm run build` прошёл для client и SSR с Tailwind `4.3.3`,
  Vue `3.5.44` и Vite `8.3.4`.
- `git diff --check` проходит; production sources больше не содержат
  `useScrollDrivenHero`, `HERO_STATES`, scroll listener или pinning classes.
- Read-only Pen screenshots и structure/property extraction выполнены для
  `390`, `768`, `1440`, `2560`, dark/light; Pen не изменялся.
- Повторная проверка bounds исправила прежнюю выписку высот: desktop Hero имеет
  `984 px`, UHD Hero — `1328 px`; вместе с header это ровно `1080/1440 px`.
- Повторная browser-диагностика заменила расширяемый viewport-relative
  `min-height` на точную `height`: при стандартных desktop/UHD proportions
  первая секция не может стать выше первого экрана, а fluid safe floor действует
  только на слишком низких окнах, где иначе был бы обрезан контент.
- Pen bounds показывают причину вертикального смещения: content center находится
  в центре Hero, то есть на `48/56 px` ниже центра полного `1440/2560` frame.
  Последующее owner correction поднимает content group на половину высоты
  header; signal geometry и высота Hero при этом не меняются.
- WQHD follow-up выявил второй источник смещения: flow-positioned Signal Orbit
  высотой `1246 px` расширял общую grid-row сверх доступной content height и
  сдвигал центр текста ещё примерно на `89 px`. Desktop content поэтому
  позиционируется от `50%` высоты Hero независимо от декоративной grid-row, с
  сохранением horizontal container alignment и header compensation.
- Прежняя owner correction (отменена решением 2026-10-16) устраняла визуальное обрезание Signal Orbit:
  начиная с desktop SVG абсолютно позиционируется в правой колонке, получает
  квадратный aspect ratio и размер `min(signal column, Hero free height)`,
  поэтому остаётся внутри вертикальных insets даже на низких desktop окнах.
- Live WQHD browser measurement после включения morph выявил `1 px` расхождение:
  прежний header складывал `112 px` child height и нижний border. Responsive
  height перенесена на border-box header, child использует `h-full`; итоговые
  bounds снова равны `112 + 1328 = 1440`, а content center — `720 px`.
- Responsive invariant проверен на `1200/1439/1440/1441/1599/1600/1601/1920/
  2048/2560/3200 px`: Hero grid не шире viewport, сумма fluid columns/gap
  совпадает с container, а `1599 -> 1600 -> 1601` не создаёт скачка или
  отрицательного inset.
- Ранее Browser screenshot capture завис после успешной загрузки приложения;
  host-runner проверка не использовалась как подмена browser evidence.
- Последующий Pen Browser WQHD check восстановил capture и подтвердил live
  bounds `header 112 / Hero 1328 / content center 720` при viewport
  `2560×1440`. Два runtime samples вернули разные interpolated computed `d` и
  `playState: running`; emulation `prefers-reduced-motion: reduce` вернула
  `animationName: none`, `0` animations, исходный path и `transform: none`.
  Полная five-width/light-dark matrix при этом остаётся незакрытой.
- Историческая Pen Browser matrix для bounded signal (до решения 2026-10-16) прошла на `1200×800`,
  `1440×1080`, `1920×1080` и `2560×1440`: размеры SVG соответственно
  `524/580/717.14/899.98 px`; на каждом viewport его bounds целиком находятся
  внутри Hero и layout, левая граница не пересекает правую границу content,
  horizontal overflow отсутствует. Content center сохранился на центре полного
  viewport (`400/539.98/539.98/720 px`). Screenshot capture после смены
  viewport вернул известный stitching artifact, поэтому доказательством этой
  targeted проверки являются успешные live DOM/CDP bounds, а не stitched кадр.

## Сверка размера и цвета — 2026-10-16

- Read-only Pen extraction подтвердил исходный path, `viewBox`, mesh `2×2`,
  четыре угловых цвета, blur и локальные offsets. Pen не изменялся.
- Восстановлены размеры SVG `250×250`, `270×270`, `465×468`, `861×830`,
  `1536×1246 px` на `360/390/768/1440/2560`. Между desktop и UHD width,
  height и offsets интерполируются; SVG остаётся вне layout flow.
- Live DOM/CDP matrix на `360×800`, `390×844`, `768×1024`, `1440×1080`,
  `2560×1440` в обеих темах подтвердила размеры, palette, opacity,
  blur `16/16/20/30/54 px`, overlap с description и верхний слой content.
  Horizontal overflow равен `0`; destinations остаются `/register` и `#pricing`.
- Desktop content center равен `539.98 px` на `1440×1080` и `720 px` на
  `2560×1440`; увеличение декора не сдвинуло text/action group.
- Reduced-motion emulation во всей matrix возвращает `0` animations.
- `./vendor/bin/sail npm run build` прошёл для client и SSR; `git diff --check`
  проходит.
- Прямой CDP screenshot на `1440×1080` позволил визуально сверить dark Hero.
  Element screenshot содержит повторяющиеся stitched tiles, а UHD capture
  завершается timeout. Поэтому полная screenshot matrix остаётся открытой;
  результаты DOM/CDP не выдаются за pixel comparison.

## История: точная Pen geometry на WQHD — 2026-10-16

- Владелец отклонил уменьшение SVG по доступной высоте. Fit allowance,
  дополнительные insets и ограничение размеров удалены.
- Повторно прочитаны dark/light Pen Hero `NaUwK`/`v2heM`: frame
  `2560×1328 px`, wrapper `(1280, 204)` размером `900×920 px`, path
  `1536×1246 px` с локальным offset `(-320, -166)`. Итоговая позиция path
  внутри Hero — `(960, 38)`.
- В Pen Hero `clip` отсутствует, в то время как в реализации было
  `overflow: hidden`. С wide breakpoint используется `overflow: visible`;
  декор сохраняет исходный размер и может выходить за section bounds.
- CDP сверка при canvas width `2560` и viewport height `1440` вернула
  `x=960`, `y=38`, `width=1536`, `height=1246`, `matchesPen: true`.
  Для этой проверки scrollbar временно скрыт и затем восстановлен: обычный
  classic scrollbar `15 px` сдвигает центрированный container на `7.5 px`.
- Live matrix `1440×1080`, `1920×1080`, `2199/2200/2201×1440`,
  `2560×1440/1280` подтвердила исходные размеры, плавную интерполяцию,
  overlap описания и отсутствие horizontal overflow. При меньшей высоте окна
  SVG сохраняет исходный размер и не подрезается самой секцией. Последующая
  проверка расположения выявила зависимость top от viewport height; исправление
  описано ниже.
- В обеих темах wide opacity остаётся `0.44/0.48`; центр текста на
  `2560×1440` — `720 px`. Sail client/SSR build и `git diff --check` прошли.
- Полная screenshot matrix остаётся отдельной открытой проверкой выше.

## История: привязка SVG к Hero — 2026-10-16

- Причина расхождения при правильных размерах: `top: 50% - offset` зависел
  от высоты окна. На `2560×1280` SVG начинался на `-42 px` относительно
  Hero вместо исходных `38 px` из Pen.
- SVG теперь использует top непосредственно от Hero: `82 px` на `1440`,
  `38 px` на `2560`, с fluid interpolation между references. Размеры и
  горизонтальный offset сохраняются.
- Hero использует точную исходную Pen height (`984/1328 px` на desktop/
  WQHD). Высота не растёт на высоких окнах: прежний viewport-relative `height`
  при `min-height: 1328px` давал `1688 px` на `2560×1800`. Если область
  браузера ниже reference, используется обычная прокрутка;
  SVG не уменьшается и не выходит за верх/низ сцены из-за высоты окна.
- Text/action group использует прежнюю viewport-relative height с верхней
  границей, равной reference height, чтобы на высоких окнах текст оставался
  внутри фиксированной сцены.
- Live CDP checks на `2560×1440/1340/1280/1080` подтвердили неизменные
  `1536×1246 px`, top `38 px`, нижний inset `44 px` и content center
  `720/670/640/540 px`. Дополнительно проверены `1440×1080`, `1920×1080`,
  `2200×1280`: overlap описания сохранён, horizontal overflow равен `0`.
- После замены `min-height` точной `height` проверены окна
  `2560×1080/1280/1440/1800/2160`: во всех случаях Hero имеет `1328 px`,
  SVG — `1536×1246 px`, верхний/нижний insets — `38/44 px`. Контент остаётся
  внутри секции, horizontal overflow равен `0`. Sail client/SSR build и
  `git diff --check` прошли.

## История: один экран и animated SVG внутри Hero — 2026-10-16

- Последнее явное требование владельца: весь header + Hero помещается на один
  экран, SVG не выходит за секцию и не обрезается header. Этот contract заменяет
  предыдущие fixed-height и overflow-visible варианты, описанные выше.
- Desktop Hero: `height: calc(100dvh - header height)`, без `min-height` и
  fixed reference height. Text group центрируется относительно viewport.
- SVG центрируется по вертикали. Из доступной высоты вычитается
  `2 × (3 × blur + 24 px)`; width ограничена этой высотой через исходный aspect
  ratio. `height: auto` сохраняет пропорции. В поддерживающих браузерах ratio
  выводится из fluid Pen width/height; fallback использует UHD `1536/1246`.
- Header остаётся выше секции, Hero использует `overflow: hidden`; размер
  рассчитан так, чтобы форма с blur/morph не достигала границ этого clipping.
- Live regression matrix: `1440×1080`, `1920×1080`,
  `2199/2200/2201×1280`, `2560×1440/1340/1280/1080`. Везде
  `header + Hero = viewport height` с погрешностью не более `0.02 px`,
  content находится внутри Hero, overlap описания сохранён, horizontal
  overflow равен `0`.
- На `2560×1440`: header `112`, Hero `1328`, SVG `1178.5×955.98 px`.
  На `2560×1280`: header `112`, Hero `1168`, SVG `981.25×795.98 px`.
- Семь samples morph cycle подтвердили положительные запасы path bbox с
  добавлением `3 × blur` по всем четырём сторонам. На `2560×1440` минимальные
  вертикальные запасы — `31.7/37.7 px`, на `2560×1280` — `30.4/35.4 px`.
- Sail client/SSR build и `git diff --check` прошли. Полная screenshot matrix
  остаётся отдельной открытой проверкой.
- Дополнительно light/dark checks на `2048×1152` и `1707×960` подтвердили
  один экран и SVG внутри секции при меньшей CSS-области WQHD-монитора.
  Reduced motion возвращает `0` animations; после отключения оба слоя running.
  Успешный CDP screenshot `2560×1440` с raster scale `0.5` показывает SVG
  целиком внутри Hero; масштаб снимка не меняет CSS viewport.

## Базовая геометрия: статика по light frame N — 2026-10-16

- По прямому запросу владельца animation удалена полностью. Нет CSS keyframes,
  morph, scale/rotation или специальных reduced-motion styles для SVG.
- Source `v2heM` / `Q8NDPR`: `1536×1246 px`, position `(960, 38)` относительно
  Hero `2560×1328 px`, bottom inset `44 px`; light opacity `0.44`, blur `54 px`,
  palette `#858FF3/#D982C9/#F09A6F/#8EA3F4`, исходный `viewBox 0 0 300 300`.
- Desktop-to-WQHD top/bottom insets интерполируются от `82/72 px` до `38/44 px`.
  Дополнительный запас под animation удалён. SVG сохраняет source dimensions
  на reference viewport и пропорционально уменьшается в более низком окне.
- `header + Hero = 100dvh` сохраняется. Live check на `2560×1440`: Hero
  `1328 px`, SVG `1536×1246 px`, top/bottom `38/44 px`, `0` animations,
  transform `none`, light opacity `0.44`, blur `54 px`, horizontal overflow `0`.
- Sail client/SSR build и `git diff --check` прошли.

## История: отклик на направление мыши — 2026-10-16

- По новому запросу владельца добавлен pointer-only отклик по аналогии со
  звёздами на [лендинге OpenAI](https://openai.com/ru-RU/index/introducing-gpt-6-1-sol/).
  Pen остаётся источником размеров, положения, исходного path и palette.
- `LandingHero.vue` связывает template refs и pointer events с
  `useSignalOrbitPointer`. Composable обрабатывает направление/импульс движения,
  сглаживание, затухание, media preferences и cleanup. `signalOrbitGeometry.js`
  деформирует исходные cubic curves и нормализует их точные extrema обратно
  к исходным границам. Оба mesh fill-слоя получают один и тот же path.
- CSS geometry, размеры Hero/SVG, insets, blur, palette и положение content не
  меняются. Нет translate/scale/rotation всей фигуры, CSS keyframes или autoplay.
  После остановки/ухода мыши восстанавливается точная исходная строка path;
  RAF прекращается. CTA не запускают отклик. Scroll, resize, blur, смена media
  preferences и visibility сбрасывают движение; unmount снимает listeners.
- `prefers-reduced-motion: reduce`, отсутствие hover/fine pointer, touch,
  forced colors и фон не запускают движение. Heading и CTA всегда доступны.
- Четыре Node unit-теста через Sail прошли: точное состояние покоя, различие
  направлений и близости курсора, сохранение границ/замыкания контура в 54
  комбинациях и ограничение экстремального импульса. Client/SSR build прошёл.
- Browser pointer checks подтвердили разные paths для движения вправо/влево,
  синхронность двух слоёв, возврат после остановки/ухода курсора, статичные
  reduced-motion/touch/CTA cases и снятие listeners при unmount.
- DOM/CDP в light/dark на `1440×1080`, `2560×1440`, `2560×1280`, `390×844`
  подтвердил неизменные layout bounds и отсутствие horizontal overflow.
  На `2560×1440`: header `112 px`, Hero `1328 px`, SVG `1536×1246 px`,
  insets `38/44 px`. На `2560×1280` SVG пропорционально вписывается в Hero
  `1168 px`. Сохранение границ движущегося контура проверено unit-тестами.
- Повторный screenshot capture завершился timeout и затем `A capture is already
  running`; полная screenshot matrix остаётся открытой. Pen не изменялся.

## Светлая тема: плотность цвета — 2026-10-16

- Read-only сверка `N`/`F`/`B` подтвердила прежнюю палитру mesh gradient
  `#858FF3/#D982C9/#F09A6F/#8EA3F4`, opacity `0.44/0.42/0.38` и blur
  `54/30/16 px`. Browser computed styles совпали с исходными значениями.
- По замечанию владельца о блеклом SVG выполнена отдельная визуальная
  корректировка: light opacity `0.46/0.50/0.52` на mobile/desktop/UHD,
  на `0.08` выше Pen. Это усиление плотности цвета, а не исправление HEX-палитры.
  Dark opacity `0.48`, gradient stops, blur, geometry и pointer response сохранены.
- Sail client/SSR build и `git diff --check` прошли. Browser computed styles на
  `390×844`, `1440×1080`, `2560×1440` подтвердили новые light opacity, прежние
  dark opacity/palette, размеры SVG и отсутствие horizontal overflow. WQHD
  остаётся `header 112 + Hero 1328 = 1440 px`, SVG `1536×1246 px`.
- Pen не изменялся. Полная screenshot matrix по-прежнему открыта: browser
  capture возвращает stitching artifacts и периодически зависает.

## История: отдельная кисть (отменена владельцем) — 2026-10-16

- Последний запрос владельца: курсор рисует цветом SVG по всей ширине Hero.
  Добавлен один decorative canvas под текстом/actions, поверх исходного SVG.
  `LandingHero` отвечает за markup/event wiring; `useSignalOrbitPointer` — за
  единый pointer lifecycle и RAF; `heroColorBrush.js` — за точки и отрисовку.
  Отдельный Vue-компонент для одного decorative canvas не требуется.
- Мягкая кисть смешивает четыре текущих theme colors Signal Orbit. Canvas
  использует ту же responsive opacity: light `0.46/0.50/0.52`, dark `0.48`.
  Semantic diameter tokens `160/480 px` ограничивают размер; внутри диапазона
  размер зависит от ширины Hero. Layout bounds исходного SVG не меняются.
- Между соседними событиями добавляются промежуточные точки; след не рвётся
  при быстром движении. Не более `128` точек, backing canvas не шире `1600 px`:
  мягкая фактура не требует полного DPR/WQHD resolution. Текст и CTA выше слоя,
  canvas имеет `aria-hidden` и `pointer-events: none`, Hero ограничивает след
  своими границами. При первом входе нет линии от предыдущего положения.
- След затухает за `1200ms`, в покое RAF прекращается, canvas освобождается до
  `1×1`. Pointer leave/CTA разрывают stroke, не создавая перемычки при новом
  входе. Смена темы, scroll/resize/blur, reduced-motion/media/visibility change
  сразу очищают слой. Touch, coarse pointer и reduced motion сохраняют статику.
  Theme observer снимается при unmount вместе с остальным lifecycle.
- Все `9` Node unit-тестов через Sail прошли: `5` новых для начала stroke,
  непрерывности в обе стороны через `2560 px`, отсутствия накопления при малом
  движении, ограничения числа точек и полного монотонного затухания; `4`
  прежних проверяют geometry. Sail client/SSR build прошёл.
- Browser renderer проверен напрямую на реальном canvas в обеих темах на
  `1440×1080`/`2560×1440`: пиксели слева/в центре/справа заполнены, после
  `1300ms` прозрачны; canvas покрывает всю Hero, `z-index` content/canvas
  `1/0`, pointer events `none`, horizontal overflow `0`. WQHD сохраняет
  `header 112 + Hero 1328 = 1440 px`, SVG `1536×1246 px`. Background visibility
  интегрированного браузера не подменялась для проверки pointer lifecycle.
- Screenshot capture снова завершился timeout; визуальная matrix остаётся
  открытой. Pen не изменялся, шаг 6 не начат.

## История: вытягивание SVG к краям (отменено владельцем) — 2026-10-16

- Владелец отклонил две независимые анимации. Canvas, `heroColorBrush.js`,
  brush tokens и тесты отменённого эффекта удалены. Работает только исходный SVG
  с одним общим замкнутым контуром у двух gradient fill-слоёв.
- Hover на исходной фигуре захватывает взаимодействие и немного расширяет
  форму. Последующее движение курсора за её границы тянет ближайший участок
  этой же фигуры к краям Hero, формируя длинное связное продолжение. При входе
  в Hero вдали от SVG эффекта нет: требуется сначала навести на исходную форму.
- Pure geometry helper точно делит семь исходных cubic curves на `56`
  участков и локально растягивает их control points. Вместо прежней
  нормализации к постоянному bbox контур ограничивается всей областью Hero
  с учётом blur. SVG viewport и Hero layout остаются прежними. Статичный path
  и усиленная light opacity `0.46/0.50/0.52` сохранены.
- Неподвижный курсор удерживает вытянутую фигуру, RAF останавливается. Уход из
  Hero/на CTA плавно возвращает точную исходную строку Pen path. Scroll,
  resize, blur, visibility/media/theme change немедленно сбрасывают движение.
  Touch/coarse pointer и reduced motion остаются статичными; cleanup сохранён.
- В Sail прошли `9` тестов: `7` geometry cases проверяют захват внутри формы,
  замыкание одного контура, растяжение за исходный viewBox к левому краю,
  расширение при hover, направление/силу, пределы Hero при экстремальном вводе
  и точный возврат.
  `2` lifecycle cases используют настоящий Vue composable с управляемыми
  DOM/RAF adapters: hover → pull → hold → release, idle RAF, static media/touch/
  background, blur и cleanup. Старое требование сохранять исходный bbox при
  любой деформации отменено новым требованием владельца.
- Sail client/SSR build прошёл. После открытия активного Pen Browser native CDP
  mouse events на `2560×1440` подтвердили hover, вытягивание к левому краю,
  удержание path при остановке и точный возврат после ухода. Ink bounds начинаются
  на `108 px`, ширина вытянутой фигуры около `2342.5 px`; это один SVG без canvas,
  оба fill-слоя синхронны. Layout bounds SVG и heading не меняются, header/Hero
  `112/1328 px`, horizontal overflow `0`; reduced motion оставляет Pen path.
  В dark на `1440×1080` подтверждены ink left `60 px`, SVG `861×830 px`,
  header/Hero `96/984 px`, opacity `0.48`, синхронность слоёв и overflow `0`.
  Полная screenshot matrix остаётся открытой. Pen не изменялся; шаг 6 не начат.

## Сохранённое решение Signal Orbit: отклик до кисти — 2026-10-16

- По последнему запросу владельца возвращён momentum-вариант до кисти.
  Убраны захват внутри фигуры, удержание у курсора, `56` subdivided curves и
  вытягивание к краям Hero. Движение по всей Hero деформирует исходные семь
  cubic curves; остановка или уход плавно восстанавливают точную Pen geometry.
- Амплитуда `18 → 48` SVG units, impulse distance `70 → 55px`, response
  `90 → 60ms`, decay `140 → 200ms`. Добавлено поперечное сжатие до `20%`
  при сильном импульсе: горизонтальное движение уменьшает высоту, вертикальное
  — ширину. После затухания восстанавливается исходный размер.
- Exact extrema normalization удерживает контур в исходном Pen envelope:
  более заметная motion не требует менять высоту Hero, размеры SVG или insets.
  Усиленная light opacity `0.46/0.50/0.52`, dark `0.48` сохранены.
- Прошли `9` тестов через Sail: `6` geometry cases проверяют исходный path,
  направление/близость, размер до `20%`, силу реакции, envelope/замыкание и
  saturation; `3` Vue lifecycle cases — движение в любой части Hero, затухание
  без pointer leave, static media/touch/background, blur и unmount активного RAF.
  Client/SSR build прошёл. Полная screenshot matrix остаётся открытой.
- Повторная browser-проверка заблокирована оставшимся `A capture is already
  running`; прежние native checks относятся к предыдущему, отменённому варианту.

## Критерии готовности

Критерии новой реализации и актуальная проверка находятся в
[Service Cloud Hero](2026-10-17-service-cloud-hero.md). Следующие критерии,
команды и сценарии относятся к сохранённому Signal Orbit.

Текущая таблица source metrics и ограничения повторной проверки находятся в
[сверке 2026-10-17](2026-10-17-pen-reconciliation.md). Девять geometry/pointer
tests и Sail client/SSR build прошли. Light/dark DOM matrix после коррекции
пройдена на пяти widths; screenshot matrix открыта из-за timeout live capture.

- Hero не использует pinning или искусственную scroll-story height;
  desktop header + Hero помещаются ровно в один viewport. SVG реагирует только
  на движение мыши и не использует autoplay.
- Copy, hierarchy, geometry, theme palette и CTA соответствуют актуальным Pen
  references.
- Нет layout shift или horizontal overflow; animation не меняет layout bounds.
  Крупный Signal Orbit намеренно заходит под текстовую колонку, content остаётся
  поверх декора. SVG использует размеры и insets Pen и пропорционально
  вписывается в более низкую Hero-секцию. Деформация остаётся в исходном
  Pen envelope.
- Heading и actions доступны без зависимости от motion preferences;
  Signal Orbit статичен при reduced motion и без fine mouse pointer.
- Sail build и browser matrix проходят.

## Команды проверки

```bash
rg -n "useScrollDrivenHero|HERO_STATES|addEventListener|requestAnimationFrame|landing-hero--scroll-driven" resources/js resources/css
./vendor/bin/sail npm run build
./vendor/bin/sail node --test tests/Unit/Frontend/signalOrbitGeometry.test.js
./vendor/bin/sail node --test tests/Unit/Frontend/signalOrbitPointer.test.js
git diff --check
```

## Сценарии проверки

- Сравнить dark/light Hero на `360`, `390`, `768`, `1440`, `2560`.
- Проверить CTA pointer/keyboard focus и destinations.
- Проверить 200%/400% zoom, forced colors и text-only enlargement.
- Проверить отклик на направление мыши, синхронность двух слоёв, возврат
  исходный path после остановки/ухода и отсутствие autoplay.
- Проверить точный статичный path при reduced motion, touch/coarse pointer,
  потере видимости; проверить cleanup после unmount.
- Провести курсором по разным областям Hero в обе стороны и по диагонали;
  проверить заметное изменение формы/размера, возврат после остановки, отсутствие
  следа/вытягивания к курсору и очистку при смене темы/scroll/resize.
- Проверить отсутствие horizontal overflow на `320`, `360`, `390`, `768`,
  `1024`, `1200`, `1440`, `1920`, `2560`; на desktop дополнительно проверить
  размеры и overlap Signal Orbit с описанием, верхний слой content и сохранение
  viewport-centered text/action group.
- Убедиться, что обычная прокрутка сразу открывает `Преимущества` без pinned
  states или искусственной `svh`-высоты.
