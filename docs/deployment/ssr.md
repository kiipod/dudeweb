# Inertia SSR в production

Laravel/PHP-FPM и Node renderer работают под `deploy` в одном контейнере `app`.
Supervisor запускает `/usr/local/bin/node /app/bootstrap/ssr/ssr.js`, перезапускает
его при завершении и направляет stdout/stderr в логи контейнера. Прямой запуск
Node оставляет Supervisor владельцем самого renderer, без промежуточного Artisan
процесса и его автоматического `inertia:stop-ssr` при старте.

Renderer слушает только `127.0.0.1`. Production Compose задаёт согласованные
`INERTIA_SSR_ENABLED=true`, `INERTIA_SSR_URL=http://127.0.0.1:13714` и
`INERTIA_SSR_PORT=13714`. Это фиксированный контракт сервиса; для изменения порта
нужно одновременно обновлять все три настройки. `.env.prod.example` содержит те
же значения. Не публикуйте порт13714 и не проксируйте `/render`/`/shutdown` через
Caddy. Node24.22.1 уже доступен `deploy` в `/usr/local/bin`.

## Первый запуск

Настройте production `.env` (APP_ENV=production, APP_DEBUG=false, ключ приложения,
БД и фактический TRUSTED_PROXIES). Секреты остаются вне Git. Репозиторий bind-mounted
в `/app`, поэтому образ сам по себе не содержит dependencies или сборку приложения.
Все следующие команды предназначены для production host, выполняются оператором
при развёртывании и не запускались против действующей инфраструктуры при подготовке.

```bash
docker compose -f docker-compose-prod.yml config --quiet
docker compose -f docker-compose-prod.yml build app
docker compose -f docker-compose-prod.yml run --rm --no-deps app composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
docker compose -f docker-compose-prod.yml run --rm --no-deps app npm ci
docker compose -f docker-compose-prod.yml run --rm --no-deps app npm run build
```

`run` заменяет основной CMD: Supervisor/scheduler при сборке не запускаются.
Должны существовать `public/build/manifest.json`, все referenced client assets,
`bootstrap/ssr/ssr.js`, SSR map/manifest и runtime Node dependencies (`node_modules`).
Не удаляйте `node_modules` после сборки: SSR bundle использует external imports.
`public/hot` должен отсутствовать. Если он остался от dev Vite, остановите dev server
и удалите stale файл до релиза. Не используйте `npm run dev` на production.

Согласуйте применение новых migrations и config cache с текущей процедурой релиза
до подачи трафика. При свежей установке поднимите PostgreSQL отдельно; migrations
выполняйте только после проверки подключения/backup и разрешения на rollout.
Убедитесь, что `deploy` имеет доступ к `storage`, `bootstrap/cache` и сборкам.

```bash
docker compose -f docker-compose-prod.yml run --rm --no-deps app php artisan config:cache
docker compose -f docker-compose-prod.yml up -d --no-deps --force-recreate app
docker compose -f docker-compose-prod.yml exec app supervisorctl -c /etc/supervisord.conf status
docker compose -f docker-compose-prod.yml exec app php artisan inertia:check-ssr
```

Все три процесса должны быть RUNNING; контейнер должен перейти в healthy.
PHP-FPM и scheduler запускаются штатно, реальные business jobs могут выполняться:
этот запуск относится к deployment, а не к изолированной проверке.

## Обновление работающего приложения

Для текущего bind-mount deployment используйте согласованное окно обслуживания
или подготовленный отдельный release directory: перезапись сборок во время трафика
не является атомарным релизом. Установите dependencies и соберите обе сборки
`npm run build`, обновите config cache внутри production сервиса. После смены кода
или dependencies пересоздайте `app`, чтобы обновились PHP-FPM/OPcache, scheduler,
SSR process и environment одновременно. После изменения образа или Compose
пересоздание обязательно; обычный restart не меняет environment/config образа.

Если изменились только frontend assets без PHP/config/image/dependencies, после
сборки можно выполнить `make ssr-restart`; это принудительно загрузит новый bundle.
`make ssr-start` запускает остановленный renderer, но не создаёт второй процесс.
Не запускайте параллельно ручной `php artisan inertia:start-ssr` в этом контейнере.

```bash
make supervisor-status
make ssr-restart
make ssr-check
make ssr-smoke SSR_BASE_URL=https://your-domain
```

Последняя команда делает только GET `/`, `/login`, `/register`, `/forgot-password`,
требует HTTP200, SSR marker и h1 в начальном HTML; redirects/fallback CSR считаются
ошибкой. HTML/Inertia props и cookies не выводятся в лог. Подставьте реальный домен,
доступный из app через production Caddy. При закрытом Basic Auth/maintenance
endpoint smoke не пройдёт: выполните после открытия публичных страниц.
Smoke не заменяет проверку hydration в браузере после релиза.

## Healthcheck и диагностика

Compose каждые30s запускает `node scripts/check-ssr.mjs`: SSR/client artifacts
существуют, `public/hot` отсутствует, renderer отвечает `/health` за3s.
Timeout5s, start period30s, retries3. Проверяется SSR, не доступность БД/PHP-FPM
или качество HTML. Контейнерный статус unhealthy сам по себе не вызывает Docker
restart; process exits обрабатывает Supervisor. Для unhealthy нужен alert и
диагностика оператором, а не бесконечные рестарты всего приложения.

```bash
docker compose -f docker-compose-prod.yml logs --tail=100 app
make supervisor-status
make ssr-check
```

Если Supervisor показывает FATAL, проверьте наличие bundle/dependencies, Node,
права `deploy` и отсутствие другого listener13714; после устранения причины
выполните `make ssr-start`. После исчерпания10startretries процесс сам не оживёт.
Если healthcheck зелёный, но SSR marker отсутствует, проверьте HTTP-процесс Laravel:
config cache, включённый SSR, URL и наличие `public/hot`/bundle. Значение из CLI
не доказывает environment уже запущенного HTTP-процесса. Не меняйте
`INERTIA_SSR_THROW_ON_ERROR` на true для production: сохраняется CSR fallback
при ошибке SSR. Для тестов true помогает обнаружить неуспешный render.

Shutdown: scheduler TERM≤60s → FPM QUIT≤30s → SSR TERM≤10s, container grace120s.
Это сохраняет renderer, пока PHP-FPM завершает запросы. Для SSR TERM/group kill
не оставляет дочерних процессов. In-flight SSR во время отдельного renderer restart
может перейти в CSR fallback; безостановочный rolling release этой схемой не заявлен.

## Локальная проверка подготовки

Все тесты выполняются только через Sail; основной локальный HTTP endpoint и его
SSR-процессы не перезапускаются. Сначала соберите текущий bundle:

```bash
./vendor/bin/sail npm run build
./vendor/bin/sail exec -T -u sail laravel.test python3 tests/Infrastructure/test_ssr_runtime.py
```

Тест использует настоящий Supervisor и реальный built renderer под непривилегированным
пользователем, изолирует socket/port/logs, проверяет crash restart, health failure/
recovery, SIGTERM cleanup и HTTP SSR/hydration40cases. Laravel HTTP server запускается
отдельно на random loopback port: testing DB, array cache/session/mail, sync queue.
Scheduler/PHP-FPM sections исключаются только в этом изолированном SSR-тесте;
production config остаётся с тремя процессами. PHP-FPM/scheduler lifecycle имеет
собственный `test_supervisor_runtime.py`, SSR там намеренно не запускается повторно.

Результаты подготовки: [ssr-verification.md](ssr-verification.md).
Схема согласуется с [Inertia3 SSR documentation](https://inertiajs.com/docs/v3/advanced/server-side-rendering)
и проверена по установленным Laravel adapter/Node server sources. Audit report
от29октября остаётся историческим: его8main-endpoint failures не переписаны под
новый результат. Pen и внешние operational acceptance gaps этим не закрываются.
