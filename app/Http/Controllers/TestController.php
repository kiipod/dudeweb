<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Remnawave\DTO\LoginRequestDto;
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
        $loginDto = new LoginRequestDto(
            username: env('REMNAWAVE_USERNAME'),
            password: env('REMNAWAVE_PASSWORD'),
        );

        $remna = new RemnawaveApi($loginDto);
        $stats = $remna->system->getBandwidthStats();

        dd($stats);
    }
}
