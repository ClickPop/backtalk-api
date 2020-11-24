#!/bin/bash
cd backtalk-develop
docker-compose down
docker-compose up -d --build
docker exec backtalk-api-develop npm run migrate
rm .env