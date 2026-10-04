<?php

return [
    'shop_id' => env('YOOKASSA_SHOP_ID'),
    'secret_key' => env('YOOKASSA_SECRET_KEY'),
    'return_url' => env('YOOKASSA_RETURN_URL'),
    'webhook_url' => env('YOOKASSA_WEBHOOK_URL', '/webhooks/yookassa'),
];
