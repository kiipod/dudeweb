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
    docker-php-ext-configure intl --enable-intl && \
    docker-php-ext-install -j$(nproc) \
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

# Очистка временных файлов
RUN docker-php-source delete && \
    rm -rf /tmp/* /var/cache/apk/*

# Установка Composer глобально
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Настройка рабочей директории
WORKDIR /app

# Копирование конфигурации PHP
COPY ./docker/app/config/ /usr/local/etc/php/conf.d/

# Установка часового пояса для PHP
RUN echo "date.timezone = Europe/Moscow" > /usr/local/etc/php/conf.d/timezone.ini
