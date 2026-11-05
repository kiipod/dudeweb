<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final class LandingV2Controller extends Controller
{
    /**
     * Render the isolated Landing V2 page.
     *
     * @return Response
     */
    public function __invoke(): Response
    {
        return Inertia::render('Public/LandingV2');
    }
}
