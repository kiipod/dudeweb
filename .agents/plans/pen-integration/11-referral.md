# Шаг 11 — Реферальный раздел

## Цель задачи

Реализовать referral overview и отдельную страницу условий программы на
существующих отношениях User/ReferralReward/ReferralBonus и утверждённом
invite-link/content contract без изменения referral business rules.

## Продолжение — 2026-10-20

Шаг 10 закрыт коммитом `83a0ef2`, checkout чистый, ветка `pen-integration`.
`U-27` закрыт в source audit: live server rules + explicit content version.
Pen read-only: перечитаны Q/Q2 mobile/tablet/desktop/Full HD/QHD, dark/light.
Выбраны `php-per-cs3`, `laravel-best-practices`, `frontend-design`,
`vue-best-practices`, `tailwind-best-practices`, `laravel-13-attribute-refactor`.
`Config`, `UseFactory`, `UseModel` проверены в installed framework: class,
target/constructor и framework consumption; зависимости не обновлялись.
Implementation и CSR/browser verification завершены. По запросу владельца
шаг 11 принят и закрыт текущим коммитом.

| Роль | 390 | 768 | 1440 | 2560 |
| --- | --- | --- | --- | --- |
| Content width | viewport − 40 | 640 | 900 | 1120 |
| Q content top / gap | 18 / 14 | 28 / 14 | 32 / 14 | 32 / 14 |
| Q2 content top / gap | 8 / 8 | 24 / 10 | 32 / 10 | 32 / 12 |
| Terms card padding / gap | 10×14 / 12 | 16 / 16 | 18 / 16 | 24 / 16 |
| Step number | 36 | 36 | 36 | 44 |
| Shared heading / title / body | 34 / 20 / 15 | 42 / 22 / 16 | 48 / 24 / 17 | 64 / 32 / 21 |

References: Q `QIQ4z`, `e8KWki`, `HGddq`, `z99fH5`, `fmWw9`, `CHZL0`,
`j7ORc`, `G6qt4`; Q2 `paZk6`, `LNwLW`, `BYL5v`, `hhNkq`, `jSIgm`,
`Uel2T`, `Kf2AE`, `mNtiD`. IBM Plex Sans/Mono, Night/Paper/Iris,
existing semantic tokens and shell; no new decoration or independent palette.

Component map: thin `Account/Referral/Index` / `Terms`; `ReferralInviteCard`
owns channel selection and copy/share composables; `ReferralMetrics` renders
aggregates; `ReferralTermsContent` renders semantic ordered steps/reward table.
`ReferralInviteService` owns stable opaque remote-ID mapping, first valid
session attribution and Telegram resolution. `ReferralRules` exposes the same
discount constant and latest-updated/id reward preference used by services.
`AccountReferralData` owns aggregates and live terms version. Q2 is read-only.

Scope includes both registration entry points because token resolution does
not exist yet. Legacy numeric Telegram invites remain accepted; newly generated
links expose only opaque tokens. No account linking/merge action is introduced:
future merge must transfer referral/reward foreign keys and token aliases to
the survivor with surviving remote ID, reject self/conflicting records and
preserve payment uniqueness. Until then accounts remain independent.

## Зависимости

- Завершён шаг 10.
- Решены `U-03`, `U-09`, `U-21` и `U-27`.
- Существующие `User::referrals()`, `receivedReferralRewards()` и
  `UserService::generatePartnerLink()` либо утверждённая замена.
- Существующие `PromocodeService`, `ReferralService`, `ReferralBonus` и durable
  `PENDING`/`APPLIED`/`CONFLICT` reward flow.
- Pen screens `Q` и `Q2` в mobile/tablet/desktop, dark/light; Q2 IDs:
  `paZk6`, `LNwLW`, `BYL5v`, `hhNkq`, `jSIgm`, `Uel2T`.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — referral
  states, copy/share behavior, component contracts и styling.
- `laravel-best-practices` — authorization, aggregate queries, deterministic
  ordering и минимальные Inertia props.
- `laravel-13-attribute-refactor` — условно для approved configuration после
  проверки installed framework source.

## Конкретные действия

- [x] Сформировать два совместно работающих URL: web registration invite и
  Telegram bot invite; оба используют opaque token, server-side связанный с
  inviter `remnawave_user_id`.
- [x] Собирать referral props в focused query/service с counts/sums на БД, без
  загрузки лишних collections.
- [x] Для relationship metrics использовать `withCount`/aggregate queries и
  проверять query count, не гидратировать related models только ради count/sum.
- [x] Передать `webInviteUrl`, `telegramInviteUrl`, invited count, только
  фактически `APPLIED` bonus days и optional recent items;
  `PENDING`/`CONFLICT` не включать в показатель «Получено бонусов» как уже
  начисленные дни.
- [x] Не раскрывать `chat_id`, local user ID или raw `remnawave_user_id` в
  public URL.
- [x] Применять first-valid-attribution-wins, отклонять self-referral между
  каналами и сохранять payment-level reward idempotency.
- [x] Зафиксировать merge behavior: referral/reward ownership переходит local
  survivor, чей `remnawave_user_id` равен surviving remote ID; конфликтующие
  self-referral/reward records не начисляются повторно.
- [x] Реализовать copy и Web Share API action с fallback.
- [x] Реализовать empty state из Pen и populated state по утверждённому copy.
- [x] Добавить protected read-only route/page условий программы, связанный с
  overview ссылкой «Условия партнёрской программы» и обратной навигацией
  «Назад к приглашениям» без потери scroll/history semantics.
- [x] Передать Q2 content contract из server-confirmed source по `U-27`:
  friend discount, четыре шага и reward matrix; не хардкодить в Vue значения
  `30%` и `7/14/21/30` как независимые бизнес-правила.
- [x] Если источником выбраны live rules, использовать тот же canonical
  selection/preference contract, что и payment/referral services, и выдавать
  честный unavailable state при неполной конфигурации вместо stale Pen data.
- [x] Представить четыре шага семантическим ordered list: нумерация в Q2 имеет
  смысл последовательности и не является декоративным паттерном.
- [x] Сохранить Q2 responsive shell contract: `Ещё` active на mobile/tablet,
  `Пригласить друга` active на desktop, без отдельного route для theme/viewport.
- [x] Корректно склонять числа/дни на server или в единой presentation utility.
- [x] Не менять начисление bonus days и payment idempotency.
- [x] Добавить authorization и aggregate query tests, а также Feature test для
  Q2 route, props, canonical ordering периодов и overview/back links.

## Критерии готовности

- Referral показатели совпадают с реальными relations/rewards.
- Оба invite links соответствуют своим каналам, одной attribution policy и не
  раскрывают лишние данные.
- Copy/share доступны и имеют success/error feedback.
- Empty/populated states работают в обеих темах и всех viewport.
- Q2 соответствует dark/light Pen references на 390/768/1440, а показываемые
  условия совпадают с фактически действующим referral contract.
- Q2 доступен только authenticated user, имеет рабочие forward/back links и
  не создаёт мутирующих actions.
- Существующий Telegram referral flow не сломан.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Referral
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --dry-run --diff --using-cache=no --sequential <changed-php-files>
./vendor/bin/sail node --test tests/Unit/Frontend/*.test.js
./vendor/bin/sail npm run test:e2e
./vendor/bin/sail npm run build
git diff --check
```

## Сценарии проверки

- 0 referrals/0 bonus days.
- Несколько referrals с разными status и несколькими rewards.
- Web Share supported, canceled и unsupported.
- Clipboard denied.
- Anonymous access и попытка прочитать чужую статистику.
- Referral terms: 30% + 1/3/6/12 matrix из утверждённого source, missing/
  incomplete configuration, deterministic ordering и отсутствие stale copy.
- Q -> Q2 -> Q через click, keyboard и browser back на 390/768/1440.

## Реализация и проверка — 2026-10-20

- `ReferralInviteService` выдаёт 40-character random token, связанный только
  с numeric remote identity. Генерация сериализована lockForUpdate владельца;
  canonical URL использует самый ранний token. Таблица разрешает alias tokens
  для той же remote identity, что сохраняет возможность переноса старых ссылок
  при будущем merge. Unique token и FK на `users.remnawave_user_id` защищают
  mapping; без mapping URL отсутствуют. Telegram username берётся из canonical
  `services.telegram.bot_username`; при missing config доступен только web.
- Public `GET /invite/{token}` с FormRequest/path validation и throttling
  сохраняет первое валидное приглашение в guest session и направляет на
  регистрацию. `WebRegistrationService` назначает referrer только новому
  аккаунту и использует существующий idempotent automatic-discount service.
  Повторная/невалидная регистрация не создаёт rewards. Existing authenticated
  account не получает новый referrer через invite URL.
- Telegram `/start` использует тот же resolver, включая web inviter без chat ID;
  прежние numeric invites продолжают приниматься строго целиком. Новые
  `/partners` URLs используют opaque token; статистика бонусов здесь также
  ограничена `APPLIED`. Existing-user attribution не заменяется. Самоссылка
  определяется по текущей local/remote identity; независимые ещё не связанные
  web/Telegram аккаунты остаются независимыми по принятому contract.
- `AccountReferralData` использует один aggregate select с `withCount`/`withSum`:
  только own relations и APPLIED days. Optional recent items не нужны для
  утверждённого состояния и не загружаются. После создания canonical invite
  overview выполняет 3 queries независимо от числа друзей/rewards; related
  collections не гидратируются. Параметр `user_id` не влияет на выбор владельца.
- `ReferralRules` сохраняет исходную default discount величину и точный
  preference бонуса: latest updated_at, затем latest id. `ReferralService`
  использует этот же reader; начисление/дедупликация payment и durable processor
  сохраняются. Q2 получает live discount/matrix и content-version hash; при
  missing/invalid периодах не показывает stale значения из Pen. Повторяющиеся
  правила для одного периода разрешаются тем же preference, что при оплате.
- Q/Q2 защищены `auth:web`, `auth.session`, `verified` и dedicated Policy/Gate;
  props scoped to session, ответы no-store/private. Overview encrypts history.
  Q2 — отдельный read-only route: не генерирует invites и не создаёт бонусы.
  Общая навигация включает referral; More/tab order актуализирован. Back link
  и browser history используют штатные Inertia navigation semantics.
- Card содержит native выбор канала, существующий `CopyableLink` и Web Share
  с supported/canceled/unsupported/failure feedback. При недоступности Share
  копируется выбранный URL; при отказе Clipboard доступно ручное выделение.
  URL не пишется в localStorage. Share использует фиксированный `accent` variant
  BaseButton; данные условий отсутствуют во Vue как независимые правила.
- Новая миграция применена только в dev Sail. `down()` удаляет invite tokens;
  referral/reward records не меняются. После rollback опубликованные opaque
  ссылки потребуют восстановления tokens; deployment требует этой миграции.

Проверка через Sail:

- [x] Полный Laravel suite: 239 tests / 2242 assertions, failures 0; после
  финального дополнения alias case — AccountReferral 10 tests / 108 assertions,
  failures 0. Existing PDO deprecations отмечают 228 tests полного suite.
- [x] Frontend Node 70/70; client/SSR build успешен.
- [x] Playwright 223/223: 176 прежних cases и 47 referral cases. Q/Q2 на
  320/360/390/768/1024/1440/1920/2560, обе темы; ×2 text на 320; empty/populated,
  active navigation, copy/share supported/canceled/unsupported/failure/manual,
  live discount/matrix без stale values и Q -> Q2 -> Q/browser back.
- [x] Исправлен intrinsic grid overflow overview при тексте ×2: explicit
  minmax column и переносы длинных слов. Автоматический table layout сохраняет
  читаемые labels и бонусы. Screenshots Q 390 dark, Q2 390 dark, 768 light и
  2560 dark просмотрены; live Pen roles перечитаны. Канальный selector расширяет
  высоту карточки Q, поскольку accepted contract требует два working invite URL.
- [x] PHP CS Fixer проверил 24 files (2 initial formatting fixes); после
  финальных PHPDoc/schema/test изменений — 5 files / 0 fixes.
- [x] Account routes проверены; `git diff --check` проходит.

Reports: `playwright-report/index.html`, `test-results/`; text logs
`/tmp/pen-step11-{php,referral-php,node,build,browser-full,formatter}.log`.
Browser transport/data и native Share/Clipboard API моделируются fixtures;
реальные Telegram сообщения, payments и rewards не создавались. Operational
SSR/hydration, native Share на устройствах, screen reader/physical keyboard и
полная pixel matrix остаются в шаге 15. Pen/зависимости не изменялись;
generated SSR artifacts исключены. Шаг 11 принят владельцем и закрыт
текущим коммитом; шаг 12 не начат.

