CONTAINER_NAME = app
DOCKER_COMPOSE_START = docker compose -f docker-compose-prod.yml up -d
DOCKER_COMPOSE_DOWN = docker compose -f docker-compose-prod.yml down
DOCKER_EXEC = docker exec -it $(CONTAINER_NAME)

#LARAVEL DEV
dev-start:
	./vendor/bin/sail up
dev-migrate:
	./vendor/bin/sail artisan migrate
dev-seed:
	./vendor/bin/sail artisan db:seed
dev-migrate-rollback:
	./vendor/bin/sail artisan migrate:rollback
dev-clear:
	./vendor/bin/sail artisan optimize:clear
dev-cache:
	./vendor/bin/sail artisan optimize
dev-admin:
	./vendor/bin/sail artisan moonshine:user
dev-new-bot:
	./vendor/bin/sail artisan telegraph:new-bot
dev-webhook:
	./vendor/bin/sail artisan telegraph:set-webhook
dev-bot-commands:
	./vendor/bin/sail artisan bot:register-commands

#LARAVEL PROD INSIDE DOCKER-IMAGE
start:
	$(DOCKER_COMPOSE_START)
down:
	$(DOCKER_COMPOSE_DOWN)
migrate:
	$(DOCKER_EXEC) php artisan migrate --force
seed:
	$(DOCKER_EXEC) php artisan db:seed
cache:
	$(DOCKER_EXEC) php artisan optimize
clear:
	$(DOCKER_EXEC) php artisan optimize:clear
admin:
	$(DOCKER_EXEC) php artisan moonshine-rbac:user
new-bot:
	$(DOCKER_EXEC) php artisan telegraph:new-bot
webhook:
	$(DOCKER_EXEC) php artisan telegraph:set-webhook
bot-commands:
	$(DOCKER_EXEC) php artisan bot:register-commands
