<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class EnsureWebSessionIsCurrent
{
    /**
     * Отвергает отозванный web-сеанс независимо от session driver.
     *
     * @param Request $request
     * @param Closure(Request): Response $next
     *
     * @return Response
     *
     * @throws AuthenticationException
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user('web');
        if ($user !== null && (int) $request->session()->get('web_session_version', 0) !== (int) $user->web_session_version) {
            Auth::guard('web')->logoutCurrentDevice();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            throw new AuthenticationException('Unauthenticated.', ['web']);
        }

        return $next($request);
    }
}
