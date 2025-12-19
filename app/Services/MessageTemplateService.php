<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ChatMessage;

class MessageTemplateService
{
    /**
     * Метод получает отформатированное сообщение по его типу
     *
     * @param string $type
     * @param array $data
     * @return string
     */
    public function getFormattedMessage(string $type, array $data = []): string
    {
        $template = ChatMessage::where('type', $type)
            ->active()
            ->first();

        return $this->replacePlaceholders($template->text, $data);
    }

    /**
     * Метод заменяет плейсхолдеры в тексте
     *
     * @param string $text
     * @param array $data
     * @return string
     */
    public function replacePlaceholders(string $text, array $data): string
    {
        foreach ($data as $key => $value) {
            $placeholder = '{' . $key . '}';
            if (str_contains($text, $placeholder)) {
                $text = str_replace($placeholder, $value, $text);
            }
        }

        return $text;
    }

    /**
     * Метод возвращает приветственное сообщение с учетом реферала
     *
     * @param array $userData
     * @param array|null $referrerData
     * @return string
     */
    public function getWelcomeMessage(array $userData, ?array $referrerData = null): string
    {
        $type = $referrerData ? 'welcome_ref' : 'welcome';

        $data = [
            'first_name' => $userData['first_name'] ?? $userData['name'] ?? 'друг',
        ];

        if ($referrerData) {
            $data['referrer_username'] = $referrerData['username'] ?? $referrerData['name'] ?? 'пользователя';
        }

        return $this->getFormattedMessage($type, $data);
    }
}
