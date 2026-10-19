<?php

declare(strict_types=1);

namespace App\Payment\Enums;

enum PaymentCancellationReason: string
{
    case ThreeDSecureFailed = '3d_secure_failed';
    case CallIssuer = 'call_issuer';
    case CanceledByMerchant = 'canceled_by_merchant';
    case CardExpired = 'card_expired';
    case CountryForbidden = 'country_forbidden';
    case DealExpired = 'deal_expired';
    case ExpiredOnCapture = 'expired_on_capture';
    case ExpiredOnConfirmation = 'expired_on_confirmation';
    case FraudSuspected = 'fraud_suspected';
    case GeneralDecline = 'general_decline';
    case IdentificationRequired = 'identification_required';
    case InsufficientFunds = 'insufficient_funds';
    case InternalTimeout = 'internal_timeout';
    case InvalidCardNumber = 'invalid_card_number';
    case InvalidCsc = 'invalid_csc';
    case IssuerUnavailable = 'issuer_unavailable';
    case LoanApplicationExpired = 'loan_application_expired';
    case LoanDeclined = 'loan_declined';
    case LoanDeclinedByPayer = 'loan_declined_by_payer';
    case PaymentMethodLimitExceeded = 'payment_method_limit_exceeded';
    case PaymentMethodRestricted = 'payment_method_restricted';
    case PermissionRevoked = 'permission_revoked';
    case UnsupportedMobileOperator = 'unsupported_mobile_operator';

    /**
     * Возвращает безопасное объяснение причины отмены для пользователя.
     *
     * @return string
     */
    public function message(): string
    {
        return match ($this) {
            self::ThreeDSecureFailed
                => 'Не удалось пройти проверку 3-D Secure. Повторите оплату, внимательно завершите проверку банка или используйте другое платёжное средство.',
            self::CallIssuer
                => 'Банк отклонил оплату без уточнения причины. Обратитесь в банк или используйте другое платёжное средство.',
            self::CanceledByMerchant
                => 'Платёж отменён магазином. Если отмена была неожиданной, обратитесь в поддержку.',
            self::CardExpired => 'Срок действия карты истёк. Используйте другую карту или другое платёжное средство.',
            self::CountryForbidden
                => 'Карта, выпущенная в этой стране, не поддерживается. Используйте другое платёжное средство.',
            self::DealExpired => 'Срок действия сделки истёк. Создайте новую попытку оплаты.',
            self::ExpiredOnCapture
                => 'Истёк срок списания оплаты. Создайте новую попытку и завершите её после подтверждения.',
            self::ExpiredOnConfirmation
                => 'Истёк срок подтверждения оплаты. Создайте новую попытку и завершите её вовремя.',
            self::FraudSuspected => 'Платёж отклонён системой безопасности. Используйте другое платёжное средство.',
            self::GeneralDecline => 'Платёж отклонён без уточнения причины.',
            self::IdentificationRequired
                => 'Для кошелька ЮMoney требуется идентификация. Пройдите её или используйте другое платёжное средство.',
            self::InsufficientFunds
                => 'Недостаточно средств. Пополните баланс или используйте другое платёжное средство.',
            self::InternalTimeout => 'ЮKassa не успела обработать платёж. Создайте новую попытку оплаты.',
            self::InvalidCardNumber => 'Номер карты указан неверно. Повторите оплату с корректными данными.',
            self::InvalidCsc => 'Код CVC/CVV указан неверно. Повторите оплату с корректными данными.',
            self::IssuerUnavailable
                => 'Банк временно недоступен. Попробуйте позже или используйте другое платёжное средство.',
            self::LoanApplicationExpired
                => 'Истёк срок заполнения заявки на кредит или рассрочку. Создайте новую попытку и заполните заявку заново.',
            self::LoanDeclined
                => 'Банк отклонил заявку на кредит или рассрочку. Обратитесь в банк или используйте другое платёжное средство.',
            self::LoanDeclinedByPayer
                => 'Вы отказались от кредита или рассрочки. После периода охлаждения можно создать новую попытку оплаты.',
            self::PaymentMethodLimitExceeded
                => 'Достигнут лимит платежей. Используйте другое платёжное средство или повторите оплату позже.',
            self::PaymentMethodRestricted
                => 'Операции этим платёжным средством запрещены. Обратитесь в выпустившую его организацию или используйте другое.',
            self::PermissionRevoked => 'Разрешение на списание отозвано. Создайте новый платёж и подтвердите его.',
            self::UnsupportedMobileOperator
                => 'Этот мобильный оператор не поддерживается. Используйте другое платёжное средство.',
        };
    }

    /**
     * Определяет, можно ли предложить повторную оплату после отмены.
     *
     * @return bool
     */
    public function retryAllowed(): bool
    {
        return $this !== self::CanceledByMerchant;
    }
}
