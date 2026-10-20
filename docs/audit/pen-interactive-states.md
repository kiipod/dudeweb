# Интерактивные состояния — шаг 14

Источник: live Pen `H/QJZCf`, `U/udMVl`, `U2/eg9Ml`, menu-open,
`n3Las` (More), `oL7tp` / `jodkF` (promo), 2026-10-20.
Pen остаётся read-only. Проверки и результаты дополняются по мере выполнения.

## Design contract и границы компонентов

Сохраняем принятую палитру, IBM Plex Sans / Mono и существующую геометрию.
Тёмная primary: `#8E9BFF`, hover `#A8B1FF`, focus `#F5F5F6` (2px,
offset 2px); светлая primary `#5B61E6`, hover `#4F55D8`, focus `#5B61E6`.
В `H` stroke тёмной primary меняется `#A8B1FF → #C2C7FF`;
light border `#7379EE` подтверждён light menu instance. Отдельного light hover
stroke в board нет — сохраняем этот border. Роли вынесены в accent-border /
accent-border-hover, включая forced-colors system colors.
Selected остаётся accent-soft / accent, ошибки — error / error-soft.
Обычные переходы цвета и overlay opacity: 200ms вход, 150ms выход;
reduced motion отключает переходы и вращающийся loader, текст загрузки остаётся.
Сохраняем выравнивание и ширины существующих форм/карточек. Hero — единственный
декоративный ambient элемент; новые эффекты и дополнительные modal flows не нужны.

| Граница | Ответственность и контракт |
| --- | --- |
| `BaseButton`, `BaseField`, `UiIcon` | Состояния общих controls; native disabled, guards, focus-visible, статичный loader при reduced motion |
| `useOverlay` | Фокус, Escape, inert background, scroll lock, cleanup; принимает open/panel/busy/close и разрешённые дополнительные controls/background targets |
| `BaseOverlay` | Teleport + opacity Transition; props title/description IDs, sheet/promo; emit close; покидающий DOM становится inert |
| `PublicMobileMenu` | Содержимое public navigation, своё расположение; использует тот же focus lifecycle с разрешёнными header controls |
| More / Promo | Заголовок, описание и действия; busy блокирует закрытие незавершённого mutation |
| `useActionForm` | Общая оболочка Inertia useForm: guard, inline transport errors, отмена при unmount; прикладные callbacks остаются у формы |
| Existing read/payment/share composables | Свои domain states, idempotency и cancellation; без отдельного UI API |

Предварительная self-critique: прежняя идея отдельной логики public menu
дублировала trap и не защищала programmatic focus; переносим lifecycle в
существующий composable. Нового visual language и новых компонентов декора нет.

## Матрица

Обозначения: `✓` — поддерживается; `—` — семантически неприменимо.
Active у action — обычная активация без отдельного Pen pressed swatch;
selected отражён у переключателей. Error/success принадлежат действию рядом
с control, а не произвольной окраске каждой ссылки.

| Элементы / все места использования | Default | Hover | Focus | Active / selected | Disabled | Loading | Error | Success |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BaseButton primary/secondary/accent/danger/ghost, copy/icon | ✓ | ✓ | ✓ 2px | native click | native + guard | busy + label | inline | status / navigation |
| Brand, skip, public/footer/auth links, CTA, account links, payment history, support pagination/back, referral terms | ✓ | text/bg или underline | ✓ | native link / aria-current | отсутствующие destinations не renderятся | Inertia navigation | route boundary | destination |
| Public theme / account theme / profile light-dark | ✓ | ✓ | ✓ | label / aria-pressed | — | — | — | theme persisted locally |
| Public menu trigger / menu links | ✓ | ✓ | ✓ | aria-expanded | background inert | — | — | close / navigate |
| More trigger, close, links, logout | ✓ | ✓ | ✓ | aria-expanded / current | busy + inert | logout | inline retry | redirect |
| Promo trigger/remove/apply/close, period selector | ✓ | ✓ | ✓ | checked / selected | busy + guard | label | field / form | discount summary |
| Email/name/password fields, visibility buttons | ✓ | field border / button bg | ✓ | input / aria-pressed | native + guard | parent form | described field / form alert | inline saved / redirect |
| Login/register/forgot/reset/resend/logout forms | ✓ | shared | shared | submit | busy + guard | busy + label | field / transport inline | server response |
| Dashboard refresh / provisioning / retry | ✓ | shared | shared | click | busy guard | loading panel | service error / inline | fresh props |
| Platform selectors Windows/macOS/Linux/Android/iOS | ✓ | ✓ | ✓ | native radio checked; OS reset on reload | — | — | — | instructions |
| Connection retry / revoke device / application links | ✓ | shared | shared | action / link | busy + guard | label / panel | actionable inline | refreshed devices |
| Copy subscription/invite link; manual readonly field | ✓ | shared | shared | copy/select | busy + guard | busy | manual fallback | live status |
| Referral channel select / share | ✓ | native / shared | ✓ | native selected | busy | busy | fallback / cancel status | share / copy status |
| Support create/reply/close/reopen, textarea, pagination | ✓ | shared/native | ✓ | input / submit | native + guard | label | field / inline; draft retained | persisted message/status |
| Profile identity/security/session/logout | ✓ | shared | shared | submit | busy + guard | label | field / inline | saved / session response |
| Payment pending refresh / retry / cancel destinations | ✓ | shared | shared | action | busy / terminal guards | panel / label | inline + retry | terminal result |
| More/promo/public overlays | ✓ | backdrop click | trap + restore | open | busy close guard / background inert | mutation only | child inline | child result |
| Service Cloud / Signal Orbit | SVG decorative | mouse steering | excluded from tab order | drag/capture | media/lifecycle gates | resource load | Signal Orbit fallback | SVG ready |
| MoonShine operator support actions | framework native | native | native | submit | auth + transaction | framework | field errors | persisted result |

## Async and motion verification

Проверено в текущем checkout:

- Auth transport handling, duplicate submit до Inertia onStart и после него,
  сохранение field validation, domain callbacks, cancellation на unmount.
  Login/register/forgot/reset/resend при network/503 показывают inline error,
  снимают busy и позволяют новый submit; уход во время ответа не возвращает
  пользователя на прежнюю страницу. More и desktop logout имеют такой же retry.
- Provisioning обрабатывает validation/network/HTTP failures так же, как
  dashboard read; navigation отменяет и provisioning, и read.
- Clipboard фиксирует конкретное значение. Смена props во время pending copy
  инвалидирует старый success/error; канал share блокируется на время действия,
  fallback после изменения URL не копирует другой invite. Loader/disabled
  отражены и у share/copy, без optimistic success.
- Public menu использует общий trap, включая разрешённые header controls;
  main/footer/brand/skip остаются inert. Tab/Shift+Tab, programmatic focus,
  Escape, resize, scroll lock, restore и close/reopen во время leave проверены.
  В More busy отключает competing navigation. Leaving DOM inert/aria-hidden;
  before-enter снимает их при быстром повторном открытии.
- Existing promo/More suite подтверждает bottom sheet 390/768 и promo desktop
  dialog 1440/2560, title/description, busy close guard, retry и focus return.
  Pen screenshots `H`, `n3Las`, `oL7tp` сопоставлены с browser menu/More/promo:
  геометрия не разрушена, focus виден, actionable validation помещается внутри.
- SVG Hero в реальном Chromium на 390/768/1440/2560: static t=0 при reduced
  motion, resume, offscreen pause, theme href switch, forced-colors suppression;
  native mouse capture/drag/release и дальнейшее ambient movement.
  visibilitychange проверяется контролируемой document.hidden подменой;
  физическое переключение вкладок не выдаётся за выполненную проверку.
- SVG asset failure монтирует работающий Signal Orbit с исходными CTA;
  reduced motion возвращает исходные paths. Unit tests дополняют steering по
  осям, transition inertia → ambient без сброса ориентации, touch/coarse gates,
  offscreen/hidden и disposal. Renderer/shader не переписываются в этом шаге.

## Route inventory

Все строки используют состояния из общей матрицы выше; значимые controls,
скрытые до открытия формы/overlay, дополнительно покрыты feature browser suite.

| Route / composition | Controls и async actions |
| --- | --- |
| Public/Home | Header/footer logo, skip, anchor navigation, theme, menu; Hero CTA, pricing radios/CTA, platforms links, final CTA, support/social links |
| Auth/Login | Email/password, visibility, submit, forgot/register, password-changed CTA |
| Auth/Register | Email/password/confirmation + visibility, submit, login |
| Auth/ForgotPassword | Email, submit, support/login; mail requested status |
| Auth/ResetPassword | Email when required, token/email errors, password/confirmation + visibility, submit, new link |
| Auth/VerifyEmail | Resend, logout, support; shared cross-action busy guard |
| Account shell | Header profile/theme, skip, sidebar/bottom navigation, More close/navigation/logout; page selected state |
| Account/Dashboard | Renew/support, copy connection, device destination, read/provisioning retry |
| Account/Subscription | Period radios, promo open/apply/remove/close, pay, history links/pagination |
| Account/Payments/Show | Pending poll/manual check, canceled retry, support/subscription/home destinations |
| Account/Connection | OS radios, app select, instructions/details/download/deep link, copy, refresh, revoke device |
| Account/Referral/Index | Terms, channel select, copy/manual field, share |
| Account/Referral/Terms | Back; server-owned content and shell navigation |
| Account/Support/Index | Create, ticket links, pagination, retry |
| Account/Support/Create | Back, subject, textarea, submit |
| Account/Support/Show | Back, history pagination, reply textarea/submit, closed new-ticket destination, retry |
| Account/Profile | Identity edit/cancel/save, password/session forms, visibility, theme radios, Telegram external status link when provided, logout |
| MoonShine support | Native reply, close/reopen, CSRF fields and framework submit/error handling |

Final Sail results: Node **79/79**, Playwright **399/399**, Laravel **277 tests /
2628 assertions** (existing PDO deprecations), client/SSR build и diff check.
В Playwright входят 62 новых state/motion cases, в том числе native Tab и
focus-visible coverage всех 16 compositions на 390/1440 и два touch contexts.
Commands, logs и provenance записаны в
[шаге 14](../../.agents/plans/pen-integration/14-cross-cutting-states-motion.md).
Physical device/screen-reader, production SMTP and operational SSR/hydration
remain step 15. No new popup or toast system was introduced.
