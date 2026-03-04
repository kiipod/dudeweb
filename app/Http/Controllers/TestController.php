<?php

declare(strict_types=1);

namespace App\Http\Controllers;

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
        $remna = new RemnawaveApi();
        $stats = $remna->hwid()->getUserHwidDevices('ec0c95ab-9e9f-4e76-9af9-2e30a6a2a9e8');

        dd($stats);
    }
}
