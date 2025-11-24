<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use DefStudio\Telegraph\Database\Factories\TelegraphBotFactory;
use DefStudio\Telegraph\Models\TelegraphBot;
use DefStudio\Telegraph\Models\TelegraphChat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $token
 * @property string|null $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, TelegraphChat> $chats
 * @property-read int|null $chats_count
 * @method static TelegraphBotFactory factory($count = null, $state = [])
 * @method static Builder<static>|TelegramBot newModelQuery()
 * @method static Builder<static>|TelegramBot newQuery()
 * @method static Builder<static>|TelegramBot query()
 * @method static Builder<static>|TelegramBot whereCreatedAt($value)
 * @method static Builder<static>|TelegramBot whereId($value)
 * @method static Builder<static>|TelegramBot whereName($value)
 * @method static Builder<static>|TelegramBot whereToken($value)
 * @method static Builder<static>|TelegramBot whereUpdatedAt($value)
 * @mixin Eloquent
 */
class TelegramBot extends TelegraphBot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'telegraph_bots';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'token',
        'name',
    ];

    /**
     * Метод регистрирует команды бота
     *
     * @return void
     */
    public function registerBotCommands(): void
    {
        $this->registerCommands([
            'profile' => 'Мой профиль',
            'plans' => 'Тарифы',
            'partners' => 'Партнерская программа',
            'help' => 'Помощь',
        ])->send();
    }
}
