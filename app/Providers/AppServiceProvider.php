<?php

declare(strict_types=1);

namespace App\Providers;

use App\Policies\AccountDashboardPolicy;
use App\Policies\AccountConnectionPolicy;
use App\Policies\AccountReferralPolicy;
use App\Policies\AccountProfilePolicy;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Opcodes\LogViewer\Facades\LogViewer;
use YooKassa\Client;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
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
     *
     * @return void
     */
    public function boot(): void
    {
        Gate::define('view-account-dashboard', [AccountDashboardPolicy::class, 'viewDashboard']);
        Gate::define('view-account-connection', [AccountConnectionPolicy::class, 'view']);
        Gate::define('view-account-referral', [AccountReferralPolicy::class, 'view']);
        Gate::define('view-account-profile', [AccountProfilePolicy::class, 'view']);
        Gate::define('update-account-profile', [AccountProfilePolicy::class, 'update']);
        Gate::define('secure-account-profile', [AccountProfilePolicy::class, 'secure']);
        Gate::define('delete-account-device', [AccountConnectionPolicy::class, 'deleteDevice']);
        Gate::define(
            'provision-web-account',
            fn(User $user): bool => $user->email !== null && $user->provisioning_key !== null,
        );
        Gate::define('request-email-verification', fn(User $user): bool => $user->email !== null);
        RateLimiter::for('web-verification-send', fn(Request $request): array => [
            Limit::perMinute(1)->by('verification:user:' . $request->user('web')->getAuthIdentifier())
                ->response(static function (): never {
                    throw ValidationException::withMessages(['form' => 'Письмо уже запрошено. Подожди минуту перед повторной отправкой.']);
                }),
            Limit::perMinute(30)->by('verification:ip:' . $request->ip()),
        ]);
        foreach ([
            'web-login' => 5,
            'web-register' => 3,
            'web-recovery' => 3,
            'web-reset' => 5,
            'web-provision' => 6,
            'web-profile' => 5,
            'web-password' => 5,
            'web-sessions' => 5,
        ] as $name => $attempts) {
            RateLimiter::for($name, function (Request $request) use ($name, $attempts): array {
                $email = is_string($request->input('email')) ? Str::lower(trim($request->input('email'))) : '';
                $identity = $request->user('web')?->getAuthIdentifier() ?? $email;
                $response = static function (): never {
                    throw ValidationException::withMessages(['form' => 'Слишком много попыток. Подожди минуту и попробуй снова.']);
                };
                return [
                    Limit::perMinute($attempts)
                        ->by($name . ':identity:' . hash('sha256', $identity . '|' . $request->ip()))
                        ->response($response),
                    Limit::perMinute(30)->by($name . ':ip:' . $request->ip())->response($response),
                ];
            });
        }
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        // Политика доступа к log-viewer на проде, только для пользователей с ролью Admin
        LogViewer::auth(fn() => auth()->user()->isSuperUser());
    }
}
