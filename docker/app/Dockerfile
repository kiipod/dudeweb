FROM php:8.4-fpm-alpine

ENV TZ=Europe/Moscow \
    COMPOSER_ALLOW_SUPERUSER=1 \
    USER=www-data \
    UID=1000 \
    GID=1000

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
RUN set -eux; \
    existing_uid="$(getent passwd www-data | cut -d: -f3)"; \
    existing_gid="$(getent group www-data | cut -d: -f3)"; \
    if [ "$existing_gid" != "${GID}" ]; then \
        delgroup www-data; \
        addgroup -g ${GID} www-data; \
    fi; \
    if [ "$existing_uid" != "${UID}" ]; then \
        deluser www-data; \
        adduser -D -u ${UID} -G www-data www-data; \
    fi

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Эти каталоги будут volume — создаём их заранее
RUN mkdir -p storage bootstrap/cache \
    && chown -R ${USER}:${USER} /app

USER ${USER}

COPY ./docker/app/config/ /usr/local/etc/php/conf.d/
RUN echo "date.timezone=${TZ}" > /usr/local/etc/php/conf.d/timezone.ini

EXPOSE 9000
CMD ["php-fpm", "-F"]
