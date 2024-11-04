app-bash:
	docker compose -f docker-compose.yaml exec app bash
start:
	docker compose --profile npm,db-migration -f docker-compose.yaml up
seed:
	docker compose --profile npm,db-migration,seed -f docker-compose.yaml up
