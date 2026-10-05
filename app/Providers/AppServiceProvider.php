<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Opcodes\LogViewer\Facades\LogViewer;
use YooKassa\Client;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Client::class, function (): Client {
            $client = new Client();

            $client->setAuth(
                (int) config('yookassa.shop_id'),
                (string) config('yookassa.secret_key'),
            );

            return $client;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        // Политика доступа к log-viewer на проде, только для пользователей с ролью Admin
        LogViewer::auth(fn() => auth()->user()->isSuperUser());
    }
}
