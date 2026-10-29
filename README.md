# Официальный репозиторий сервиса «dudeweb»

![PHP Version](https://img.shields.io/badge/php-%5E8.4-7A86B8)
![MySQL Version](https://img.shields.io/badge/PostgreSQL-18-F29221)
![Laravel Version](https://img.shields.io/badge/laravel-%5E12.30-F13C37)

## О проекте

«dudeweb» — сервис для доступа к глобальному интернету. Включает в себя функционал чат-бота в telegram и api для работы с панелью Remnawave.

## Начало работы

Чтобы развернуть проект локально выполните последовательно следующие действия:

0. Для запуска проекта необходимо установить WSL, если вы пользуетесь Windows.

```bash
wsl --install
```

а) Необходимо установить <a href="https://www.docker.com/products/docker-desktop/">Docker Desktop</a> (для Linux или Windows)

б) Необходимо установить PHP версии 8.4 со всеми необходимыми расширениями. Выполните последовательно команды в терминале WSL:

```bash
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.4-{curl,intl,mysql,readline,xml,mbstring,gd,zip,cli}
```

Для проверки установки выполните команду в терминале:

```bash
php -v
```

в) Если у вас установлено несколько версий PHP, то выполните в консоли следующую команду и выберите версию PHP 8.3 по ее номеру в списке:

```bash
sudo update-alternatives --config php
```

г) Установите Composer, если он еще не установлен, выполнив последовательно команды:

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
sudo mv composer.phar /usr/local/bin/composer
php -r "unlink('composer-setup.php');"
```

Для проверки установки выполните в терминале команду:

```bash
composer
```

д) Установите <a href="https://github.com/nvm-sh/nvm">NVM</a>, если он еще не установлен, выполнив команду:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

После выполнения команды перезапустите терминал и далее выполните команду
для установки Node.js, соответствующего `engines.node` в `package.json`
(сейчас — не ниже 24.22.1 в ветке 24):

```bash
nvm install 24
```

Для проверки установки выполните команды последовательно в терминале:

```bash
nvm -v
node -v
npm -v
```

1. Клонируйте репозиторий:

```bash
git clone git@github.com:kiipod/dudeweb.git
```

2. Перейдите в директорию проекта:

```bash
cd dudeweb
```

3. Установите зависимости Composer, выполнив команду:

```bash
composer install
```

4. Установите зависимости NPM, выполнив команду:

```bash
npm install
```

5. Затем создайте файл .env:

```bash
cp .env.dev.example .env
```

И пропишите в нем настройки, соответствующие вашему окружению.

6. После этого сгенерируйте ключ приложения:

```bash
php artisan key:generate
```

7. Cборка проекта для фронтенда создается с помощью Vite командой:

```bash
npm run build
```

8. Для запуска Docker-контейнера запустите команду:

```bash
make start
```

9. После запуска Docker-контейнера запустите миграции:

```bash
make migrate
```

10. Админ.панель доступна по адресу: `http://localhost/cp` - для Windows, `http://0.0.0.0/cp` - для Linux.

Изначально админ.панель создается без администратора, для того чтобы создать администратора выполните команду:

```bash
make admin
```
И введите все регистрационные данные.

## Node.js в Laravel Sail

Dev-контейнер приложения собирается из Sail runtime PHP 8.5. В `compose.yaml`
аргумент `build.args.NODE_VERSION: '24'` выбирает ветку NodeSource, а
минимальную версию Node.js задаёт `engines.node` в `package.json`.
`NODE_VERSION` принимает major, например `24`, а не `24.22.1`.

Чтобы обновить Node.js в существующем образе до актуального патча ветки 24:

```bash
./vendor/bin/sail build --no-cache laravel.test
./vendor/bin/sail up -d --no-deps laravel.test
./vendor/bin/sail node --version
./vendor/bin/sail npm --version
./vendor/bin/sail npm run build
./vendor/bin/sail composer test
```

Проверяйте, что установленная версия удовлетворяет `engines.node`.
Обычный restart не обновляет пакеты образа; после пересборки нужно
пересоздать контейнер командой `up`. Пересоздание затрагивает только
`laravel.test`, не требует `down -v` и сохраняет данные PostgreSQL.
Полная пересборка обновляет также системные пакеты и патч PHP в выбранной
ветке runtime, поэтому после неё нужны проверки приложения.
Установка Node.js вручную в работающий контейнер не сохраняется при его
следующем пересоздании. Production использует отдельный
`docker/app/Dockerfile` с собственной настройкой Node.js.

Порядок соответствует [документации Sail](https://github.com/laravel/docs/blob/13.x/sail.md#node-versions).

## Node.js в production Docker

Сервис `app` передаёт в `docker/app/Dockerfile` build arg
`NODE_VERSION: '24.22.1'` из `docker-compose-prod.yml`. В отличие от Sail,
здесь задаётся полная версия: Dockerfile берёт Node.js и npm из официального
`node:${NODE_VERSION}-alpine`, совместимого с Alpine-базой PHP. Node/npm
установлены в `/usr/local` и доступны пользователю `deploy` без NVM.
OPcache уже встроен в PHP 8.5, поэтому отдельно через
`docker-php-ext-install` не собирается.

Для проверки и сборки образов без запуска production-сервисов:

```bash
docker compose -f docker-compose-prod.yml config --quiet
docker compose -f docker-compose-prod.yml build app
docker compose -f docker-compose-prod.yml run --rm --no-deps app node --version
```

При смене версии обновляйте аргумент сервиса `app` и default
`ARG NODE_VERSION` в Dockerfile; версия должна удовлетворять `engines.node`.
Пересборка образов сама по себе не обновляет уже работающие контейнеры.

## Планировщик в production

Контейнер `app` запускает Supervisor как основной процесс. Под пользователем
`deploy` работают PHP-FPM, Inertia SSR renderer и единственный `php artisan schedule:work`.
Supervisor автоматически перезапускает завершившиеся процессы; расписание и
`withoutOverlapping` по-прежнему определяются в `routes/console.php`.
Отдельный Compose-сервис scheduler и внешний cron для `schedule:run` не нужны.

```bash
docker compose -f docker-compose-prod.yml exec app supervisorctl -c /etc/supervisord.conf status
docker compose -f docker-compose-prod.yml exec app supervisorctl -c /etc/supervisord.conf restart laravel-scheduler
docker compose -f docker-compose-prod.yml logs -f app
```

В Makefile этим операциям соответствуют `make supervisor-status` и
`make schedule-restart`. После изменения кода долгоживущий планировщик нужно
перезапустить; при пересоздании контейнера Supervisor запустит его сам.
`make dev-schedule` остаётся ручной командой для dev Sail.

При остановке Supervisor сначала посылает TERM планировщику, давая Laravel
до 60 секунд на завершение текущего запуска, затем QUIT для PHP-FPM с ожиданием
до 30 секунд, затем TERM для SSR renderer с ожиданием до 10 секунд.
При превышении лимита завершается вся группа соответствующего процесса.
Compose предоставляет контейнеру 2 минуты на завершение.
Логи процессов идут в stdout/stderr контейнера.

Изолированная проверка перезапуска, graceful shutdown и завершения зависшей
группы процессов выполняется внутри production-образа:

```bash
docker compose -f docker-compose-prod.yml run --rm --no-deps app python3 tests/Infrastructure/test_supervisor_runtime.py
```

Тест использует настоящий PHP-FPM и управляемую замену scheduler, поэтому
бизнес-задачи и обращения к внешним сервисам не выполняются.
Этот тест изолирует PHP-FPM/scheduler; SSR lifecycle и HTTP/hydration отдельно
проверяются через Sail, как описано в [SSR deployment](docs/deployment/ssr.md).

При переходе со старой конфигурации сначала соберите новый образ, затем
остановите и удалите старый контейнер `scheduler`, если он существует
(`docker stop scheduler`, `docker rm scheduler`), и пересоздайте `app`.
Также уберите прежний host cron для `schedule:run`, если он был настроен,
чтобы не запускать расписание дважды.

## SSR в production

Supervisor автоматически запускает `inertia-ssr` из собранного
`bootstrap/ssr/ssr.js`. Renderer доступен только внутри `app` на
`127.0.0.1:13714`; Compose включает SSR и задаёт Laravel тот же адрес.
Порт SSR не публикуется. Нужны обе сборки: `npm run build`.

`make ssr-check` проверяет Laravel→renderer, `make ssr-restart` загружает новый
bundle, `make ssr-smoke SSR_BASE_URL=https://your-domain` проверяет SSR HTML
четырёх публичных страниц через реальный HTTP endpoint. Команды выполняются
в контейнере `app`. Docker healthcheck проверяет renderer и наличие сборок;
он не заменяет HTTP/hydration acceptance.

Порядок установки и обновления, диагностика и проверенные ограничения:
[docs/deployment/ssr.md](docs/deployment/ssr.md).

## Почта и подтверждение email

Dev использует SMTP и контейнер Mailpit. Порядок проверки писем, обязательное
подтверждение email перед бесплатным доступом и перенос SMTP-настроек на
production описаны в [docs/mail.md](docs/mail.md).

## Браузерные тесты

Playwright Test и Chromium запускаются внутри Laravel Sail:

```bash
./vendor/bin/sail npx playwright install chromium
./vendor/bin/sail npm run test:e2e
```

Подготовка, настройки viewport/theme и расположение отчётов описаны в
[docs/browser-testing.md](docs/browser-testing.md).
