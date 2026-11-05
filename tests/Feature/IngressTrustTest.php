<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

final class IngressTrustTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Rejects forwarded identity from a direct untrusted peer.
     *
     * @return void
     */
    public function test_untrusted_peer_cannot_spoof_forwarded_identity(): void
    {
        Route::get('/audit-proxy', fn(Request $request) => response()->json(['ip' => $request->ip(), 'secure' => $request->isSecure()]));
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
            ->withHeaders(['X-Forwarded-For' => '185.71.76.1', 'X-Forwarded-Proto' => 'https'])
            ->getJson('/audit-proxy')->assertOk()->assertJson(['ip' => '203.0.113.10', 'secure' => false]);
    }


}
