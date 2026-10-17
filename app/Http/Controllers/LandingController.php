<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\Landing\LandingPageData;
use Inertia\Inertia;
use Inertia\Response;

final class LandingController extends Controller
{
    /**
     * @param LandingPageData $data
     */
    public function __construct(private readonly LandingPageData $data) {}

    /**
     * @return Response
     */
    public function __invoke(): Response
    {
        return Inertia::render('Public/Home', $this->data->get());
    }
}
