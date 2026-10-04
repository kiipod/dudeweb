<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class YooKassaWebhookTransportTest extends TestCase
{
    use RefreshDatabase;

    public function test_allowed_source_can_post_raw_webhook_without_authentication(): void
    {
        config(['yookassa.webhook_allowed_ips' => ['127.0.0.1']]);
        $payload = '{"type":"notification","event":"payment.succeeded"}';

        $this->call(
            'POST',
            '/webhooks/yookassa',
            server: [
                'REMOTE_ADDR' => '127.0.0.1',
                'CONTENT_TYPE' => 'application/json',
            ],
            content: $payload,
        )
            ->assertOk()
            ->assertJson(['status' => 'ok']);
    }

    public function test_untrusted_source_is_rejected_before_processing(): void
    {
        config(['yookassa.webhook_allowed_ips' => ['185.71.76.0/27']]);

        $this->call(
            'POST',
            '/webhooks/yookassa',
            server: [
                'REMOTE_ADDR' => '203.0.113.10',
                'CONTENT_TYPE' => 'application/json',
            ],
            content: '{"type":"notification"}',
        )->assertForbidden();
    }
}
