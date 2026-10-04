<?php

declare(strict_types=1);

namespace App\Models;

use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
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
 * @property string|null $status
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
 * @property-read Collection<int, ReferralReward> $referralRewards
 * @property-read int|null $referral_rewards_count
 * @property-read User $user
 * @method static Builder<static>|Payment newModelQuery()
 * @method static Builder<static>|Payment newQuery()
 * @method static Builder<static>|Payment query()
 * @method static Builder<static>|Payment whereAmount($value)
 * @method static Builder<static>|Payment whereConfirmationUrl($value)
 * @method static Builder<static>|Payment whereCreatedAt($value)
 * @method static Builder<static>|Payment whereCurrency($value)
 * @method static Builder<static>|Payment whereDescription($value)
 * @method static Builder<static>|Payment whereId($value)
 * @method static Builder<static>|Payment whereMetadata($value)
 * @method static Builder<static>|Payment whereRecipientAccountId($value)
 * @method static Builder<static>|Payment whereRecipientGatewayId($value)
 * @method static Builder<static>|Payment whereRefundable($value)
 * @method static Builder<static>|Payment whereStatus($value)
 * @method static Builder<static>|Payment whereTest($value)
 * @method static Builder<static>|Payment whereUpdatedAt($value)
 * @method static Builder<static>|Payment whereUserId($value)
 * @mixin Eloquent
 */
#[Table('payments')]
class Payment extends Model
{
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
