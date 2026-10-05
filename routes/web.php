<?php

declare(strict_types=1);

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentReturnController;
use App\Http\Controllers\YooKassaWebhookController;
use App\Http\Middleware\EnsureYooKassaWebhookSource;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('App');
});

Route::post('/payments', [PaymentController::class, 'store'])
    ->middleware('auth:web')
    ->name('payments.store');

Route::get('/payments/return', PaymentReturnController::class)
    ->name('payments.return');

Route::post('/webhooks/yookassa', YooKassaWebhookController::class)
    ->middleware(EnsureYooKassaWebhookSource::class)
    ->name('webhooks.yookassa');
