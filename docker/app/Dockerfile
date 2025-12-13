FROM php:8.4-fpm-alpine

# Установка часового пояса
ENV TZ=Europe/Moscow
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo "${TZ}" > /etc/timezone

# Установка необходимых пакетов
RUN apk add --no-cache --update \
    bash \
    nano \
    make \
    gzip \
    tar \
    linux-headers \
    musl-dev \
    libc-dev \
    gcc \
    g++ \
    autoconf \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev \
    curl-dev \
    nodejs \
    npm \
    yarn

# Настройка и установка PHP расширений
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-configure intl --enable-intl

RUN docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pgsql \
    gd \
    intl \
    mbstring \
    zip \
    pcntl \
    exif \
    opcache \
    soap \
    sockets \
    curl

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Очистка кеша
RUN rm -rf /tmp/* /var/cache/apk/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Меняем UID/GID пользователя www-data на 1000
RUN apk add --no-cache shadow && \
    usermod -u 1000 www-data && \
    groupmod -g 1000 www-data

# Создание необходимых директорий Laravel и настройка прав
RUN mkdir -p /app/storage /app/bootstrap/cache \
    && chown -R www-data:www-data /app \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Создание директорий для PHP сессий и временных файлов
RUN mkdir -p /tmp/php_sessions /tmp/php_upload \
    && chown -R www-data:www-data /tmp/php_sessions /tmp/php_upload \
    && chmod -R 777 /tmp/php_sessions /tmp/php_upload

# Копирование конфигурации PHP (если есть)
COPY ./docker/app/config/ /usr/local/etc/php/conf.d/

# Установка часового пояса для PHP
RUN echo "date.timezone = Europe/Moscow" > /usr/local/etc/php/conf.d/timezone.ini

# Переключение на пользователя www-data
USER www-data
