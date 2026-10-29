<?php

declare(strict_types=1);

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use MoonShine\Laravel\Http\Middleware\Authenticate as MoonShineAuthenticate;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(fn(Request $request): string => route('login'));
        $middleware->redirectUsersTo(fn(Request $request): string => route('account.dashboard'));
        $middleware->alias([
            'moonshine' => MoonShineAuthenticate::class,
        ]);
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->preventRequestForgery(except: [
            'webhooks/yookassa',
        ]);
        $middleware->trustProxies(at: array_values(array_filter(array_map(trim(...), explode(',', (string) env('TRUSTED_PROXIES', '127.0.0.1,::1'))))));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
