# Шаг 2 — Routing and Architecture

## Цель

Подготовить изолированную архитектуру Landing V2
и добавить маршрут /landing.

## Зависимости

- docs/landing-v2/design-inventory.md

## Анализ проекта

- [ ] Найти существующий маршрут /.
- [ ] Найти Controller или route handler главной страницы.
- [ ] Найти frontend entry point.
- [ ] Проверить структуру страниц.
- [ ] Проверить используемые layouts.
- [ ] Проверить shared components.
- [ ] Проверить текущую систему маршрутизации.

## Routing

- [ ] Добавить GET /landing.
- [ ] Использовать существующий routing mechanism.
- [ ] Создать отдельную frontend page для Landing V2.
- [ ] Не изменять обработчик GET /.
- [ ] Не добавлять redirect / → /landing.
- [ ] Не изменять существующие middleware без необходимости.

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

- [ ] Найти компоненты, пригодные для переиспользования.
- [ ] Проверить влияние изменений на существующий сайт.
- [ ] Определить V2-specific components.
- [ ] Не изменять общие стили без необходимости.
- [ ] Избегать конфликтов CSS.

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

- [ ] /landing открывается.
- [ ] / продолжает работать.
- [ ] Нет конфликта маршрутов.
- [ ] Новый layout не ломает старые страницы.
- [ ] Production build проходит.
- [ ] implementation-map.md создан.

## Commit

feat: add isolated landing v2 route
