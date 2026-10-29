<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use YooKassa\Common\Exceptions\ApiException;
use YooKassa\Common\Exceptions\BadApiRequestException;
use YooKassa\Common\Exceptions\ExtensionNotFoundException;
use YooKassa\Common\Exceptions\ForbiddenException;
use YooKassa\Common\Exceptions\InternalServerError;
use YooKassa\Common\Exceptions\NotFoundException;
use YooKassa\Common\Exceptions\ResponseProcessingException;
use YooKassa\Common\Exceptions\TooManyRequestsException;
use YooKassa\Common\Exceptions\UnauthorizedException;

final readonly class PaymentService
{
    /**
     * Принимает зависимости для работы PaymentService.
     *
     * @param PaymentCreator $paymentCreator
     * @param PaymentNotificationHandler $paymentNotificationHandler
     */
    public function __construct(
        private PaymentCreator $paymentCreator,
        private PaymentNotificationHandler $paymentNotificationHandler,
    ) {}

    /**
     * Передаёт webhook специализированному обработчику уведомлений.
     *
     * @param string $rawBody
     *
     * @return void
     *
     * @throws \JsonException
     * @throws \Throwable
     * @throws ApiException
     * @throws BadApiRequestException
     * @throws ExtensionNotFoundException
     * @throws ForbiddenException
     * @throws InternalServerError
     * @throws NotFoundException
     * @throws ResponseProcessingException
     * @throws TooManyRequestsException
     * @throws UnauthorizedException
     */
    public function handleNotification(string $rawBody): void
    {
        $this->paymentNotificationHandler->handle($rawBody);
    }

    /**
     * Передаёт создание платежа сервису с проверкой идемпотентности.
     *
     * @param User $user
     * @param Product $product
     * @param Promocode|null $promocode
     * @param PaymentSource|string $source
     * @param string|null $returnUrl
     * @param string|null $idempotencyKey
     *
     * @return Payment
     */
    public function createPayment(
        User $user,
        Product $product,
        ?Promocode $promocode = null,
        PaymentSource|string $source = PaymentSource::Web,
        ?string $returnUrl = null,
        ?string $idempotencyKey = null,
    ): Payment {
        return $this->paymentCreator->create(
            $user,
            $product,
            $promocode,
            $source,
            $returnUrl,
            $idempotencyKey,
        );
    }
}
