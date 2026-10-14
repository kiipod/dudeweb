# Шаг 11 — Реферальный раздел

## Цель задачи

Реализовать referral overview и отдельную страницу условий программы на
существующих отношениях User/ReferralReward/ReferralBonus и утверждённом
invite-link/content contract без изменения referral business rules.

## Зависимости

- Завершён шаг 10.
- Решены `U-03`, `U-09`, `U-21` и `U-27`.
- Существующие `User::referrals()`, `receivedReferralRewards()` и
  `UserService::generatePartnerLink()` либо утверждённая замена.
- Существующие `PromocodeService`, `ReferralService`, `ReferralBonus` и durable
  `PENDING`/`APPLIED`/`CONFLICT` reward flow.
- Pen screens `Q` и `Q2` в mobile/tablet/desktop, dark/light; Q2 IDs:
  `paZk6`, `LNwLW`, `BYL5v`, `hhNkq`, `jSIgm`, `Uel2T`.

## Обязательные skills

- `frontend-design`, `vue-best-practices` и `tailwind-best-practices` — referral
  states, copy/share behavior, component contracts и styling.
- `laravel-best-practices` — authorization, aggregate queries, deterministic
  ordering и минимальные Inertia props.
- `laravel-13-attribute-refactor` — условно для approved configuration после
  проверки installed framework source.

## Конкретные действия

- [ ] Сформировать два совместно работающих URL: web registration invite и
  Telegram bot invite; оба используют opaque token, server-side связанный с
  inviter `remnawave_user_id`.
- [ ] Собирать referral props в focused query/service с counts/sums на БД, без
  загрузки лишних collections.
- [ ] Для relationship metrics использовать `withCount`/aggregate queries и
  проверять query count, не гидратировать related models только ради count/sum.
- [ ] Передать `webInviteUrl`, `telegramInviteUrl`, invited count, только
  фактически `APPLIED` bonus days и optional recent items;
  `PENDING`/`CONFLICT` не включать в показатель «Получено бонусов» как уже
  начисленные дни.
- [ ] Не раскрывать `chat_id`, local user ID или raw `remnawave_user_id` в
  public URL.
- [ ] Применять first-valid-attribution-wins, отклонять self-referral между
  каналами и сохранять payment-level reward idempotency.
- [ ] Зафиксировать merge behavior: referral/reward ownership переходит local
  survivor, чей `remnawave_user_id` равен surviving remote ID; конфликтующие
  self-referral/reward records не начисляются повторно.
- [ ] Реализовать copy и Web Share API action с fallback.
- [ ] Реализовать empty state из Pen и populated state по утверждённому copy.
- [ ] Добавить protected read-only route/page условий программы, связанный с
  overview ссылкой «Условия партнёрской программы» и обратной навигацией
  «Назад к приглашениям» без потери scroll/history semantics.
- [ ] Передать Q2 content contract из server-confirmed source по `U-27`:
  friend discount, четыре шага и reward matrix; не хардкодить в Vue значения
  `30%` и `7/14/21/30` как независимые бизнес-правила.
- [ ] Если источником выбраны live rules, использовать тот же canonical
  selection/preference contract, что и payment/referral services, и выдавать
  честный unavailable state при неполной конфигурации вместо stale Pen data.
- [ ] Представить четыре шага семантическим ordered list: нумерация в Q2 имеет
  смысл последовательности и не является декоративным паттерном.
- [ ] Сохранить Q2 responsive shell contract: `Ещё` active на mobile/tablet,
  `Пригласить друга` active на desktop, без отдельного route для theme/viewport.
- [ ] Корректно склонять числа/дни на server или в единой presentation utility.
- [ ] Не менять начисление bonus days и payment idempotency.
- [ ] Добавить authorization и aggregate query tests, а также Feature test для
  Q2 route, props, canonical ordering периодов и overview/back links.

## Критерии готовности

- Referral показатели совпадают с реальными relations/rewards.
- Оба invite links соответствуют своим каналам, одной attribution policy и не
  раскрывают лишние данные.
- Copy/share доступны и имеют success/error feedback.
- Empty/populated states работают в обеих темах и всех viewport.
- Q2 соответствует dark/light Pen references на 390/768/1440, а показываемые
  условия совпадают с фактически действующим referral contract.
- Q2 доступен только authenticated user, имеет рабочие forward/back links и
  не создаёт мутирующих actions.
- Существующий Telegram referral flow не сломан.

## Команды проверки

```bash
./vendor/bin/sail artisan test --filter=Referral
./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --sequential app/Http app/Services tests/Feature
npm run build
git diff --check
```

## Сценарии проверки

- 0 referrals/0 bonus days.
- Несколько referrals с разными status и несколькими rewards.
- Web Share supported, canceled и unsupported.
- Clipboard denied.
- Anonymous access и попытка прочитать чужую статистику.
- Referral terms: 30% + 1/3/6/12 matrix из утверждённого source, missing/
  incomplete configuration, deterministic ordering и отсутствие stale copy.
- Q -> Q2 -> Q через click, keyboard и browser back на 390/768/1440.

