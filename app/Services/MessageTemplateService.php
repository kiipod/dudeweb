<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ChatMessage;
use Illuminate\Support\Facades\Log;

final class MessageTemplateService
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

        if (! $template) {
            Log::error("Message template [$type] not found");
        }

        return $this->replacePlaceholders($template->text, $data);
    }

    /**
     * Метод заменяет плейсхолдеры в тексте
     *
     * @param string $text
     * @param array $data
     * @return string
     */
    protected function replacePlaceholders(string $text, array $data): string
    {
        foreach ($data as $key => $value) {
            $text = str_replace('{' . $key . '}', (string) $value, $text);
        }

        return $text;
    }
}
