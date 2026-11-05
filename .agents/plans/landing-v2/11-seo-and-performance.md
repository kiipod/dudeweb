# Шаг 11 — SEO and Performance

## Цель

Подготовить Landing V2 к production
без ухудшения производительности существующего сайта.

## SEO

- [ ] Настроить уникальный title для /landing.
- [ ] Настроить meta description.
- [ ] Проверить H1.
- [ ] Проверить иерархию заголовков.
- [ ] Проверить canonical.
- [ ] Проверить Open Graph, если используется.
- [ ] Проверить robots directives.
- [ ] Проверить sitemap policy.

Не менять SEO существующей главной страницы.

Если /landing — альтернативная версия главной страницы,
зафиксировать решение по canonical/indexing.
Не предполагать его автоматически.

## Performance

- [ ] Проверить JS bundle.
- [ ] Проверить CSS bundle.
- [ ] Проверить lazy loading.
- [ ] Проверить размеры изображений.
- [ ] Проверить оптимизацию шрифтов.
- [ ] Проверить CLS.
- [ ] Проверить LCP, если доступны измерения.
- [ ] Проверить scroll performance.
- [ ] Проверить animation performance.

## Build

- [ ] Запустить production build.
- [ ] Проверить отсутствие ошибок.
- [ ] Проверить assets paths.
- [ ] Проверить /landing после сборки.
- [ ] Проверить / после сборки.

## SSR

Если проект использует Inertia SSR:

- [ ] Проверить серверный рендеринг /landing.
- [ ] Проверить hydration.
- [ ] Проверить browser-only APIs.
- [ ] Проверить отсутствие SSR exceptions.
- [ ] Проверить корректность meta tags.

Не внедрять SSR, если он отсутствует в проекте.

## Проверка

- [ ] SEO metadata корректны.
- [ ] SEO главной страницы не изменено.
- [ ] Production build проходит.
- [ ] Изображения оптимизированы.
- [ ] Нет подтверждённых performance regressions.
- [ ] SSR проверен, если применимо.

## Commit

perf: optimize landing v2 for production
