#!/bin/bash
set -e

echo "===== Starting Application Entrypoint ====="

# Ждем доступности PostgreSQL
echo "Waiting for PostgreSQL (pgsql:5432)..."
wait-for-it pgsql:5432 -t 60 -- echo "✓ PostgreSQL is ready!"

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠ .env file not found, creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        php artisan key:generate
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
fi

# Опционально: кэшируем конфигурацию для продакшена
if [ "${APP_ENV}" = "production" ]; then
    echo "Optimizing for production..."
    php artisan optimize
fi

# Проверяем, нужно ли запускать миграции
if [ "${RUN_MIGRATIONS}" = "true" ] || [ "${APP_ENV}" = "production" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
    echo "✓ Migrations completed!"

    # Опционально: запускаем сидеры для разработки
    if [ "${APP_ENV}" = "local" ] && [ "${RUN_SEEDERS}" = "true" ]; then
        echo "Running seeders..."
        php artisan db:seed
        echo "✓ Seeders completed!"
    fi
else
    echo "Skipping migrations (RUN_MIGRATIONS not set)"
fi

# Опционально: запускаем NPM сборку
if [ "${RUN_NPM_BUILD}" = "true" ]; then
    echo "Running npm build..."
    npm ci
    npm run build
    echo "✓ NPM build completed!"
fi

echo "===== Starting Application ====="
exec "$@"
