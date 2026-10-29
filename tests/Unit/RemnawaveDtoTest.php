<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Remnawave\DTO\CreateApiTokenRequestDto;
use App\Remnawave\DTO\CreateApiTokenResponseDto;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\DTO\CreateUserResponseDto;
use App\Remnawave\DTO\DeleteUserHwidDeviceRequestDto;
use App\Remnawave\DTO\GetAllApiTokensResponseDto;
use App\Remnawave\DTO\GetInternalSquadByUuidResponseDto;
use App\Remnawave\DTO\GetStatsResponseDto;
use App\Remnawave\DTO\GetSubscriptionByUsernameResponseDto;
use App\Remnawave\DTO\GetUserHwidDevicesResponseDto;
use App\Remnawave\DTO\HostResponseDto;
use App\Remnawave\DTO\NodeResponseDto;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\Enums\TrafficLimitStrategy;
use App\Remnawave\Enums\UserStatus;
use PHPUnit\Framework\TestCase;

final class RemnawaveDtoTest extends TestCase
{
    /**
     * Verify that request dtos serialize to the new api contract.
     *
     * @return void
     */
    public function test_request_dtos_serialize_to_the_new_api_contract(): void
    {
        self::assertSame([
            'name' => 'deploy',
            'expiresInDays' => 30,
            'scopes' => ['users.read'],
        ], new CreateApiTokenRequestDto('deploy', 30, ['users.read'])->toArray());

        $createUser = new CreateUserRequestDto(
            username: 'test_user',
            expireAt: '2026-11-01T00:00:00.000Z',
            trafficLimitStrategy: TrafficLimitStrategy::MonthRolling,
        );

        self::assertSame('MONTH_ROLLING', $createUser->toArray()['trafficLimitStrategy']);
        self::assertArrayNotHasKey('uuid', $createUser->toArray());

        $updateUser = new UpdateUserRequestDto(
            id: 42,
            status: UserStatus::Disabled,
            trafficLimitStrategy: TrafficLimitStrategy::MonthRolling,
        );

        self::assertSame([
            'id' => 42,
            'status' => 'DISABLED',
            'trafficLimitStrategy' => 'MONTH_ROLLING',
        ], $updateUser->toArray());
        self::assertSame(
            ['userId' => 42, 'hwid' => 'device'],
            new DeleteUserHwidDeviceRequestDto(42, 'device')->toArray(),
        );
    }

    /**
     * Verify that user and hwid responses deserialize without legacy uuid fields.
     *
     * @return void
     */
    public function test_user_and_hwid_responses_deserialize_without_legacy_uuid_fields(): void
    {
        $user = CreateUserResponseDto::fromArray(['response' => $this->userResponse()]);

        self::assertSame(42, $user->response->id);
        self::assertSame(UserStatus::Active, $user->response->status);
        self::assertSame(TrafficLimitStrategy::MonthRolling, $user->response->trafficLimitStrategy);
        self::assertArrayNotHasKey('uuid', $user->toArray()['response']);

        $payload = [
            'response' => [
                'total' => 1,
                'devices' => [[
                    'hwid' => 'device',
                    'userId' => 42,
                    'platform' => null,
                    'osVersion' => null,
                    'deviceModel' => null,
                    'userAgent' => null,
                    'requestIp' => '203.0.113.10',
                    'createdAt' => '2026-10-01T00:00:00.000Z',
                    'updatedAt' => '2026-10-01T00:00:00.000Z',
                ]],
            ],
        ];

        self::assertEquals($payload, GetUserHwidDevicesResponseDto::fromArray($payload)->toArray());
    }

    /**
     * Verify that token subscription and system responses follow openapi shapes.
     *
     * @return void
     */
    public function test_token_subscription_and_system_responses_follow_openapi_shapes(): void
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
        self::assertEquals($createdToken, CreateApiTokenResponseDto::fromArray($createdToken)->toArray());

        $tokens = ['response' => ['tokens' => [[
            'uuid' => '00000000-0000-4000-8000-000000000001',
            'name' => 'deploy',
            'expireAt' => '2026-11-01T00:00:00.000Z',
            'scopes' => ['*'],
            'createdAt' => '2026-10-01T00:00:00.000Z',
            'updatedAt' => '2026-10-01T00:00:00.000Z',
        ]]]];
        self::assertEquals($tokens, GetAllApiTokensResponseDto::fromArray($tokens)->toArray());

        $subscription = ['response' => [
            'isFound' => true,
            'user' => [
                'shortUuid' => 'short',
                'daysLeft' => 10,
                'trafficUsed' => '1 GB',
                'trafficLimit' => '10 GB',
                'lifetimeTrafficUsed' => '2 GB',
                'trafficUsedBytes' => '1000',
                'trafficLimitBytes' => '10000',
                'lifetimeTrafficUsedBytes' => '2000',
                'username' => 'test_user',
                'expiresAt' => '2026-11-01T00:00:00.000Z',
                'isActive' => true,
                'userStatus' => 'ACTIVE',
                'trafficLimitStrategy' => 'MONTH_ROLLING',
            ],
            'links' => ['vless://example'],
            'ssConfLinks' => ['singbox' => 'https://example.test'],
            'subscriptionUrl' => 'https://example.test/sub',
        ]];
        self::assertEquals($subscription, GetSubscriptionByUsernameResponseDto::fromArray($subscription)->toArray());

        $stats = ['response' => [
            'cpu' => ['cores' => 4],
            'memory' => ['total' => 100, 'free' => 40, 'used' => 60],
            'uptime' => 1000,
            'timestamp' => 2000,
            'users' => ['statusCounts' => ['ACTIVE' => 1], 'totalUsers' => 1],
            'onlineStats' => ['lastDay' => 1, 'lastWeek' => 2, 'neverOnline' => 3, 'onlineNow' => 4],
            'nodes' => ['totalOnline' => 1, 'totalBytesLifetime' => '12345'],
        ]];
        self::assertEquals($stats, GetStatsResponseDto::fromArray($stats)->toArray());
    }

    /**
     * Verify that node host and internal squad responses deserialize new nested structures.
     *
     * @return void
     */
    public function test_node_host_and_internal_squad_responses_deserialize_new_nested_structures(): void
    {
        $node = ['response' => $this->nodeResponse()];
        self::assertEquals($node, NodeResponseDto::fromArray($node)->toArray());

        $host = ['response' => $this->hostResponse()];
        self::assertEquals($host, HostResponseDto::fromArray($host)->toArray());

        $squad = ['response' => [
            'uuid' => '00000000-0000-4000-8000-000000000005',
            'viewPosition' => 1,
            'name' => 'default',
            'tags' => ['public'],
            'info' => ['membersCount' => 1, 'inboundsCount' => 1],
            'inbounds' => [[
                'uuid' => '00000000-0000-4000-8000-000000000006',
                'profileUuid' => '00000000-0000-4000-8000-000000000007',
                'tag' => 'VLESS',
                'type' => 'vless',
                'network' => null,
                'security' => null,
                'port' => null,
                'rawInbound' => null,
            ]],
            'createdAt' => '2026-10-01T00:00:00.000Z',
            'updatedAt' => '2026-10-01T00:00:00.000Z',
        ]];
        self::assertEquals($squad, GetInternalSquadByUuidResponseDto::fromArray($squad)->toArray());
    }

    /**
     * Формирует ответ Remnawave с данными тестового пользователя.
     *
     * @return array
     */
    private function userResponse(): array
    {
        return [
            'id' => 42,
            'shortUuid' => 'short',
            'username' => 'test_user',
            'status' => 'ACTIVE',
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'MONTH_ROLLING',
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

    /**
     * Формирует ответ Remnawave с данными тестового узла.
     *
     * @return array
     */
    private function nodeResponse(): array
    {
        return [
            'uuid' => '00000000-0000-4000-8000-000000000003',
            'id' => 10,
            'name' => 'node-1',
            'address' => 'node.example.test',
            'port' => null,
            'proxyUrl' => null,
            'isConnected' => true,
            'isDisabled' => false,
            'isConnecting' => false,
            'lastStatusChange' => null,
            'lastStatusMessage' => null,
            'isTrafficTrackingActive' => true,
            'trafficResetDay' => null,
            'trafficLimitBytes' => null,
            'trafficUsedBytes' => null,
            'notifyPercent' => null,
            'viewPosition' => 1,
            'countryCode' => 'DE',
            'consumptionMultiplier' => 1,
            'nodeConsumptionMultiplier' => 1,
            'tags' => [],
            'integrationUuids' => [],
            'ips' => [['ip' => '203.0.113.1', 'status' => 'INBOUND']],
            'createdAt' => '2026-10-01T00:00:00.000Z',
            'updatedAt' => '2026-10-01T00:00:00.000Z',
            'configProfile' => ['activeConfigProfileUuid' => null, 'activeInbounds' => []],
            'providerUuid' => null,
            'provider' => null,
            'activePluginUuid' => null,
            'system' => [
                'info' => [
                    'arch' => 'x64',
                    'cpus' => 4,
                    'cpuModel' => 'CPU',
                    'memoryTotal' => 1024,
                    'hostname' => 'node-1',
                    'platform' => 'linux',
                    'release' => '1',
                    'type' => 'Linux',
                    'version' => '1',
                    'networkInterfaces' => ['eth0'],
                ],
                'stats' => [
                    'memoryFree' => 512,
                    'memoryUsed' => 512,
                    'uptime' => 100,
                    'loadAvg' => [0.1, 0.2, 0.3],
                    'interface' => null,
                ],
            ],
            'versions' => ['xray' => '1', 'node' => '2'],
            'xrayUptime' => 100,
            'usersOnline' => 1,
            'note' => null,
        ];
    }

    /**
     * Формирует ответ Remnawave с данными тестового хоста.
     *
     * @return array
     */
    private function hostResponse(): array
    {
        return [
            'uuid' => '00000000-0000-4000-8000-000000000004',
            'viewPosition' => 1,
            'remark' => 'host-1',
            'address' => 'host.example.test',
            'port' => 443,
            'path' => null,
            'sni' => null,
            'host' => null,
            'alpn' => 'h2',
            'fingerprint' => null,
            'isDisabled' => false,
            'securityLayer' => 'TLS',
            'xhttpExtraParams' => null,
            'muxParams' => null,
            'sockoptParams' => null,
            'finalMask' => null,
            'inbound' => ['configProfileUuid' => null, 'configProfileInboundUuid' => null],
            'serverDescription' => null,
            'tags' => [],
            'isHidden' => false,
            'overrideSniFromAddress' => false,
            'keepSniBlank' => false,
            'vlessRouteId' => null,
            'pinnedPeerCertSha256' => null,
            'verifyPeerCertByName' => null,
            'shuffleHost' => false,
            'mihomoX25519' => false,
            'mihomoIpVersion' => null,
            'nodes' => [],
            'xrayJsonTemplateUuid' => null,
            'excludeFromSubscriptionTypes' => ['XRAY_JSON'],
            'mapper' => ['xrayJson' => [['op' => 'unset', 'to' => 'name']]],
            'internalSquads' => ['mode' => 'EXCLUDE', 'squads' => []],
        ];
    }
}
