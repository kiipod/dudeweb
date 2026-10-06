<?php

declare(strict_types=1);

namespace App\Payment;

use App\Payment\Enums\PaymentCancellationParty;
use App\Payment\Enums\PaymentCancellationReason;
use YooKassa\Model\CancellationDetailsInterface;

final class PaymentCancellationResolver
{
    /**
     * @param CancellationDetailsInterface|null $details
     * @return PaymentCancellation
     */
    public function resolve(?CancellationDetailsInterface $details): PaymentCancellation
    {
        return $this->resolveValues(
            $details?->getParty(),
            $details?->getReason(),
        );
    }

    /**
     * @param string|null $party
     * @param string|null $reason
     * @return PaymentCancellation
     */
    public function resolveValues(?string $party, ?string $reason): PaymentCancellation
    {
        $resolvedParty = $party === null ? null : PaymentCancellationParty::tryFrom($party);
        $resolvedReason = $reason === null ? null : PaymentCancellationReason::tryFrom($reason);

        if ($resolvedReason === null) {
            return new PaymentCancellation(
                party: $resolvedParty,
                reason: null,
                message: 'Платёж отменён. Создайте новую попытку оплаты или обратитесь в поддержку, если проблема повторится.',
                retryAllowed: true,
            );
        }

        $message = $resolvedReason->message();

        if ($resolvedReason === PaymentCancellationReason::GeneralDecline) {
            $message .= match ($resolvedParty) {
                PaymentCancellationParty::Merchant => ' Обратитесь в поддержку магазина за подробностями.',
                PaymentCancellationParty::YooMoney => ' Обратитесь в поддержку ЮKassa за подробностями.',
                PaymentCancellationParty::PaymentNetwork => ' Обратитесь в банк или платёжный сервис за подробностями.',
                null => ' Обратитесь в поддержку или банк за подробностями.',
            };
        }

        return new PaymentCancellation(
            party: $resolvedParty,
            reason: $resolvedReason,
            message: $message,
            retryAllowed: $resolvedReason->retryAllowed(),
        );
    }
}
