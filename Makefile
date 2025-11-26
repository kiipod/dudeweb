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
schedule:
	./vendor/bin/sail artisan schedule:list
queue:
	./vendor/bin/sail artisan queue:work
new-bot:
	./vendor/bin/sail artisan telegraph:new-bot
webhook:
	./vendor/bin/sail artisan telegraph:set-webhook
commands:
	./vendor/bin/sail artisan bot:register-commands

#LARAVEL PROD INSIDE DOCKER-IMAGE
prod-migrate:
	php artisan migrate
prod-seed:
	php artisan db:seed
prod-cache:
	php artisan config:cache
	php artisan event:cache
	php artisan route:cache
	php artisan view:cache
prod-clear:
	php artisan optimize:clear
prod-admin:
	php artisan moonshine-rbac:user
prod-schedule:
	php artisan schedule:list
prod-queue:
	php artisan queue:work
prod-new-bot:
	php artisan telegraph:new-bot
prod-webhook:
	php artisan telegraph:set-webhook
prod-commands:
	php artisan bot:register-commands
