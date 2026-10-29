# Hero — Service Cloud и Service Orbits

Синхронизация checklist в шаге 16, 2026-10-27: перенесённые SVG screenshot
и native motion проверки завершены в шаге 15 —
[Hero visual audit](../../../docs/audit/pen-hero-verification.md) и ручной
[M-09 владельца](../../../docs/audit/pen-step15-manual.md). Исторические
WebGL/capture результаты ниже не являются текущим acceptance статусом.

## Закрытие implementation шага

По прямому решению владельца 2026-10-17 implementation принят, разрешены
commit и переход к шагу 6. Непройденные native motion и screenshot проверки
ниже сохраняются как открытый verification backlog шагов 14–15. Это перенос
проверки, а не утверждение о её выполнении.

## Текущее уточнение — векторные логотипы

Владелец запросил замену PNG на SVG при сохранении принятой композиции и
движения. Pen logo boards содержат только PNG. Источником векторных paths
служат закреплённые Simple Icons SVG, цвета берутся из прежних Pen PNG.
PNG нельзя встраивать внутрь SVG; итоговый декоративный слой должен оставаться
векторным при масштабировании. Новых npm dependencies не требуется.

Component boundary: `ServiceLogoCloud` содержит SVG root и pointer bindings;
`useServiceCloud` сохраняет ambient/hover/drag/media/visibility lifecycle и
передаёт time/rotation/theme в renderer. `serviceCloudGeometry` воспроизводит
Pen sphere/orbit projection чистыми функциями. SVG renderer обновляет позиции,
размеры, depth opacity и общую радиальную attenuation mask, используя локальные
векторные файлы; theme-aware paths не парсятся через `v-html`. Signal Orbit
остаётся неизменным запасным вариантом при ошибке renderer/ресурсов.

GLSL сохраняется как источник математического контракта, но runtime больше
не использует WebGL/PNG textures. По следующему запросу владельца все локальные
PNG logos/atlases удалены; manifest содержит только SVG assets. Исторические
результаты проверок ниже относятся к прежнему renderer; актуальная SVG
проверка приведена отдельно.

## Результат переноса на SVG — 2026-10-17

- [x] Подключить все 23 сервиса в light/dark как 46 локальных SVG.
- [x] Заменить WebGL canvas на native SVG с внешними vector `image` resources;
  не растрировать SVG в texture и не вставлять PNG внутрь SVG.
- [x] Сохранить Pen Fibonacci projection, depth size/opacity, три орбиты,
  footprint `88/128` и радиальное ослабление орбит. SVG mask приближает
  shader smoothstep 33 stops; sphere не использует эту маску.
- [x] Сохранить desktop ambient/hover/drag, один RAF, reduced/coarse/forced-colors
  gating, background/offscreen pause и cleanup. GPU context lifecycle удалён,
  поскольку SVG renderer не создаёт WebGL context.
- [x] Проверить все vector asset hashes/colors, отсутствие embedded raster,
  responsive geometry, static pose, theme resources, renderer cleanup и
  отсутствие запуска после unmount во время загрузки.
- [x] Sail: `25/25` Node tests (11 cloud lifecycle, 5 SVG/geometry/assets,
  9 Signal Orbit); client/SSR production build; `git diff --check`.
- [x] Сохранить прежние незакоммиченные SSR artifacts byte-for-byte после
  сборки; backup Hero SHA-256 совпадает с manifest.
- [x] Live DOM matrix: обе темы на 360/390/768/1440/2560, SVG resources,
  размеры, containment, отсутствие horizontal overflow, один h1 и CTA destinations.
- [x] Live reduced-motion/forced-colors markup и отсутствие PNG requests.
- [x] Native pointer/ambient smoke в видимом Browser после SVG замены:
  принят владельцем в M-09 шага 15, отдельно от lifecycle tests.
- [x] Screenshot comparison после SVG замены: завершена в Hero audit шага 15;
  ранний capture timeout не использовался как visual evidence.

`ServiceLogoCloud` отвечает за SVG root и native pointer events;
`useServiceCloud` загружает обе темы и управляет lifecycle; renderer владеет
только своими SVG defs/group/images, меняет href при смене темы и coordinates
при кадре, освобождает узлы при unmount. `serviceCloudGeometry` содержит
независимые от Vue и DOM формулы. External SVG подключаются по локальным href,
без `v-html`, parsing fetched markup или новой dependency.

Прежние разделы с canvas, uniforms, atlas upload и GPU/context checks ниже —
история WebGL реализации. Текущий fallback включается при ошибке SVG renderer
или загрузки одного из logo resources; отсутствие WebGL не препятствует Hero.
По следующему запросу владельца удалены 46 PNG logos и два PNG atlas, а также
`previousRasterSource` с путями к ним из manifest. Остаются локальные SVG logos
и исходный GLSL; PNG assets в исходном Pen не изменяются.

### Live SVG DOM matrix

| Viewport | SVG layer, px | Content width, px | Mode |
| --- | --- | ---: | --- |
| 360×800 | 360×560 | 320 | 3 orbits / radial mask |
| 390×844 | 390×560 | 350 | 3 orbits / radial mask |
| 768×1024 | 768×800 | 600 | 3 orbits / radial mask |
| 1440×1080 | 580×620 | 580 | Fibonacci sphere |
| 2560×1440 | 900×920 | 820 | Fibonacci sphere |

На каждой ширине в обеих темах: ready, 23 SVG images, корректные theme href,
content внутри Hero, overflow `scrollWidth - clientWidth = 0`, один h1,
CTA `/register` и `#pricing`. В resource log ровно 46 SVG logos, нет PNG/atlas
requests. SVG имеет `aria-hidden=true`, `focusable=false`; forced colors скрывает
декор, сохраняя h1 и оба CTA. Reduced motion даёт running/interactive false.
Desktop header + Hero остаются равны viewport height.

Ограничения новой live проверки: Browser сообщает `document.hidden=true`,
поэтому pause работает штатно, но это не подтверждает native hover/drag или
ambient motion SVG в видимом окне. Эти переходы проверены Sail lifecycle tests;
прежние WebGL native checks не перенесены на SVG как новый результат.
`return-screenshot` для `.service-hero` завершился IPC timeout после 60 секунд.
Визуальная сверка остаётся открытой, шаг 6 не начинается. Browser theme/media
подмены сняты. Pen не изменялся; commit не выполнен.

## Источник и scope

По запросу владельца новая редакция `dudeweb.pen` заменяет основной Signal Orbit
на Service Cloud, сохраняя прежний Hero и его pointer animation как запасной
вариант в проекте. Это актуализация шага 5; шаг 6 не начинается.

Read-only source: `139` top-level frames (`+2` logo atlas boards), `10`
reusable components, `19` variables; Hero nodes
`QfhD2/UQZi9/o6Ccn/XwYYP/wmAK2/BcmBV/NaUwK/v2heM`.
Новые logo boards `SLuGe` и `LraS6` содержат 23 сервиса в двух темах.
Pen не изменяется. Ранее принятые public header/footer/login corrections
сохраняются.

## Visual и motion contract

Owner refinement после реализации: desktop sphere управляется курсором по
примеру [hero236](https://www.shadcnblocks.com/block/hero236). Последнее уточнение:
до наведения sphere медленно вращается (`0.105 rad/s` по yaw). Hover задаёт
направление/скорость по положению относительно центра, drag вращает сферу
напрямую, после ухода указателя инерция плавно переходит в фоновое вращение.
Mobile/tablet orbits и вся композиция остаются прежними. `useServiceCloud`
владеет pointer state и единственным RAF, `ServiceLogoCloud` связывает native
pointer events с canvas, renderer передаёт два угла в shader; новых dependencies
или layout components нет. Оригинальный Pen GLSL сохраняется отдельно.

- Night `#0A0A0B`, Paper `#FBF9F4`, Iris `#8E9BFF`, Iris Strong `#5B61E6`,
  foreground `#F5F5F6/#24211D`; вместо прежнего radial mesh — плоский фон Pen.
- UI/display — IBM Plex Sans, eyebrow/trial — IBM Plex Mono; copy, CTA,
  heading type scale и destinations сохраняются. Inter остаётся только в brand.
- Mobile 360/390: centered content `320/350 px`, Hero `560 px`; три орбиты
  занимают всю секцию за текстом, без непрозрачной маски или скрытого центра.
- Tablet 768: centered content `600 px`, Hero `800 px`, CTA в две колонки.
  Это новая композиция вместо прежней split column шириной `350 px`.
- Desktop 1440: text `580 px`, gap `40 px`, cloud `580×620 px`; UHD 2560:
  text `820 px`, gap `80 px`, cloud `900×920 px`. Между references — fluid.
  Desktop header + Hero помещаются в `100dvh`; ранее принятое центрирование
  текстовой группы относительно полного viewport сохраняется.
- Исходный `assets/hero/service-cloud.glsl` сохранён без изменения в
  `resources/js/shaders/service-cloud.pen.glsl`. Runtime `service-cloud.glsl`
  адаптирует только sphere rotation к двум pointer-driven углам; orbit branch
  совпадает с исходником. WebGL wrapper добавляет precision declaration.
  Никаких новых animation libraries/dependencies.
- Sphere: 23 Fibonacci points, angle `i × 2.399963`, pointer-driven pitch/yaw;
  depth factor `1 + z × 0.24`, scale `0.17 × min(width,height) × depth`,
  opacity `0.38 + 0.62 × (z+1)/2`. Логотипы не поворачиваются вокруг своей оси.
- Desktop mouse hover: нормализованное расстояние от центра задаёт скорость
  до `1.2 rad/s` на каждой оси, response `160ms`; центр тормозит вращение.
  Drag: `π / min(width,height)` radians на CSS pixel, capture только mouse,
  release velocity ограничена `2.4 rad/s`. После ухода/release инерция
  экспоненциально переходит с time constant `400ms` к ambient velocity
  `(pitch=0, yaw=0.105 rad/s)`. Вне hover sphere продолжает движение;
  ориентация не сбрасывается. В центре hover вращение может остановиться.
- Hover/drag включены только с `1200 px`, fine mouse pointer, без reduced
  motion/forced colors. Desktop touch/coarse остаётся статичным. Pointer
  capture освобождается при cancel, blur, media/theme/visibility/resize change,
  context loss и unmount. Mobile/tablet pointer input не меняет орбиты.
- Orbits: ring `i % 3`, radii `0.34/0.52/0.70 × min(width,height)`,
  speeds `0.08/0.095/0.11 rad/s`; среднее кольцо вращается в обратную сторону.
  Logo size — clamp от `44` до `72 px`; opacity плавно меняется от `0.20`
  за content до `0.85` у краёв по исходному shader.
- Reduced motion: `u_static=1`, время `0`. В фоне/вне viewport RAF остановлен.
  Forced colors скрывает декор. Listeners, observers, RAF и GPU resources
  освобождаются при unmount; WebGL context loss не оставляет активный loop.

## Component map и backup

- `LandingHero.vue` — выбор основного или запасного Hero; fixed variant
  `services` (default) / `signal-orbit`; отказ WebGL включает backup.
- `ServiceCloudHero.vue` — static content/layout и размещение декоративного слоя;
  событие `unavailable` передаёт отказ renderer вверх.
- `ServiceLogoCloud.vue` — decorative canvas, pointer event bindings и lifecycle.
- `useServiceCloud` — атласы, theme/media/visibility/resize, mouse steering/drag
  и единственный RAF; возвращает readonly state/running/interactive/dragging
  и pointer handlers для canvas.
- `serviceCloudRenderer` — shader compilation, rotation/time uniforms и GPU cleanup.
- `hero/SignalOrbitHero.vue` — точная копия прежнего `LandingHero.vue` из текущего
  checkout, включая последние typography corrections. `useSignalOrbitPointer`,
  `signalOrbitGeometry`, их CSS tokens и девять тестов остаются в проекте.
  Восстановление: `<LandingHero variant="signal-orbit" />` в route page;
  в обычном режиме старый composable не монтируется.

## Ресурсы

Текущий набор: 46 SVG для 23 сервисов в двух темах; источники, цвета, размеры
и SHA-256 находятся в `manifest.json`. PNG logos и atlases удалены из проекта
по запросу владельца после завершения SVG migration.

История WebGL реализации: ранее были скачаны byte-for-byte из документа: `public/images/hero/services/brands/`
(46 PNG), `atlases/` (два оригинальных атласа); SHA-256 и размеры — в
`manifest.json`. Все 23 сервиса и обе темы доступны локально, runtime не
обращается к Pen или сторонним CDN.

## Проверка

- [x] Прочитать текущую композицию и исходный shader; получить Pen screenshots.
- [x] Скачать все логотипы и оба атласа, сохранить manifest.
- [x] Сохранить прежний Hero и pointer dependencies.
- [x] Реализовать новую композицию и animation lifecycle.
- [x] Проверить reduced motion, background/offscreen pause, theme и cleanup тестами.
- [x] Выполнить девять прежних тестов и client/SSR build в Sail.
- [x] Проверить 360/390/768/1440/2560, обе темы, отсутствие overflow и CTA по live DOM/WebGL.
- [x] Проверить fallback и неизменность backup.
- [x] `git diff --check`; исключить generated SSR artifacts из diff.
- [x] Завершить визуальное сравнение browser screenshots с Pen: для актуального
  SVG renderer завершено в шаге 15 через Sail captures и read-only Pen source;
  сбой Pen Browser не выдавался за успешный capture. См. Hero audit выше.

## Первая проверка до уточнения desktop interaction — 2026-10-17

Sail: `node --test` для `serviceCloud.test.js`, `signalOrbitGeometry.test.js`
и `signalOrbitPointer.test.js` — `15/15` (6 cloud lifecycle + 9 backup cases).
Покрыты время/режим/тема, reduced motion, пауза без скачка времени, context
loss/recovery, отказ WebGL/атласа, cleanup и завершение загрузки после unmount.
Отдельная regression assertion проверяет media state до доставки change event:
последний активный кадр рисует `u_static=1` перед остановкой RAF.
`npm run build` в Sail — client и SSR успешно. Generated SSR files исключены
из diff; `git diff --check` проходит. SHA-256 всех 48 PNG и backup совпадают
с manifest; прежние pointer/geometry файлы не изменены.

Live Browser, light/dark, без horizontal overflow:

| Viewport | Header / Hero, px | Content width, px | Canvas, px | Shader mode |
| --- | ---: | ---: | --- | --- |
| 360×800 | 64 / 560 | 320 | 360×560 | 3 orbits |
| 390×844 | 64 / 560 | 350 | 390×560 | 3 orbits |
| 768×1024 | 88 / 800 | 600 | 768×800 | 3 orbits |
| 1440×1080 | 96 / 984 | 580 | 580×620 | Fibonacci sphere |
| 2560×1440 | 112 / 1328 | 820 | 900×920 | Fibonacci sphere |

На каждой ширине: ready shader, один `h1`, content внутри Hero, CTA labels
в одну строку, destinations `/register` и `#pricing`, canvas decorative и
`pointer-events: none`. Desktop scrollbar занимает 15 px; центрирование идёт
по фактическому client width. Дополнительно `1199/1200/1920/2560 px`:
content помещается, overflow `0`, shader переключается в sphere ровно с `1200`.

Видимый WebGL renderer проверен через uniforms и framebuffer: `u_time` растёт,
кадры `t=0/10` различаются и содержат логотипы; GL error `0`. При fixed static
time light/dark atlas даёт разные RGB и одинаковый alpha footprint. Reduced
motion при загрузке и переключении даёт `u_static=1`, RAF остановлен; снятие
настройки возобновляет движение. Forced colors: canvas скрыт, RAF остановлен.
На mobile прокрутка за Hero останавливает loop, возврат наверх возобновляет его.

Backup smoke выполнен через временную смену Vue prop в Browser: явный
`variant="signal-orbit"` и последующий mount Service Cloud с временно
недоступным native WebGL context оба показывают прежний Hero, один `h1`, оба
исходных SVG path и прежние CTA, без overflow. На `1440×1080` native CDP mouse
stream меняет оба path синхронно и возвращает точную Pen geometry после покоя.
Тестовые подмены удалены, основной Service Cloud восстановлен.

Ограничение: screenshot capture повторно блокировался `A capture is already
running`; после перезапуска браузера завершены перечисленные DOM/WebGL checks
без новых screenshot requests. Дополнительный сбой открытия sidebar устранён
перезапуском владельца. Полная screenshot matrix остаётся открытой; шаг 6
не начат, исходный Pen не изменён.

Команды проверки (только Sail):

```bash
./vendor/bin/sail node --test tests/Unit/Frontend/serviceCloud.test.js tests/Unit/Frontend/signalOrbitGeometry.test.js tests/Unit/Frontend/signalOrbitPointer.test.js
./vendor/bin/sail npm run build
git diff --check
```

## История проверки hover/drag до ambient-уточнения — 2026-10-17

- [x] Сверить hero236: официальный description и live preview внутри страницы
  блока подтверждают interactive icon cloud с pointer inertia и drag.
- [x] Заменить desktop fixed-time rotation на два угла от mouse hover/drag.
  В покое сохранять ориентацию, прекращать RAF после затухания, не сбрасывать
  сферу в начальную позу при каждом уходе мыши.
- [x] Сохранить geometry, typography, theme assets и mobile/tablet animation.
  Orbit branch совпадает с `service-cloud.pen.glsl`; SHA-256 backup Hero
  совпадает с manifest. Layout template `ServiceCloudHero.vue` не изменён.
- [x] Добавить regression tests: idle/center, обе оси/направления, speed от
  расстояния до центра, drag/capture/release, инерция и прекращение RAF,
  mobile/tablet/touch/coarse/reduced gating и cleanup во время drag.
- [x] Sail `node --test`: `20/20` (11 Service Cloud + 9 Signal Orbit).
- [x] Sail production client/SSR build и `git diff --check` проходят;
  generated SSR artifacts исключены из diff.
- [x] Live native CDP hover на `1440×1080`/`2560×1440`: `u_rotation` меняет
  обе оси, обратный угол canvas меняет знак угловой скорости, GL error `0`.
- [x] Native mouse drag: `gotpointercapture`, движение за bounds canvas,
  `pointerup` на canvas и `lostpointercapture` подтверждены; capture освобождён,
  dragging false. При CDP drag указывать `button: left` и `buttons: 1` на move.
- [x] После ухода мыши углы продолжают меняться по инерции, затем остаются
  стабильными; `running=false`, без autoplay. Reduced motion: `u_static=1`,
  `interactive=false`, `pointer-events:none`, RAF отсутствует.
- [x] Light/dark matrix `360/390/768/1440/2560`: content внутри Hero,
  horizontal overflow `0`, GL error `0`. Mobile/tablet `u_orbit=1`, время
  увеличивается, interactive false; desktop `u_orbit=0`, в покое running false,
  orbit clock не растёт. Cloud geometry `580×620` и `900×920` сохранена.

Все временные Browser probes удалены, theme восстановлена по сохранённому
выбору. Скриншоты не запрашивались из-за известного сбоя capture; открытая
screenshot matrix выше остаётся отдельной проверкой. Pen не изменён.

## Актуальное уточнение — фоновое движение до hover

Владелец уточнил: sphere должна двигаться и до первого наведения. Добавлена
ambient yaw velocity `0.105 rad/s`; hover и drag продолжают управлять обоими
углами, после leave/release скорость за `400ms` time constant плавно стремится
к `(0, 0.105)`. Ориентация сохраняется, нового time-based loop в shader нет.
Центр hover может затормозить сферу, удержание drag фиксирует выбранную позу;
после завершения снова действует ambient motion. Предыдущие требования к idle
статике и прекращению RAF из исторического раздела выше этим superseded.

- [x] Regression проверяет вращение до любых pointer events, hover steering,
  плавный переход от обратной инерции к ambient velocity, drag/release и
  восстановление ambient после lifecycle pause без stale pointer input.
- [x] Все `20/20` Hero tests в Sail и client/SSR build проходят.
- [x] В видимом Browser `1440×1080`: до hover yaw меняется; после native hover
  работают обе оси; спустя затухание pitch стабилен, yaw за `250ms` растёт на
  `0.02626 rad` (около `0.105 rad/s`), running true, GL error `0`.
- [x] Light/dark `768/2560`: планшетные орбиты продолжают прежнее движение,
  desktop ambient вращается до hover, overflow `0`, GL error `0`.
- [x] Reduced motion: `u_static=1`, running/interactive false; снятие настройки
  возвращает ambient. Coarse/touch gating и background/offscreen pause сохранены.
- [x] `git diff --check`; generated SSR files исключены из diff. Layout,
  mobile/tablet shader branch и запасной Signal Orbit не менялись.
