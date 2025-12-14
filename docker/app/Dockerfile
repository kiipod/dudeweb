FROM php:8.4-fpm-alpine

# ENV
ENV TZ=Europe/Moscow \
    NODE_VERSION=20.11.1 \
    COMPOSER_ALLOW_SUPERUSER=1

# Timezone
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo "${TZ}" > /etc/timezone

# System packages
RUN apk add --no-cache \
    bash \
    nano \
    make \
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

# Node.js 20 (official)
RUN apk add --no-cache xz \
    && curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz \
        | tar -xJ --strip-components=1 -C /usr/local \
    && node -v \
    && npm -v

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP config
COPY ./docker/app/config/ /usr/local/etc/php/conf.d/
RUN echo "date.timezone=${TZ}" > /usr/local/etc/php/conf.d/timezone.ini

# Workdir
WORKDIR /app

EXPOSE 9000

CMD ["php-fpm", "-F"]
