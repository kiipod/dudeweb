# SMTP и подтверждение email

Web-регистрация создаёт локальный аккаунт и сессию, отправляет письмо и
перенаправляет на `/email/verify`. До подтверждения закрыты кабинет, повторный
provisioning и создание платежа. Сам `WebAccountProvisioner` также проверяет
подтверждение перед любым обращением к Remnawave.

Используются штатные Laravel `MustVerifyEmail`, событие `Registered`,
notification `VerifyEmail` с русским текстом, signed URL и
`EmailVerificationRequest::fulfill()` с событием `Verified`. Ссылка действует
60 минут, привязана к текущему пользователю и hash его email. Для открытия
ссылки нужна web-сессия этого аккаунта. Повторная отправка ограничена одним
запросом в минуту на пользователя, независимо от IP.

После подтверждения выполняется прежний idempotent provisioning. Три пробных
дня отсчитываются от сохранённого `email_verified_at`; повтор не меняет эту
дату и не продлевает trial. Сбой Remnawave сохраняет подтверждённый аккаунт и
показывает обычный `service_error` с повторной попыткой. Сбой SMTP сохраняет
аккаунт и сессию, показывает ошибку и позволяет запросить письмо снова.

Новая migration оставляет `email_verified_at = NULL` для существующих rows.
Прежние web-аккаунты тоже должны подтвердить email; автоматического backfill
нет. Существующий remote ID при подтверждении не пересоздаётся, новый trial
для него не начисляется. Telegram-регистрация и Telegram payments не меняются.
В будущем при изменении email в профиле нужно сбросить `email_verified_at` и
повторить verification; старая ссылка уже сейчас не подходит новому адресу.

## Dev: Mailpit

В `compose.yaml` добавлен `axllent/mailpit:v1.31.6` в сети Sail.
SMTP доступен приложению как `mailpit:1025`; SMTP-порт не публикуется на хост.
Web UI открыт только на loopback: [http://127.0.0.1:8025](http://127.0.0.1:8025).
Порт UI можно изменить через `FORWARD_MAILPIT_DASHBOARD_PORT`.
Письма хранятся внутри dev-контейнера и не отправляются реальным получателям;
пересоздание контейнера может удалить их.

Добавить в локальный `.env` (значения также находятся в `.env.example`):

```dotenv
MAIL_MAILER=smtp
MAIL_SCHEME=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS=hello@dudeweb.test
MAIL_FROM_NAME="${APP_NAME}"
MAIL_TIMEOUT=10
MAIL_REQUIRE_TLS=false
```

`MAIL_URL` должен отсутствовать или быть `null`, иначе он может переопределить
отдельные SMTP-параметры. `MAIL_ENCRYPTION` текущим `config/mail.php` не
используется; выбор SMTP/TLS задают `MAIL_SCHEME` и `MAIL_REQUIRE_TLS`.

```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan config:clear
./vendor/bin/sail artisan migrate
```

Открыть регистрацию, создать web-аккаунт, проверить появление письма в Mailpit
и перейти по ссылке под сессией этого пользователя. В dev Remnawave должен
быть настроен на нужное тестовое окружение: после подтверждения выполняется
реальный provisioning. Через `/forgot-password` аналогично проверяется
SMTP-письмо восстановления пароля. `log`/`array` вне tests не считаются
работающей доставкой и не показывают ложный успех.

Отправка verification и recovery синхронная: ответ об отправке появляется
после принятия письма SMTP-сервером. Это не подтверждение попадания во входящие.
Worker для этих уведомлений не требуется; timeout SMTP по умолчанию 10 секунд.

## Production: тот же SMTP transport

Mailpit остаётся только в dev compose. В production используется существующий
`docker-compose-prod.yml` и внешний SMTP-сервер. Новых Composer/npm packages
для SMTP не требуется. Параметры задаются в закрытом production `.env` или
через secret storage инфраструктуры; настоящие credentials не коммитятся.

Пример для SMTP с STARTTLS на 587:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://vpn.example.com
MAIL_MAILER=smtp
MAIL_SCHEME=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=replace-with-provider-username
MAIL_PASSWORD=replace-with-provider-secret
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME=dudeweb
MAIL_TIMEOUT=10
MAIL_REQUIRE_TLS=true
```

Для implicit TLS на 465 задать `MAIL_SCHEME=smtps`, `MAIL_PORT=465`;
`MAIL_REQUIRE_TLS=true` оставить. Поддержка `require_tls` проверена в
установленных Laravel MailManager и Symfony EsmtpTransportFactory: при
отсутствии TLS соединение завершается ошибкой. Проверку сертификата не отключать.
`MAIL_URL` оставить unset/null, если используются параметры выше.

Перед запуском указать реальный canonical HTTPS `APP_URL`, разрешённый у
SMTP-провайдера sender/domain и DNS-записи SPF/DKIM/DMARC по его инструкции.
Сохранить существующий `APP_KEY`: signed verification links зависят от него.
Корректная схема/host после proxy нужны и для ссылок из письма, и для проверки
их подписи. Auth routes явно используют `web`; MoonShine guard/broker не меняются.

После выкладки кода и настройки secrets выполнить внутри production app:

```bash
docker compose -f docker-compose-prod.yml exec -T app php artisan migrate --force
docker compose -f docker-compose-prod.yml exec -T app php artisan config:cache
```

Перезапустить долгоживущие app-процессы, если они используются. Для текущей
синхронной доставки отдельный queue worker не добавляется. Если позднее
уведомления переводятся в очередь, отдельно настроить worker, retries и
after-commit dispatch; `QUEUE_CONNECTION` сам по себе worker не запускает.

Production smoke: регистрация на контролируемый реальный адрес, получение
письма, подтверждение под правильным web-пользователем, повтор той же ссылки
без второго trial, восстановление пароля и проверка ошибок/логов. Проверка
Mailpit подтверждает dev SMTP pipeline; доступность внешнего SMTP, DNS и
доставляемость в реальный ящик проверяются после настройки production credentials.

## Проверки кода

```bash
./vendor/bin/sail artisan test --filter=Auth
./vendor/bin/sail artisan test --filter=EmailVerification
./vendor/bin/sail artisan test --filter=Password
./vendor/bin/sail npm run build
```

Feature tests покрывают guards, signed/expired/foreign/stale-email links,
ограничения до verification, SMTP error handling, повторную отправку,
сохранение intended destination и idempotent provisioning без продления trial.

## Первичные источники

- [Laravel Mail](https://laravel.com/framework/docs/mail) — SMTP и local mail.
- [Laravel Email Verification](https://laravel.com/framework/docs/verification) —
  contract, события, маршруты, signed URL и middleware.
- [Sail: Previewing Emails](https://laravel.com/framework/docs/13.x/sail#previewing-emails) — Mailpit.
- [Mailpit Docker](https://mailpit.axllent.org/docs/install/docker/) — image и порты.
- [Symfony Mailer: Ensure TLS](https://symfony.com/doc/current/mailer.html#ensure-tls) — обязательный TLS.
