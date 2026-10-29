# Сверка UI с live Pen — 2026-10-18

Статус: задача принята и закрыта по явному решению владельца
«делаем коммит и закрываем задачу». Полная screenshot comparison остаётся
в шаге 15; implementation принят с перечисленными ниже проверками и
ограничениями. К следующему шагу агент не переходит.

Источник читается только через Pen MCP. Запрос владельца: согласовать изменённые
токены, типографику и размеры уже существующего UI. Backend и новые account
flows в этот scope не входят. Landing повторно проверен по OidTs/m3BuD/j3aRaj/j8pJq:
его role tokens соответствуют текущему источнику.

При расхождении reusable с экраном приоритет у актуального экземпляра экрана:
например Lbab2 всё ещё 50/14, но login/subscription actions уже 56/15…72/19.

| Роль | Mobile | Tablet 768 | Desktop 1440/1920 | QHD 2560 |
| --- | --- | --- | --- | --- |
| h1, line-height 1.06 | 34 | 42 | 48 | 64 |
| intro, line-height 1.45 | 16 | 17 | 20 | 24 |
| card title, line-height 1.15 | 20 | 22 | 24 | 32 |
| body/field/link, line-height 1.45 | 15 | 16 | 17 | 21 |
| primary action, bold / 1.35 | 15 | 16 | 17 | 19 |
| field/action height | 56 | 60 | 64 | 72 |
| field inline padding | 18 | 18 | 24 | 24 |
| auth width | viewport − 40 | 600 | 640 | 800 |
| auth wordmark IBM Plex Sans 700 / 1.2 | 20 | 22 | 22 | 26 |
| badge text | 12 | 13 | 14 | 16 |
| copy control | 48 | 52 | 56 | 64 |

Auth references: HhyAE/pkcvx/ZJsQ3/tIpF7/SYaLA; registration
peVB0/sWVM2/gukmT/nb2yx; recovery Yd1Y4/DJnOX/FwpyZ/h2cMK;
status qV2vd/wtQv3/aZlFJ/SDOrj; reset ERga7/UCwmm/PMRVT/GkwBz.
Account: PvBmx/uS6Mr/YzRDo/Swiwc, P4PAH/r51co/lUzA6/xrpVH,
promo n9UuR/jodkF, profile AxIiC/I0x6P. Light auth pd9lO retains
F5F1EA/D8D0C4 inputs and 24211D/625C54/7A7268 text.

Общие границы: CSS-first interface tokens задают responsive роли; BaseButton
владеет action geometry и disabled/loading; BaseField — input geometry,
labels/errors; AuthShell — шириной, заголовком и композицией; BrandLogo/BrandLink
получают фиксированный wordmark variant; account/subscription primitives
используют те же роли без новой бизнес-логики. Цветовая основа Night 0A0A0B,
Paper FBF9F4, Iris 8E9BFF, light action 5B61E6, Mint 56D6AE, Coral F08A9B.
Согласованная accessible light accent mapping сохраняется; raw светлый Iris
из отдельных Pen instances не заменяет контрастный текст ссылок.

Auth: intro gap 4, form groups 16/13/15; radius inputs/actions 12.
Status/reset description использует body scale, обычный intro — intro scale.
Промежуточные Pen weights 620/650 соответствуют уже проверенному display 400;
action 700, label 500, selected period 600 — реальные weights.
На desktop→QHD размеры интерполируются после Full HD; 1920 сохраняет desktop
значения. Mobile/tablet layout и явные padding source остаются отдельными.
Заголовки слева; status по центру; никаких новых декоративных элементов.

Проверка после реализации: frontend suite и client/SSR build в Sail;
browser responsive/light/dark matrix, computed dimensions against live source,
320px с увеличенным текстом и focus ring. Screenshot/native keyboard limitations
не выдаются за пройденную visual/keyboard приёмку. U-28 legal и privacy-safe
recovery copy остаются принятыми функциональными отклонениями от макета.

## Результат проверки

- Sail frontend suite `35/35`; client и SSR build проходят. Регрессия проверяет,
  что mail/lock/eye/eyeOff принимаются UiIcon без Vue prop validation warnings.
- Auth: `64/64` cases, четыре form routes × восемь ширин × две темы.
  Font/line roles, input/control heights и form widths соответствуют матрице
  с tolerance 0.51 px. Labels связаны; один main/h1; overflow/clipping нет.
- Text-only font-size ×2, 320 px: четыре формы без overflow/clipped controls.
- Временный SSR-preview 16 compositions без Vue warnings; 12 browser cases
  (шесть ширин × две темы) подтвердили action, field, period, badge, copy,
  heading, auth/payment status и desktop sidebar geometry. Preview scaffolding
  ограничивает колонки и показывает sidebar только на desktop; это не новые
  routes и не приёмка ещё не реализованных account pages.
- Landing: 16 width/theme cases без horizontal overflow; min platform heights
  649/649/630/536/649 совпали на reference widths. Public font roles сохранены.
- BaseField forced focus-visible: solid 2px outline, pseudo-state снят.
  Это CSS check, не native keyboard sign-off.
- Source screenshots login mobile/desktop прочитаны. Live return-screenshot
  снова завершился timeout 60s; полная screenshot comparison остаётся открытой.
  Во время capture был transient `A capture is already running`; соответствующие
  failed probes не учитываются в итоговой successful matrix.
- Backend, зависимости и Pen document не изменялись в этом reconciliation.
  Build artifacts и временный preview исключаются из рабочего diff.
