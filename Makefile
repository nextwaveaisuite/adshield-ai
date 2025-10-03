SHELL := /bin/bash

.PHONY: dev build start db-up db-down db-seed-local seed-supabase bootstrap vercel-deploy

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

db-up:
	docker compose up -d

db-down:
	docker compose down

db-seed-local:
	npm run db:seed:local

seed-supabase:
	npm run db:seed:supabase

bootstrap:
	curl -X POST $(NEXT_PUBLIC_BASE_URL)/api/bootstrap -H "x-admin-key: $(ADMIN_KEY)"

vercel-deploy:
	vercel --prod