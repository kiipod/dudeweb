# Landing V2 — Animations and Interactions

## Источники и границы этапа 09

Live Pen повторно прочитан 2026-11-06: актуальные `WkEIA`, `Vvmix`, `X41iV`,
`m6JVjz`, `EUniL`, `iFKqa`, `wgSpy`, `nmCRU`, `C6Rzp`, `wrNMh`, `Rqi5w`;
Connection master/mobile/tablet и исходный `dudeweb-platform-signal.glsl`.
Устаревшее metadata «five platform traces» не заменяет 23 пары в текущем shader.
Документ Pen не меняется. Предыдущие договорённости:
[Hero](hero-contract.md), [navigation](navigation-contract.md),
[content](content-contract.md), [news](news-contract.md),
[subscription/footer](footer-cta-contract.md).

Визуальная основа сохранена: white `#FFFFFF`, ink `#202126`, secondary
`#697386`, brand `#8E9BFF`, focus `#4F55D8`; Plex Sans/Mono. Ни один новый
эффект не меняет layout, typography, copy, ширину контейнера или assets.

## Inventory и принятые решения

| Concern | Принятое поведение |
|---|---|
| Hover/pressed/focus CTA | 180ms CSS colors, source palette, постоянные bounds, 2px focus/3px offset |
| Ссылки | Hover/focus underline и accent; anchors к существующим sections |
| Scroll | Обычный document scroll; mobile Hero sticky stack 0…5, обратимый progress; без wheel/touch interception |
| Reveal/entrance/parallax | В source отсутствуют; не добавляются |
| Карточки Hero / slider | Единственный timed selector: accordion, 6 states, 4.75:1; пользователь изменил timing на 5s/30s и убрал переключатель автопоказа |
| Manual Hero | Native buttons и keyboard; manual/focus pause сохраняется до reload; временные hover/offscreen/hidden/inert pauses не догоняют пропущенные кадры |
| Dropdown | В source отсутствует; не добавляется |
| Mobile menu | 280ms enter / 200ms leave, links offset 8px, stagger ≤35ms; trap, Escape, focus restore, inert и release scroll lock |
| Connection | 23 синхронные logo/route пары, source periods 7–13s, fade-in 1.1s, hold/fade-out/hidden; pulses внутрь, пять непрерывных waves и три fronts наружу |
| News | Принятые статичные placeholders без destinations; без hover/focus обещания действия, slider или API |
| Subscription | Native 1/3/6/12 radios, 160ms underline, 180ms amount crossfade; existing server prices, CTA `/register` |
| Footer | Принятый local pointer glow/три lavender echoes; static touch/≤1024/reduced/forced colors; legal captions без ссылок по решению пользователя |

Новые секции, формы, business actions и зависимости не добавляются. Этапы
10–12 и общая production/physical accessibility acceptance остаются отдельно.

## Component map и motion lifecycle

- `landingV2Signal.js`: source geometry и чистые функции времени: presence,
  incoming/outgoing pulse positions, wave path и ring radius/opacity.
- `LandingV2Signal`: прежний SVG, refs/атрибуты для motion; static phase-0 SSR
  с 23 видимыми парами. Публичных props/emits нет; текст остаётся HTML в
  `LandingV2Connection`.
- `useLandingV2SignalMotion`: один VueUse `useRafFn` с `immediate:false`,
  `fpsLimit:30`; работает только при visible field/document, вне inert main
  и без reduced motion/forced colors. DOM refs кешируются после mount;
  кадр пишет только SVG attributes, не читает layout и не обновляет Vue tree.
- Existing Hero/menu/subscription/footer solutions сохраняются; адресные
  исправления в пределах найденных interaction defects сопровождаются checks.

CSS используется для простых transitions. Изменение sinusoidal wave geometry
и общей source phase сложнее CSS transition: отдельный gated frame callback
сохраняет одну шкалу времени для opacity, pulse и всех waves/rings без
дублирующих CSS timelines, WebGL/canvas и новых animation libraries.
На offscreen/hidden/inert кадр замораживается, RAF отменяется. Возобновление
продолжает накопленное visible время без скачка на длительность скрытой вкладки.
Reduced motion/forced colors сбрасывают phase в 0 и показывают все пары .82.
VueUse scope cleanup освобождает RAF, listeners и observers при unmount.

API/options сверены с установленным VueUse 15 и официальным
[useRafFn](https://vueuse.org/core/useraffn/). Source формулы сохраняются;
SVG gradients представляют Gaussian pulses, как в принятом static port.
Это SVG-эквивалент source motion, а не побайтовый GLSL raster renderer.

## Найденные и устранённые interaction defects

- `#pricing` отсутствовал в keyboard focus targets: добавлен `tabindex=-1`,
  чтобы существующий menu navigate завершался на реальной section. Новый
  tabbable control не создаётся; повторный выбор того же hash работает.
- Footer links имели только изменение цвета к общему ink: hover теперь даёт
  source accent и underline, keyboard focus — underline и существующий 2px
  outline. Юридические plain captions остаются обычным текстом.
- Статичный Connection заменён source motion; reduced/forced-colors остаются
  прежним полным кадром, все 23 native logos всегда присутствуют в DOM.

## Проверка lifecycle и scroll

Test-only instrumentation перехватывает registration/removal global window,
document и media-query listeners, RAF scheduling/cancellation, observe/unobserve
и disconnect для Intersection/Resize/MutationObserver. Учтены автоматические
`once`/AbortSignal removals. Handles намеренно удерживаются тестом: detached
target не скрывает пропущенный disconnect.

Три Inertia-цикла `/landing → /login → Back` с активным Connection: после
unmount нет V2 observer targets или pending RAF, global listener counts
возвращаются к одному baseline. JS document identity сохраняется, reload
не подменяет cleanup. Это проверка ресурсов в выбранном сценарии, не heap
profiling или доказательство отсутствия любых утечек браузера.

Motion frame check инструментирует `getBoundingClientRect` в signal subtree:
во время двухсекундного обновления **0 layout reads**. Bounds поля и HTML copy
не меняются. Existing mobile Hero читает только необходимые track/stage bounds
через VueUse, использует обычный scroll и не имеет собственного RAF loop.
Shared overlay оставлен прежним: geometry checks нужны для focus trap и
restore, а не для анимационного кадра.

Проверены все реальные menu anchors, повторный `#pricing`, keyboard focus,
отсутствие body lock/inert после закрытия, subscription → register → Back с
восстановлением scroll. Touch не требует hover. Signal не содержит controls,
links или tabindex; доступный Connection copy находится вне декоративного SVG.

## Проверка

Результаты заполняются после реализации и проверок через Sail.
