# Шаг 7 — News Placeholders

## Цель

Реализовать блок новостей Landing V2 как статический
презентационный компонент.

Функционал новостей не планируется.

## Источник

Использовать макет Landing V2 в Pen.

## Данные

- [x] Определить количество карточек.
- [x] Перенести заголовки.
- [x] Перенести описания.
- [x] Перенести даты, если предусмотрены.
- [x] Перенести изображения.
- [x] Перенести порядок карточек.

Данные хранить локально.

Допустимые варианты:

- локальный массив в компоненте;
- отдельный статический data-файл.

Не создавать backend API.

## Component

- [x] Создать NewsSection, если это соответствует архитектуре.
- [x] Реализовать NewsCard, если компонент переиспользуется.
- [x] Сохранить структуру Pen.
- [x] Реализовать responsive layout.
- [x] Реализовать предусмотренный slider, если он есть в макете.

## Links

Не создавать несуществующие страницы новостей.

Если макет содержит:

- "Читать далее";
- "Все новости";
- ссылки на отдельные публикации;

проверить, существует ли реальное назначение ссылки.

Если реального назначения нет:

- [x] не создавать фиктивный маршрут;
- [x] не использовать href="#";
- [x] не использовать неработающие кнопки;
- [x] сохранить визуальную композицию;
- [x] сделать элементы неинтерактивными либо использовать
  существующий реальный URL, если он предусмотрен.

Не создавать заглушечные страницы статей без отдельного требования.

## Запрещено

- [x] Не создавать migrations.
- [x] Не создавать News model.
- [x] Не создавать NewsController.
- [x] Не создавать News API.
- [x] Не создавать административный CRUD.
- [x] Не создавать CMS integration.
- [x] Не создавать scheduler для новостей.
- [x] Не подключать внешний news feed.

## Проверка

- [x] Новости соответствуют Pen.
- [x] Карточки отображаются.
- [x] Изображения загружаются.
- [x] Даты и тексты корректны.
- [x] Mobile layout работает.
- [x] Нет неработающих интерактивных элементов.
- [x] Нет новых backend endpoints.
- [x] Нет migrations.
- [x] Нет новых таблиц.
- [x] Build проходит.

## Результаты проверки — 2026-11-06

Контракт и полная evidence matrix:
[news-contract.md](../../../docs/landing-v2/news-contract.md).
Живым Pen MCP повторно изучены News frames всех восьми widths и current
`nmCRU`. Source Pen не менялся. Выбраны `frontend-design`,
`vue-best-practices`, `tailwind-best-practices`, Pen `pen-dev`.

Созданы `LandingV2News`, повторяемый `LandingV2NewsCard` и локальный data-файл.
Три карточки сохранены в исходном порядке: Нидерланды / обслуживание / сервис
восстановлен, даты 4/2/3 ноября 2026. Covers — исходные JPEG из foundation,
тексты — semantic h3, dates — time с ISO datetime. Переносы заголовков сохранены.
Отметки descriptions/slider означают подтверждённое отсутствие в source:
описаний, carousel, автопрокрутки или дополнительных controls не добавлено.

Поиск не обнаружил реальных News destinations, href в Pen отсутствуют.
«Все новости» представлен span с исходной lavender composition и декоративной
стрелкой. Articles и label не интерактивны, без fake links/routes, dead buttons,
tabindex и hover/focus affordances. Варианты hover из source относятся к
настоящим links и не применяются к статической презентации этого шага.

Mobile — колонка; 768 — три горизонтальных article rows с covers 216×216;
1024+ — три columns, master с source insets и content cap 2000px.
Подключение после Connection, старые sections не изменены.

Проверки через Sail:

- **115 Playwright passed**: 18 news + 97 regression tests этапов 02–06.
  Восемь reference widths × light/dark, точные titles/categories/dates/order,
  intrinsic image decode, cover geometry/radius/object-fit, header typography,
  tablet/desktop layout, отсутствие interactive controls и fetch/XHR requests.
- **10 Laravel tests / 105 assertions**, **2 SSR unit tests**.
- `npm run build`: успешные client + SSR build.
- **6/6 controlled built-bundle hydration**: News section и первая article
  сохранены, три карточки и dates присутствуют, без JS/hydration errors.
- `artisan route:list --json` до/после побайтово совпадает. Новых PHP/backend,
  database/migration/schema files, News endpoints, CMS/CRUD/scheduler/feed нет.
  Production schema не затрагивалась и отдельно не инспектировалась.
- **16/16 baseline comparisons старой `/`** без различий. Shared components,
  routes, исходные assets, dependencies и theme store не менялись.
- Дополнительные widths 320–3840, reduced motion, forced colors, keyboard и
  pointer проверены; label/headlines не запускают действий и не входят в Tab.
- Browser snapshots 390/768/2560 просмотрены рядом с Pen; 1024/1440 сохранены.
  Header height отличается от native Pen менее чем на 1px; outer frame нет.
- `git diff --check`; generated `bootstrap/ssr/*` восстановлены и исключены
  из commit.

Это локальная приёмка статических placeholders, не physical-device или
production acceptance. Шаг 08 и последующие этапы не выполнялись.
Overview DoD остаётся финальному этапу.

## Commit

feat: add static landing v2 news section
