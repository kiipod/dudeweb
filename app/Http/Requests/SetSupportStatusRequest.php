<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\SupportTicketStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

final class SetSupportStatusRequest extends FormRequest
{
    /**
     * Разрешает переход только авторизованному оператору.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        $actor = $this->user('moonshine');
        return $actor !== null && Gate::forUser($actor)->allows('transition', $this->route('ticket'));
    }

    /**
     * Ограничивает переход native enum статусами.
     *
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return ['status' => ['required', Rule::enum(SupportTicketStatus::class)]];
    }
}
