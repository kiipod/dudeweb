<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Remnawave\DTO\CreateApiTokenRequestDto;
use App\Remnawave\DTO\DeleteUserHwidDeviceRequestDto;
use App\Remnawave\DTO\LoginRequestDto;
use App\Remnawave\Handlers\ApiTokenHandler;
use App\Remnawave\Handlers\HwidHandler;
use App\Remnawave\Handlers\UserHandler;
use App\Remnawave\RemnawaveApi;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class RemnawaveHandlerTest extends TestCase
{
    public function test_api_token_handler_sends_documented_body_and_handles_no_content_delete(): void
    {
        $createdToken = [
            'response' => [
                'uuid' => '00000000-0000-4000-8000-000000000001',
                'name' => 'deploy',
                'expireAt' => '2026-11-01T00:00:00.000Z',
                'scopes' => ['*'],
                'createdAt' => '2026-10-01T00:00:00.000Z',
                'updatedAt' => '2026-10-01T00:00:00.000Z',
                'token' => 'secret',
            ],
        ];

        Http::fake([
            'panel.test/api/tokens' => Http::response($createdToken, 201),
            'panel.test/api/tokens/*' => Http::response(null, 204),
        ]);

        $handler = new ApiTokenHandler('https://panel.test', 'jwt');
        $response = $handler->create(new CreateApiTokenRequestDto('deploy', 30));
        $handler->delete('00000000-0000-4000-8000-000000000001');

        self::assertSame('secret', $response->response->token);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://panel.test/api/tokens'
            && $request->data() === ['name' => 'deploy', 'expiresInDays' => 30, 'scopes' => ['*']]
            && $request->hasHeader('Authorization', 'Bearer jwt')
            && !$request->hasHeader('X-Remnawave-Client-Type'));
        Http::assertSent(fn(Request $request): bool => $request->method() === 'DELETE'
            && $request->url() === 'https://panel.test/api/tokens/00000000-0000-4000-8000-000000000001'
            && $request->body() === '');
    }

    public function test_user_actions_use_post_without_body_and_numeric_user_id(): void
    {
        Http::fake([
            'panel.test/api/users/42/actions/*' => Http::response(['response' => $this->userResponse()]),
            'panel.test/api/users/42' => Http::response(null, 204),
        ]);

        $handler = new UserHandler('https://panel.test', 'api-token');
        $handler->disableUser(42);
        $handler->enableUser(42);
        $handler->delete(42);

        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://panel.test/api/users/42/actions/disable'
            && $request->body() === '');
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://panel.test/api/users/42/actions/enable'
            && $request->body() === '');
        Http::assertSent(fn(Request $request): bool => $request->method() === 'DELETE'
            && $request->url() === 'https://panel.test/api/users/42'
            && $request->body() === '');
    }

    public function test_hwid_handler_uses_numeric_user_id_in_path_and_body(): void
    {
        $response = ['response' => [
            'total' => 1,
            'devices' => [[
                'hwid' => 'device',
                'userId' => 42,
                'platform' => null,
                'osVersion' => null,
                'deviceModel' => null,
                'userAgent' => null,
                'requestIp' => null,
                'createdAt' => '2026-10-01T00:00:00.000Z',
                'updatedAt' => '2026-10-01T00:00:00.000Z',
            ]],
        ]];
        Http::fake([
            'panel.test/api/hwid/devices/42' => Http::response($response),
            'panel.test/api/hwid/devices/delete' => Http::response($response),
        ]);

        $handler = new HwidHandler('https://panel.test', 'api-token');
        $handler->getUserHwidDevices(42);
        $handler->deleteUserHwidDevices(new DeleteUserHwidDeviceRequestDto(42, 'device'));

        Http::assertSent(fn(Request $request): bool => $request->method() === 'GET'
            && $request->url() === 'https://panel.test/api/hwid/devices/42');
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://panel.test/api/hwid/devices/delete'
            && $request->data() === ['userId' => 42, 'hwid' => 'device']);
    }

    public function test_login_request_does_not_send_bearer_authorization(): void
    {
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        Http::fake([
            'panel.test/api/auth/login' => Http::response(['response' => ['accessToken' => 'jwt']]),
        ]);

        new RemnawaveApi()->auth()->login(new LoginRequestDto('admin', 'password'));

        Http::assertSent(fn(Request $request): bool => $request->url() === 'https://panel.test/api/auth/login'
            && !$request->hasHeader('Authorization'));
    }

    private function userResponse(): array
    {
        return [
            'id' => 42,
            'shortUuid' => 'short',
            'username' => 'test_user',
            'status' => 'ACTIVE',
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => '2026-11-01T00:00:00.000Z',
            'telegramId' => null,
            'email' => null,
            'description' => null,
            'tag' => null,
            'hwidDeviceLimit' => null,
            'externalSquadUuid' => null,
            'trojanPassword' => 'password',
            'vlessUuid' => '00000000-0000-4000-8000-000000000002',
            'ssPassword' => 'password',
            'lastTriggeredThreshold' => 0,
            'subRevokedAt' => null,
            'lastTrafficResetAt' => null,
            'createdAt' => '2026-10-01T00:00:00.000Z',
            'updatedAt' => '2026-10-01T00:00:00.000Z',
            'subscriptionUrl' => 'https://example.test/sub',
            'activeInternalSquads' => [],
            'userTraffic' => [
                'usedTrafficBytes' => 0,
                'lifetimeUsedTrafficBytes' => 0,
                'onlineAt' => null,
                'firstConnectedAt' => null,
                'lastConnectedNodeUuid' => null,
            ],
        ];
    }
}
