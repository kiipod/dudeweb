# Performance Audit

Дата: 2026-10-29; этап 06 (`06-perfomance-audit.md`, имя файла сохранено),
ветка `project-audit`, исходная ревизия `e564464`. Диагностика завершена с
ограничениями ниже. Production-код и настройки не изменены.

Новых findings: **P0 — 0, P1 — 0, P2 — 2, P3 — 0**: PERF-001 и PERF-002 OPEN.
Целевые численные бюджеты производительности и production SLA не согласованы;
ниже указаны измеренные значения, а не выдуманные нормативы.

## 1. Scope and Dependencies

Прочитаны overview, текущая задача, README и findings в canonical
`docs/audit/project-audit/`, отчёты frontend/backend. Старых файлов
`docs/audit/README.md` и `docs/audit/findings.md` нет. Этап 01 inventory ещё не
завершён. Pen-этап остаётся BLOCKED: после 1 ноября повторно проверить MCP и
вернуться к связанным задачам. Для измерений Pen не требуется и не вызывался.

Skills: php-per-cs3 (PHP review/diagnostic source), laravel-best-practices
(DB, HTTP, cache, scheduler), vue-best-practices (bundle и lifecycle),
tailwind-best-practices (CSS/animation). Design tokens и shared UI существуют;
новых компонентов, tokens, зависимостей и оптимизаций не добавлялось.

Измерены публичные `/` и `/login`, local subscription history/referral readers,
device enforcement при rate limit и план referral count. Проанализированы
account dashboard/connection, каталог, support pagination, payment polling,
provider clients и scheduler. Это не полный production profile, не нагрузочный
тест и не запуск всех тестов этапа 07.

## 2. Environment and Reproduction

Все runtime команды выполнялись через Sail. Сохранены воспроизводимые скрипты
и безопасные результаты в [протоколе](evidence/performance-checks.md).

- Local Linux x64, shared host-visible 16 logical CPU, AMD Ryzen 7 7700;
  видимая память 16 267 800 576 bytes не означает выделенный benchmark budget.
- PHP 8.5.12, Laravel 13.38.0, PostgreSQL 18.0, Node 24.22.1, Vite 8.3.4,
  Vue 3.5.44, Inertia 3.9.1, Tailwind 4.3.3, Playwright 1.64.1.
- Live local endpoint: APP_ENV local, debug=true, cache/session=file,
  queue=database, SSR enabled=false. Production CSS/JS построены отдельно;
  Laravel server остаётся development, а не production deployment.
- Chromium headless, locale ru-RU, 390×900 и 1440×900, обычное motion,
  без CPU/network throttling. Новый browser context для каждого sample;
  server/OS caches не сбрасывались. Наблюдение с coverage само добавляет overhead.
- DB probe: APP_ENV testing, pgsql, RefreshDatabase, синтетические factories,
  Http::preventStrayRequests, без живых Remnawave/YooKassa/Telegram calls.

[environment.json](evidence/performance-environment.json) фиксирует версии и
разрешённые параметры конфигурации без секретов. Build client завершился за
4.20s; SSR build не запускался, `bootstrap/ssr` не изменялся.

## 3. Frontend Bundle and Assets

| Asset | Uncompressed bytes | gzip bytes (Node gzipSync) |
|---|---:|---:|
| app-DoLRCyK-.js | 412950 | 122796 |
| app-BPA5a4ne.css | 147855 | 26493 |

gzip здесь рассчитан скриптом; он немного отличается от вывода Vite и не
объявляется фактическим HTTP Content-Encoding/transfer size.

`resources/js/app.js` использует `import.meta.glob('./pages/**/*.vue',
{ eager: true })`: все **16 page SFC** входят в initial graph. Manifest не имеет
page dynamicImports, на `/login` загружается тот же JS, что на landing. V8 coverage
в login sample зарегистрировал 1602 functions, из них 1012 не выполнялись за
ограниченный сценарий загрузки/ввода/scroll. Это счётчик функций, не процент
неиспользованных байтов и не доказательство, что весь такой код можно удалить.
Подтверждённая причина избыточной initial загрузки — PERF-001.

Tailwind CSS production output минифицирован; само по себе 147855 bytes без
согласованного бюджета не является отдельным finding. Импорты шрифтов локальные,
без third-party font API. Landing загружает 12 font resources с суммарным
transferSize 212476 bytes в первом sample, login — 2 / 75824 bytes. Варианты
mono используются в landing; их нельзя объявить лишними только по количеству.
Неиспользованные языковые subsets присутствуют на диске, но не все загружаются.

На двух измеренных страницах document.images пуст: hero и марки используют SVG,
нет raster image waterfall, для которого можно измерить lazy loading. Это не
доказательство отсутствия image problems на всех маршрутах. Styles/fonts
изучены вместе с resource timing, blanket finding про lazy images не создавался.

## 4. Browser Timing and Web Vitals

Медианы трёх samples для каждой комбинации (ms, кроме CLS):

| Route | Width | TTFB | FCP | LCP observed | CLS observed |
|---|---:|---:|---:|---:|---:|
| / | 390 | 49.9 | 192 | 192 | 0.038 |
| /login | 390 | 26.2 | 100 | 100 | 0.000 |
| / | 1440 | 37.4 | 204 | 204 | 0.001 |
| /login | 1440 | 24.8 | 104 | 104 | 0.004 |

LCP — последняя запись observer в коротком сценарии, не field percentile.
CLS — сумма shifts без recent input за этот сценарий; session-window field
aggregation не реализована. Navigation TTFB включает local endpoint и loopback,
не отражает удалённую сеть, TLS/CDN или нагрузку. Raw samples, ресурсы и coverage
сохранены в [browser.json](evidence/performance-browser.json).

**INP не получен.** Event Timing observer не зарегистрировал interaction entries
в этом коротком сценарии; ввод через fill и пустой массив нельзя выдавать за INP=0
или успешную INP приёмку. Нужны репрезентативные реальные взаимодействия и
полноценная методика/field collection в отдельной проверке.

Landing initial long tasks: 51–80ms в части samples; login long tasks не
зарегистрированы. 45 кадров последовательного scroll на sample: максимальный
rAF interval 17.6ms по всем 12 samples. Это не physical device FPS и не профиль
под CPU throttling. SSR marker отсутствует, согласуется с SSR disabled; ранее
открытое ограничение operational SSR не закрывается этими измерениями.

## 5. Frontend Runtime

Проверены useServiceCloud, hero renderer boundary, useDashboardRefresh,
usePaymentStatus и relevant resource timing. Cloud использует rAF, intersection,
visibility и reduced-motion gates, cleanup observers/listeners. Нет измеренного
основания менять animation engine. Scroll handler passive; локальный короткий
scroll не показал устойчивого frame stall. Автоматизация не заменяет мобильное
устройство, GPU trace и длительный interaction profile.

Dashboard refresh не запускает параллельную повторную загрузку пока busy и
отменяется при unmount. Payment polling использует partial `payment`, интервал
после завершения запроса, stop на terminal status/error, deadline 60s и cleanup.
Это ограничивает повторы; реальный pending payment для измерения не создавался.
FE-001 о Telegram refresh остаётся отдельным ранее зарегистрированным дефектом.

Доказательств Vue rerender storm в исследованных сценариях нет. Vue DevTools
component render count не снимался; это ограничение, а не подтверждённое отсутствие
лишних рендеров. JS performance.memory вернул одинаковые округлённые 10000000
bytes; использовать это как точный heap profile или доказательство отсутствия
утечек нельзя.

## 6. Database

Измерения service-level, без HTTP middleware/auth/SSR. Owner без numeric remote
mapping, один product, каталог в этом fixture пуст; mapped remote branch в
subscription timing не участвовал. Число payments и referrals 1 → 40:

| Scenario | Rows | SQL queries | SQL ms | Wall ms | Serialized payload bytes |
|---|---:|---:|---:|---:|---:|
| Subscription | 1 | 7 | 4.67 | 13.469 | 738 |
| Subscription | 40 | 7 | 3.23 | 5.924 | 2522 |
| Referral | 1 | 2 | 1.98 | 5.387 | 89 |
| Referral | 40 | 2 | 1.19 | 2.022 | 90 |

Более быстрый второй вызов отражает прогрев/шум, не ускорение от увеличения данных.
История платежей возвращает максимум 10 rows, product/plan загружаются eagerly
с ограниченными columns. Referral считает count/sum на БД, не гидратирует друзей.
На device batch для 10 пользователей выполнены 4 queries благодаря eager loading
latestSuccessfulPayment.product.plan. N+1 в этих ветках не подтверждён.

SupportData: tickets paginate(20) с eager latestMessage и conversation paginate(50),
не чтение всего чата; статически проверено, отдельный large support profile не
выполнялся. Stream services обрабатывают страницы, referral retries и merge
resume используют lazyById(100). Pagination сама по себе не устраняет стоимость
COUNT/OFFSET на большой БД; глубокие страницы не измерялись.

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT count(*) по referrer_user_id после
ANALYZE users на 1041 синтетических rows: Seq Scan, 40 matches, 1001 filtered,
17 shared-hit blocks, execution **0.053ms**. Отсутствие индекса на referrer_user_id
видно в schema предыдущего этапа, но такой план на малой таблице не доказывает
bottleneck. Новая migration/index не рекомендована как обязательное исправление
без production-like cardinality/selectivity и повторного сравнения планов.

Тяжёлый JOIN/large sort/temp spill не подтверждён; полный production query log,
EXPLAIN всех endpoints и мониторинг pg_stat_statements недоступны в этом этапе.
SELECT * в коротких ownership/provisioning reads не помечен автоматически как
проблема; исключение columns оправдано только реальной стоимостью/размером.

## 7. Backend, Scheduler and Memory

AccountDashboardData выполняет два последовательных remote чтения (user и HWID)
с per-call response/connect timeouts 5/3s. Это осознанный свежий owner read;
суммарное ожидание может складываться. AccountConnectionDevices использует
аналогичную boundary. Реальная latency провайдеров не измерялась, поэтому такой
путь не объявлен нарушением неизвестного SLA и не предложен cache provider truth
без политики свежести/invalidation.

BaseApi без override наследует Laravel defaults 30s response / 10s connect;
автоматического общего retry/backoff нет. Ошибки API превращаются в ApiException.
YooKassa Client singleton задаёт auth; retry/transport default policy остаётся
установленного SDK. Внешние mutation retries требуют сохранения idempotency
и восстановления BE-001/004/005/008; универсальный автоматический retry опасен.

Notifier sends под row lock остаются риском contention и неатомарного внешнего
эффекта из backend report. Lock-wait/load measurement нет, поэтому отдельный
PERF finding не создан. Собственных dispatched Jobs нет; queue driver database
сам по себе не делает sync HTTP асинхронным. Supervisor запускает один
schedule:work; тяжёлые hourly reminders/device enforcement могут задерживать
следующие due tasks при долгой сети. Проверено по коду расписания, фактический
production backlog/duration не измерялся. withoutOverlapping предотвращает
перекрытие одной задачи, но не устанавливает rate-limit budget провайдера.

Пик выделенной PHP памяти в диагностическом процессе: **70254592 bytes**
(около 67 MiB; PHPUnit peak показал 69 MB). Включает framework/test harness,
фабрики и query logging; не RSS worker, не server request budget и не endurance
profile. Unbounded загрузка всей таблицы в проверенных batch цепочках не найдена.
Память/время полного многотысячного remote stream не моделировались.

## 8. External Integrations and Rate Limits

Device enforcement: один stream request, eager local lookup, затем по одному
HWID GET на eligible user, без параллельной очереди. Это O(N) внешних requests,
само по себе оправдано проверкой устройств; API batch capability не выдумывалась.

В синтетическом page из 10 eligible Telegram users каждый HWID ответ — 429 с
Retry-After:60. Результат: **10 HWID requests за 52.983ms**, checked=0, failed=10,
4 SQL queries. После первого rate limit отправлены ещё девять запросов до
истечения cooldown: **PERF-002**. Probe не ждёт 60s и не вызывает живой API;
результат доказывает отсутствие cooldown, а не реальную скорость провайдера.

YooKassa calls ограничены пользовательским intent/webhook processing; повтор
создания и межоперационная идемпотентность уже BE findings. Telegram отправки
вызваны конкретными notifier сценариями, есть sent markers и retry schedule;
реальная доставка и провайдерские rate limits не измерялись. Численный production
request rate и реальные тарифные лимиты неизвестны; никаких provider load tests.

## 9. Measured Problems and Targets

| Scenario | Metric | Baseline | Target | Finding |
|---|---|---|---|---|
| Cold login | Initial JS graph / function coverage | 412950 bytes, 16 eagerly included pages, 0 page dynamicImports; 1012/1602 functions unexecuted in sampled login | Загружать page code по маршруту, сохранить shared chunks и navigation/SSR contracts; byte budget определить отдельно | PERF-001 P2 |
| Device batch / provider 429 | Requests after first rate limit | 9 дополнительных HWID calls внутри 52.983ms, Retry-After=60s | Уважать provider cooldown с bounded retry/defer, не продолжать тот же поток запросов до разрешённого срока | PERF-002 P2 |

Цели качественные и выведены из устранения подтверждённого неэффективного
поведения. Не утверждается, что конкретный размер bundle или все latency
обязаны уложиться в несуществующий согласованный численный SLA.

## 10. Verification and Next Boundary

[Единый реестр](findings.md): причины, условия, критерии устранения PERF-001/002.
Diagnostic PHP probe: **1 test, 14 assertions, 0 failures/errors, 2 deprecations**
(существующий BE-007). Browser: 12 completed navigation samples, все HTTP 200;
INP не получен. Evidence содержит JSON, JUnit, исходники и протокол команд.

Проверены baseline, backend/DB/external/frontend concerns из задачи; неполученный
INP и прочие limitations явно сохранены. Нет production fixes, секретов или
production data в новых доказательствах. Этап 07 не начат; результаты этапа 06
подготовлены для отдельного коммита по указанию пользователя.

## Follow-up — stage 09

Этап09: login loaded JS236479 bytes против412950 baseline, fake429 HWID requests1 вместо10, SQL counts сохранены. Timings after под concurrent regression не доказывают улучшение Web Vitals. См. [refactoring.md](refactoring.md), source fixes FIXED, не VERIFIED.
