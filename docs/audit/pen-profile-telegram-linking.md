# Профиль: Username и привязка Telegram — 2026-10-26

## Решения владельца

Из формы «Изменить данные» удалены имя и фамилия. Остаются Username и Email.
Username — отдельный ник сервиса, хранится в `users.profile_username`:
nullable, unique, 3–32 символа `a-z`, `0-9`, `_`, нормализация trim/lowercase.
Существующее `users.username` остаётся Telegram username. Исторические
first/last name не удаляются из БД и больше не изменяются web-формой.
Смена Email сохраняет current-password proof и повторное подтверждение адреса.

Владелец явно расширил прежние U-04/U-11 и scope шага 13: разрешены привязка
Telegram и объединение web/bot accounts. Unlink/account deletion не добавлены.
При объединении сохраняется подписка и ссылка аккаунта, созданного раньше
(`users.created_at`, затем `id`). Если у старого bot account нет подписки,
сохраняется существующая web subscription. Оставшееся оплаченное время двух
подписок суммируется; пробные периоды не складываются.

## Identity и подтверждение

Все web mutations проходят authenticated verified `web` guard, FormRequest,
Gate, CSRF и throttling:

| Действие | Маршрут |
| --- | --- |
| Создать proof и открыть бота | POST `/account/profile/telegram` |
| Завершить подтверждённую привязку | POST `/account/profile/telegram/confirm` |
| Отменить ещё не начатую привязку | DELETE `/account/profile/telegram` |

Proof — случайные 32 символа, срок 10 минут, token/session hashes в БД.
Новый challenge отзывает прежние неиспользованные. Deep link открывает
private chat бота; sender должен совпадать с chat ID, bot ID — с challenge.
До подтверждения обычная регистрация/trial не запускается. Бот показывает
email web account и запрашивает явное согласие. Финальное web подтверждение
доступно владельцу в исходной browser session. Replay, другой sender/bot,
истёкшая ссылка, чужой challenge и другая session отвергаются.

Webhook сохраняет существующий secret URL Telegraph; если настроен
`TELEGRAPH_WEBHOOK_SECRET`, дополнительно обязателен matching header.
Link updates отключают debug payload logging, включая case-insensitive
callback actions. Поддерживаются Telegram users без username и ID за int32.
В props не выдаются bot token, proof hashes, remote credentials или merge plan.

## Объединение и восстановление

Durable stages: `pending → awaiting_telegram → ready → applying →
remote_applied → local_applied → complete`; unused stages можно отменить.
После `applying` операция завершается из сохранённого этапа. UI показывает
pending, expiry, wrong-session, busy и retry states через Inertia partial reload.
При возвращении фокуса в браузер статус обновляется. Отдельного UI REST API нет.

Обе local identities резервируются через `telegram_merge_id`, row locks и
общие subscription locks. Pending invoice/processing payment или применяемая
referral reward с сохранённым target блокируют начало merge. Создание invoice
повторно проверяет reservation под тем же user row lock; provider HTTP
выполняется за пределами DB transaction.

Remote snapshot проверяет numeric identity; legacy mapping без numeric ID
разрешается через официальный stream filter `telegramId`, независимо от
смены username. Ноль результатов означает отсутствие bot subscription;
несколько результатов требуют reconciliation, без remote mutations.
Сохранённый plan содержит абсолютный expiry target и hash исходных
credentials. Повторный запрос не складывает время повторно. Время считается
по Remnawave `expireAt`, оплаченный остаток — по `ACTIVE` tag. Результат не
сокращает наиболее длинный исходный период; trial/special periods не суммируются.
Disabled/limited status не активируется автоматически.

Сначала обновляется сохраняемая remote subscription и проверяются identity,
expiry и неизменность ссылки/credentials. Затем в одной DB transaction
переносятся payments, promocode ownership/usage history, referral attribution/
invites/rewards, support tickets/messages и notifications. Сохраняется local
row старейшей существующей подписки; verified web email/password и отдельный
ник переносятся в неё. Текущий браузер переключается на survivor с новым session
ID, включая случай ошибки последующего cleanup. Self-referral отмечается
Conflict, cycles не создаются. Losing remote удаляется после local commit;
404 на повторном DELETE считается завершённой очисткой.

`telegram-links:resume` по расписанию каждую минуту повторяет только уже
подтверждённые начатые merges. Есть и ручной retry из профиля. Временные HTTP
сбои сохраняют stage, абсолютный target и безопасный exception class. Внешнее
изменение subscription после snapshot требует reconciliation; оно не
перезаписывается молча. Raw proof и remote secrets не логируются.

## Миграции и окружение

Проверены новые up/down и SQL pretend, scoped PHP-CS-Fixer, затем по явному
запросу владельца выполнен `sail artisan migrate` в локальной PostgreSQL
`dudeweb`. Повторный `migrate:status`: все миграции Ran, новые четыре — batch 8:

- `2026_10_26_133632_add_profile_username_to_users_table`;
- `2026_10_26_134005_create_telegram_account_links_table`;
- `2026_10_26_134319_widen_telegram_chat_id_on_users_table`;
- `2026_10_26_135036_preserve_merged_user_promocode_history`.

История использованных промокодов допускает несколько записей одного merged
user; обычная eligibility по-прежнему проверяется сервисом под user lock.
Rollback не сужает chat ID и не восстанавливает unique owner ценой потери
данных: при несовместимой существующей истории он явно отказывает.

`services.telegram.bot_username` использует существующую конфигурацию.
При единственном bot в БД ID определяется автоматически; при нескольких
нужно указать `TELEGRAM_LINK_BOT_ID`. Некорректный ID или неоднозначный mapping
делают действие недоступным. Header secret опционален и должен совпадать с
настроенным Telegram webhook. `.env.example` дополнен; реальный `.env`, bot
webhook и deployment не изменялись. В текущем локальном окружении настроен
username и найден один bot; header secret отсутствует, используется secret URL.

## Проверка и границы

Live Pen profile sources повторно прочитаны read-only: card padding 15, gap 12,
существующие interface typography/tokens и shared controls сохранены.
Новые Username и Telegram states — явное расширение владельца поверх макета.
Проверены screenshots профиля 390/light и Telegram ready 320/dark.

Sail browser: **393/393** за 5.5 минут — profile 87, pointer 118,
controls 96, interactive 62, Pen profile frame/surface/detail 30. Telegram
states проверены в обеих темах на 320/1440, существующая profile responsive
matrix — до 2560. Frontend Node **103/103**, client/SSR build проходят.
Generated `bootstrap/ssr/*` восстановлены byte-for-byte к HEAD.

Backend проверяет auth/CSRF/session ownership, TTL/replay, bot sender proof,
оба порядка создания аккаунтов, paid/trial policy, перенос всех перечисленных
histories, отсутствие второго trial, numeric/legacy mapping, отказы при
неоднозначной identity, pending payments, reservation и idempotent PATCH/DELETE
retries. Итог полного Laravel-прогона: **300 tests / 2934 assertions**,
exit 0, включая 21 Telegram linking test. 289 tests отмечены существующими
PHP 8.5 PDO deprecations; failed/skipped нет. Проверки выполнены внутри Sail.

HTTP/provider tests используют isolated fakes: реальная отправка Telegram,
привязка пользовательского аккаунта и изменение живых Remnawave subscriptions
не выполнялись. External smoke, production deployment и operational SSR в этой
правке не подтверждены. M-12 SMTP шага 15 остаётся открыт; шаг 16 не начат.

API sources: [Telegram deep linking](https://core.telegram.org/bots/features#deep-linking),
[Telegram secret webhook path](https://core.telegram.org/bots/faq#how-can-i-make-sure-that-webhook-requests-are-coming-from-telegram),
[optional webhook secret_token](https://core.telegram.org/bots/api#setwebhook),
локальный `docs/remnawave/api-1.json` (stream `telegramId`, nullable PATCH fields).
