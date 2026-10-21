# Детальная сверка Pen — продолжение шага 15

Дата: 2026-10-21. Ветка `pen-integration`. Pen читается без изменений через
MCP `Get` / `TakeScreenshot`; исходный encrypted файл с диска не открывался.

## Типографика

Повторно прочитаны **3932 текстовых узла в 205 route/state references** с
resolved variables/instances: family, size, weight, line-height, tracking и
fill. В browser сопоставлено 2766 точных текстовых совпадений. Ещё 1166 узлов
не сопоставлены: server-backed copy/data, закрытые состояния или отсутствующие
demo/legal элементы. Эти узлы не объявляются автоматически проверенными.

Текстовый matcher использовался для поиска кандидатов, а не как pixel baseline:
одинаковые подписи встречаются в header, sidebar и content; placeholder color
нужно читать через `::placeholder`, а не по foreground input. Из исходных
974 кандидатов нельзя выводить число defects. Каждое исправление ниже сверено
с ролью и её владельцем в реальном компоненте.

В постоянную [матрицу](pen-verification-frames.json) добавлены `typography` и
точные source node IDs: **184 heading roles, 194 brand roles и 70 control
roles**. Browser cases проверяют соответствующие font size, line-height,
letter spacing и weight. Цвет и устройство reward table, авторов переписки и
подписи тарифа проверяются отдельно. Данные и copy не меняются ради совпадения.

Подтверждённое ранее сопоставление Pen 620/650 с display 400 и IBM Plex Sans
для auth/account wordmark сохраняется. Общие primary actions используют
принятый interface-action role вместо индивидуальных body captions из Pen.

Новые focused screenshots: auth `FIFYa`, `J5fYh`, `K5e989`, `nyAmJ`,
`SIuRG`, `S9qhcv`, `FPbj2`, `zSLWV`, `v9ahT`; account `loav4`, `ge2B7`;
reference boards `A1UuUs`, `IllrB`; Q2 `mZsWc`, `q6TmU`, `pEaTp`, `IlQcC`,
`Z57ENo`. Отдельные интро/поля шириной 350px сняты целиком и читаются без
уменьшения до thumbnail полного экрана.

| ID | Подтверждённое расхождение | Исправление |
| --- | --- | --- |
| D-15-10 | У interface heading tracking 0 вместо −1.1px; например `x7pGGw` и `loav4` | Semantic `tracking-interface-heading` во всех пяти владельцах роли: PageHeading, AuthShell, PaymentResultShell, Profile, SupportTicketList |
| D-15-11 | Auth/account wordmark tracking 0 вместо −0.8px | Semantic `tracking-interface-brand`; публичные lockups используют прежнюю роль |
| D-15-12 | Пропущены weights в labels и actions | Platform legend/message label/profile row/unselected theme — 500; platform choices/back link — 600; terms link — 700. Текст terms link получает foreground, его иконки — accent |
| D-15-13 | Q2 reward values фиолетовые, моноширинные; добавлены отсутствующие в Pen разделители | Sans, `success`, без внутренних rules. В dark source `#56D6AE`; в light — контрастное semantic соответствие `#22755D` |
| D-15-14 | Customer/operator author headings одного foreground | Автор customer — accent-text, operator — success; имя остаётся явным текстом, различение не опирается только на цвет |
| D-15-15 | Single Plan Hint использовал body/secondary вместо mono/accent | Подпись server-backed тарифа рядом с «Выбери период» использует source role; summary values не меняются |
| D-15-16 | Восстановленный зелёный author на светлой operator bubble имел 4.351:1 | Light success уточнён с `#237A61` до `#22755D`: 4.648:1 на `#EFEAE1`; dark сохранён |

Для D-15-10 сначала запущены regression cases HhyAE/pd9lO на предыдущей
сборке: **2/2 воспроизвели tracking error 1.1px**. После исправления предыдущий
набор из 205 references прошёл. Финальные проверки последних visual fixes
прошли: **373/373**, включая 205 Pen и 168 responsive/a11y cases. Полный набор
перед последними color/table изменениями — **772/772**. Color regression
сначала воспроизвела пять light conversation failures 4.351:1, затем эти
references прошли с новым light success.

## Q2 — условия программы

Сверены структуры mobile/tablet/desktop, обе темы, а также Full HD/QHD:
friend benefit, ordered steps, reward table, back/forward links. Шесть
первоначальных references `paZk6/LNwLW/BYL5v/hhNkq/jSIgm/Uel2T` и четыре
дополнительных `o3YLhX/Kf2AE/nRJox/mNtiD` входят в browser matrix.

На всех десяти references проверяются четыре `<li>`, четыре строки таблицы,
`th scope="row"`, accessible caption и ссылки Q ↔ Q2. Количество дней и
скидка поступают через props; screenshot fixtures не меняют production data.

Дополнительно на всех десяти размерах/темах проверена последняя строка после
прокрутки до конца страницы: она целиком выше fixed bottom navigation, а на
desktop — внутри viewport. Минимальный запас до nav на mobile — 29px;
локальные measurements — `storage/app/pen-step15/terms-scroll.json`.

## Контраст на gradient

Финальный CTA landing проверен на 360/390/768/1440/2560 в light/dark.
Измерены все шесть текстовых ролей. Для получения фона текст временно скрыт
только в изолированном browser context; geometry и decor сохранены. Screenshot
PNG прочитан через browser canvas; для каждого text range взята сетка 5×3
точек. Foreground и критерий normal/large читаются до скрытия текста.

В выборке нет failures: минимальный ratio light **4.665:1**, dark **5.039:1**.
Это sampling отрисованного фона; он не доказывает глобальный минимум каждого
пикселя и не проверяет динамический фон Hero или другие opacity chains.
Локальные данные: `storage/app/pen-step15/gradient-contrast.json`.

## Capture и оставшиеся границы

В Pen Browser получен один успешный query screenshot `.service-hero`.
Следующий capture `main` на `/login` снова завершился timeout 60000ms.
Таким образом стабильная полная capture matrix в Pen Browser не подтверждена.
Playwright screenshots внутри Sail продолжают успешно создаваться.

Pen Browser сообщает `document.hidden=true`; renderer ожидаемо остановлен.
Это не результат проверки ambient/hover/drag в видимой вкладке. Physical
keyboard/screen reader, native zoom, touch/safe areas и background → return
ожидают результатов [ручного протокола](pen-step15-manual.md).

Открыты детальная визуальная приёмка остальных control/state/decor roles,
контраст динамического Hero и оставшихся opacity chains. Шаг 15 не закрывается
по количеству screenshots или successful assertions.
