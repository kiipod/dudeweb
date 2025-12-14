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

# Очистка временных файлов после установки
RUN docker-php-source delete && \
    rm -rf /tmp/* /var/cache/apk/*

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Настройка рабочей директории
WORKDIR /app

# Добавление и настройка пользователя
ARG USER_ID=1000
ARG GROUP_ID=1000
ENV USER_NAME=docker

# Создание группы и пользователя если не существуют
RUN addgroup -g ${GROUP_ID} ${USER_NAME} || true && \
    adduser -D -u ${USER_ID} -G ${USER_NAME} ${USER_NAME} || true && \
    addgroup ${USER_NAME} www-data || true

# Создание необходимых каталогов и установка прав
RUN mkdir -p /app && \
    chown -R ${USER_NAME}:${USER_NAME} /app && \
    chmod 775 /app

# Копирование конфигурации PHP
COPY ./docker/app/config/ /usr/local/etc/php/conf.d/

# Установка часового пояса для PHP
RUN echo "date.timezone = Europe/Moscow" > /usr/local/etc/php/conf.d/timezone.ini

# Копирование файлов проекта
COPY --chown=${USER_NAME}:${USER_NAME} . /app/
COPY .env.prod.example .env

# Установка ключа для приложения
RUN php artisan key:generate

# Переключение на созданного пользователя
USER ${USER_NAME}

# Установка зависимостей
RUN composer install
RUN npm install
RUN npm run build
