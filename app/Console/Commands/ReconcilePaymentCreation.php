<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Payment;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Payment\PaymentService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use YooKassa\Client;

final class ReconcilePaymentCreation extends Command
{
    /** @var string */
    protected $signature = 'payments:reconcile-creation {payment} {--provider-id=} {--confirmed-absent} {--reason=}';

    /** @var string */
    protected $description = 'Reconcile a failed creation using verified provider identity or explicit operator evidence of absence';

    /**
     * Resolves only a reserved, unclaimed failed creation without guessing from age.
     *
     * @param Client $client
     * @param PaymentService $payments
     *
     * @return int
     *
     * @throws \Throwable
     */
    public function handle(Client $client, PaymentService $payments): int
    {
        $providerId = trim((string) $this->option('provider-id'));
        $absent = (bool) $this->option('confirmed-absent');
        $reason = trim((string) $this->option('reason'));
        if (($providerId !== '') === $absent || $reason === '') {
            $this->error('Choose exactly one: --provider-id or --confirmed-absent; supply --reason with an audit reference, without secrets.');
            return self::FAILURE;
        }
        $payment = Payment::query()->findOrFail($this->argument('payment'));
        $remote = $providerId === '' ? null : $client->getPaymentInfo($providerId);
        if ($remote !== null) {
            $metadata = $remote->getMetadata()?->toArray() ?? [];
            if ($remote->getId() !== $providerId
                || (string) ($metadata['payment_id'] ?? '') !== (string) $payment->id
                || (string) ($metadata['user_id'] ?? '') !== (string) $payment->user_id
                || (string) ($metadata['product_id'] ?? '') !== (string) $payment->product_id
                || ($metadata['source'] ?? null) !== $payment->source->value
                || $remote->getAmount()?->getIntegerValue() !== $payment->amount
                || $remote->getAmount()?->getCurrency() !== $payment->currency
                || !in_array($remote->getStatus(), ['pending', 'succeeded', 'canceled'], true)) {
                $this->error('Provider payment does not match the reserved invoice.');
                return self::FAILURE;
            }
        } elseif (!$absent) {
            $this->error('Provider did not confirm the payment.');
            return self::FAILURE;
        }
        DB::transaction(function () use ($payment, $providerId, $absent, $reason): void {
            $user = User::query()->lockForUpdate()->findOrFail($payment->user_id);
            $locked = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            if ($user->telegram_merge_id !== null || $locked->user_id !== $user->id
                || $locked->status !== PaymentStatus::Pending || $locked->yookassa_payment_id !== null
                || $locked->processing_token !== null) {
                throw new \DomainException('Invoice is not an unresolved failed creation.');
            }
            $locked->update([
                'yookassa_payment_id' => $absent ? null : $providerId,
                'status' => $absent ? PaymentStatus::Canceled : PaymentStatus::Pending,
                'creation_resolution' => ['outcome' => $absent ? 'operator-confirmed-absent' : 'provider-verified', 'reason' => $reason, 'at' => now()->toIso8601String()],
            ]);
        });
        if ($remote !== null && in_array($remote->getStatus(), ['succeeded', 'canceled'], true)) {
            $payments->handleNotification(json_encode([
                'type' => 'notification', 'event' => 'payment.' . $remote->getStatus(), 'object' => $remote->toArray(),
            ], JSON_THROW_ON_ERROR));
        }
        $this->info('Payment creation reconciled.');
        return self::SUCCESS;
    }
}
