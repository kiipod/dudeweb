<?php

declare(strict_types=1);

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('App');
});

Route::post('/payments', [PaymentController::class, 'store'])
    ->middleware('auth:web')
    ->name('payments.store');
