# Начальный фокус в формах авторизации

Уточнение владельца: при открытии форм входа, регистрации и восстановления
пароля сразу фокусировать первый input. Visual layout и transport не меняются.

`useInitialFormFocus(formRef)` следит за появлением DOM-формы через Vue
template ref (`flush: post`) и фокусирует первый enabled input, исключая
hidden и readonly. `preventScroll` сохраняет положение страницы. Watch зависит
от DOM-формы, а не значений полей/ошибок: ввод и обычные перерисовки не
возвращают фокус в первое поле. Отдельное состояние и listeners не нужны.

Component map: Login/Register/ForgotPassword/ResetPassword задают ref формы
и подключают общий composable; BaseField/PasswordField сохраняют contracts.
В первых трёх формах фокусируется Email; ResetPassword с известным email —
«Новый пароль», без email — Email. Status screens без input не меняют фокус.

Проверка через Sail:

- **30/30** новых browser cases: пять вариантов форм, mobile 390 / desktop
  1440, light/dark; печать без клика, Tab, Inertia-переходы и status screens.
- **11/11** существующих auth transport scenarios: delayed network/HTTP,
  duplicate intent/retry и отмена запроса при переходе.
- **2/2** smoke на настоящем `/login`, mobile/desktop: прежний ручной
  `email.focus()` заменён проверкой автоматического фокуса; Tab/Shift+Tab и
  показ пароля продолжают работать.
- Frontend unit/SSR **103/103**, client/SSR builds и `git diff --check` прошли.
  Generated SSR восстановлены byte-for-byte. Backend/operational SSR не
  запускались, физическая мобильная клавиатура не проверялась.

Прежние незакоммиченные правки сохранены; M-12 SMTP остаётся открыт, шаг 16
не начинается, commit не создавался.

Общий composable затем расширен на editable textarea, доступность и отложенный
фокус кабинета. Auth options сохраняют прежнее поведение; все 30 auth cases
повторно прошли в итоговом browser прогоне **336/336**.
[Расширение на формы кабинета](pen-account-initial-focus.md).
