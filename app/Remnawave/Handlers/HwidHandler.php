<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\DeleteUserHwidDeviceRequestDto;
use App\Remnawave\DTO\DeleteUserHwidDeviceResponseDto;
use App\Remnawave\DTO\GetUserHwidDevicesResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class HwidHandler extends BaseApi
{
    /**
     * Получение списка HWID устройств пользователя
     *
     * @param string $userUuid
     * @return GetUserHwidDevicesResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getUserHwidDevices(string $userUuid): GetUserHwidDevicesResponseDto
    {
        return $this->getWithDto(
            url: '/api/hwid/devices/{userUuid}',
            responseDtoClass: GetUserHwidDevicesResponseDto::class,
            urlParams: ['userUuid' => $userUuid],
        );
    }

    /**
     * Удаление HWID устройства пользователя
     *
     * @param DeleteUserHwidDeviceRequestDto $deleteUserHwidDeviceRequestDto
     * @return DeleteUserHwidDeviceResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function deleteUserHwidDevices(DeleteUserHwidDeviceRequestDto $deleteUserHwidDeviceRequestDto): DeleteUserHwidDeviceResponseDto
    {
        return $this->postWithDto(
            url: '/api/hwid/devices/delete',
            dto: $deleteUserHwidDeviceRequestDto,
            responseDtoClass: DeleteUserHwidDeviceResponseDto::class,
        );
    }
}
