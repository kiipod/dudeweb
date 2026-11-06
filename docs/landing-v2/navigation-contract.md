# Landing V2 — Navigation Contract

Актуализация после этапа 09: все три реальных section targets уже подключены;
`#pricing` получил `tabindex=-1`. Keyboard navigation, повторный тот же hash,
scroll restoration и cleanup на полной странице проверены в
[Interactions Contract](interactions-contract.md). Указания на будущие targets
и test-only fixtures ниже относятся к историческому состоянию этапа 04.

Этап 04, 2026-11-05. Источники: [inventory](design-inventory.md),
[foundation](foundation-contract.md) и повторное живое чтение восьми header
frames, `Vvmix`, `TPQzW`, `X41iV` через Pen MCP. Master — `P4tz1` в `KwQuD`.

## Решения до реализации

Белый фон `#FFFFFF`, текст `#202126`, controls `#F8F9FC` с border `#E1E5ED`,
CTA `#8E9BFF`, hover/focus `#4F55D8`. Оригинальный Razor Loop 44×36 и Plex Sans;
wordmark 600, login 600, header CTA 700, nav normal. Палитра и типографика
продолжают foundation. Desktop toolbar — три области с `space-between`:
brand / nav / controls, а не центрирование nav по viewport.

| Width | Header height | Wordmark | Controls height / font | Nav gap / font | Controls gap |
|---:|---:|---:|---|---|---:|
| 360 | 72 | 20 | 44 / 14 | hidden | 8 |
| 390 / 430 | 76 | 20 | 44 / 14 | hidden | 8 |
| 768 | 80 | 22 | 44 / 14 | hidden | 12 |
| 1024 | 88 | 22 | 44 / 14 | hidden | 12 |
| 1440 | 88 | 23 | 48 / 16 | 30 / 16 | 12 |
| 1920 | 96 | 25 | 54 / 18 | 40 / 18 | 12 |
| 2560 | 112 | 26 | 58 / 19 | 48 / 20 | 14 |

Общие поля и cap 2000px берутся из foundation. Toolbar остаётся в обычном
потоке: в Pen не задан sticky/fixed contract. Full-screen open menu фиксируется
относительно viewport, без backdrop/dimming. До 768 header CTA скрыта; с 768
есть CTA и hamburger, с 1440 — nav и CTA без hamburger. Размер hamburger 44,
icon 22, radius 10. Radius actions mobile/tablet+desktop/master: 10/12/13.
Login padding 14/18/24, CTA 18 на tablet, 24 на 1440/1920, 30 на master.
Выше 1440 размеры интерполируются до master; высоты compact header следуют
ступеням reference widths. Для 320px сохраняются mobile controls и logo.

## Компоненты и data flow

- `LandingV2Header`: владелец open и active hash; resize-close и navigation.
- `LandingV2HeaderBar`: одна toolbar composition для закрытой шапки и open
  panel; props `menuOpen`, `activeHash`, emits `toggle-menu`, `navigate`.
- `LandingV2MobileMenu`: props `open`, `activeHash`; emits `close`, `navigate`;
  dialog, transitions, `useOverlay`, без самостоятельного open store.
- `LandingV2NavLinks`: fixed `desktop/menu` variant, active hash, три anchors;
  emits `navigate` при обычной активации mobile anchor, modified clicks native.
- `LandingV2Action`: fixed `login/trial/menuTrial` variants и href, Inertia Link.
- `landingV2Navigation.js`: общий локальный список anchors и auth destinations.

Header подключается в существующий header slot `LandingV2Layout` через
поддерживаемую установленным Inertia функцию persistent layout. Main остаётся
единственным. Open dialog находится рядом с исходной шапкой внутри V2 shell:
нет transformed/overflow ancestors, tokens наследуются. Teleport не нужен;
его перенос в body потребовал бы повторного V2 theme boundary.

## Links и взаимодействие

`Преимущества → #advantages`, `Устройства → #devices`, `Тарифы → #pricing`.
Brand → `/landing`, login → `/login`, trial → `/register`. Это существующие
маршруты, guest middleware сохраняет своё поведение для authenticated user.
Pen задаёт labels, но не href: destinations — implementation mapping V2-Q01,
не новые свойства Pen. Dropdown отсутствует. Active соответствует текущему
hash и отмечается `aria-current="location"`, без придуманного scrollspy.

Целевые V2 sections появятся в шагах 05/06/08. На шаге 04 anchor mechanics
проверяются с test-only targets реальных будущих IDs. Пустые секции, скрытые
заглушки и переходы на секции старой главной в production не добавляются.
Проверка реальных section destinations остаётся финальному этапу.

Open state: toolbar и panel по `WdCEY`, links 30px/1.5, tracking −0.8,
gap 24, panel top 52, bottom 24, общие боковые поля; CTA 48px, radius 8,
15px/500. Panel растёт по viewport, прокручивается при нехватке высоты.
Открытие 280ms, opacity 0→1, links translateY 8→0, stagger до 35ms;
закрытие 200ms. При reduced motion нет transforms/delays/transitions.

`useOverlay` переиспользуется без изменений: проверены VueUse 15
`useEventListener`, cleanup, focus trap/restore, Escape, inert и scroll lock.
Первый фокус — первая ссылка, close button доступна внутри dialog. На resize
в desktop меню закрывается; фокус переводится к видимому brand. Navigation
закрывает overlay до hash scroll/focus, чтобы restore trigger не сбрасывал
позицию. Background inert только пока open; уход со страницы освобождает lock.
Layout/media не меняют initial SSR/client markup: меню изначально закрыто,
active hash обновляется после mount. Responsive layout реализуется CSS.

## Проверка

Проверено 2026-11-05. Все runtime-команды выполнены через Sail:

| Проверка | Результат |
|---|---|
| `npm run build` | Client + SSR build успешны, Vite 8.3.4 |
| `npx playwright test --project=landing-v2-navigation --project=landing-v2-foundation --project=landing-v2-routing` | **55 passed**: 30 navigation, 19 foundation, 6 routing |
| `node --test tests/Unit/Frontend/landingV2Foundation.test.js` | **2 passed**, layout/default и optional slots сохраняют SSR contract |
| `artisan test --filter='Landing(Test\|V2Test)'` | **8 passed / 95 assertions** |
| Собранный V2 SSR bundle | **6/6** controlled cases: 390/1440/2560 × light/dark; header и h1 гидратируются с сохранением DOM, нет JS/hydration errors; mobile menu после hydration открывается и закрывается с восстановлением фокуса |
| Главная `/` | **16/16** pre-foundation baseline samples без различий, восемь ширин × две темы, шесть областей страницы |
| Source isolation | `PublicHeader`, `PublicMobileMenu`, `PublicLayout`, shared `useOverlay`/`UiIcon`, PHP/routes, dependencies и theme store не изменены |
| Diff | `git diff --check`, перед commit `git diff --cached --check`; generated `bootstrap/ssr/*` исключены |

Browser matrix измеряет header height/gutters, mark 44×36, wordmark и control
fonts, padding/radius, nav gaps и равные интервалы `space-between`. На восьми
reference widths нет horizontal overflow и сохраняется исходный site theme
preference. Source header position — обычный поток, dropdown не добавлен.
Мобильные control targets 44×44, tablet CTA доступна с 768, desktop nav с 1440.

Отдельно проверены пять mobile/tablet widths с Enter/Tab/Shift+Tab/Escape,
focus trap/restore, inert main, scroll lock/release; touch tap и close button;
resize в desktop, быстрый reopen, auth navigation/unmount cleanup. Для short
viewport 320×280 последний CTA доступен через keyboard и scroll без overflow.
Forced colors сохраняет видимый focus, reduced motion убирает delays/transforms.

Menu geometry 390×720 совпала с source: первая ссылка в y=128,
CTA x=20/y=648/w=350/h=48. В CSS-state проверке opening 280ms, stagger
0/17.5/35ms; link transitions 245ms укладываются в общий interval 280ms,
closing 200ms. Исправлен обнаруженный specificity conflict: при reduced motion
третья ссылка больше не сохраняет задержку. Это controlled Chromium/CSS-state
проверки, не physical-device или полный motion acceptance.

Проверены реальные переходы `/landing → /login`, `/landing → /register`,
возврат Back и brand `/landing`. Anchors проверены с test-only section targets:
native desktop navigation, history/active state и mobile close-before-scroll,
focus и повторный выбор того же hash. **На текущем `/landing` целевых content
sections ещё нет**: href mapping подготовлен, живая navigation ко всем трём
секциям проверяется после шагов 05/06/08. Для keyboard focus будущие section
targets должны иметь `tabindex="-1"`; будущий footer включается в background
contract через `data-v2-menu-background`.

Просмотрены browser screenshots header на 390/768/2560 и open menu 390×720,
сопоставлены с живым Pen; screenshot 1440 также сохранён. Артефакты в ignored
`test-results/landing-v2-navigation-*/header-{width}.png`, `menu-390.png`.
Source text bounds округляются Pen, browser metrics дают максимальное отличие
nav x **3.44px на 2560**; structural equal spacing проверен с допуском 0.1px,
координата source — 4px. Нет искусственных pixel offsets для подгонки текста.
Это не заявление о полном pixel-perfect acceptance всех экранов.

Локальные comparison/hydration scripts и результаты находятся в ignored
`storage/framework/testing/landing-v2-foundation/`: `verify-home.mjs`,
`home-before.json`, `home-after.json`, `verify-hydration.mjs`. Изолированный
SSR renderer запускается на свободном loopback port и останавливается после
проверки; постоянные SSR service/config и production environment не менялись.

Scope проверки — header/menu. Hero, остальные секции и production deployment
сюда не входят. Изменения прежних foundation/routing tests адаптируют только
добавление header, второй экземпляр logo и responsive header radius; прежние
проверки главной, theme preference, route isolation, assets/type/spacing
сохранены. Отдельная palette/radius проверка master теперь явно использует
2560px; новая header matrix проверяет radius 10/12/13 на каждом адаптиве.
