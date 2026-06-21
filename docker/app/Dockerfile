FROM php:8.5-fpm-alpine

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
    curl-dev

# Установка NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Настройка NVM и установка Node.js 24.16.0
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=24.16.0

RUN . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default

# Добавление Node.js в PATH
ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"

# Проверка версий
RUN node -v && npm -v

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
