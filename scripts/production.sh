#!/bin/bash
cd backtalk-api
docker-compose down
docker-compose up -d --build
docker exec backtalk-api npm run migrate
rm .env