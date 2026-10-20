<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Services\Support\SupportConversationService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

final class StoreSupportMessageRequest extends FormRequest
{
    /**
     * Проверяет owner/operator channel по route, не принимая author от клиента.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        $actor = $this->user($this->routeIs('operator.support.*') ? 'moonshine' : 'web');
        return $actor !== null && Gate::forUser($actor)->allows('view', $this->route('ticket'));
    }

    /**
     * Проверяет текст и отдельный UUID новой отправки.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['body' => ['required', 'string', 'max:' . SupportConversationService::BODY_MAX], 'submission_id' => ['required', 'uuid']];
    }
}
