# Шаг 6 — Return URL после оплаты

Фронтенд-страниц нет.

Пользователь возвращается:

- либо в Telegram;
- либо на минимальный backend response / configured URL.

## Задачи

- [x] Добавить `GET /payments/return`
- [x] Реализовать обработчик возврата
- [x] Определить источник платежа безопасным способом

### Telegram

- [x] Для `source = telegram` выполнить redirect в Telegram-бота
- [x] Использовать username бота из конфигурации
- [x] Не хардкодить username

### Configuration

- [x] Проверить существующую Telegram-конфигурацию
- [x] Если отсутствует — добавить `TELEGRAM_BOT_USERNAME` в `.env.example`
- [x] Добавить соответствующее значение в существующий Telegram config / `config/services.php`
- [x] Использовать `/payments/return` как YooKassa return URL

### Access

- [x] Маршрут не должен требовать авторизации
- [x] Не полагаться на пользовательскую browser session для определения результата платежа

## Проверка

- [x] `/payments/return` доступен без авторизации
- [x] Telegram payment возвращает пользователя в бота
- [x] username бота берётся из config
- [x] обычный payment получает предусмотренный fallback response / redirect

## Commit

`feat: add yookassa payment return handler`
