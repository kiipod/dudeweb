<?php

declare(strict_types=1);

namespace App\Services\Account;

use Illuminate\Container\Attributes\Config;
use Throwable;

final readonly class ConnectionCatalogue
{
    /**
     * Принимает путь backend-копии общего app config, без пользовательских данных.
     *
     * @param string $path
     */
    public function __construct(#[Config('connection.catalogue_path')] private string $path) {}

    /**
     * Готовит пять платформ с безопасными ссылками и упорядоченными инструкциями.
     *
     * @param string|null $subscriptionUrl
     *
     * @return list<array<string, mixed>>
     */
    public function platforms(?string $subscriptionUrl = null): array
    {
        try {
            $source = is_file($this->path)
                ? json_decode(file_get_contents($this->path), true, flags: JSON_THROW_ON_ERROR)
                : [];
        } catch (Throwable) {
            $source = [];
        }

        return array_map(function (ConnectionPlatform $platform) use ($source, $subscriptionUrl): array {
            $apps = [];
            foreach ($source['platforms'][$platform->value]['apps'] ?? [] as $app) {
                $prepared = $this->app($app, $subscriptionUrl);
                if ($prepared !== null) {
                    $apps[] = $prepared;
                }
            }
            return ['id' => $platform->value, 'label' => $platform->label(), 'available' => $apps !== [], 'apps' => $apps];
        }, ConnectionPlatform::cases());
    }

    /**
     * Укладывает source blocks в три Pen шага, сохраняя все промежуточные указания.
     *
     * @param array<string, mixed> $app
     * @param string|null $subscriptionUrl
     *
     * @return array<string, mixed>|null
     */
    private function app(array $app, ?string $subscriptionUrl): ?array
    {
        $blocks = $app['blocks'] ?? [];
        if (!is_string($app['name'] ?? null) || trim($app['name']) === '' || count($blocks) < 3) {
            return null;
        }
        $steps = [
            ['title' => 'Установи приложение', 'description' => 'Скачай подходящее приложение для устройства.', 'content' => [], 'links' => []],
            ['title' => 'Добавь ссылку подключения', 'description' => 'Скопируй ссылку и добавь её в приложение.', 'content' => [], 'links' => []],
            ['title' => 'Активируй соединение', 'description' => 'Открой приложение и включи подключение.', 'content' => [], 'links' => []],
        ];
        foreach ($blocks as $index => $block) {
            $step = $index === 0 ? 0 : ($index === array_key_last($blocks) ? 2 : 1);
            if (is_string($block['description'] ?? null) && trim($block['description']) !== '') {
                $steps[$step]['content'][] = $block['description'];
            }
            foreach ($block['buttons'] ?? [] as $button) {
                $link = $this->link($button, $subscriptionUrl);
                if ($link !== null) {
                    $steps[$step]['links'][] = $link;
                }
            }
        }
        if ($steps[0]['links'] === [] || array_any($steps, fn(array $step): bool => $step['content'] === [])) {
            return null;
        }
        return ['name' => $app['name'], 'featured' => (bool) ($app['featured'] ?? false), 'steps' => $steps];
    }

    /**
     * Пропускает HTTPS downloads и только известные import schemes из source.
     *
     * @param array<string, mixed> $button
     * @param string|null $subscriptionUrl
     *
     * @return array{label: string, url: string, external: bool}|null
     */
    private function link(array $button, ?string $subscriptionUrl): ?array
    {
        $url = $button['url'] ?? null;
        if (!is_string($url) || !is_string($button['label'] ?? null) || trim($button['label']) === '') {
            return null;
        }
        if (($button['type'] ?? null) === 'external') {
            $parts = parse_url($url);
            if (
                filter_var($url, FILTER_VALIDATE_URL) !== false
                && ($parts['scheme'] ?? null) === 'https'
                && !isset($parts['user']) && !isset($parts['pass'])
                && !str_contains($url, '{{')
            ) {
                return ['label' => $button['label'], 'url' => $url, 'external' => true];
            }
        }
        if (
            ($button['type'] ?? null) === 'subscriptionLink'
            && $subscriptionUrl !== null
            && preg_match('~^(?:incy://add/|happ://add/|v2raytun://import/|flclashx://install-config\?url=)\{\{SUBSCRIPTION_LINK\}\}$~D', $url) === 1
        ) {
            $value = str_contains($url, '?url=') ? rawurlencode($subscriptionUrl) : $subscriptionUrl;
            return ['label' => $button['label'], 'url' => str_replace('{{SUBSCRIPTION_LINK}}', $value, $url), 'external' => false];
        }
        return null;
    }
}
