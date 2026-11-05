<?php

declare(strict_types=1);

namespace App\Remnawave\Exceptions;

use Exception;
use Throwable;

class ApiException extends Exception
{
    /**
     * Preserves provider cooldown metadata without retaining response credentials.
     *
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     * @param int|null $retryAfterSeconds
     */
    public function __construct(string $message = '', int $code = 0, ?Throwable $previous = null, public readonly ?int $retryAfterSeconds = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
