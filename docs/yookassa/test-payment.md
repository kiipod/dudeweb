# Тестирование платежей

В этой статье описано, как проверять платежи в тестовом режиме ЮKassa. При использовании тестового режима всё проходит так же, как при настоящих платежах, но деньги никуда не переводятся.

## О тестовом режиме

Тестовый режим доступен сразу после регистрации в личном кабинете ЮKassa — вы можете протестировать платежи в любой момент, даже до указания данных компании и заключения договора.

Чтобы использовать тестовый режим, нужно зарегистрироваться в личном кабинете ЮKassa и создать тестовый магазин.

В тестовом режиме доступны все основные возможности API, даже те, которые для настоящего магазина нужно подключать через менеджера ЮKassa.

### Особенности использования тестового режима

- Для аутентификации запросов необходимо использовать идентификатор и секретный ключ тестового магазина.
- В запросах необходимо передавать специальные тестовые данные — они зависят от того, какую функциональность вы проверяете.
- В объектах платежей, созданных для тестового магазина, параметр `test` принимает значение `true`.

## Пример тестового платежа

```json
{
  "id": "23d93cac-000f-5000-8000-126628f15141",
  "status": "pending",
  "paid": false,
  "amount": {
    "value": "2.00",
    "currency": "RUB"
  },
  "confirmation": {
    "type": "redirect",
    "confirmation_url": "https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=23d93cac-000f-5000-8000-126628f15141"
  },
  "created_at": "2019-01-22T14:30:45.129Z",
  "description": "Заказ №1",
  "metadata": {},
  "recipient": {
    "account_id": "100500",
    "gateway_id": "100700"
  },
  "refundable": false,
  "test": true
}
```

## Что можно протестировать

Вы можете протестировать платежи [банковской картой](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-bank-card) и [кошельком ЮMoney](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-yoo-money). Остальные способы оплаты можно протестировать только в настоящем магазине.

В тестовом магазине доступны:

- все базовые возможности API, например [платежи](https://yookassa.ru/developers/payment-acceptance/overview), [возвраты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/refunds), [входящие уведомления](https://yookassa.ru/developers/using-api/webhooks) и [отправка чеков](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#54fz);
- все [сценарии интеграции](https://yookassa.ru/developers/payment-acceptance/getting-started/selecting-integration-scenario), доступные для выбранного способа оплаты;
- большинство опций, которые расширяют сценарии использования API ЮKassa, например [автоплатежи](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-recurrent).

### Доступность функциональности

| Функциональность для тестирования | Кошелек ЮMoney | Банковская карта |
| --- | :---: | :---: |
| **Сценарии интеграции** | | |
| [Самостоятельная интеграция](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/manual-integration/basics) | ✅ — оплата на [странице ЮKassa](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/manual-integration/yoo-money) | ✅ — оплата на [странице ЮKassa](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/manual-integration/bank-card#create-payment-redirect) или на [вашей странице](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/manual-integration/bank-card#create-payment-with-card-data). Для настоящих платежей нужен сертификат [PCI DSS](https://ru.wikipedia.org/wiki/PCI_DSS). |
Для тестирования платежей банковской картой и автоплатежей нужны специальные тестовые данные:

- [Платежи банковской картой](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-bank-card-data)
- [Автоплатежи](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-recurrent)

## Тестовый магазин

Создать тестовый магазин можно до регистрации в ЮKassa и после.

## Оплата банковской картой

### Тестовые банковские карты

Настоящие карты нельзя использовать в тестовом магазине. Вместо них проверяйте оплату с помощью тестовых карт.

Ниже приведены тестовые карты, которые относятся к разным платежным системам. Для тестирования выбирайте любую карту. В качестве срока действия укажите любую дату больше текущей, CVC и код для прохождения 3-D Secure — любые числа.

### Проверка успешных сценариев

> При [тестировании автоплатежей](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-recurrent) выбирайте тестовые карты без 3-D Secure, иначе повторный платеж не пройдет.

Вы можете проверить оплату банковскими картами разных платежных систем:

| Номер | Тип карты | 3-D Secure |
| --- | --- | :---: |
| `5555555555554477` | Mastercard | ✔️ |
| `5555555555554444` | Mastercard | ➖ |
| `6759649826438453` | Maestro | ➖ |
| `4793128161644804` | Visa | ✔️ |
| `4111111111111111` | Visa | ➖ |
| `4175001000000017` | Visa Electron | ➖ |
| `2200000000000004` | Mir | ✔️ |
| `2202474301322987` | Mir | ➖ |
| `370000000000002` | American Express | ➖ |
| `3528000700000000` | JCB | ➖ |
| `36700102000000` | Diners Club | ➖ |

### Проверка неуспешных сценариев

Если вы хотите проверить значение параметра `cancellation_details` при [неуспешных платежах](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#cancellation-details-reason), используйте специальные тестовые карты разных платежных систем.

#### Отмена транзакции «внешними» участниками платежного процесса (`payment_network`)

| Номер карты | Причина отмены платежа |
| --- | --- |
| `5555555555554592` (Mastercard)<br>`4839665499603842` (Visa)<br>`2200000000000012` (Mir) | `3d_secure_failed` |
| `5555555555554535` (Mastercard)<br>`4926946416239025` (Visa)<br>`2200000000000020` (Mir) | `call_issuer` |
| `5555555555554543` (Mastercard)<br>`4141435412630840` (Visa)<br>`2200000000000038` (Mir) | `card_expired` |
| `5555555555554568` (Mastercard)<br>`4483274282299972` (Visa)<br>`2200000000000046` (Mir) | `fraud_suspected` |
| `5555555555554527` (Mastercard)<br>`4889971706588753` (Visa)<br>`2202202212312379` (Mir) | `general_decline` |
| `5555555555554600` (Mastercard)<br>`4562265587712390` (Visa)<br>`2200000000000053` (Mir) | `insufficient_funds` |
| `5555555555554618` (Mastercard)<br>`4951017853630544` (Visa)<br>`2201382000000013` (Mir) | `invalid_card_number` |
| `5555555555554626` (Mastercard)<br>`4194180666146368` (Visa)<br>`2200770212727079` (Mir) | `invalid_csc` |
| `5555555555554501` (Mastercard)<br>`4654130848359150` (Visa)<br>`2201382000000021` (Mir) | `issuer_unavailable` |
| `5555555555554576` (Mastercard)<br>`4565231022577548` (Visa)<br>`2201382000000039` (Mir) | `payment_method_limit_exceeded` |
| `5555555555554550` (Mastercard)<br>`4233961169071671` (Visa)<br>`2201382000000047` (Mir) | `payment_method_restricted` |

#### Отмена транзакции на стороне ЮKassa (`yoo_money`)

| Номер карты | Причина отмены платежа |
| --- | --- |
| `5555555555554584` (Mastercard)<br>`4969751510013864` (Visa)<br>`2201382000000054` (Mir) | `country_forbidden` |
| `5555555555554634` (Mastercard)<br>`4119098878796485` (Visa)<br>`2201696981989955` (Mir) | `fraud_suspected` |

## Оплата из кошелька ЮMoney

Для тестирования оплаты из кошелька ЮMoney **тестовый кошелек не понадобится**: в тестовом магазине платежи проходят без участия реального кошелька.

Чтобы протестировать оплату, проводите платеж как обычно. При оплате выберите кошелек ЮMoney и на отобразившейся платежной форме нажмите **Заплатить**. Платеж завершится успешно.

Если вы используете сценарий интеграции [Виджет ЮKassa](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget/basics), на платежной форме будет доступна только оплата банковской картой. Кошелек ЮMoney также будет отображаться на платежной форме, но его нельзя использовать для оплаты.
'''
