<?php

declare(strict_types=1);

use App\Http\Controllers\LandingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentReturnController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\YooKassaWebhookController;
use App\Http\Middleware\CheckYooKassaWebhookSource;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\ProvisioningController;

Route::get('/', LandingController::class)->name('home');

Route::middleware('guest:web')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:web-login')->name('login.store');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('throttle:web-register')->name('register.store');
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('throttle:web-recovery')->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->middleware('throttle:web-reset')->name('password.update');
});

Route::middleware(['auth:web', 'auth.session'])->group(function (): void {
    Route::delete('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/account', [ProvisioningController::class, 'show'])->name('account.dashboard');
    Route::post('/account/provisioning', [ProvisioningController::class, 'store'])->middleware('throttle:web-provision')->name('account.provisioning.store');
});

Route::post('/payments', [PaymentController::class, 'store'])
    ->middleware(['auth:web', 'auth.session'])
    ->name('payments.store');

Route::get('/payments/return', PaymentReturnController::class)
    ->name('payments.return');

Route::post('/webhooks/yookassa', YooKassaWebhookController::class)
    ->middleware(CheckYooKassaWebhookSource::class)
    ->name('webhooks.yookassa');

Route::get('/test', TestController::class);
