<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Requests\StoreSupportMessageRequest;
use App\Http\Requests\StoreSupportTicketRequest;
use App\Models\SupportTicket;
use App\Services\Support\SupportConversationService;
use App\Services\Support\SupportData;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final readonly class SupportController
{
    /**
     * Принимает read model и общий domain service.
     *
     * @param SupportData $data
     * @param SupportConversationService $conversations
     */
    public function __construct(private SupportData $data, private SupportConversationService $conversations) {}

    /**
     * Показывает только собственный список обращений.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', SupportTicket::class);
        try {
            $props = $this->data->listing($request->user('web'));
        } catch (Throwable $exception) {
            Log::warning('Support list read failed.', ['exception' => $exception::class]);
            $props = ['serviceState' => 'error', 'tickets' => ['data' => [], 'links' => []]];
        }
        return $this->page($request, 'Index', $props);
    }

    /**
     * Показывает форму с server-owned limits и UUID.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', SupportTicket::class);
        return $this->page($request, 'Create', $this->data->form());
    }

    /**
     * Создаёт ticket и первое сообщение одной domain operation.
     *
     * @param StoreSupportTicketRequest $request
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function store(StoreSupportTicketRequest $request): RedirectResponse
    {
        return $this->mutation(function () use ($request): RedirectResponse {
            $data = $request->validated();
            $ticket = $this->conversations->create($request->user('web'), $data['subject'], $data['body'], $data['submission_id']);
            return redirect()->route('account.support.show', $ticket);
        });
    }

    /**
     * Авторизует owner до чтения oldest-first conversation.
     *
     * @param Request $request
     * @param SupportTicket $ticket
     *
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function show(Request $request, SupportTicket $ticket): Response
    {
        Gate::authorize('view', $ticket);
        try {
            $props = $this->data->conversation($ticket);
        } catch (Throwable $exception) {
            Log::warning('Support conversation read failed.', ['exception' => $exception::class]);
            $props = ['serviceState' => 'error', 'ticket' => null, 'messages' => ['data' => [], 'links' => []], ...$this->data->form()];
        }
        return $this->page($request, 'Show', $props);
    }

    /**
     * Сохраняет customer reply без optimistic message.
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
        return $this->mutation(function () use ($request, $ticket): RedirectResponse {
            $data = $request->validated();
            $this->conversations->reply($request->user('web'), $ticket, $data['body'], $data['submission_id']);
            $page = $this->data->lastMessagePage($ticket);
            return redirect()->route('account.support.show', ['ticket' => $ticket, ...($page > 1 ? ['page' => $page] : [])]);
        });
    }

    /**
     * Исключает customer text и database details из errors/log context.
     *
     * @param Closure(): RedirectResponse $operation
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    private function mutation(Closure $operation): RedirectResponse
    {
        try {
            return $operation();
        } catch (AuthorizationException|ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::warning('Support mutation failed.', ['exception' => $exception::class]);
            return back()->withInput()->withErrors(['form' => 'Не удалось отправить сообщение. Попробуй ещё раз.']);
        }
    }

    /**
     * Защищает support history и отключает shared-cache storage.
     *
     * @param Request $request
     * @param string $component
     * @param array<string, mixed> $props
     *
     * @return Response
     */
    private function page(Request $request, string $component, array $props): Response
    {
        Inertia::encryptHistory();
        $response = Inertia::render('Account/Support/' . $component, $props)->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');
        return $response;
    }
}
