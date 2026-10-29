<?php

declare(strict_types=1);

namespace App\Http\Controllers\Operator;

use App\Enums\SupportTicketStatus;
use App\Http\Requests\SetSupportStatusRequest;
use App\Http\Requests\StoreSupportMessageRequest;
use App\Models\SupportTicket;
use App\MoonShine\Resources\SupportTicket\SupportTicketResource;
use App\Services\Support\SupportConversationService;
use App\Services\Support\SupportData;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

final readonly class SupportController
{
    /**
     * Принимает общий service без отдельной operator business logic.
     *
     * @param SupportConversationService $conversations
     * @param SupportTicketResource $resource
     * @param SupportData $data
     */
    public function __construct(private SupportConversationService $conversations, private SupportTicketResource $resource, private SupportData $data) {}

    /**
     * Записывает reply от текущего оператора; author из request игнорируется.
     *
     * @param StoreSupportMessageRequest $request
     * @param SupportTicket $ticket
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function reply(StoreSupportMessageRequest $request, SupportTicket $ticket): RedirectResponse
    {
        try {
            $data = $request->validated();
            $this->conversations->reply($request->user('moonshine'), $ticket, $data['body'], $data['submission_id']);
        } catch (AuthorizationException|ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::warning('Operator support reply failed.', ['exception' => $exception::class]);
            return back()->withInput()->withErrors(['form' => 'Не удалось отправить ответ. Попробуйте ещё раз.']);
        }
        return redirect()->to($this->resource->getDetailPageUrl($ticket->id, ['page' => $this->data->lastMessagePage($ticket)]))->with('support.saved', true);
    }

    /**
     * Меняет статус через тот же serialized domain service.
     *
     * @param SetSupportStatusRequest $request
     * @param SupportTicket $ticket
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function status(SetSupportStatusRequest $request, SupportTicket $ticket): RedirectResponse
    {
        try {
            $this->conversations->transition($request->user('moonshine'), $ticket, SupportTicketStatus::from($request->validated('status')));
        } catch (AuthorizationException|ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::warning('Operator support transition failed.', ['exception' => $exception::class]);
            return back()->withErrors(['form' => 'Не удалось изменить статус. Попробуйте ещё раз.']);
        }
        return redirect()->to($this->resource->getDetailPageUrl($ticket->id))->with('support.saved', true);
    }
}
