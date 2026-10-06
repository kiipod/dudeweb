<?php

return [
    'shop_id' => env('YOOKASSA_SHOP_ID'),
    'secret_key' => env('YOOKASSA_SECRET_KEY'),
    'return_url' => env('YOOKASSA_RETURN_URL'),
    'webhook_url' => env('YOOKASSA_WEBHOOK_URL', '/webhooks/yookassa'),
    'webhook_allowed_ips' => env(
        'YOOKASSA_WEBHOOK_ALLOWED_IPS',
        '185.71.76.0/27,185.71.77.0/27,77.75.153.0/25,77.75.156.11,77.75.156.35,77.75.154.128/25,2a02:5180::/32',
    )
            |> (fn($x) => explode(',', $x))
            |> (fn($x) => array_map('trim', $x, ))
            |> array_filter(...)
            |> array_values(...),
];
