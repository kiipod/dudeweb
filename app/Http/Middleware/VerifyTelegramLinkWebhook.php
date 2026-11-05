<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class VerifyTelegramLinkWebhook
{
    /**
     * Дополняет secret-path webhook проверкой настроенного header и скрывает proof от logs.
     *
     * @param Request $request
     * @param Closure $next
     *
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $text = $request->input('message.text');
        $data = $request->input('callback_query.data');
        $linking = (is_string($text) && preg_match('/\A\/start(?:@[A-Za-z0-9_]+)?\s+link_/i', $text) === 1)
            || (is_string($data) && preg_match('/(?:\A|;)action:(?:linkTelegram|cancelTgLink)(?:;|\z)/i', $data) === 1);
        if (!$linking) {
            return $next($request);
        }
        $secret = config('telegraph.webhook.secret_token');
        // WebhookController also resolves the bot by the secret token in the URL.
        // When secret_token is configured, enforce its additional header proof.
        if (is_string($secret) && $secret !== '') {
            abort_unless(hash_equals($secret, (string) $request->header('X-Telegram-Bot-Api-Secret-Token')), 403);
        }
        $debug = config('telegraph.webhook.debug');
        $legacyDebug = config('telegraph.debug_mode');
        config(['telegraph.webhook.debug' => false, 'telegraph.debug_mode' => false]);
        try {
            return $next($request);
        } finally {
            config(['telegraph.webhook.debug' => $debug, 'telegraph.debug_mode' => $legacyDebug]);
        }
    }
}
