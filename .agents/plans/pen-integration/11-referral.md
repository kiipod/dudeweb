# Шаг 11 — Реферальный раздел

## Цель задачи

Реализовать referral page на существующих отношениях User/ReferralReward и
утверждённом invite-link contract без изменения referral business rules.

## Зависимости

- Завершён шаг 10.
- Решены `U-09` и `U-21`.
- Существующие `User::referrals()`, `receivedReferralRewards()` и
  `UserService::generatePartnerLink()` либо утверждённая замена.
- Pen screen `Q` в mobile/tablet/desktop, dark/light.

## Конкретные действия

- [ ] Зафиксировать единственный canonical invite URL для web/Telegram.
- [ ] Собирать referral props в focused query/service с counts/sums на БД, без
  загрузки лишних collections.
- [ ] Передать invite URL, invited count, bonus days и optional recent items.
- [ ] Не раскрывать chat_id или внутренний user id в public URL без отдельного
  security решения.
- [ ] Реализовать copy и Web Share API action с fallback.
- [ ] Реализовать empty state из Pen и populated state по утверждённому copy.
- [ ] Корректно склонять числа/дни на server или в единой presentation utility.
- [ ] Не менять начисление bonus days и payment idempotency.
- [ ] Добавить authorization и aggregate query tests.

## Критерии готовности

- Referral показатели совпадают с реальными relations/rewards.
- Invite link соответствует утверждённому каналу и не раскрывает лишние данные.
- Copy/share доступны и имеют success/error feedback.
- Empty/populated states работают в обеих темах и всех viewport.
- Существующий Telegram referral flow не сломан.

## Команды проверки

```bash
docker compose exec -T laravel.test php artisan test --filter=Referral
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

