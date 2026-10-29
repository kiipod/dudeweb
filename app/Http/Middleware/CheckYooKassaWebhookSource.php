<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\IpUtils;
use Symfony\Component\HttpFoundation\Response;

final readonly class CheckYooKassaWebhookSource
{
    /**
     * Принимает зависимости для работы CheckYooKassaWebhookSource.
     *
     * @param array<int, string> $allowedIps
     */
    public function __construct(
        #[Config('yookassa.webhook_allowed_ips', [])]
        private array $allowedIps,
    ) {}

    /**
     * Допускает webhook только с доверенного IP-адреса YooKassa.
     *
     * @param Request $request
     * @param Closure $next
     *
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(
            IpUtils::checkIp($request->ip(), $this->allowedIps),
            403,
        );

        return $next($request);
    }
}
