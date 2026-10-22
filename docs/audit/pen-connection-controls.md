# Селекторы и действия инструкции подключения

Дата: 2026-10-22. Уточнение владельца в рамках шага 15.

## Решение

- В первом пункте «Подключения» стрелка выбора приложения выровнена по
  вертикальному центру и отнесена от правого края на тот же отступ, что
  используется слева у текста. Дополнительное место справа защищает текст
  от пересечения со стрелкой.
- Проверены все native `select` в `resources/js`: второй расположен в
  «Пригласить друга» («Куда приглашаем»). Оба используют общий `BaseSelect`.
  Он сохраняет native select, options, v-model, label/id/name и disabled;
  в forced colors возвращается системная стрелка браузера.
- Download action первого пункта оформлен основной кнопкой с label
  «Скачать». Во втором пункте «Добавить подписку» использует тот же стиль.
  Высота совпадает с соседним селектором: 56 px на mobile, 60 px на tablet,
  64–72 px на desktop/QHD. До 768 px кнопки заполняют ширину содержимого
  карточки, начиная с tablet ширина определяется текстом и штатными отступами.
- `BaseButton` поддерживает `href`: navigation сохраняет обычный anchor,
  external target/rel и server-prepared URL, включая import scheme. Внешний
  адрес не переписывается и не открывается через JavaScript. Disabled/loading
  navigation теряет href и Tab stop; обычные submit/buttons сохраняют native
  disabled. Keyboard focus и отсутствие outline при click/tap сохранены.

## Source и границы

Live read-only Pen Get: Connection mobile `QjIv0`, tablet `U7Wfs`, desktop
`aVoTp`, QHD `gxlsa`; проверен также referral `QIQ4z`. Connection source
показывает свёрнутые шаги: padding 14/20/24 px, gap 12/16 px и chevrons
20/24 px. Раскрытый select и новые CTA не объявляются literal Pen match:
это явное уточнение владельца поверх существующих interface tokens.
Pen не изменялся. Backend catalogue и персональные URL не менялись.

## Проверка

`account-connection` проверяет оба раскрытых шага на
320/360/390/768/1024/1440/1920/2560 px в light/dark: центр и отступ стрелки,
резерв для текста, высоту/ширину кнопок, отсутствие underline и pointer
outline, точные href/targets, отсутствие page overflow. Дополнительно —
320 px с текстом 2×, native ArrowDown/Tab, keyboard ring и forced colors.
`account-referral` проверяет ту же геометрию второго селектора и текущие
share/copy/channel flows.

Первый browser run: 69 passed / 16 failed из-за ошибочной новой проверки
`outlineWidth === 0px`. При `outline-style: none` Chromium сохраняет computed
medium width 3 px; тест исправлен на фактический `outline-style: none`.
Production исправлений по этому результату не потребовалось.

Итоговый Sail browser run: **329/329 за 5.3 минуты**, 5 projects
(`account-connection` 38, `account-referral` 47, `interactive-states` 62,
`pointer-focus` 86, `control-presentation` 96), без failed/skipped/flaky.
Frontend — **86/86**; client/SSR build и `git diff --check` проходят.
Отдельный mobile hit-target smoke обеих CTA прошёл; screenshot второго
шага без перекрытия fixed navigation проверен вместе с mobile/desktop
Connection и tablet Referral screenshots.

Итоговые результаты и report сохранены в
`storage/app/pen-step15/connection-controls/` и скопированы из Sail в workspace:
`final-report/index.html`, `final-results.json`, `mobile-subscribe.png`.
Полный suite, Laravel и operational SSR не повторялись. Generated SSR после
успешной сборки возвращены к исходным байтам рабочего дерева.
M-12 SMTP остаётся открыт; шаг 16 не начат, commit не создавался.

## Уточнение — несколько вариантов скачивания

По следующему запросу владельца у download buttons первого шага с несколькими
ссылками добавлена вторая строка примечания. Windows/macOS показывают
`amd64`/`arm64`; Linux — формат и архитектуру: `.deb (x64)`, `.deb (arm64)`,
`.rpm (x64)`, `.rpm (arm64)`, `.arch (x64)`/`(arm64)`, `AppImage (x64)`.
Google Play/APK и App Store RU/Global также сохраняют различимые подписи.
Одиночный download action остаётся «Скачать»; подпись import action сохранена.

`connectionDownloadNote` использует server label и pathname конкретной
download URL. Query parameters не используются для определения архитектуры;
неизвестный вариант сохраняет исходную подпись. Backend catalogue, URL и
Pen не менялись. Существующий button slot принимает обе строки, их цвет
сохраняет основной button foreground, высота может вырасти по содержимому.

Sail: **102/102 account-connection browser tests за 1.1 минуты**, включая
64 сценария всех восьми multi-download app/platform combinations из реального
`resources/data/connection-apps.json` на 320/768/1440/2560 px в обеих темах.
Проверены точные accessible names, href/target, hit targets и отсутствие
overflow; прежние 38 connection scenarios также проходят. Frontend
**101/101**, включая 15 новых formatter cases; client/SSR build и diff check
проходят. Generated SSR сохранены byte-for-byte относительно начала правки.
Скриншоты Linux mobile и Windows desktop просмотрены.

Report: `storage/app/pen-step15/download-notes/final-report/index.html`;
JSON: `final-results.json` в той же директории. Прежние 329/329 выше относятся
к предыдущему build; полный suite/Laravel/operational SSR не повторялись.

## Уточнение — заголовки блоков и отступы

По запросу владельца после платформ добавлен небольшой h2 «Ваша ссылка для
подключения», затем h2 «Инструкция для подключения» перед шагами. Оба блока
используют существующие `connection-section` spacing и `interface-body`
typography с semibold: перед заголовком дополнительно 12 px к родительскому
gap 12 px, между заголовком и содержимым 12 px. Заголовки также именуют
section через `aria-labelledby`; ссылка и недоступное состояние находятся
в одном блоке. Loading/error flow сохранён.

Обновлены implementation selectors существующей surface/detail matrix
(30 selectors в JSON), raw Pen measurements не менялись. Новые заголовки
и отступы — явное уточнение владельца, Pen не изменялся.

Sail: **38/38 account-connection** за 21.7s и **20/20 Connection surface/detail**
за 12.0s; client/SSR build и diff check проходят. Проверены заголовки/regions
на восьми ширинах 320–2560 px в обеих темах, text 2× и прежние actions;
mobile light и desktop dark screenshots просмотрены. Generated SSR сохранены
byte-for-byte. Frontend unit, полный suite, Laravel и operational SSR не
повторялись; предыдущие результаты относятся к предыдущим build.
Reports: `storage/app/pen-step15/connection-headings/account-report/index.html`
и `pen-report/index.html`, JSON — `account-results.json` и `pen-results.json`.
