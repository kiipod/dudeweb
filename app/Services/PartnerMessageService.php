<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\ChatMessageType;
use App\Models\ReferralBonus;

final class PartnerMessageService
{
    /**
     * @param MessageTemplateService $messageTemplateService
     */
    public function __construct(
        private readonly MessageTemplateService $messageTemplateService,
    ) {}

    /**
     * @param string $partnerLink
     * @param int $referredUsers
     * @param int $referredBonusDays
     * @return string
     */
    public function overview(string $partnerLink, int $referredUsers, int $referredBonusDays): string
    {
        $referralBonus = ReferralBonus::query()
            ->orderBy('paid_months')
            ->get()
            ->map(
                fn(ReferralBonus $bonus): string => sprintf(
                    '- Друг оплатил %d %s *+%d %s*',
                    $bonus->paid_months,
                    $this->pluralize(
                        $bonus->paid_months,
                        'месяц',
                        'месяца',
                        'месяцев',
                    ),
                    $bonus->bonus_days,
                    $this->pluralize(
                        $bonus->bonus_days,
                        'день',
                        'дня',
                        'дней',
                    ),
                ),
            )
            ->implode("\n");

        return $this->messageTemplateService->getFormattedMessage(
            ChatMessageType::Partners->value,
            [
                'referral_bonus' => $referralBonus,
                'partner_link' => $partnerLink,
                'referred_users' => $referredUsers,
                'referred_bonus_days' => $referredBonusDays,
            ],
        );
    }

    /**
     * @param int $value
     * @param string $one
     * @param string $few
     * @param string $many
     * @return string
     */
    private function pluralize(int $value, string $one, string $few, string $many): string
    {
        $mod10 = $value % 10;
        $mod100 = $value % 100;

        if ($mod10 === 1 && $mod100 !== 11) {
            return $one;
        }

        if ($mod10 >= 2 && $mod10 <= 4 && ($mod100 < 12 || $mod100 > 14)) {
            return $few;
        }

        return $many;
    }
}
