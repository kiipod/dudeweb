FROM nginx:1.29.4-alpine

COPY ./docker/nginx/conf.d /etc/nginx/conf.d

WORKDIR /app

HEALTHCHECK --interval=5s --timeout=3s --start-period=1s CMD curl --fail http://0.0.0.0/health || exit 1
