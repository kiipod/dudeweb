<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use Illuminate\Http\Client\ConnectionException;

class TestController extends Controller
{
    /**
     * @throws ApiException
     * @throws ConnectionException
     */
    public function __invoke()
    {
        $user = new CreateUserRequestDto(
            username: 'john_doe_2024',
            expireAt: '2025-12-31T23:59:59.999Z',
            activeInternalSquads: ["508166c3-bd06-4dca-bc8c-1402c196dee8"],
        );

        $remna = new RemnawaveApi();
        $stats = $remna->users()->create($user);

        dd($stats);
    }
}
