<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\Payment
 *
 * @property string $id
 * @property string $order_id
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
 * @property-read Order $order
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
 * @method static Builder<static>|Payment whereMetadata($value)
 * @method static Builder<static>|Payment whereOrderId($value)
 * @method static Builder<static>|Payment whereRecipientAccountId($value)
 * @method static Builder<static>|Payment whereRecipientGatewayId($value)
 * @method static Builder<static>|Payment whereRefundable($value)
 * @method static Builder<static>|Payment whereStatus($value)
 * @method static Builder<static>|Payment whereTest($value)
 * @method static Builder<static>|Payment whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_id',
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
        'amount' => 'integer',
        'metadata' => 'array',
        'refundable' => 'boolean',
        'test' => 'boolean',
    ];

    /**
     * Метод возвращает заказ платежа
     *
     * @return BelongsTo
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
