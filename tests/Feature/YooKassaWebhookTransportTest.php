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
        $payload = json_encode([
            'type' => 'notification',
            'event' => 'payment.succeeded',
            'object' => [
                'id' => '23d93cac-000f-5000-8000-126628f15141',
                'status' => 'succeeded',
                'recipient' => ['account_id' => '123', 'gateway_id' => '456'],
                'amount' => ['value' => '200.00', 'currency' => 'RUB'],
                'created_at' => '2026-10-04T12:00:00.000Z',
                'captured_at' => '2026-10-04T12:01:00.000Z',
                'paid' => true,
                'refundable' => false,
                'test' => true,
            ],
        ], JSON_THROW_ON_ERROR);

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

    public function test_allowed_source_is_resolved_from_forwarded_ip_behind_proxy(): void
    {
        config(['yookassa.webhook_allowed_ips' => ['185.71.76.0/27']]);
        $payload = json_encode([
            'type' => 'notification',
            'event' => 'payment.succeeded',
            'object' => [
                'id' => '23d93cac-000f-5000-8000-126628f15141',
                'status' => 'succeeded',
                'recipient' => ['account_id' => '123', 'gateway_id' => '456'],
                'amount' => ['value' => '200.00', 'currency' => 'RUB'],
                'created_at' => '2026-10-04T12:00:00.000Z',
                'captured_at' => '2026-10-04T12:01:00.000Z',
                'paid' => true,
                'refundable' => false,
                'test' => true,
            ],
        ], JSON_THROW_ON_ERROR);

        $this->call(
            'POST',
            '/webhooks/yookassa',
            server: [
                'REMOTE_ADDR' => '172.18.0.1',
                'HTTP_X_FORWARDED_FOR' => '185.71.76.1',
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
