# Начальный фокус в формах личного кабинета

Уточнение владельца расширяет принятый auth autofocus на все формы кабинета,
в которых требуется ввод текста. Оформление и transport не меняются.

## Карта форм и компонентов

| Форма | Начальное поле |
| --- | --- |
| ProfileIdentity — изменение данных | Username |
| ProfileSecurity — смена пароля | Текущий пароль |
| SupportTicketForm — новое обращение | Тема обращения |
| SupportReplyForm — ответ в переписке | Ответить в обращении, textarea |
| PromoCodeSheet — промокод | Промокод |

Forms с одним действием (logout, завершение других сеансов) не требуют
ввода. Readonly links, hidden inputs, radios темы/периода/платформы не
перехватывают фокус при открытии страниц.

## Контракт

- Общий `useInitialFormFocus` расширен на textarea и проверяет доступность
  поля: enabled, editable, visible, вне inert. Ввод и обычные обновления
  ошибок не возвращают фокус в первое поле. При повторном открытии inline
  формы фокусируется её первое поле заново.
- Фокус ждёт завершения DOM-обновления; cleanup отменяет отложенное действие
  при закрытии формы. В auth сохранён `preventScroll`; формы кабинета разрешают
  нативную прокрутку к полю с учётом существующих scroll margins.
- SupportRead передаёт `visible` через scoped default slot в Conversation/
  ReplyForm. Скрытый ответ при read error не получает фокус. После recovery
  или завершения refresh поле становится доступным и получает фокус;
  существующий textarea/черновик остаётся смонтированным через `v-show`.
- BaseOverlay/useOverlay принимают предпочтительную initial-focus цель.
  Для промокода это `#promo-code`. Управление фокусом остаётся у диалога:
  Tab/Shift+Tab trap, Escape, busy state и возврат к trigger сохраняются.
  More/public menus без preferred target сохраняют прежний initial control.

В `interactive-states` добавлены 24 account cases на mobile/desktop, light/
dark: ввод без клика, Tab, повторное открытие inline/modal, возврат фокуса,
hidden/recovered reply с сохранением черновика и readonly-only page.
Прежние 30 auth cases входят в тот же прогон. В profile/subscription tests
старые ожидания initial focus на trigger/close заменены новым контрактом;
проверки disclosure и keyboard trap сохранены.

## Проверка

Итоговый Sail browser прогон: **336/336 за 2.2 минуты**, projects
`interactive-states`, `account-profile`, `account-support`,
`subscription-payment`. Проверены новые account cases и прежние auth forms,
ошибки/processing, черновики, native keyboard, focus trap/restore, rapid reopen,
touch и text ×2. Skipped/flaky/unexpected нет, JS/Vue warnings/errors нет.

Sail frontend unit/SSR **103/103**, client/SSR builds и `git diff --check`
прошли. Generated SSR восстановлены byte-for-byte к состоянию до сборки.
Backend для этой frontend-правки не менялся и повторно не запускался;
физическая экранная клавиатура не проверялась. Старые незакоммиченные
изменения сохранены, M-12 SMTP открыт, шаг 16 не начат, commit не создавался.
