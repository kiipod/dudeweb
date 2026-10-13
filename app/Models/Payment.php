<?php

declare(strict_types=1);

namespace App\Models;

use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * App\Models\Payment
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $confirmation_url
 * @property PaymentStatus|null $status
 * @property int $amount
 * @property string $currency
 * @property string|null $description
 * @property array<array-key, mixed>|null $metadata
 * @property int|null $recipient_account_id
 * @property int|null $recipient_gateway_id
 * @property bool $refundable
 * @property bool $test
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $product_id
 * @property int|null $promocode_id
 * @property string|null $yookassa_payment_id
 * @property string $idempotency_key
 * @property PaymentSource $source
 * @property int $months
 * @property int $original_amount
 * @property Carbon|null $subscription_expires_at
 * @property Carbon|null $processed_at
 * @property Carbon|null $notified_at
 * @property string|null $processing_token
 * @property Carbon|null $processing_started_at
 * @property-read Product|null $product
 * @property-read Promocode|null $promocode
 * @property-read Collection<int, ReferralReward> $referralRewards
 * @property-read int|null $referral_rewards_count
 * @property-read User $user
 * @method static PaymentFactory factory($count = null, $state = [])
 * @method static Builder<static>|Payment newModelQuery()
 * @method static Builder<static>|Payment newQuery()
 * @method static Builder<static>|Payment query()
 * @method static Builder<static>|Payment whereAmount($value)
 * @method static Builder<static>|Payment whereConfirmationUrl($value)
 * @method static Builder<static>|Payment whereCreatedAt($value)
 * @method static Builder<static>|Payment whereCurrency($value)
 * @method static Builder<static>|Payment whereDescription($value)
 * @method static Builder<static>|Payment whereId($value)
 * @method static Builder<static>|Payment whereIdempotencyKey($value)
 * @method static Builder<static>|Payment whereMetadata($value)
 * @method static Builder<static>|Payment whereMonths($value)
 * @method static Builder<static>|Payment whereNotifiedAt($value)
 * @method static Builder<static>|Payment whereOriginalAmount($value)
 * @method static Builder<static>|Payment whereProcessedAt($value)
 * @method static Builder<static>|Payment whereProcessingStartedAt($value)
 * @method static Builder<static>|Payment whereProcessingToken($value)
 * @method static Builder<static>|Payment whereProductId($value)
 * @method static Builder<static>|Payment wherePromocodeId($value)
 * @method static Builder<static>|Payment whereRecipientAccountId($value)
 * @method static Builder<static>|Payment whereRecipientGatewayId($value)
 * @method static Builder<static>|Payment whereRefundable($value)
 * @method static Builder<static>|Payment whereSource($value)
 * @method static Builder<static>|Payment whereStatus($value)
 * @method static Builder<static>|Payment whereSubscriptionExpiresAt($value)
 * @method static Builder<static>|Payment whereTest($value)
 * @method static Builder<static>|Payment whereUpdatedAt($value)
 * @method static Builder<static>|Payment whereUserId($value)
 * @method static Builder<static>|Payment whereYookassaPaymentId($value)
 * @mixin \Eloquent
 */
#[Table('payments')]
#[UseFactory(PaymentFactory::class)]
class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'promocode_id',
        'yookassa_payment_id',
        'idempotency_key',
        'source',
        'months',
        'original_amount',
        'confirmation_url',
        'status',
        'subscription_expires_at',
        'processed_at',
        'notified_at',
        'processing_token',
        'processing_started_at',
        'amount',
        'currency',
        'description',
        'metadata',
        'recipient_account_id',
        'recipient_gateway_id',
        'refundable',
        'test',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'source' => PaymentSource::class,
        'status' => PaymentStatus::class,
        'subscription_expires_at' => 'datetime',
        'processed_at' => 'datetime',
        'notified_at' => 'datetime',
        'processing_started_at' => 'datetime',
        'months' => 'integer',
        'original_amount' => 'integer',
        'amount' => 'integer',
        'metadata' => 'array',
        'refundable' => 'boolean',
        'test' => 'boolean',
    ];

    /**
     * Метод возвращает пользователя совершившего платеж
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo
     */
    public function promocode(): BelongsTo
    {
        return $this->belongsTo(Promocode::class);
    }

    /**
     * Метод возвращает реферальные бонусы, связанные с этим платежом.
     *
     * @return HasMany
     */
    public function referralRewards(): HasMany
    {
        return $this->hasMany(ReferralReward::class);
    }
}
