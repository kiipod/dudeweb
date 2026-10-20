<section aria-labelledby="operator-support-history">
    <h2 id="operator-support-history">Переписка</h2>
    @if (session('support.saved'))
        <p role="status">Изменения сохранены.</p>
    @endif
    @if ($errors->any())
        <div role="alert">@foreach ($errors->all() as $error)<p>{{ $error }}</p>@endforeach</div>
    @endif
    <ol>
        @foreach ($messages as $message)
            <li>
                <article>
                    <h3>{{ $message->customer_id === null ? 'Поддержка' : 'Клиент' }}</h3>
                    {{-- MoonShine loads its own CSS bundle without application Tailwind utilities. --}}
                    <p style="white-space: pre-wrap; overflow-wrap: anywhere">{{ $message->body }}</p>
                    <time datetime="{{ $message->created_at->toIso8601String() }}">{{ $message->created_at->format('d.m.Y H:i:s') }}</time>
                </article>
            </li>
        @endforeach
    </ol>
    {{ $messages->links() }}
    @if ($isOpen)
        <form method="POST" action="{{ route('operator.support.reply', $ticket) }}">
            @csrf
            <input type="hidden" name="submission_id" value="{{ old('submission_id', $submissionId) }}">
            <label for="operator-support-body">Ответ клиенту</label>
            <textarea id="operator-support-body" name="body" rows="5" maxlength="{{ $bodyMax }}" required class="form-textarea">{{ old('body') }}</textarea>
            <button type="submit" class="btn btn-primary">Отправить ответ</button>
        </form>
    @else
        <p role="status">Обращение закрыто. Откройте его, чтобы ответить.</p>
    @endif
    <form method="POST" action="{{ route('operator.support.status', $ticket) }}">
        @csrf
        <input type="hidden" name="status" value="{{ $isOpen ? 'CLOSED' : 'OPEN' }}">
        <button type="submit" class="btn btn-secondary">{{ $isOpen ? 'Закрыть обращение' : 'Открыть обращение' }}</button>
    </form>
</section>
