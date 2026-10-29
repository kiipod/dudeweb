<?php

declare(strict_types=1);

namespace App\Services\Account;

use App\Models\User;
use App\Remnawave\DTO\Response\UserHwidDevice;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class AccountConnectionData
{
    /**
     * Принимает проверенный device reader и общий каталог приложений.
     *
     * @param AccountConnectionDevices $devices
     * @param ConnectionCatalogue $catalogue
     */
    public function __construct(private AccountConnectionDevices $devices, private ConnectionCatalogue $catalogue) {}

    /**
     * Готовит минимальные owner-only props, не раскрывая HWID/IP/credentials.
     *
     * @param User $user
     *
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $data = [
            'subscriptionUrl' => null,
            'devices' => [],
            'deviceCount' => null,
            'deviceLimit' => null,
            'platforms' => $this->catalogue->platforms(),
            'serviceState' => 'service_error',
            'deviceRemoved' => session('connection.device_removed', false),
        ];

        try {
            $owned = $this->devices->read($user);
            $url = $owned['user']->subscriptionUrl;
            $parts = parse_url($url);
            $validUrl = filter_var($url, FILTER_VALIDATE_URL) !== false
                && in_array($parts['scheme'] ?? null, ['http', 'https'], true)
                && !isset($parts['user']) && !isset($parts['pass']);

            return [...$data,
                'platforms' => $this->catalogue->platforms($validUrl ? $url : null),
                'subscriptionUrl' => $validUrl ? $url : null,
                'devices' => array_map(fn(UserHwidDevice $device): array => [
                    'token' => $this->devices->token($user, $device->hwid),
                    'name' => $device->deviceModel ?: 'Устройство',
                    'platform' => $device->platform,
                    'osVersion' => $device->osVersion,
                ], $owned['devices']->devices),
                'deviceCount' => $owned['devices']->total,
                'deviceLimit' => $owned['user']->hwidDeviceLimit > 0 ? $owned['user']->hwidDeviceLimit : null,
                'serviceState' => 'ready',
            ];
        } catch (Throwable $exception) {
            Log::warning('Account connection read failed.', ['user_id' => $user->id, 'exception' => $exception::class]);
            return $data;
        }
    }
}
