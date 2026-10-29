<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Payment\Enums\PaymentCancellationParty;
use App\Payment\Enums\PaymentCancellationReason;
use App\Payment\PaymentCancellationResolver;
use PHPUnit\Framework\TestCase;

final class PaymentCancellationResolverTest extends TestCase
{
    /**
     * Verify that known reason returns user message without technical value.
     *
     * @return void
     */
    public function test_known_reason_returns_user_message_without_technical_value(): void
    {
        $cancellation = new PaymentCancellationResolver()->resolveValues(
            PaymentCancellationParty::PaymentNetwork->value,
            PaymentCancellationReason::InsufficientFunds->value,
        );

        self::assertSame(PaymentCancellationParty::PaymentNetwork, $cancellation->party);
        self::assertSame(PaymentCancellationReason::InsufficientFunds, $cancellation->reason);
        self::assertSame(
            'Недостаточно средств. Пополните баланс или используйте другое платёжное средство.',
            $cancellation->message,
        );
        self::assertStringNotContainsString('insufficient_funds', $cancellation->message);
        self::assertTrue($cancellation->retryAllowed);
    }

    /**
     * Verify that general decline uses party for recommended action.
     *
     * @return void
     */
    public function test_general_decline_uses_party_for_recommended_action(): void
    {
        $cancellation = new PaymentCancellationResolver()->resolveValues(
            PaymentCancellationParty::PaymentNetwork->value,
            PaymentCancellationReason::GeneralDecline->value,
        );

        self::assertStringContainsString('банк или платёжный сервис', $cancellation->message);
    }

    /**
     * Verify that unknown reason uses safe retryable fallback.
     *
     * @return void
     */
    public function test_unknown_reason_uses_safe_retryable_fallback(): void
    {
        $cancellation = new PaymentCancellationResolver()->resolveValues(
            'future_party',
            'future_reason',
        );

        self::assertNull($cancellation->party);
        self::assertNull($cancellation->reason);
        self::assertStringNotContainsString('future_reason', $cancellation->message);
        self::assertTrue($cancellation->retryAllowed);
    }

    /**
     * Verify that missing details use safe retryable fallback.
     *
     * @return void
     */
    public function test_missing_details_use_safe_retryable_fallback(): void
    {
        $cancellation = new PaymentCancellationResolver()->resolve(null);

        self::assertNull($cancellation->party);
        self::assertNull($cancellation->reason);
        self::assertNotSame('', $cancellation->message);
        self::assertTrue($cancellation->retryAllowed);
    }

    /**
     * Verify that every documented reason has a user message.
     *
     * @return void
     */
    public function test_every_documented_reason_has_a_user_message(): void
    {
        foreach (PaymentCancellationReason::cases() as $reason) {
            $cancellation = new PaymentCancellationResolver()->resolveValues(
                PaymentCancellationParty::PaymentNetwork->value,
                $reason->value,
            );

            self::assertNotSame('', $cancellation->message, $reason->value);
            self::assertStringNotContainsString($reason->value, $cancellation->message);
        }
    }

    /**
     * Verify that merchant cancellation does not offer automatic retry.
     *
     * @return void
     */
    public function test_merchant_cancellation_does_not_offer_automatic_retry(): void
    {
        $cancellation = new PaymentCancellationResolver()->resolveValues(
            PaymentCancellationParty::Merchant->value,
            PaymentCancellationReason::CanceledByMerchant->value,
        );

        self::assertFalse($cancellation->retryAllowed);
    }
}
