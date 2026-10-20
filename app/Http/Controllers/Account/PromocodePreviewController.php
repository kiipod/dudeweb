<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Requests\PreviewPromocodeRequest;
use App\Services\Account\SubscriptionCatalogue;
use App\Services\PromocodeService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

final readonly class PromocodePreviewController
{
    /**
     * Принимает сервис проверки промокода и подготовки полного ценового snapshot.
     *
     * @param PromocodeService $promocodes
     * @param SubscriptionCatalogue $catalogue
     */
    public function __construct(private PromocodeService $promocodes, private SubscriptionCatalogue $catalogue) {}

    /**
     * Проверяет промокод без его расходования; null удаляет ручную скидку.
     *
     * @param PreviewPromocodeRequest $request
     *
     * @return JsonResponse
     *
     * @throws ValidationException
     */
    public function __invoke(PreviewPromocodeRequest $request): JsonResponse
    {
        $user = $request->user('web');
        $code = $request->validated('promocode');
        try {
            $promo = $code === null ? null : $this->promocodes->apply($code, $user);
            return response()->json($this->catalogue->forUser($user, $promo))->header('Cache-Control', 'no-store, private');
        } catch (DomainException $exception) {
            throw ValidationException::withMessages(['promocode' => $exception->getMessage()]);
        }
    }
}
