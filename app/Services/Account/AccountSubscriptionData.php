<?php

declare(strict_types=1);

namespace App\Services\Account;

use App\Models\Payment;
use App\Models\User;

final readonly class AccountSubscriptionData
{
    /**
     * Принимает текущий provider reader и каталог без дублирования pricing rules.
     *
     * @param AccountDashboardData $dashboard
     * @param SubscriptionCatalogue $catalogue
     */
    public function __construct(private AccountDashboardData $dashboard, private SubscriptionCatalogue $catalogue) {}

    /**
     * Возвращает безопасные props подписки и ограниченную историю владельца.
     *
     * @param User $user
     *
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $current = $this->dashboard->forUser($user);
        $subscription = $current['subscription'];
        if ($subscription !== null) {
            unset($subscription['url']);
        }

        $payments = $user->payments()
            ->select(['id', 'user_id', 'product_id', 'status', 'amount', 'currency', 'months', 'created_at', 'processed_at'])
            ->with('product:id,plan_id,name', 'product.plan:id,name')
            ->orderByDesc('created_at')->orderByDesc('id')->paginate(10)
            ->through(static fn(Payment $payment): array => [
                'id' => $payment->id,
                'status' => $payment->status?->value === 'succeeded' && $payment->processed_at === null ? 'pending' : $payment->status?->value ?? 'pending',
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'months' => $payment->months,
                'planName' => $payment->product?->plan?->name,
                'createdAt' => $payment->created_at?->toIso8601String(),
                'url' => route('account.payments.show', $payment, false),
            ]);

        return [
            'subscription' => $subscription,
            'serviceState' => $current['serviceState'],
            'catalogue' => $this->catalogue->forUser($user),
            'payments' => $payments,
        ];
    }
}
