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
RUN composer install
RUN npm install
RUN npm run build

# Очистка кеша
RUN rm -rf /tmp/* /var/cache/apk/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Добавление и настройка пользователя
ENV user=docker

# Создание пользователя и добавление его в группу www-data
RUN adduser -D -u 1000 ${user} \
    && addgroup ${user} www-data

# Установка прав для директории приложения
RUN chown -R ${user}:www-data /app

# Настройка временных каталогов с нужными правами
RUN chmod 777 -R /tmp && chmod o+t -R /tmp \
    && chmod 777 -R /var/log && chmod o+t -R /var/log \
    && chmod 777 -R /var/run && chmod o+t -R /var/run

# Копирование конфигурации PHP (если есть)
COPY ./docker/app/config/ /usr/local/etc/php/conf.d/

# Установка часового пояса для PHP
RUN echo "date.timezone = Europe/Moscow" > /usr/local/etc/php/conf.d/timezone.ini

# Переключение на созданного пользователя
USER ${user}
