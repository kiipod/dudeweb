# Полная ссылка приглашения

Дата: 2026-10-22. Уточнение владельца в рамках шага 15.

«Пригласить друга» использует тот же readonly input общего `CopyableLink`,
что Dashboard/Connection. Native value содержит исходный server URL целиком,
включая `https://`, path, query и fragment. Доступное имя — «Ссылка приглашения».
Клик/тап выделяет полное значение; Ctrl+C и кнопка копируют его без изменений.
Длинная строка прокручивается внутри поля, не увеличивая ширину страницы.

Удалены masked `displayUrl` и неиспользуемый `displayValue` prop. При смене
канала поле получает актуальную web/Telegram ссылку; share/copy feedback и
fallback сохраняются. Referral row использует существующий контрастный
`interface-field-border`, как другие native fields. Radius, spacing, fill
и button presentation сохранены. Из clipping audit удалено устаревшее
исключение для masked referral span; surface audit явно учитывает новую
field boundary. Backend, server URLs и Pen не менялись.

Это явное уточнение владельца к прежнему compact preview; старые результаты
приёмки описывают соответствующие прежние build и не объявляются повторными
результатами текущей правки.

Первый browser run: 87 passed / 28 failed. В новой проверке кнопочного
копирования глобальный `getByRole('status')` захватывал также статусы других
блоков Dashboard/Connection. Локатор ограничен самим CopyableLink; изменения
production UI по этому результату не понадобились. Referral cases проходили.

Итоговый Sail browser: **115/115 за 59.0s** (`connection-url` 68 и
`account-referral` 47), отдельно **20/20 Referral surface/detail за 12.0s**;
в обоих чистых reports — 0 unexpected/skipped/flaky/errors. Native-copy
matrix включает web/Telegram приглашения и прежние Dashboard/Connection
на семи ширинах 320–2560 px в обеих темах, реальный Ctrl+C и button copy,
12 touch-selection cases, focus/field contrast, resize и page overflow.
Старые share/channel/fallback и 320 px text 2× cases также проходят.
Frontend **101/101**, client/SSR build и diff check проходят. Просмотрены
mobile web и desktop Telegram field screenshots.

Итоговые reports находятся в `storage/app/pen-step15/referral-url/`:
`clean-report/index.html` и `pen-report/index.html`; JSON — `clean-results.json`
и `pen-results.json`. Физические устройства, Laravel, полный suite и
operational SSR не проверялись. Generated SSR после сборки возвращены к
исходным байтам рабочего дерева. M-12 SMTP остаётся открыт, шаг 16 не начат.
