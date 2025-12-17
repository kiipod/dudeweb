CONTAINER_NAME = app
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_DEV = docker compose -f docker-compose-prod.yml
DOCKER_EXEC = docker exec -it $(CONTAINER_NAME)

#LARAVEL DEV
start:
	./vendor/bin/sail up
migrate:
	./vendor/bin/sail artisan migrate
seed:
	./vendor/bin/sail artisan db:seed
migrate-rollback:
	./vendor/bin/sail artisan migrate:rollback
clear:
	./vendor/bin/sail artisan optimize:clear
admin:
	./vendor/bin/sail artisan moonshine:user
new-bot:
	./vendor/bin/sail artisan telegraph:new-bot
webhook:
	./vendor/bin/sail artisan telegraph:set-webhook
bot-commands:
	./vendor/bin/sail artisan bot:register-commands

#LARAVEL PROD INSIDE DOCKER-IMAGE
p-migrate:
	$(DOCKER_EXEC) php artisan migrate --force
p-seed:
	$(DOCKER_EXEC) php artisan db:seed
p-cache:
	$(DOCKER_EXEC) php artisan optimize
p-clear:
	$(DOCKER_EXEC) php artisan optimize:clear
p-admin:
	$(DOCKER_EXEC) php artisan moonshine-rbac:user
p-new-bot:
	$(DOCKER_EXEC) php artisan telegraph:new-bot
p-webhook:
	$(DOCKER_EXEC) php artisan telegraph:set-webhook
p-bot-commands:
	$(DOCKER_EXEC) php artisan bot:register-commands
