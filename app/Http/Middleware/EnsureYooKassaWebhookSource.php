<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\IpUtils;
use Symfony\Component\HttpFoundation\Response;

final class EnsureYooKassaWebhookSource
{
    /**
     * @param Request $request
     * @param Closure $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedIps = config('yookassa.webhook_allowed_ips', []);

        abort_unless(
            is_array($allowedIps) && IpUtils::checkIp($request->ip(), $allowedIps),
            403,
        );

        return $next($request);
    }
}
