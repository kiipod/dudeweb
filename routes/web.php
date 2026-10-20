<?php

declare(strict_types=1);

use App\Http\Controllers\LandingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentReturnController;
use App\Http\Controllers\YooKassaWebhookController;
use App\Http\Middleware\CheckYooKassaWebhookSource;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\ProvisioningController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Account\DashboardController;
use App\Http\Controllers\Account\ConnectionController;
use App\Http\Controllers\Account\DeviceController;
use App\Http\Controllers\Account\ReferralController;
use App\Http\Controllers\Account\SupportController;
use App\Http\Controllers\Operator\SupportController as OperatorSupportController;
use App\Http\Controllers\ReferralInviteController;
use App\Http\Controllers\Account\SubscriptionController;
use App\Http\Controllers\Account\PromocodePreviewController;
use App\Http\Controllers\Account\PaymentStatusController;
use App\Http\Controllers\Account\PaymentRetryController;

Route::get('/', LandingController::class)->name('home');
Route::get('/invite/{token}', ReferralInviteController::class)
    ->where('token', '[A-Za-z0-9]{40}')->middleware('throttle:60,1')->name('referral.invite');

Route::middleware('guest:web')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:web-login')
        ->name('login.store');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware('throttle:web-register')
        ->name('register.store');
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('throttle:web-recovery')
        ->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('throttle:web-reset')
        ->name('password.update');
});

Route::middleware(['auth:web', 'auth.session'])->group(function (): void {
    Route::delete('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/email/verify', [EmailVerificationController::class, 'show'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:web-verification-send')->name('verification.send');
});

Route::middleware(['auth:web', 'auth.session', 'verified'])->group(function (): void {
    Route::get('/account', DashboardController::class)->name('account.dashboard');
    Route::get('/account/support', [SupportController::class, 'index'])->name('account.support.index');
    Route::get('/account/support/create', [SupportController::class, 'create'])->name('account.support.create');
    Route::post('/account/support', [SupportController::class, 'store'])->middleware('throttle:30,1')->name('account.support.store');
    Route::get('/account/support/{ticket}', [SupportController::class, 'show'])->name('account.support.show');
    Route::post('/account/support/{ticket}/messages', [SupportController::class, 'reply'])->middleware('throttle:60,1')->name('account.support.messages.store');
    Route::get('/account/connection', ConnectionController::class)->name('account.connection');
    Route::get('/account/referral', [ReferralController::class, 'index'])->name('account.referral');
    Route::get('/account/referral/terms', [ReferralController::class, 'terms'])->name('account.referral.terms');
    Route::delete('/account/connection/devices', [DeviceController::class, 'destroy'])->name('account.devices.destroy');
    Route::get('/account/subscription', SubscriptionController::class)->name('account.subscription');
    Route::post('/account/subscription/promo', PromocodePreviewController::class)->name('account.subscription.promo');
    Route::get('/account/payments/{payment}', PaymentStatusController::class)->name('account.payments.show');
    Route::post('/account/payments/{payment}/retry', PaymentRetryController::class)->name('account.payments.retry');
    Route::post('/account/provisioning', [ProvisioningController::class, 'store'])
        ->middleware('throttle:web-provision')
        ->name('account.provisioning.store');
});

Route::domain(config('moonshine.domain'))->prefix(config('moonshine.prefix', 'admin') . '/support')
    ->middleware(['moonshine', 'auth:moonshine', 'auth.session'])->group(function (): void {
        Route::post('/{ticket}/messages', [OperatorSupportController::class, 'reply'])->name('operator.support.reply');
        Route::post('/{ticket}/status', [OperatorSupportController::class, 'status'])->name('operator.support.status');
    });

Route::post('/payments', [PaymentController::class, 'store'])
    ->middleware(['auth:web', 'auth.session', 'verified'])
    ->name('payments.store');

Route::get('/payments/return', PaymentReturnController::class)
    ->name('payments.return');

Route::post('/webhooks/yookassa', YooKassaWebhookController::class)
    ->middleware(CheckYooKassaWebhookSource::class)
    ->name('webhooks.yookassa');
