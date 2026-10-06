# **Неуспешные платежи**

В процессе платежа что-то может пойти не так. Например, пользователю может не хватить денег для оплаты, эмитент может быть недоступен, ЮKassa может заподозрить попытку мошенничества. В этом случае платеж будет отменен и перейдет в статус `canceled`.

Чтобы вы могли лучше понимать, что произошло и что с этим делать, ЮKassa пришлет в [объекте платежа](https://yookassa.ru/developers/api#payment_object) комментарий к отмене платежа (`cancellation_details`). В нём будут указаны инициатор (`cancellation_details.party`) и причина отмены (`cancellation_details.reason`). Вы можете использовать эти данные для анализа и решения проблем, вывода сообщений пользователю и любых других целей.

## **Инициаторы отмены платежа**

| **Значение** | **Описание** |
| :--- | :--- |
| `merchant` | Продавец товаров и услуг (вы) |
| `yoo_money` | ЮKassa |
| `payment_network` | Любые участники процесса платежа, кроме ЮKassa и вас (например, эмитент, сторонний платежный сервис) |

## **Причины отмены платежа**

| **Значение** | **Описание** |
| :--- | :--- |
| `3d_secure_failed` | Не пройдена аутентификация по 3-D Secure. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует пройти аутентификацию, использовать другое платежное средство или обратиться в банк за уточнениями |
| `call_issuer` | Оплата данным платежным средством отклонена по неизвестным причинам. Пользователю следует обратиться в организацию, выпустившую платежное средство |
| `canceled_by_merchant` | [Платеж отменен по API](https://yookassa.ru/developers/payment-acceptance/getting-started/payment-process#cancel) при оплате в две стадии |
| `card_expired` | Истек срок действия банковской карты. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство |
| `country_forbidden` | Нельзя заплатить банковской картой, выпущенной в этой стране. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство.<br>Вы можете [настроить ограничения на оплату иностранными банковскими картами](https://yookassa.ru/docs/support/merchant/payments/details#details__non-rus-cards) |
| `deal_expired` | Для тех, кто использует [Безопасную сделку](https://yookassa.ru/developers/solutions-for-platforms/safe-deal/basics): закончился срок жизни сделки. Если вы еще хотите принять оплату, создайте новую сделку и проведите для нее новый платеж |
| `expired_on_capture` | [Истек срок списания оплаты](https://yookassa.ru/developers/payment-acceptance/getting-started/payment-process#hold) у двухстадийного платежа. Если вы еще хотите принять оплату, [повторите платеж](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) с новым ключом идемпотентности и спишите деньги после подтверждения платежа пользователем |
| `expired_on_confirmation` | [Истек срок оплаты](https://yookassa.ru/developers/payment-acceptance/getting-started/payment-process#user-confirmation): пользователь не завершил оплату за время, отведенное на платеж выбранным способом. Если пользователь еще хочет заплатить, вам необходимо [повторить платеж](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) с новым ключом идемпотентности, а пользователю — завершить оплату. |
| `fraud_suspected` | Платеж заблокирован из-за подозрения в мошенничестве. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство |
| `general_decline` | Причина не детализирована. Пользователю следует обратиться к [инициатору отмены платежа](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#cancellation-details-party) за уточнением подробностей |
| `identification_required` | Превышены ограничения на платежи для кошелька ЮMoney. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует [идентифицировать кошелек](https://yoomoney.ru/page?id=536136) или выбрать другое платежное средство |
| `insufficient_funds` | Не хватает денег для оплаты. Пользователю следует пополнить баланс или использовать другое платежное средство |
| `internal_timeout` | Технические неполадки на стороне ЮKassa: не удалось [обработать запрос](https://yookassa.ru/developers/using-api/interaction-format#sync) в течение 30 секунд. [Повторите платеж](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) с новым ключом идемпотентности |
| `invalid_card_number` | Неправильно указан номер карты. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует ввести корректные данные |
| `invalid_csc` | Неправильно указан код CVV2 (CVC2, CID). При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует ввести корректные данные |
| `issuer_unavailable` | Организация, выпустившая платежное средство, недоступна. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство или повторить оплату позже |
| `loan_application_expired` | Истек срок заполнения заявки на кредит или рассрочку: пользователь не заполнил заявку за отведенное на это время. Если пользователь еще хочет заплатить, вам необходимо повторить платеж с новым ключом идемпотентности, а пользователю — заново заполнить заявку |
| `loan_declined` | Заявка на кредит или рассрочку отклонена банком. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство или обратиться в банк за уточнениями |
| `loan_declined_by_payer` | Пользователь отказался от кредита или рассрочки во время периода [охлаждения](https://yookassa.ru/docs/support/payments/credit-purchases-by-sberbank-with-cooling-off). Если пользователь еще хочет заплатить, вам необходимо повторить платеж с новым ключом идемпотентности, а пользователю — дождаться завершения периода охлаждения |
| `payment_method_limit_exceeded` | Исчерпан лимит платежей для данного платежного средства или вашего магазина. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство или повторить оплату на следующий день |
| `payment_method_restricted` | Запрещены операции данным платежным средством (например, карта заблокирована из-за утери, кошелек — из-за взлома мошенниками). Пользователю следует обратиться в организацию, выпустившую платежное средство |
| `permission_revoked` | Нельзя провести безакцептное списание: пользователь отозвал разрешение на [автоплатежи](https://yookassa.ru/developers/payment-acceptance/scenario-extensions/recurring-payments/basics). Если пользователь еще хочет оплатить, вам необходимо создать новый платеж, а пользователю — подтвердить оплату |
| `unsupported_mobile_operator` | Нельзя заплатить с номера телефона этого мобильного оператора. При [новой попытке оплаты](https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments#repeat-after-decline) пользователю следует использовать другое платежное средство. [Список поддерживаемых операторов](https://yookassa.ru/docs/support/payments/accept-methods#carrier-billing) |

Статус `canceled` — финальный и неизменяемый. Чтобы повторить платеж, вам нужно [создать новый объект платежа](https://yookassa.ru/developers/api#create_payment) с новым [ключом идемпотентности](https://yookassa.ru/developers/using-api/interaction-format#idempotence).

## **Пример объекта платежа в статусе `canceled`**

```json
{
  "id": "22979b7b-000f-5000-9000-1a603a795739",
  "status": "canceled",
  "paid": false,
  "amount": {
    "value": "2.00",
    "currency": "RUB"
  },
  "created_at": "2018-05-23T15:24:43.812Z",
  "metadata": {},
  "payment_method": {
    "type": "bank_card",
    "id": "22979b7b-000f-5000-9000-1a603a795739",
    "saved": false
  },
  "recipient": {
    "account_id": "100500",
    "gateway_id": "100700"
  },
  "refundable": false,
  "test": false,
  "cancellation_details": {
    "party": "payment_network",
    "reason": "payment_method_restricted"
  }
}
```
