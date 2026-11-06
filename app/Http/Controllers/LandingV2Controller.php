<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\Landing\LandingPageData;
use Inertia\Inertia;
use Inertia\Response;

final class LandingV2Controller extends Controller
{
    /**
     * Render the isolated Landing V2 page.
     *
     * @param LandingPageData $data
     *
     * @return Response
     */
    public function __invoke(LandingPageData $data): Response
    {
        return Inertia::render('Public/LandingV2', $data->get());
    }
}
