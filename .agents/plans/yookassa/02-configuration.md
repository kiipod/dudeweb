# Шаг 2 — Конфигурация YooKassa

## Задачи

- [ ] Создать `config/yookassa.php`

```
return [
    'shop_id' => env('YOOKASSA_SHOP_ID'),
    'secret_key' => env('YOOKASSA_SECRET_KEY'),
    'return_url' => env('YOOKASSA_RETURN_URL'),
    'webhook_url' => env('YOOKASSA_WEBHOOK_URL', '/webhooks/yookassa'),
];
```

- [ ] Добавить в .env.example:
  ```
  YOOKASSA_SHOP_ID=
  YOOKASSA_SECRET_KEY=
  YOOKASSA_RETURN_URL=
  YOOKASSA_WEBHOOK_URL=/webhooks/yookassa
  ```

- [ ] Добавить binding YooKassa\Client в существующий ServiceProvider
```
$this->app->singleton(\YooKassa\Client::class, function () {
    $client = new \YooKassa\Client();

    $client->setAuth(
        config('yookassa.shop_id'),
        config('yookassa.secret_key'),
    );

    return $client;
});
```

- [ ] Не хранить shop_id в коде
- [ ] Не хранить secret_key в коде
- [ ] Не добавлять реальные credentials в .env.example

## Проверка
- [ ] php artisan config:cache выполняется без ошибок
- [ ] app(\YooKassa\Client::class) возвращает клиент
- [ ] credentials берутся из environment
- [ ] секретные значения не попали в Git

## Commit
`chore: configure yookassa client`
