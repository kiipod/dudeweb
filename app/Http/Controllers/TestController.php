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
        $stats = $remna->users()->getUserByUsername('kiipod223232');

        dd($stats);
    }
}
