# Шаг 9 — Финальная проверка интеграции YooKassa

На этом шаге новая функциональность не добавляется.

Исправляются только ошибки, обнаруженные при финальной проверке.

## Configuration

- [ ] `composer show yoomoney/yookassa-sdk-php` показывает `3.13.2`
- [ ] `php artisan config:cache` выполняется
- [ ] реальные credentials отсутствуют в Git

## Routes

- [ ] `POST /payments` существует
- [ ] `GET /payments/return` существует
- [ ] `POST /webhooks/yookassa` существует
- [ ] payment creation требует auth
- [ ] return route доступен без auth
- [ ] webhook доступен без auth
- [ ] webhook исключён из CSRF

## Backend payment flow

- [ ] User может создать Payment
- [ ] Payment получает `pending`
- [ ] YooKassa payment создаётся
- [ ] `yookassa_payment_id` сохраняется
- [ ] `confirmation_url` сохраняется
- [ ] `confirmation_url` возвращается клиенту

## Telegram payment flow

- [ ] Пользователь выбирает тариф
- [ ] Создаётся Payment
- [ ] `source = telegram`
- [ ] Пользователь получает кнопку `Оплатить`
- [ ] Кнопка открывает YooKassa
- [ ] return URL возвращает пользователя в Telegram

## Successful payment

- [ ] YooKassa webhook принимается
- [ ] Payment становится `succeeded`
- [ ] Subscription продлевается
- [ ] Remnawave синхронизируется
- [ ] Promocode фиксируется
- [ ] Referral reward применяется при выполнении условий
- [ ] Telegram получает уведомление

## Idempotency

- [ ] Отправить один `payment.succeeded`
- [ ] Зафиксировать новую дату Subscription
- [ ] Повторно отправить тот же webhook
- [ ] Убедиться, что дата Subscription не изменилась
- [ ] Убедиться, что Promocode не использован повторно
- [ ] Убедиться, что ReferralReward не создан повторно

## Canceled payment

- [ ] `payment.canceled` устанавливает статус `canceled`
- [ ] Subscription не продлевается
- [ ] Telegram получает сообщение об отмене

## Security

- [ ] Secret key отсутствует в коде
- [ ] Secret key отсутствует в логах
- [ ] Неизвестный источник webhook отклоняется
- [ ] Webhook не зависит от пользовательской session
- [ ] Неизвестный Payment безопасно игнорируется / логируется

## Documentation

- [ ] Все задачи `01–08` отмечены выполненными
- [ ] Обновлён `00-overview.md`
- [ ] В плане нет незакрытых обязательных пунктов

## Commit

`test: verify yookassa payment integration`
