<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Bot\Telegram\Enums\UserTags;
use App\Enums\ReferralRewardStatus;
use App\Enums\TelegramLinkState;
use App\Models\Payment;
use App\Models\Promocode;
use App\Models\ReferralInvite;
use App\Models\ReferralReward;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\TelegramAccountLink;
use App\Models\User;
use App\Models\UserPromocode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class AccountMergeOwnership
{
    /**
     * Переносит FK ownership атомарно после подтверждённого remote update.
     *
     * @param TelegramAccountLink $link
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function apply(TelegramAccountLink $link): void
    {
        DB::transaction(function () use ($link): void {
            $link->refresh();
            if ($link->state !== TelegramLinkState::RemoteApplied) {
                return;
            }
            $plan = $link->plan;
            $ids = array_values(array_filter([$plan['survivor_user_id'], $plan['loser_user_id']]));
            $users = User::query()->whereKey($ids)->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            $survivor = $users->get($plan['survivor_user_id']);
            $loser = $plan['loser_user_id'] === null ? null : $users->get($plan['loser_user_id']);
            $web = $users->get($plan['web_user_id']);
            if ($survivor === null || $web === null || ($plan['loser_user_id'] !== null && $loser === null)) {
                throw new \DomainException('Merge ownership changed before local commit.');
            }
            $credentials = [
                'email' => $web->email, 'email_verified_at' => $web->email_verified_at,
                'password' => $web->password, 'remember_token' => Str::random(60),
                'profile_username' => $web->profile_username ?? $survivor->profile_username,
                'referrer_user_id' => $this->referrer($survivor, $loser),
            ];
            $survivor->forceFill(['remnawave_user_id' => $plan['survivor_remote_id']])->save();
            if ($loser !== null) {
                $this->transfer($loser, $survivor);
                DB::table('password_reset_tokens')->whereIn('email', array_filter([$web->email, $loser->email, $survivor->email]))->delete();
                if (DB::getSchemaBuilder()->hasTable('sessions')) {
                    DB::table('sessions')->whereIn('user_id', $ids)->delete();
                }
                $loser->delete();
            }
            $survivor->forceFill([
                ...$credentials,
                'chat_id' => $link->telegram_chat_id, 'username' => $link->telegram_username,
                'is_premium' => $link->telegram_is_premium,
                'tags' => UserTags::tryFrom($plan['target_tag'] ?? '') ?? $survivor->tags,
                'telegram_merge_id' => $link->id,
            ])->save();
            $link->update(['user_id' => $survivor->id, 'state' => TelegramLinkState::LocalApplied]);
        });
    }

    /**
     * Сохраняет payments, invites, промокоды, referrals и переписку обеих identities.
     *
     * @param User $loser
     * @param User $survivor
     *
     * @return void
     */
    private function transfer(User $loser, User $survivor): void
    {
        if ($loser->remnawave_user_id !== null) {
            ReferralInvite::query()->where('remnawave_user_id', $loser->remnawave_user_id)
                ->update(['remnawave_user_id' => $survivor->remnawave_user_id]);
        }
        Payment::query()->where('user_id', $loser->id)->update(['user_id' => $survivor->id]);
        Promocode::query()->where('user_id', $loser->id)->update(['user_id' => $survivor->id]);
        UserPromocode::query()->where('user_id', $loser->id)->update(['user_id' => $survivor->id]);
        foreach (SupportTicket::query()->where('user_id', $loser->id)->lazyById(100) as $ticket) {
            if (SupportTicket::query()->where('user_id', $survivor->id)->where('submission_id', $ticket->submission_id)->exists()) {
                $ticket->submission_id = (string) Str::uuid();
            }
            $ticket->user_id = $survivor->id;
            $ticket->save();
        }
        SupportMessage::query()->where('customer_id', $loser->id)->update(['customer_id' => $survivor->id]);
        ReferralReward::query()->where('referrer_user_id', $loser->id)->update(['referrer_user_id' => $survivor->id]);
        ReferralReward::query()->where('referred_user_id', $loser->id)->update(['referred_user_id' => $survivor->id]);
        ReferralReward::query()->where('referrer_user_id', $survivor->id)->where('referred_user_id', $survivor->id)
            ->update(['status' => ReferralRewardStatus::Conflict->value, 'last_error' => 'Account merge would create self-referral.']);
        User::query()->where('referrer_user_id', $loser->id)->update(['referrer_user_id' => $survivor->id]);
        if (in_array($survivor->referrer_user_id, [$survivor->id, $loser->id], true)) {
            $survivor->referrer_user_id = null;
        }
        TelegramAccountLink::query()->where('user_id', $loser->id)->update(['user_id' => $survivor->id]);
        if (DB::getSchemaBuilder()->hasTable('notifications')) {
            DB::table('notifications')->where('notifiable_type', User::class)->where('notifiable_id', $loser->id)
                ->update(['notifiable_id' => $survivor->id]);
        }
    }

    /**
     * Сохраняет старейшую допустимую attribution, не создавая self/cyclic referrals.
     *
     * @param User $survivor
     * @param User|null $loser
     *
     * @return int|null
     */
    private function referrer(User $survivor, ?User $loser): ?int
    {
        $owners = array_filter([$survivor->id, $loser?->id]);
        foreach (array_filter([$survivor->referrer_user_id, $loser?->referrer_user_id]) as $candidate) {
            $seen = $owners;
            $id = $candidate;
            while ($id !== null && !in_array($id, $seen, true)) {
                $seen[] = $id;
                $id = User::query()->whereKey($id)->value('referrer_user_id');
            }
            if ($id === null) {
                return $candidate;
            }
        }
        return null;
    }
}
