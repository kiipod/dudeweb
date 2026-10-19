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

После выполнения команды перезапустите терминал и далее выполните команду для установки 20 версии Node.JS:

```bash
nvm install 20
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

## Почта и подтверждение email

Dev использует SMTP и контейнер Mailpit. Порядок проверки писем, обязательное
подтверждение email перед бесплатным доступом и перенос SMTP-настроек на
production описаны в [docs/mail.md](docs/mail.md).
