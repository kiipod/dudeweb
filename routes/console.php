<?php

declare(strict_types=1);

use App\Console\Commands\EnforceSubscriptionDeviceLimits;
use App\Console\Commands\NotifyExpiringSubscriptions;
use App\Console\Commands\SynchronizeUserLifecycle;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(NotifyExpiringSubscriptions::class)
    ->hourly()
    ->withoutOverlapping(30);

Schedule::command(EnforceSubscriptionDeviceLimits::class)
    ->hourly()
    ->withoutOverlapping(30);

Schedule::command(SynchronizeUserLifecycle::class)
    ->hourlyAt(15)
    ->withoutOverlapping(30);
