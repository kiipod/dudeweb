<?php

declare(strict_types=1);

namespace App\Services\Account;

use App\Models\User;
use App\Remnawave\DTO\DeleteUserHwidDeviceRequestDto;
use App\Remnawave\DTO\Response\GetUserHwidDevicesResponse;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\RemnawaveApi;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;
use Throwable;
use UnexpectedValueException;

final readonly class AccountConnectionDevices
{
    /**
     * Принимает существующие Remnawave user/HWID handlers.
     *
     * @param RemnawaveApi $api
     */
    public function __construct(private RemnawaveApi $api) {}

    /**
     * Читает remote identity и проверяет принадлежность каждого устройства.
     *
     * @param User $user
     *
     * @return array{user: UserResponse, devices: GetUserHwidDevicesResponse}
     *
     * @throws Throwable
     */
    public function read(User $user): array
    {
        if ($user->remnawave_user_id === null) {
            throw new UnexpectedValueException('Remote account mapping is missing.');
        }

        $remote = $this->api->users()->withTimeouts(5, 3)->getUserById($user->remnawave_user_id)->response;
        if ($remote->id !== $user->remnawave_user_id) {
            throw new UnexpectedValueException('Remote identity mismatch.');
        }

        $devices = $this->api->hwid()->withTimeouts(5, 3)->getUserHwidDevices($remote->id)->response;
        if (
            $devices->total !== count($devices->devices)
            || array_any($devices->devices, fn($device): bool => $device->userId !== $remote->id || $device->hwid === '')
        ) {
            throw new UnexpectedValueException('Invalid owned devices.');
        }

        return ['user' => $remote, 'devices' => $devices];
    }

    /**
     * Шифрует HWID с владельцем и mapping вместо раскрытия provider identifiers.
     *
     * @param User $user
     * @param string $hwid
     *
     * @return string
     *
     * @throws \JsonException
     * @throws \Illuminate\Contracts\Encryption\EncryptException
     */
    public function token(User $user, string $hwid): string
    {
        return Crypt::encryptString(json_encode([
            'owner' => $user->id,
            'remote' => $user->remnawave_user_id,
            'hwid' => $hwid,
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * Повторно проверяет ownership перед единственным удалением через HWID API.
     *
     * @param User $user
     * @param string $token
     *
     * @return void
     *
     * @throws AuthorizationException
     * @throws ValidationException
     * @throws Throwable
     */
    public function delete(User $user, string $token): void
    {
        try {
            $device = json_decode(Crypt::decryptString($token), true, flags: JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            throw ValidationException::withMessages(['device' => 'Ссылка управления устройством устарела. Обнови список.']);
        }

        if (($device['owner'] ?? null) !== $user->id || ($device['remote'] ?? null) !== $user->remnawave_user_id) {
            throw new AuthorizationException();
        }
        if (!is_string($device['hwid'] ?? null) || $device['hwid'] === '') {
            throw ValidationException::withMessages(['device' => 'Не удалось определить устройство. Обнови список.']);
        }

        Cache::lock("account-device:user:{$user->id}", 30)->block(3, function () use ($user, $device): void {
            $owned = $this->read($user);
            if (!array_any($owned['devices']->devices, fn($item): bool => $item->hwid === $device['hwid'])) {
                throw ValidationException::withMessages(['device' => 'Устройство уже отключено. Обнови список.']);
            }
            $this->api->hwid()->withTimeouts(5, 3)
                ->deleteUserHwidDevices(new DeleteUserHwidDeviceRequestDto($user->remnawave_user_id, $device['hwid']));
        });
    }
}
