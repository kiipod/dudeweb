# Test Suite Audit

Дата: 2026-10-29, этап 07, base `e50e978`, branch `project-audit`.
Диагностика завершена без production-исправлений. Новый TEST-001 OPEN: P0 — 0,
P1 — 0, P2 — 1, P3 — 0. Ограничения не считаются успешной приёмкой.

## 1. Test Environment

Прочитаны задача 07, overview, canonical README/findings и результаты этапов
03–06. Старые `docs/audit/README.md` / `docs/audit/findings.md` отсутствуют;
использованы `docs/audit/project-audit/`. Этапы 01/02 не закрыты: inventory report
отсутствует, Pen MCP заблокирован до повторной проверки после 1 ноября.
Browser проверки по сохранённым Pen fixtures не заменяют live дизайн-аудит.

Skills: php-per-cs3, laravel-best-practices, vue-best-practices; ранее выбранный
Tailwind skill учитывается в существующих CSS/accessibility проверках. Production
компоненты и тесты не переписывались, инструменты не устанавливались.

Всё исполнение внутри Sail: PHP 8.5.12, Laravel 13.38.0, PHPUnit 12.5.40,
Node 24.22.1, Playwright 1.64.1. `phpunit.xml`: APP_ENV=testing, DB_DATABASE=testing,
array cache/session/mail, sync queue, disabled observability. Feature tests
используют RefreshDatabase, factories и синтетические account identities.
Migrations выполняются штатным test lifecycle на testing DB; production rollback,
seeding и provider mutations не запускались.

Remnawave tests используют Http fakes с synthetic panel.test payloads; YooKassa —
Mockery SDK Client; Telegram — Telegraph fake; mail/notifications — array/fake.
Реальная доставка, provider sandbox и внешняя SMTP acceptance не подтверждены.
Tests/TestCase не устанавливает глобальный preventStrayRequests: блокировка и
mock contracts задаются конкретными tests. Проверка live integrations не выводится
из зелёных fake-тестов. Credentials в evidence не копируются из окружения.

Playwright использует http://127.0.0.1, Chromium и synthetic Inertia props,
intercepted account transport. Публичные GET обращаются к local app. E2E не
означает тест реального списания/отправки/production пользователя.

## 2. Test Inventory

| Набор | Inventory / назначение |
|---|---|
| PHPUnit Unit | 3 PHP files: Example, PaymentCancellationResolver, RemnawaveDto |
| PHPUnit Feature | 29 PHP files; HTTP/Inertia/auth, business services, DB schema/constraints, mocked API contracts |
| Frontend Node | 15 test files, unit/composable/SSR contracts |
| Playwright default | 23 spec files, 1766 tests; smoke, account, forms, accessibility, contrast, motion/touch, saved Pen geometry |
| Operational SSR | 1 дополнительный spec / 40 tests, включается env PLAYWRIGHT_SSR_BASE_URL; 8 live + 32 fixture |
| Infrastructure | 1 Python file / 3 process lifecycle tests; требует production image, user deploy, PHP-FPM/Supervisor |
| Audit probes | Отдельные docs/evidence probes предыдущих этапов не входят в default regression suite и не считаются production acceptance |

Отдельных PHPUnit suites с названиями Integration/API/Database нет; соответствующие
контракты входят в Feature. Это не основание дублировать одинаковые тесты в новых
каталогах. Inventory names и executable outcomes сохранены в evidence.

## 3. Commands

Команды, результаты и исправленные ошибки запуска — в
[evidence/tests-checks.md](evidence/tests-checks.md). Primary backend runner —
`./vendor/bin/sail artisan test --log-junit ...`, эквивалент основного запуска
composer test после config:clear. Composer script принимает дополнительные
аргументы для обеих команд: попытка передать ему --log-junit ошибочно передала
опцию и config:clear; она не считается завершённым backend run.

Full frontend: Node --test, npm run test:e2e, npm run build. Operational SSR
отдельно запускается с временным Node renderer, без изменения SSR enabled flag.
Для formatter используется только --dry-run; статические проверки ничего не
исправляли. PHPUnit coverage запускается с PCOV как отдельный обоснованный run.

## 4. Backend Results

| Run | Passed assertions / tests | Failed | Skipped | Duration |
|---|---|---:|---:|---:|
| Full PHPUnit | 306 tests / 2997 assertions | 0 | 0 | JUnit 19.636s, Laravel wall 20.02s |
| Full PHPUnit + PCOV | 306 tests / 2997 assertions | 0 | 0 | 21.927s + 0.061s Clover |

Laravel пометил 295 tests deprecated и 11 passed; эти категории не означают
295 assertion failures. PHPUnit сообщил две уникальные deprecations из
config/database.php (BE-007). Успешные assertions не скрывают эти предупреждения.

Infrastructure attempt через Sail exec: **0 прошедших, 3 setup failures**, до
process lifecycle assertions выполнение не дошло. Общая причина: root != deploy;
набор предназначен для production image, Sail не предоставляет его runtime
contract. Operational verification **BLOCKED в текущем окружении**, это не
доказательство сломанного production Supervisor. Исторический запуск из memory
не засчитан как новая проверка. На хосте тесты не запускались.

## 5. Frontend Results

Node unit/SSR: **103 passed, 0 failed/skipped/cancelled/todo**, 629.658ms.
Build client+SSR: PASS; исходные `bootstrap/ssr/*` сохранены до сборки и восстановлены
после остановки renderer. Наличие успешного SSR build не подтверждает live SSR.

Общий Playwright run: **1766 passed, 0 failed, 0 skipped, 0 flaky**,
1025.554s (17m05.554s), exit0. Первый запуск был прерван конфликтом общего output
directory с параллельным SSR run и не считается полным результатом. Полный
успешный повтор использует отдельный /tmp/project-audit-stage07-browser-results.
[JSON summary](evidence/tests-browser.json) сохраняет все 1766 test statuses и
durations без bulky screenshot attachments/raw HTML.

Operational SSR: **32 passed, 8 failed, 0 skipped, 0 flaky**, 14.322s. Все 8
live failures имеют одну причину — отсутствует data-server-rendered=true при
ssr.enabled=false на /, /login, /register, /forgot-password в обеих темах.
32 fixture tests обращаются к временному renderer и проверяют hydration in place.
Они не закрывают live acceptance. Конфигурация не менялась, renderer остановлен.

Saved Pen и accessibility suites используют Chromium automation; physical touch,
screen readers и актуальная live Pen сверка остаются отдельными ограничениями.

## 6. Static Analysis

| Проверка | Результат |
|---|---|
| PHP syntax | 420 files, 0 failures, 6.136s; Blade/cache/generated SSR/vendor/skills исключены |
| PHP-CS-Fixer | Настроенный finder, dry-run, 0 files needing changes, 11.498s |
| PHPStan/Psalm/Pint | Не установлены и не настроены; не добавлялись |
| ESLint | Нет настроенного инструмента/script; NOT_CONFIGURED |
| TypeScript/typecheck | Проект JS, tsconfig/typecheck нет; NOT_APPLICABLE к текущему JS stack |
| Composer audit | Один advisory symfony/mime, уже SEC-004; отдельный дубликат TEST не создан |
| npm audit | Известных vulnerabilities 0 |

Formatter PASS не доказывает архитектурную корректность, полное соблюдение
PHPDoc/PER или безопасность. PHP syntax check не компилирует Blade; новый Blade
lint не добавлен ради checklist. Настроенных frontend formatter/lint scripts нет.

Coverage доступен через PCOV, source scope app из phpunit.xml:
**3771/5757 statements = 65.50%**, **476/1007 methods = 47.27%**,
303 files, 278 classes в Clover summary. Это statement/method coverage, не
branch coverage: PCOV report conditionals=0 нельзя трактовать как 100% веток.
Ни threshold, ни quality gate не настроены; процент не объявлен PASS относительно
несогласованной цели. Frontend/browser coverage percentage не собирался.

Примеры executed statements: PaymentCreator 112/122, SubscriptionExtender 25/26,
PromocodeService 66/70, ReferralRewardProcessor 109/119, DeviceLimitEnforcement
101/127, BotHandler 280/379. Даже высокий statement coverage пропускает
межоперационные sequence bugs BE-001/004/005/008. Admin form MoonShineUserFormPage:
0/57; это согласуется с отсутствием default admin role-matrix regression (TEST-001).

## 7. Critical Scenario Coverage

Наличие теста ниже означает automated contract, не полную гарантию сценария.

| Сценарий | Существующие tests / границы |
|---|---|
| Registration | WebAuthTest, TelegramRegistrationTest, ReferralRegistrationTest; повтор/ambiguous provisioning |
| Trial activation | EmailVerificationTest, UserStateManagerTest::test_successful_registration_marks_user_as_trial; подтверждение email до web trial |
| Subscription expiration | UserStateManagerTest::test_expired_trial_becomes_inactive, UserLifecycleSynchronizationTest, SubscriptionExpirationReminderTest |
| Payment creation | PaymentServiceTest, PaymentEndpointTest, TelegramPaymentTest, AccountSubscriptionPaymentTest |
| Payment succeeded | YooKassaWebhookProcessingTest::test_succeeded_payment_is_processed_once_with_all_side_effects |
| Payment canceled | YooKassaWebhookProcessingTest::test_canceled_payment_has_no_business_side_effects_and_sends_retry_button, PaymentCancellationResolverTest |
| Webhook idempotency | YooKassaWebhookProcessingTest success repeat / processing claim, YooKassaWebhookTransportTest |
| Promocode one-time usage | success webhook usage/count assertions, AccountSubscriptionPaymentTest::test_payment_idempotency_survives_terminal_status_and_consumed_promo |
| Self-referral | ReferralRegistrationTest self/repeated-self, ReferralServiceTest::test_self_referral_does_not_create_reward |
| Referral reward | ReferralRewardProcessorTest, ReferralServiceTest same-payment/each-payment, remote conflict/retries |
| Remnawave synchronization | UserLifecycleSynchronizationTest, RemnawaveHandlerTest, RemnawaveDtoTest; mocked API |
| Device limit | DeviceLimitEnforcementTest below/equal/above, repeated check, manual disabled, recovery/paging |
| Authentication/authorization | WebAuthTest, ProfileTest, account owner/guest/unverified Feature checks, SupportTest operator guard; admin-user-management role matrix отсутствует (TEST-001) |

## 8. Missing Tests

**TEST-001 P2:** default regression suite не проверяет MoonShine admin-user
management для guest/customer/non-superuser/superuser. SecurityProbeTest вне
phpunit suites воспроизводит SEC-002, но не является защитным regression test.
Существующие MoonShine guard/support tests не проверяют этот CRUD privilege boundary.
Coverage для admin form 0/57 подтверждает gap, но source/JUnit inventory — основное
доказательство отсутствующего сценария. Рекомендация — matrix tests при исправлении
SEC-002, без изменения production-кода на диагностическом этапе.

Для уже зарегистрированных BE/PERF defects нужны regression scenarios из их
Verification steps: retry после более новой mutation, immutable provider payload,
stale invoice/merge, shared promo second user, numeric web batch и 429 cooldown.
Это дополнения к существующим категориям тестов, а не новые дубликаты backend
findings. Диагностические probes намеренно утверждают текущий дефект и не должны
просто переноситься в regression suite как «успешное поведение».

Live SMTP/Telegram/provider delivery, production process image и SSR-enabled
endpoint пока не подтверждены; fake/unit success не закрывает эти acceptance gaps.
Отсутствие не настроенного инструмента само по себе не объявлено TEST finding.

## 9. Findings References and Audit Checkpoint

Новый TEST-001 описан в [едином реестре](findings.md). Итоги: 306 backend tests,
103 frontend unit tests и 1766 default browser tests без assertion failures;
отдельно 8 live SSR failures и 3 infrastructure setup failures. BE-007 и SEC-004
подтверждены повторно, статусы остаются OPEN. Полная сводка: [tests-summary.json](evidence/tests-summary.json).

Remediation order сформирован в реестре как **предложение для согласования**,
а не разрешение на исправления. Этапы 01/02 открыты; факт завершения диагностики
07 не означает выполнения всех условий начала 08. Production fixes, dependencies
и test assertions не изменялись. Перед этапом 08 требуется решение пользователя.

Проверка полноты: девять обязательных разделов, команды и executable результаты,
coverage и его ограничения, critical scenario matrix, missing tests, evidence и
предложенный remediation order присутствуют. В реестре 21 уникальная запись:
P1 OPEN — 4, P2 OPEN — 14, P3 OPEN — 2, P2 BLOCKED — 1; P0 — 0. Все ID включены
в предложение порядка исправлений. Результаты этапа 07 не закоммичены. Остановка
перед этапом 08; незакрытые 01/02 и operational acceptance не скрываются.
