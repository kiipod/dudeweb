# Шаг 1 — Project Inventory

## Цель

Изучить структуру проекта, окружение, зависимости, архитектуру,
интеграции и существующие инструменты проверки.

На этом шаге production-код не изменять.

## Подготовка

- [ ] Прочитать AGENTS.md и инструкции проекта.
- [ ] Прочитать 00-overview.md.
- [ ] Проверить git status.
- [ ] Определить текущую ветку и незакоммиченные изменения.
- [ ] Создать docs/audit/ при отсутствии.
- [ ] Подготовить README.md и findings.md.
- [ ] Не перезаписывать существующие результаты аудита.

## Архитектура

- [ ] Определить framework и версии.
- [ ] Изучить composer.json и composer.lock.
- [ ] Изучить package.json и lockfile.
- [ ] Определить frontend framework.
- [ ] Определить используемую БД.
- [ ] Найти Controllers, Services, Actions, DTO, Models.
- [ ] Найти middleware, policies и guards.
- [ ] Найти API routes.
- [ ] Найти Telegram handlers.
- [ ] Найти Jobs, Commands, Scheduler и Queues.
- [ ] Определить архитектурные соглашения проекта.

## Интеграции

Проверить фактическое наличие и использование:

- [ ] YooKassa.
- [ ] Remnawave.
- [ ] Telegram Bot API.
- [ ] Других внешних сервисов.

Для каждой интеграции определить:

- расположение кода;
- используемый клиент;
- конфигурацию;
- обработку ошибок;
- тесты;
- точки вызова.

## Окружение

- [ ] Проверить Docker и docker-compose.
- [ ] Проверить .env.example.
- [ ] Проверить конфигурации PHP и веб-сервера.
- [ ] Проверить конфигурацию БД.
- [ ] Проверить сборку frontend.
- [ ] Проверить CI/CD.
- [ ] Проверить необходимые фоновые процессы.
- [ ] Проверить доступность локального запуска.

Не выводить значения секретов в отчёт.

## Тестирование

- [ ] Найти PHPUnit/Pest.
- [ ] Найти Vitest/Jest.
- [ ] Найти Playwright/Cypress.
- [ ] Найти PHPStan/Psalm.
- [ ] Найти Pint/PHP-CS-Fixer.
- [ ] Найти ESLint/Prettier.
- [ ] Найти команды запуска тестов.

Не устанавливать новые инструменты без необходимости.

## Анализ рисков

Выявить:

- устаревшие или неподдерживаемые зависимости;
- несовместимые версии;
- отсутствующие конфигурации;
- неполное тестовое окружение;
- критические архитектурные зависимости.

Подтверждённые проблемы внести в findings.md.

## Отчёт

Создать:

docs/audit/project-audit/project-inventory.md

Разделы:

1. Technology Stack
2. Project Structure
3. Backend Architecture
4. Frontend Architecture
5. External Integrations
6. Database
7. Infrastructure
8. Testing Tools
9. Environment Limitations
10. Findings References

## Проверка

- [ ] Стек определён.
- [ ] Архитектура описана.
- [ ] Интеграции перечислены.
- [ ] Тестовые инструменты найдены.
- [ ] Ограничения окружения зафиксированы.
- [ ] Findings обновлён.
- [ ] Production-код не изменён.

## Commit

docs: audit project architecture and environment
