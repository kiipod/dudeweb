<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Model\ChatMessage
 *
 * @property int $id
 * @property string $type
 * @property string $text
 * @property array<array-key, mixed>|null $placeholders
 * @property string $status
 * @property Carbon|null $sent_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|ChatMessage newModelQuery()
 * @method static Builder<static>|ChatMessage newQuery()
 * @method static Builder<static>|ChatMessage query()
 * @method static Builder<static>|ChatMessage whereCreatedAt($value)
 * @method static Builder<static>|ChatMessage whereId($value)
 * @method static Builder<static>|ChatMessage wherePlaceholders($value)
 * @method static Builder<static>|ChatMessage whereSentAt($value)
 * @method static Builder<static>|ChatMessage whereStatus($value)
 * @method static Builder<static>|ChatMessage whereText($value)
 * @method static Builder<static>|ChatMessage whereType($value)
 * @method static Builder<static>|ChatMessage whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ChatMessage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'type',
        'text',
        'placeholders',
        'status',
        'sent_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'placeholders' => 'array',
        'sent_at' => 'datetime',
    ];

    /**
     * Скоуп для статуса "Активно"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function active(Builder $query): void
    {
        $query->where('status', '=', 'active');
    }

    /**
     * Скоуп для статуса "Неактивно"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function inactive(Builder $query): void
    {
        $query->where('status', '=', 'inactive');
    }

    /**
     * Скоуп для статуса "Черновик"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function draft(Builder $query): void
    {
        $query->where('status', '=', 'draft');
    }

    /**
     * Скоуп для статуса "Запланировано"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function planned(Builder $query): void
    {
        $query->where('status', '=', 'planned');
    }

    /**
     * Скоуп для типа "Добро пожаловать"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function welcome(Builder $query): void
    {
        $query->where('type', '=', 'welcome');
    }

    /**
     * Скоуп для типа "С возвращением"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function welcomeBack(Builder $query): void
    {
        $query->where('type', '=', 'welcome_back');
    }

    /**
     * Скоуп для типа "Сообщение для реферала"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function welcomeRef(Builder $query): void
    {
        $query->where('type', '=', 'welcome_ref');
    }

    /**
     * Скоуп для типа "Помощь"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function help(Builder $query): void
    {
        $query->where('type', '=', 'help');
    }

    /**
     * Скоуп для типа "Партнерская программа"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function partners(Builder $query): void
    {
        $query->where('type', '=', 'partners');
    }

    /**
     * Скоуп для типа "Профиль"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function profile(Builder $query): void
    {
        $query->where('type', '=', 'profile');
    }

    /**
     * Скоуп для типа "Сообщение"
     *
     * @param Builder $query
     * @return void
     */
    #[Scope]
    public function message(Builder $query): void
    {
        $query->where('type', '=', 'message');
    }
}
