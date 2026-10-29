# Закрытие мобильных панелей свайпом вниз

Владелец попросил проверить touch-управление мобильным меню и добавить
закрытие движением вниз, включая мобильную панель промокода. До этой правки
были tap/click, Escape и backdrop dismissal, но swipe-handler отсутствовал.

## Компоненты и поведение

- `useSwipeDismiss` содержит общую обработку нативных touchstart/move/end/
  cancel. BaseOverlay использует её для «Ещё» и промокода; PublicMobileMenu —
  для меню сайта. Render/layout, focus trap/restore и прежние close controls
  сохраняются. Новых зависимостей и изменений Pen нет.
- При ширине меньше desktop breakpoint 75rem завершённый свайп одним пальцем
  вниз закрывает панель: смещение от 64 px, вертикальная компонента больше
  горизонтальной минимум в 1.25 раза. Mouse drag не вызывает закрытие.
- Начало жеста допускается только на верхней границе прокрутки панели и
  вложенных scroll containers. При scrollTop >0 работает нативная прокрутка;
  после возврата к началу закрытие выполняется новым жестом.
- Input/textarea/select/contenteditable не начинают dismiss gesture. Короткий,
  горизонтальный, направленный вверх, отменённый или многопальцевый жест не
  закрывает панель. Во время busy swipe заблокирован, как Escape/close.
- Для распознанного движения вниз native default отменяется non-passive
  touchmove/end listeners, чтобы жест не активировал ссылку/кнопку. Passive
  touchstart не мешает обычному нажатию. При close/busy/ref replacement
  gesture state очищается; listeners удаляются вместе с DOM-панелью.
- Desktop promo dialog не закрывается touch-свайпом. Mobile/tablet sheets
  поддерживают жест; значения промокода и начальный фокус сохраняют прежние
  контракты, закрытие возвращает фокус к trigger.

## Проверка touch

Отдельный Sail Playwright project `touch-dismiss`: **32/32 за 45.9 секунды**.
Используется Chromium CDP `Input.dispatchTouchEvent`, не mouse drag и не
JavaScript dispatchEvent. Проверены 390/768 px, light/dark, все три панели,
повторное открытие, отсутствие случайной навигации и восстановление scroll
lock/focus; native scroll на низком viewport, directions/short/cancel/multi,
editable input, busy и desktop-touch exception.

Регрессионный Sail browser прогон dashboard/subscription/interactive:
**269/269 за 1.8 минуты**. Сохранены tap/click, native keyboard, начальный
фокус, trap/restore, Escape/backdrop, busy/error/retry, resize и rapid reopen.
Frontend unit/SSR **103/103**, client/SSR builds и diff check прошли.
Generated SSR восстановлены byte-for-byte к состоянию до сборки.

Физические iOS/Android устройства и системная экранная клавиатура в этом
прогоне не использовались; browser touch evidence не выдаётся за такую
проверку. Backend не менялся и не повторялся. Старые незакоммиченные правки
сохранены, M-12 SMTP открыт, шаг 16 не начат, commit не создавался.
