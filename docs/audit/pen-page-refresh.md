# Обновление данных в заголовках кабинета

Уточнение владельца: перенести существующие кнопки «Обновить данные» к правому
краю заголовка страницы и сделать заметнее. На mobile показывать только иконку.
Scope: Dashboard, Connection, Support/Index и Support/Show. Другие страницы
и действия повторной попытки в error panels сохраняют свои контракты.

Live Pen прочитан read-only: `PvBmx`, `O8T2D6`. Подтверждены IBM Plex Sans,
mobile heading 34/650, intro 16, primary text #F5F5F6, secondary #A1A1AA.
Новая позиция и оформление refresh — явное уточнение владельца к макету.
Повторное уточнение: mobile сохраняет выравнивание по верхнему краю; на
tablet/desktop кнопка выравнивается по нижнему краю строки заголовка, включая
многострочные заголовки. Это задаётся `tablet:items-end` в общем PageHeading.
Pen не меняется. Существующая light/dark palette сохраняется: accent text
#4f55d8/#8e9bff, soft fill #eef0ff/#20243d, border #7379ee/#a8b1ff.

План и component map:

- `PageRefreshButton`: одна кнопка с круговой стрелкой, accent soft fill и
  border; mobile square через existing interface-header-control, tablet+
  иконка и текст. Props `loading`, `disabled`; emit `click`. Accessible name
  всегда «Обновить данные», loading/disabled блокируют повторный запрос.
- `PageHeading`: title/actions в одной строке, описание ниже на всю ширину.
  Сохраняет default typography; компактный variant нужен для темы обращения.
  `actions` и `description` slots задают содержимое без transport logic.
- Dashboard использует существующий `useDashboardRefresh` и actions slot.
- ConnectionContent сохраняет `useConnection` и передаёт `busy`, `refreshing`,
  `refresh` в heading slot страницы. Нижняя кнопка удаляется.
- SupportRead сохраняет `useSupportRead` и передаёт `loading`, `reload` в
  heading slot. Заголовок виден при loading/error, форма ответа остаётся
  смонтированной через прежний `v-show`, чтобы не терять черновик.
- Support/Show отвечает за заголовок и status/time; SupportConversation — за
  сообщения, pagination и reply form. Routes остаются composition surfaces.

Проверка: Sail client build, browser regressions затронутых flows и отдельные
проверки геометрии, темы, mobile icon-only, keyboard, loading/duplicate intent,
длинных заголовков и text ×2. Старые незакоммиченные изменения сохраняются.

## Результаты

- Sail client и SSR builds прошли; frontend unit/SSR **103/103**.
- До последнего уточнения выравнивания полный прогон dashboard/connection/
  support: **246/246 за 1.8 минуты**, включая ошибки, повторные запросы,
  черновик ответа, device mutation, keyboard и text ×2.
- После `tablet:items-end`: client build и **80/80** focused browser checks.
  **64** compositions на 320/360/390/768/1024/1440/1920/2560 в обеих темах:
  справа ровно одна кнопка, mobile icon-only, с 768 px нижние края кнопки и
  заголовка совпадают. Дополнительно **16** keyboard/loading/duplicate checks
  на всех четырёх страницах, mobile/desktop, light/dark.
- Просмотрены новые screenshots tablet Connection и QHD Dashboard, а также
  mobile Support и desktop conversation при переносе кнопки. Сохранённые
  screenshots: `storage/app/pen-step15/page-refresh/`.
- Generated SSR восстановлены byte-for-byte к состоянию до сборки;
  `git diff --check` проходит. Backend и operational SSR не запускались;
  M-12 SMTP остаётся открыт, шаг 16 не начат, commit не создавался.
