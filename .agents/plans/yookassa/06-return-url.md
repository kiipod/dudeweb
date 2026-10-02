# Шаг 6 — Return URL после оплаты

Фронтенд-страниц нет.

Пользователь возвращается:

- либо в Telegram;
- либо на минимальный backend response / configured URL.

## Задачи

- [ ] Добавить `GET /payments/return`
- [ ] Реализовать обработчик возврата
- [ ] Определить источник платежа безопасным способом

### Telegram

- [ ] Для `source = telegram` выполнить redirect в Telegram-бота
- [ ] Использовать username бота из конфигурации
- [ ] Не хардкодить username

### Configuration

- [ ] Проверить существующую Telegram-конфигурацию
- [ ] Если отсутствует — добавить `TELEGRAM_BOT_USERNAME` в `.env.example`
- [ ] Добавить соответствующее значение в существующий Telegram config / `config/services.php`
- [ ] Использовать `/payments/return` как YooKassa return URL

### Access

- [ ] Маршрут не должен требовать авторизации
- [ ] Не полагаться на пользовательскую browser session для определения результата платежа

## Проверка

- [ ] `/payments/return` доступен без авторизации
- [ ] Telegram payment возвращает пользователя в бота
- [ ] username бота берётся из config
- [ ] обычный payment получает предусмотренный fallback response / redirect

## Commit

`feat: add yookassa payment return handler`
