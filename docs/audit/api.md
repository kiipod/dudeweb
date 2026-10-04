# Аудит: интеграция Remnawave API

## Область и структура

Аудит охватывает все 77 файлов в `app/Remnawave/`: HTTP-обёртку, фасад модулей, восемь
Handler-классов, 61 DTO, исключение и пять конфигураций Xray/VLESS.

```text
app/Remnawave/
├── BaseApi.php
├── RemnawaveApi.php
├── Config/
│   ├── vless-inbounds-angie.json
│   ├── vless-reality-angie.json
│   ├── vless-reality-zapret.json
│   ├── vless-to-vless-ru-to-de-node.json
│   └── vless-xhttp-angie.json
├── DTO/
│   ├── AccessibleNodeDto.php
│   ├── ActiveInternalSquadDto.php
│   ├── ApiKeyDto.php
│   ├── CpuStatsDto.php
│   ├── CreateApiTokenResponseDto.php
│   ├── CreateUserRequestDto.php
│   ├── CreateUserResponseDto.php
│   ├── DeleteApiTokenResponseDto.php
│   ├── DeleteUserHwidDeviceRequestDto.php
│   ├── DeleteUserHwidDeviceResponseDto.php
│   ├── DeleteUserResponseDto.php
│   ├── Dto.php
│   ├── GetAllApiTokensResponseDto.php
│   ├── GetAllHostsResponseDto.php
│   ├── GetAllNodesResponseDto.php
│   ├── GetInternalSquadAccessibleNodesResponseDto.php
│   ├── GetInternalSquadByUuidResponseDto.php
│   ├── GetNodesMetricsResponseDto.php
│   ├── GetStatsResponseDto.php
│   ├── GetSubscriptionByUuidResponseDto.php
│   ├── GetUserHwidDevicesResponseDto.php
│   ├── GetUserResponseDto.php
│   ├── HostDto.php
│   ├── HostInboundDto.php
│   ├── HostResponseDto.php
│   ├── InternalSquadInboundDto.php
│   ├── InternalSquadInfoDto.php
│   ├── LastConnectedNodeDto.php
│   ├── LoginRequestDto.php
│   ├── LoginResponseDto.php
│   ├── MemoryStatsDto.php
│   ├── NodeActiveInboundDto.php
│   ├── NodeConfigProfileDto.php
│   ├── NodeDto.php
│   ├── NodeMetricsDto.php
│   ├── NodeResponseDto.php
│   ├── NodesStatsDto.php
│   ├── OnlineStatsDto.php
│   ├── ProviderDto.php
│   ├── Response/
│   │   ├── CreateApiTokenResponse.php
│   │   ├── DeleteApiTokenResponse.php
│   │   ├── DeleteUserHwidDeviceResponse.php
│   │   ├── DeleteUserResponse.php
│   │   ├── DocsResponse.php
│   │   ├── GetAllApiTokensResponse.php
│   │   ├── GetUserHwidDevicesResponse.php
│   │   ├── InternalSquadAccessibleNodeResponse.php
│   │   ├── InternalSquadDetailResponse.php
│   │   ├── LoginResponse.php
│   │   ├── NodesMetricsResponse.php
│   │   ├── StatsResponse.php
│   │   ├── SubscriptionResponse.php
│   │   ├── UserHwidDevice.php
│   │   └── UserResponse.php
│   ├── SsConfLinksDto.php
│   ├── SubscriptionUserDto.php
│   ├── TrafficStatDto.php
│   ├── UpdateUserRequestDto.php
│   ├── UpdateUserResponseDto.php
│   ├── UserTrafficDto.php
│   └── UsersStatsDto.php
├── Exceptions/
│   └── ApiException.php
└── Handlers/
    ├── ApiTokenHandler.php
    ├── AuthHandler.php
    ├── HostHandler.php
    ├── HwidHandler.php
    ├── InternalSquadHandler.php
    ├── NodesHandler.php
    ├── SystemHandler.php
    └── UserHandler.php
```

## HTTP-клиент и инициализация

### `BaseApi.php`

Абстрактная HTTP-обёртка построена на Laravel HTTP Client. Конструктор принимает `baseUrl` и
необязательный bearer token. `client()` создаёт новый `PendingRequest` через
`Http::baseUrl(...)->acceptJson()` и при наличии токена вызывает `withToken()`.

Доступные protected-методы:

- `getWithDto()` — GET;
- `getWithQueryParams()` — GET с query-параметрами, сейчас Handler-классами не используется;
- `postWithDto()` — POST с `Dto::toArray()`;
- `patchWithDto()` — PATCH с `Dto::toArray()`;
- `putWithDto()` — PUT, сейчас не используется;
- `deleteWithDto()` — DELETE с массивом тела;
- `buildUrl()` — простая замена `{name}` значениями без URL-кодирования;
- `handle()` — для любого HTTP 2xx декодирует JSON и вызывает `fromArray()` указанного DTO; для
  остальных ответов бросает `ApiException` с JSON-полем `message` и HTTP status code.

У клиента не настроены явные timeout, retry или circuit breaker. Методы POST/PATCH/PUT объявляют
DTO nullable, но безусловно вызывают `$dto->toArray()`, поэтому фактически DTO обязателен.

### `RemnawaveApi.php`

Фасад создаётся без аргументов и читает:

- base URL из `config('services.remnawave.api_url')` → `REMNAWAVE_API_URL`;
- API token из `config('services.remnawave.token')` → `REMNAWAVE_TOKEN`;
- административные username/password для login из `REMNAWAVE_USERNAME` и
  `REMNAWAVE_PASSWORD`.

`auth()`, `users()`, `hwid()`, `nodes()`, `hosts()`, `internalSquad()` и `system()` при каждом
вызове создают новый Handler. Для прикладных API-модулей в Handler передаётся `REMNAWAVE_TOKEN`.

`apiToken()` работает иначе: лениво вызывает приватный `login()`, получает административный
`accessToken`, кеширует его только внутри текущего экземпляра `RemnawaveApi` и передаёт в
`ApiTokenHandler`. При этом `auth()` тоже создаётся с `REMNAWAVE_TOKEN`, поэтому login-запрос при
непустом API token содержит bearer token вместе с username/password.

В `BotHandler` фасад внедряется контейнером. `UserService` и `TestController` создают его через
`new RemnawaveApi()`.

### Авторизация и base URL

`config/services.php` связывает четыре `REMNAWAVE_*` переменные с фасадом; `.env.example`
содержит все четыре имени. Base URL обрезается от завершающего `/`, endpoint добавляется как
абсолютный путь относительно этого URL. Основной механизм авторизации — заголовок
`Authorization: Bearer <REMNAWAVE_TOKEN>`.

Логин администратора (`POST /api/auth/login`) нужен только для операций с API tokens. Эти
операции дополнительно посылают `X-Remnawave-Client-Type: browser`.

### `ApiException.php`

Пустой наследник стандартного `Exception`. В него помещаются сообщение API и HTTP status code;
структурированные error details не сохраняются.

## Handler-классы и endpoints

В таблице перечислены фактически реализованные HTTP-вызовы.

| Handler / метод | HTTP | Endpoint | Параметры / тело | DTO ответа |
| --- | --- | --- | --- | --- |
| `AuthHandler::login()` | POST | `/api/auth/login` | `LoginRequestDto`: `username`, `password` | `LoginResponseDto` |
| `ApiTokenHandler::create()` | POST | `/api/tokens` | аргумент `tokenName`, но фактически не помещается ни в URL, ни в body | `Response\CreateApiTokenResponse` |
| `ApiTokenHandler::getAll()` | GET | `/api/tokens` | header `X-Remnawave-Client-Type: browser` | `GetAllApiTokensResponseDto` |
| `ApiTokenHandler::delete()` | DELETE | `/api/tokens/{uuid}` | path `uuid`, browser header | `DeleteApiTokenResponseDto` |
| `UserHandler::create()` | POST | `/api/users` | `CreateUserRequestDto` | `CreateUserResponseDto` |
| `UserHandler::update()` | PATCH | `/api/users` | `UpdateUserRequestDto`, идентификатор `username` или `uuid` находится в body | `UpdateUserResponseDto` |
| `UserHandler::delete()` | DELETE | `/api/users/{uuid}` | path `uuid` | `DeleteUserResponseDto` |
| `UserHandler::getUserByUsername()` | GET | `/api/users/by-username/{username}` | path `username` | `GetUserResponseDto` |
| `UserHandler::getUserByTelegramId()` | GET | `/api/users/by-telegram-id/{telegramId}` | path integer `telegramId` | `GetUserResponseDto` |
| `UserHandler::disableUser()` | GET | `/api/users/{uuid}/actions/disable` | должен быть path `uuid` | `GetUserResponseDto` |
| `UserHandler::enableUser()` | GET | `/api/users/{uuid}/actions/enable` | должен быть path `uuid` | `GetUserResponseDto` |
| `UserHandler::getSubscriptionByUsername()` | GET | `/api/subscriptions/by-username/{username}` | path `username` | `GetSubscriptionByUuidResponseDto` |
| `HwidHandler::getUserHwidDevices()` | GET | `/api/hwid/devices/{userUuid}` | path `userUuid` | `GetUserHwidDevicesResponseDto` |
| `HwidHandler::deleteUserHwidDevices()` | POST | `/api/hwid/devices/delete` | `DeleteUserHwidDeviceRequestDto`: `userUuid`, `hwid` | `DeleteUserHwidDeviceResponseDto` |
| `HostHandler::getAllHosts()` | GET | `/api/hosts` | нет | `GetAllHostsResponseDto` |
| `HostHandler::getHostByUuid()` | GET | `/api/hosts/{uuid}` | path `uuid` | `HostResponseDto` |
| `InternalSquadHandler::getInternalSquadAccessibleNodes()` | GET | `/api/internal-squads/{uuid}/accessible-nodes` | path `uuid` | `GetInternalSquadAccessibleNodesResponseDto` |
| `InternalSquadHandler::getInternalSquadByUuid()` | GET | `/api/internal-squads/{uuid}` | path `uuid` | `GetInternalSquadByUuidResponseDto` |
| `NodesHandler::getAllNodes()` | GET | `/api/nodes` | нет | `GetAllNodesResponseDto` |
| `NodesHandler::getNodeByUuid()` | GET | `/api/nodes/{uuid}` | path `uuid` | `NodeResponseDto` |
| `NodesHandler::getNodesMetrics()` | GET | `/api/system/nodes/metrics` | нет | `GetNodesMetricsResponseDto` |
| `SystemHandler::getStats()` | GET | `/api/system/stats` | нет | `GetStatsResponseDto` |

Зафиксированные дефекты Handler-реализации:

- `ApiTokenHandler::create()` не создаёт request DTO, хотя `postWithDto()` безусловно вызывает
  `toArray()`: текущий вызов завершится ошибкой на `null`. `tokenName` передаётся как URL-параметр,
  но `/api/tokens` не содержит `{tokenName}`, поэтому значение всё равно не отправилось бы;
- `disableUser()` и `enableUser()` подставляют буквальную строку `uuid`, а не аргумент `$uuid`;
- имя `GetSubscriptionByUuidResponseDto` не соответствует фактическому поиску по username;
- отдельного endpoint/метода «продлить подписку» нет.

## DTO: общий контракт

`Dto.php` объявляет два метода: `static fromArray(array $data): static` и `toArray(): array`.
`BaseApi::handle()` создаёт корневой response DTO из JSON. Корневые DTO затем создают вложенные
объекты. Request DTO создаются вызывающим прикладным кодом и сериализуются перед отправкой.

### Request DTO

| Файл | Поля | Создание и получатель |
| --- | --- | --- |
| `LoginRequestDto.php` | `username: string`, `password: string` | создаётся в `RemnawaveApi::login()`, передаётся в `AuthHandler::login()` |
| `DeleteUserHwidDeviceRequestDto.php` | `userUuid: string`, `hwid: string` | создаётся в `BotHandler::deleteDevice()`, передаётся в `HwidHandler::deleteUserHwidDevices()` |
| `CreateUserRequestDto.php` | обязательные `username: string`, `expireAt: string`; optional/default: `status`, `shortUuid`, `trojanPassword`, `vlessUuid`, `ssPassword`, `trafficLimitBytes`, `trafficLimitStrategy`, `createdAt`, `lastTrafficResetAt`, `description`, `tag`, `telegramId`, `email`, `hwidDeviceLimit`, `activeInternalSquads`, `uuid`, `externalSquadUuid` | создаётся в `BotHandler::showWelcome()` и передаётся в `UserHandler::create()` |
| `UpdateUserRequestDto.php` | nullable `username`, `uuid`, `status`, `trafficLimitBytes`, `trafficLimitStrategy`, `expireAt`, `description`, `tag`, `telegramId`, `email`, `hwidDeviceLimit`, `activeInternalSquads`, `externalSquadUuid` | готов для `UserHandler::update()`, но сейчас нигде не создаётся вне собственного `fromArray()` |

`CreateUserRequestDto` по умолчанию устанавливает `status=ACTIVE` и
`trafficLimitStrategy=NO_RESET`. Он проверяет формат/длину username, пароли, VLESS UUID, tag,
email, неотрицательные traffic/HWID limits, статусы `ACTIVE|DISABLED|LIMITED|EXPIRED` и стратегии
`NO_RESET|DAY|WEEK|MONTH`.

`UpdateUserRequestDto` требует хотя бы `username` или `uuid`, валидирует те же применимые поля,
но для статуса разрешает только `ACTIVE|DISABLED`. Его `toArray()` удаляет только `null`, поэтому
значения `0`, `false` и пустая строка остаются в payload там, где тип это допускает.

### Корневые response/envelope DTO

| Файл | Поля и вложенный тип | Источник |
| --- | --- | --- |
| `CreateApiTokenResponseDto.php` | `response: Response\CreateApiTokenResponse` | определён, но нигде не используется; Handler возвращает внутренний DTO напрямую |
| `CreateUserResponseDto.php` | `response: Response\UserResponse` | `UserHandler::create()` |
| `UpdateUserResponseDto.php` | `response: Response\UserResponse` | `UserHandler::update()` |
| `GetUserResponseDto.php` | `response: Response\UserResponse` | поиск/enable/disable пользователя |
| `DeleteUserResponseDto.php` | `response: Response\DeleteUserResponse` | удаление пользователя |
| `LoginResponseDto.php` | `response: Response\LoginResponse` | login администратора |
| `DeleteApiTokenResponseDto.php` | `response: Response\DeleteApiTokenResponse` | удаление API token |
| `GetAllApiTokensResponseDto.php` | `response: Response\GetAllApiTokensResponse` | список API tokens |
| `GetAllHostsResponseDto.php` | `response: HostDto[]` | список хостов |
| `HostResponseDto.php` | `response: HostDto` | один хост |
| `GetAllNodesResponseDto.php` | `response: NodeDto[]` | список нод |
| `NodeResponseDto.php` | `response: NodeDto` | одна нода |
| `GetNodesMetricsResponseDto.php` | `response: Response\NodesMetricsResponse` | метрики нод |
| `GetStatsResponseDto.php` | `response: Response\StatsResponse` | системная статистика |
| `GetInternalSquadAccessibleNodesResponseDto.php` | `response: Response\InternalSquadAccessibleNodeResponse` | доступные ноды squad |
| `GetInternalSquadByUuidResponseDto.php` | `response: Response\InternalSquadDetailResponse` | детали squad |
| `GetUserHwidDevicesResponseDto.php` | `response: Response\GetUserHwidDevicesResponse` | список устройств |
| `DeleteUserHwidDeviceResponseDto.php` | `response: Response\DeleteUserHwidDeviceResponse` | результат удаления устройства |
| `GetSubscriptionByUuidResponseDto.php` | `response: Response\SubscriptionResponse` | подписка по username, несмотря на имя DTO |

### `DTO/Response`: поля фактических payload

| Файл | Поля |
| --- | --- |
| `CreateApiTokenResponse.php` | `token: string`, `uuid: string` |
| `DeleteApiTokenResponse.php` | `response: bool` |
| `LoginResponse.php` | `accessToken: string` |
| `DeleteUserResponse.php` | `isDeleted: bool` |
| `UserHwidDevice.php` | `hwid`, `userUuid`, nullable `platform`, `osVersion`, `deviceModel`, `userAgent`, `createdAt`, `updatedAt` |
| `GetUserHwidDevicesResponse.php` | `total: int`, `devices: UserHwidDevice[]` |
| `DeleteUserHwidDeviceResponse.php` | `total: int`, `devices: UserHwidDevice[]` |
| `DocsResponse.php` | `isDocsEnabled: bool`, nullable `scalarPath`, nullable `swaggerPath` |
| `GetAllApiTokensResponse.php` | `apiKeys: ApiKeyDto[]`, `docs: DocsResponse` |
| `InternalSquadAccessibleNodeResponse.php` | `squadUuid: string`, `accessibleNodes: AccessibleNodeDto[]` |
| `InternalSquadDetailResponse.php` | `uuid`, `viewPosition`, `name`, `info: InternalSquadInfoDto`, `inbounds: InternalSquadInboundDto[]`, `createdAt`, `updatedAt` |
| `NodesMetricsResponse.php` | `nodes: NodeMetricsDto[]` |
| `StatsResponse.php` | `cpu: CpuStatsDto`, `memory: MemoryStatsDto`, `uptime`, `timestamp`, `users: UsersStatsDto`, `onlineStats: OnlineStatsDto`, `nodes: NodesStatsDto` |
| `SubscriptionResponse.php` | `isFound: bool`, `user: SubscriptionUserDto`, `links: array`, nullable `ssConfLinks: SsConfLinksDto`, `subscriptionUrl: string` |
| `UserResponse.php` | `uuid`, `id`, `shortUuid`, `username`, `expireAt`, nullable `telegramId`, `email`, `description`, `tag`, `hwidDeviceLimit`, `externalSquadUuid`, `trojanPassword`, `vlessUuid`, `ssPassword`, nullable `subRevokedAt`, `subLastUserAgent`, `subLastOpenedAt`, `lastTrafficResetAt`, `createdAt`, `updatedAt`, `subscriptionUrl`, `activeInternalSquads: ActiveInternalSquadDto[]`, `userTraffic: UserTrafficDto`, `status`, `trafficLimitBytes`, `trafficLimitStrategy`, `lastTriggeredThreshold` |

### Остальные вложенные DTO

| Файл | Поля / роль |
| --- | --- |
| `AccessibleNodeDto.php` | `uuid`, `nodeName`, `countryCode`, `configProfileUuid`, `configProfileName`, `activeInbounds: array` |
| `ActiveInternalSquadDto.php` | `uuid`, `name`; элемент `UserResponse.activeInternalSquads` |
| `ApiKeyDto.php` | `uuid`, `token`, `tokenName`, `createdAt`, `updatedAt` |
| `CpuStatsDto.php` | `cores: float`, `physicalCores: float` |
| `MemoryStatsDto.php` | `total`, `free`, `used`, `active`, `available` как float |
| `UsersStatsDto.php` | `statusCounts: array`, `totalUsers: float` |
| `OnlineStatsDto.php` | `lastDay`, `lastWeek`, `neverOnline`, `onlineNow` как float |
| `NodesStatsDto.php` | `totalOnline: float` |
| `HostInboundDto.php` | nullable `configProfileUuid`, `configProfileInboundUuid`, `serverDescription`, `tag`, `vlessRouteId` |
| `HostDto.php` | `uuid`, `viewPosition`, `remark`, `address`, `port`, nullable `path`, `sni`, `host`, `alpn`, `fingerprint`, mixed `xHttpExtraParams`, `muxParams`, `sockoptParams`, `inbound: HostInboundDto`, arrays `nodes`, `excludedInternalSquads`, nullable `xrayJsonTemplateUuid`, booleans `shuffleHost`, `mihomoX25519`, `isDisabled`, `isHidden`, `overrideSniFromAddress`, `keepSniBlank`, `allowInsecure`, `securityLayer` |
| `InternalSquadInfoDto.php` | `membersCount`, `inboundsCount` |
| `InternalSquadInboundDto.php` | `uuid`, `profileUuid`, `tag`, `type`, nullable `network`, `security`, `port`, mixed `rawInbound` |
| `LastConnectedNodeDto.php` | `connectedAt`, `nodeName`, `countryCode`; определён, но не используется другими файлами |
| `NodeActiveInboundDto.php` | `uuid`, `profileUuid`, `tag`, `type`, nullable `network`, `security`, `port`, mixed `rawInbound` |
| `NodeConfigProfileDto.php` | nullable `activeConfigProfileUuid`, `activeInbounds: NodeActiveInboundDto[]` |
| `ProviderDto.php` | `uuid`, `name`, `faviconLink`, `loginUrl`, `createdAt`, `updatedAt` |
| `NodeDto.php` | `uuid`, `name`, `address`, nullable `port`, booleans `isConnected`, `isDisabled`, `isConnecting`, nullable `lastStatusChange`, `lastStatusMessage`, `xrayVersion`, `nodeVersion`, `xrayUptime`, `isTrafficTrackingActive`, nullable `trafficResetDay`, `trafficLimitBytes`, `trafficUsedBytes`, `notifyPercent`, `usersOnline`, `viewPosition`, `countryCode`, `consumptionMultiplier`, `tags`, nullable `cpuCount`, `cpuModel`, `totalRam`, `createdAt`, `updatedAt`, `configProfile: NodeConfigProfileDto`, nullable `providerUuid`, `provider: ProviderDto` |
| `TrafficStatDto.php` | `tag`, `upload`, `download` |
| `NodeMetricsDto.php` | `nodeUuid`, `nodeName`, `countryEmoji`, `providerName`, `usersOnline`, `inboundsStats: TrafficStatDto[]`, `outboundsStats: TrafficStatDto[]` |
| `UserTrafficDto.php` | `usedTrafficBytes`, `lifetimeUsedTrafficBytes`, nullable `onlineAt`, `firstConnectedAt`, `lastConnectedNodeUuid` |
| `SubscriptionUserDto.php` | `shortUuid`, `daysLeft`, `trafficUsed`, `trafficLimit`, `lifetimeTrafficUsed`, `trafficUsedBytes`, `trafficLimitBytes`, `lifetimeTrafficUsedBytes`, `username`, `expiresAt`, `isActive`, `userStatus`, `trafficLimitStrategy`; byte counters здесь типизированы строками |
| `SsConfLinksDto.php` | единственное nullable поле `propertyName`; произвольные свойства SS config не моделируются |

Все response DTO создаются из JSON в `BaseApi::handle()` и возвращаются вызвавшему Handler
коду. Сейчас прикладной код реально потребляет главным образом `UserResponse`, `UserTrafficDto`,
`NodeDto` и HWID DTO в `BotHandler`, а также `UserResponse` в `UserService`.

## Передача ключевых полей подписки

### `subscriptionUrl`

- приходит в `Response\UserResponse.subscriptionUrl` при создании/получении/обновлении
  пользователя;
- также приходит в `Response\SubscriptionResponse.subscriptionUrl`;
- `BotHandler::showWelcome()` берёт
  `CreateUserResponseDto->response->subscriptionUrl` и ставит его URL кнопки «Начать
  пользоваться»;
- локально URL не сохраняется.

### `expireAt` / `expiresAt`

- при trial `BotHandler::showWelcome()` отправляет
  `CreateUserRequestDto.expireAt = now()->addDays(3)->utc()->toISOString()`;
- `Response\UserResponse.expireAt` принимает абсолютную строку даты;
- `BotHandler::profile()` отображает её в `Europe/Moscow`, а `StringHelper` считает подписку
  активной, если дата в будущем;
- `UpdateUserRequestDto.expireAt` позволяет передать новую абсолютную дату через
  `UserHandler::update()`;
- subscription endpoint использует отдельное имя `SubscriptionUserDto.expiresAt`.

Нигде в текущем production-коде `UpdateUserRequestDto` не создаётся, поэтому существующая дата
фактически не продлевается.

### `status`

- `CreateUserRequestDto.status` по умолчанию `ACTIVE`; разрешены `ACTIVE`, `DISABLED`, `LIMITED`,
  `EXPIRED`;
- `UpdateUserRequestDto.status` nullable; разрешены только `ACTIVE`, `DISABLED`;
- `Response\UserResponse.status` — строка с fallback `ACTIVE`;
- `SubscriptionUserDto` возвращает `userStatus` и `isActive`;
- локальный `UserService::refreshStatus()` ошибочно/намеренно сопоставляет локальный статус по
  `UserResponse.tag`, а не по `UserResponse.status`.

### `usedTrafficBytes` и `trafficLimitBytes`

- `usedTrafficBytes` приходит как float в `UserTrafficDto`, вложенном в `UserResponse`; профиль
  бота передаёт его в `StringHelper::formatTraffic()`;
- `trafficLimitBytes` отправляется при создании trial как `32212254720` (30 GiB), может
  отправляться в create/update DTO и возвращается integer в `UserResponse`;
- в `SubscriptionUserDto` `trafficUsedBytes` и `trafficLimitBytes` представлены строками;
- локально значения не сохраняются.

## Продление после успешной оплаты

Специализированного метода продления или операции «добавить N дней» нет. Единственный
существующий механизм изменения срока:

1. получить текущего пользователя через
   `UserHandler::getUserByUsername()` или `getUserByTelegramId()`;
2. рассчитать новую абсолютную дату на стороне приложения;
3. создать `UpdateUserRequestDto` с `username` или `uuid`, новым `expireAt` и при необходимости
   `status: 'ACTIVE'`;
4. вызвать `RemnawaveApi::users()->update()`, который выполняет `PATCH /api/users`.

Следовательно, конкретный Handler для синхронизации после подтверждённой оплаты —
`UserHandler::update(UpdateUserRequestDto)`. Ответ `UpdateUserResponseDto` содержит итоговый
`UserResponse`, включая `expireAt`, `status`, `subscriptionUrl` и traffic fields.

Текущая кодовая база не определяет правило расчёта новой даты. Для безопасного продления оно
должно учитывать текущий `expireAt` (обычно база расчёта — более поздняя из текущей даты
окончания и текущего времени), но это уже последующая реализация, не часть аудита. Кроме того,
`Product` не имеет отдельного числового периода: период закодирован только в `Product.name`.

## Файлы `Config/`

Эти JSON-файлы не читаются PHP-классами интеграции; это сохранённые конфигурации Xray/Remnanode:

- `vless-inbounds-angie.json` — два inbound: VLESS Reality через Angie и VLESS XHTTP через Unix
  socket; direct/block outbounds и блокировка private/bittorrent traffic;
- `vless-reality-angie.json` — один VLESS Reality inbound через Angie с direct/block routing;
- `vless-reality-zapret.json` — вариант Reality с дополнительной блокировкой доменных наборов
  zapret;
- `vless-xhttp-angie.json` — один VLESS XHTTP inbound через Unix socket;
- `vless-to-vless-ru-to-de-node.json` — RU inbound, VLESS outbound к DE node и разветвлённые
  direct/block/DE routing rules.

В конфигурациях присутствует чувствительный криптографический материал и идентификаторы в
открытом виде. Значения здесь намеренно не воспроизводятся; их следует считать раскрытыми
секретами. `vless-to-vless-ru-to-de-node.json` содержит `//`-комментарии и поэтому не является
валидным JSON для строгого parser; остальные четыре файла успешно декодируются стандартным PHP
JSON parser.

## Итоговые ограничения и риски

- После оплаты следует использовать `UserHandler::update()`: другого способа продления в
  репозитории нет.
- Вызов должен передавать абсолютный `expireAt`; атомарного server-side increment нет.
- В интеграции нет идемпотентности, retry и журналирования внешних request IDs.
- API token и административный access token применяются в разных ветках, а login дополнительно
  получает bearer API token.
- Несколько Handler-методов имеют фактические дефекты параметров, перечисленные выше.
- Request/response статусы заданы строками и не унифицированы native enum.
- Секреты в `Config/*.json` требуют отдельной ротации и выноса, но production-код в рамках
  аудита не изменялся.
