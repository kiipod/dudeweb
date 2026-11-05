# Security verification protocol — 2026-10-29

Исходная ветка: project-audit, commit 45537e0. Все runtime checks — через Sail.
Ни один результат host PHP/npm/PHPUnit не используется как подтверждение.

## Команды и результаты

1. `./vendor/bin/sail ps` — локальные контейнеры доступны.
2. `./vendor/bin/sail composer audit --locked --format=json` — exit 1,
   один medium advisory symfony/mime, abandoned пуст; JSON сохранён рядом.
3. `./vendor/bin/sail npm audit --json` — exit 0, vulnerabilities total 0;
   JSON сохранён рядом. Автоматических upgrades не было.
4. `./vendor/bin/sail artisan test --filter='(WebAuthTest|EmailVerificationTest|PasswordRecoveryTest|ProfileTest|AccountSubscriptionPaymentTest|PaymentEndpointTest|PaymentReturnTest|YooKassaWebhookTransportTest|YooKassaWebhookProcessingTest|TelegramPaymentTest|TelegramAccountLinkTest|AccountConnectionTest|SupportTest|AccountReferralTest)'`
   — exit 0, 192 tests, 2029 assertions, 15.00s. Runner пометил 192 tests
   как deprecated из-за PHP 8.5 config warnings; это не 192 failures.
5. `./vendor/bin/sail php vendor/bin/phpunit docs/audit/project-audit/evidence/SecurityProbeTest.php --log-junit docs/audit/project-audit/evidence/security-probe.junit.xml`
   — финальный exit 0, 3 tests, 10 assertions, 2 PHP deprecations;
   JUnit errors=0, failures=0, skipped=0. Probes воспроизводят unsafe behavior,
   а не проверяют remediation. Предварительные итерации исправляли только
   diagnostic fixture/mock assumptions; они не считаются успешными запусками.
6. `./vendor/bin/sail node docs/audit/project-audit/evidence/security-http-probe.mjs`
   — exit 0. Только loopback, GET; cookies/body values не сохраняются.
7. `./vendor/bin/sail exec -T laravel.test python3 docs/audit/project-audit/evidence/security-static-scan.py`
   — exit 0; 12 credential-полей, без вывода values. Это candidate fields,
   не утверждение о двенадцати действующих live secrets.
8. `./vendor/bin/sail php ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --sequential docs/audit/project-audit/evidence/SecurityProbeTest.php`
   — exit 0, исправлено 0/1 файлов. PHPDoc и scope проверены вручную.

## Изоляция и сохранённые данные

`phpunit.xml` задаёт APP_ENV=testing, DB_DATABASE=testing, array session/cache,
array mail; существующие tests используют RefreshDatabase и provider fakes/mocks.
Дополнительный probe запрещает внешние Laravel HTTP запросы. SDK request
регистрации Telegram только строится через toArray, send() не вызывается.
Webhook source probe посылает пустой payload: 500 после фильтра означает parser
rejection, а не проведённый платёж. Admin probe читает форму, новых production
администраторов не создаёт. Production БД не использовалась.

Исходные credentials, реальные журналы и response bodies не включены.
SecurityProbeTest.php содержит только synthetic credentials/identities.
Обычный `.env` не читался и не сохранялся в evidence. Сканируются только tracked
операционные Remnawave файлы; keys/line numbers в JSON можно публиковать внутри
этого аудиторского реестра без раскрытия secret values.

Локальный `/log-viewer` вернул 500: не считать это доказательством безопасной
работы endpoint или корректного guest redirect. HTTP status/header probe
не доказывает actual production exposure; source-level риски отделены в отчёте.

Deprecations: `config/database.php:62,82`, PDO::MYSQL_ATTR_SSL_CA.
Они не исправлялись и не подавлялись в diagnostic checks.
