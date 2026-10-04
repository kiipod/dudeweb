# Аудит: сервисы, DTO, enum и Telegram-бот

## Область аудита

Проверены `app/Services/`, `app/DTO/`, `app/Actions/`, все каталоги `Enums`, HTTP-контроллеры,
Telegram-хендлер, репозиторий пользователей, конфигурация Telegraph и связанная логика моделей.

В `app/Services/` находятся шесть файлов:

- `MessageTemplateService.php`;
- `PlanMessageService.php`;
- `PromocodeService.php`;
- `ReferralService.php`;
- `UserOnboardingService.php`;
- `UserService.php`.

Каталоги `app/DTO/` и `app/Actions/` отсутствуют. DTO интеграции находятся исключительно в
`app/Remnawave/DTO/` и полностью описаны в `docs/audit/api.md`.

## Сервисы

### `MessageTemplateService`

Назначение: извлечение активного шаблона `ChatMessage` по строковому типу и подстановка значений
в плейсхолдеры вида `{key}`.

Публичный метод:

- `getFormattedMessage(string $type, array $data = []): string` — выполняет запрос по `type`,
  применяет scope `active()`, берёт первую запись и вызывает защищённую подстановку
  `replacePlaceholders()`.

Конструкторных зависимостей нет. Сервис напрямую зависит от модели `ChatMessage` и фасада `Log`.
Если шаблон отсутствует, он записывает ошибку в лог, но затем всё равно обращается к
`$template->text`, что приводит к ошибке выполнения.

### `PlanMessageService`

Назначение: формирование Telegram-текста обзора тарифов и детального текста выбранного тарифа.

Зависимости конструктора:

- `PromocodeService` — расчёт цены со скидкой;
- `MessageTemplateService` — базовый шаблон сообщения типа `plans`.

Публичные методы:

- `plansOverview(): string` — загружает активные `Plan` вместе с `products`, добавляет название,
  описание и минимальную цену. Цена делится на 100. Строка «₽/месяц» не учитывает, что минимум
  может относиться к продукту с периодом больше месяца;
- `planDetails(string $code, ?Promocode $promocode = null): string` — загружает тариф по `code`
  с `advantages` и `products`, перечисляет преимущества и цены, при наличии промокода вызывает
  `calculatePrice()` и добавляет подпись скидки.

Помимо внедрённых сервисов класс напрямую использует модели `Plan` и `Promocode`. Продукты в
деталях не фильтруются по `status`.

### `PromocodeService`

Назначение: применение промокода, расчёт скидки и создание одноразового реферального промокода.
Конструкторных зависимостей нет; используются `Promocode`, `User`, `UserPromocode`, `DB` и `Str`.

Публичные методы:

- `apply(string $code, User $user): Promocode` — нормализует код через `trim()` и нижний регистр,
  в транзакции и с `lockForUpdate()` ищет промокод, проверяет остаток `count`, запрещает
  пользователю повторное применение любого промокода, создаёт `UserPromocode`, уменьшает
  ограниченный `count` и возвращает промокод;
- `calculatePrice(int $price, Promocode $promo): int` — для `percent` вычисляет процентную
  скидку, для `fixed` вычитает фиксированную сумму и ограничивает результат снизу нулём;
- `createForRefUser(User $user, int $percent = 30): Promocode` — создаёт принадлежащий
  пользователю случайный восьмисимвольный процентный промокод с одним использованием.

Существенные свойства текущей реализации:

- применение и расходование промокода происходит при вводе кода, до создания/успешной оплаты;
- применённый промокод и рассчитанная цена не связываются с `Payment`;
- `fixed` трактуется в тех же минимальных денежных единицах, что и `Product.price`;
- для процентного значения нет диапазонной проверки и ограничения результата снизу;
- `title` не уникален на уровне БД, хотя `first()` предполагает однозначный код;
- ограничения `user_promocodes.user_id` и `promocode_id` по отдельности уникальны: каждый
  пользователь может применить только один промокод за всё время, а каждый промокод — только
  один пользователь независимо от `count`;
- `count = null` фактически означает отсутствие лимита;
- созданные через `createForRefUser()` коды имеют верхний регистр, а `apply()` ищет
  нормализованный нижний регистр. При регистрозависимом сравнении БД такой код не найдётся;
- `sendProducts()` дополнительно автоматически ищет промокод по `promocodes.user_id`, а не по
  записи `UserPromocode`, поэтому персональный код может отображаться как скидка ещё до применения.

### `ReferralService`

Назначение: заготовка начисления реферальных дней после платежа.

Публичный метод:

- `handlePayment(User $payer, Payment $payment): void` — прекращает обработку без реферера, при
  самореферале или уже существующем `ReferralReward` для платежа; определяет число дней и в
  транзакции продлевает локальный `User.trial_expired` реферера, затем создаёт
  `ReferralReward`.

Конструкторных зависимостей нет. Используются `Payment`, `ReferralReward`, `User`, фасад `DB` и
`config('referral...')`.

Сервис сейчас неработоспособен как платёжный post-processing и нигде не вызывается:

- он читает `$payment->months`, но такого поля нет в модели и миграции `payments`;
- он использует `config/referral.php`, а не таблицу/модель `ReferralBonus`;
- конфигурация содержит бонусы `7/21/45/90` дней для `1/3/6/12` месяцев, сидер содержит
  `7/14/21/30`, а текст бота обещает `7/14/21/30`;
- обновляется только локальный `trial_expired`; `expireAt` подписки Remnawave не меняется;
- проверка существования награды выполняется до транзакции и не подкреплена уникальным индексом,
  поэтому конкурентные вызовы могут создать дубликаты;
- отдельного статуса начисления нет.

### `UserOnboardingService`

Назначение: выбор сценария команды `/start`.

Публичный метод `resolveScenario(User $user): OnboardingScenario` возвращает:

- `Welcome` для `UserStatus::New`;
- `WelcomeBack` для `UserStatus::Inactive`, если `welcome_back_shown_at` ещё не задан;
- `MainMenu` во всех остальных случаях.

Конструкторных зависимостей нет; используются модель `User` и enum `UserTags` /
`OnboardingScenario`.

### `UserService`

Назначение: разбор реферального payload команды `/start`, синхронизация локального статуса с
Remnawave и генерация партнёрской ссылки.

Публичные методы:

- `getReferrerChatId(string $messageText): ?int` — извлекает число из начала строки
  `/start ref_<id>`;
- `refreshStatus(User $user): void` — самостоятельно создаёт `RemnawaveApi`, получает
  пользователя по username и сопоставляет поле ответа `tag`: `ACTIVE` → локальный `Active`,
  `TRIAL` → `Trial`, всё остальное → `Inactive`; любая ошибка Remnawave подавляется;
- `generatePartnerLink(int $chatId): string` — возвращает жёстко заданную ссылку
  `https://t.me/dudeweb_pro_bot?start=ref_<chatId>`.

Внедрённых зависимостей нет. `RemnawaveApi` создаётся внутри метода, а username бота захардкожен.
Для локального статуса используется внешний `tag`, не внешний `status`.

## PaymentService и существующая платёжная логика

`PaymentService` отсутствует. Поиск по сервисам, контроллерам, маршрутам и Telegram-коду не
обнаружил реализации создания платежа, вызова платёжного провайдера, webhook/callback успешной
оплаты, проверки подписи, идемпотентной фиксации результата или изменения подписки после оплаты.

Имеющиеся части:

- модель/миграция `Payment` и CRUD-страницы MoonShine; административная форма позволяет вручную
  редактировать все платёжные поля и не задаёт правила валидации;
- `ReferralService::handlePayment()`, который ожидает уже существующий успешный платёж, но нигде
  не вызывается;
- `config/telegraph.php` читает `TELEGRAPH_PAYMENT_PROVIDER_TOKEN`, однако токен отсутствует в
  `.env.example`, а Telegram invoices в коде не создаются;
- `BotHandler` дважды создаёт кнопки с callback `buy:<product_id>`, но метода `buy()` и другого
  обработчика этого callback нет;
- HTTP-контроллеры платёжной логики не содержат: есть только `TestController` для ручного вызова
  Remnawave; в `routes/web.php` отсутствуют платёжные/webhook-маршруты.

Следовательно, текущая точка для начала оплаты — callback `buy:<product_id>` после выбора
`Product`, но реализация за этой точкой отсутствует. Это наиболее прямое место интеграции
инициации YooKassa в Telegram-потоке.

Статусы `Payment` отдельно не определены: это nullable string в БД, свободное текстовое поле в
MoonShine, без enum и без фактических записывающих его workflow.

## DTO

Общего каталога `app/DTO/` и общих DTO нет. Все DTO принадлежат Remnawave-интеграции и описаны в
API-аудите с полями, источниками и получателями.

В Telegram-хендлере непосредственно создаются два интеграционных DTO:

- `CreateUserRequestDto` создаётся в `showWelcome()` из локального `User` и trial-настроек
  (`username`, `expireAt`, `trafficLimitBytes`, `tag`, `telegramId`, `activeInternalSquads`) и
  передаётся в `RemnawaveApi::users()->create()`;
- `DeleteUserHwidDeviceRequestDto` создаётся в `deleteDevice()` из Remnawave UUID пользователя и
  callback-параметра `hwid`, затем передаётся в
  `RemnawaveApi::hwid()->deleteUserHwidDevices()`.

Ответные DTO создаются обработчиками Remnawave из JSON-ответов и возвращаются в `BotHandler` /
`UserService`; отдельно прикладной слой их не преобразует.

## Enum

Каталога `app/Enums/` нет. В проекте определены восемь native enum в двух подсистемах.

### `app/Bot/Telegram/Enums`

| Enum | Значения | Использование |
| --- | --- | --- |
| `ChatMessageType: string` | `welcome`, `welcome_back`, `welcome_ref`, `help`, `partners`, `profile`, `message`, `plans` | `BotHandler` выбирает welcome/welcome_ref/welcome_back/help; `PlanMessageService` использует plans; значения передаются в `MessageTemplateService` |
| `OnboardingScenario` | unbacked cases `Welcome`, `WelcomeBack`, `MainMenu` | возвращается `UserOnboardingService`, затем match в `BotHandler::start()` |
| `UserStatus: string` | `NEW`, `TRIAL`, `ACTIVE`, `INACTIVE` | cast `User.status`; создание пользователя, onboarding, trial и синхронизация в `UserService`; `label()` выводит русское название в расширенной реферальной статистике |

У `UserTags` значения в верхнем регистре, тогда как enum колонки `users.status` содержит
нижний регистр. Это зафиксированное несоответствие схемы и runtime enum.

### `app/MoonShine/Enums`

| Enum | Значения | Использование |
| --- | --- | --- |
| `ChatTypeEnum: string` | `welcome`, `welcome_back`, `welcome_ref`, `help`, `partners`, `profile`, `message`, `plans` | поля типа сообщений на index/form/detail страницах `ChatMessage` |
| `MessageStatusEnum: string` | `active`, `inactive`, `draft`, `planned` | поля статуса на index/form/detail страницах `ChatMessage` |
| `PromocodeTypeEnum: string` | `fixed`, `percent` | поля типа на index/form/detail страницах `Promocode` |
| `StatusEnum: string` | `active`, `inactive`, `draft` | поля статуса на index/form/detail страницах `Plan` и `Product` |
| `UserStatusEnum: string` | `new`, `trial`, `active`, `inactive` | объявлен, но ни одна MoonShine-страница и никакой другой production-код его не использует |

Каждый MoonShine enum дополнительно содержит `toString()` и `getColor()` для отображения.

### Статусы подписки

Локальных `Subscription`, `SubscriptionStatus` и соответствующего native enum нет. Состояние
подписки приходит из Remnawave:

- `CreateUserRequestDto` валидирует строковый `status` по `ACTIVE`, `DISABLED`, `LIMITED`,
  `EXPIRED`;
- `UpdateUserRequestDto` разрешает только `ACTIVE` и `DISABLED`;
- `UserResponse.status` — строка с default `ACTIVE` без enum;
- `SubscriptionUserDto` содержит строку `userStatus` и boolean `isActive`;
- бот дополнительно считает подписку активной только по будущему `expireAt`, не по внешнему
  `status`/`isActive`.

Таким образом, единого набора статусов подписки в прикладном слое нет, а create/update DTO
разрешают разные множества.

## Telegram: хендлер, команды и клавиатуры

Единственный хендлер — `App\Bot\Telegram\BotHandler`, наследник Telegraph `WebhookHandler`.
Он указан в `config/telegraph.php` как обработчик webhook
`/telegraph/{token}/webhook`. Отдельных command- или keyboard-классов нет: команды являются
публичными методами хендлера, а все inline-клавиатуры строятся на месте через `Keyboard` и
`Button`.

`TelegramBot::registerBotCommands()` и консольная команда `bot:register-commands` регистрируют в
Telegram четыре команды: `/profile`, `/plans`, `/partners`, `/help`. Метод `/start` реализован в
хендлере, но в этом списке команд не регистрируется.

Основные точки и клавиатуры:

| Метод/экран | Действия кнопок |
| --- | --- |
| `showWelcome()` | URL подписки Remnawave, `plans`, `profile`, `help` |
| `showWelcomeBack()` | `plans` |
| `plans()` | динамическое действие с `Plan.code` |
| `sendProducts()` | `promocode;plan:<code>`, `buy:<product_id>` |
| `handlePromocodeInput()` | пересоздаёт кнопки `buy:<product_id>` со скидочными подписями |
| `profile()` | `devices`, `partners`, `plans`, `help` |
| `devices()` | `deleteDevice` с параметром `hwid` |
| `partners()` | `advanced` |
| `help()` | URL `https://t.me/dudeweb_chat` |

Выбор тарифа начинается в `plans()`: активные планы превращаются в callback по `Plan.code`.
Реально обработаны только жёстко заданные методы `limited()` и `unlimited()`, которые вызывают
`sendProducts()`; произвольный новый `Plan.code` не получит обработчик автоматически. Затем
пользователь выбирает продукт/период кнопкой `buy:<product_id>`. Это незавершённая точка
инициации оплаты.

Связь Telegram-пользователя с локальным `User` выполняется по `users.chat_id`:

- `UserRepository::create()` берёт `DefStudio\Telegraph\DTO\User::id()`, ищет существующего
  пользователя по `chat_id` или создаёт нового;
- остальные методы получают пользователя через `message->from()->id()`,
  `callbackQuery->from()->id()` или `chat->chat_id`;
- payload `/start ref_<chat_id>` содержит Telegram chat ID пригласившего, затем репозиторий
  преобразует его в локальный `users.id` для `referrer_user_id`.

## Реферальная механика

Текущий поток выглядит так:

1. `UserService::generatePartnerLink()` создаёт deep link с Telegram chat ID пригласившего.
2. `BotHandler::start()` извлекает ID, находит реферера и передаёт его локальный ID в
   `UserRepository::create()`.
3. Новый пользователь сохраняется с `referrer_user_id`.
4. После создания trial в Remnawave приглашённому пользователю создаётся персональный промокод
   на 30% с одним использованием.
5. Экран партнёрской программы показывает количество приглашённых и количество строк наград.
6. `ReferralService::handlePayment()` должен был бы начислить дни после платежа, но вызова из
   какого-либо payment flow нет.

Количество `receivedReferralRewards()` выводится как «дни», хотя код вызывает `count()` строк и
не суммирует `days_added`. Текст условий и сидер используют одну шкалу бонусов, а
`config/referral.php` — другую. Таблица `referral_bonus` доступна в MoonShine, но business logic
её не читает.

## Точки интеграции YooKassa

- Инициация: реализовать обработку существующего callback `buy:<product_id>` после выбора
  продукта. На этой границе доступны Telegram user/chat ID и `Product.id`; цену следует получать
  на сервере, а не из подписи кнопки.
- Фиксация результата: нового HTTP webhook-маршрута и обработчика сейчас нет.
- После подтверждённой оплаты: требуется обновить `Payment`, синхронизировать `expireAt` через
  существующий Remnawave user handler (конкретный метод указан в API-аудите) и затем запускать
  реферальное начисление идемпотентно.
- Текущий `PromocodeService::apply()` расходует промокод слишком рано для атомарного платёжного
  потока; это наблюдение, а не внесённое изменение.
