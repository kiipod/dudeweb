# Backend Code Review

Дата: 2026-10-29. Этап 05, исходная ревизия `a18cae5`, ветка `project-audit`.
Диагностика завершена в описанных границах. Production-код, миграции и зависимости
не изменялись. Новые findings: **P0 — 0, P1 — 2, P2 — 5, P3 — 1**, все OPEN.

План и зависимости: `00-overview.md`, `05-backend-code-review.md`, предыдущие
frontend/security отчёты и единый реестр. Старые пути `docs/audit/README.md` и
`docs/audit/findings.md` отсутствуют; использованы соответствующие файлы
`docs/audit/project-audit/`. Отчёт inventory этапа 01 отсутствует. Pen-этап 02
остаётся BLOCKED до повторной проверки после 1 ноября; для backend использованы
исходники, действующие миграции, тесты и `docs/remnawave/api-1.json`, а не макеты.

Выбраны `php-per-cs3` и `laravel-best-practices`: PHP review, архитектура,
транзакции, Eloquent, очереди и обработка ошибок. Применена текущая архитектура
проекта; атрибуты и production-рефакторинг не выполнялись.

Доказательства: [протокол](evidence/backend-checks.md),
[диагностические тесты](evidence/BackendProbeTest.php),
[JUnit](evidence/backend-probe.junit.xml),
[метаданные схемы](evidence/backend-schema.json). PASS диагностического теста
означает воспроизведение дефекта, а не его устранение.

## 1. Architecture

| Слой | Проверенная ответственность и вывод |
|---|---|
| Controllers | Auth/регистрация, account/profile, subscription/payment, Telegram link, support и webhook оркестрируют services и FormRequest. AccountSubscriptionData собирает UI props; отдельный REST API для UI не нужен. |
| Services | UserStateManager управляет переходами Remnawave; provisioning, lifecycle, устройства, reminders, промокоды, referrals, support и merge выделены по сценариям. Batch mapping отстал от web identity: BE-002. |
| Payment | PaymentService — полезный фасад над Creator, processors, Extender и notifiers. Claim token и сохранённая target date защищают часть повторов, но не все межоперационные последовательности: BE-001, BE-004, BE-005, BE-008. |
| Handlers / DTO / Enums | BotHandler, payment notification и Remnawave handlers; UserResponse, stream, traffic и HWID DTO сверены с используемыми полями API. Enum payment/source/status/tag/reward задают явные состояния. Это выборочная проверка контрактов, не полное доказательство всех DTO. |
| Models / Repositories | User, Payment, Product, Promocode, UserPromocode, ReferralReward, support/link models: relations, casts, scopes и schema. UserRepository/UserService разделяют lookup и provisioning. Не обнаружено основания удалять слой как «прокси». |
| Actions / Events / Listeners / Jobs | Отдельных собственных каталогов Actions/Jobs/Events/Listeners нет; используется регистрация login listener в AppServiceProvider, стандартные auth events и notifications. Отсутствие этих каталогов само по себе не дефект. |
| Commands / Scheduler | Lifecycle, устройства, expiration reminders, referral retries; расписание в routes/console.php, withoutOverlapping и один schedule:work под Supervisor. Проверено wiring, но не production failover/кластерная блокировка. |

TelegramAccountMerger использует подготовку, удалённое согласование и завершение;
durable merge marker сохраняет возможность восстановления. SupportConversationService
связывает автора, ticket/status и UUID запроса, проверяет повтор через content hash.
Эти границы полезны и должны сохраниться при исправлениях.

## 2. Code Quality

Проверены зависимости и основные call chains перечисленных модулей. Циклическая
зависимость в исследованных цепочках не подтверждена; полного формального графа
всего контейнера не строили. Нет оснований создавать style-only findings.
Большой BotHandler совмещает dispatch, сценарии и presentation; делить его только
по числу строк не предлагается. Выделение сценариев уместно при их изменении с
сохранением callback/message contracts и тестов регистрации/оплаты.

Повторяющийся identity lookup в batch services уже создаёт функциональное
расхождение с numeric web mapping (BE-002). Длительность Telegram-покупки
повторно выводится из display name вместо Product.months (BE-003). Это
обоснованные точки централизации правил. PaymentService не требует удаления:
он сохраняет стабильный интерфейс нескольких сценариев.

## 3. Business Logic

| Сценарий | Результат анализа |
|---|---|
| Web / Telegram регистрация | Provisioning state/key, numeric identity и повторное получение remote пользователя учитываются; проверены registration services, repository, BotHandler и targeted regression. Реальная регистрация у провайдера не выполнялась. |
| Trial / lifecycle | expireAt Remnawave — источник срока; локальные tags обозначают lifecycle, а не второй календарь. Исторический bot-user-lifecycle отчёт не заменяет текущие исходники: удалённые legacy поля не предлагается возвращать. Web-only batch пропуск — BE-002. |
| Покупка / продление | Локальный invoice резервируется перед SDK, обработчик успешного webhook сначала продлевает remote, затем завершает локальную операцию. Сохранённая target date повторяема только при отсутствии последующей чужой мутации: BE-001. |
| Срок Telegram-покупки | Product с months=1 и именем «Пакет на 30 дней» резервирует 30 месяцев: BE-003. Провайдер в probe искусственно отклоняет создание; реальный платёж не производился. |
| Отмена / retries | CanceledPaymentProcessor и terminal states отделены от success. Повтор создания без provider ID пересчитывает цену (BE-004), неудачное создание оставляет блокирующий Pending (BE-005). |
| Промокоды | Service допускает общий код с count>1 или unlimited, блокирует строки owner/code и проверяет usage. DB разрешает лишь одного пользователя на code: BE-008. |
| Referral | Durable PENDING/APPLIED/CONFLICT, source/target даты, payment uniqueness и per-user mutation lock существенно ограничивают повторное начисление. Не следует заменять это простым increment. Нагрузочные гонки не проверялись. |
| Устройства / reminders | Enforcement и lifecycle используют stream, но legacy mapping исключает web-only identities (BE-002). Отсутствие Telegram reminder у пользователя без Telegram само по себе не классифицируется как дефект. |
| Account merge / support | Ownership, session/link status, blocked in-flight work и durable merge marker проверены. Ошибка создания invoice может навсегда оставить merge blocker (BE-005). Support использует транзакции и повторяемые client request IDs. |

## 4. Database

Проверены текущие models/casts/relations и цепочки миграций users, payments,
products, promocodes, user_promocodes, referral_rewards, support и links.
Метаданные девяти таблиц получены через Schema внутри Sail на testing DB после
миграций; snapshot не содержит пользовательских строк или секретов.

Payment idempotency/provider IDs, referral payment uniqueness, identity keys и
support request constraints проверены. Существующий UNIQUE promocode_id в
user_promocodes подтверждён схемой и SQL exception второго допустимого usage
(BE-008). Миграция сохранения merged history снимает UNIQUE user_id, но оставляет
UNIQUE promocode_id. Нужна новая forward migration, а не правка применённой.

Schema допускает несколько исторических usage после merge, тогда как service
запрещает новый промокод пользователю с историей: эти разные concerns нельзя
механически свести к UNIQUE user_id. Перед изменением нужна явная проверка
истории merge и бизнес-правила повторного использования.

Нет подтверждённого основания удалять поля только из-за отсутствия прямого UI
потребителя. State/state_payload, provisioning и merge markers обслуживают
долговременные сценарии. Полный rollback заполненной production DB не запускался;
обратимость, FK и индексы проверялись по исходникам и testing schema. Индексный
тюнинг/EXPLAIN и массовая проверка данных относятся к последующим этапам.

## 5. Transactions

Payment: reserve invoice (локальная транзакция) → createPayment (вне неё) →
claim (транзакция) → target reservation / remote extension → complete (транзакция)
→ уведомления. DB rollback не отменяет внешний платёж или remote extension.
Это требует durable recovery, а не обещания общей атомарности.

SubscriptionMutationLock сериализует одновременные изменения одного пользователя,
но старый retry после более новой завершённой операции остаётся опасным (BE-001).
Probe воспроизводит такую последовательность состояниями, не реальными потоками.
ReferralRewardProcessor имеет явную проверку source/target conflict; payment
recovery должен согласовать эту гарантию и оплату недоставленного срока.

BE-008 особенно опасен на границе remote/local: SuccessfulPaymentProcessor
вызывает extend до complete/markAsUsed. Подтверждён SQL отказ; частичный эффект
после настоящего списания выведен из порядка вызовов, не воспроизводился live.
При повторе нельзя ни повторно начислять срок, ни терять уже оплаченную услугу.

Notifiers платежей/referrals/устройств/reminders выполняют внешнюю отправку под
DB row lock. Это tradeoff против дублей: отправка не откатывается вместе с БД,
а задержка сети удерживает блокировку. Без measured contention это не отдельный
performance finding. При изменении доставки рассмотреть outbox с явной политикой
повторов, без заявления об exactly-once для Telegram.

## 6. Error Handling

Проверены catches, release claim, retry commands, exception logging и реакции
на provider errors. Ошибки создания нормализуются, но Pending не получает
достаточного recovery состояния (BE-005). Ошибки отдельных lifecycle пользователей
учитываются в failed; успешная обработка не означает успех всей внешней системы.
Полного fault injection для всех DTO/API ответов не было.

Гостевой GET /log-viewer вызывает Error «Call to a member function isSuperUser()
on null» в AppServiceProvider:107 (BE-006). Это подтверждённая функциональная
ошибка авторизационного callback; доступ к содержимому логов не доказан.
SEC-002 о capabilities админки остаётся отдельной проблемой.

Конфигурация MySQL использует deprecated PDO::MYSQL_ATTR_SSL_CA на PHP 8.5
даже при PostgreSQL (BE-007). Проверки не были объявлены «без предупреждений».
Секреты/доверие proxy/webhook и access logging уже отражены SEC-001–007;
дубли BE не создавались, реальные значения в доказательства не копировались.

## 7. External Integrations

Remnawave: handlers/DTO сверены с локальным API 3.4.3 и numeric identity;
проверены GET/stream/PATCH, expiry/tag и HWID paths. Реальные remote changes
не выполнялись. Локальный numeric mapping и batch resolver расходятся (BE-002).

YooKassa: SDK mocked, настоящих списаний/возвратов/webhook доставки не было.
Повтор с одним ключом отправил разные amount (200.00 и 300.00), а локальный
invoice сохранил 20000 minor units (BE-004). Реакция живого API на такой повтор
не проверялась. Idempotency key должен обозначать неизменный запрос.

Telegram: существующие callback, registration и уведомления проверены по коду
и targeted tests; реальная доставка и внешний SMTP не входили в этап.
Pen MCP не вызывался из-за ранее установленного ограничения.

## 8. Refactoring Candidates

Каждая строка описывает проблему, поддерживаемость, затронутые классы, риск,
нужное покрытие и предлагаемую границу. Исправления требуют отдельного этапа.

| IDs / классы | Проблема и предлагаемая архитектура | Риск и обязательные проверки |
|---|---|---|
| BE-001: SubscriptionExtender, UserStateManager, SuccessfulPaymentProcessor | Payment target не учитывает следующие мутации. Ввести согласованное recovery/conflict правило с durable source/target или журналом операций; сохранить общий mutation lock. Это делает правила платежей и referrals согласованными. | Высокий: деньги/срок. Retry после другого платежа/referral, remote timeout до/после применения, утрата claim, параллельные workers. Простое max(target,current) может потерять ещё не начисленный оплаченный интервал. |
| BE-002: UserLifecycleSynchronizationService, DeviceLimitEnforcementService | Общий batch identity resolver: numeric mapping первым, проверенный legacy fallback. Убрать расходящиеся lookup правила без изменения правил lifecycle. | Средний: ошибочное связывание аккаунтов. Web-only, Telegram, renamed/missing usernames, conflicting IDs, paging и device enforcement. |
| BE-003: PaymentCreator, Product | Единый источник duration — Product.months, явная политика legacy nullable данных. Display name оставить представлением. | Высокий по последствиям: Telegram/web parity, переименование тарифа, legacy products, рассчитанная дата продления. |
| BE-004: PaymentCreator | Заморозить provider request snapshot вместе с intent; повтор строить из snapshot. Это отделяет каталог от уже начатой покупки. | Высокий: price/discount/catalog changes, неизменность amount/currency/description/metadata/return URL, одинаковый ключ, ownership и ambiguous timeout. |
| BE-005: PaymentCreator, TelegramAccountMerger, retry commands | Разделить provider creation unknown/failed и оплачиваемый Pending, согласовать reconciliation с merge predicates. Не считать timeout доказательством отсутствия платежа. | Высокий: provider принял запрос, ответ потерян; proved absent, stale intents, delayed webhook, concurrent merge и создание. |
| BE-006: AppServiceProvider, log-viewer middleware | Явный admin guard/session и null-safe auth predicate с сохранением superuser-only policy. | Средний: guest 302/401/403 по маршруту, обычный user/admin отказ, superuser UI/API доступ. |
| BE-007: config/database.php | Убрать устаревшие PDO constants с проверкой установленного PHP/драйвера; сохранить SSL options. | Низкий: PHP 8.5 bootstrap без deprecations, PostgreSQL и MySQL SSL конфигурация. Не отключать warnings. |
| BE-008: user_promocodes migrations, PromocodeService, SuccessfulPaymentProcessor | Forward migration для shared code cardinality; сохранить историю merge и атомарный usage/count. Согласовать remote/local recovery. | Высокий: общий count=2/unlimited, personal codes, concurrent last usage, запрет повторного usage, merged history и retry после remote success/local SQL failure. |

## 9. Findings References

| ID | Приоритет | Подтверждение |
|---|---|---|
| BE-001 | P1 | Старый target 2026-12-01 отправляется поверх remote expiry 2027-01-01; probe 1. |
| BE-002 | P2 | Numeric web identity пропущена lifecycle и device batch; probe 2. |
| BE-003 | P2 | months=1 / имя с 30 резервирует Telegram months=30; probe 3. |
| BE-004 | P2 | Один ключ, два разных provider amount после изменения каталога; probe 4. |
| BE-005 | P2 | Неудачный SDK create оставляет Pending и блокирует merge через два дня; probe 5. |
| BE-006 | P2 | Гостевой log-viewer выбрасывает null member Error; probe 6. |
| BE-007 | P3 | Две PHP 8.5 deprecations на config/database.php:62,82. |
| BE-008 | P1 | Второй допустимый usage общего кода вызывает unique violation; probe 7 и schema snapshot. |

Подробные записи, ожидаемое поведение и критерии исправления находятся в
[едином реестре](findings.md). Проверка полноты: все девять разделов созданы;
основные модули, бизнес-правила, схема, транзакции, ошибки и refactoring candidates
покрыты; новые ID уникальны, дубликаты SEC/FE не создавались. Ограничения live,
реальной конкуренции и полноты тестового набора сохранены. Этап 06 не начат.

## Follow-up — stage 08

BE-001 и BE-008 исправлены в этапе 08 (FIXED, не VERIFIED), с forward migrations и regression checks. Подробности, команды и ограничения: [critical-fixes.md](critical-fixes.md). Исторические результаты диагностики выше не переписывались.
