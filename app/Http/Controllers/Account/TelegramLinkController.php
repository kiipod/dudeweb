<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Enums\TelegramLinkState;
use App\Http\Requests\TelegramLinkRequest;
use App\Models\TelegramAccountLink;
use App\Models\User;
use App\Services\Profile\TelegramAccountMerger;
use App\Services\Profile\TelegramLinkService;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final readonly class TelegramLinkController
{
    /**
     * Принимает proof boundary и durable merger, явно выбирает web guard.
     *
     * @param TelegramLinkService $links
     * @param TelegramAccountMerger $merger
     * @param StatefulGuard $guard
     */
    public function __construct(
        private TelegramLinkService $links,
        private TelegramAccountMerger $merger,
        #[Auth('web')]
        private StatefulGuard $guard,
    ) {}

    /**
     * Открывает private bot deep link после CSRF-защищённого POST.
     *
     * @param TelegramLinkRequest $request
     *
     * @return Response
     *
     * @throws Throwable
     */
    public function start(TelegramLinkRequest $request): Response
    {
        return Inertia::location($this->links->start($request->user('web'), $request->session()->getId()));
    }

    /**
     * Завершает подтверждённую привязку, сохраняя текущий web login при смене survivor.
     *
     * @param TelegramLinkRequest $request
     *
     * @return RedirectResponse
     *
     * @throws ValidationException
     */
    public function confirm(TelegramLinkRequest $request): RedirectResponse
    {
        $link = TelegramAccountLink::query()->where('user_id', $request->user('web')->id)->findOrFail($request->integer('link_id'));
        try {
            $this->merger->finish($request->user('web'), $link->id, $request->session()->getId());
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            $this->adoptSurvivor($request, $link);
            Log::warning('Telegram account merge needs retry.', ['link_id' => $link->id, 'exception' => $exception::class]);
            return redirect()->route('account.profile')->withErrors(['telegram' => 'Не удалось завершить привязку. Сохранённый этап можно безопасно повторить.']);
        }
        $this->adoptSurvivor($request, $link);
        Inertia::clearHistory();
        return redirect()->route('account.profile');
    }

    /**
     * Отменяет own unused challenge; начатый merge требует завершения, не удаления.
     *
     * @param TelegramLinkRequest $request
     *
     * @return RedirectResponse
     *
     * @throws Throwable
     */
    public function cancel(TelegramLinkRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $link = TelegramAccountLink::query()->where('user_id', $request->user('web')->id)
                ->lockForUpdate()->findOrFail($request->integer('link_id'));
            if (!in_array($link->state, [TelegramLinkState::Pending, TelegramLinkState::AwaitingTelegram, TelegramLinkState::Ready, TelegramLinkState::Cancelled], true)) {
                throw ValidationException::withMessages(['telegram' => 'Объединение уже началось. Заверши его в профиле.']);
            }
            $link->update(['state' => TelegramLinkState::Cancelled]);
        });
        return redirect()->route('account.profile');
    }

    /**
     * Меняет session owner только после подтверждённого local merge.
     *
     * @param TelegramLinkRequest $request
     * @param TelegramAccountLink $link
     *
     * @return void
     */
    private function adoptSurvivor(TelegramLinkRequest $request, TelegramAccountLink $link): void
    {
        $link->refresh();
        if (in_array($link->state, [TelegramLinkState::LocalApplied, TelegramLinkState::Complete], true)
            && $this->guard->id() !== $link->user_id) {
            $owner = User::query()->findOrFail($link->user_id);
            $this->guard->login($owner);
            $request->session()->regenerate();
            $request->session()->put('password_hash_web', $owner->password);
            Inertia::clearHistory();
        }
    }
}
