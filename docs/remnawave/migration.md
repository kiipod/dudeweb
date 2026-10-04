# Миграция интеграции Remnawave на API v3.4.3

## Область аудита

Источник истины — `docs/remnawave/api-1.json` (`openapi: 3.0.0`, Remnawave API
`3.4.3`). Проверены все 77 файлов в `app/Remnawave/`: `BaseApi`, фасад
`RemnawaveApi`, 8 Handler-классов, 61 DTO/интерфейс, исключение и 5 JSON-конфигураций.

В интеграции нет Remnawave enum-классов: фиксированные значения сейчас валидируются и
хранятся как строки. Все сопоставленные операции не имеют query-параметров. У защищённых
операций OpenAPI требует bearer `Authorization`; login не объявляет security requirement.
Успешные JSON-ответы используют `application/json`, а общие ошибки имеют коды `400`, `404`,
`500` и схемы `RemnawaveBadRequestErrorDto`/`RemnawaveValidationErrorDto`,
`RemnawaveNotFoundErrorDto`, `RemnawaveInternalServerErrorDto` соответственно.

## Матрица Handler

| Handler | Старый endpoint | Новый endpoint | HTTP | Request | Response | Статус |
|---|---|---|---|---|---|---|
| `AuthHandler::login` | `/api/auth/login` | `/api/auth/login` | POST -> POST | `LoginRequestDto`; `username`, `password` required | `LoginResponseDto`; 200 | UNCHANGED |
| `ApiTokenHandler::create` | `/api/tokens` | `/api/tokens` | POST -> POST | Старое тело отсутствует; новое: `name`, `expiresInDays` required, `scopes` optional | Новая token structure; 201 | MODIFIED |
| `ApiTokenHandler::getAll` | `/api/tokens` | `/api/tokens` | GET -> GET | Нет | `response.tokens[]`, без `docs` и без значения token; 200 | MODIFIED |
| `ApiTokenHandler::delete` | `/api/tokens/{uuid}` | `/api/tokens/{uuid}` | DELETE -> DELETE | `uuid` path, required UUID | Был DTO; теперь 204 без тела | MODIFIED |
| `UserHandler::create` | `/api/users` | `/api/users` | POST -> POST | `CreateUserBodyDto`; удалён `uuid`, добавлена стратегия `MONTH_ROLLING` | `UserResponseDto`; 201, структура изменена | MODIFIED |
| `UserHandler::update` | `/api/users` | `/api/users` | PATCH -> PATCH | Идентификатор `uuid` заменён на numeric `id`; enum strategy расширен | `UserResponseDto`; 200, структура изменена | MODIFIED |
| `UserHandler::delete` | `/api/users/{uuid}` | `/api/users/{userId}` | DELETE -> DELETE | UUID заменён на required numeric `userId` | Был DTO; теперь 204 без тела | MODIFIED |
| `UserHandler::getUserByUsername` | `/api/users/by-username/{username}` | `/api/users/by-username/{username}` | GET -> GET | `username` path required | `UserResponseDto`; 200, структура изменена | MODIFIED |
| `UserHandler::getUserByTelegramId` | `/api/users/by-telegram-id/{telegramId}` | — | GET -> — | Endpoint отсутствует; `/api/users/resolve` принимает только `id`, `shortUuid`, `username` | Замены нет | REMOVED |
| `UserHandler::disableUser` | `/api/users/{uuid}/actions/disable` | `/api/users/{userId}/actions/disable` | GET -> POST | UUID заменён на required numeric `userId`; body отсутствует | `UserResponseDto`; 200 | MODIFIED |
| `UserHandler::enableUser` | `/api/users/{uuid}/actions/enable` | `/api/users/{userId}/actions/enable` | GET -> POST | UUID заменён на required numeric `userId`; body отсутствует | `UserResponseDto`; 200 | MODIFIED |
| `UserHandler::getSubscriptionByUsername` | `/api/subscriptions/by-username/{username}` | `/api/subscriptions/by-username/{username}` | GET -> GET | `username` path required | `GetSubscriptionByUsernameResponseDto`; 200, enum strategy расширен | MODIFIED |
| `HwidHandler::getUserHwidDevices` | `/api/hwid/devices/{userUuid}` | `/api/hwid/devices/{userId}` | GET -> GET | UUID заменён на required numeric `userId` | Device structure использует `userId` и добавляет `requestIp`; 200 | MODIFIED |
| `HwidHandler::deleteUserHwidDevices` | `/api/hwid/devices/delete` | `/api/hwid/devices/delete` | POST -> POST | `userUuid: string` заменён на `userId: number`; `hwid` required | Device structure изменена; 200 | MODIFIED |
| `NodesHandler::getAllNodes` | `/api/nodes` | `/api/nodes` | GET -> GET | Нет | `GetNodesResponseDto`; 200, Node structure изменена | MODIFIED |
| `NodesHandler::getNodeByUuid` | `/api/nodes/{uuid}` | `/api/nodes/{uuid}` | GET -> GET | `uuid` path required UUID | `NodeResponseDto`; 200, Node structure изменена | MODIFIED |
| `NodesHandler::getNodesMetrics` | `/api/system/nodes/metrics` | `/api/system/nodes/metrics` | GET -> GET | Нет | `GetNodesMetricsResponseDto`; 200 | UNCHANGED |
| `HostHandler::getAllHosts` | `/api/hosts` | `/api/hosts` | GET -> GET | Нет | `GetHostsResponseDto`; 200, Host structure изменена | MODIFIED |
| `HostHandler::getHostByUuid` | `/api/hosts/{uuid}` | `/api/hosts/{uuid}` | GET -> GET | `uuid` path required UUID | `HostResponseDto`; 200, Host structure изменена | MODIFIED |
| `InternalSquadHandler::getInternalSquadAccessibleNodes` | `/api/internal-squads/{uuid}/accessible-nodes` | тот же | GET -> GET | `uuid` path required UUID | `GetInternalSquadAccessibleNodesResponseDto`; 200 | UNCHANGED |
| `InternalSquadHandler::getInternalSquadByUuid` | `/api/internal-squads/{uuid}` | `/api/internal-squads/{uuid}` | GET -> GET | `uuid` path required UUID | `GetInternalSquadResponseDto`; добавлены required `tags`; 200 | MODIFIED |
| `SystemHandler::getStats` | `/api/system/stats` | `/api/system/stats` | GET -> GET | Нет | `GetStatsResponseDto`; изменены CPU, memory и nodes; 200 | MODIFIED |

OperationId новых операций совпадает с назначением методов: `AuthController_login`,
`ApiTokensController_createApiToken|getApiTokens|deleteApiToken`,
`UsersController_createUser|updateUser|deleteUser|getUserByUsername|disableUser|enableUser`,
`SubscriptionsController_getSubscriptionByUsername`,
`HwidUserDevicesController_getUserHwidDevices|deleteUserHwidDevice`,
`NodesController_getNodes|getNode`, `SystemController_getNodesMetrics|getStats`,
`HostsController_getHosts|getOneHost` и
`InternalSquadController_getInternalSquadAccessibleNodes|getInternalSquadByUuid`.

## Матрица DTO

| DTO | Новая schema | Добавлено | Удалено | Изменено | Статус |
|---|---|---|---|---|---|
| `Dto` | Внутренний интерфейс | — | — | — | UNCHANGED |
| `LoginRequestDto` | `LoginBodyDto` | — | — | — | UNCHANGED |
| `LoginResponseDto` | `LoginResponseDto` envelope | — | — | — | UNCHANGED |
| `Response\LoginResponse` | `LoginResponseDto.response` | — | — | — | UNCHANGED |
| `CreateUserRequestDto` | `CreateUserBodyDto` | `MONTH_ROLLING` enum value | `uuid` | strategy validation | MODIFIED |
| `UpdateUserRequestDto` | `UpdateUserBodyDto` | `id`, `MONTH_ROLLING` | `uuid` | identifier type | MODIFIED |
| `CreateUserResponseDto` | `UserResponseDto` envelope | — | — | nested response | MODIFIED |
| `UpdateUserResponseDto` | `UserResponseDto` envelope | — | — | nested response | MODIFIED |
| `GetUserResponseDto` | `UserResponseDto` envelope | — | — | nested response | MODIFIED |
| `Response\UserResponse` | `UserResponseDto.response` | — | `uuid`, `subLastUserAgent`, `subLastOpenedAt` | enum strategy includes `MONTH_ROLLING` | MODIFIED |
| `ActiveInternalSquadDto` | `UserResponseDto.response.activeInternalSquads[]` | — | — | — | UNCHANGED |
| `UserTrafficDto` | `UserResponseDto.response.userTraffic` | — | — | — | UNCHANGED |
| `DeleteUserResponseDto` | 204 no content | — | весь DTO | — | REMOVED |
| `Response\DeleteUserResponse` | 204 no content | — | весь DTO | — | REMOVED |
| `GetSubscriptionByUuidResponseDto` | `GetSubscriptionByUsernameResponseDto` envelope | новый DTO с корректным именем | старое имя после миграции usage | class replacement | REPLACED |
| `Response\SubscriptionResponse` | `GetSubscriptionByUsernameResponseDto.response` | — | typed fake `ssConfLinks` shape | strategy enum includes `MONTH_ROLLING`; `ssConfLinks` is generic object | MODIFIED |
| `SubscriptionUserDto` | subscription response `user` | `MONTH_ROLLING` enum value | — | enum | MODIFIED |
| `SsConfLinksDto` | generic `ssConfLinks` object | — | undocumented `propertyName` | represented as array | REMOVED |
| `CreateApiTokenResponseDto` | `CreateApiTokenResponseDto` envelope | — | — | nested response | MODIFIED |
| `Response\CreateApiTokenResponse` | `CreateApiTokenResponseDto.response` | `name`, `expireAt`, `scopes`, `createdAt`, `updatedAt` | — | full token response | MODIFIED |
| `GetAllApiTokensResponseDto` | `GetApiTokensResponseDto` envelope | — | — | nested response | MODIFIED |
| `Response\GetAllApiTokensResponse` | `GetApiTokensResponseDto.response` | `tokens` | `apiKeys`, `docs` | collection shape | MODIFIED |
| `ApiKeyDto` | `GetApiTokensResponseDto.response.tokens[]` | `name`, `expireAt`, `scopes` | `token`, `tokenName` | token metadata | MODIFIED |
| `DocsResponse` | — | — | весь DTO | — | REMOVED |
| `DeleteApiTokenResponseDto` | 204 no content | — | весь DTO | — | REMOVED |
| `Response\DeleteApiTokenResponse` | 204 no content | — | весь DTO | — | REMOVED |
| `DeleteUserHwidDeviceRequestDto` | `DeleteUserHwidDeviceBodyDto` | `userId` | `userUuid` | string UUID -> number | MODIFIED |
| `GetUserHwidDevicesResponseDto` | одноимённая schema | — | — | nested devices | MODIFIED |
| `DeleteUserHwidDeviceResponseDto` | одноимённая schema | — | — | nested devices | MODIFIED |
| `Response\GetUserHwidDevicesResponse` | response payload | — | — | nested device type | MODIFIED |
| `Response\DeleteUserHwidDeviceResponse` | response payload | — | — | nested device type | MODIFIED |
| `Response\UserHwidDevice` | device item | `userId`, `requestIp` | `userUuid` | identifier type | MODIFIED |
| `GetAllNodesResponseDto` | `GetNodesResponseDto` | — | — | nested Node | MODIFIED |
| `NodeResponseDto` | `NodeResponseDto` | — | — | nested Node | MODIFIED |
| `NodeDto` | Node response object | `id`, `proxyUrl`, `nodeConsumptionMultiplier`, `integrationUuids`, `ips`, `activePluginUuid`, `system`, `versions`, `note` | `xrayVersion`, `nodeVersion`, `cpuCount`, `cpuModel`, `totalRam` | `xrayUptime` number; full nested structures | MODIFIED |
| `NodeConfigProfileDto` | Node `configProfile` | — | — | — | UNCHANGED |
| `NodeActiveInboundDto` | Node active inbound | required nullable `rawInbound` key | — | serialization includes null | MODIFIED |
| `ProviderDto` | Node `provider` | — | — | `faviconLink` and `loginUrl` nullable | MODIFIED |
| `GetNodesMetricsResponseDto` | одноимённая schema | — | — | — | UNCHANGED |
| `Response\NodesMetricsResponse` | metrics response payload | — | — | — | UNCHANGED |
| `NodeMetricsDto` | metrics node item | — | — | — | UNCHANGED |
| `TrafficStatDto` | inbound/outbound stat item | — | — | — | UNCHANGED |
| `GetAllHostsResponseDto` | `GetHostsResponseDto` | — | — | nested Host | MODIFIED |
| `HostResponseDto` | `HostResponseDto` | — | — | nested Host | MODIFIED |
| `HostDto` | Host response object | `finalMask`, `serverDescription`, `tags`, `pinnedPeerCertSha256`, `verifyPeerCertByName`, `mihomoIpVersion`, `excludeFromSubscriptionTypes`, `mapper`, `internalSquads` | `excludedInternalSquads`, `allowInsecure` | `xHttpExtraParams` -> `xhttpExtraParams`, moved inbound fields and nullable/required flags | MODIFIED |
| `HostInboundDto` | Host `inbound` | — | `serverDescription`, `tag`, `vlessRouteId` | только два nullable UUID | MODIFIED |
| `GetInternalSquadAccessibleNodesResponseDto` | одноимённая schema | — | — | — | UNCHANGED |
| `Response\InternalSquadAccessibleNodeResponse` | response payload | — | — | — | UNCHANGED |
| `AccessibleNodeDto` | accessible node item | — | — | — | UNCHANGED |
| `GetInternalSquadByUuidResponseDto` | `GetInternalSquadResponseDto` | — | — | nested response | MODIFIED |
| `Response\InternalSquadDetailResponse` | squad response payload | `tags` | — | — | MODIFIED |
| `InternalSquadInfoDto` | squad `info` | — | — | — | UNCHANGED |
| `InternalSquadInboundDto` | squad inbound item | required nullable `rawInbound` key | — | serialization includes null | MODIFIED |
| `GetStatsResponseDto` | одноимённая schema | — | — | nested stats | MODIFIED |
| `Response\StatsResponse` | stats response payload | nested node lifetime bytes | old nested fields | CPU/memory/nodes shapes | MODIFIED |
| `CpuStatsDto` | stats `cpu` | — | `physicalCores` | — | MODIFIED |
| `MemoryStatsDto` | stats `memory` | — | `active`, `available` | — | MODIFIED |
| `UsersStatsDto` | stats `users` | — | — | — | UNCHANGED |
| `OnlineStatsDto` | stats `onlineStats` | — | — | — | UNCHANGED |
| `NodesStatsDto` | stats `nodes` | `totalBytesLifetime` | — | — | MODIFIED |
| `LastConnectedNodeDto` | — | — | весь неиспользуемый DTO | поле отсутствует в актуальных responses | REMOVED |

Новые DTO на шаге 2 потребуются только для реально существующих вложенных структур Node/Host
и request body создания API token. Поля OpenAPI типа `unknown` и generic objects не получают
выдуманных свойств.

## Breaking changes

- Numeric `userId` заменил UUID в delete/action/HWID контрактах. `UserResponseDto.response`
  больше не содержит `uuid`.
- `GET /api/users/by-telegram-id/{telegramId}` удалён без прямой замены. Новый
  `POST /api/users/resolve` не принимает Telegram ID, поэтому метод будет удалён, а не
  перенаправлен на неподтверждённый endpoint.
- Enable/disable изменили HTTP method с GET на POST.
- Delete user и delete API token теперь возвращают 204 без response body.
- Create API token теперь требует body `name` + `expiresInDays`; существующий `tokenName`
  вообще не отправляется текущей реализацией.
- List API tokens возвращает `tokens[]`; `docs`, `apiKeys`, `tokenName` и открытый `token` в
  элементах списка удалены.
- Create/update user больше не используют `uuid` в body; update принимает numeric `id`.
- Traffic reset strategy получила значение `MONTH_ROLLING`.
- HWID device заменил `userUuid` на numeric `userId` и добавил required nullable `requestIp`.
- User response удалил `uuid`, `subLastUserAgent`, `subLastOpenedAt`.
- Node, Host и system stats response structures изменены согласно матрице DTO.
- `InternalSquadDetailResponse` получил required `tags`.
- `BaseApi::postWithDto()` должен поддержать POST без body для action endpoints.
- Browser-specific `X-Remnawave-Client-Type` отсутствует в OpenAPI и не должен отправляться.
- Login не требует bearer по OpenAPI; текущий `auth()` передаёт token и должен перестать это
  делать. Остальные операции используют bearer Authorization, `Accept: application/json` и JSON
  body там, где body документирован. Base path `/api` не изменился.

## Затронутые места приложения

- `app/Bot/Telegram/BotHandler.php`: создание пользователя остаётся совместимым после удаления
  неиспользуемого request-поля; `profile()`, `devices()` и `deleteDevice()` используют удалённый
  `UserResponse.uuid` и должны перейти на numeric `UserResponse.id`/`userId`.
- `app/Bot/Telegram/BotHandler.php`: `subscriptionUrl`, `expireAt`, `status/tag`,
  `trafficLimitBytes` и `userTraffic.usedTrafficBytes` остаются в новом response.
- `app/Services/UserService.php`: использует `getUserByUsername()` и поля `response.tag`; этот
  контракт остаётся доступен, бизнес-сопоставление по tag не меняется.
- `app/Http/Controllers/TestController.php` и маршрут `/home`: передают UUID в HWID Handler;
  тестовый вызов должен быть удалён либо переведён на реальный numeric user ID. В рамках
  миграции будет удалён неиспользуемый отладочный контроллер/маршрут, чтобы не сохранять
  вымышленный ID.
- Других production-вызовов Handler нет. `apiToken`, user update/delete/actions/subscription,
  Host, InternalSquad, node list/metrics и system stats сейчас доступны как библиотечные методы,
  но не вызываются вне `app/Remnawave`.

## Неоднозначности и блокировки

`UNKNOWN` отсутствуют. Единственный удалённый сценарий — lookup по Telegram ID — не используется
приложением и не имеет документированной замены. Его удаление не блокирует существующие
сценарии. Статус текущей миграции после аудита: все `MODIFIED`/`REMOVED` элементы ожидают шагов
2–4; окончательные статусы будут выставлены на шаге 5.
