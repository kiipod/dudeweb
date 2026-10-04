<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum SubscriptionType: string
{
    case XrayJson = 'XRAY_JSON';
    case XrayBase64 = 'XRAY_BASE64';
    case Mihomo = 'MIHOMO';
    case Stash = 'STASH';
    case Clash = 'CLASH';
    case Singbox = 'SINGBOX';
}
