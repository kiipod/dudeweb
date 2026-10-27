ARG NODE_VERSION=24.22.1

FROM node:${NODE_VERSION}-alpine AS node

FROM php:8.5-fpm-alpine

ARG NODE_VERSION

ENV TZ=Europe/Moscow \
    NODE_VERSION=${NODE_VERSION} \
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
    libstdc++ \
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

# Alpine-compatible Node.js and npm, available to the deploy user.
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

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
        soap \
        sockets \
        curl

# Process supervisor
RUN apk add --no-cache supervisor

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
COPY ./docker/app/supervisord.conf /etc/supervisord.conf

# Select user
USER ${APP_USER}

RUN test "$(node --version)" = "v${NODE_VERSION}" && npm --version

EXPOSE 9000
STOPSIGNAL SIGTERM
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
