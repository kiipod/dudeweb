<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\SupportTicket;
use App\Services\Support\SupportConversationService;
use Illuminate\Foundation\Http\FormRequest;

final class StoreSupportTicketRequest extends FormRequest
{
    /**
     * Проверяет capability клиента через policy.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('create', SupportTicket::class) ?? false;
    }

    /**
     * Принимает только тему, текст и idempotency UUID.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['subject' => ['required', 'string', 'max:' . SupportConversationService::SUBJECT_MAX],
            'body' => ['required', 'string', 'max:' . SupportConversationService::BODY_MAX], 'submission_id' => ['required', 'uuid']];
    }
}
