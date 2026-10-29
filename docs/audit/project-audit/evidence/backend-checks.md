# Backend audit — protocol

2026-10-29; baseline `a18cae5`, PHP 8.5.12, PHPUnit 12.5.40. Runtime проверки
только внутри Sail, testing database с RefreshDatabase, синтетические fixtures.
Http::preventStrayRequests и mocked YooKassa SDK исключают реальные provider
операции в диагностических тестах. Host использовался для Git/search/docs.

## Existing regression

```bash
./vendor/bin/sail artisan test --filter='(UserLifecycleSynchronizationTest|DeviceLimitEnforcementTest|SubscriptionExpirationReminderTest|UserStateManagerTest|ReferralRewardProcessorTest|ReferralServiceTest|TelegramRegistrationTest|PaymentSchemaTest|UserModelRefactoringTest|RemnawaveHandlerTest|RemnawaveDtoTest)'
```

57 tests, 240 assertions, 3.33s; Laravel runner классифицировал 53 как deprecated,
4 passed. Assertion failures не зарегистрированы. Причина warnings:
PDO::MYSQL_ATTR_SSL_CA в config/database.php:62,82 (BE-007). Это targeted regression,
не весь проект и не этап 07. Исходный terminal log оставлен вне репозитория;
эта запись сохраняет команду и итог, без заявления о сохранённом полном логе.

## Diagnostic probes

```bash
./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential docs/audit/project-audit/evidence/BackendProbeTest.php
./vendor/bin/sail php vendor/bin/phpunit docs/audit/project-audit/evidence/BackendProbeTest.php --log-junit docs/audit/project-audit/evidence/backend-probe.junit.xml
```

Финальный запуск: 7 tests, 22 assertions, failures=0, errors=0, skipped=0;
1.525s, две deprecations. PASS означает, что assertions обнаруженного дефекта
выполнены. Ранние итерации fixtures не считаются итоговой проверкой.

| Test suffix | Findings | Наблюдение |
|---|---|---|
| saved_payment_target_can_shorten_a_newer_subscription | BE-001 | PATCH содержит более ранний expiry; сравнение абсолютных timestamps. |
| batch_mapping_skips_a_web_only_numeric_identity | BE-002 | Lifecycle checked=0, tag остаётся прежним; device checked=0, HWID запросов нет. |
| telegram_invoice_uses_name_digits_instead_of_months | BE-003 | Сохранено months=30 вместо catalog months=1; искусственный SDK отказ после reserve. |
| retry_recalculates_provider_amount_from_mutated_catalogue | BE-004 | На один ключ отправлены 200.00, затем 300.00; локальный amount=20000. |
| failed_creation_attempt_keeps_blocking_telegram_link | BE-005 | Pending без provider ID; валидный link через два дня получает запрет merge до remote calls. |
| log_viewer_guest_raises_an_error | BE-006 | Без exception handler получен Error с null isSuperUser(). |
| shared_promocode_cannot_record_a_second_eligible_user | BE-008 | Count=2, первый usage успешен, второй unique violation, count остаётся 1. |

Последний тест сохраняет `backend-schema.json`: только columns/indexes/FKs девяти
таблиц. UNIQUE user_promocodes.promocode_id присутствует после текущих миграций.
Snapshot получен из testing, не из production.

## Limits

Реальных списаний, писем, сообщений, Remnawave mutations и production запросов
не было. Последовательность BE-001 моделирует interleaving, не многопроцессную
гонку. BE-008 доказывает SQL отказ usage; последствия после оплаченного remote
extension основаны на порядке вызовов в SuccessfulPaymentProcessor. Полный
rollback populated DB, нагрузка, EXPLAIN, все тесты и production acceptance
не выполнялись. Pen заблокирован; повторная сверка после 1 ноября отдельно.
Production-код не исправлялся; findings остаются OPEN.
