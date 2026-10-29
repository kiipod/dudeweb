# Синхронизация согласованных frontend-правок с Pen

Дата: 2026-10-26. Владелец явно поручил перенести изменения frontend в макет
Pen. Это разрешение изменять документ заменяет прежнее read-only ограничение
для перечисленного ниже scope. Git-коммит и переход к шагу 16 не входят
в поручение. Прежние незакоммиченные исходники сохранены.

Документ: `dudeweb.pen`, live Pencil MCP, document id
`d241f6ea-c3a7-4b71-9981-19aef7200bef`.
Исходное состояние: 215 top-level frames, 10 reusable components.
После синхронизации: 216 top-level frames, 13 reusable components.
Файл Pen не читался и не редактировался через файловую систему.

## Обновлённые экраны

- В 104 композициях кабинета (девять страниц, обе темы, mobile/tablet/
  desktop/Full HD/QHD и существующие открытые панели) установлены интервалы
  секций/групп: **24/16**, **20/12**, **24/16** px соответственно. На больших
  desktop-интервалах роста нет. Для этих ролей добавлены шесть Pen variables.
  Внутренние компактные интервалы карточек/полей сохранены; сообщения
  переписки объединены с gap 12 px.
- В Subscription checkout, Profile security/theme, Support list/form,
  Referral rewards и Connection введены структурные группы, соответствующие
  границам компонентов frontend. Это исключает применение внешнего gap
  между каждой подписью, полем или строкой карточки.
- Во всех десяти композициях Connection «Устройство» использует основной
  цвет текста и weight 600. Заголовки URL и инструкции представлены тем же
  body/semibold стилем. Прежние шаги и их содержимое сохранены.
- В 44 композициях Dashboard/Connection/Support list/Conversation добавлена
  кнопка обновления справа от заголовка. Mobile: иконка 44×44 и выравнивание
  сверху. Tablet: 44 px, иконка с текстом; desktop: 48–52 px. С 768 px нижние
  края заголовка и кнопки совпадают. Описание занимает ширину под строкой.
  Две reusable-компоненты refresh используют текущие light/dark цвета
  `accent-text`, `accent-soft`, `accent-border` через пять новых palette
  variables, общих с третьей reusable-компонентой Profile Accent Action.
- Во всех десяти Profile добавлены «Изменить данные» и «Привязать» с одним
  accent/small оформлением (40 px, font 13/600), username и Telegram context.
  «Завершить другие сеансы» — самостоятельное действие без шеврона, пароля
  и подтверждения. Сохранены disclosure смены пароля и отдельный logout.
  Выбор темы отражает существующие варианты frontend: светлая/тёмная.
- 94 существующие текстовые ссылки auth/account приведены к weight 700
  без underline; их цвет, размер и содержимое сохранены.

Длинные композиции расширены по высоте для просмотра всего содержимого:
Pen canvas не воспроизводит прокрутку приложения. Устранены наложения
расширенных экранов на соседние frames; ширины responsive-вариантов сохранены.

## Формы и взаимодействия

Поведение записано в `context` соответствующих слоёв, включая descendant
paths компонентных экземпляров. Это спецификация для реализации, а не
исполняемый touch/server prototype в Pen.

| Форма | Начальная цель фокуса |
| --- | --- |
| Login / Register / Password Recovery | Email |
| Reset Password | Новый пароль; editable Email, если email неизвестен |
| Profile identity | Username |
| Profile password | Текущий пароль |
| New Support Ticket | Тема обращения |
| Support Conversation | Видимая textarea ответа |
| Promo | Поле промокода внутри focus trap |

Записаны правила единственного фокуса при появлении формы, исключения для
hidden/readonly/disabled, продолжение Tab, отсутствие перехвата при вводе/
ошибках, повторное открытие, видимость reply и сохранение черновика.
Для auth сохраняется preventScroll; в кабинете допустима прокрутка к полю.

Контракты touch записаны для 14 существующих account panels (More/Promo)
и трёх публичных Menu Open frames. При ширине <1200 px завершённый свайп
одним пальцем вниз от 64 px с `dy > 1.25 × abs(dx)` закрывает панель, если
она и вложенные scroll containers находятся вверху. Editable, busy,
короткие/горизонтальные/вверх/cancel/multi жесты исключены. Desktop promo
свайпом не закрывается; close сохраняет focus restore и scroll unlock.

На новой доске **W · Frontend Sync · Components & Interaction Contracts ·
2026-10-26** (`sLiqn`) размещены shared actions, примеры открытых форм профиля
в обеих темах, refresh loading/disabled, варианты success/error завершения
сеансов и доступность действия без установленного пароля. Success и error
показаны как альтернативные варианты обратной связи. Добавлены краткие
спецификации всех принятых изменений и checklist проверки.

## Проверка Pen

- Повторное чтение live document: все 104 section gaps совпадают с матрицей.
- Геометрия всех 44 title/refresh rows: отклонений выравнивания нет.
- Все десять Connection legends: foreground темы и weight 600.
- Все десять session actions: правильная подпись, отсутствие шеврона;
  одинаковая reusable-компонента у обеих accent-кнопок профиля.
- Проверены context autofocus на существующих auth/account input layers и
  промокодах, включая refs, и context всех 17 menu/promo compositions.
- После завершения все root placeholders сняты. Повторный обход с
  `resolveInstances: true`: обрезаний в обновлённых account screens и новой
  доске нет. Наложений top-level frames с участием обновлённых экранов нет.
- Просмотрены реальные Pen screenshots: mobile Dashboard/Connection и
  light Profile, tablet Connection, desktop light Conversation, заголовки
  tablet Dashboard и desktop Connection, Subscription content, identity/
  security, открытые формы профиля в обеих темах, feedback states и вся доска.

Это проверка синхронизации макета. Она не заменяет полную визуальную/
физическую accessibility-приёмку шага 15. Новые runtime-тесты не запускались:
в этом поручении код приложения не менялся. Результаты предшествующих
Sail-проверок сохранены в связанных аудитах; SMTP M-12 остаётся открыт.

Связанные записи: [spacing](pen-account-spacing.md),
[refresh](pen-page-refresh.md), [auth focus](pen-auth-initial-focus.md),
[account focus](pen-account-initial-focus.md),
[session revocation](pen-profile-session-revocation.md),
[touch](pen-mobile-swipe-dismiss.md).
