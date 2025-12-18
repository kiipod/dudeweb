FROM php:8.4-fpm-alpine

ENV TZ=Europe/Moscow \
    COMPOSER_ALLOW_SUPERUSER=1 \
    APP_USER=deploy \
    APP_UID=1000 \
    APP_GID=1000

# Timezone
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo "${TZ}" > /etc/timezone

# System packages
RUN apk add --no-cache \
    bash \
    nano \
    git \
    curl \
    unzip \
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
    nodejs-current \
    npm

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl --enable-intl \
    && docker-php-ext-install -j$(nproc) \
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

# User
RUN addgroup -g ${APP_GID} ${APP_USER} \
    && adduser -D -u ${APP_UID} -G ${APP_USER} ${APP_USER}

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Work dir
WORKDIR /app
RUN chown -R ${APP_USER}:${APP_USER} /app

# Copy config
COPY ./docker/app/config/ /usr/local/etc/php/conf.d/
RUN echo "date.timezone=${TZ}" > /usr/local/etc/php/conf.d/timezone.ini

# Select user
USER ${APP_USER}

EXPOSE 9000
CMD ["php-fpm", "-F"]
