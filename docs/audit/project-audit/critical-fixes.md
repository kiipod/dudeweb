# Stage 08 — P1 fixes

Дата: 2026-10-29. Base `f886841`, ветка `project-audit`. Возобновление после
прерывания по лимиту; старый незавершённый запуск не засчитан как проверка.
Scope по указанию пользователя о переходе к 08: SEC-001, SEC-002, BE-001, BE-008,
плюс TEST-001 как regression coverage для SEC-002. P0 отсутствуют. P2/P3 вне этой
связи не исправлялись, этап 09 не начат. Этапы 01/02 остаются открытыми;
исправления не зависят от Pen. Использованы php-per-cs3 и laravel-best-practices.

## SEC-001 — safe configuration templates

В четырёх `app/Remnawave/Config/*.json` privateKey/password literals заменены на
`REPLACE_WITH_RUNTIME_SECRET`. Исходные snippet comments сохранены, это не новый
runtime template engine. Конфигурации нельзя отправлять провайдеру с markers:
реальные значения должны поступать из отдельного доверенного secret storage.

`docker/remnawave/.env.panel` и `.env.sub` исключены из Git index и внесены в
.gitignore; локальные файлы сохранены. Добавлены `.env.panel.example` и
`.env.sub.example` с безопасными markers для credential-полей. Compose-файлы и
их env_file wiring не менялись. Новая установка должна заполнить runtime env
согласно конкретному Compose stack; secret storage автоматически не создаётся.

**Владелец подтвердил в этой сессии: прежние значения — неиспользуемые тестовые
данные.** Их активность не выдаётся за результат внешней проверки. На основании
этого подтверждения ротация live credentials для этого материала не требуется;
история Git не переписывалась. Историческая находка сохраняется с приоритетом,
присвоенным при неизвестном статусе использования, и новым Resolution.

Проверка: `evidence/critical-secret-check.json` — 12 полей, locations/booleans
без значений/хешей, current index не содержит runtime env, файлы существуют и
игнорируются. Устранение source hygiene проверено, production secrets не тронуты.

## SEC-002 / TEST-001 — administrator authorization

Gate `manage-administrators` разрешён только `MoonshineUser::isSuperUser()`.
Оба системных ресурса, MoonShineUser и MoonShineUserRole, проверяют текущего
пользователя именно panel guard, Gate и родительские authorization rules.
Гость/web-only guard capability не получают. Ограничение действует на backend,
а не только на меню; support/operator permissions других ресурсов не менялись.

`AdminManagementAuthorizationTest`: operator denied для всех Ability,
HTTP list/form/create/update/delete обоих ресурсов возвращают 403; guest/web-only
не получают CREATE capability; superuser сохраняет все resource capabilities,
успешно создаёт и обновляет администратора на testing DB. Built-in self-delete
policy и иные business rules не расширялись. Существующие support/guard tests
также прошли в полном наборе. Attribute-конфигурация моделей не менялась.

## BE-008 — shared campaign cardinality

Новая миграция `2026_10_29_174815_allow_shared_promocode_usage.php` добавляет
обычный campaign FK lookup index перед снятием UNIQUE promocode_id. Существующие
миграции не правились. Service locks по user/promo, count и idempotency сохранены;
история merged owners не ограничивается новым UNIQUE owner/code, чтобы не
сломать AccountMergeOwnership при переносе совпадающих использованных кодов.

`SharedPromocodeRegressionTest`: два разных eligible user расходуют count=2,
повтор первым user не расходует снова; unlimited поддерживает несколько usage;
rollback при нескольких user одного code явно запрещён с RuntimeException.
DDL down/up при single-owner history сохраняет rows, после up второй usage
успешен. Rollback guard использует SELECT promocode_id + GROUP BY для PostgreSQL.
Это testing DB проверки, не rollback production.

## BE-001 — durable payment recovery

Новая миграция `2026_10_29_174816_add_subscription_recovery_markers_to_payments.php`
добавляет nullable timestamptz `subscription_source_expires_at` и
`subscription_applied_at`; Payment fillable/casts/PHPDoc обновлены.

SubscriptionExtender под существующим per-user mutation lock:

1. Повторно читает Payment и проверяет, что processing token не сменился.
2. Если применение уже подтверждено marker, не делает remote mutation повторно.
3. При первом расчёте сохраняет source и абсолютный target в UTC; fresh чтение
   возвращает timezone-aware значения из БД, без неоднозначного локального cast.
4. При retry разрешает remote expiry только равный source или target; другой
   expiry вызывает PaymentProcessingException до PATCH. Старый target без source
   также требует точного совпадения с remote либо manual reconciliation.
5. После успешного remote update записывает applied marker, повторно проверяя
   claim. Локальный complete/payment status по-прежнему отдельная транзакция.

Не применяется max(target,current) и не выполняется повторное addMonths при
неизвестном результате. Неоднозначный оплаченный intent остаётся Pending с
сохранённым target для сверки, не помечается delivered и не теряет срок молча.
Для старых ambiguous targets в production может потребоваться ручное сопоставление
с журналом провайдера; автоматический backfill или списание не выполнялись.

`SubscriptionRecoveryTest`: stale legacy target не делает PATCH, подтверждённая
операция не повторяется, retry от saved source сохраняет marker, утраченный claim
не запрашивает provider, expired subscription сохраняет точный UTC target.
Existing YooKassa retries/referral/merge contracts прошли полный набор.

Уточнён один существующий ошибочный expected в expired webhook test:
`2026-10-04 12:00 Europe/Moscow` + месяц = `2026-11-04 09:00 UTC`.
До нормализации сохранённый timestamp ошибочно обозначал 12:00 UTC, тогда как
remote PATCH уже отправлял 09:00 UTC. Теперь test проверяет **и** persisted UTC,
**и** фактический PATCH. Это усиление проверки business instant, не отключение
или ослабление теста ради успешного результата.

## Verification

```bash
./vendor/bin/sail exec -T laravel.test env INERTIA_SSR_ENABLED=false php artisan test --log-junit docs/audit/project-audit/evidence/critical-fixes.junit.xml
```

Финальный запуск: **317 tests, 3061 assertions, failures/errors/skipped=0**,
20.27s по Laravel runner. 306 deprecated / 11 plain passed — классификация
runner, две уникальные PHP 8.5 deprecations уже BE-007. Raw итог — JUnit;
`evidence/critical-fixes-checks.json` содержит безопасную сводку.

Предшествующие попытки и различие окружений не скрыты: обычный full Feature run
с включённым пользователем SSR получил stray requests к local renderer. Финальный
backend run использует SSR=false только для своего процесса, как baseline 07;
live SSR/config/.env не менялись. Это не новая SSR acceptance. Короткие промежуточные
запуски с ошибками timezone/rollback guard не считаются итоговым результатом.

PHP-CS-Fixer запущен через Sail только по затронутым PHP files; git diff --check
пройден. Frontend source/build/SSR bundles не менялись; 1766 E2E этапа 07 не
объявляются повторно выполненными после этих backend fixes. Реальных provider
запросов/списаний, concurrent workers, external key validation или deployment нет.

## Deployment and status boundaries

Изменения готовы к отдельным логическим коммитам: secret templates, admin
permissions+TEST-001, campaign migration, subscription recovery. Коммиты: SEC-001 `f78ef04`, SEC-002/TEST-001 `6709fc0`, BE-008 `8182155`,
BE-001 `fb8f13f`. Runtime env исключены из tracking. Посторонние правки
`.env.example` / `.env.prod.example` оставлены без изменений и вне scope.

Перед deployment нужны обычные staging/backup и согласованная остановка старых
payment consumers, применение обеих forward migrations перед новым кодом,
возобновление всех consumers одной версии. Nullable columns совместимы с чтением
старым кодом, но mixed workers не дают recovery гарантий нового кода. Индексная
DDL на большой production таблице не измерялась; выбрать подходящее окно.
Не применять down после начала обработки новых операций: это удалит durable
source/applied metadata; предпочтителен forward fix. Campaign down намеренно
отказывается сжать уже shared history.

SEC-001, SEC-002, BE-001, BE-008, TEST-001 — **FIXED**, автоматические проверки
описаны выше; **VERIFIED не присвоен**, production/independent acceptance не
подменяется локальным тестом. Новых findings P0/P1/P2/P3 — 0. Остановка перед 09.
