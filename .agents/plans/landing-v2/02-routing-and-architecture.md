# Шаг 2 — Routing and Architecture

## Цель

Подготовить изолированную архитектуру Landing V2
и добавить маршрут /landing.

## Зависимости

- docs/landing-v2/design-inventory.md

## Анализ проекта

- [x] Найти существующий маршрут /.
- [x] Найти Controller или route handler главной страницы.
- [x] Найти frontend entry point.
- [x] Проверить структуру страниц.
- [x] Проверить используемые layouts.
- [x] Проверить shared components.
- [x] Проверить текущую систему маршрутизации.

## Routing

- [x] Добавить GET /landing.
- [x] Использовать существующий routing mechanism.
- [x] Создать отдельную frontend page для Landing V2.
- [x] Не изменять обработчик GET /.
- [x] Не добавлять redirect / → /landing.
- [x] Не изменять существующие middleware без необходимости.

## Architecture

Выбрать структуру согласно существующим соглашениям проекта.

Возможная организация:

resources/js/
├── pages/
│   └── Landing/
│       └── Index.vue
└── components/
└── landing-v2/
├── ...
└── ...

Это пример, а не обязательные пути.

Не создавать новую архитектуру приложения ради одной страницы.

## Shared Components

- [x] Найти компоненты, пригодные для переиспользования.
- [x] Проверить влияние изменений на существующий сайт.
- [x] Определить V2-specific components.
- [x] Не изменять общие стили без необходимости.
- [x] Избегать конфликтов CSS.

## Документация

Создать:

docs/landing-v2/implementation-map.md

Указать:

- Route.
- Page component.
- Layout.
- Shared components.
- V2 components.
- Assets location.
- Section mapping.

## Проверка

- [x] /landing открывается.
- [x] / продолжает работать.
- [x] Нет конфликта маршрутов.
- [x] Новый layout не ломает старые страницы.
- [x] Production build проходит.
- [x] implementation-map.md создан.

## Результаты проверки — 2026-11-05

Созданы отдельные `LandingV2Controller`, Inertia page `Public/LandingV2`
и `LandingV2Layout`. Добавлен публичный `GET|HEAD /landing`, name `landing`,
в существующей группе `web`. Handler `GET /` и его middleware сохранены.
Каркас V2 пока показывает только brand heading; секции и оформление
относятся к следующим этапам и здесь не реализованы.

Карта: [implementation-map.md](../../../docs/landing-v2/implementation-map.md).
В ней зафиксированы entry points, route/page/layout, shared compatibility,
будущие V2 component boundaries, assets location и Pen section mapping.
Shared components, CSS/tokens, root Blade и app/SSR entry points не менялись.

Проверки выполнены через Sail:

- `artisan route:list --path=landing -vv` и `--name=home -vv`: два отдельных
  маршрута с прежним middleware stack, без конфликта и redirect.
- `artisan test --filter='Landing(Test|V2Test)'`: 8 passed / 95 assertions,
  включая 5 существующих LandingTest и 3 новых LandingV2Test.
- `npm run build`: успешны client и SSR build; новый page chunk включён.
- `npx playwright test --project=landing-v2-routing`: 6 passed,
  390/1440/2560px × light/dark, `/` → `/landing` → Back, отдельный main,
  сохранение старых header/footer и theme preference; без JS errors и
  hydration warnings.
- PHP CS Fixer: 0 исправлений из 3 затронутых PHP-файлов.
- Git diff: только route addition, новый V2 каркас, targeted tests/test config
  и документация. Generated `bootstrap/ssr/*` восстановлены после сборки.

Это локальная проверка routing/isolation, не production deployment и не
визуальная приёмка V2. Этап 03 и последующие этапы не выполнялись.

## Commit

feat: add isolated landing v2 route
