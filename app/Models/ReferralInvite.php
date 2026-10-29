<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ReferralInviteFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $token
 * @property int $remnawave_user_id
 */
#[UseFactory(ReferralInviteFactory::class)]
final class ReferralInvite extends Model
{
    /** @use HasFactory<ReferralInviteFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['token', 'remnawave_user_id'];

    /** @var array<string, string> */
    protected $casts = ['remnawave_user_id' => 'integer'];
}
