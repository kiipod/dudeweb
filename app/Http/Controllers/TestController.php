<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use Illuminate\Http\Client\ConnectionException;

final class TestController extends Controller
{
    /**
     * Выполняет ручную диагностику Remnawave и останавливает запрос выводом пользователя.
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function __invoke()
    {
        $internalSquad = '4bb28df7-6c1b-4994-8864-52683bb5e144';
        $api = new RemnawaveApi();
        $user = $api->users()->getUserByUsername('kiipod');
        $node = $api->nodes()->getNodeByUuid($user->response->userTraffic->lastConnectedNodeUuid);
        $squad = $api->internalSquad()->getInternalSquadAccessibleNodes($internalSquad);
        $hosts = $api->hosts()->getAllHosts();
        dd($user);
    }
}
