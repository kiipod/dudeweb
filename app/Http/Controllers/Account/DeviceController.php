<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Requests\DestroyDeviceRequest;
use App\Services\Account\AccountConnectionDevices;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

final readonly class DeviceController
{
    /**
     * Принимает сервис fresh ownership check и HWID mutation.
     *
     * @param AccountConnectionDevices $devices
     */
    public function __construct(private AccountConnectionDevices $devices) {}

    /**
     * Удаляет проверенное устройство и возвращает свежую owner-only страницу.
     *
     * @param DestroyDeviceRequest $request
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function destroy(DestroyDeviceRequest $request): RedirectResponse
    {
        try {
            $this->devices->delete($request->user('web'), $request->validated('device'));
        } catch (AuthorizationException|ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::warning('Account device deletion failed.', ['user_id' => $request->user('web')->id, 'exception' => $exception::class]);
            throw ValidationException::withMessages(['device' => 'Не удалось отключить устройство. Обнови список и попробуй снова.']);
        }
        return redirect()->route('account.connection')->with('connection.device_removed', true);
    }
}
