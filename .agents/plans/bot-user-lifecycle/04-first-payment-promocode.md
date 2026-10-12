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

- [x] Promocode определяется автоматически
- [x] Discount применяется автоматически
- [x] Пользователь видит цену с учётом скидки
- [x] Не требуется ручной ввод

## UI тарифов

Если automatic promocode активен:

не показывать:

`У меня есть промокод`

- [x] Кнопка/поле скрыто
- [x] Callback ручного promocode не предлагается
- [x] Цена отображается с automatic discount

Если automatic promocode отсутствует:

- [x] существующий ручной promocode flow сохраняется

## Промокоды не суммируются

Для одного Payment разрешён только один discount source.

Проверить:

    automatic + manual

Результат:

- [x] manual promocode нельзя добавить поверх automatic
- [x] discounts не складываются

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

- [x] canceled не расходует promocode
- [x] failed attempt не расходует promocode
- [x] successful payment расходует promocode
- [x] следующая покупка не получает тот же one-time promocode

## Tests

- [x] invited получает automatic discount
- [x] returning получает automatic discount
- [x] UI скрывает ручной promocode
- [x] automatic + manual невозможен
- [x] canceled не расходует promocode
- [x] succeeded расходует promocode
- [x] повторная покупка без automatic discount
- [x] обычный пользователь сохраняет manual promocode flow

## Commit

`feat: add automatic first payment discount`
