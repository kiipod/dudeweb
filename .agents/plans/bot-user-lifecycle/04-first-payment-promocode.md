# Шаг 4 — Автоматический Promocode первой оплаты

## Цель

Invited и returning пользователю автоматически применяется соответствующий
promocode для первой успешной оплаты.

## Eligibility

Определить существующие promocode для:

- invited;
- returning.

Не создавать новые значения скидок.

Использовать существующую конфигурацию/БД.

## Automatic promocode

Если пользователь eligible:

- [ ] Promocode определяется автоматически
- [ ] Discount применяется автоматически
- [ ] Пользователь видит цену с учётом скидки
- [ ] Не требуется ручной ввод

## UI тарифов

Если automatic promocode активен:

не показывать:

`У меня есть промокод`

- [ ] Кнопка/поле скрыто
- [ ] Callback ручного promocode не предлагается
- [ ] Цена отображается с automatic discount

Если automatic promocode отсутствует:

- [ ] существующий ручной promocode flow сохраняется

## Промокоды не суммируются

Для одного Payment разрешён только один discount source.

Проверить:

    automatic + manual

Результат:

- [ ] manual promocode нельзя добавить поверх automatic
- [ ] discounts не складываются

Проверить также:

- invited + returning;
- automatic + referral-related discount, если существует;
- повторный automatic promocode.

## One-time usage

Automatic promocode используется один раз при первой успешной оплате.

Важно:

`Payment created != promocode consumed`

`Payment canceled != promocode consumed`

`Payment succeeded = promocode consumed`

- [ ] canceled не расходует promocode
- [ ] failed attempt не расходует promocode
- [ ] successful payment расходует promocode
- [ ] следующая покупка не получает тот же one-time promocode

## Tests

- [ ] invited получает automatic discount
- [ ] returning получает automatic discount
- [ ] UI скрывает ручной promocode
- [ ] automatic + manual невозможен
- [ ] canceled не расходует promocode
- [ ] succeeded расходует promocode
- [ ] повторная покупка без automatic discount
- [ ] обычный пользователь сохраняет manual promocode flow

## Commit

`feat: add automatic first payment discount`
